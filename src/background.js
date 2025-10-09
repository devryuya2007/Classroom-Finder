// Background service worker for Google OAuth + API fetch
// Uses chrome.identity.getAuthToken (no client_secret) and proxies API calls.

const CLASSROOM_BASE = "https://classroom.googleapis.com/v1";
// Restrict proxy fetches to Classroom API only (must match manifest host_permissions)
const ALLOWED_API_HOSTS = new Set(["classroom.googleapis.com"]);
const EMAIL_REGEX = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/i;
const CHANNEL_TOKEN_KEY = "gcxMessageChannelToken";
const CHANNEL_TOKEN_LENGTH = 64;

let channelTokenCache = null;
let channelTokenLoading = null;

function generateChannelToken() {
  const array = new Uint8Array(CHANNEL_TOKEN_LENGTH / 2);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

async function ensureChannelToken() {
  if (channelTokenCache) return channelTokenCache;
  if (channelTokenLoading) return channelTokenLoading;

  channelTokenLoading = (async () => {
    const token = await new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get([CHANNEL_TOKEN_KEY], (items) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
            return;
          }

          let existing = items?.[CHANNEL_TOKEN_KEY];
          if (
            typeof existing === "string" &&
            existing.length >= CHANNEL_TOKEN_LENGTH
          ) {
            resolve(existing);
            return;
          }

          const nextToken = generateChannelToken();
          chrome.storage.local.set({ [CHANNEL_TOKEN_KEY]: nextToken }, () => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
              return;
            }
            resolve(nextToken);
          });
        });
      } catch (err) {
        reject(err);
      }
    });

    channelTokenCache = token;
    return token;
  })();

  try {
    return await channelTokenLoading;
  } finally {
    channelTokenLoading = null;
  }
}

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local") return;
  if (Object.prototype.hasOwnProperty.call(changes, CHANNEL_TOKEN_KEY)) {
    const next = changes[CHANNEL_TOKEN_KEY]?.newValue;
    if (typeof next === "string" && next.length >= CHANNEL_TOKEN_LENGTH) {
      channelTokenCache = next;
    } else {
      channelTokenCache = null;
    }
  }
});

async function listIdentityAccounts() {
  if (!chrome.identity?.getAccounts) return [];
  return new Promise((resolve) => {
    try {
      chrome.identity.getAccounts((accounts) => {
        if (chrome.runtime.lastError) {
          console.warn(
            "[GCX] getAccounts failed",
            chrome.runtime.lastError.message
          );
          resolve([]);
          return;
        }
        if (Array.isArray(accounts)) {
          resolve(accounts);
        } else {
          resolve([]);
        }
      });
    } catch (err) {
      console.warn("[GCX] getAccounts threw", err);
      resolve([]);
    }
  });
}

async function getProfileInfoForAccount(account) {
  if (!account?.id)
    return { id: account?.id || null, email: account?.email || null };
  return new Promise((resolve) => {
    try {
      const details = { account: { id: account.id } };
      chrome.identity.getProfileUserInfo(details, (info) => {
        if (chrome.runtime.lastError) {
          resolve({ id: account.id, email: account.email || null });
          return;
        }
        resolve({
          id: info?.id || account.id,
          email: info?.email || account.email || null,
        });
      });
    } catch (err) {
      console.debug("[GCX] getProfileUserInfo failed", err);
      resolve({ id: account.id, email: account.email || null });
    }
  });
}

async function listIdentityAccountsWithProfiles() {
  const accounts = await listIdentityAccounts();
  const enriched = [];
  for (const account of accounts) {
    const profile = await getProfileInfoForAccount(account);
    enriched.push({
      id: profile.id || account.id || null,
      email: profile.email || account.email || null,
    });
  }
  return enriched;
}

function assertAllowedTarget(target) {
  let url;
  try {
    url = new URL(target);
  } catch (err) {
    throw new Error(`Invalid URL: ${String(target)}`);
  }
  if (url.protocol !== "https:") {
    throw new Error("Only HTTPS is allowed");
  }
  if (!ALLOWED_API_HOSTS.has(url.hostname)) {
    throw new Error(`Host not allowed: ${url.hostname}`);
  }
  return url.toString();
}

function normalizeEmail(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const match = trimmed.match(EMAIL_REGEX);
  return match ? match[0].toLowerCase() : null;
}

async function resolveAccountFromHint(accountHint) {
  const accounts = await listIdentityAccounts();
  if (!accounts.length) {
    console.warn("[GCX] ⚠️ No accounts available in Identity API");
    return { account: null, accounts };
  }

  console.log("[GCX] 🔍 Resolving account from hint:", accountHint);
  console.log(
    "[GCX] 📋 Available accounts:",
    accounts.map((a) => ({ id: a.id, email: a.email }))
  );

  if (accountHint && typeof accountHint === "object") {
    const { gaiaId, email, index } = accountHint;

    // GAIA IDで検索
    if (gaiaId) {
      console.log("[GCX] 🔎 Searching by gaiaId:", gaiaId);
      const matchById = accounts.find((acc) => acc?.id === gaiaId);
      if (matchById) {
        console.log("[GCX] ✓ Found account by gaiaId:", matchById.email);
        return { account: matchById, accounts };
      } else {
        console.warn("[GCX] ⚠️ No match found for gaiaId:", gaiaId);
      }
    } else {
      console.log("[GCX] ℹ️ No gaiaId provided in hint");
    }

    // メールアドレスで検索
    const normalizedEmail = normalizeEmail(email);
    if (normalizedEmail) {
      console.log("[GCX] 🔎 Searching by email:", normalizedEmail);
      const matchByEmail = accounts.find(
        (acc) => normalizeEmail(acc?.email) === normalizedEmail
      );
      if (matchByEmail) {
        console.log("[GCX] ✓ Found account by email:", matchByEmail.email);
        return { account: matchByEmail, accounts };
      } else {
        console.warn("[GCX] ⚠️ No match found for email:", normalizedEmail);
      }
    } else {
      console.log("[GCX] ℹ️ No email provided in hint");
    }

    // インデックスで検索
    if (typeof index === "number" && index >= 0 && index < accounts.length) {
      console.log(
        "[GCX] 🔎 Using account by index:",
        index,
        "->",
        accounts[index]?.email || accounts[index]?.id
      );
      return { account: accounts[index], accounts };
    } else {
      console.warn(
        "[GCX] ⚠️ Invalid index:",
        index,
        "accounts length:",
        accounts.length
      );
    }
  } else {
    console.warn("[GCX] ⚠️ accountHint is invalid:", typeof accountHint);
  }

  console.warn("[GCX] ❌ Could not resolve account from hint, using default");
  return { account: null, accounts };
}

let lastAccountId = null;
let lastAccountFingerprint = null;

// アカウント別のトークンを無効化
async function invalidateAccountToken(account) {
  if (!account?.id) return;
  try {
    await new Promise((resolve) => {
      chrome.identity.getAuthToken(
        { interactive: true, account: { id: account.id } },
        async (token) => {
          const runtimeError = chrome.runtime.lastError;
          if (runtimeError) {
            console.debug("[GCX] Could not get token to invalidate (expected)");
            resolve();
            return;
          }
          if (token) {
            console.log(
              "[GCX] 🗑️ Removing cached token for account:",
              account.email || account.id
            );
            await removeCachedToken(token);
          }
          resolve();
        }
      );
    });
  } catch (err) {
    console.debug("[GCX] invalidateAccountToken failed", err);
  }
}

// 全アカウントのトークンを無効化（アカウント切り替え時）
async function invalidateAllAccountTokens() {
  console.log("[GCX] 🗑️ Invalidating all account tokens...");
  const accounts = await listIdentityAccounts();
  for (const account of accounts) {
    await invalidateAccountToken(account);
  }
  console.log("[GCX] ✓ All account tokens invalidated");
}

async function getAuthToken({ interactive = false, accountHint } = {}) {
  // アカウント切り替えを検知
  if (accountHint?.fingerprint) {
    if (
      lastAccountFingerprint &&
      accountHint.fingerprint !== lastAccountFingerprint
    ) {
      console.log("[GCX] 🔄 Account switch detected in background!");
      console.log("[GCX] Previous fingerprint:", lastAccountFingerprint);
      console.log("[GCX] New fingerprint:", accountHint.fingerprint);

      // 全アカウントのトークンを個別に無効化
      await invalidateAllAccountTokens();

      // さらに全キャッシュをクリア
      await clearAllCachedTokens();

      lastAccountId = null;
      console.log("[GCX] ✓ Token invalidation completed");
    }
    lastAccountFingerprint = accountHint.fingerprint;
  }
  let accountParam;
  let resolvedAccount = null;

  if (accountHint) {
    const result = await resolveAccountFromHint(accountHint);
    resolvedAccount = result.account;
    if (resolvedAccount?.id) {
      accountParam = { id: resolvedAccount.id };
      console.log(
        "[GCX] 🎯 Using account for token:",
        resolvedAccount.email || resolvedAccount.id
      );

      // 新しいアカウントに切り替わった場合、そのアカウントのトークンも無効化
      if (resolvedAccount.id !== lastAccountId) {
        console.log("[GCX] 🔄 Account ID changed, invalidating old token");
        await invalidateAccountToken(resolvedAccount);
        lastAccountId = resolvedAccount.id;
      }
    } else {
      console.warn("[GCX] ⚠️ Could not resolve account, using default");
      console.warn("[GCX] 📋 Hint was:", JSON.stringify(accountHint, null, 2));
    }
  }

  return new Promise((resolve, reject) => {
    try {
      const details = { interactive };
      if (accountParam) {
        details.account = accountParam;
      }

      if (interactive) {
        console.log("[GCX] 🔓 Requesting OAuth token with INTERACTIVE mode");
        console.log("[GCX] Account:", resolvedAccount?.email || "default");
        console.log("[GCX] This should show the OAuth consent screen");
      }

      chrome.identity.getAuthToken(details, (token) => {
        if (chrome.runtime.lastError) {
          console.error(
            "[GCX] getAuthToken error:",
            chrome.runtime.lastError.message
          );
          return reject(new Error(chrome.runtime.lastError.message));
        }
        if (!token) {
          console.error("[GCX] No token returned");
          return reject(new Error("No token"));
        }
        if (resolvedAccount?.id) {
          lastAccountId = resolvedAccount.id;
        }

        if (interactive) {
          console.log(
            "[GCX] ✓ Successfully obtained token via interactive auth"
          );
        } else {
          console.log(
            "[GCX] Successfully obtained token for account:",
            resolvedAccount?.id || "default"
          );
        }

        resolve(token);
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function removeCachedToken(token) {
  return new Promise((resolve) => {
    try {
      chrome.identity.removeCachedAuthToken({ token }, () => resolve());
    } catch (_err) {
      resolve();
    }
  });
}

async function clearAllCachedTokens() {
  console.log("[GCX] 🧹 Starting to clear all cached tokens...");
  return new Promise((resolve) => {
    try {
      chrome.identity.clearAllCachedAuthTokens(() => {
        if (chrome.runtime.lastError) {
          console.warn(
            "[GCX] Failed to clear cached tokens",
            chrome.runtime.lastError.message
          );
        } else {
          console.log("[GCX] ✓ Cleared all cached OAuth tokens");
        }
        // トークンクリア後、確実に反映されるまで少し待つ
        setTimeout(() => {
          console.log("[GCX] ✓ Token cache clear operation completed");
          resolve();
        }, 500); // 0.5秒待機
      });
    } catch (err) {
      console.warn("[GCX] clearAllCachedAuthTokens threw", err);
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

async function googleFetch(request = {}, accountHint) {
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

  console.log("[GCX] 📡 API Request:", path || url);

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
    const token = await getAuthToken({ interactive: false, accountHint });
    const res = await fetch(target, {
      method: "GET",
      headers: buildHeadersWithAccount(token),
      // GET: no request body
      body: undefined,
    });

    if (res.status === 401 || res.status === 403) {
      console.warn("[GCX] Got 401/403, removing token and retrying");
      await removeCachedToken(token);
      if (interactiveOnRetry) {
        const token2 = await getAuthToken({ interactive: true, accountHint });
        const res2 = await fetch(target, {
          method: "GET",
          headers: buildHeadersWithAccount(token2),
          body: undefined,
        });
        return res2;
      }
    }
    return res;
  } catch (_err) {
    // Fallback: interactive fetch once
    const token = await getAuthToken({ interactive: true, accountHint });
    return fetch(target, {
      method: "GET",
      headers: buildHeadersWithAccount(token),
      body: undefined,
    });
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("═══════════════════════════════════════");
  console.log("[GCX] 🔔 MESSAGE LISTENER TRIGGERED!");
  console.log("═══════════════════════════════════════");
  console.log("[GCX] 📦 Message object:", msg);
  console.log("[GCX] 👤 Sender:", sender);
  console.log("═══════════════════════════════════════");

  // メッセージチャンネルを開いたままにする
  (async () => {
    try {
      console.log("[GCX] 📨 Message received:", msg?.type);

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
          console.error("[GCX] GET_CHANNEL_TOKEN error:", error);
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
        console.error("[GCX] Channel token unavailable", error);
        sendResponse({
          ok: false,
          error: "Channel token unavailable",
        });
        return;
      }

      if (msg.channelToken !== channelToken) {
        console.warn("[GCX] Rejected message with invalid channel token");
        sendResponse({ ok: false, error: "Invalid channel token" });
        return;
      }

      // Ping handler to wake up Service Worker
      if (msg.type === "PING") {
        console.log("🏓🏓🏓 PING RECEIVED! 🏓🏓🏓");
        console.log("[GCX] Responding with pong...");
        sendResponse({
          ok: true,
          pong: true,
          extensionName: "Classroom-Finder",
          extensionId: chrome.runtime.id,
          timestamp: Date.now(),
        });
        console.log("✅ PING response sent!");
        return;
      }

      // Clear all cached tokens handler
      if (msg.type === "GCX_CLEAR_TOKENS") {
        console.log("[GCX] 🧹 Clearing all cached tokens...");
        try {
          await clearAllCachedTokens();
          sendResponse({ ok: true });
        } catch (error) {
          console.error("[GCX] CLEAR_TOKENS error:", error);
          sendResponse({
            ok: false,
            error: String((error && error.message) || error),
          });
        }
        return;
      }

      if (msg.type === "GCX_GOOGLE_GET_TOKEN") {
        console.log(
          "[GCX] 🔐 GET_TOKEN request, interactive:",
          !!msg.interactive
        );
        try {
          const token = await getAuthToken({
            interactive: !!msg.interactive,
            accountHint: msg.accountHint,
          });
          console.log("[GCX] ✓ Token obtained, length:", token?.length || 0);
          sendResponse({ ok: true, token });
        } catch (error) {
          console.error("[GCX] GET_TOKEN error:", error);
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
          console.error("[GCX] IDENTITY_LIST error:", error);
          sendResponse({
            ok: false,
            error: String((error && error.message) || error),
          });
        }
        // return を削除
      } else if (msg.type === "GCX_GOOGLE_FETCH") {
        try {
          console.log("[GCX] 📥 Processing GOOGLE_FETCH request");
          const res = await googleFetch(msg.request || {}, msg.accountHint);
          const ct = res.headers.get("content-type") || "";
          let data = null;

          if (ct.includes("application/json")) {
            data = await res.json();
          } else {
            data = await res.text();
          }

          console.log("[GCX] ✓ GOOGLE_FETCH completed, status:", res.status);
          sendResponse({ ok: res.ok, status: res.status, data });
        } catch (error) {
          console.error("[GCX] GOOGLE_FETCH error:", error);
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
      console.error("[GCX] background message handler error", error);
      sendResponse({
        ok: false,
        error: String((error && error.message) || error),
      });
    }
  })();

  return true; // keep the message channel open for async response
});

// Optional: simple ping to ensure SW is alive in dev
console.log("═══════════════════════════════════════");
console.log("🚀🚀🚀 SERVICE WORKER STARTED! 🚀🚀🚀");
console.log("═══════════════════════════════════════");
console.log("[GCX] background service worker loaded");
console.log("[GCX] Extension ID:", chrome.runtime.id);
console.log(
  "[GCX] Required OAuth Redirect URI:",
  `https://${chrome.runtime.id}.chromiumapp.org/`
);
console.log("═══════════════════════════════════════");

// 起動時にトークンをクリア（非同期）
(async () => {
  await clearAllCachedTokens();
  console.log("[GCX] Ready for OAuth authentication");
})();
