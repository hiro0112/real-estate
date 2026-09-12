// 自分の物件を管理する画面（Supabaseのpropertiesテーブルと連携してCRUD操作を行う）
// 自分が登録した物件のみを対象に、登録(INSERT)・編集(UPDATE)・削除(DELETE)を行う
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import NavBar from '../components/NavBar'
import PropertyFormModal from '../components/PropertyFormModal'
import './Properties.css'

export default function MyProperties() {
  const { user } = useAuth()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // モーダルの表示状態。編集対象の物件をセットしていれば編集モード、
  // showNewFormがtrueなら新規登録モードとして扱う
  const [editingProperty, setEditingProperty] = useState(null)
  const [showNewForm, setShowNewForm] = useState(false)

  // 自分が登録した物件のみを取得する
  const fetchMyProperties = async () => {
    setLoading(true)
    setErrorMessage('')

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      setErrorMessage('物件情報の取得に失敗しました。' + error.message)
    } else {
      setProperties(data)
    }
    setLoading(false)
  }

  // 画面表示時に一覧を取得
  useEffect(() => {
    fetchMyProperties()
  }, [])

  // 新規登録処理（INSERT）
  const handleCreate = async (values) => {
    const { error } = await supabase.from('properties').insert({
      ...values,
      user_id: user.id, // 自分のユーザーIDを登録者として保存する
    })

    if (error) {
      throw error
    }
    await fetchMyProperties()
  }

  // 更新処理（UPDATE）
  const handleUpdate = async (id, values) => {
    const { error } = await supabase
      .from('properties')
      .update(values)
      .eq('id', id)

    if (error) {
      throw error
    }
    await fetchMyProperties()
  }

  // 削除処理（DELETE）
  const handleDelete = async (id) => {
    const confirmed = window.confirm('この物件を削除しますか？')
    if (!confirmed) return

    const { error } = await supabase.from('properties').delete().eq('id', id)

    if (error) {
      setErrorMessage('削除に失敗しました。' + error.message)
      return
    }
    await fetchMyProperties()
  }

  return (
    <div className="property-page">
      <NavBar />

      <h1 className="property-page-title">自分の物件を管理</h1>

      <div className="property-toolbar">
        <button className="property-add-button" onClick={() => setShowNewForm(true)}>
          ＋ 物件を登録
        </button>
      </div>

      {errorMessage && <p className="property-error">{errorMessage}</p>}

      {loading ? (
        <p className="property-loading">読み込み中...</p>
      ) : properties.length === 0 ? (
        <p className="property-empty">登録した物件はまだありません。</p>
      ) : (
        <div className="property-grid">
          {properties.map((property) => (
            <div className="property-card" key={property.id}>
              <h2>{property.name}</h2>
              <p className="property-rent">
                {property.rent.toLocaleString()}円<span> / 月</span>
              </p>
              <p className="property-area">{property.area}</p>
              <p className="property-layout">{property.layout}</p>

              <div className="property-card-actions">
                <button onClick={() => setEditingProperty(property)}>編集</button>
                <button
                  className="property-delete-button"
                  onClick={() => handleDelete(property.id)}
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 新規登録用モーダル */}
      {showNewForm && (
        <PropertyFormModal
          initialValues={null}
          onSubmit={handleCreate}
          onClose={() => setShowNewForm(false)}
        />
      )}

      {/* 編集用モーダル */}
      {editingProperty && (
        <PropertyFormModal
          initialValues={editingProperty}
          onSubmit={(values) => handleUpdate(editingProperty.id, values)}
          onClose={() => setEditingProperty(null)}
        />
      )}
    </div>
  )
}
