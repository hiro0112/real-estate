// アプリ全体のルーティング設定
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import PropertyList from './pages/PropertyList'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* ルートアクセス時は物件一覧へ（未ログインならログイン画面へリダイレクトされる） */}
      <Route path="/" element={<Navigate to="/properties" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* 物件一覧画面：未ログインの場合はログイン画面へリダイレクト */}
      <Route
        path="/properties"
        element={
          <ProtectedRoute>
            <PropertyList />
          </ProtectedRoute>
        }
      />

      {/* 該当しないパスは物件一覧へ */}
      <Route path="*" element={<Navigate to="/properties" replace />} />
    </Routes>
  )
}

export default App
