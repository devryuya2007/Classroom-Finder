// Topbar UI component for search interface

import { gcxConsole } from "../../shared/utils.js";
import {
  TOPBAR_WRAP,
  TOPBAR_INPUT,
  TOPBAR_ID,
  EXPANDED_CLASS,
  REFRESH_BUTTON_SELECTOR,
  REFRESH_ERROR_CLASS,
  REFRESH_ERROR_DURATION_MS,
  SVG_NS,
  ICON_PATH_DATA,
  RELOAD_ICON_PATH_DATA,
  ERROR_ICON_PATHS,
  ERROR_ICON_COLOR,
  PLACEHOLDER_DEFAULT,
  STYLE_ID,
  STYLE_PATH,
} from "../constants.js";
import { getExtensionURL } from "../utils.js";

export let topbarInput = null;
let refreshErrorTimerId = null;

export function ensureStyles() {
  try {
    const href = getExtensionURL(STYLE_PATH);
    const existing = document.getElementById(STYLE_ID);
    if (existing) {
      const current =
        existing instanceof HTMLLinkElement
          ? existing.getAttribute("href")
          : existing instanceof HTMLStyleElement
            ? existing.dataset.origin
            : null;
      if (current === href) return;
      existing.remove();
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.dataset.origin = href;
    style.textContent = "/* [GCX] topbar styles loading... */";
    document.head.appendChild(style);

    fetch(href)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.text();
      })
      .then((css) => {
        style.textContent = css;
      })
      .catch((error) => {
        gcxConsole.debug(
          "[GCX] Stylesheet load failed (non-critical):",
          error.message || error
        );
      });
  } catch (error) {
    gcxConsole.debug(
      "[GCX] Cannot load styles (non-critical), UI will still work"
    );
  }
}

export function setTopbarPlaceholder(text) {
  if (!topbarInput) {
    topbarInput = document.querySelector(`.${TOPBAR_INPUT}`);
  }
  if (topbarInput) {
    topbarInput.placeholder = text;
    if (text === "同期に失敗しました") {
      topbarInput.classList.add("is-error");
    } else {
      topbarInput.classList.remove("is-error");
    }
  }
}

function getRefreshButton() {
  return document.querySelector(REFRESH_BUTTON_SELECTOR);
}

function flashRefreshError(error, resolveRefreshErrorPlaceholder) {
  const button = getRefreshButton();
  if (!button) return;
  button.classList.add(REFRESH_ERROR_CLASS);
  setTopbarPlaceholder(resolveRefreshErrorPlaceholder(error));
  if (refreshErrorTimerId) {
    clearTimeout(refreshErrorTimerId);
  }
  refreshErrorTimerId = window.setTimeout(() => {
    button.classList.remove(REFRESH_ERROR_CLASS);
    refreshErrorTimerId = null;
    setTopbarPlaceholder(PLACEHOLDER_DEFAULT);
  }, REFRESH_ERROR_DURATION_MS);
}

function ensureSVG() {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.classList.add("icon-svg");
  svg.setAttribute("viewBox", "0 0 512 512");
  svg.setAttribute("width", "18");
  svg.setAttribute("height", "18");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("aria-hidden", "true");

  ICON_PATH_DATA.forEach((d) => {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", "currentColor");
    svg.appendChild(path);
  });

  return svg;
}

function ensureReloadSVG() {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.classList.add("icon-svg", "reload-icon");
  svg.setAttribute("viewBox", "0 0 512 512");
  svg.setAttribute("width", "18");
  svg.setAttribute("height", "18");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", RELOAD_ICON_PATH_DATA);
  path.setAttribute("fill", "currentColor");
  svg.appendChild(path);
  return svg;
}

function ensureErrorSVG() {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.classList.add("error-icon-svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "18");
  svg.setAttribute("height", "18");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("aria-hidden", "true");
  ERROR_ICON_PATHS.forEach((d) => {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", ERROR_ICON_COLOR);
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.appendChild(path);
  });
  return svg;
}

function ensureSuggestionsStructure(container) {
  if (!container) return null;
  let wrap = container.querySelector(".suggestions-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.classList.add("suggestions-wrap");
    container.appendChild(wrap);
  }
  let list = wrap.querySelector("ul");
  if (!list) {
    list = document.createElement("ul");
    list.classList.add("suggestions-ul");
    wrap.appendChild(list);
  }
  return list;
}

function clearSuggestions(container) {
  if (!container) return;
  container.classList.remove("has-results");
  const list = container.querySelector(".suggestions-ul");
  if (list) {
    list.replaceChildren();
  }
}

export class TopbarFocusController {
  constructor(wrapElement, inputElement, suggestionsElement) {
    this.wrap = wrapElement;
    this.input = inputElement;
    this.suggestions = suggestionsElement;
  }

  open() {
    this.wrap.classList.add(EXPANDED_CLASS);
  }

  close(options = {}) {
    this.wrap.classList.remove(EXPANDED_CLASS);
    clearSuggestions(this.suggestions);
    if (options.blur && this.input === document.activeElement) {
      this.input.blur();
    }
  }

  handleFocusOut(event) {
    const nextTarget = event.relatedTarget;
    if (nextTarget && this.wrap.contains(nextTarget)) {
      return;
    }

    const active = document.activeElement;
    if (active && this.wrap.contains(active)) {
      return;
    }

    this.close();
  }
}

export function createTopbar(handlers) {
  const wrap = document.createElement("div");
  wrap.classList.add(TOPBAR_WRAP);
  wrap.setAttribute("role", "search");
  wrap.setAttribute("aria-label", "クイック検索");
  const icon = ensureSVG();

  const field = document.createElement("div");
  field.classList.add("svg-input-wrap");

  const input = document.createElement("input");
  input.type = "search";
  input.classList.add(TOPBAR_INPUT);
  input.placeholder = PLACEHOLDER_DEFAULT;
  input.setAttribute("role", "searchbox");
  input.autocapitalize = "off";
  input.autocomplete = "off";
  input.spellcheck = false;
  topbarInput = input;

  const stop = (e) => e.stopPropagation();
  [
    "click",
    "mousedown",
    "mouseup",
    "pointerdown",
    "pointerup",
    "touchstart",
    "touchend",
    "touchmove",
    "keydown",
    "keypress",
    "keyup",
  ].forEach((t) => input.addEventListener(t, stop, { passive: true }));

  const suggestions = document.createElement("div");
  suggestions.classList.add("gcx-suggestions");
  suggestions.setAttribute("aria-live", "polite");
  ensureSuggestionsStructure(suggestions);

  const focusController = new TopbarFocusController(wrap, input, suggestions);
  input.addEventListener("focus", () => {
    focusController.open();

    const value = input.value.trim();
    if (value && handlers.onInputFocus) {
      handlers.onInputFocus(value);
    }
  });
  wrap.addEventListener(
    "focusout",
    (event) => {
      focusController.handleFocusOut(event);
    },
    true
  );
  input.addEventListener("input", (e) => {
    if (handlers.onSearchInput) {
      handlers.onSearchInput(e);
    }
  });

  const handleOutsidePointerDown = (event) => {
    if (!wrap.contains(event.target)) {
      focusController.close({ blur: true });
    }
  };
  document.addEventListener("pointerdown", handleOutsidePointerDown, true);

  field.appendChild(icon);
  field.appendChild(input);
  field.appendChild(suggestions);
  wrap.appendChild(field);

  const refreshBtn = document.createElement("button");
  refreshBtn.type = "button";
  refreshBtn.classList.add("gcx-refresh-btn");
  refreshBtn.title = "新規投稿を同期";
  refreshBtn.setAttribute("aria-label", "更新");
  refreshBtn.prepend(ensureReloadSVG());
  const errorTag = document.createElement("span");
  errorTag.classList.add("error-tag");
  errorTag.appendChild(ensureErrorSVG());
  errorTag.setAttribute("aria-hidden", "true");
  refreshBtn.append(errorTag);
  [
    "click",
    "mousedown",
    "mouseup",
    "pointerdown",
    "pointerup",
    "touchstart",
    "touchend",
    "keydown",
    "keyup",
  ].forEach((t) => refreshBtn.addEventListener(t, stop, { passive: true }));

  refreshBtn.addEventListener("click", async () => {
    if (handlers.onRefreshClick) {
      try {
        refreshBtn.disabled = true;
        refreshBtn.classList.add("is-spinning");
        await handlers.onRefreshClick();
      } catch (err) {
        gcxConsole.warn("[GCX] manual sync failed", err);
        if (handlers.flashRefreshError) {
          handlers.flashRefreshError(err);
        }
      } finally {
        refreshBtn.classList.remove("is-spinning");
        refreshBtn.disabled = false;
      }
    }
  });

  if (suggestions.parentNode === field) {
    field.removeChild(suggestions);
  }
  field.appendChild(refreshBtn);
  field.appendChild(suggestions);

  return wrap;
}

export function ensureTopbar(handlers) {
  ensureStyles();
  if (!document.body) return null;

  let topbar = document.getElementById(TOPBAR_ID);
  if (!topbar) {
    topbar = createTopbar(handlers);
    topbar.id = TOPBAR_ID;
    document.body.appendChild(topbar);
  }
  return topbar;
}
