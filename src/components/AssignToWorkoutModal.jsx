import React, { useState } from 'react'
import { useApp, useProfilePlan } from '../context/AppContext'
import { formatDuration } from '../utils/format'
import { generateId } from '../utils/storage'

/**
 * Used for two cases:
 *  - mode='free_run': move a free run into a plan workout slot
 *  - mode='workout_log': reassign an existing workout log to a different slot
 */
export default function AssignToWorkoutModal({ run, workoutLog, profileId, onClose }) {
  const { state, dispatch } = useApp()
  const mode = workoutLog ? 'workout_log' : 'free_run'
  const resolvedProfileId = profileId || run?.profileId || workoutLog?.profileId
  const plan = useProfilePlan(resolvedProfileId)
  const [selected, setSelected] = useState(null)
  const [saving, setSaving] = useState(false)

  const entry = workoutLog || run
  const entryDate = entry?.date
  const entryTitle = workoutLog
    ? (() => {
        for (const week of (plan?.weeks ?? [])) {
          const wo = week.workouts.find((w) => w.id === workoutLog.workoutId)
          if (wo) return `שבוע ${week.week} — ${wo.label}`
        }
        return 'אימון מתכנית'
      })()
    : (run?.title || 'ריצה חופשית')

  if (!plan) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40" onClick={onClose}>
        <div className="bg-white rounded-t-2xl p-6 text-center" onClick={(e) => e.stopPropagation()}>
          <div className="text-3xl mb-2">📋</div>
          <p className="font-semibold text-gray-700">אין תכנית אימונים לפרופיל זה</p>
          <button onClick={onClose} className="btn-secondary mt-4 mx-auto">סגור</button>
        </div>
      </div>
    )
  }

  // Build flat list, mark logged slots (excluding current log being moved)
  const loggedKeys = new Set(
    state.workoutLogs
      .filter((l) => l.planId === plan.id && l.id !== workoutLog?.id)
      .map((l) => `${l.weekNum}-${l.workoutId}`)
  )

  const options = plan.weeks.flatMap((week) =>
    week.workouts.map((wo) => ({
      weekNum: week.week,
      workoutId: wo.id,
      weekLabel: `שבוע ${week.week}`,
      workoutLabel: wo.label,
      description: wo.description,
      isLogged: loggedKeys.has(`${week.week}-${wo.id}`),
      isCurrent: workoutLog?.weekNum === week.week && workoutLog?.workoutId === wo.id,
    }))
  )

  const sorted = [
    ...options.filter((o) => !o.isLogged && !o.isCurrent),
    ...options.filter((o) => o.isCurrent),
    ...options.filter((o) => o.isLogged && !o.isCurrent),
  ]

  function handleAssign() {
    if (!selected || saving) return
    setSaving(true)

    if (mode === 'free_run') {
      dispatch({
        type: 'LOG_WORKOUT',
        log: {
          id: generateId(),
          planId: plan.id,
          profileId: resolvedProfileId,
          weekNum: selected.weekNum,
          workoutId: selected.workoutId,
          date: run.date,
          duration: run.duration,
          distance: run.distance,
          pace: run.pace,
          avgHeartRate: run.avgHeartRate,
          kneeFeeling: run.kneeFeeling,
          notes: run.notes,
          stravaId: run.stravaId || null,
          stravaName: run.title || null,
          completedAt: new Date().toISOString(),
        },
      })
      dispatch({ type: 'DELETE_FREE_RUN', id: run.id })
    } else {
      dispatch({
        type: 'MOVE_WORKOUT_LOG',
        id: workoutLog.id,
        weekNum: selected.weekNum,
        workoutId: selected.workoutId,
      })
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-t-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="font-bold text-gray-900">
              {mode === 'workout_log' ? 'שנה שיוך אימון' : 'שייך לאימון בתכנית'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {entryTitle} •{' '}
              {entryDate ? new Date(entryDate).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' }) : ''}
              {entry?.distance ? ` • ${entry.distance} ק"מ` : ''}
              {entry?.duration ? ` • ${formatDuration(entry.duration)}` : ''}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Warning if already logged slot */}
        {selected?.isLogged && (
          <div className="mx-4 mt-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-800 font-medium">
            ⚠️ אימון זה כבר מתועד — השיוך יחליף את הרשומה הקיימת
          </div>
        )}

        {/* List */}
        <div className="overflow-y-auto flex-1 px-4 py-3 space-y-2">
          {sorted.map((opt) => {
            const key = `${opt.weekNum}-${opt.workoutId}`
            const isSelected = selected && `${selected.weekNum}-${selected.workoutId}` === key
            return (
              <button
                key={key}
                onClick={() => setSelected(opt)}
                className={`w-full text-right p-3 rounded-xl border-2 transition-all
                  ${isSelected
                    ? 'border-indigo-500 bg-indigo-50'
                    : opt.isLogged
                    ? 'border-gray-100 bg-gray-50 opacity-50'
                    : 'border-gray-100 bg-gray-50 hover:border-indigo-200'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-500">{opt.weekLabel}</span>
                      {opt.isCurrent && (
                        <span className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-1.5 py-0.5 rounded-full">נוכחי</span>
                      )}
                      {opt.isLogged && !opt.isCurrent && (
                        <span className="text-[10px] bg-green-100 text-green-700 font-semibold px-1.5 py-0.5 rounded-full">כבר מתועד</span>
                      )}
                    </div>
                    <div className="font-semibold text-sm text-gray-900 mt-0.5">{opt.workoutLabel}</div>
                    {opt.description && (
                      <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{opt.description}</div>
                    )}
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0 mr-2">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button onClick={onClose} className="btn-secondary flex-1">ביטול</button>
          <button
            onClick={handleAssign}
            disabled={!selected || saving}
            className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? 'משייך...' : 'שייך ←'}
          </button>
        </div>
      </div>
    </div>
  )
}
