// Google Classroom のトップバーへ「クイック検索」UIを挿入するスクリプト
// - ネットワーク通信は行わず、DOM 監視で UI を差し込むだけ
// - スタイルは外部 CSS を <link> で一度だけ注入（UI 本体は後段で生成）
// - 検索アイコンは before/after の疑似要素で CSS 描画（画像やアイコンフォント不要）
// ここから定数定義とスタイル注入ヘルパー
const STYLE_ID = "gcx-sarch-style"; // 注入する <link> の id（重複防止）
const STYLE_PATH = "src/gcx-topbar.css"; // 読み込むスタイルシートのパス
const TOPBAR_WRAP = "gcx-topbar"; // 検索 UI ラッパーのクラス
const TOPBAR_INPUT = "gcx-topbar-input"; // 検索入力のクラス
const TOPBAR_ID = "gcx-topbar-overlay"; // DOM 上の ID（重複防止）

// 注意: ensureStyles は CSS を注入するだけ。検索 UI 本体は createTopbar()/injectTopbar() で生成・挿入。
function ensureStyles() {
  const href = getExtensionURL(STYLE_PATH);
  const existing = document.getElementById(STYLE_ID);
  if (existing) {
    const current = existing.getAttribute("href");
    if (existing.tagName === "LINK" && current === href) {
      return;
    }
    existing.remove();
  }

  const link = document.createElement("link");
  link.id = STYLE_ID;
  link.rel = "stylesheet";
  link.href = href;
  link.addEventListener("error", () => {
    console.warn(`[GCX] Failed to load stylesheet from ${href}`);
  });
  document.head.appendChild(link);
}

// 後方互換用の別名（古いコードが小文字関数名を呼ぶ場合のため）
const ensurestyle = ensureStyles;

// ===== ローカル配布ライブラリ ローダー =====
const LIB_SPECS = {
  fuse: {
    marker: "Fuse", // 名札（<script data-gcx-lib="Fuse">）重複注入の識別に使用
    sources: ["src/libs/fuse.min.js"],
  },
  idb: {
    marker: "idb",
    sources: ["src/libs/idb.min.js"],
  },
  hotkeys: {
    marker: "hotkeys",
    sources: ["src/libs/hotkeys.min.js"],
  },
};

function getExtensionURL(relativePath) {
  try {
    if (typeof chrome !== "undefined" && chrome.runtime?.getURL) {
      return chrome.runtime.getURL(relativePath);
    }
  } catch {
    // no-op: Firefox などの互換 API へフォールバック
  }
  if (typeof browser !== "undefined" && browser.runtime?.getURL) {
    return browser.runtime.getURL(relativePath);
  }
  return relativePath;
}

function addScript(src, attrs = {}) {
  // 動的に <script> を生成して読み込む
  // - src: URL 文字列（相対/絶対）
  // - attrs: { 属性名: 値 } のプレーンオブジェクト（data-* 等を想定）
  // - 成功(load): 実行完了後に src で resolve
  // - 失敗(error): エラーで reject
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true; // 動的挿入の既定。順序保証はしないため依存順は呼び出し側で await 直列化する。
    // 属性は data-* を中心に明示付与（重複注入の検知や CORS 制御に利用）
    for (const [k, v] of Object.entries(attrs)) {
      if (v != null) s.setAttribute(k, v); // 値は文字列化される。ブール属性は presence 管理が必要な場合あり。
    }
    s.addEventListener("load", () => resolve(src));
    s.addEventListener("error", () => reject(new Error(`Failed: ${src}`)));
    document.head.appendChild(s);
  });
}

function alreadyInjected(marker) {
  // 既に同じ名札(data-gcx-lib)の <script> が head にあるか
  return !!document.head.querySelector(`script[data-gcx-lib="${marker}"]`);
}

// 指定ライブラリを拡張パッケージから読み込む（開発・本番共通）
// 戻り値: Promise<boolean>（成功 true / 全候補失敗 false）
// 手順:
//  1) 定義がない場合は false
//  2) 既に注入済みなら true
//  3) 候補 URL を順に直列で試す（最初に成功した時点で終了）
//  4) 結果を CustomEvent "gcx:libs-loaded" で通知
async function injectLib(name) {
  const spec = LIB_SPECS[name];
  if (!spec) return false;
  if (alreadyInjected(spec.marker)) return true;
  let lastErr; // 直近の失敗（全滅時のイベント detail 用）
  for (const relative of spec.sources) {
    const url = getExtensionURL(relative);
    try {
      await addScript(url, { "data-gcx-lib": spec.marker });
      const detail = {
        name,
        success: true,
        message: "",
        source: url,
      };
      window.dispatchEvent(new CustomEvent("gcx:libs-loaded", { detail }));
      return true;
    } catch (err) {
      lastErr = err;
    }
  }

  const detail = {
    name,
    success: false,
    message: String(lastErr || ""),
    source: LIB_SPECS[name]?.sources.at(-1) || "",
  };
  window.dispatchEvent(new CustomEvent("gcx:libs-loaded", { detail }));
  return false;
}

// ローカルバンドルをまとめて読み込む
async function loadLocalLibs() {
  try {
    const names = Object.keys(LIB_SPECS);
    const results = await Promise.all(names.map((name) => injectLib(name)));
    return results.every(Boolean);
  } catch {
    return false;
  }
}

// メニュー側への注入は削除し、トップバー専用に単純化

// ===== トップバー UI（固定オーバーレイ） =====
function createTopbar() {
  // 検索コンテナを生成（ロールとラベルは ARIA を付与）
  const wrap = document.createElement("div");
  wrap.classList.add(TOPBAR_WRAP);
  wrap.setAttribute("role", "search");
  wrap.setAttribute("aria-label", "クイック検索");

  const input = document.createElement("input");
  input.type = "search";
  input.classList.add(TOPBAR_INPUT);
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

function ensureTopbar() {
  ensureStyles();
  if (!document.body) return null;

  let topbar = document.getElementById(TOPBAR_ID);
  if (!topbar) {
    topbar = createTopbar();
    topbar.id = TOPBAR_ID;
    document.body.appendChild(topbar);
  }
  return topbar;
}

function observe() {
  // DOM 変化を監視し、必要に応じて再注入（軽量）
  const observer = new MutationObserver((mutations) => {
    if (mutations.some((m) => m.type === "childList")) {
      ensureTopbar();
    }
  });
  const target = document.body || document.documentElement;
  if (target) {
    observer.observe(target, {
      childList: true,
    });
  }
  // 監視で取りこぼした場合のフォールバックとして定期チェック
  setInterval(() => ensureTopbar(), 2000);
}

function init() {
  // 初期化フロー: スタイル注入 → ライブラリ読み込み → UI 注入 → DOM 監視
  ensureTopbar();
  loadLocalLibs();
  observe();
  console.debug("[GCX] search input injection initialized");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
