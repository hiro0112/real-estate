// アプリ全体のルーティング設定
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import PropertyBrowse from './pages/PropertyBrowse'
import MyProperties from './pages/MyProperties'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* ルートアクセス時は物件を探す画面へ（未ログインならログイン画面へリダイレクトされる） */}
      <Route path="/" element={<Navigate to="/properties" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* 物件を探す画面：会員登録された全物件を閲覧できる（未ログインの場合はログイン画面へリダイレクト） */}
      <Route
        path="/properties"
        element={
          <ProtectedRoute>
            <PropertyBrowse />
          </ProtectedRoute>
        }
      />

      {/* 自分の物件を管理する画面：登録・編集・削除ができる（未ログインの場合はログイン画面へリダイレクト） */}
      <Route
        path="/my-properties"
        element={
          <ProtectedRoute>
            <MyProperties />
          </ProtectedRoute>
        }
      />

      {/* 該当しないパスは物件を探す画面へ */}
      <Route path="*" element={<Navigate to="/properties" replace />} />
    </Routes>
  )
}

export default App
