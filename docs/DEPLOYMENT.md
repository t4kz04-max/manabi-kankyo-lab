# まなび環境ラボ 公開手順書

GitHub と Cloudflare Pages を使って、まなび環境ラボを公開するための手順書です。
このアプリは、架空のデータを使ったコンテスト用のデモです。バックエンド・ログイン機能はなく、データは各利用者のブラウザ（localStorage）にだけ保存されます。

---

## A. 公開前の確認

### 1. Git の状態

```bash
git status          # 「nothing to commit, working tree clean」であること
git log --oneline   # 公開したい変更がコミットされていること
```

### 2. 型チェック・Lint・ビルド・テスト

```bash
npm ci                     # package-lock.json どおりに依存関係を入れる
npm run typecheck          # エラー 0 件
npm run lint               # エラー 0 件（警告 1 件は shadcn/ui の button.tsx によるもので既知）
npm run build              # 「built in …」と表示されること
npm run test:e2e           # すべて passed（初回は数分かかります）
```

E2E テストの詳細は README の「テスト方法」を参照してください。

### 3. 秘密情報が含まれていないことの確認

このアプリは API キーや環境変数を使いません。念のため、公開するファイルに秘密情報やローカル PC の情報が含まれていないことを確認します。

```bash
# 秘密情報らしい文字列
git grep -n -I -i -E "api[_-]?key|secret|password|token|private[_-]?key" -- . ':!package-lock.json'
# ローカル PC のパスやメールアドレス
git grep -n -I -E "C:\\\\Users|/Users/|@[A-Za-z0-9.-]+\.[a-z]{2,}" -- . ':!package-lock.json'
# .env ファイルが管理対象になっていないこと
git ls-files | grep -i env
```

- 何も表示されないか、説明文などの無関係な行だけであることを確認します。
- `.gitignore` で `.env` と `.env.*` は管理対象外にしてあります。

**コミットの作者情報にも注意してください。** GitHub に push すると、各コミットに記録された名前とメールアドレスも公開されます。確認方法は次のとおりです。

```bash
git log --format='%an <%ae>' | sort | uniq -c
```

個人のメールアドレスを公開したくない場合は、push する前に次の2つを行います。

1. GitHub の「Settings → Emails → Keep my email addresses private」を有効にする
2. 表示される `…@users.noreply.github.com` のアドレスを `git config user.email` に設定する

すでに作成したコミットの作者情報は自動では変わりません。変更する場合は、履歴の書き換えが必要です。

---

## B. GitHub への公開手順

### 1. リポジトリを作る

1. GitHub にログインし、右上の「+」→「New repository」を選ぶ
2. 「Repository name」を入力する（例：`manabi-kankyo-lab`）
3. 公開範囲を選ぶ（下記「public / private の違い」を参照）
4. 「Add a README file」「Add .gitignore」「Choose a license」は**選ばない**（ローカルに既にあるため）
5. 「Create repository」を押す

### 2. ローカルのリポジトリと接続する

作成したリポジトリの URL（例：`https://github.com/<ユーザー名>/manabi-kankyo-lab.git`）を使います。

```bash
git remote add origin https://github.com/<ユーザー名>/manabi-kankyo-lab.git
git remote -v   # origin が表示されること
```

### 3. 初回の push

このリポジトリのブランチ名は `master` です。GitHub の標準に合わせて `main` にする場合は、先に名前を変えます（任意）。

```bash
git branch -M main          # 任意：ブランチ名を main に変える
git push -u origin main     # 名前を変えない場合は git push -u origin master
```

### public / private の違い

| | public | private |
| --- | --- | --- |
| コードの閲覧 | 誰でも見られる | 招待した人だけ |
| コミット履歴・作者情報 | 誰でも見られる | 招待した人だけ |
| Cloudflare Pages との連携 | できる | できる（Cloudflare に権限を与える） |
| 公開されたサイト（*.pages.dev） | どちらの場合も誰でも見られる | 同左 |

サイトを公開するだけなら private でも問題ありません。コードを審査員などに見せる必要がある場合は public を選びます。

---

## C. Cloudflare Pages への公開手順

### 1. GitHub と連携する

1. Cloudflare のダッシュボードにログインする
2. 「Workers & Pages」を開く
3. 「Create application」→「Pages」→「Connect to Git」を選ぶ
4. GitHub でサインインし、公開するリポジトリを選ぶ
5. 「Install & Authorize」→「Begin setup」を押す

### 2. ビルド設定（Set up builds and deployments）

| 項目 | 設定する値 |
| --- | --- |
| Project name | 任意（例：`manabi-kankyo-lab`）。公開 URL の一部になります |
| Production branch | push したブランチ（`main` または `master`） |
| Framework preset | `React (Vite)` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | 空欄（リポジトリのルート） |
| Environment variables | **不要**（下記参照） |

### 3. 環境変数

- アプリの動作に必要な環境変数はありません。
- Node.js のバージョンは、リポジトリの `.node-version`（`24.16.0`）で指定しています。Cloudflare Pages の標準の Node.js（22.16.0）では、`react-router` が求める 22.22.0 以上を満たさないためです。
- `.node-version` を使わない場合は、代わりに環境変数 `NODE_VERSION` に `24.16.0` を設定します。

### 4. SPA（画面切り替え）の設定

追加の設定は不要です。Cloudflare Pages は、最上位に `404.html` がないプロジェクトを SPA とみなし、すべての URL に `index.html` を返します。このアプリには `404.html` がないため、`/report?issueId=…` などの URL を直接開いても表示されます。存在しない URL は、アプリ内の「ページが見つかりません」画面で案内します。

> `public/` に `404.html` を追加すると、この動作が変わり、直接開いた URL が 404 になります。追加しないでください。

### 5. 公開 URL の確認

「Save and Deploy」を押すとビルドが始まります。完了すると、`https://<プロジェクト名>.pages.dev` の形式の URL が表示されます。

- 以降は、Production branch に push するたびに自動で再デプロイされます。
- それ以外のブランチに push すると、別の URL のプレビューが作られます。

---

## D. 公開後の確認

公開 URL で、次を確認します。

| 確認する画面 | 確認すること |
| --- | --- |
| トップページ（`/`） | ヒーロー、ヘッダーの「デモ版」表示、フッターの注意書きが表示される |
| 生徒投稿（`/student/new`） | 「音 → 授業の始まり → 椅子を動かす音」を選んで投稿でき、完了画面が出る |
| 先生ダッシュボード（`/teacher`） | 投稿が一覧の先頭に「未確認」で表示され、「対応を考える」で編集画面へ移動できる |
| 改善レポート（`/report`） | 先生が保存した内容と、履歴のタイムラインが表示される |
| 直接 URL を開いた場合 | `/teacher`、`/report?issueId=demo-issue-004`、`/存在しないページ` をアドレスバーに直接入力して開ける（最後は「ページが見つかりません」） |
| 再読み込み | 各画面で再読み込みしても表示が崩れず、投稿や対応が残っている |
| スマートフォンでの表示 | 実機で開き、横スクロールが出ない、右上の「≡」でメニューが開く、ボタンが押しやすい |

操作の流れは `docs/DEMO_SCRIPT.md` に沿って確認すると確実です。

---

## E. 更新方法

1. **修正**：コードを修正する
2. **テスト**：次のコマンドを実行する
   ```bash
   npm run typecheck && npm run lint && npm run build && npm run test:e2e
   ```
3. **コミット**：
   ```bash
   git add -A
   git commit -m "fix: 修正内容"
   ```
4. **push**：
   ```bash
   git push
   ```
5. **再デプロイ**：Production branch への push で、Cloudflare Pages が自動的にビルドと公開を行います。Cloudflare の「Workers & Pages」→ プロジェクト →「Deployments」で状況を確認できます。失敗したときや手動でやり直したいときは、同じ画面から再デプロイします。

---

## F. トラブルシューティング

### ビルドが失敗する

- Cloudflare の「Deployments」で失敗したデプロイを開き、ビルドログを確認します。
- `EBADENGINE` や Node.js のバージョンに関するエラーの場合は、`.node-version` がリポジトリのルートにあるか、または環境変数 `NODE_VERSION` が設定されているかを確認します。
- 型エラーや Lint エラーの場合は、ローカルで `npm run build` を実行して同じエラーが出るか確認し、修正してから push します。
- Build output directory が `dist` になっているか確認します。

### 404 になる

- **サイト全体が 404：** Build output directory の設定（`dist`）を確認します。
- **トップページ以外の URL を直接開くと 404：** `public/` やビルド結果に `404.html` が含まれていないか確認します（含まれていると SPA として扱われません）。
- **「ページが見つかりません」と表示される：** アプリ内の 404 画面です。URL のつづりを確認します。

### 古い画面が残る

- ブラウザで強制的に再読み込みします（Windows：`Ctrl + Shift + R`、Mac：`Cmd + Shift + R`）。
- Cloudflare の「Deployments」で、最新のデプロイが成功しているか確認します。

### localStorage のデータが初期化される

データは各利用者のブラウザにだけ保存されるため、次の場合はデモデータが初期状態に戻ります（不具合ではありません）。

- 別のブラウザや端末、プライベートモードで開いた
- ブラウザのサイトデータを削除した
- アプリの更新で保存データの形式が変わった（画面上部に「保存データの形式が変わったため…」と表示されます）
- 公開 URL が変わった（`*.pages.dev` とプレビュー URL は別のサイトとして扱われます）

### 「画面を表示できませんでした」と表示される

- 画面ごとにファイルを分けて読み込んでいるため、通信が切れた場合などに表示されます。
- 再デプロイした直後に、古い画面を開いたままの利用者が別の画面へ移動した場合にも表示されることがあります。
- 「再読み込みする」を押すと、最新の状態で開き直せます。
