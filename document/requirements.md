# 要件定義（Classroom-Finder）

本ドキュメントは Classroom-Finder 拡張機能の機能要件・非機能要件・セキュリティ要件を整理したものです。

## 1. 目的

- Google Classroom のストリーム投稿（および関連メタデータ）を横断的に検索し、利用者の情報探索時間を短縮する。

## 2. 機能要件（Functional）

- 検索
  - インクリメンタルサーチで候補表示（上限 20 件）
  - マッチ強調表示（本文/教師名/日付等）
  - 結果選択で対象投稿に遷移
- データ同期
  - Classroom API から受講中のコースとストリーム投稿一覧を取得
  - IndexedDB に保存し、差分（新規/削除）を反映
  - 手動同期（ボタン）と定期同期（デフォルト 5 分）
- UI
  - 画面上部のクイック検索バー（固定表示）
  - 入力中は候補パネルを展開、フォーカス遷移に追従

## 3. 非機能要件（Non‑Functional）

- パフォーマンス：入力から候補表示まで 150ms 以内（インデックス済み時）
- 可用性：API 失敗時はリトライ/明確なエラー表示（再ログイン/リロードの誘導）
- 可読性/保守性：ローカル同梱ライブラリのみに依存（外部 CDN 不使用）
- 互換性：Chrome（最新版）の Classroom Web に対応

## 4. セキュリティ要件（Security）

- ナビゲーション制限
  - `https:` かつ `classroom.google.com` のみ許可
- API フェッチ制限（BG）
  - 許可ホスト：`classroom.googleapis.com` のみ
  - メソッド：`GET` のみ（任意 URL/メソッド不可）
  - 送信者検証：自拡張 ID からのメッセージのみ処理
- DOM 安全性
  - `textContent`/`createTextNode` による描画（`innerHTML` 不使用）
  - CSS セレクタ用エスケープを MDN 準拠フォールバックで実装

## 5. データ要件（Data）

- 保存先：IndexedDB（ローカルのみ）
- 保存内容（例）：`streamId`, `courseId`, `teacherName`, `postedAt`, `body` 抜粋, `attachments` メタ等
- 保持ポリシー：最小限の保存を原則とし、将来的に有効期限・パージ機構を追加可能

## 6. 権限/スコープ（MV3）

- `permissions`: `storage`, `scripting`, `identity`
- `host_permissions`: `https://classroom.google.com/*`, `https://classroom.googleapis.com/*`, `https://www.googleapis.com/*`

## 7. 監視/ログ（Observability）

- エラー時に Console 警告（PII 最小化）
- 追加のテレメトリは行わない（将来導入する場合は明示オプトイン）

## 8. 既知の制約/非スコープ

- 課題の提出/採点/通知操作は対象外
- 添付の全文検索は対象外（タイトル/ファイル名のみ）
- 端末外へのデータ送信は OAuth と Classroom API 以外は実施しない

## 9. ライブラリ方針

- 使用中：`Fuse.js`（`src/libs/fuse.esm.js`）
- 同梱だが未使用：`hotkeys-js`, `idb`（将来の保守性/機能拡張に備えたもの）

