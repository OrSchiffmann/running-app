import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { generateWeeksFromTemplate, generateEmptyWeeks, trainingPlan } from '../data/trainingPlan'
import { generateId } from '../utils/storage'

const TEMPLATE_DEFAULT_START = '2026-06-14'
const TEMPLATE_DEFAULT_RACE = '2026-10-30'

export default function AddPlanModal({ profileId, replacePlanId, onClose }) {
  const { dispatch } = useApp()
  const [mode, setMode] = useState('template') // 'template' | 'custom'
  const [name, setName] = useState('תוכנית 20 שבועות — 10 ק"מ')
  const [startDate, setStartDate] = useState(TEMPLATE_DEFAULT_START)
  const [raceDate, setRaceDate] = useState(TEMPLATE_DEFAULT_RACE)
  const [raceLabel, setRaceLabel] = useState('מרוץ 10 ק"מ')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().slice(0, 10)

  function handleModeChange(m) {
    setMode(m)
    if (m === 'template') {
      setName('תוכנית 20 שבועות — 10 ק"מ')
      setStartDate(TEMPLATE_DEFAULT_START)
      setRaceDate(TEMPLATE_DEFAULT_RACE)
      setRaceLabel('מרוץ 10 ק"מ')
    } else {
      setName('תוכנית אישית')
      setStartDate(today)
      const d = new Date()
      d.setMonth(d.getMonth() + 3)
      setRaceDate(d.toISOString().slice(0, 10))
      setRaceLabel('מרוץ')
    }
  }

  function validate() {
    if (!name.trim()) return 'נא להזין שם לתוכנית'
    if (!startDate) return 'נא לבחור תאריך התחלה'
    if (!raceDate) return 'נא לבחור תאריך מרוץ'
    if (new Date(raceDate) <= new Date(startDate)) return 'תאריך המרוץ חייב להיות אחרי תאריך ההתחלה'
    return null
  }

  function handleSubmit(e) {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setSaving(true)

    const weeks = mode === 'template'
      ? generateWeeksFromTemplate(startDate)
      : generateEmptyWeeks(startDate, raceDate)

    if (replacePlanId) {
      dispatch({ type: 'DELETE_PLAN', id: replacePlanId })
    }
    dispatch({
      type: 'ADD_PLAN',
      plan: {
        id: generateId(),
        createdAt: new Date().toISOString(),
        profileId,
        name: name.trim(),
        raceDate,
        raceLabel: raceLabel.trim() || 'מרוץ',
        startDate,
        weeks,
      },
    })
    onClose()
  }

  const numWeeks = mode === 'template'
    ? trainingPlan.length
    : Math.max(1, Math.ceil((new Date(raceDate) - new Date(startDate)) / (7 * 24 * 60 * 60 * 1000)))

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md shadow-xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-bold">הוסף תוכנית אימונים</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* Mode selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">סוג תוכנית</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleModeChange('template')}
                className={`p-4 rounded-xl border-2 text-right transition-all
                  ${mode === 'template' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="text-2xl mb-1">📋</div>
                <div className="font-bold text-sm text-gray-900">תבנית מוכנה</div>
                <div className="text-xs text-gray-500 mt-0.5">20 שבועות — 10 ק"מ</div>
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('custom')}
                className={`p-4 rounded-xl border-2 text-right transition-all
                  ${mode === 'custom' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="text-2xl mb-1">✏️</div>
                <div className="font-bold text-sm text-gray-900">תוכנית ריקה</div>
                <div className="text-xs text-gray-500 mt-0.5">בנה תוכנית אישית</div>
              </button>
            </div>
          </div>

          {/* Template info */}
          {mode === 'template' && (
            <div className="bg-indigo-50 rounded-xl p-3 text-sm text-indigo-800 border border-indigo-100">
              <p className="font-semibold mb-1">תוכנית 20 שבועות מוכנה:</p>
              <ul className="space-y-0.5 text-xs text-indigo-700">
                <li>• שבועות 1–8: ריצות קלות עם עלייה הדרגתית</li>
                <li>• שבועות 9–16: ריצה ארוכה + אימון איכות</li>
                <li>• שבועות 17–20: הורדת עומס + שבוע מרוץ</li>
              </ul>
              <p className="text-xs text-indigo-500 mt-2">ניתן לשנות את תאריך ההתחלה — כל השבועות יזוזו בהתאם</p>
            </div>
          )}

          {/* Plan name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">שם התוכנית</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="לדוגמה: תוכנית 10 ק&quot;מ"
              className="input-field"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">תאריך התחלה</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">תאריך מרוץ</label>
              <input
                type="date"
                value={raceDate}
                onChange={(e) => setRaceDate(e.target.value)}
                min={startDate}
                className="input-field"
              />
            </div>
          </div>

          {/* Race label */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">שם האירוע</label>
            <input
              type="text"
              value={raceLabel}
              onChange={(e) => setRaceLabel(e.target.value)}
              placeholder='לדוגמה: מרוץ 10 ק"מ'
              className="input-field"
            />
          </div>

          {/* Summary */}
          {startDate && raceDate && new Date(raceDate) > new Date(startDate) && (
            <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700">
              <span className="font-semibold">{numWeeks} שבועות</span>
              {' '}מ-{new Date(startDate).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })}
              {' '}עד {new Date(raceDate).toLocaleDateString('he-IL', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
          )}
        </form>

        <div className="p-5 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">ביטול</button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={saving}
            className="btn-primary flex-1"
          >
            {saving ? 'יוצר...' : 'צור תוכנית'}
          </button>
        </div>
      </div>
    </div>
  )
}
