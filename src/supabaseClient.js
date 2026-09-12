// Supabaseクライアントの初期化
// Project URLとPublishable keyは .env ファイルで管理する（GitHubには公開しない）
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  // .env が設定されていない場合に気づけるよう警告を出す
  console.error(
    'Supabaseの環境変数が設定されていません。.env ファイルを確認してください。'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)
