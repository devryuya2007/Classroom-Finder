// Background service worker for Google OAuth + API fetch
// Uses chrome.identity.getAuthToken (no client_secret) and proxies API calls.

import { gcxConsole, createSimpleHash } from "./modules/shared/utils.js";
import { CLASSROOM_BASE, ALLOWED_API_HOSTS, getOAuthConfig } from "./modules/background/constants.js";
import { ensureChannelToken, setupChannelTokenListener } from "./modules/background/channel.js";
import { setupMessageListener } from "./modules/background/message-handler.js";
import {
  getAuthTokenSingleFlight,
  invalidateAllAccountTokens,
  invalidateAccountToken,
} from "./modules/background/auth.js";
import { clearAllCachedTokens } from "./modules/background/token-manager.js";
import { listIdentityAccountsWithProfiles } from "./modules/background/account.js";
import { googleFetch } from "./modules/background/api-proxy.js";

// OAuth configuration from manifest
const manifest = chrome.runtime.getManifest();
const OAUTH2_CLIENT_ID = manifest?.oauth2?.client_id || null;
const OAUTH2_SCOPES = Array.isArray(manifest?.oauth2?.scopes)
  ? [...manifest.oauth2.scopes]
  : [];
const OAUTH_SCOPE_HASH = (() => {
  const sorted = [...OAUTH2_SCOPES].sort();
  return createSimpleHash(sorted.join(" ") || "default-scope");
})();

// Global state management
const tokenCache = new Map();
const sessionStateStore = new Map();
const authInFlightStore = new Map();
let channelTokenCache = null;

// Setup channel token listener for content script communication
setupChannelTokenListener((token) => {
  channelTokenCache = token;
});

// Message handlers
const messageHandlers = {
  async GCX_CLEAR_TOKENS(msg, sender, sendResponse) {
    gcxConsole.log("[GCX] 🧹 Clearing all cached tokens...");
    try {
      await clearAllCachedTokens(tokenCache, sessionStateStore);
      sendResponse({ ok: true });
    } catch (error) {
      gcxConsole.error("[GCX] CLEAR_TOKENS error:", error);
      sendResponse({
        ok: false,
        error: String((error && error.message) || error),
      });
    }
  },

  async GCX_GOOGLE_GET_TOKEN(msg, sender, sendResponse) {
    gcxConsole.log("[GCX] 🔐 GET_TOKEN request, interactive:", !!msg.interactive);
    try {
      const sessionKey = require("./modules/background/utils.js").deriveSessionKey(sender, msg.accountHint);
      const tokenRecord = await getAuthTokenSingleFlight(
        authInFlightStore,
        tokenCache,
        sessionStateStore,
        CLASSROOM_BASE,
        ALLOWED_API_HOSTS,
        OAUTH_SCOPE_HASH,
        {
          interactive: !!msg.interactive,
          accountHint: msg.accountHint,
          sessionKey,
        }
      );
      gcxConsole.log(
        "[GCX] ✓ Token obtained, length:",
        tokenRecord?.token?.length || 0
      );
      sendResponse({
        ok: true,
        token: tokenRecord.token,
        account: tokenRecord.account,
      });
    } catch (error) {
      gcxConsole.error("[GCX] GET_TOKEN error:", error);
      sendResponse({
        ok: false,
        error: String((error && error.message) || error),
      });
    }
  });
  authInFlightStore.set(key, task);
  return task;
}

async function clearAllCachedTokens() {
  gcxConsole.log("[GCX] 🧹 Starting to clear all cached tokens...");
  tokenCache.clear();
  for (const key of sessionStateStore.keys()) {
    resetSessionState(key);
  }
  return new Promise((resolve) => {
    try {
      chrome.identity.clearAllCachedAuthTokens(() => {
        if (chrome.runtime.lastError) {
          gcxConsole.warn(
            "[GCX] Failed to clear cached tokens",
            chrome.runtime.lastError.message
          );
        } else {
          gcxConsole.log("[GCX] ✓ Cleared all cached OAuth tokens");
        }
        // トークンクリア後、確実に反映されるまで少し待つ
        setTimeout(() => {
          gcxConsole.log("[GCX] ✓ Token cache clear operation completed");
          resolve();
        }, 500); // 0.5秒待機
      });
    } catch (err) {
      gcxConsole.warn("[GCX] clearAllCachedAuthTokens threw", err);
      resolve();
    }
  });
}

function buildUrl(base, pathOrUrl, params) {
  // Accept absolute URL or path
  const isAbsolute = /^https?:\/\//i.test(pathOrUrl);
  const url = new URL(
    isAbsolute
      ? pathOrUrl
      : base.replace(/\/$/, "") + "/" + pathOrUrl.replace(/^\//, "")
  );
  if (params && typeof params === "object") {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

async function googleFetch(request = {}, accountHint, { sessionKey } = {}) {
  const {
    url,
    path,
    params,
    method = "GET",
    headers = {},
    body,
    base = CLASSROOM_BASE,
    interactiveOnRetry = true,
  } = request;

  gcxConsole.log("[GCX] 📡 API Request:", path || url);

  // Build and validate target URL strictly for Classroom API only
  const rawTarget = url || buildUrl(base, path || "", params);
  const target = assertAllowedTarget(rawTarget);

  // Only allow safe HTTP method
  const methodUpper = String(method || "GET").toUpperCase();
  if (methodUpper !== "GET") {
    throw new Error(`Method not allowed: ${methodUpper}`);
  }

  function buildHeadersWithAccount(tokenValue) {
    const computedHeaders = {
      ...(headers || {}),
      Authorization: `Bearer ${tokenValue}`,
    };
    if (accountHint?.fingerprint) {
      computedHeaders["X-GCX-Account-Fingerprint"] =
        String(accountHint.fingerprint).slice(0, 64);
    }
    if (accountHint?.email) {
      computedHeaders["X-GCX-Account-Email"] = String(
        normalizeEmail(accountHint.email) || accountHint.email
      );
    }
    if (accountHint?.accountKey) {
      computedHeaders["X-GCX-Account-Key"] = String(
        accountHint.accountKey
      ).slice(0, 128);
    }
    return computedHeaders;
  }

  // Try silent first, then one interactive retry if unauthorized
  try {
    let tokenRecord = await getAuthTokenSingleFlight({
      interactive: false,
      accountHint,
      sessionKey,
    });
    let res = await fetch(target, {
      method: "GET",
      headers: buildHeadersWithAccount(tokenRecord.token),
      // GET: no request body
      body: undefined,
    });

    if (res.status === 401 || res.status === 403) {
      gcxConsole.warn("[GCX] Got 401/403, removing token and retrying");
      await removeCachedToken(tokenRecord.token, { revoke: true });
      if (interactiveOnRetry) {
        tokenRecord = await getAuthTokenSingleFlight({
          interactive: true,
          accountHint,
          sessionKey,
        });
        res = await fetch(target, {
          method: "GET",
          headers: buildHeadersWithAccount(tokenRecord.token),
          body: undefined,
        });
      }
    }
    return { response: res, tokenInfo: tokenRecord };
  } catch (_err) {
    // Fallback: interactive fetch once
    const tokenRecord = await getAuthTokenSingleFlight({
      interactive: true,
      accountHint,
      sessionKey,
    });
    const response = await fetch(target, {
      method: "GET",
      headers: buildHeadersWithAccount(tokenRecord.token),
      body: undefined,
    });
    return { response, tokenInfo: tokenRecord };
  }
}

// タブ ID / frame ID / accountKey を組み合わせて「セッションキー」を作る。
// これで同じ拡張でもタブごとに別セッション扱いになる。
function deriveSessionKey(sender, accountHint) {
  const tabId = typeof sender?.tab?.id === "number" ? sender.tab.id : null;
  const frameId = typeof sender?.frameId === "number" ? sender.frameId : null;
  const accountKey =
    accountHint?.accountKey || accountHint?.fingerprint || "anon";
  const tabPart = tabId !== null ? `tab${tabId}` : "bg";
  const framePart = frameId !== null ? `-frame${frameId}` : "";
  return `${tabPart}${framePart}:${accountKey}`;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  gcxConsole.log("═══════════════════════════════════════");
  gcxConsole.log("[GCX] 🔔 MESSAGE LISTENER TRIGGERED!");
  gcxConsole.log("═══════════════════════════════════════");
  gcxConsole.log("[GCX] 📦 Message object:", msg);
  gcxConsole.log("[GCX] 👤 Sender:", sender);
  gcxConsole.log("═══════════════════════════════════════");

  // メッセージチャンネルを開いたままにする
  (async () => {
    try {
      gcxConsole.log("[GCX] 📨 Message received:", msg?.type);

      if (!msg || typeof msg !== "object") {
        sendResponse({ ok: false, error: "Invalid message format" });
        return;
      }

      // Only accept messages from our own extension
      if (sender && sender.id && sender.id !== chrome.runtime.id) {
        sendResponse({ ok: false, error: "Invalid sender" });
        return;
      }

      if (msg.type === "GCX_GET_CHANNEL_TOKEN") {
        try {
          const token = await ensureChannelToken();
          sendResponse({
            ok: true,
            channelToken: token,
            extensionId: chrome.runtime.id,
          });
        } catch (error) {
          gcxConsole.error("[GCX] GET_CHANNEL_TOKEN error:", error);
          sendResponse({
            ok: false,
            error: String((error && error.message) || error),
          });
        }
        return;
      }

      let channelToken;
      try {
        channelToken = await ensureChannelToken();
      } catch (error) {
        gcxConsole.error("[GCX] Channel token unavailable", error);
        sendResponse({
          ok: false,
          error: "Channel token unavailable",
        });
        return;
      }

      if (msg.channelToken !== channelToken) {
        gcxConsole.warn("[GCX] Rejected message with invalid channel token");
        sendResponse({ ok: false, error: "Invalid channel token" });
        return;
      }

      // Ping handler to wake up Service Worker
      if (msg.type === "PING") {
        gcxConsole.log("🏓🏓🏓 PING RECEIVED! 🏓🏓🏓");
        gcxConsole.log("[GCX] Responding with pong...");
        sendResponse({
          ok: true,
          pong: true,
          extensionName: "Classroom-Finder",
          extensionId: chrome.runtime.id,
          timestamp: Date.now(),
        });
        gcxConsole.log("✅ PING response sent!");
        return;
      }

      // Clear all cached tokens handler
      if (msg.type === "GCX_CLEAR_TOKENS") {
        gcxConsole.log("[GCX] 🧹 Clearing all cached tokens...");
        try {
          await clearAllCachedTokens();
          sendResponse({ ok: true });
        } catch (error) {
          gcxConsole.error("[GCX] CLEAR_TOKENS error:", error);
          sendResponse({
            ok: false,
            error: String((error && error.message) || error),
          });
        }
        return;
      }

      if (msg.type === "GCX_GOOGLE_GET_TOKEN") {
        gcxConsole.log(
          "[GCX] 🔐 GET_TOKEN request, interactive:",
          !!msg.interactive
        );
        try {
          const sessionKey = deriveSessionKey(sender, msg.accountHint);
          const tokenRecord = await getAuthTokenSingleFlight({
            interactive: !!msg.interactive,
            accountHint: msg.accountHint,
            sessionKey,
          });
          gcxConsole.log(
            "[GCX] ✓ Token obtained, length:",
            tokenRecord?.token?.length || 0
          );
          sendResponse({
            ok: true,
            token: tokenRecord.token,
            account: tokenRecord.account,
          });
        } catch (error) {
          gcxConsole.error("[GCX] GET_TOKEN error:", error);
          sendResponse({
            ok: false,
            error: String((error && error.message) || error),
          });
        }
        // return を削除（sendResponse 後に async 関数が終了するのを防ぐ）
      } else if (msg.type === "GCX_IDENTITY_LIST") {
        try {
          const accounts = await listIdentityAccountsWithProfiles();
          sendResponse({ ok: true, accounts });
        } catch (error) {
          gcxConsole.error("[GCX] IDENTITY_LIST error:", error);
          sendResponse({
            ok: false,
            error: String((error && error.message) || error),
          });
        }
        // return を削除
      } else if (msg.type === "GCX_GOOGLE_FETCH") {
        try {
          gcxConsole.log("[GCX] 📥 Processing GOOGLE_FETCH request");
          const sessionKey = deriveSessionKey(sender, msg.accountHint);
          const { response, tokenInfo } = await googleFetch(
            msg.request || {},
            msg.accountHint,
            { sessionKey }
          );
          const ct = response.headers.get("content-type") || "";
          let data = null;

          if (ct.includes("application/json")) {
            data = await response.json();
          } else {
            data = await response.text();
          }

          gcxConsole.log(
            "[GCX] ✓ GOOGLE_FETCH completed, status:",
            response.status
          );
          sendResponse({
            ok: response.ok,
            status: response.status,
            data,
            account: tokenInfo?.account || null,
          });
        } catch (error) {
          gcxConsole.error("[GCX] GOOGLE_FETCH error:", error);
          sendResponse({
            ok: false,
            error: String((error && error.message) || error),
          });
        }
        // return を削除
      } else {
        // Unknown message type
        sendResponse({ ok: false, error: "Unknown message type" });
      }
    } catch (error) {
      gcxConsole.error("[GCX] background message handler error", error);
      sendResponse({
        ok: false,
        error: String((error && error.message) || error),
      });
    }
  })();

  return true; // keep the message channel open for async response
});

// Optional: simple ping to ensure SW is alive in dev
gcxConsole.log("═══════════════════════════════════════");
gcxConsole.log("🚀🚀🚀 SERVICE WORKER STARTED! 🚀🚀🚀");
gcxConsole.log("═══════════════════════════════════════");
gcxConsole.log("[GCX] background service worker loaded");
gcxConsole.log("[GCX] Extension ID:", chrome.runtime.id);
gcxConsole.log(
  "[GCX] Generated OAuth Redirect URI:",
  chrome.identity.getRedirectURL()
);
gcxConsole.log("═══════════════════════════════════════");

// 起動時にトークンはクリアしない（不要な再認証を防ぐ）
gcxConsole.log("[GCX] Ready for OAuth authentication");
