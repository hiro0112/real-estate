// 物件一覧画面（Supabaseのpropertiesテーブルと連携してCRUD操作を行う）
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import PropertyFormModal from '../components/PropertyFormModal'
import './PropertyList.css'

export default function PropertyList() {
  const { user, signOut } = useAuth()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // モーダルの表示状態。編集対象の物件をセットしていれば編集モード、
  // 'new' をセットしていれば新規登録モードとして扱う
  const [editingProperty, setEditingProperty] = useState(null)
  const [showNewForm, setShowNewForm] = useState(false)

  // 物件一覧を取得する
  // RLSにより自分（ログイン中のユーザー）が登録した物件のみが返ってくる
  const fetchProperties = async () => {
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

  // 画面表示時に一覧を取得
  useEffect(() => {
    fetchProperties()
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
    await fetchProperties()
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
    await fetchProperties()
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
    await fetchProperties()
  }

  return (
    <div className="property-page">
      <header className="property-header">
        <h1>物件一覧</h1>
        <div className="property-header-right">
          {user && <span className="property-user-email">{user.email}</span>}
          <button onClick={signOut}>ログアウト</button>
        </div>
      </header>

      <div className="property-toolbar">
        <button className="property-add-button" onClick={() => setShowNewForm(true)}>
          ＋ 物件を登録
        </button>
      </div>

      {errorMessage && <p className="property-error">{errorMessage}</p>}

      {loading ? (
        <p className="property-loading">読み込み中...</p>
      ) : properties.length === 0 ? (
        <p className="property-empty">登録されている物件はまだありません。</p>
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
