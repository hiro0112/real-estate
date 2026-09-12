// 物件一覧画面（ダミーデータを表示）
import { useAuth } from '../context/AuthContext'
import './PropertyList.css'

// 物件のダミーデータ（本来はSupabaseのDBから取得する想定）
const dummyProperties = [
  { id: 1, name: 'サンライズ渋谷', rent: '120,000円', area: '東京都渋谷区' },
  { id: 2, name: 'グリーンヒルズ横浜', rent: '95,000円', area: '神奈川県横浜市' },
  { id: 3, name: 'パークサイド新宿', rent: '150,000円', area: '東京都新宿区' },
  { id: 4, name: 'リバーサイド大阪', rent: '80,000円', area: '大阪府大阪市' },
  { id: 5, name: 'ヒルトップ福岡', rent: '70,000円', area: '福岡県福岡市' },
  { id: 6, name: 'セントラルタワー名古屋', rent: '110,000円', area: '愛知県名古屋市' },
]

export default function PropertyList() {
  const { user, signOut } = useAuth()

  return (
    <div className="property-page">
      <header className="property-header">
        <h1>物件一覧</h1>
        <div className="property-header-right">
          {user && <span className="property-user-email">{user.email}</span>}
          <button onClick={signOut}>ログアウト</button>
        </div>
      </header>

      <div className="property-grid">
        {dummyProperties.map((property) => (
          <div className="property-card" key={property.id}>
            <h2>{property.name}</h2>
            <p className="property-rent">{property.rent}<span> / 月</span></p>
            <p className="property-area">{property.area}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
