(() => {
  // src/modules/shared/utils.js
  var CHANNEL_TOKEN_KEY = "gcxMessageChannelToken";
  var CHANNEL_TOKEN_LENGTH = 64;
  var EMAIL_REGEX = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/i;
  var gcxConsole = {
    log: () => {
    },
    info: () => {
    },
    debug: () => {
    },
    warn: (...args) => globalThis.console.warn(...args),
    error: (...args) => globalThis.console.error(...args)
  };

  // src/modules/content/constants.js
  var STYLE_ID = "gcx-sarch-style";
  var STYLE_PATH = "src/gcx-topbar.css";
  var TOPBAR_WRAP = "gcx-topbar";
  var TOPBAR_INPUT = "gcx-topbar-input";
  var TOPBAR_ID = "gcx-topbar-overlay";
  var EXPANDED_CLASS = "is-expanded";
  var SUGGESTION_LIMIT = 20;
  var SVG_NS = "http://www.w3.org/2000/svg";
  var ICON_PATH_DATA = [
    "M172.625,102.4c-42.674,0-77.392,34.739-77.392,77.438c0,5.932,4.806,10.74,10.733,10.74c5.928,0,10.733-4.808,10.733-10.74c0-30.856,25.088-55.959,55.926-55.959c5.928,0,10.733-4.808,10.733-10.74C183.358,107.208,178.553,102.4,172.625,102.4z",
    "M361.657,301.511c19.402-30.436,30.645-66.546,30.645-105.244C392.302,88.036,304.318,0,196.151,0c-38.676,0-74.765,11.25-105.182,30.663C66.734,46.123,46.11,66.759,30.659,91.008C11.257,121.444,0,157.568,0,196.267c0,108.217,87.998,196.266,196.151,196.266c38.676,0,74.779-11.264,105.197-30.677C325.582,346.396,346.206,325.76,361.657,301.511z M259.758,320.242c-19.075,9.842-40.708,15.403-63.607,15.403c-76.797,0-139.296-62.535-139.296-139.378c0-22.912,5.558-44.558,15.394-63.644c13.318-25.856,34.483-47.019,60.323-60.331c19.075-9.842,40.694-15.403,63.578-15.403c76.812,0,139.296,62.521,139.296,139.378c0,22.898-5.558,44.53-15.394,63.616C306.749,285.739,285.598,306.916,259.758,320.242z",
    "M499.516,439.154L386.275,326.13c-16.119,23.552-36.771,44.202-60.309,60.345l113.241,113.024c8.329,8.334,19.246,12.501,30.148,12.501c10.916,0,21.833-4.167,30.162-12.501C516.161,482.83,516.161,455.822,499.516,439.154z"
  ];
  var RELOAD_ICON_PATH_DATA = "M446.025,92.206c-40.762-42.394-97.487-69.642-160.383-72.182c-15.791-0.638-29.114,11.648-29.752,27.433c-0.638,15.791,11.648,29.114,27.426,29.76c47.715,1.943,90.45,22.481,121.479,54.681c30.987,32.235,49.956,75.765,49.971,124.011c-0.015,49.481-19.977,94.011-52.383,126.474c-32.462,32.413-76.999,52.368-126.472,52.382c-49.474-0.015-94.025-19.97-126.474-52.382c-32.405-32.463-52.368-76.992-52.382-126.474c0-3.483,0.106-6.938,0.302-10.364l34.091,16.827c3.702,1.824,8.002,1.852,11.35,0.086c3.362-1.788,5.349-5.137,5.264-8.896l-3.362-149.834c-0.114-4.285-2.88-8.357-7.094-10.464c-4.242-2.071-9.166-1.809-12.613,0.738L4.008,182.45c-3.05,2.221-4.498,5.831-3.86,9.577c0.61,3.759,3.249,7.143,6.966,8.974l35.722,17.629c-1.937,12.166-3.018,24.602-3.018,37.279c-0.014,65.102,26.475,124.31,69.153,166.944C151.607,465.525,210.8,492.013,275.91,492c65.095,0.014,124.302-26.475,166.937-69.146c42.678-42.635,69.167-101.842,69.154-166.944C512.014,192.446,486.844,134.565,446.025,92.206z";
  var ERROR_ICON_PATHS = [
    "M2.20164 18.4695L10.1643 4.00506C10.9021 2.66498 13.0979 2.66498 13.8357 4.00506L21.7984 18.4695C22.4443 19.6428 21.4598 21 19.9627 21H4.0373C2.54022 21 1.55571 19.6428 2.20164 18.4695Z",
    "M12 9V13",
    "M12 17.0195V17"
  ];
  var ERROR_ICON_COLOR = "#EA4335";
  var PLACEHOLDER_DEFAULT = "\u30AF\u30E9\u30B9\u5168\u4F53\u3092\u691C\u7D22\u2026";
  var PLACEHOLDER_LOGIN_REQUIRED = "Google\u30A2\u30AB\u30A6\u30F3\u30C8\u306B\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
  var PLACEHOLDER_RELOAD_REQUIRED = "\u30DA\u30FC\u30B8\u3092\u30EA\u30ED\u30FC\u30C9\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
  var PLACEHOLDER_ACCOUNT_MISMATCH = "\u30A2\u30AB\u30A6\u30F3\u30C8\u3092\u78BA\u8A8D\u3057\u3066\u304B\u3089\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
  var PLACEHOLDER_ACCOUNT_SWITCH_SUCCESS = "Google Classroom \u3092\u30EA\u30ED\u30FC\u30C9\u3057\u3066\u304F\u3060\u3055\u3044";
  var JAPAN_TIME_FORMATTER = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  var API_MODE = true;
  var POLL_INTERVAL_MS = 5 * 60 * 1e3;
  var ALLOWED_NAV_HOSTS = /* @__PURE__ */ new Set(["classroom.google.com"]);
  var AUTH_INIT_STATE_KEY = "gcxAuthInitStateV1";
  var ACCOUNT_SWITCH_STATE_KEY = "gcxAccountSwitchStateV1";
  var STREAM_DB_NAME_BASE = "gcx-stream";
  var STREAM_DB_VERSION = 1;
  var STREAM_STORE_NAME = "posts";
  var IMAGE_EXT_PATTERN = /\.(?:png|jpe?g|gif|bmp|webp|svg|heic|heif|tiff?)$/i;
  var DOC_EXT_PATTERN = /\.(?:docx?|gdoc)$/i;
  var GOOGLE_DOC_MIME = "application/vnd.google-apps.document";
  var GOOGLE_DOC_URL_PATTERN = /docs\.google\.com\/document/i;

  // src/modules/content/utils.js
  function normalizeAttachments(materials) {
    if (!Array.isArray(materials)) return [];
    return materials.map((material) => {
      if (!material || typeof material !== "object") return null;
      if (material.driveFile && material.driveFile.driveFile) {
        const file = material.driveFile.driveFile;
        return {
          type: "driveFile",
          driveId: file.id || "",
          href: file.alternateLink || "",
          title: normalizeWhitespace(file.title || ""),
          mimeType: normalizeWhitespace(file.mimeType || ""),
          iconUrl: normalizeWhitespace(file.iconUrl || "")
        };
      }
      if (material.link) {
        const link = material.link;
        return {
          type: "link",
          driveId: "",
          href: link.url || "",
          title: normalizeWhitespace(link.title || link.url || "")
        };
      }
      if (material.form) {
        const form = material.form;
        return {
          type: "form",
          driveId: form.formId || "",
          href: form.formUrl || "",
          title: normalizeWhitespace(form.title || "")
        };
      }
      if (material.youtubeVideo) {
        const video = material.youtubeVideo;
        return {
          type: "youtube",
          driveId: video.id || "",
          href: video.alternateLink || video.url || "",
          title: normalizeWhitespace(video.title || "")
        };
      }
      return null;
    }).filter(Boolean);
  }
  function normalizeWhitespace(value) {
    if (value == null) return "";
    return String(value).replace(/[\s\u00A0]+/g, " ").trim();
  }
  function toArray(value) {
    return Array.isArray(value) ? value : [];
  }
  function formatPostedAtForJapan(rawValue) {
    const value = normalizeWhitespace(rawValue || "");
    if (!value) {
      return { text: "", datetime: "" };
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return { text: value, datetime: value };
    }
    const parts = JAPAN_TIME_FORMATTER.formatToParts(date);
    const partValue = (type) => {
      var _a;
      return ((_a = parts.find((p) => p.type === type)) == null ? void 0 : _a.value) || "";
    };
    const yearPart = partValue("year");
    const monthPart = partValue("month");
    const dayPart = partValue("day");
    const baseText = monthPart && dayPart ? `${monthPart}/${dayPart}` : monthPart || dayPart;
    const yearNumber = Number.parseInt(yearPart, 10);
    const includeYear = Number.isFinite(yearNumber) && yearNumber < 2024;
    const fallbackText = JAPAN_TIME_FORMATTER.format(date);
    return {
      text: includeYear && baseText ? `${yearPart}/${baseText}` : baseText || fallbackText,
      datetime: date.toISOString()
    };
  }
  function hashString(input) {
    let hash = 5381;
    for (let i = 0; i < input.length; i += 1) {
      hash = hash * 33 ^ input.charCodeAt(i);
    }
    return (hash >>> 0).toString(36);
  }
  function normalizeStreamId(value) {
    if (typeof value !== "string") return "";
    return value.trim();
  }
  function ensureStableStreamId(post, fallbackIndex = 0) {
    var _a, _b;
    const existing = normalizeStreamId(post == null ? void 0 : post.streamId);
    if (existing) return existing;
    const seedParts = [
      normalizeWhitespace((post == null ? void 0 : post.teacherName) || ""),
      normalizeWhitespace(((_a = post == null ? void 0 : post.postedAt) == null ? void 0 : _a.datetime) || ((_b = post == null ? void 0 : post.postedAt) == null ? void 0 : _b.text) || ""),
      normalizeWhitespace(((post == null ? void 0 : post.body) || "").slice(0, 160)),
      String((post == null ? void 0 : post.index) || fallbackIndex || 0)
    ];
    const seed = seedParts.join("|");
    if (!seed.trim()) {
      return "";
    }
    return `auto-${hashString(seed)}`;
  }
  function deriveDriveFileLabel(attachment) {
    const mime = normalizeWhitespace((attachment == null ? void 0 : attachment.mimeType) || "").toLowerCase();
    if (mime === GOOGLE_DOC_MIME) {
      return "Document";
    }
    if (mime.startsWith("image/")) {
      return "Image";
    }
    const title = normalizeWhitespace((attachment == null ? void 0 : attachment.title) || "");
    const href = normalizeWhitespace((attachment == null ? void 0 : attachment.href) || "");
    const icon = normalizeWhitespace((attachment == null ? void 0 : attachment.iconUrl) || "");
    const lowerTitle = title.toLowerCase();
    const lowerHref = href.toLowerCase();
    const lowerIcon = icon.toLowerCase();
    if (GOOGLE_DOC_URL_PATTERN.test(href) || GOOGLE_DOC_URL_PATTERN.test(title) || lowerIcon.includes("document") || DOC_EXT_PATTERN.test(title) || DOC_EXT_PATTERN.test(href)) {
      return "Document";
    }
    if (IMAGE_EXT_PATTERN.test(title) || IMAGE_EXT_PATTERN.test(href)) {
      return "Image";
    }
    if (lowerTitle.endsWith(".pdf") || lowerHref.endsWith(".pdf") || lowerHref.includes(".pdf")) {
      return "PDF";
    }
    return "File";
  }
  function deriveSingleAttachmentLabel(attachment) {
    if (!attachment || typeof attachment !== "object") {
      return "";
    }
    switch (attachment.type) {
      case "driveFile":
        return deriveDriveFileLabel(attachment);
      case "form":
        return "Form";
      case "youtube":
        return "YouTube";
      case "link": {
        const href = normalizeWhitespace(attachment.href || "");
        const title = normalizeWhitespace(attachment.title || "");
        const lowerHref = href.toLowerCase();
        const lowerTitle = title.toLowerCase();
        if (GOOGLE_DOC_URL_PATTERN.test(href) || GOOGLE_DOC_URL_PATTERN.test(title) || DOC_EXT_PATTERN.test(title) || DOC_EXT_PATTERN.test(href)) {
          return "Document";
        }
        if (IMAGE_EXT_PATTERN.test(title) || IMAGE_EXT_PATTERN.test(href)) {
          return "Image";
        }
        if (lowerHref.endsWith(".pdf") || lowerHref.includes(".pdf") || lowerTitle.endsWith(".pdf")) {
          return "PDF";
        }
        return "Link";
      }
      default:
        return "File";
    }
  }
  function deriveAttachmentLabels(attachments) {
    if (!Array.isArray(attachments) || !attachments.length) {
      return [];
    }
    return attachments.map((attachment) => deriveSingleAttachmentLabel(attachment)).filter((label) => Boolean(label));
  }
  function getExtensionURL(relativePath) {
    var _a, _b;
    try {
      if (typeof chrome !== "undefined" && ((_a = chrome.runtime) == null ? void 0 : _a.getURL)) {
        return chrome.runtime.getURL(relativePath);
      }
    } catch {
    }
    if (typeof browser !== "undefined" && ((_b = browser.runtime) == null ? void 0 : _b.getURL)) {
      return browser.runtime.getURL(relativePath);
    }
    return relativePath;
  }

  // src/modules/content/ui/topbar.js
  var topbarInput = null;
  function ensureStyles() {
    try {
      const href = getExtensionURL(STYLE_PATH);
      const existing = document.getElementById(STYLE_ID);
      if (existing) {
        const current = existing instanceof HTMLLinkElement ? existing.getAttribute("href") : existing instanceof HTMLStyleElement ? existing.dataset.origin : null;
        if (current === href) return;
        existing.remove();
      }
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.dataset.origin = href;
      style.textContent = "/* [GCX] topbar styles loading... */";
      document.head.appendChild(style);
      fetch(href).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.text();
      }).then((css) => {
        style.textContent = css;
      }).catch((error) => {
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
  function setTopbarPlaceholder(text) {
    if (!topbarInput) {
      topbarInput = document.querySelector(`.${TOPBAR_INPUT}`);
    }
    if (topbarInput) {
      topbarInput.placeholder = text;
      if (text === "\u540C\u671F\u306B\u5931\u6557\u3057\u307E\u3057\u305F") {
        topbarInput.classList.add("is-error");
      } else {
        topbarInput.classList.remove("is-error");
      }
    }
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
  var TopbarFocusController = class {
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
  };
  function createTopbar(handlers) {
    const wrap = document.createElement("div");
    wrap.classList.add(TOPBAR_WRAP);
    wrap.setAttribute("role", "search");
    wrap.setAttribute("aria-label", "\u30AF\u30A4\u30C3\u30AF\u691C\u7D22");
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
      "keyup"
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
    refreshBtn.title = "\u65B0\u898F\u6295\u7A3F\u3092\u540C\u671F";
    refreshBtn.setAttribute("aria-label", "\u66F4\u65B0");
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
      "keyup"
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
  function ensureTopbar(handlers) {
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

  // src/libs/fuse.esm.js
  function isArray(value) {
    return !Array.isArray ? getTag(value) === "[object Array]" : Array.isArray(value);
  }
  var INFINITY = 1 / 0;
  function baseToString(value) {
    if (typeof value == "string") {
      return value;
    }
    let result = value + "";
    return result == "0" && 1 / value == -INFINITY ? "-0" : result;
  }
  function toString(value) {
    return value == null ? "" : baseToString(value);
  }
  function isString(value) {
    return typeof value === "string";
  }
  function isNumber(value) {
    return typeof value === "number";
  }
  function isBoolean(value) {
    return value === true || value === false || isObjectLike(value) && getTag(value) == "[object Boolean]";
  }
  function isObject(value) {
    return typeof value === "object";
  }
  function isObjectLike(value) {
    return isObject(value) && value !== null;
  }
  function isDefined(value) {
    return value !== void 0 && value !== null;
  }
  function isBlank(value) {
    return !value.trim().length;
  }
  function getTag(value) {
    return value == null ? value === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(value);
  }
  var INCORRECT_INDEX_TYPE = "Incorrect 'index' type";
  var LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY = (key) => `Invalid value for key ${key}`;
  var PATTERN_LENGTH_TOO_LARGE = (max) => `Pattern length exceeds max of ${max}.`;
  var MISSING_KEY_PROPERTY = (name) => `Missing ${name} property in key`;
  var INVALID_KEY_WEIGHT_VALUE = (key) => `Property 'weight' in key '${key}' must be a positive integer`;
  var hasOwn = Object.prototype.hasOwnProperty;
  var KeyStore = class {
    constructor(keys) {
      this._keys = [];
      this._keyMap = {};
      let totalWeight = 0;
      keys.forEach((key) => {
        let obj = createKey(key);
        totalWeight += obj.weight;
        this._keys.push(obj);
        this._keyMap[obj.id] = obj;
        totalWeight += obj.weight;
      });
      this._keys.forEach((key) => {
        key.weight /= totalWeight;
      });
    }
    get(keyId) {
      return this._keyMap[keyId];
    }
    keys() {
      return this._keys;
    }
    toJSON() {
      return JSON.stringify(this._keys);
    }
  };
  function createKey(key) {
    let path = null;
    let id = null;
    let src = null;
    let weight = 1;
    let getFn = null;
    if (isString(key) || isArray(key)) {
      src = key;
      path = createKeyPath(key);
      id = createKeyId(key);
    } else {
      if (!hasOwn.call(key, "name")) {
        throw new Error(MISSING_KEY_PROPERTY("name"));
      }
      const name = key.name;
      src = name;
      if (hasOwn.call(key, "weight")) {
        weight = key.weight;
        if (weight <= 0) {
          throw new Error(INVALID_KEY_WEIGHT_VALUE(name));
        }
      }
      path = createKeyPath(name);
      id = createKeyId(name);
      getFn = key.getFn;
    }
    return { path, id, weight, src, getFn };
  }
  function createKeyPath(key) {
    return isArray(key) ? key : key.split(".");
  }
  function createKeyId(key) {
    return isArray(key) ? key.join(".") : key;
  }
  function get(obj, path) {
    let list = [];
    let arr = false;
    const deepGet = (obj2, path2, index) => {
      if (!isDefined(obj2)) {
        return;
      }
      if (!path2[index]) {
        list.push(obj2);
      } else {
        let key = path2[index];
        const value = obj2[key];
        if (!isDefined(value)) {
          return;
        }
        if (index === path2.length - 1 && (isString(value) || isNumber(value) || isBoolean(value))) {
          list.push(toString(value));
        } else if (isArray(value)) {
          arr = true;
          for (let i = 0, len = value.length; i < len; i += 1) {
            deepGet(value[i], path2, index + 1);
          }
        } else if (path2.length) {
          deepGet(value, path2, index + 1);
        }
      }
    };
    deepGet(obj, isString(path) ? path.split(".") : path, 0);
    return arr ? list : list[0];
  }
  var MatchOptions = {
    // Whether the matches should be included in the result set. When `true`, each record in the result
    // set will include the indices of the matched characters.
    // These can consequently be used for highlighting purposes.
    includeMatches: false,
    // When `true`, the matching function will continue to the end of a search pattern even if
    // a perfect match has already been located in the string.
    findAllMatches: false,
    // Minimum number of characters that must be matched before a result is considered a match
    minMatchCharLength: 1
  };
  var BasicOptions = {
    // When `true`, the algorithm continues searching to the end of the input even if a perfect
    // match is found before the end of the same input.
    isCaseSensitive: false,
    // When true, the matching function will continue to the end of a search pattern even if
    includeScore: false,
    // List of properties that will be searched. This also supports nested properties.
    keys: [],
    // Whether to sort the result list, by score
    shouldSort: true,
    // Default sort function: sort by ascending score, ascending index
    sortFn: (a, b) => a.score === b.score ? a.idx < b.idx ? -1 : 1 : a.score < b.score ? -1 : 1
  };
  var FuzzyOptions = {
    // Approximately where in the text is the pattern expected to be found?
    location: 0,
    // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
    // (of both letters and location), a threshold of '1.0' would match anything.
    threshold: 0.6,
    // Determines how close the match must be to the fuzzy location (specified above).
    // An exact letter match which is 'distance' characters away from the fuzzy location
    // would score as a complete mismatch. A distance of '0' requires the match be at
    // the exact location specified, a threshold of '1000' would require a perfect match
    // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
    distance: 100
  };
  var AdvancedOptions = {
    // When `true`, it enables the use of unix-like search commands
    useExtendedSearch: false,
    // The get function to use when fetching an object's properties.
    // The default will search nested paths *ie foo.bar.baz*
    getFn: get,
    // When `true`, search will ignore `location` and `distance`, so it won't matter
    // where in the string the pattern appears.
    // More info: https://fusejs.io/concepts/scoring-theory.html#fuzziness-score
    ignoreLocation: false,
    // When `true`, the calculation for the relevance score (used for sorting) will
    // ignore the field-length norm.
    // More info: https://fusejs.io/concepts/scoring-theory.html#field-length-norm
    ignoreFieldNorm: false,
    // The weight to determine how much field length norm effects scoring.
    fieldNormWeight: 1
  };
  var Config = {
    ...BasicOptions,
    ...MatchOptions,
    ...FuzzyOptions,
    ...AdvancedOptions
  };
  var SPACE = /[^ ]+/g;
  function norm(weight = 1, mantissa = 3) {
    const cache = /* @__PURE__ */ new Map();
    const m = Math.pow(10, mantissa);
    return {
      get(value) {
        const numTokens = value.match(SPACE).length;
        if (cache.has(numTokens)) {
          return cache.get(numTokens);
        }
        const norm2 = 1 / Math.pow(numTokens, 0.5 * weight);
        const n = parseFloat(Math.round(norm2 * m) / m);
        cache.set(numTokens, n);
        return n;
      },
      clear() {
        cache.clear();
      }
    };
  }
  var FuseIndex = class {
    constructor({
      getFn = Config.getFn,
      fieldNormWeight = Config.fieldNormWeight
    } = {}) {
      this.norm = norm(fieldNormWeight, 3);
      this.getFn = getFn;
      this.isCreated = false;
      this.setIndexRecords();
    }
    setSources(docs = []) {
      this.docs = docs;
    }
    setIndexRecords(records = []) {
      this.records = records;
    }
    setKeys(keys = []) {
      this.keys = keys;
      this._keysMap = {};
      keys.forEach((key, idx) => {
        this._keysMap[key.id] = idx;
      });
    }
    create() {
      if (this.isCreated || !this.docs.length) {
        return;
      }
      this.isCreated = true;
      if (isString(this.docs[0])) {
        this.docs.forEach((doc, docIndex) => {
          this._addString(doc, docIndex);
        });
      } else {
        this.docs.forEach((doc, docIndex) => {
          this._addObject(doc, docIndex);
        });
      }
      this.norm.clear();
    }
    // Adds a doc to the end of the index
    add(doc) {
      const idx = this.size();
      if (isString(doc)) {
        this._addString(doc, idx);
      } else {
        this._addObject(doc, idx);
      }
    }
    // Removes the doc at the specified index of the index
    removeAt(idx) {
      this.records.splice(idx, 1);
      for (let i = idx, len = this.size(); i < len; i += 1) {
        this.records[i].i -= 1;
      }
    }
    getValueForItemAtKeyId(item, keyId) {
      return item[this._keysMap[keyId]];
    }
    size() {
      return this.records.length;
    }
    _addString(doc, docIndex) {
      if (!isDefined(doc) || isBlank(doc)) {
        return;
      }
      let record = {
        v: doc,
        i: docIndex,
        n: this.norm.get(doc)
      };
      this.records.push(record);
    }
    _addObject(doc, docIndex) {
      let record = { i: docIndex, $: {} };
      this.keys.forEach((key, keyIndex) => {
        let value = key.getFn ? key.getFn(doc) : this.getFn(doc, key.path);
        if (!isDefined(value)) {
          return;
        }
        if (isArray(value)) {
          let subRecords = [];
          const stack = [{ nestedArrIndex: -1, value }];
          while (stack.length) {
            const { nestedArrIndex, value: value2 } = stack.pop();
            if (!isDefined(value2)) {
              continue;
            }
            if (isString(value2) && !isBlank(value2)) {
              let subRecord = {
                v: value2,
                i: nestedArrIndex,
                n: this.norm.get(value2)
              };
              subRecords.push(subRecord);
            } else if (isArray(value2)) {
              value2.forEach((item, k) => {
                stack.push({
                  nestedArrIndex: k,
                  value: item
                });
              });
            } else ;
          }
          record.$[keyIndex] = subRecords;
        } else if (isString(value) && !isBlank(value)) {
          let subRecord = {
            v: value,
            n: this.norm.get(value)
          };
          record.$[keyIndex] = subRecord;
        }
      });
      this.records.push(record);
    }
    toJSON() {
      return {
        keys: this.keys,
        records: this.records
      };
    }
  };
  function createIndex(keys, docs, { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
    const myIndex = new FuseIndex({ getFn, fieldNormWeight });
    myIndex.setKeys(keys.map(createKey));
    myIndex.setSources(docs);
    myIndex.create();
    return myIndex;
  }
  function parseIndex(data, { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
    const { keys, records } = data;
    const myIndex = new FuseIndex({ getFn, fieldNormWeight });
    myIndex.setKeys(keys);
    myIndex.setIndexRecords(records);
    return myIndex;
  }
  function computeScore$1(pattern, {
    errors = 0,
    currentLocation = 0,
    expectedLocation = 0,
    distance = Config.distance,
    ignoreLocation = Config.ignoreLocation
  } = {}) {
    const accuracy = errors / pattern.length;
    if (ignoreLocation) {
      return accuracy;
    }
    const proximity = Math.abs(expectedLocation - currentLocation);
    if (!distance) {
      return proximity ? 1 : accuracy;
    }
    return accuracy + proximity / distance;
  }
  function convertMaskToIndices(matchmask = [], minMatchCharLength = Config.minMatchCharLength) {
    let indices = [];
    let start = -1;
    let end = -1;
    let i = 0;
    for (let len = matchmask.length; i < len; i += 1) {
      let match = matchmask[i];
      if (match && start === -1) {
        start = i;
      } else if (!match && start !== -1) {
        end = i - 1;
        if (end - start + 1 >= minMatchCharLength) {
          indices.push([start, end]);
        }
        start = -1;
      }
    }
    if (matchmask[i - 1] && i - start >= minMatchCharLength) {
      indices.push([start, i - 1]);
    }
    return indices;
  }
  var MAX_BITS = 32;
  function search(text, pattern, patternAlphabet, {
    location = Config.location,
    distance = Config.distance,
    threshold = Config.threshold,
    findAllMatches = Config.findAllMatches,
    minMatchCharLength = Config.minMatchCharLength,
    includeMatches = Config.includeMatches,
    ignoreLocation = Config.ignoreLocation
  } = {}) {
    if (pattern.length > MAX_BITS) {
      throw new Error(PATTERN_LENGTH_TOO_LARGE(MAX_BITS));
    }
    const patternLen = pattern.length;
    const textLen = text.length;
    const expectedLocation = Math.max(0, Math.min(location, textLen));
    let currentThreshold = threshold;
    let bestLocation = expectedLocation;
    const computeMatches = minMatchCharLength > 1 || includeMatches;
    const matchMask = computeMatches ? Array(textLen) : [];
    let index;
    while ((index = text.indexOf(pattern, bestLocation)) > -1) {
      let score = computeScore$1(pattern, {
        currentLocation: index,
        expectedLocation,
        distance,
        ignoreLocation
      });
      currentThreshold = Math.min(score, currentThreshold);
      bestLocation = index + patternLen;
      if (computeMatches) {
        let i = 0;
        while (i < patternLen) {
          matchMask[index + i] = 1;
          i += 1;
        }
      }
    }
    bestLocation = -1;
    let lastBitArr = [];
    let finalScore = 1;
    let binMax = patternLen + textLen;
    const mask = 1 << patternLen - 1;
    for (let i = 0; i < patternLen; i += 1) {
      let binMin = 0;
      let binMid = binMax;
      while (binMin < binMid) {
        const score2 = computeScore$1(pattern, {
          errors: i,
          currentLocation: expectedLocation + binMid,
          expectedLocation,
          distance,
          ignoreLocation
        });
        if (score2 <= currentThreshold) {
          binMin = binMid;
        } else {
          binMax = binMid;
        }
        binMid = Math.floor((binMax - binMin) / 2 + binMin);
      }
      binMax = binMid;
      let start = Math.max(1, expectedLocation - binMid + 1);
      let finish = findAllMatches ? textLen : Math.min(expectedLocation + binMid, textLen) + patternLen;
      let bitArr = Array(finish + 2);
      bitArr[finish + 1] = (1 << i) - 1;
      for (let j = finish; j >= start; j -= 1) {
        let currentLocation = j - 1;
        let charMatch = patternAlphabet[text.charAt(currentLocation)];
        if (computeMatches) {
          matchMask[currentLocation] = +!!charMatch;
        }
        bitArr[j] = (bitArr[j + 1] << 1 | 1) & charMatch;
        if (i) {
          bitArr[j] |= (lastBitArr[j + 1] | lastBitArr[j]) << 1 | 1 | lastBitArr[j + 1];
        }
        if (bitArr[j] & mask) {
          finalScore = computeScore$1(pattern, {
            errors: i,
            currentLocation,
            expectedLocation,
            distance,
            ignoreLocation
          });
          if (finalScore <= currentThreshold) {
            currentThreshold = finalScore;
            bestLocation = currentLocation;
            if (bestLocation <= expectedLocation) {
              break;
            }
            start = Math.max(1, 2 * expectedLocation - bestLocation);
          }
        }
      }
      const score = computeScore$1(pattern, {
        errors: i + 1,
        currentLocation: expectedLocation,
        expectedLocation,
        distance,
        ignoreLocation
      });
      if (score > currentThreshold) {
        break;
      }
      lastBitArr = bitArr;
    }
    const result = {
      isMatch: bestLocation >= 0,
      // Count exact matches (those with a score of 0) to be "almost" exact
      score: Math.max(1e-3, finalScore)
    };
    if (computeMatches) {
      const indices = convertMaskToIndices(matchMask, minMatchCharLength);
      if (!indices.length) {
        result.isMatch = false;
      } else if (includeMatches) {
        result.indices = indices;
      }
    }
    return result;
  }
  function createPatternAlphabet(pattern) {
    let mask = {};
    for (let i = 0, len = pattern.length; i < len; i += 1) {
      const char = pattern.charAt(i);
      mask[char] = (mask[char] || 0) | 1 << len - i - 1;
    }
    return mask;
  }
  var BitapSearch = class {
    constructor(pattern, {
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance,
      includeMatches = Config.includeMatches,
      findAllMatches = Config.findAllMatches,
      minMatchCharLength = Config.minMatchCharLength,
      isCaseSensitive = Config.isCaseSensitive,
      ignoreLocation = Config.ignoreLocation
    } = {}) {
      this.options = {
        location,
        threshold,
        distance,
        includeMatches,
        findAllMatches,
        minMatchCharLength,
        isCaseSensitive,
        ignoreLocation
      };
      this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
      this.chunks = [];
      if (!this.pattern.length) {
        return;
      }
      const addChunk = (pattern2, startIndex) => {
        this.chunks.push({
          pattern: pattern2,
          alphabet: createPatternAlphabet(pattern2),
          startIndex
        });
      };
      const len = this.pattern.length;
      if (len > MAX_BITS) {
        let i = 0;
        const remainder = len % MAX_BITS;
        const end = len - remainder;
        while (i < end) {
          addChunk(this.pattern.substr(i, MAX_BITS), i);
          i += MAX_BITS;
        }
        if (remainder) {
          const startIndex = len - MAX_BITS;
          addChunk(this.pattern.substr(startIndex), startIndex);
        }
      } else {
        addChunk(this.pattern, 0);
      }
    }
    searchIn(text) {
      const { isCaseSensitive, includeMatches } = this.options;
      if (!isCaseSensitive) {
        text = text.toLowerCase();
      }
      if (this.pattern === text) {
        let result2 = {
          isMatch: true,
          score: 0
        };
        if (includeMatches) {
          result2.indices = [[0, text.length - 1]];
        }
        return result2;
      }
      const {
        location,
        distance,
        threshold,
        findAllMatches,
        minMatchCharLength,
        ignoreLocation
      } = this.options;
      let allIndices = [];
      let totalScore = 0;
      let hasMatches = false;
      this.chunks.forEach(({ pattern, alphabet, startIndex }) => {
        const { isMatch, score, indices } = search(text, pattern, alphabet, {
          location: location + startIndex,
          distance,
          threshold,
          findAllMatches,
          minMatchCharLength,
          includeMatches,
          ignoreLocation
        });
        if (isMatch) {
          hasMatches = true;
        }
        totalScore += score;
        if (isMatch && indices) {
          allIndices = [...allIndices, ...indices];
        }
      });
      let result = {
        isMatch: hasMatches,
        score: hasMatches ? totalScore / this.chunks.length : 1
      };
      if (hasMatches && includeMatches) {
        result.indices = allIndices;
      }
      return result;
    }
  };
  var BaseMatch = class {
    constructor(pattern) {
      this.pattern = pattern;
    }
    static isMultiMatch(pattern) {
      return getMatch(pattern, this.multiRegex);
    }
    static isSingleMatch(pattern) {
      return getMatch(pattern, this.singleRegex);
    }
    search() {
    }
  };
  function getMatch(pattern, exp) {
    const matches = pattern.match(exp);
    return matches ? matches[1] : null;
  }
  var ExactMatch = class extends BaseMatch {
    constructor(pattern) {
      super(pattern);
    }
    static get type() {
      return "exact";
    }
    static get multiRegex() {
      return /^="(.*)"$/;
    }
    static get singleRegex() {
      return /^=(.*)$/;
    }
    search(text) {
      const isMatch = text === this.pattern;
      return {
        isMatch,
        score: isMatch ? 0 : 1,
        indices: [0, this.pattern.length - 1]
      };
    }
  };
  var InverseExactMatch = class extends BaseMatch {
    constructor(pattern) {
      super(pattern);
    }
    static get type() {
      return "inverse-exact";
    }
    static get multiRegex() {
      return /^!"(.*)"$/;
    }
    static get singleRegex() {
      return /^!(.*)$/;
    }
    search(text) {
      const index = text.indexOf(this.pattern);
      const isMatch = index === -1;
      return {
        isMatch,
        score: isMatch ? 0 : 1,
        indices: [0, text.length - 1]
      };
    }
  };
  var PrefixExactMatch = class extends BaseMatch {
    constructor(pattern) {
      super(pattern);
    }
    static get type() {
      return "prefix-exact";
    }
    static get multiRegex() {
      return /^\^"(.*)"$/;
    }
    static get singleRegex() {
      return /^\^(.*)$/;
    }
    search(text) {
      const isMatch = text.startsWith(this.pattern);
      return {
        isMatch,
        score: isMatch ? 0 : 1,
        indices: [0, this.pattern.length - 1]
      };
    }
  };
  var InversePrefixExactMatch = class extends BaseMatch {
    constructor(pattern) {
      super(pattern);
    }
    static get type() {
      return "inverse-prefix-exact";
    }
    static get multiRegex() {
      return /^!\^"(.*)"$/;
    }
    static get singleRegex() {
      return /^!\^(.*)$/;
    }
    search(text) {
      const isMatch = !text.startsWith(this.pattern);
      return {
        isMatch,
        score: isMatch ? 0 : 1,
        indices: [0, text.length - 1]
      };
    }
  };
  var SuffixExactMatch = class extends BaseMatch {
    constructor(pattern) {
      super(pattern);
    }
    static get type() {
      return "suffix-exact";
    }
    static get multiRegex() {
      return /^"(.*)"\$$/;
    }
    static get singleRegex() {
      return /^(.*)\$$/;
    }
    search(text) {
      const isMatch = text.endsWith(this.pattern);
      return {
        isMatch,
        score: isMatch ? 0 : 1,
        indices: [text.length - this.pattern.length, text.length - 1]
      };
    }
  };
  var InverseSuffixExactMatch = class extends BaseMatch {
    constructor(pattern) {
      super(pattern);
    }
    static get type() {
      return "inverse-suffix-exact";
    }
    static get multiRegex() {
      return /^!"(.*)"\$$/;
    }
    static get singleRegex() {
      return /^!(.*)\$$/;
    }
    search(text) {
      const isMatch = !text.endsWith(this.pattern);
      return {
        isMatch,
        score: isMatch ? 0 : 1,
        indices: [0, text.length - 1]
      };
    }
  };
  var FuzzyMatch = class extends BaseMatch {
    constructor(pattern, {
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance,
      includeMatches = Config.includeMatches,
      findAllMatches = Config.findAllMatches,
      minMatchCharLength = Config.minMatchCharLength,
      isCaseSensitive = Config.isCaseSensitive,
      ignoreLocation = Config.ignoreLocation
    } = {}) {
      super(pattern);
      this._bitapSearch = new BitapSearch(pattern, {
        location,
        threshold,
        distance,
        includeMatches,
        findAllMatches,
        minMatchCharLength,
        isCaseSensitive,
        ignoreLocation
      });
    }
    static get type() {
      return "fuzzy";
    }
    static get multiRegex() {
      return /^"(.*)"$/;
    }
    static get singleRegex() {
      return /^(.*)$/;
    }
    search(text) {
      return this._bitapSearch.searchIn(text);
    }
  };
  var IncludeMatch = class extends BaseMatch {
    constructor(pattern) {
      super(pattern);
    }
    static get type() {
      return "include";
    }
    static get multiRegex() {
      return /^'"(.*)"$/;
    }
    static get singleRegex() {
      return /^'(.*)$/;
    }
    search(text) {
      let location = 0;
      let index;
      const indices = [];
      const patternLen = this.pattern.length;
      while ((index = text.indexOf(this.pattern, location)) > -1) {
        location = index + patternLen;
        indices.push([index, location - 1]);
      }
      const isMatch = !!indices.length;
      return {
        isMatch,
        score: isMatch ? 0 : 1,
        indices
      };
    }
  };
  var searchers = [
    ExactMatch,
    IncludeMatch,
    PrefixExactMatch,
    InversePrefixExactMatch,
    InverseSuffixExactMatch,
    SuffixExactMatch,
    InverseExactMatch,
    FuzzyMatch
  ];
  var searchersLen = searchers.length;
  var SPACE_RE = / +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/;
  var OR_TOKEN = "|";
  function parseQuery(pattern, options = {}) {
    return pattern.split(OR_TOKEN).map((item) => {
      let query = item.trim().split(SPACE_RE).filter((item2) => item2 && !!item2.trim());
      let results = [];
      for (let i = 0, len = query.length; i < len; i += 1) {
        const queryItem = query[i];
        let found = false;
        let idx = -1;
        while (!found && ++idx < searchersLen) {
          const searcher = searchers[idx];
          let token = searcher.isMultiMatch(queryItem);
          if (token) {
            results.push(new searcher(token, options));
            found = true;
          }
        }
        if (found) {
          continue;
        }
        idx = -1;
        while (++idx < searchersLen) {
          const searcher = searchers[idx];
          let token = searcher.isSingleMatch(queryItem);
          if (token) {
            results.push(new searcher(token, options));
            break;
          }
        }
      }
      return results;
    });
  }
  var MultiMatchSet = /* @__PURE__ */ new Set([FuzzyMatch.type, IncludeMatch.type]);
  var ExtendedSearch = class {
    constructor(pattern, {
      isCaseSensitive = Config.isCaseSensitive,
      includeMatches = Config.includeMatches,
      minMatchCharLength = Config.minMatchCharLength,
      ignoreLocation = Config.ignoreLocation,
      findAllMatches = Config.findAllMatches,
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance
    } = {}) {
      this.query = null;
      this.options = {
        isCaseSensitive,
        includeMatches,
        minMatchCharLength,
        findAllMatches,
        ignoreLocation,
        location,
        threshold,
        distance
      };
      this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
      this.query = parseQuery(this.pattern, this.options);
    }
    static condition(_, options) {
      return options.useExtendedSearch;
    }
    searchIn(text) {
      const query = this.query;
      if (!query) {
        return {
          isMatch: false,
          score: 1
        };
      }
      const { includeMatches, isCaseSensitive } = this.options;
      text = isCaseSensitive ? text : text.toLowerCase();
      let numMatches = 0;
      let allIndices = [];
      let totalScore = 0;
      for (let i = 0, qLen = query.length; i < qLen; i += 1) {
        const searchers2 = query[i];
        allIndices.length = 0;
        numMatches = 0;
        for (let j = 0, pLen = searchers2.length; j < pLen; j += 1) {
          const searcher = searchers2[j];
          const { isMatch, indices, score } = searcher.search(text);
          if (isMatch) {
            numMatches += 1;
            totalScore += score;
            if (includeMatches) {
              const type = searcher.constructor.type;
              if (MultiMatchSet.has(type)) {
                allIndices = [...allIndices, ...indices];
              } else {
                allIndices.push(indices);
              }
            }
          } else {
            totalScore = 0;
            numMatches = 0;
            allIndices.length = 0;
            break;
          }
        }
        if (numMatches) {
          let result = {
            isMatch: true,
            score: totalScore / numMatches
          };
          if (includeMatches) {
            result.indices = allIndices;
          }
          return result;
        }
      }
      return {
        isMatch: false,
        score: 1
      };
    }
  };
  var registeredSearchers = [];
  function register(...args) {
    registeredSearchers.push(...args);
  }
  function createSearcher(pattern, options) {
    for (let i = 0, len = registeredSearchers.length; i < len; i += 1) {
      let searcherClass = registeredSearchers[i];
      if (searcherClass.condition(pattern, options)) {
        return new searcherClass(pattern, options);
      }
    }
    return new BitapSearch(pattern, options);
  }
  var LogicalOperator = {
    AND: "$and",
    OR: "$or"
  };
  var KeyType = {
    PATH: "$path",
    PATTERN: "$val"
  };
  var isExpression = (query) => !!(query[LogicalOperator.AND] || query[LogicalOperator.OR]);
  var isPath = (query) => !!query[KeyType.PATH];
  var isLeaf = (query) => !isArray(query) && isObject(query) && !isExpression(query);
  var convertToExplicit = (query) => ({
    [LogicalOperator.AND]: Object.keys(query).map((key) => ({
      [key]: query[key]
    }))
  });
  function parse(query, options, { auto = true } = {}) {
    const next = (query2) => {
      let keys = Object.keys(query2);
      const isQueryPath = isPath(query2);
      if (!isQueryPath && keys.length > 1 && !isExpression(query2)) {
        return next(convertToExplicit(query2));
      }
      if (isLeaf(query2)) {
        const key = isQueryPath ? query2[KeyType.PATH] : keys[0];
        const pattern = isQueryPath ? query2[KeyType.PATTERN] : query2[key];
        if (!isString(pattern)) {
          throw new Error(LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY(key));
        }
        const obj = {
          keyId: createKeyId(key),
          pattern
        };
        if (auto) {
          obj.searcher = createSearcher(pattern, options);
        }
        return obj;
      }
      let node = {
        children: [],
        operator: keys[0]
      };
      keys.forEach((key) => {
        const value = query2[key];
        if (isArray(value)) {
          value.forEach((item) => {
            node.children.push(next(item));
          });
        }
      });
      return node;
    };
    if (!isExpression(query)) {
      query = convertToExplicit(query);
    }
    return next(query);
  }
  function computeScore(results, { ignoreFieldNorm = Config.ignoreFieldNorm }) {
    results.forEach((result) => {
      let totalScore = 1;
      result.matches.forEach(({ key, norm: norm2, score }) => {
        const weight = key ? key.weight : null;
        totalScore *= Math.pow(
          score === 0 && weight ? Number.EPSILON : score,
          (weight || 1) * (ignoreFieldNorm ? 1 : norm2)
        );
      });
      result.score = totalScore;
    });
  }
  function transformMatches(result, data) {
    const matches = result.matches;
    data.matches = [];
    if (!isDefined(matches)) {
      return;
    }
    matches.forEach((match) => {
      if (!isDefined(match.indices) || !match.indices.length) {
        return;
      }
      const { indices, value } = match;
      let obj = {
        indices,
        value
      };
      if (match.key) {
        obj.key = match.key.src;
      }
      if (match.idx > -1) {
        obj.refIndex = match.idx;
      }
      data.matches.push(obj);
    });
  }
  function transformScore(result, data) {
    data.score = result.score;
  }
  function format(results, docs, {
    includeMatches = Config.includeMatches,
    includeScore = Config.includeScore
  } = {}) {
    const transformers = [];
    if (includeMatches) transformers.push(transformMatches);
    if (includeScore) transformers.push(transformScore);
    return results.map((result) => {
      const { idx } = result;
      const data = {
        item: docs[idx],
        refIndex: idx
      };
      if (transformers.length) {
        transformers.forEach((transformer) => {
          transformer(result, data);
        });
      }
      return data;
    });
  }
  var Fuse = class {
    constructor(docs, options = {}, index) {
      this.options = { ...Config, ...options };
      if (this.options.useExtendedSearch && false) {
        throw new Error(EXTENDED_SEARCH_UNAVAILABLE);
      }
      this._keyStore = new KeyStore(this.options.keys);
      this.setCollection(docs, index);
    }
    setCollection(docs, index) {
      this._docs = docs;
      if (index && !(index instanceof FuseIndex)) {
        throw new Error(INCORRECT_INDEX_TYPE);
      }
      this._myIndex = index || createIndex(this.options.keys, this._docs, {
        getFn: this.options.getFn,
        fieldNormWeight: this.options.fieldNormWeight
      });
    }
    add(doc) {
      if (!isDefined(doc)) {
        return;
      }
      this._docs.push(doc);
      this._myIndex.add(doc);
    }
    remove(predicate = () => false) {
      const results = [];
      for (let i = 0, len = this._docs.length; i < len; i += 1) {
        const doc = this._docs[i];
        if (predicate(doc, i)) {
          this.removeAt(i);
          i -= 1;
          len -= 1;
          results.push(doc);
        }
      }
      return results;
    }
    removeAt(idx) {
      this._docs.splice(idx, 1);
      this._myIndex.removeAt(idx);
    }
    getIndex() {
      return this._myIndex;
    }
    search(query, { limit = -1 } = {}) {
      const {
        includeMatches,
        includeScore,
        shouldSort,
        sortFn,
        ignoreFieldNorm
      } = this.options;
      let results = isString(query) ? isString(this._docs[0]) ? this._searchStringList(query) : this._searchObjectList(query) : this._searchLogical(query);
      computeScore(results, { ignoreFieldNorm });
      if (shouldSort) {
        results.sort(sortFn);
      }
      if (isNumber(limit) && limit > -1) {
        results = results.slice(0, limit);
      }
      return format(results, this._docs, {
        includeMatches,
        includeScore
      });
    }
    _searchStringList(query) {
      const searcher = createSearcher(query, this.options);
      const { records } = this._myIndex;
      const results = [];
      records.forEach(({ v: text, i: idx, n: norm2 }) => {
        if (!isDefined(text)) {
          return;
        }
        const { isMatch, score, indices } = searcher.searchIn(text);
        if (isMatch) {
          results.push({
            item: text,
            idx,
            matches: [{ score, value: text, norm: norm2, indices }]
          });
        }
      });
      return results;
    }
    _searchLogical(query) {
      const expression = parse(query, this.options);
      const evaluate = (node, item, idx) => {
        if (!node.children) {
          const { keyId, searcher } = node;
          const matches = this._findMatches({
            key: this._keyStore.get(keyId),
            value: this._myIndex.getValueForItemAtKeyId(item, keyId),
            searcher
          });
          if (matches && matches.length) {
            return [
              {
                idx,
                item,
                matches
              }
            ];
          }
          return [];
        }
        const res = [];
        for (let i = 0, len = node.children.length; i < len; i += 1) {
          const child = node.children[i];
          const result = evaluate(child, item, idx);
          if (result.length) {
            res.push(...result);
          } else if (node.operator === LogicalOperator.AND) {
            return [];
          }
        }
        return res;
      };
      const records = this._myIndex.records;
      const resultMap = {};
      const results = [];
      records.forEach(({ $: item, i: idx }) => {
        if (isDefined(item)) {
          let expResults = evaluate(expression, item, idx);
          if (expResults.length) {
            if (!resultMap[idx]) {
              resultMap[idx] = { idx, item, matches: [] };
              results.push(resultMap[idx]);
            }
            expResults.forEach(({ matches }) => {
              resultMap[idx].matches.push(...matches);
            });
          }
        }
      });
      return results;
    }
    _searchObjectList(query) {
      const searcher = createSearcher(query, this.options);
      const { keys, records } = this._myIndex;
      const results = [];
      records.forEach(({ $: item, i: idx }) => {
        if (!isDefined(item)) {
          return;
        }
        let matches = [];
        keys.forEach((key, keyIndex) => {
          matches.push(
            ...this._findMatches({
              key,
              value: item[keyIndex],
              searcher
            })
          );
        });
        if (matches.length) {
          results.push({
            idx,
            item,
            matches
          });
        }
      });
      return results;
    }
    _findMatches({ key, value, searcher }) {
      if (!isDefined(value)) {
        return [];
      }
      let matches = [];
      if (isArray(value)) {
        value.forEach(({ v: text, i: idx, n: norm2 }) => {
          if (!isDefined(text)) {
            return;
          }
          const { isMatch, score, indices } = searcher.searchIn(text);
          if (isMatch) {
            matches.push({
              score,
              key,
              value: text,
              idx,
              norm: norm2,
              indices
            });
          }
        });
      } else {
        const { v: text, n: norm2 } = value;
        const { isMatch, score, indices } = searcher.searchIn(text);
        if (isMatch) {
          matches.push({ score, key, value: text, norm: norm2, indices });
        }
      }
      return matches;
    }
  };
  Fuse.version = "6.6.2";
  Fuse.createIndex = createIndex;
  Fuse.parseIndex = parseIndex;
  Fuse.config = Config;
  {
    Fuse.parseQuery = parse;
  }
  {
    register(ExtendedSearch);
  }

  // src/modules/content/search.js
  var SEARCH_OPTIONS = {
    includeMatches: true,
    includeScore: true,
    shouldSort: true,
    threshold: 0.3,
    keys: [
      { name: "teacherName", weight: 0.4 },
      { name: "courseName", weight: 0.2 },
      { name: "body", weight: 0.4 },
      { name: "attachments.title", weight: 0.2 },
      { name: "postedAt.text", weight: 0.05 }
    ],
    minMatchCharLength: 1
  };
  var fuseInstance = null;
  async function initFuse(posts) {
    try {
      const FuseConstructor = Fuse || window.Fuse;
      if (typeof FuseConstructor !== "function") {
        throw new Error("Fuse constructor is not available");
      }
      fuseInstance = new FuseConstructor(posts, SEARCH_OPTIONS);
    } catch (error) {
      gcxConsole.error("[GCX] Failed to init fuse", error);
      fuseInstance = null;
    }
  }
  function getBodyMatchStart(result) {
    const matches = toArray(result == null ? void 0 : result.matches);
    for (const match of matches) {
      if ((match == null ? void 0 : match.key) !== "body") continue;
      const firstRange = toArray(match.indices)[0];
      if (Array.isArray(firstRange) && firstRange.length > 0) {
        return Number(firstRange[0]);
      }
    }
    return Number.POSITIVE_INFINITY;
  }
  function collectTopMatches(query) {
    if (!query || !fuseInstance) {
      return [];
    }
    const safeQuery = query.trim();
    if (!safeQuery) {
      return [];
    }
    const results = fuseInstance.search(safeQuery);
    const sorted = results.slice().sort((a, b) => {
      var _a, _b;
      const aBodyIndex = getBodyMatchStart(a);
      const bBodyIndex = getBodyMatchStart(b);
      if (aBodyIndex !== bBodyIndex) {
        return aBodyIndex - bBodyIndex;
      }
      return ((_a = a == null ? void 0 : a.score) != null ? _a : 1) - ((_b = b == null ? void 0 : b.score) != null ? _b : 1);
    });
    return sorted.slice(0, SUGGESTION_LIMIT);
  }
  function extractMatchRanges(matches, key, textLength) {
    if (!Array.isArray(matches) || !key || !textLength) {
      return [];
    }
    const ranges = [];
    matches.forEach((match) => {
      if (!match || match.key !== key) return;
      if (!Array.isArray(match.indices)) return;
      match.indices.forEach((pair) => {
        if (!Array.isArray(pair) || pair.length < 2) return;
        const start = Math.max(0, Math.min(textLength - 1, pair[0]));
        const end = Math.max(start, Math.min(textLength - 1, pair[1]));
        ranges.push([start, end]);
      });
    });
    if (!ranges.length) return [];
    ranges.sort((a, b) => a[0] - b[0]);
    const merged = [];
    for (const [start, end] of ranges) {
      const last = merged[merged.length - 1];
      if (last && start <= last[1] + 1) {
        if (end > last[1]) {
          last[1] = end;
        }
        continue;
      }
      merged.push([start, end]);
    }
    return merged;
  }
  function renderHighlightedText(element, value, matches, key) {
    const text = value == null ? "" : String(value);
    element.textContent = "";
    if (!text) {
      return;
    }
    const ranges = extractMatchRanges(matches, key, text.length);
    if (!ranges.length) {
      element.textContent = text;
      return;
    }
    let cursor = 0;
    const fragment = document.createDocumentFragment();
    for (const [start, end] of ranges) {
      if (cursor < start) {
        fragment.appendChild(document.createTextNode(text.slice(cursor, start)));
      }
      const span = document.createElement("span");
      span.classList.add("match-highlight");
      span.textContent = text.slice(start, end + 1);
      fragment.appendChild(span);
      cursor = end + 1;
    }
    if (cursor < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(cursor)));
    }
    element.appendChild(fragment);
  }
  async function loadLocalLibs() {
    if (window.Fuse) return true;
    if (typeof Fuse !== "function") return false;
    window.Fuse = Fuse;
    return true;
  }

  // src/modules/content/account.js
  var AccountIdentityHelper = class {
    static getIndexKey() {
      try {
        const url = new URL(window.location.href);
        const authuserParam = url.searchParams.get("authuser");
        if (authuserParam && /^\d+$/.test(authuserParam)) {
          return `u${authuserParam}`;
        }
        const pathMatch = url.pathname.match(/\/u\/(\d+)(?:\/|$)/);
        if (pathMatch && pathMatch[1]) {
          return `u${pathMatch[1]}`;
        }
      } catch (err) {
        gcxConsole.debug("[GCX] account key detection failed", err);
      }
      return "u0";
    }
    static getFingerprint() {
      const gaiaId = getClassroomGaiaId();
      if (gaiaId) {
        return `g${hashString(gaiaId)}`;
      }
      const email = getClassroomAccountEmail();
      if (email) {
        return `m${hashString(email)}`;
      }
      return "anon";
    }
    static getCompositeKey() {
      const indexKey = this.getIndexKey();
      const fingerprint = this.getFingerprint();
      return `${indexKey}-${fingerprint}`;
    }
    static getIndexNumber() {
      const rawKey = this.getCompositeKey();
      const match = /^u(\d+)/.exec(rawKey);
      if (match) {
        const value = Number.parseInt(match[1], 10);
        if (Number.isInteger(value) && value >= 0) {
          return value;
        }
      }
      return 0;
    }
  };
  function normalizeEmail(value) {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    const match = trimmed.match(EMAIL_REGEX);
    return match ? match[0].toLowerCase() : null;
  }
  function getWizGlobalData() {
    const data = window.WIZ_global_data;
    if (data && typeof data === "object") {
      return data;
    }
    return null;
  }
  function getClassroomGaiaId() {
    const data = getWizGlobalData();
    const candidateKeys = ["S06Grb", "W3Yyqf", "WZsZ1e", "Yllh3e"];
    if (data) {
      for (const key of candidateKeys) {
        const value = data[key];
        if (typeof value === "string" && /^\d{5,}$/.test(value)) {
          gcxConsole.log("[GCX] \u2713 Found GAIA ID");
          return value;
        }
      }
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === "string" && /^\d{5,}$/.test(value)) {
          gcxConsole.log("[GCX] \u2713 Found GAIA ID");
          return value;
        }
      }
    }
    const metaId = document.querySelector('meta[name="og-profile-id"]');
    const metaValue = metaId == null ? void 0 : metaId.getAttribute("content");
    if (metaValue && /^\d{5,}$/.test(metaValue.trim())) {
      gcxConsole.log("[GCX] \u2713 Found GAIA ID in meta tag");
      return metaValue.trim();
    }
    return null;
  }
  function getClassroomAccountEmail() {
    const meta = document.querySelector('meta[name="og-profile-acct"]');
    const metaEmail = normalizeEmail(meta == null ? void 0 : meta.getAttribute("content"));
    if (metaEmail) return metaEmail;
    const data = getWizGlobalData();
    if (data) {
      for (const value of Object.values(data)) {
        if (typeof value === "string") {
          const email = normalizeEmail(value);
          if (email) return email;
        }
      }
    }
    const selectors = [
      "[data-email]",
      'a[aria-label*="@"]',
      'a[href*="SignOutOptions"][aria-label]',
      'img[alt*="@"]'
    ];
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (!element) continue;
      const attrEmail = normalizeEmail(element.getAttribute("data-email"));
      if (attrEmail) return attrEmail;
      const ariaEmail = normalizeEmail(element.getAttribute("aria-label"));
      if (ariaEmail) return ariaEmail;
      const altEmail = normalizeEmail(element.getAttribute("alt"));
      if (altEmail) return altEmail;
      const textEmail = normalizeEmail(element.textContent || "");
      if (textEmail) return textEmail;
    }
    return null;
  }
  function getAccountHint(identityAccounts2) {
    const index = AccountIdentityHelper.getIndexNumber();
    const account = identityAccounts2[index];
    const fallbackEmail = normalizeEmail(account == null ? void 0 : account.email);
    return {
      index: AccountIdentityHelper.getIndexNumber(),
      authUser: AccountIdentityHelper.getIndexNumber(),
      gaiaId: getClassroomGaiaId(),
      email: getClassroomAccountEmail() || fallbackEmail,
      accountKey: AccountIdentityHelper.getCompositeKey(),
      fingerprint: AccountIdentityHelper.getFingerprint()
    };
  }
  function isPostForCurrentAccount(post) {
    const currentAccountKey = AccountIdentityHelper.getCompositeKey();
    const currentFingerprint = AccountIdentityHelper.getFingerprint();
    const postAccountKey = normalizeEmail((post == null ? void 0 : post.accountKey) || "");
    const postFingerprint = normalizeEmail((post == null ? void 0 : post.accountFingerprint) || "");
    if (postAccountKey && postAccountKey !== currentAccountKey) {
      return false;
    }
    if (postFingerprint && postFingerprint !== currentFingerprint) {
      return false;
    }
    return true;
  }

  // src/modules/content/ui/suggestions.js
  function createSuggestionItem(entry, handlers) {
    var _a, _b, _c;
    const item = (entry == null ? void 0 : entry.item) || {};
    const matches = (entry == null ? void 0 : entry.matches) || [];
    const attachmentLabels = deriveAttachmentLabels(item.attachments);
    const li = document.createElement("li");
    li.classList.add("suggestion-item");
    li.tabIndex = 0;
    li.setAttribute("role", "button");
    li.dataset.streamId = item.streamId || "";
    li.dataset.courseId = item.courseId || "";
    li.dataset.alternateLink = item.alternateLink || "";
    const ariaLabelParts = [
      item.teacherName || "",
      item.courseName && item.courseName !== item.teacherName ? item.courseName : "",
      ((_a = item.postedAt) == null ? void 0 : _a.text) || ""
    ].filter(Boolean);
    if (attachmentLabels.length) {
      ariaLabelParts.push(attachmentLabels.join("/"));
    }
    if (ariaLabelParts.length) {
      li.setAttribute("aria-label", ariaLabelParts.join(" "));
    }
    const header = document.createElement("div");
    header.classList.add("suggestion-header");
    const headerMain = document.createElement("div");
    headerMain.classList.add("suggestion-header-main");
    const teacher = document.createElement("span");
    teacher.classList.add("suggestion-teacher");
    renderHighlightedText(
      teacher,
      item.teacherName || "(\u4E0D\u660E)",
      matches,
      "teacherName"
    );
    headerMain.appendChild(teacher);
    if (attachmentLabels.length) {
      const badgeGroup = document.createElement("span");
      badgeGroup.classList.add("suggestion-attachments");
      attachmentLabels.forEach((label) => {
        const badge = document.createElement("span");
        badge.classList.add("attachment-badge");
        badge.textContent = label;
        badgeGroup.appendChild(badge);
      });
      headerMain.appendChild(badgeGroup);
    }
    const time = document.createElement("time");
    time.classList.add("suggestion-time");
    time.dateTime = ((_b = item.postedAt) == null ? void 0 : _b.datetime) || "";
    renderHighlightedText(
      time,
      ((_c = item.postedAt) == null ? void 0 : _c.text) || "",
      matches,
      "postedAt.text"
    );
    header.append(headerMain, time);
    const body = document.createElement("div");
    body.classList.add("suggestion-body");
    renderHighlightedText(body, item.body || "", matches, "body");
    li.append(header, body);
    const activate = async () => {
      if (handlers.handleSuggestionActivation) {
        await handlers.handleSuggestionActivation(item);
      }
    };
    li.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      activate();
    });
    li.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        activate();
      }
    });
    return li;
  }
  function renderSuggestions(results, handlers) {
    const container = document.querySelector(".gcx-suggestions");
    if (!container) return;
    let list = container.querySelector(".suggestions-ul");
    if (!list) {
      const wrap2 = container.querySelector(".suggestions-wrap");
      if (wrap2) {
        list = document.createElement("ul");
        list.classList.add("suggestions-ul");
        wrap2.appendChild(list);
      }
    }
    if (!list) return;
    list.replaceChildren();
    const wrap = list.closest(".suggestions-wrap");
    if (wrap) {
      wrap.scrollTop = 0;
    }
    const entries = toArray(results);
    if (!entries.length) {
      container.classList.remove("has-results");
      return;
    }
    const fragment = document.createDocumentFragment();
    for (const entry of entries) {
      const li = createSuggestionItem(entry, handlers);
      if (li) {
        fragment.appendChild(li);
      }
    }
    list.appendChild(fragment);
    container.classList.add("has-results");
  }
  async function handleSuggestionActivation(item, handlers) {
    if (!item) return;
    if (!isPostForCurrentAccount(item)) {
      gcxConsole.warn("[GCX] Blocked navigation for mismatched account item", {
        itemAccountKey: item == null ? void 0 : item.accountKey,
        itemFingerprint: item == null ? void 0 : item.accountFingerprint,
        currentAccountKey: AccountIdentityHelper.getCompositeKey(),
        currentFingerprint: AccountIdentityHelper.getFingerprint()
      });
      handlers.setTopbarPlaceholder("\u30A2\u30AB\u30A6\u30F3\u30C8\u3092\u78BA\u8A8D\u3057\u3066\u304B\u3089\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002");
      return;
    }
    const courseId = normalizeWhitespace(item.courseId || "");
    const alternateLink = normalizeWhitespace(item.alternateLink || "");
    const apiId = normalizeWhitespace(item.apiId || item.apiid || "");
    const currentAccountIndex = String(AccountIdentityHelper.getIndexNumber());
    const normalizeNavigationTarget = (url) => {
      url.searchParams.set("authuser", currentAccountIndex);
      url.pathname = url.pathname.replace(/\/u\/\d+(?=\/|$)/, `/u/${currentAccountIndex}`);
      return url;
    };
    const navigateTo = (link) => {
      const href = normalizeWhitespace(link || "");
      if (!href) {
        return false;
      }
      let url;
      try {
        url = new URL(href, window.location.href);
      } catch (err) {
        gcxConsole.warn("[GCX] Invalid navigation target", { href, err });
        return false;
      }
      if (url.protocol !== "https:") {
        gcxConsole.warn("[GCX] Blocked non-https navigation", { href });
        return false;
      }
      if (!ALLOWED_NAV_HOSTS.has(url.hostname)) {
        gcxConsole.warn("[GCX] Blocked navigation host", {
          href,
          host: url.hostname
        });
        return false;
      }
      window.location.assign(normalizeNavigationTarget(url).toString());
      return true;
    };
    if (navigateTo(alternateLink)) {
      return;
    }
    if (apiId && courseId && handlers.bgFetch) {
      try {
        const data = await handlers.bgFetch({
          path: `/courses/${encodeURIComponent(
            courseId
          )}/announcements/${encodeURIComponent(apiId)}`
        });
        const fetchedLink = normalizeWhitespace((data == null ? void 0 : data.alternateLink) || "");
        if (navigateTo(fetchedLink)) {
          return;
        }
      } catch (error) {
        gcxConsole.warn("[GCX] Failed to resolve alternateLink via API", {
          courseId,
          apiId,
          error
        });
      }
    }
    gcxConsole.error("[GCX] No navigation target resolved via API", {
      courseId,
      apiId,
      alternateLink,
      item
    });
  }
  function rerunLastQuery(lastQuery2, collectTopMatches2, renderSuggestions2, handlers) {
    if (!handlers.fuseInstance) {
      return;
    }
    if (lastQuery2) {
      renderSuggestions2(collectTopMatches2(lastQuery2), handlers);
    } else {
      const allPosts = handlers.fuseInstance.getIndex().docs || [];
      const SUGGESTION_LIMIT2 = 20;
      const limited = allPosts.slice(0, SUGGESTION_LIMIT2).map((item) => ({ item }));
      renderSuggestions2(limited, handlers);
    }
  }

  // src/modules/content/database.js
  function getStreamDbName() {
    return `${STREAM_DB_NAME_BASE}-${AccountIdentityHelper.getCompositeKey()}`;
  }
  function openStreamDB() {
    const dbName = getStreamDbName();
    const request = indexedDB.open(dbName, STREAM_DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STREAM_STORE_NAME)) {
        db.createObjectStore(STREAM_STORE_NAME, { keyPath: "streamId" });
      }
    };
    return request;
  }
  async function persistStreamData(posts = []) {
    if (!posts.length) return { stored: 0, posts: [] };
    const request = openStreamDB();
    const currentAccountKey = AccountIdentityHelper.getCompositeKey();
    const currentFingerprint = AccountIdentityHelper.getFingerprint();
    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction(STREAM_STORE_NAME, "readwrite");
        const store = tx.objectStore(STREAM_STORE_NAME);
        const savedAt = Date.now();
        const stored = [];
        posts.forEach((post, index) => {
          const streamId = ensureStableStreamId(post, index + 1);
          if (!streamId) {
            gcxConsole.warn("[GCX] skip store: missing fallback streamId", post);
            return;
          }
          const record = {
            ...post,
            apiId: normalizeWhitespace((post == null ? void 0 : post.apiId) || ""),
            accountKey: normalizeWhitespace((post == null ? void 0 : post.accountKey) || "") || currentAccountKey,
            accountFingerprint: normalizeWhitespace((post == null ? void 0 : post.accountFingerprint) || "") || currentFingerprint,
            streamId,
            savedAt
          };
          store.put(record);
          stored.push(record);
        });
        if (!stored.length) {
          gcxConsole.warn(
            "[GCX] No posts persisted. Check selector / parser logic."
          );
        }
        tx.oncomplete = () => {
          db.close();
          resolve({ stored: stored.length, posts: stored });
        };
        tx.onerror = () => {
          reject(tx.error || new Error("IndexedDB transaction failed"));
          db.close();
        };
        tx.onabort = () => {
          reject(new Error("Transaction aborted"));
          db.close();
          gcxConsole.log(
            "A transaction is aborted for reasons other than an error."
          );
        };
      };
    });
  }
  async function loadStreamPostsFromDb() {
    return new Promise((resolve, reject) => {
      const request = openStreamDB();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction(STREAM_STORE_NAME, "readonly");
        const store = tx.objectStore(STREAM_STORE_NAME);
        const getAll = store.getAll();
        getAll.onsuccess = () => {
          const raw = getAll.result || [];
          const normalized = raw.filter((post) => isPostForCurrentAccount(post)).map((post, index) => {
            var _a, _b, _c, _d;
            const streamId = ensureStableStreamId(post, index + 1);
            const apiId = normalizeWhitespace((post == null ? void 0 : post.apiId) || (post == null ? void 0 : post.apiid) || "");
            const postedAtSource = ((_a = post == null ? void 0 : post.postedAt) == null ? void 0 : _a.datetime) || ((_b = post == null ? void 0 : post.postedAt) == null ? void 0 : _b.text) || (post == null ? void 0 : post.postedAt) || "";
            const formattedPostedAt = formatPostedAtForJapan(postedAtSource);
            return {
              ...post,
              streamId,
              apiId,
              postedAt: {
                text: formattedPostedAt.text || normalizeWhitespace(((_c = post == null ? void 0 : post.postedAt) == null ? void 0 : _c.text) || ""),
                datetime: formattedPostedAt.datetime || normalizeWhitespace(((_d = post == null ? void 0 : post.postedAt) == null ? void 0 : _d.datetime) || "")
              },
              alternateLink: normalizeWhitespace((post == null ? void 0 : post.alternateLink) || ""),
              courseId: normalizeWhitespace((post == null ? void 0 : post.courseId) || ""),
              courseName: normalizeWhitespace(
                (post == null ? void 0 : post.courseName) || (post == null ? void 0 : post.teacherName) || ""
              )
            };
          });
          resolve(normalized);
          db.close();
        };
        getAll.onerror = () => {
          reject(getAll.error);
          db.close();
        };
      };
    });
  }
  function findNewPosts(oldList, newList) {
    const known = /* @__PURE__ */ new Set();
    oldList.forEach((post, index) => {
      const id = ensureStableStreamId(post, index + 1);
      if (!id) return;
      known.add(id);
    });
    const fresh = [];
    newList.forEach((post, index) => {
      const id = ensureStableStreamId(post, index + 1);
      if (!id) return;
      if (known.has(id)) return;
      known.add(id);
      post.streamId = id;
      fresh.push(post);
    });
    return fresh;
  }
  function findRemovedPostIds(oldList, newList) {
    const previous = toArray(oldList);
    if (!previous.length) {
      return [];
    }
    const currentIds = /* @__PURE__ */ new Set();
    toArray(newList).forEach((post, index) => {
      const id = ensureStableStreamId(post, index + 1);
      if (!id) return;
      currentIds.add(id);
    });
    const removed = [];
    previous.forEach((post, index) => {
      const id = ensureStableStreamId(post, index + 1);
      if (!id) return;
      if (currentIds.has(id)) return;
      removed.push(id);
    });
    return removed;
  }
  async function removeStreamPostsByIds(ids = []) {
    const normalizedIds = Array.from(
      new Set(
        toArray(ids).map((id) => normalizeStreamId(id)).filter(Boolean)
      )
    );
    if (!normalizedIds.length) {
      return 0;
    }
    const request = openStreamDB();
    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction(STREAM_STORE_NAME, "readwrite");
        const store = tx.objectStore(STREAM_STORE_NAME);
        normalizedIds.forEach((id) => {
          try {
            store.delete(id);
          } catch (err) {
            gcxConsole.warn("[GCX] delete failed", { id, err });
          }
        });
        tx.oncomplete = () => {
          db.close();
          resolve(normalizedIds.length);
        };
        tx.onerror = () => {
          const error = tx.error || new Error("IndexedDB delete transaction failed");
          db.close();
          reject(error);
        };
        tx.onabort = () => {
          db.close();
          reject(new Error("IndexedDB delete transaction aborted"));
        };
      };
    });
  }

  // src/modules/content/auth.js
  var cachedChannelToken = null;
  var channelTokenPromise = null;
  async function ensureChannelToken() {
    if (cachedChannelToken) return cachedChannelToken;
    if (channelTokenPromise) return channelTokenPromise;
    channelTokenPromise = (async () => {
      const stored = await readChannelTokenFromStorage().catch(() => null);
      if (isValidChannelToken(stored)) {
        cachedChannelToken = stored;
        return stored;
      }
      const token = await requestChannelTokenFromBackground();
      cachedChannelToken = token;
      return token;
    })();
    try {
      return await channelTokenPromise;
    } finally {
      channelTokenPromise = null;
    }
  }
  function isValidChannelToken(value) {
    return typeof value === "string" && value.length >= CHANNEL_TOKEN_LENGTH;
  }
  function readChannelTokenFromStorage() {
    return new Promise((resolve) => {
      try {
        chrome.storage.local.get([CHANNEL_TOKEN_KEY], (items) => {
          if (chrome.runtime.lastError) {
            resolve(null);
            return;
          }
          resolve((items == null ? void 0 : items[CHANNEL_TOKEN_KEY]) || null);
        });
      } catch (err) {
        resolve(null);
      }
    });
  }
  function requestChannelTokenFromBackground() {
    return new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage({ type: "GCX_GET_CHANNEL_TOKEN" }, (res) => {
          const runtimeError = chrome.runtime.lastError;
          if (runtimeError) {
            reject(new Error(runtimeError.message));
            return;
          }
          if (!(res == null ? void 0 : res.ok) || !isValidChannelToken(res.channelToken)) {
            reject(
              new Error((res == null ? void 0 : res.error) || "Failed to obtain channel token from SW")
            );
            return;
          }
          resolve(res.channelToken);
        });
      } catch (err) {
        reject(err);
      }
    });
  }
  async function ensureServiceWorkerReady() {
    const maxRetries = 10;
    for (let i = 0; i < maxRetries; i++) {
      try {
        if (i === 0) gcxConsole.log("[GCX] \u{1F3D3} Checking Service Worker...");
        let channelToken;
        try {
          channelToken = await ensureChannelToken();
        } catch (error) {
          gcxConsole.error("[GCX] \u26A0\uFE0F Failed to obtain channel token", error);
          const fallbackDelay = 500 * Math.pow(2, i);
          await new Promise((resolve) => setTimeout(resolve, fallbackDelay));
          continue;
        }
        const ready = await new Promise((resolve) => {
          const timeoutId = setTimeout(() => resolve(false), 5e3);
          chrome.runtime.sendMessage(
            {
              type: "PING",
              channelToken,
              extensionId: chrome.runtime.id
            },
            (response) => {
              clearTimeout(timeoutId);
              if (chrome.runtime.lastError) {
                const errorMsg = chrome.runtime.lastError.message;
                if (errorMsg.includes("Extension context invalidated") || errorMsg.includes("Receiving end does not exist")) {
                  gcxConsole.error(
                    "[GCX] \u274C Extension was reloaded. Please reload this page!"
                  );
                }
                resolve(false);
              } else if ((response == null ? void 0 : response.pong) && (response == null ? void 0 : response.extensionName) === "Classroom-Finder" && (response == null ? void 0 : response.extensionId) === chrome.runtime.id) {
                if (i === 0) {
                  gcxConsole.log("[GCX] \u2713 Service Worker ready");
                }
                resolve(true);
              } else if (response == null ? void 0 : response.pong) {
                if (i === 0) {
                  gcxConsole.warn(
                    "[GCX] \u26A0\uFE0F Response from different extension, retrying..."
                  );
                }
                resolve(false);
              } else {
                gcxConsole.log("[GCX] \u26A0\uFE0F Unexpected response:", response);
                resolve(false);
              }
            }
          );
        });
        if (ready) return true;
        const delay = 500 * Math.pow(2, i);
        gcxConsole.log(`[GCX]    Waiting ${delay}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } catch (err) {
        gcxConsole.log("[GCX] \u26A0\uFE0F Service Worker ping error:", err);
      }
    }
    gcxConsole.error(
      "[GCX] \u274C Service Worker did not respond after",
      maxRetries,
      "retries"
    );
    return false;
  }
  async function clearAllAuthTokens() {
    await ensureServiceWorkerReady();
    let channelToken;
    try {
      channelToken = await ensureChannelToken();
    } catch (err) {
      gcxConsole.warn("[GCX] Failed to obtain channel token for clear tokens", err);
      return;
    }
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error("Clear tokens timeout (10s)"));
      }, 1e4);
      try {
        chrome.runtime.sendMessage(
          { type: "GCX_CLEAR_TOKENS", channelToken },
          (res) => {
            clearTimeout(timeoutId);
            const runtimeError = chrome.runtime.lastError;
            if (runtimeError) {
              gcxConsole.warn("[GCX] Failed to clear tokens:", runtimeError.message);
              resolve();
              return;
            }
            gcxConsole.log("[GCX] \u2713 All cached tokens cleared");
            resolve();
          }
        );
      } catch (err) {
        clearTimeout(timeoutId);
        gcxConsole.warn("[GCX] Clear tokens error:", err);
        resolve();
      }
    });
  }
  async function forceOAuthAuthentication(accountHint, identityAccounts2) {
    await ensureServiceWorkerReady();
    gcxConsole.log("[GCX] Forcing OAuth authentication for account:", accountHint);
    let channelToken;
    try {
      channelToken = await ensureChannelToken();
    } catch (err) {
      throw new Error(
        `Failed to obtain channel token for OAuth authentication: ${(err == null ? void 0 : err.message) || err}`
      );
    }
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error("OAuth authentication timeout (30s)"));
      }, 3e4);
      try {
        chrome.runtime.sendMessage(
          {
            type: "GCX_GOOGLE_GET_TOKEN",
            interactive: true,
            accountHint,
            channelToken
          },
          (res) => {
            clearTimeout(timeoutId);
            const runtimeError = chrome.runtime.lastError;
            if (runtimeError) {
              gcxConsole.error(
                "[GCX] OAuth authentication failed:",
                runtimeError.message
              );
              reject(new Error(runtimeError.message));
              return;
            }
            if (!res || !res.ok) {
              reject(new Error((res == null ? void 0 : res.error) || "OAuth authentication failed"));
              return;
            }
            gcxConsole.log("[GCX] \u2713 OAuth authentication successful");
            resolve(res.token);
          }
        );
      } catch (err) {
        clearTimeout(timeoutId);
        reject(err);
      }
    });
  }

  // src/modules/content/api.js
  async function bgFetch(request, accountHint, { sessionKey } = {}, attempt = 0) {
    if (attempt === 0) {
      await ensureServiceWorkerReady();
    }
    let channelToken;
    try {
      channelToken = await ensureChannelToken();
    } catch (err) {
      throw new Error(
        `Failed to obtain channel token for fetch: ${(err == null ? void 0 : err.message) || err}`
      );
    }
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error("Background fetch timeout (30s)"));
      }, 3e4);
      try {
        chrome.runtime.sendMessage(
          { type: "GCX_GOOGLE_FETCH", request, accountHint, channelToken },
          (res) => {
            clearTimeout(timeoutId);
            const runtimeError = chrome.runtime.lastError;
            if (runtimeError) {
              const message = runtimeError.message || "Extension runtime error";
              if (message.includes("Extension context invalidated")) {
                if (attempt < 2) {
                  const backoffMs = 500 * Math.pow(2, attempt);
                  gcxConsole.warn(
                    `[GCX] Extension context invalidated (retry ${attempt + 1}/2 after ${backoffMs}ms)`
                  );
                  setTimeout(() => {
                    bgFetch(request, accountHint, { sessionKey }, attempt + 1).then(resolve).catch(reject);
                  }, backoffMs);
                  return;
                }
                reject(
                  new Error(
                    "Extension context invalidated. Please reload the page."
                  )
                );
                return;
              }
              if (attempt < 3 && typeof message === "string" && (message.includes("message channel closed") || message.includes("message port closed"))) {
                const backoffMs = 500 * Math.pow(2, attempt);
                gcxConsole.warn(
                  `[GCX] ${message} (retry ${attempt + 1}/3 after ${backoffMs}ms)`
                );
                setTimeout(() => {
                  bgFetch(request, accountHint, { sessionKey }, attempt + 1).then(resolve).catch(reject);
                }, backoffMs);
                return;
              }
              reject(new Error(message));
              return;
            }
            if (!res) {
              if (attempt < 3) {
                const backoffMs = 500 * Math.pow(2, attempt);
                gcxConsole.warn(
                  `[GCX] No response (retry ${attempt + 1}/3 after ${backoffMs}ms)`
                );
                setTimeout(() => {
                  bgFetch(request, accountHint, { sessionKey }, attempt + 1).then(resolve).catch(reject);
                }, backoffMs);
                return;
              }
              reject(new Error("No response from background"));
              return;
            }
            if (!res.ok) {
              reject(new Error(res.error || `HTTP ${res.status}`));
              return;
            }
            resolve(res.data);
          }
        );
      } catch (err) {
        clearTimeout(timeoutId);
        reject(err);
      }
    });
  }
  async function listAllCourses() {
    var _a;
    const courses = [];
    let pageToken = void 0;
    do {
      const data = await bgFetch({
        path: "/courses",
        params: { courseStates: "ACTIVE", pageSize: 100, pageToken }
      });
      if ((_a = data == null ? void 0 : data.courses) == null ? void 0 : _a.length) courses.push(...data.courses);
      pageToken = (data == null ? void 0 : data.nextPageToken) || void 0;
    } while (pageToken);
    return courses;
  }
  async function listAnnouncementsForCourse(courseId) {
    var _a;
    const items = [];
    let pageToken = void 0;
    do {
      const data = await bgFetch({
        path: `/courses/${encodeURIComponent(courseId)}/announcements`,
        params: { pageSize: 100, pageToken, orderBy: "updateTime desc" }
      });
      if ((_a = data == null ? void 0 : data.announcements) == null ? void 0 : _a.length) items.push(...data.announcements);
      pageToken = (data == null ? void 0 : data.nextPageToken) || void 0;
    } while (pageToken);
    return items;
  }
  function mapAnnouncementToPost(ann, course, index, formatPostedAtForJapan2, normalizeAttachments2) {
    const apiId = normalizeWhitespace(ann.id || "");
    const id = normalizeWhitespace(ann.id || "");
    const teacherName = normalizeWhitespace((course == null ? void 0 : course.name) || "");
    const courseId = normalizeWhitespace((course == null ? void 0 : course.id) || "");
    const courseName = teacherName;
    const postedAtRaw = normalizeWhitespace(
      ann.updateTime || ann.creationTime || ""
    );
    const formattedPostedAt = formatPostedAtForJapan2(postedAtRaw);
    const bodyText = normalizeWhitespace(ann.text || "");
    const alternateLink = normalizeWhitespace(ann.alternateLink || "");
    return {
      index,
      apiId,
      streamId: id || null,
      courseId,
      courseName,
      teacherName,
      postedAt: {
        text: formattedPostedAt.text || postedAtRaw,
        datetime: formattedPostedAt.datetime || postedAtRaw
      },
      body: bodyText,
      alternateLink,
      attachments: normalizeAttachments2(ann.materials || [])
    };
  }
  async function fetchAllAnnouncementsPosts(normalizeAttachments2, formatPostedAtForJapan2) {
    const courses = await listAllCourses();
    const posts = [];
    let counter = 0;
    const concurrency = 2;
    let i = 0;
    async function worker() {
      while (i < courses.length) {
        const idx = i++;
        const course = courses[idx];
        try {
          if (idx > 0) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
          const anns = await listAnnouncementsForCourse(course.id);
          for (const ann of anns) {
            counter += 1;
            posts.push(mapAnnouncementToPost(ann, course, counter, formatPostedAtForJapan2, normalizeAttachments2));
          }
        } catch (err) {
          gcxConsole.warn(
            `[GCX] announcements fetch failed for course ${course == null ? void 0 : course.id} (${(course == null ? void 0 : course.name) || "unknown"})`,
            err.message || err
          );
        }
      }
    }
    await Promise.all(
      Array.from({ length: Math.min(concurrency, courses.length) }, worker)
    );
    return posts;
  }

  // src/modules/content/sync.js
  var syncInFlight = false;
  async function resetSearchResults(renderSuggestions2) {
    if (fuseInstance) {
      fuseInstance.setCollection([]);
    }
    renderSuggestions2([]);
  }
  async function syncStreamPosts(options = {}, dependencies) {
    const {
      ensureIdentityAccounts: ensureIdentityAccountsFn,
      getAccountHint: getAccountHintFn,
      fetchAllAnnouncementsPosts: fetchAllAnnouncementsFn,
      loadStreamPostsFromDb: loadStreamPostsFromDbFn,
      persistStreamData: persistStreamDataFn,
      findNewPosts: findNewPostsFn,
      findRemovedPostIds: findRemovedPostIdsFn,
      removeStreamPostsByIds: removeStreamPostsByIdsFn,
      clearAllAuthTokens: clearAllAuthTokensFn,
      forceOAuthAuthentication: forceOAuthAuthenticationFn,
      AccountIdentityHelper: AccountIdentityHelperClass,
      setTopbarPlaceholder: setTopbarPlaceholder2,
      renderSuggestions: renderSuggestions2,
      isAccountMismatchError: isAccountMismatchError2,
      rerunLastQuery: rerunLastQuery2
    } = dependencies;
    if (syncInFlight) return;
    syncInFlight = true;
    let savedPosts = [];
    try {
      await ensureIdentityAccountsFn();
      const currentFingerprint = AccountIdentityHelperClass.getFingerprint();
      const currentAccountKey = AccountIdentityHelperClass.getCompositeKey();
      const isManualRefresh = options.source === "manual";
      let lastAccountFingerprint2 = options.lastAccountFingerprint || null;
      let lastAccountKey2 = options.lastAccountKey || null;
      const accountSwitched = lastAccountFingerprint2 && lastAccountFingerprint2 !== currentFingerprint || lastAccountKey2 && lastAccountKey2 !== currentAccountKey;
      if (accountSwitched) {
        gcxConsole.log("[GCX] \u{1F504} Account switch detected!");
        gcxConsole.log("[GCX] Previous fingerprint:", lastAccountFingerprint2);
        gcxConsole.log("[GCX] Current fingerprint:", currentFingerprint);
        setTopbarPlaceholder2("\u30A2\u30AB\u30A6\u30F3\u30C8\u5207\u308A\u66FF\u3048\u3092\u691C\u77E5\u3057\u307E\u3057\u305F...");
        try {
          await clearAllAuthTokensFn();
          await new Promise((resolve) => setTimeout(resolve, 1e3));
          gcxConsole.log("[GCX] \u{1F513} Re-authenticating with new account...");
          await forceOAuthAuthenticationFn(getAccountHintFn(), options.identityAccounts || []);
          gcxConsole.log(
            "[GCX] \u2713 OAuth re-authentication completed after account switch"
          );
        } catch (authErr) {
          gcxConsole.error("[GCX] OAuth re-authentication failed:", authErr);
          if (isAccountMismatchError2(authErr)) {
            setTopbarPlaceholder2(PLACEHOLDER_ACCOUNT_MISMATCH);
            return;
          }
          setTopbarPlaceholder2("\u8A8D\u8A3C\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
          throw authErr;
        }
        savedPosts = await loadStreamPostsFromDbFn();
        if (fuseInstance) {
          fuseInstance.setCollection(savedPosts);
          gcxConsole.log(
            "[GCX] \u2713 Fuse re-initialized with",
            savedPosts.length,
            "posts from new account"
          );
          rerunLastQuery2();
        }
      }
      if (!accountSwitched) {
        savedPosts = await loadStreamPostsFromDbFn();
      }
      const currentPostsRaw = await fetchAllAnnouncementsFn();
      const existingPosts = toArray(savedPosts);
      const currentPosts = toArray(currentPostsRaw);
      const removedIds = findRemovedPostIdsFn(existingPosts, currentPosts);
      const newPosts = findNewPostsFn(existingPosts, currentPosts);
      let dataChanged = false;
      if (removedIds.length) {
        try {
          const removedCount = await removeStreamPostsByIdsFn(removedIds);
          if (removedCount > 0) {
            dataChanged = true;
          }
        } catch (err) {
          gcxConsole.warn("[GCX] remove stream posts failed", err);
        }
      }
      if (newPosts.length) {
        const result = await persistStreamDataFn(newPosts);
        if (result == null ? void 0 : result.stored) {
          dataChanged = true;
        }
      }
      if (dataChanged) {
        const updated = await loadStreamPostsFromDbFn();
        if (fuseInstance) {
          fuseInstance.setCollection(updated);
          rerunLastQuery2();
        }
      } else if (!existingPosts.length) {
        await resetSearchResults(renderSuggestions2);
      }
      if (!options.keepPlaceholder) {
        setTopbarPlaceholder2(PLACEHOLDER_DEFAULT);
      }
    } catch (error) {
      if (!savedPosts.length) {
        await resetSearchResults(renderSuggestions2);
      }
      throw error;
    } finally {
      syncInFlight = false;
    }
  }

  // src/content.entry.js
  var identityAccounts = [];
  var lastAccountFingerprint = null;
  var lastAccountKey = null;
  var lastQuery = "";
  var topbarObserver = null;
  var topbarCheckInterval = null;
  var accountSwitchCheckInterval = null;
  var accountSwitchReloadedKeys = /* @__PURE__ */ new Set();
  var accountSwitchSuccessMessageActive = false;
  var accountInitialized = false;
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") return;
    if (Object.prototype.hasOwnProperty.call(changes, "gcxMessageChannelToken")) {
    }
  });
  function isAccountMismatchError(error) {
    const message = String((error == null ? void 0 : error.message) || error || "").toLowerCase();
    return message.includes("account mismatch") || message.includes("account key mismatch") || message.includes("fingerprint mismatch");
  }
  function resolveRefreshErrorPlaceholder(error) {
    if (!error) {
      return "\u540C\u671F\u306B\u5931\u6557\u3057\u307E\u3057\u305F";
    }
    const message = String((error == null ? void 0 : error.message) || error || "").toLowerCase();
    if (isAccountMismatchError(error)) {
      return PLACEHOLDER_ACCOUNT_MISMATCH;
    }
    if (/(quota|ratelimit|too many|429)/.test(message)) {
      return "\u30A2\u30AF\u30BB\u30B9\u304C\u591A\u3059\u304E\u307E\u3059\u3002\u3057\u3070\u3089\u304F\u5F85\u3063\u3066\u304B\u3089\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044";
    }
    if (["no response from background"].some((keyword) => message.includes(keyword))) {
      return PLACEHOLDER_RELOAD_REQUIRED;
    }
    if ([
      "getauthtoken",
      "oauth",
      "no token",
      "not authorized",
      "authorization",
      "http 401"
    ].some((keyword) => message.includes(keyword))) {
      return PLACEHOLDER_LOGIN_REQUIRED;
    }
    return "\u540C\u671F\u306B\u5931\u6557\u3057\u307E\u3057\u305F";
  }
  function checkTopbarPresence() {
    const existing = document.getElementById("gcx-topbar-overlay");
    if (!existing || !document.body.contains(existing)) {
      gcxConsole.debug("[GCX] Topbar missing, re-injecting");
      ensureTopbar(uiHandlers);
    }
  }
  function setupTopbarObserver() {
    if (topbarObserver) return;
    topbarObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.removedNodes) {
          if (node.id === "gcx-topbar-overlay" || node.contains && node.contains(document.getElementById("gcx-topbar-overlay"))) {
            gcxConsole.debug("[GCX] Topbar removed by DOM mutation, re-injecting");
            ensureTopbar(uiHandlers);
            return;
          }
        }
      }
    });
    topbarObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  function setupTopbarCheckInterval() {
    if (topbarCheckInterval) return;
    topbarCheckInterval = setInterval(checkTopbarPresence, 3e4);
  }
  function setupAccountSwitchDetection() {
    if (accountSwitchCheckInterval) return;
    const checkAccountSwitch = () => {
      void detectAccountSwitch("interval");
    };
    accountSwitchCheckInterval = setInterval(checkAccountSwitch, 1500);
    window.addEventListener("focus", () => {
      void detectAccountSwitch("focus");
    });
  }
  async function readAuthInitState() {
    return new Promise((resolve) => {
      try {
        chrome.storage.local.get([AUTH_INIT_STATE_KEY], (items) => {
          if (chrome.runtime.lastError) {
            resolve({});
            return;
          }
          const raw = items == null ? void 0 : items[AUTH_INIT_STATE_KEY];
          if (raw && typeof raw === "object" && !Array.isArray(raw)) {
            resolve({ ...raw });
          } else {
            resolve({});
          }
        });
      } catch (err) {
        resolve({});
      }
    });
  }
  async function writeAuthInitState(state) {
    return new Promise((resolve) => {
      try {
        chrome.storage.local.set({ [AUTH_INIT_STATE_KEY]: state }, () => {
          resolve();
        });
      } catch (err) {
        resolve();
      }
    });
  }
  async function isAuthInitializedForKey(accountKey) {
    if (!accountKey) return false;
    const state = await readAuthInitState();
    return Boolean(state == null ? void 0 : state[accountKey]);
  }
  async function markAuthInitialized(accountKey) {
    if (!accountKey) return;
    const state = await readAuthInitState();
    if (state[accountKey]) return;
    state[accountKey] = Date.now();
    await writeAuthInitState(state);
  }
  async function readAccountSwitchState() {
    return new Promise((resolve) => {
      try {
        chrome.storage.local.get([ACCOUNT_SWITCH_STATE_KEY], (items) => {
          if (chrome.runtime.lastError) {
            resolve({});
            return;
          }
          const raw = items == null ? void 0 : items[ACCOUNT_SWITCH_STATE_KEY];
          if (raw && typeof raw === "object" && !Array.isArray(raw)) {
            resolve({ ...raw });
          } else {
            resolve({});
          }
        });
      } catch (err) {
        resolve({});
      }
    });
  }
  async function writeAccountSwitchState(state) {
    return new Promise((resolve) => {
      try {
        chrome.storage.local.set({ [ACCOUNT_SWITCH_STATE_KEY]: state }, () => {
          resolve();
        });
      } catch (err) {
        resolve();
      }
    });
  }
  function getAccountSnapshot() {
    const fingerprint = AccountIdentityHelper.getFingerprint();
    const accountKey = AccountIdentityHelper.getCompositeKey();
    const gaiaId = getClassroomGaiaId();
    const email = getClassroomAccountEmail();
    return {
      fingerprint,
      accountKey,
      gaiaId,
      email,
      hasSignal: Boolean(gaiaId || email)
    };
  }
  function applyAccountSwitchSuccessPlaceholder() {
    if (accountSwitchSuccessMessageActive) {
      setTopbarPlaceholder(PLACEHOLDER_ACCOUNT_SWITCH_SUCCESS);
    }
  }
  async function handleAccountSwitchReload(previousState, currentSnapshot) {
    if (!currentSnapshot.hasSignal) {
      return false;
    }
    const previousFingerprint = (previousState == null ? void 0 : previousState.fingerprint) || null;
    const previousAccountKey = (previousState == null ? void 0 : previousState.accountKey) || null;
    if (!previousFingerprint && !previousAccountKey) {
      return false;
    }
    const switched = previousFingerprint && previousFingerprint !== currentSnapshot.fingerprint || previousAccountKey && previousAccountKey !== currentSnapshot.accountKey;
    if (!switched) {
      return false;
    }
    const attemptKey = `${previousFingerprint || "none"}->${currentSnapshot.fingerprint || "none"}`;
    if (accountSwitchReloadedKeys.has(attemptKey)) {
      return false;
    }
    accountSwitchReloadedKeys.add(attemptKey);
    accountSwitchSuccessMessageActive = false;
    setTopbarPlaceholder("\u30A2\u30AB\u30A6\u30F3\u30C8\u5207\u308A\u66FF\u3048\u3092\u691C\u77E5\u3057\u307E\u3057\u305F...");
    try {
      await syncStreamPosts(
        {
          source: "account-switch",
          lastAccountFingerprint: previousFingerprint,
          lastAccountKey: previousAccountKey,
          identityAccounts,
          keepPlaceholder: true
        },
        syncDependencies
      );
      accountSwitchSuccessMessageActive = true;
      setTopbarPlaceholder(PLACEHOLDER_ACCOUNT_SWITCH_SUCCESS);
    } catch (err) {
      accountSwitchSuccessMessageActive = false;
      setTopbarPlaceholder(resolveRefreshErrorPlaceholder(err));
    } finally {
      lastAccountFingerprint = currentSnapshot.fingerprint;
      lastAccountKey = currentSnapshot.accountKey;
      await writeAccountSwitchState({
        fingerprint: currentSnapshot.fingerprint,
        accountKey: currentSnapshot.accountKey,
        updatedAt: Date.now()
      });
    }
    return true;
  }
  async function detectAccountSwitch(reason) {
    const currentSnapshot = getAccountSnapshot();
    const previousState = {
      fingerprint: lastAccountFingerprint,
      accountKey: lastAccountKey
    };
    const switched = await handleAccountSwitchReload(previousState, currentSnapshot);
    if (!switched && currentSnapshot.hasSignal) {
      if (currentSnapshot.fingerprint !== lastAccountFingerprint || currentSnapshot.accountKey !== lastAccountKey) {
        lastAccountFingerprint = currentSnapshot.fingerprint;
        lastAccountKey = currentSnapshot.accountKey;
      }
      await writeAccountSwitchState({
        fingerprint: currentSnapshot.fingerprint,
        accountKey: currentSnapshot.accountKey,
        updatedAt: Date.now()
      });
    }
    if (reason === "initial") {
      applyAccountSwitchSuccessPlaceholder();
    }
  }
  async function ensureIdentityAccounts() {
    if (identityAccounts.length) return identityAccounts;
    let channelToken;
    try {
      channelToken = await ensureChannelToken();
    } catch (err) {
      gcxConsole.warn("[GCX] Failed to obtain channel token for identity list", err);
      return identityAccounts;
    }
    try {
      const accounts = await new Promise((resolve) => {
        const timeoutId = setTimeout(() => {
          resolve([]);
        }, 1e4);
        chrome.runtime.sendMessage(
          { type: "GCX_IDENTITY_LIST", channelToken },
          (res) => {
            clearTimeout(timeoutId);
            if (chrome.runtime.lastError) {
              resolve([]);
              return;
            }
            if (!res || !Array.isArray(res.accounts)) {
              resolve([]);
              return;
            }
            resolve(res.accounts);
          }
        );
      });
      if (Array.isArray(accounts)) {
        identityAccounts = accounts;
      }
    } catch (err) {
      gcxConsole.debug("[GCX] failed to load identity accounts", err);
    }
    return identityAccounts;
  }
  var uiHandlers = {
    onSearchInput: (event) => {
      const query = event.target.value.trim();
      lastQuery = query;
      renderSuggestions(collectTopMatches(query), uiHandlers);
    },
    onInputFocus: (value) => {
      if (value) {
        renderSuggestions(collectTopMatches(value), uiHandlers);
      }
    },
    onRefreshClick: async () => {
      if (!API_MODE) {
        throw new Error("API mode disabled");
      }
      setTopbarPlaceholder("\u8A8D\u8A3C\u4E2D...");
      try {
        await clearAllAuthTokens();
        await forceOAuthAuthentication(getAccountHint(identityAccounts), identityAccounts);
        gcxConsole.log("[GCX] OAuth re-authentication completed");
      } catch (authErr) {
        gcxConsole.error("[GCX] OAuth re-authentication failed:", authErr);
        setTopbarPlaceholder("\u8A8D\u8A3C\u306B\u5931\u6557\u3057\u307E\u3057\u305F");
        throw authErr;
      }
      setTopbarPlaceholder("\u30C7\u30FC\u30BF\u3092\u53D6\u5F97\u4E2D...");
      await syncStreamPosts(buildSyncOptions({ source: "manual" }), syncDependencies);
      applyAccountSwitchSuccessPlaceholder();
      setTopbarPlaceholder("");
    },
    flashRefreshError: (err) => {
      const button = document.querySelector(".gcx-refresh-btn");
      if (!button) return;
      button.classList.add("is-error");
      setTopbarPlaceholder(resolveRefreshErrorPlaceholder(err));
      if (window.__refreshErrorTimerId) {
        clearTimeout(window.__refreshErrorTimerId);
      }
      window.__refreshErrorTimerId = window.setTimeout(() => {
        button.classList.remove("is-error");
        window.__refreshErrorTimerId = null;
        setTopbarPlaceholder(PLACEHOLDER_DEFAULT);
      }, 1500);
    },
    setTopbarPlaceholder,
    handleSuggestionActivation: (item) => handleSuggestionActivation(item, uiHandlers),
    bgFetch,
    renderSuggestions,
    collectTopMatches,
    fuseInstance
  };
  var syncDependencies = {
    ensureIdentityAccounts,
    getAccountHint: () => getAccountHint(identityAccounts),
    fetchAllAnnouncementsPosts: () => fetchAllAnnouncementsPosts(normalizeAttachments, formatPostedAtForJapan),
    loadStreamPostsFromDb,
    persistStreamData,
    findNewPosts,
    findRemovedPostIds,
    removeStreamPostsByIds,
    clearAllAuthTokens,
    forceOAuthAuthentication,
    AccountIdentityHelper,
    setTopbarPlaceholder,
    renderSuggestions: (results) => renderSuggestions(results, uiHandlers),
    isAccountMismatchError,
    rerunLastQuery: () => rerunLastQuery(lastQuery, collectTopMatches, (results) => renderSuggestions(results, uiHandlers), uiHandlers)
  };
  function buildSyncOptions(extra = {}) {
    return {
      lastAccountFingerprint,
      lastAccountKey,
      identityAccounts,
      ...extra
    };
  }
  async function observe() {
    ensureTopbar(uiHandlers);
    setupTopbarObserver();
    setupTopbarCheckInterval();
    try {
      await ensureIdentityAccounts();
      const storedSwitchState = await readAccountSwitchState();
      const snapshot = getAccountSnapshot();
      if (storedSwitchState.fingerprint || storedSwitchState.accountKey) {
        lastAccountFingerprint = storedSwitchState.fingerprint || null;
        lastAccountKey = storedSwitchState.accountKey || null;
        await handleAccountSwitchReload(storedSwitchState, snapshot);
      } else {
        lastAccountFingerprint = snapshot.fingerprint;
        lastAccountKey = snapshot.accountKey;
        await writeAccountSwitchState({
          fingerprint: snapshot.fingerprint,
          accountKey: snapshot.accountKey,
          updatedAt: Date.now()
        });
      }
      const initialFingerprint = snapshot.fingerprint;
      accountInitialized = true;
      gcxConsole.log("[GCX] Account initialized:", {
        fingerprint: initialFingerprint,
        index: AccountIdentityHelper.getIndexNumber(),
        gaiaId: getClassroomGaiaId(),
        email: getClassroomAccountEmail(),
        dbName: getStreamDbName()
      });
      const accountKey = AccountIdentityHelper.getCompositeKey();
      const alreadyInitialized = await isAuthInitializedForKey(accountKey);
      if (!alreadyInitialized) {
        gcxConsole.log("[GCX] \u{1F513} Requesting initial OAuth authentication...");
        try {
          await forceOAuthAuthentication(getAccountHint(identityAccounts), identityAccounts);
          gcxConsole.log("[GCX] \u2713 Initial OAuth authentication successful");
          await markAuthInitialized(accountKey);
        } catch (authErr) {
          gcxConsole.error("[GCX] \u274C Initial OAuth authentication failed:", authErr);
          if (isAccountMismatchError(authErr)) {
            setTopbarPlaceholder(PLACEHOLDER_ACCOUNT_MISMATCH);
          } else {
            setTopbarPlaceholder(
              "\u8A8D\u8A3C\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u66F4\u65B0\u30DC\u30BF\u30F3\u3092\u30AF\u30EA\u30C3\u30AF\u3057\u3066\u304F\u3060\u3055\u3044\u3002"
            );
          }
        }
      } else {
        gcxConsole.log("[GCX] OAuth already initialized for account key:", accountKey);
      }
    } catch (err) {
      gcxConsole.warn("[GCX] Failed to initialize account info", err);
    }
    setupAccountSwitchDetection();
    void syncStreamPosts(buildSyncOptions(), syncDependencies).then(() => {
      applyAccountSwitchSuccessPlaceholder();
    }).catch((err) => {
      if (err && err.message && err.message.includes("Extension context invalidated")) {
        gcxConsole.warn(
          "[GCX] Extension context invalidated. Please reload the page."
        );
        setTopbarPlaceholder(
          "\u62E1\u5F35\u6A5F\u80FD\u304C\u66F4\u65B0\u3055\u308C\u307E\u3057\u305F\u3002\u30DA\u30FC\u30B8\u3092\u30EA\u30ED\u30FC\u30C9\u3057\u3066\u304F\u3060\u3055\u3044\u3002"
        );
        return;
      }
      gcxConsole.warn("[GCX] Periodic fetch failed", err);
      uiHandlers.flashRefreshError(err);
    });
    if (POLL_INTERVAL_MS > 0) {
      setInterval(() => {
        checkTopbarPresence();
        void syncStreamPosts(buildSyncOptions(), syncDependencies).then(() => {
          applyAccountSwitchSuccessPlaceholder();
        }).catch((err) => {
          if (err && err.message && err.message.includes("Extension context invalidated")) {
            gcxConsole.warn(
              "[GCX] Extension context invalidated. Please reload the page."
            );
            setTopbarPlaceholder(
              "\u62E1\u5F35\u6A5F\u80FD\u304C\u66F4\u65B0\u3055\u308C\u307E\u3057\u305F\u3002\u30DA\u30FC\u30B8\u3092\u30EA\u30ED\u30FC\u30C9\u3057\u3066\u304F\u3060\u3055\u3044\u3002"
            );
            return;
          }
          gcxConsole.warn("[GCX] Periodic fetch failed", err);
          uiHandlers.flashRefreshError(err);
        });
      }, POLL_INTERVAL_MS);
    }
  }
  async function init() {
    gcxConsole.log("[GCX] \u{1F680} Waking up Service Worker...");
    await ensureServiceWorkerReady();
    gcxConsole.log("[GCX] \u2713 Service Worker is active");
    ensureTopbar(uiHandlers);
    await loadLocalLibs();
    if (API_MODE) {
      try {
        await syncStreamPosts(buildSyncOptions(), syncDependencies);
        applyAccountSwitchSuccessPlaceholder();
      } catch (error) {
        gcxConsole.warn("[GCX] Initial fetch failed", error);
        uiHandlers.flashRefreshError(error);
      }
    } else {
      gcxConsole.info("[GCX] API mode=false (disabled)");
    }
    await initFuse(await loadStreamPostsFromDb());
    observe();
    gcxConsole.debug("[GCX] search input injection initialized");
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
  if (typeof window !== "undefined") {
    window.__gcxDebug = {
      loadStreamPostsFromDb,
      syncStreamPosts: (opts) => syncStreamPosts(opts, syncDependencies),
      getFuse: () => fuseInstance,
      runSearchPreview: (query) => collectTopMatches(query),
      getAccountHint: () => getAccountHint(identityAccounts),
      getClassroomGaiaId,
      getClassroomAccountEmail
    };
  }
})();
