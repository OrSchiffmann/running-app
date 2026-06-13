import React, { useState, useRef } from 'react'
import { useApp, useCurrentProfile } from '../context/AppContext'
import { toSeconds, splitSeconds } from '../utils/format'
import { generateId } from '../utils/storage'

const KNEE_LABELS = {
  1: 'מצוין — ללא כאב',
  2: 'כמעט ללא כאב',
  3: 'קל מאוד',
  4: 'קל',
  5: 'בינוני',
  6: 'בינוני-חזק',
  7: 'חזק',
  8: 'חזק מאוד',
  9: 'כמעט בלתי נסבל',
  10: 'בלתי נסבל',
}

function kneeColor(val) {
  if (!val) return 'text-gray-400'
  if (val <= 3) return 'text-green-600'
  if (val <= 6) return 'text-yellow-600'
  return 'text-red-600'
}

export default function WorkoutLogModal({ weekNum, workout, existing, onClose, prefill, planId, profileId: profileIdProp }) {
  const { dispatch } = useApp()
  const currentProfile = useCurrentProfile()
  const profile = { id: profileIdProp ?? currentProfile?.id }

  const initDur = splitSeconds(existing?.duration ?? prefill?.duration ?? null)
  const [form, setForm] = useState({
    durationMin: initDur.min,
    durationSec: initDur.sec,
    distance: existing?.distance ?? prefill?.distance ?? '',
    avgHeartRate: existing?.avgHeartRate ?? prefill?.avgHeartRate ?? '',
    pace: existing?.pace ?? prefill?.pace ?? '',
    kneeFeeling: existing?.kneeFeeling ?? '',
    notes: existing?.notes ?? '',
    date: existing?.date ?? prefill?.date ?? new Date().toISOString().slice(0, 10),
  })
  const [saving, setSaving] = useState(false)
  const photoRef = useRef()
  const [photos, setPhotos] = useState(existing?.photos ?? prefill?.photos ?? [])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  function addPhotos(e) {
    const files = Array.from(e.target.files || [])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => setPhotos((p) => [...p, ev.target.result])
      reader.readAsDataURL(file)
    })
  }

  function removePhoto(i) {
    setPhotos((p) => p.filter((_, idx) => idx !== i))
  }

  const totalSeconds = toSeconds(form.durationMin, form.durationSec)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!totalSeconds) return
    setSaving(true)
    const log = {
      id: existing?.id || generateId(),
      profileId: profile.id,
      planId: planId ?? existing?.planId ?? null,
      weekNum,
      workoutId: workout?.id,
      duration: totalSeconds,
      distance: form.distance ? Number(form.distance) : null,
      avgHeartRate: form.avgHeartRate ? Number(form.avgHeartRate) : null,
      pace: form.pace || null,
      kneeFeeling: form.kneeFeeling ? Number(form.kneeFeeling) : null,
      notes: form.notes,
      date: form.date,
      photos,
      completedAt: existing?.completedAt || new Date().toISOString(),
    }
    dispatch({ type: 'LOG_WORKOUT', log })
    setSaving(false)
    onClose()
  }

  function handleDelete() {
    if (!existing) return
    dispatch({ type: 'DELETE_WORKOUT_LOG', id: existing.id })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-lg shadow-xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {existing ? 'עדכן אימון' : 'תעד אימון'}
            </h2>
            {workout && <p className="text-sm text-gray-500">{workout.label}</p>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body — scrollable */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-5 space-y-4">
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

          {/* Duration — required */}
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
                  placeholder="42"
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
            {workout?.targetDuration && (
              <p className="text-xs text-gray-400 mt-1">יעד: {workout.targetDuration} דקות</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Distance */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">מרחק (ק"מ)</label>
              <input
                type="number"
                value={form.distance}
                onChange={(e) => set('distance', e.target.value)}
                placeholder="5.2"
                min="0"
                step="0.01"
                className="input-field"
              />
            </div>
            {/* Pace */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">קצב (דק׳/ק"מ)</label>
              <input
                type="text"
                value={form.pace}
                onChange={(e) => set('pace', e.target.value)}
                placeholder="6:30"
                className="input-field"
              />
            </div>
          </div>

          {/* Heart rate */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">דופק ממוצע (bpm)</label>
            <input
              type="number"
              value={form.avgHeartRate}
              onChange={(e) => set('avgHeartRate', e.target.value)}
              placeholder="145"
              min="40"
              max="220"
              className="input-field"
            />
          </div>

          {/* Knee feeling */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              תחושת ברך (1-10 — 1 הכי טוב)
            </label>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => set('kneeFeeling', form.kneeFeeling === n ? '' : n)}
                    className={`w-8 h-8 rounded-full text-sm font-bold transition-all
                      ${form.kneeFeeling === n
                        ? n <= 3 ? 'bg-green-500 text-white' : n <= 6 ? 'bg-yellow-400 text-white' : 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              {form.kneeFeeling && (
                <p className={`text-xs font-medium ${kneeColor(form.kneeFeeling)}`}>
                  {form.kneeFeeling} — {KNEE_LABELS[form.kneeFeeling]}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">הערות</label>
            <textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="איך הרגשת? מה עבד טוב?"
              rows={3}
              className="input-field resize-none"
            />
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">תמונות</label>
            <div className="flex flex-wrap gap-2">
              {photos.map((photo, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden">
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 left-1 w-5 h-5 bg-black/60 rounded-full text-white text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => photoRef.current?.click()}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-[10px] mt-1">הוסף</span>
              </button>
            </div>
            <input ref={photoRef} type="file" accept="image/*" multiple className="hidden" onChange={addPhotos} />
          </div>
        </form>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 flex gap-3 flex-shrink-0">
          {existing && (
            <button
              type="button"
              onClick={handleDelete}
              className="btn-ghost text-red-500 hover:bg-red-50"
            >
              מחק
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            ביטול
          </button>
          <button
            type="submit"
            form="workout-form"
            disabled={saving || !totalSeconds}
            onClick={handleSubmit}
            className="btn-primary flex-1"
          >
            {saving ? 'שומר...' : existing ? 'עדכן' : 'שמור'}
          </button>
        </div>
      </div>
    </div>
  )
}
