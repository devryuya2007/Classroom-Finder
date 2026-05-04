// Shared utilities for content script and background service worker

export const CHANNEL_TOKEN_KEY = "gcxMessageChannelToken";
export const CHANNEL_TOKEN_LENGTH = 64;

export const EMAIL_REGEX = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/i;

// Super simple hash function (djb2-style) for scope combinations
export function createSimpleHash(input) {
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

export function normalizeEmail(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const match = trimmed.match(EMAIL_REGEX);
  return match ? match[0].toLowerCase() : null;
}

export const gcxConsole = {
  log: () => { },
  info: () => { },
  debug: () => { },
  warn: (...args) => globalThis.console.warn(...args),
  error: (...args) => globalThis.console.error(...args),
};
