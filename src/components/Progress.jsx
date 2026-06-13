import React, { useState } from 'react'
import { typeColors, typeLabels } from '../data/trainingPlan'
import { useApp, useCurrentProfile, useProfilePlan } from '../context/AppContext'
import { formatDuration, toHours } from '../utils/format'
import KneeTrendChart from './KneeTrendChart'

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

export default function Progress() {
  const { state } = useApp()
  const profile = useCurrentProfile()
  const plan = useProfilePlan(profile?.id)
  const [showAllWeeks, setShowAllWeeks] = useState(false)

  const planLogs = plan ? state.workoutLogs.filter((l) => l.planId === plan.id) : []
  const freeRunLogs = state.freeRuns.filter((r) => r.profileId === profile?.id)
  const allActivityLogs = [...planLogs, ...freeRunLogs]

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
