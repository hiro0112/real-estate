// 未ログインの場合はログイン画面へリダイレクトするためのラッパーコンポーネント
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  // セッション取得中は何も表示しない（画面のちらつき防止）
  if (loading) {
    return null
  }

  // 未ログインの場合はログイン画面へリダイレクト
  if (!session) {
    return <Navigate to="/login" replace />
  }

  return children
}
