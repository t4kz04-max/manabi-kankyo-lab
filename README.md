# まなび環境ラボ

教室の「困った」を「変わった」に。

NIJIN教育万博2026 アイデアコンテストに応募するための、操作できる Web アプリのプロトタイプです。教室の音や光に関する生徒の困りごとを、学校による検討・試行・結果の共有につなげる流れを示します。

> **これはデモです。** 画面に表示される投稿・対応・結果は、すべて架空のデータです。実際の学校での導入実績や改善の成果を示すものではありません。

## 主な機能

| 画面 | URL | 内容 |
| --- | --- | --- |
| ホーム | `/` | アプリの目的と使い方の紹介 |
| 困りごとを伝える（生徒） | `/student/new` | 「音／光」「場面」「種類」を選ぶだけで投稿（自由記述・個人情報の入力なし） |
| 対応状況を見る（生徒） | `/student/status` | 投稿の対応状況と学校の対応を確認。カテゴリー・対応状況で絞り込み |
| 先生ダッシュボード | `/teacher` | 届いた困りごとの一覧と件数。未確認の投稿を探しやすく表示 |
| 改善プランの検討（先生） | `/teacher/issues/:issueId` | 改善案の参考例を見ながら、対応状況・方針・理由・結果を記録 |
| 改善レポート | `/report?issueId=…` | 困りごと → 学校の対応 → 結果のまとめと、記録された履歴のタイムライン |

- 先生モードはデモ用で、ログインや権限管理はありません。
- 改善案の参考例は、先生が検討するためのヒントです。自動で採用されることはなく、AI が生成したものでもありません。

## 技術構成

- React 19 / TypeScript / Vite 8
- Tailwind CSS 4 / shadcn/ui（Radix UI）/ Lucide React
- React Router 8（画面ごとにコードを分割して読み込み）
- データ保存：ブラウザの localStorage（バックエンドなし）
- E2E テスト：Playwright

## ローカルでの起動方法

Node.js 22.22.0 以上が必要です（推奨：`.node-version` の 24.16.0）。

```bash
npm install
npm run dev        # 開発サーバー（http://localhost:5173）
```

本番と同じ状態で確認する場合は、次のコマンドを使います。

```bash
npm run build
npm run preview    # http://localhost:4173
```

## テスト方法

```bash
npm run typecheck   # 型チェック
npm run lint        # Lint
npm run build       # 本番ビルド
npm run test:e2e    # E2E テスト（Chrome）
```

- **E2E テストの内容：** `tests/e2e/` にあります。次の項目を、本番ビルドに対して確認します。
  - 生徒の投稿 → 先生の対応保存 → 生徒側への反映 → 改善レポートの履歴
  - デモデータのリセット
  - 保存に失敗したときの動作
  - 全画面の表示、キーボード操作
- **Chrome がない環境：** `npx playwright install chromium` を実行してから、環境変数 `PW_CHROMIUM_BUNDLED=1` を付けて実行します。
  - macOS・Linux：`PW_CHROMIUM_BUNDLED=1 npm run test:e2e`
  - Windows（PowerShell）：`$env:PW_CHROMIUM_BUNDLED=1; npm run test:e2e`
- **Firefox で確認する場合：** `npx playwright install firefox` を実行してから、`npm run test:e2e:firefox` で実行します。
- **3つのブラウザでまとめて確認する場合：** `npx playwright install firefox webkit` を実行してから、`npm run test:e2e:all` で実行します（Chrome・Firefox・WebKit。WebKit は Safari と同じエンジンでの参考確認）。
- **失敗したとき：** `npx playwright show-report` で詳細を確認できます。

## デモデータについて

- **初期データ：** 架空の困りごと5件と、その架空の対応記録が入っています。
- **保存場所：** 投稿や先生の記録は、利用しているブラウザの localStorage にだけ保存されます。サーバーには送信されません。
- **リセット：** どの画面でも、フッターの「デモデータをリセット」で初期状態に戻せます。
- **初期データの履歴：** 初期データには操作の履歴がありません。そのため改善レポートでは、「履歴の記録を始める前の状態」として区別して表示します。存在しない履歴を推測で作ることはしません。

## 公開時の注意事項

- 実際の生徒の名前、学校名、健康に関する情報などの個人情報は入力しないでください。
- ログインやアクセス制御がないため、公開 URL を知っている人は誰でも先生モードを開けます（データは各自のブラウザ内にだけ保存されます）。
- 「改善済み」はデモ上の記録の状態です。実際の学校で改善が実証されたように説明しないでください。

## ドキュメント

- [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md)：動画撮影用の操作手順書
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)：GitHub と Cloudflare Pages での公開手順書
- [docs/PRODUCT_SPEC.md](docs/PRODUCT_SPEC.md)：プロダクト仕様
