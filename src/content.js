// Bootstrap constants and style injector (recreated)
const TOPBAR_SELECTOR = 'nav.joJglb[role="navigation"]';
const STYLE_ID = "gcx-sarch-style";
const TOPBAR_WRAP = "gcx-topbar";
const TOPBAR_INPUT = "gcx-topbar-input";

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    /* Top bar quick search */
    .${TOPBAR_WRAP} {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      max-width: 420px;
      min-width: 220px;
      margin-left: auto; /* prefer right side when nav uses flex */
      padding: 0 6px;
    }
    .${TOPBAR_WRAP} > input.${TOPBAR_INPUT} {
      box-sizing: border-box;
      width: 100%;
      height: 36px;
      padding: 0 12px 0 32px; /* space for icon */
      border: 1px solid rgba(95,99,104,0.3);
      border-radius: 16px;
      background: rgba(255,255,255,0.8);
      color: inherit;
      outline: none;
      transition: border-color .15s ease, box-shadow .15s ease, background .15s ease;
    }
    .${TOPBAR_WRAP} > input.${TOPBAR_INPUT}::placeholder { color: #5f6368; }
    .${TOPBAR_WRAP} > input.${TOPBAR_INPUT}:focus {
      border-color: #1a73e8;
      box-shadow: 0 0 0 3px rgba(26,115,232,0.15);
      background: #fff;
    }
    .${TOPBAR_WRAP}::before {
      content: '';
      position: absolute;
      left: 12px;
      width: 14px;
      height: 14px;
      border: 2px solid currentColor;
      border-radius: 50%;
      opacity: 0.55;
      pointer-events: none;
    }
    .${TOPBAR_WRAP}::after {
      content: '';
      position: absolute;
      left: 24px;
      top: 18px;
      width: 8px;
      height: 2px;
      background: currentColor;
      transform: rotate(45deg);
      opacity: 0.55;
      pointer-events: none;
    }
    .${TOPBAR_WRAP}[data-overlay="1"] {
      position: absolute !important;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      margin-left: 0 !important;
      max-width: min(560px, 70vw);
      width: clamp(220px, 40vw, 420px);
      z-index: 10;
    }
  `;
  document.head.appendChild(style);
}

// Back-compat alias if code calls lower-case name
const ensurestyle = ensureStyles;

// ===== Optional CDN library bootstrap (dev/off by default) =====
// Note: Chrome Web Store policy forbids remotely hosted code for published extensions.
// This loader is disabled by default and intended for local/dev use only.
// Enable by setting localStorage.GCX_USE_CDN = '1'.

const GCX_CDN_FLAG = 'GCX_USE_CDN';
const GCX_LIBS_FLAG = 'GCX_LIBS'; // comma: e.g. "fuse,idb,hotkeys"

function preconnect(href) {
  if (document.head.querySelector(`link[rel="preconnect"][href="${href}"]`)) return;
  const l1 = document.createElement('link');
  l1.rel = 'preconnect';
  l1.href = href;
  l1.crossOrigin = 'anonymous';
  document.head.appendChild(l1);
  const l2 = document.createElement('link');
  l2.rel = 'dns-prefetch';
  l2.href = href;
  document.head.appendChild(l2);
}

function addScript(src, attrs = {}) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    for (const [k, v] of Object.entries(attrs)) {
      if (v != null) s.setAttribute(k, v);
    }
    s.addEventListener('load', () => resolve(src));
    s.addEventListener('error', () => reject(new Error(`Failed: ${src}`)));
    document.head.appendChild(s);
  });
}

const CDN = {
  // Licenses: all MIT at the time of writing
  fuse: {
    marker: 'Fuse',
    scripts: [
      'https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/fuse.js/6.6.2/fuse.min.js',
      'https://unpkg.com/fuse.js@6.6.2/dist/fuse.min.js',
    ],
  },
  idb: {
    marker: 'idb',
    scripts: [
      'https://cdn.jsdelivr.net/npm/idb@7.1.1/build/iife/index-min.js',
      'https://unpkg.com/idb@7.1.1/build/iife/index-min.js',
    ],
  },
  hotkeys: {
    marker: 'hotkeys',
    scripts: [
      'https://cdn.jsdelivr.net/npm/hotkeys-js@3.13.8/dist/hotkeys.min.js',
      'https://unpkg.com/hotkeys-js@3.13.8/dist/hotkeys.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/hotkeys-js/3.13.8/hotkeys.min.js',
    ],
  },
};

function bestOrigins(urls) {
  ['https://cdn.jsdelivr.net', 'https://unpkg.com', 'https://cdnjs.cloudflare.com'].forEach(preconnect);
  return urls;
}

function alreadyInjected(marker) {
  return !!document.head.querySelector(`script[data-gcx-lib="${marker}"]`);
}

function injectLib(name) {
  const spec = CDN[name];
  if (!spec) return Promise.resolve(false);
  if (alreadyInjected(spec.marker)) return Promise.resolve(true);
  const urls = bestOrigins(spec.scripts);
  let p = Promise.reject();
  urls.forEach((u) => {
    p = p.catch(() => addScript(u, { 'data-gcx-lib': spec.marker, crossorigin: 'anonymous', referrerpolicy: 'no-referrer' }));
  });
  return p.then(() => {
    window.dispatchEvent(new CustomEvent('gcx:cdn-loaded', { detail: { lib: name, ok: true } }));
    return true;
  }).catch((err) => {
    window.dispatchEvent(new CustomEvent('gcx:cdn-loaded', { detail: { lib: name, ok: false, error: String(err) } }));
    return false;
  });
}

async function maybeLoadCDNs() {
  try {
    const allow = (localStorage.getItem(GCX_CDN_FLAG) === '1') || document.documentElement.getAttribute('data-gcx-cdn') === '1';
    if (!allow) return false;
    const list = (localStorage.getItem(GCX_LIBS_FLAG) || 'fuse,idb').split(',').map((s) => s.trim()).filter(Boolean);
    const results = await Promise.all(list.map(injectLib));
    return results.every(Boolean);
  } catch {
    return false;
  }
}


// (menu-side search injection removed; fixed to topbar only)

// ===== Top bar UI (nav.joJglb) =====
function hasTopbar(navEl) {
  return !!navEl.querySelector(`:scope > .${TOPBAR_WRAP}`);
}

function createTopbar(navEl) {
  const wrap = document.createElement("div");
  wrap.className = TOPBAR_WRAP;
  wrap.setAttribute("role", "search");
  wrap.setAttribute("aria-label", "クイック検索");

  const input = document.createElement("input");
  input.type = "search";
  input.className = TOPBAR_INPUT;
  input.placeholder = "クラス全体を検索…";
  input.setAttribute("role", "searchbox");
  input.autocapitalize = "off";
  input.autocomplete = "off";
  input.spellcheck = false;

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

  wrap.appendChild(input);
  return wrap;
}

// unifyStyleFromMenuItem removed (topbar-only now)

// menu-side helpers removed

function placeTopbar(navEl, bar) {
  const cs = getComputedStyle(navEl);
  // Try to place after brand link if exists
  const brand =
    navEl.querySelector("a.onkcGd") || navEl.querySelector("a[aria-label]");
  if (brand && brand.parentElement === navEl) {
    brand.insertAdjacentElement("afterend", bar);
  } else {
    navEl.appendChild(bar);
  }

  // If nav is not flex, or overlap detected, switch to overlay mode
  const isFlex = cs.display.includes("flex");
  if (cs.position === "static") navEl.style.position = "relative";

  requestAnimationFrame(() => {
    const barRect = bar.getBoundingClientRect();
    let overlapped = false;
    if (!isFlex) {
      overlapped = true;
    } else {
      const others = Array.from(
        navEl.querySelectorAll('a,button,[role="button"],input')
      ).filter((el) => el !== bar && !bar.contains(el));
      for (const el of others) {
        const r = el.getBoundingClientRect();
        const xOverlap = Math.max(
          0,
          Math.min(barRect.right, r.right) - Math.max(barRect.left, r.left)
        );
        const yOverlap = Math.max(
          0,
          Math.min(barRect.bottom, r.bottom) - Math.max(barRect.top, r.top)
        );
        if (xOverlap > 0 && yOverlap > 0) {
          overlapped = true;
          break;
        }
      }
    }
    if (overlapped) {
      bar.setAttribute("data-overlay", "1");
    } else {
      bar.removeAttribute("data-overlay");
    }
  });
}

function injectTopbar(root = document) {
  let added = 0;
  root.querySelectorAll(TOPBAR_SELECTOR).forEach((navEl) => {
    if (hasTopbar(navEl)) return;
    const bar = createTopbar(navEl);
    placeTopbar(navEl, bar);
    added++;
  });
  return added > 0;
}

function scanAndInject(root = document) {
  injectTopbar(root);
}

function observe() {
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'childList') {
        injectTopbar();
        break;
      }
    }
  });
  observer.observe(document.documentElement || document, {
    childList: true,
    subtree: true,
  });
  // Fallback: periodic check in case some mutations are missed
  setInterval(() => injectTopbar(), 2000);
}

function init() {
  ensureStyles();
  // Optional: preload CDN libs when explicitly enabled (dev)
  maybeLoadCDNs();
  scanAndInject();
  observe();
  console.debug("[GCX] sarch input injection initialized");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
