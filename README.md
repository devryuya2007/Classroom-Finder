# Google Classroom Search (DOM-First, API Fallback)

Google Classroom（Web）に**高速・高精度の横断検索**を付与する Chrome 拡張機能。まずは **DOM 抽出（端末内完結・審査不要・高速）**で動作し、DOM が崩れた/重い場合は**Classroom API へ安全に切替**できる。

> 日本語 UI 固定／ダーク/ライト自動追従／外部送信なし（OAuth 時を除く）

---

## 特長

- 🔎 **1 語検索＋予測候補**（日本語・英数、あいまい一致）
- 🧩 **フィルタ**：教師／期日（≦・≧・範囲）／添付タイプ（Docs/Sheets/Slides/PDF/Link）
- 🗂 **対象**：受講中の全クラス横断（ストリーム投稿・課題・資料・コメント・添付タイトル/ファイル名）
- ⚡ **150ms 以内の候補表示**（インデックス済み時、10k 件規模想定）
- 🧠 **Fuse.js ベース**の類似度検索＋日本語 N-gram 補助
- 🕶 **テーマ連動**：Classroom のダーク/ライト自動検知
- 🛡 **プライバシー・バイ・デザイン**：IndexedDB 保存、ネット送信ゼロ（OAuth 除く）

---

## スクリーンショット（準備中）

`/screenshots` に配置

- 検索バー（サイドバー常駐、sticky）
- 結果パネル（タイトル/抜粋/クラス/タイプ/期日/添付アイコン）

---

## インストール（開発者向け）

1. このリポジトリをクローン
2. Chrome → `chrome://extensions/` → 右上「デベロッパーモード」を ON
3. 「パッケージ化されていない拡張機能を読み込む」→ 本リポジトリのルートを選択
4. Classroom（`https://classroom.google.com/`）を開く → サイドバー直下に検索バーが表示

**必要権限（MV3）**

- `host_permissions`: `https://classroom.google.com/*`
- `permissions`: `storage`, `scripting`
- `content_scripts`: `run_at: document_idle`
- `background`: Service Worker（ジョブ/切替制御）

---

## 使い方

- `/`：検索バーへフォーカス
- `Ctrl + K`：コマンド/クエリ開始
- `↑ / ↓`：候補移動、`Enter`：決定、`Esc`：閉じる
- フィルタ：教師・期日・添付タイプをチップ/ドロップダウンで AND 適用

---

## 検索仕様

- **エンジン**：Fuse.js（`threshold≈0.3`, `ignoreLocation:true`）
- **重み**：`title^3`, `topic^2`, `text`, `className`, `teachers`, `attachments.title`
- **日本語対策**：プレフィックス優先のサジェスト辞書＋簡易 bi/tri-gram
- **クエリ解釈**：空白区切り AND、`"..."`でフレーズ一致  
  ※今後：`class:`, `type:`, `due<=` 等の演算子拡張

---

## データモデル（IndexedDB）

**Document**

- `id: string`（安定 URL/合成キー）、`url: string`
- `type: 'assignment' | 'material' | 'post' | 'comment'`
- `className: string`, `teachers: string[]`, `topic?: string`
- `title: string`, `text: string`（抜粋）、`due?: epoch`
- `attachments: Attachment[]`, `updatedAt: epoch`

**Attachment**

- `kind: 'docs' | 'sheets' | 'slides' | 'pdf' | 'link' | 'other'`
- `title: string`, `url: string`

---

## アーキテクチャ

/src
├─ content.js # UI 注入 / DOM 抽出 / MutationObserver / 差分更新
├─ bg.js # Service Worker: 初回クロール/スケジュール/API 取得
├─ db.ts # IndexedDB ラッパ (バージョン/GC/移行)
├─ search.ts # Fuse 初期化 / サジェスト辞書 / 重み・閾値調整
├─ ui/ # サイドバー/結果パネル/アクセシビリティ
└─ options.html # 権限/再インデックス/データ削除/モード切替
manifest.json # MV3

**DOM / API 切替ポリシー**

- 既定：DOM モード（速い・端末内完結）
- 自動提案条件：主要セレクタ崩壊/ヒット率急減、データ>30k で顕著な遅延 等
- 切替手順：同意ダイアログ → OAuth → Classroom API 読取 → 同一スキーマで索引  
  ※API モードでも保存は IndexedDB、外部送信なし（OAuth 通信のみ）

---

## 受け入れ基準（MVP）

1. インデックス済みで**1 語 → 候補 150ms 以内**
2. 教師・期日・添付タイプの**AND フィルタ**が正しく適用
3. **添付タイトル/ファイル名**でヒット
4. ダーク/ライト双方で**視認性**（コントラスト/ハイライト）良好
5. **ネット送信なし**を DevTools Network で確認（API モード除く）
6. DOM 崩壊時、**API 切替提案**→ 同意 → 正常動作

---

## 非スコープ（MVP）

- 課題の提出/採点/通知操作
- モバイルアプリ対応、他ブラウザ完全対応
- 添付の**全文索引**（タイトル/ファイル名のみ）
- 高度なクエリ言語（次版以降）

---

## パフォーマンス

- 初回インデックス：`requestIdleCallback` による分割・スロットリング
- 差分更新：MutationObserver ＋軽量再走査
- データ増大対策：古文書ローリング、抜粋長上限、添付はメタのみ

---

## プライバシー

- 既定で**外部送信ゼロ**。IndexedDB のみ保存（ローカル）
- 再インデックス・全削除・モード切替を Options で提供
- 将来の匿名ログは**明示オプトイン**のみ

---

## 互換性・制約

- Chrome 最新版 / Classroom Web（管理端末は対象外）
- 日本語 UI 固定（i18n は文言 JSON 化まで）
- Classroom の DOM/レイアウト変更に依存（検知・フォールバック実装済）

---

## 開発の進め方（WBS / MVP 例）

1. 詳細設計/画面モック（2h）
2. MV3 雛形/ビルド環境（2h）
3. DOM 抽出層（課題/資料/添付）（5h）
4. IndexedDB 層（CRUD/GC/移行）（3h）
5. 検索（Fuse ＋サジェスト）（4h）
6. UI（サイドバー/結果/キーバインド/a11y）（5h）
7. 初回クロール/差分/性能調整（3h）
8. QA/計測/微修正（2h）

---

## ロードマップ

- **M1**：DOM 版 MVP（検索・フィルタ・UI・受入 1–5）
- **M2**：耐 DOM 変更性強化（セレクタ冗長化/E2E）
- **M3**：API モード（同意 → 取得 → 索引 → 切替 UI）
- **M4**：クエリ演算子 & ショートカット拡張

---

## トラブルシュート

- 検索バーが出ない：拡張が有効/権限付与を確認、ページ再読込
- 候補が遅い：Options から再インデックス、タブを減らす、古いデータの GC
- 結果が少ない：Options で API 切替を許可（同意後に再索引）

---

## FAQ

**Q. なぜ DOM 優先？**  
審査不要・即応・端末内完結で高速。API 障害/制限の影響を受けにくい。

**Q. いつ API に切替？**  
セレクタ崩壊やデータ巨大化でヒット率/応答が劣化したときに自動提案。明示同意のうえで切替。

---

## 貢献

Issue / PR 歓迎。方針：軽量・高速・私的利用の安全性を最優先。  
コード規約/テスト方針は `.github/CONTRIBUTING.md` を参照（追加予定）。

---

## ライセンス

TBD
