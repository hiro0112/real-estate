// 物件の新規登録・編集で共通利用するフォームモーダル
import { useState } from 'react'
import './PropertyFormModal.css'

// initialValues が渡された場合は編集モード、nullの場合は新規登録モードとして動作する
export default function PropertyFormModal({ initialValues, onSubmit, onClose }) {
  const isEditMode = Boolean(initialValues)

  const [name, setName] = useState(initialValues?.name ?? '')
  const [rent, setRent] = useState(initialValues?.rent ?? '')
  const [area, setArea] = useState(initialValues?.area ?? '')
  const [layout, setLayout] = useState(initialValues?.layout ?? '')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setSubmitting(true)

    try {
      // 呼び出し元（PropertyList）にフォームの値を渡して登録・更新処理を任せる
      await onSubmit({
        name,
        rent: Number(rent),
        area,
        layout,
      })
      onClose()
    } catch (error) {
      setErrorMessage('保存に失敗しました。' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* モーダル内クリックで閉じないようにイベント伝播を止める */}
      <form
        className="modal-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2>{isEditMode ? '物件を編集' : '物件を新規登録'}</h2>

        <label htmlFor="name">物件名</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="rent">家賃（円）</label>
        <input
          id="rent"
          type="number"
          min="0"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
          required
        />

        <label htmlFor="area">エリア名</label>
        <input
          id="area"
          type="text"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          required
        />

        <label htmlFor="layout">間取り（例：1LDK）</label>
        <input
          id="layout"
          type="text"
          value={layout}
          onChange={(e) => setLayout(e.target.value)}
          required
        />

        {errorMessage && <p className="modal-error">{errorMessage}</p>}

        <div className="modal-actions">
          <button type="button" className="modal-cancel" onClick={onClose}>
            キャンセル
          </button>
          <button type="submit" disabled={submitting}>
            {submitting ? '保存中...' : '保存する'}
          </button>
        </div>
      </form>
    </div>
  )
}
