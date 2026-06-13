import React, { useState } from 'react'
import { typeLabels } from '../data/trainingPlan'
import { generateId } from '../utils/storage'

const TYPES = Object.entries(typeLabels)

export default function WorkoutDefModal({ workout, onSave, onDelete, onClose }) {
  const isNew = !workout
  const [form, setForm] = useState({
    label: workout?.label ?? '',
    description: workout?.description ?? '',
    targetDuration: workout?.targetDuration ?? '',
    type: workout?.type ?? 'easy',
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.label.trim()) return
    onSave({
      id: workout?.id || generateId(),
      label: form.label.trim(),
      description: form.description.trim() || null,
      targetDuration: form.targetDuration ? Number(form.targetDuration) : null,
      type: form.type || null,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-md shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold">{isNew ? 'אימון חדש' : 'עריכת אימון'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              שם האימון <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.label}
              onChange={(e) => set('label', e.target.value)}
              placeholder="למשל: ריצה ארוכה"
              className="input-field"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">תיאור</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="פרטי האימון..."
              rows={2}
              className="input-field resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">יעד (דקות)</label>
              <input
                type="number"
                value={form.targetDuration}
                onChange={(e) => set('targetDuration', e.target.value)}
                placeholder="45"
                min="1"
                max="300"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">סוג</label>
              <select value={form.type} onChange={(e) => set('type', e.target.value)} className="input-field">
                <option value="">ללא סוג</option>
                {TYPES.map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </form>

        <div className="p-5 border-t border-gray-100 flex gap-3">
          {!isNew && onDelete && (
            <button type="button" onClick={onDelete} className="btn-ghost text-red-500 hover:bg-red-50">מחק</button>
          )}
          <button type="button" onClick={onClose} className="btn-secondary flex-1">ביטול</button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!form.label.trim()}
            className="btn-primary flex-1"
          >
            {isNew ? 'הוסף' : 'שמור'}
          </button>
        </div>
      </div>
    </div>
  )
}
