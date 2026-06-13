import React, { useState, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { generateId } from '../utils/storage'

export default function AddProfileModal({ existing, onClose }) {
  const { dispatch } = useApp()
  const [name, setName] = useState(existing?.name ?? '')
  const [photo, setPhoto] = useState(existing?.photo ?? null)
  const [isStravaUser, setIsStravaUser] = useState(existing?.isStravaUser ?? false)
  const fileRef = useRef()

  const isEdit = !!existing

  function handlePhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhoto(ev.target.result)
    reader.readAsDataURL(file)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    if (isEdit) {
      dispatch({
        type: 'UPDATE_PROFILE',
        profile: { ...existing, name: name.trim(), photo, isStravaUser },
      })
    } else {
      dispatch({
        type: 'ADD_PROFILE',
        profile: { id: generateId(), name: name.trim(), photo, isStravaUser },
      })
    }
    onClose()
  }

  function handleDelete() {
    dispatch({ type: 'DELETE_PROFILE', id: existing.id })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold">{isEdit ? 'עריכת פרופיל' : 'פרופיל חדש'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Photo */}
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500
                flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity relative group"
            >
              {photo ? (
                <img src={photo} alt="תמונת פרופיל" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </button>
            <span className="text-xs text-gray-500">לחץ לשינוי תמונה</span>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">שם</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="הכנס שם..."
              className="input-field"
              autoFocus
            />
          </div>

          {/* Strava toggle */}
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                className="sr-only"
                checked={isStravaUser}
                onChange={(e) => setIsStravaUser(e.target.checked)}
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${isStravaUser ? 'bg-orange-500' : 'bg-gray-200'}`} />
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isStravaUser ? '-translate-x-5' : '-translate-x-0.5'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">חיבור Strava</div>
              <div className="text-xs text-gray-500">סנכרון אוטומטי מ-Strava</div>
            </div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Strava_Logo.svg" alt="Strava" className="w-12 opacity-80 flex-shrink-0" />
          </label>

          <button
            type="submit"
            disabled={!name.trim()}
            className="btn-primary w-full py-3 text-base"
          >
            {isEdit ? 'שמור שינויים' : 'צור פרופיל'}
          </button>

          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              className="w-full py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
            >
              מחק פרופיל
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
