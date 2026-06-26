import nodeTest from "node:test";
import assert from "node:assert/strict";
import { resolveAccountFromHint } from "../src/modules/background/auth.js";

const test = globalThis.test ?? nodeTest;

function setupChromeAccounts(accounts) {
  const previousChrome = globalThis.chrome;
  globalThis.chrome = {
    runtime: {
      lastError: null,
    },
    identity: {
      getAccounts(callback) {
        callback(accounts);
      },
    },
  };
  return () => {
    globalThis.chrome = previousChrome;
  };
}

test("backgroundはGAIAとemailが食い違う場合にemailを優先してアカウント解決する", async () => {
  const restore = setupChromeAccounts([
    { id: "old-gaia", email: "old@example.com" },
    { id: "current-gaia", email: "current@example.com" },
  ]);

  try {
    const result = await resolveAccountFromHint({
      gaiaId: "old-gaia",
      email: "current@example.com",
      index: 0,
    });

    assert.deepEqual(result.account, {
      id: "current-gaia",
      email: "current@example.com",
    });
  } finally {
    restore();
  }
});
