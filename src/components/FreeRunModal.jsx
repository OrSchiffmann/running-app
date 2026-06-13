import React, { useState, useRef } from 'react'
import { useApp, useCurrentProfile } from '../context/AppContext'
import { generateId } from '../utils/storage'
import { toSeconds, splitSeconds } from '../utils/format'

const KNEE_LABELS = {
  1: 'מצוין', 2: 'טוב מאוד', 3: 'טוב', 4: 'סביר', 5: 'בינוני',
  6: 'בינוני-חזק', 7: 'חזק', 8: 'חזק מאוד', 9: 'כמעט בלתי נסבל', 10: 'בלתי נסבל',
}

export default function FreeRunModal({ existing, onClose }) {
  const { state, dispatch } = useApp()
  const profile = useCurrentProfile()
  const [photos, setPhotos] = useState(existing?.photos ?? [])
  const photoRef = useRef()

  const initDur = splitSeconds(existing?.duration ?? null)
  const [form, setForm] = useState({
    title: existing?.title ?? '',
    date: existing?.date ?? new Date().toISOString().slice(0, 10),
    durationMin: initDur.min,
    durationSec: initDur.sec,
    distance: existing?.distance ?? '',
    avgHeartRate: existing?.avgHeartRate ?? '',
    pace: existing?.pace ?? '',
    kneeFeeling: existing?.kneeFeeling ?? '',
    notes: existing?.notes ?? '',
    profileId: existing?.profileId ?? profile?.id,
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  function addPhotos(e) {
    const files = Array.from(e.target.files || [])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => setPhotos((p) => [...p, ev.target.result])
      reader.readAsDataURL(file)
    })
  }

  const totalSeconds = toSeconds(form.durationMin, form.durationSec)

  function handleSubmit(e) {
    e.preventDefault()
    if (!totalSeconds) return
    const run = {
      ...existing,
      id: existing?.id || generateId(),
      title: form.title || 'ריצה חופשית',
      date: form.date,
      profileId: form.profileId,
      duration: totalSeconds,
      distance: form.distance ? Number(form.distance) : null,
      avgHeartRate: form.avgHeartRate ? Number(form.avgHeartRate) : null,
      pace: form.pace || null,
      kneeFeeling: form.kneeFeeling ? Number(form.kneeFeeling) : null,
      notes: form.notes,
      photos,
    }
    if (existing) {
      dispatch({ type: 'UPDATE_FREE_RUN', run })
    } else {
      dispatch({ type: 'ADD_FREE_RUN', run })
    }
    onClose()
  }

  function handleDelete() {
    dispatch({ type: 'DELETE_FREE_RUN', id: existing.id })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg shadow-xl max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-bold">{existing ? 'עדכן ריצה' : 'ריצה חופשית חדשה'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">כותרת</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="לדוגמה: ריצה עם בת"
              className="input-field"
            />
          </div>

          {/* Profile selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">פרופיל</label>
            <select
              value={form.profileId}
              onChange={(e) => set('profileId', e.target.value)}
              className="input-field"
            >
              {state.profiles.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">תאריך</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              className="input-field"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              משך זמן <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type="number"
                  value={form.durationMin}
                  onChange={(e) => set('durationMin', e.target.value)}
                  placeholder="30"
                  min="0"
                  max="300"
                  className="input-field pl-14"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">דקות</span>
              </div>
              <span className="text-gray-400 font-bold">:</span>
              <div className="w-28 relative">
                <input
                  type="number"
                  value={form.durationSec}
                  onChange={(e) => set('durationSec', Math.min(59, Math.max(0, Number(e.target.value))))}
                  placeholder="00"
                  min="0"
                  max="59"
                  className="input-field pl-14"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">שניות</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">מרחק (ק"מ)</label>
              <input type="number" value={form.distance} onChange={(e) => set('distance', e.target.value)}
                placeholder="4.5" min="0" step="0.01" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">קצב (דק׳/ק"מ)</label>
              <input type="text" value={form.pace} onChange={(e) => set('pace', e.target.value)}
                placeholder="7:00" className="input-field" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">דופק ממוצע (bpm)</label>
            <input type="number" value={form.avgHeartRate} onChange={(e) => set('avgHeartRate', e.target.value)}
              placeholder="140" min="40" max="220" className="input-field" />
          </div>

          {/* Knee */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">תחושת ברך (1-10)</label>
            <div className="flex justify-between">
              {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                <button key={n} type="button"
                  onClick={() => set('kneeFeeling', form.kneeFeeling === n ? '' : n)}
                  className={`w-8 h-8 rounded-full text-sm font-bold transition-all
                    ${form.kneeFeeling === n
                      ? n <= 3 ? 'bg-green-500 text-white' : n <= 6 ? 'bg-yellow-400 text-white' : 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >{n}</button>
              ))}
            </div>
            {form.kneeFeeling && (
              <p className="text-xs text-gray-500 mt-1">{form.kneeFeeling} — {KNEE_LABELS[form.kneeFeeling]}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">הערות</label>
            <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)}
              placeholder="מה היה מיוחד בריצה הזו?" rows={3} className="input-field resize-none" />
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">תמונות</label>
            <div className="flex flex-wrap gap-2">
              {photos.map((p, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden">
                  <img src={p} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setPhotos((ps) => ps.filter((_, j) => j !== i))}
                    className="absolute top-1 left-1 w-5 h-5 bg-black/60 rounded-full text-white text-xs flex items-center justify-center">×</button>
                </div>
              ))}
              <button type="button" onClick={() => photoRef.current?.click()}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-[10px] mt-1">הוסף</span>
              </button>
            </div>
            <input ref={photoRef} type="file" accept="image/*" multiple className="hidden" onChange={addPhotos} />
          </div>
        </form>

        <div className="p-5 border-t border-gray-100 flex gap-3 flex-shrink-0">
          {existing && (
            <button type="button" onClick={handleDelete} className="btn-ghost text-red-500 hover:bg-red-50">מחק</button>
          )}
          <button type="button" onClick={onClose} className="btn-secondary flex-1">ביטול</button>
          <button type="submit" disabled={!totalSeconds} onClick={handleSubmit} className="btn-primary flex-1">
            {existing ? 'עדכן' : 'שמור'}
          </button>
        </div>
      </div>
    </div>
  )
}
