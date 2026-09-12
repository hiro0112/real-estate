// 「物件を探す（全件閲覧）」と「自分の物件を管理する」を切り替えるための共通ナビゲーション
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './NavBar.css'

export default function NavBar() {
  const { user, signOut } = useAuth()

  // NavLinkの現在地判定でアクティブなタブにスタイルを当てる
  const linkClassName = ({ isActive }) =>
    isActive ? 'nav-link nav-link-active' : 'nav-link'

  return (
    <header className="nav-bar">
      <nav className="nav-links">
        <NavLink to="/properties" className={linkClassName} end>
          物件を探す
        </NavLink>
        <NavLink to="/my-properties" className={linkClassName}>
          自分の物件を管理
        </NavLink>
      </nav>

      <div className="nav-right">
        {user && <span className="nav-user-email">{user.email}</span>}
        <button onClick={signOut}>ログアウト</button>
      </div>
    </header>
  )
}
