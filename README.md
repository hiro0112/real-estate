# 不動産管理Webアプリ

React + Vite + Supabase で構築した、認証機能付きの不動産管理Webアプリです。

## 機能

- メールアドレス＋パスワードによる会員登録・ログイン
- ログイン後は物件一覧画面（ダミーデータ）へ遷移
- 未ログインの場合はログイン画面へリダイレクト
- ログアウト機能

## セットアップ

1. 依存パッケージのインストール

   ```bash
   npm install
   ```

2. 環境変数の設定

   `.env.example` を `.env` にコピーし、SupabaseのProject URLとPublishable keyを設定してください。

   ```bash
   cp .env.example .env
   ```

3. 開発サーバーの起動

   ```bash
   npm run dev
   ```

## 技術スタック

- React
- Vite
- React Router
- Supabase（認証）
