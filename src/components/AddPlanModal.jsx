import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { generateWeeksFromTemplate, generateWeeksFromTemplateV2, generateEmptyWeeks, trainingPlan, trainingPlanV2 } from '../data/trainingPlan'
import { generateId } from '../utils/storage'

const TEMPLATE_DEFAULT_START = '2026-06-14'
const TEMPLATE_DEFAULT_RACE = '2026-10-30'

export default function AddPlanModal({ profileId, replacePlanId, onClose }) {
  const { dispatch } = useApp()
  const [mode, setMode] = useState('template') // 'template' | 'template_v2' | 'custom'
  const [name, setName] = useState('תוכנית 20 שבועות — 10 ק"מ')
  const [startDate, setStartDate] = useState(TEMPLATE_DEFAULT_START)
  const [raceDate, setRaceDate] = useState(TEMPLATE_DEFAULT_RACE)
  const [raceLabel, setRaceLabel] = useState('מרוץ 10 ק"מ')
  const [preserveWeeks, setPreserveWeeks] = useState(replacePlanId ? true : false)
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
    } else if (m === 'template_v2') {
      setName('תוכנית מעודכנת — 5% בשבוע, ידידותית לברך')
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
      : mode === 'template_v2'
      ? generateWeeksFromTemplateV2(startDate)
      : generateEmptyWeeks(startDate, raceDate)

    const newPlan = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      profileId,
      name: name.trim(),
      raceDate,
      raceLabel: raceLabel.trim() || 'מרוץ',
      startDate,
      weeks,
    }

    if (replacePlanId) {
      dispatch({
        type: 'REPLACE_PLAN',
        oldPlanId: replacePlanId,
        newPlan,
        preserveWeeks: preserveWeeks ? 3 : 0,
      })
    } else {
      dispatch({ type: 'ADD_PLAN', plan: newPlan })
    }
    onClose()
  }

  const numWeeks = mode === 'template'
    ? trainingPlan.length
    : mode === 'template_v2'
    ? trainingPlanV2.length
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
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleModeChange('template_v2')}
                className={`p-4 rounded-xl border-2 text-right transition-all
                  ${mode === 'template_v2' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🦵</span>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-gray-900">תוכנית מעודכנת — 5% בשבוע</div>
                    <div className="text-xs text-gray-500 mt-0.5">מ-50 דק׳ בשבוע 4 • ריצות איכות שטוחות מ-60 דק׳ • ידידותית לברך</div>
                  </div>
                  {mode === 'template_v2' && <span className="text-indigo-500 text-lg">✓</span>}
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('template')}
                className={`p-4 rounded-xl border-2 text-right transition-all
                  ${mode === 'template' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📋</span>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-gray-900">תוכנית מקורית</div>
                    <div className="text-xs text-gray-500 mt-0.5">20 שבועות קלאסי — 10 ק"מ</div>
                  </div>
                  {mode === 'template' && <span className="text-indigo-500 text-lg">✓</span>}
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('custom')}
                className={`p-4 rounded-xl border-2 text-right transition-all
                  ${mode === 'custom' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✏️</span>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-gray-900">תוכנית ריקה</div>
                    <div className="text-xs text-gray-500 mt-0.5">בנה תוכנית אישית</div>
                  </div>
                  {mode === 'custom' && <span className="text-indigo-500 text-lg">✓</span>}
                </div>
              </button>
            </div>
          </div>

          {/* Preserve weeks option (only when replacing) */}
          {replacePlanId && (
            <button
              type="button"
              onClick={() => setPreserveWeeks((v) => !v)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-right transition-all
                ${preserveWeeks ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all
                ${preserveWeeks ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                {preserveWeeks && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-gray-900">שמור שבועות 1–3 שכבר עשית</div>
                <div className="text-xs text-gray-500 mt-0.5">הלוגים של שבועות 1–3 יועברו לתוכנית החדשה ולא יימחקו</div>
              </div>
            </button>
          )}

          {/* Template info */}
          {mode === 'template_v2' && (
            <div className="bg-indigo-50 rounded-xl p-3 text-sm text-indigo-800 border border-indigo-100">
              <p className="font-semibold mb-1">תוכנית מעודכנת — 20 שבועות:</p>
              <ul className="space-y-0.5 text-xs text-indigo-700">
                <li>• שבועות 1–3: אינטרוולים + ריצה רציפה (כמו התוכנית המקורית)</li>
                <li>• שבועות 4–8: עלייה של 5%/שבוע, ריצות קלות (50→59 דק׳)</li>
                <li>• שבועות 9–17: ריצת איכות שטוחה + ריצה ארוכה (עד 83 דק׳)</li>
                <li>• שבועות 18–20: הורדת עומס + שבוע מרוץ</li>
              </ul>
              <p className="text-xs text-indigo-500 mt-2">כל ריצות האיכות הן על שטח שטוח בלבד — ללא עליות/ירידות</p>
            </div>
          )}
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
