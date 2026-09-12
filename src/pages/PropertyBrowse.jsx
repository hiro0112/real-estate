// 物件を探す画面
// 自分が登録した物件かどうかに関わらず、会員登録された全物件を一覧閲覧できる（読み取り専用）
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import NavBar from '../components/NavBar'
import './Properties.css'

export default function PropertyBrowse() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // 全ユーザーが登録した物件を取得する
  // （Supabase側のRLSで「ログイン中のユーザーなら全件閲覧可」に設定している）
  const fetchAllProperties = async () => {
    setLoading(true)
    setErrorMessage('')

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setErrorMessage('物件情報の取得に失敗しました。' + error.message)
    } else {
      setProperties(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAllProperties()
  }, [])

  return (
    <div className="property-page">
      <NavBar />

      <h1 className="property-page-title">物件を探す</h1>

      {errorMessage && <p className="property-error">{errorMessage}</p>}

      {loading ? (
        <p className="property-loading">読み込み中...</p>
      ) : properties.length === 0 ? (
        <p className="property-empty">登録されている物件はまだありません。</p>
      ) : (
        <div className="property-grid">
          {properties.map((property) => (
            // 閲覧のみのため編集・削除ボタンは表示しない
            <div className="property-card" key={property.id}>
              <h2>{property.name}</h2>
              <p className="property-rent">
                {property.rent.toLocaleString()}円<span> / 月</span>
              </p>
              <p className="property-area">{property.area}</p>
              <p className="property-layout">{property.layout}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
