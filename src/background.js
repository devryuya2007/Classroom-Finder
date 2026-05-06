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
import { deriveSessionKey } from "./modules/background/utils.js";
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
      const sessionKey = deriveSessionKey(sender, msg.accountHint);
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
  },

  async GCX_IDENTITY_LIST(msg, sender, sendResponse) {
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
  },

  async GCX_GOOGLE_FETCH(msg, sender, sendResponse) {
    try {
      gcxConsole.log("[GCX] 📥 Processing GOOGLE_FETCH request");
      const sessionKey = deriveSessionKey(sender, msg.accountHint);

      // Create a bound getAuthTokenSingleFlight for this fetch
      const boundGetAuthToken = (options) =>
        getAuthTokenSingleFlight(
          authInFlightStore,
          tokenCache,
          sessionStateStore,
          CLASSROOM_BASE,
          ALLOWED_API_HOSTS,
          OAUTH_SCOPE_HASH,
          options
        );

      const { response, tokenInfo } = await googleFetch(
        CLASSROOM_BASE,
        ALLOWED_API_HOSTS,
        OAUTH_SCOPE_HASH,
        tokenCache,
        boundGetAuthToken,
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
  },
};

// Setup message listener
setupMessageListener(messageHandlers);

// Initialization and logging
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
gcxConsole.log("[GCX] Ready for OAuth authentication");
