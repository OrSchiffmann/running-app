import React, { useState } from 'react'
import { typeColors, typeLabels } from '../data/trainingPlan'
import { useApp, useCurrentProfile, useProfilePlan } from '../context/AppContext'
import { formatDuration, toHours } from '../utils/format'
import KneeTrendChart from './KneeTrendChart'
import AssignToWorkoutModal from './AssignToWorkoutModal'

function StatCard({ label, value, unit, color = 'text-indigo-600', sub }) {
  return (
    <div className="card text-center py-4">
      <div className={`text-3xl font-extrabold ${color}`}>{value}</div>
      <div className="text-xs text-gray-500 font-medium">{unit}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
      <div className="text-xs text-gray-600 font-semibold mt-1">{label}</div>
    </div>
  )
}

function WeekSummaryRow({ week, logs }) {
  const totalWorkouts = week.workouts.length
  const doneWorkouts = week.workouts.filter((w) =>
    logs.some((l) => l.weekNum === week.week && l.workoutId === w.id)
  )
  const done = doneWorkouts.length
  const weekLogs = logs.filter((l) => l.weekNum === week.week)
  const totalDuration = weekLogs.reduce((s, l) => s + (l.duration || 0), 0) // seconds
  const totalDistance = weekLogs.reduce((s, l) => s + (l.distance || 0), 0)

  const isPast = new Date(week.endDate) < new Date()
  const incomplete = isPast && done < totalWorkouts

  return (
    <tr className={`border-b border-gray-50 text-sm ${done > 0 ? '' : 'opacity-50'}`}>
      <td className="py-2 pr-0 font-semibold text-gray-700 whitespace-nowrap">
        <span className="text-xs text-gray-400 ml-1">שבוע</span>{week.week}
        {week.isRecovery && <span className="text-amber-500 text-xs mr-1"> ↺</span>}
        {week.isTaper && <span className="text-sky-500 text-xs mr-1"> ↓</span>}
      </td>
      <td className="py-2 text-center">
        <span className={done === totalWorkouts ? 'text-green-600 font-bold' : incomplete ? 'text-red-400' : 'text-gray-600'}>
          {done}/{totalWorkouts}
        </span>
      </td>
      <td className="py-2 text-center text-gray-600">{totalDuration > 0 ? formatDuration(totalDuration) : '—'}</td>
      <td className="py-2 text-center text-gray-600">{totalDistance > 0 ? totalDistance.toFixed(1) : '—'}</td>
    </tr>
  )
}

function WorkoutTypeBreakdown({ logs, plan }) {
  const counts = {}
  const weeks = plan?.weeks ?? []
  logs.forEach((l) => {
    for (const week of weeks) {
      const w = week.workouts.find((wo) => wo.id === l.workoutId)
      if (w && w.type) { counts[w.type] = (counts[w.type] || 0) + 1; break }
    }
  })
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
  if (!entries.length) return null

  return (
    <div className="card">
      <h3 className="font-bold text-gray-900 mb-3">פירוט לפי סוג אימון</h3>
      <div className="space-y-2">
        {entries.map(([type, count]) => (
          <div key={type} className="flex items-center gap-3">
            <span className={`badge ${typeColors[type]} text-xs min-w-[70px] justify-center`}>
              {typeLabels[type]}
            </span>
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full"
                style={{ width: `${(count / logs.length) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700 min-w-[20px] text-left">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PersonalBests({ logs }) {
  if (!logs.length) return null
  const withDistance = logs.filter((l) => l.distance)
  const withDuration = logs.filter((l) => l.duration)
  const withPace = logs.filter((l) => l.pace)

  if (!withDistance.length && !withDuration.length) return null

  const longestRun = withDistance.length
    ? withDistance.reduce((best, l) => l.distance > best.distance ? l : best)
    : null
  const longestDuration = withDuration.length
    ? withDuration.reduce((best, l) => l.duration > best.duration ? l : best)
    : null

  function sortPace(a, b) {
    const toSec = (p) => {
      if (!p) return Infinity
      const [m, s] = p.split(':').map(Number)
      return m * 60 + (s || 0)
    }
    return toSec(a.pace) - toSec(b.pace)
  }
  const fastestPace = withPace.length ? [...withPace].sort(sortPace)[0] : null

  return (
    <div className="card">
      <h3 className="font-bold text-gray-900 mb-3">שיאים אישיים</h3>
      <div className="space-y-2">
        {longestRun && (
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-sm text-gray-600">ריצה הארוכה ביותר</span>
            <span className="font-bold text-indigo-600">{longestRun.distance} ק"מ</span>
          </div>
        )}
        {longestDuration && (
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-sm text-gray-600">אימון הארוך ביותר</span>
            <span className="font-bold text-green-600">{formatDuration(longestDuration.duration)}</span>
          </div>
        )}
        {fastestPace && (
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600">הקצב המהיר ביותר</span>
            <span className="font-bold text-purple-600">{fastestPace.pace} דק׳/ק"מ</span>
          </div>
        )}
      </div>
    </div>
  )
}

function ActivityLog({ planLogs, dedupedFreeRuns, plan, dispatch, profileId }) {
  const [confirmId, setConfirmId] = useState(null)
  const [reassignEntry, setReassignEntry] = useState(null)

  function deleteLog(entry) {
    if (entry._type === 'plan') {
      dispatch({ type: 'DELETE_WORKOUT_LOG', id: entry.id })
    } else {
      dispatch({ type: 'DELETE_FREE_RUN', id: entry.id })
    }
    setConfirmId(null)
  }

  // Find workout label from plan
  function workoutLabel(log) {
    if (!plan) return null
    for (const week of plan.weeks) {
      const wo = week.workouts.find((w) => w.id === log.workoutId)
      if (wo) return `שבוע ${week.week} — ${wo.label}`
    }
    return null
  }

  const all = [
    ...planLogs.map((l) => ({ ...l, _type: 'plan' })),
    ...dedupedFreeRuns.map((r) => ({ ...r, _type: 'free' })),
  ].sort((a, b) => (b.date || '').localeCompare(a.date || ''))

  if (!all.length) return (
    <div className="text-sm text-gray-400 text-center py-4">אין אימונים להצגה</div>
  )

  return (
    <div className="space-y-2">
      {all.map((entry) => {
        const isConfirming = confirmId === entry.id
        const label = entry._type === 'plan' ? workoutLabel(entry) : 'ריצה חופשית'
        const dateStr = entry.date
          ? new Date(entry.date).toLocaleDateString('he-IL', { day: 'numeric', month: 'short', year: '2-digit' })
          : '—'
        return (
          <div key={entry.id} className={`flex items-center gap-3 p-3 rounded-xl border text-sm transition-colors
            ${isConfirming ? 'border-red-300 bg-red-50' : 'border-gray-100 bg-gray-50'}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  entry._type === 'plan' ? 'bg-indigo-100 text-indigo-700' : 'bg-teal-100 text-teal-700'
                }`}>
                  {entry._type === 'plan' ? 'תכנית' : 'חופשי'}
                </span>
                {entry.stravaId && (
                  <span className="text-[10px] font-semibold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">Strava</span>
                )}
                <span className="text-gray-400 text-xs">{dateStr}</span>
              </div>
              <div className="text-gray-800 font-medium mt-0.5 truncate">{label || '—'}</div>
              <div className="flex gap-3 text-xs text-gray-500 mt-0.5">
                {entry.distance > 0 && <span>{entry.distance} ק"מ</span>}
                {entry.duration > 0 && <span>{formatDuration(entry.duration)}</span>}
              </div>
            </div>
            {isConfirming ? (
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => deleteLog(entry)}
                  className="text-xs font-bold text-white bg-red-500 px-3 py-1.5 rounded-lg hover:bg-red-600"
                >
                  מחק
                </button>
                <button
                  onClick={() => setConfirmId(null)}
                  className="text-xs text-gray-500 px-2 py-1.5 rounded-lg hover:bg-gray-200"
                >
                  ביטול
                </button>
              </div>
            ) : (
              <div className="flex gap-1 flex-shrink-0">
                {entry._type === 'plan' && (
                  <button
                    onClick={() => setReassignEntry(entry)}
                    className="text-gray-300 hover:text-indigo-500 transition-colors p-1"
                    title="שנה שיוך"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => setConfirmId(entry.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors p-1"
                  title="מחק"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )
      })}
      {reassignEntry && (
        <AssignToWorkoutModal
          workoutLog={reassignEntry}
          profileId={profileId}
          onClose={() => setReassignEntry(null)}
        />
      )}
    </div>
  )
}

export default function Progress() {
  const { state, dispatch } = useApp()
  const profile = useCurrentProfile()
  const plan = useProfilePlan(profile?.id)
  const [showAllWeeks, setShowAllWeeks] = useState(false)
  const [showActivityLog, setShowActivityLog] = useState(false)

  const planLogs = plan ? state.workoutLogs.filter((l) => l.planId === plan.id) : []
  const freeRunLogs = state.freeRuns.filter((r) => r.profileId === profile?.id)
  const planStravaIds = new Set(planLogs.map((l) => l.stravaId).filter(Boolean))
  const dedupedFreeRuns = freeRunLogs.filter((r) => !r.stravaId || !planStravaIds.has(r.stravaId))
  const allActivityLogs = [...planLogs, ...dedupedFreeRuns]

  const totalCompleted = planLogs.length
  const totalWorkouts = plan ? plan.weeks.reduce((s, w) => s + w.workouts.length, 0) : 0
  const totalDistance = allActivityLogs.reduce((s, l) => s + (l.distance || 0), 0)
  const totalDuration = allActivityLogs.reduce((s, l) => s + (l.duration || 0), 0) // seconds
  const completionPct = totalWorkouts > 0 ? Math.round((totalCompleted / totalWorkouts) * 100) : 0

  const kneeData = allActivityLogs
    .filter((l) => l.kneeFeeling && l.date)
    .map((l) => ({ date: l.date, value: l.kneeFeeling }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const planWeeks = plan?.weeks ?? []
  const weeksToShow = showAllWeeks ? planWeeks : planWeeks.slice(0, 10)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-extrabold text-gray-900 text-xl">התקדמות</h2>
        <p className="text-sm text-gray-500">{profile?.name}</p>
      </div>

      {!plan && (
        <div className="card text-center py-10">
          <div className="text-4xl mb-3">📊</div>
          <p className="font-semibold text-gray-700">אין תוכנית אימונים</p>
          <p className="text-sm text-gray-500 mt-1">הוסף תוכנית בטאב "תכנית" כדי לראות סטטיסטיקות</p>
        </div>
      )}

      {/* Overall progress */}
      {plan && <div className="card bg-gradient-to-l from-indigo-50 to-purple-50 border-indigo-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-800">התכנית</h3>
          <span className="text-2xl font-extrabold text-indigo-600">{completionPct}%</span>
        </div>
        <div className="w-full bg-white/70 rounded-full h-3 mb-1">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-700"
            style={{ width: `${completionPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{totalCompleted} מתוך {totalWorkouts} אימונים הושלמו</p>
      </div>}

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="סה״כ ריצות"
          value={allActivityLogs.length}
          unit="אימונים"
          color="text-indigo-600"
        />
        <StatCard
          label="מרחק כולל"
          value={totalDistance.toFixed(1)}
          unit='ק"מ'
          color="text-green-600"
        />
        <StatCard
          label="זמן כולל"
          value={toHours(totalDuration)}
          unit="שעות"
          color="text-purple-600"
        />
        <StatCard
          label="ריצות חופשיות"
          value={freeRunLogs.length}
          unit="ריצות"
          color="text-teal-600"
        />
      </div>

      {/* Knee trend chart */}
      {kneeData.length >= 2 && (
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">מגמת ברך לאורך זמן</h3>
          <KneeTrendChart data={kneeData} />
          <p className="text-xs text-gray-400 mt-2 text-center">ציר Y: 1=ללא כאב, 10=כאב חזק</p>
        </div>
      )}

      {/* Personal bests */}
      <PersonalBests logs={allActivityLogs} />

      {/* Workout type breakdown */}
      <WorkoutTypeBreakdown logs={planLogs} plan={plan} />

      {/* Activity log with delete */}
      <div className="card">
        <button
          onClick={() => setShowActivityLog((s) => !s)}
          className="w-full flex items-center justify-between"
        >
          <div>
            <h3 className="font-bold text-gray-900 text-right">פירוט אימונים</h3>
            <p className="text-xs text-gray-400 text-right mt-0.5">
              {[...planLogs, ...dedupedFreeRuns].length} רשומות — לחצי להצגה ומחיקה
            </p>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${showActivityLog ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showActivityLog && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <ActivityLog
              planLogs={planLogs}
              dedupedFreeRuns={dedupedFreeRuns}
              plan={plan}
              dispatch={dispatch}
              profileId={profile?.id}
            />
          </div>
        )}
      </div>

      {/* Weekly table */}
      <div className="card">
        <h3 className="font-bold text-gray-900 mb-3">סיכום שבועי</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-xs text-gray-400 font-semibold border-b border-gray-100">
                <th className="py-2 pr-0 font-semibold">שבוע</th>
                <th className="py-2 text-center font-semibold">סטטוס</th>
                <th className="py-2 text-center font-semibold">דקות</th>
                <th className="py-2 text-center font-semibold">ק"מ</th>
              </tr>
            </thead>
            <tbody>
              {weeksToShow.map((week) => (
                <WeekSummaryRow key={`${week.week}-${week.startDate}`} week={week} logs={planLogs} />
              ))}
            </tbody>
          </table>
        </div>
        {planWeeks.length > 10 && (
          <button
            onClick={() => setShowAllWeeks((s) => !s)}
            className="w-full mt-3 text-sm text-indigo-600 font-semibold hover:underline"
          >
            {showAllWeeks ? 'הצג פחות' : `הצג את כל ${planWeeks.length} השבועות`}
          </button>
        )}
      </div>
    </div>
  )
}
