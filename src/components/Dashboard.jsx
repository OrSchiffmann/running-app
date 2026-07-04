import React, { useState, useEffect } from 'react'
import { getCurrentWeek, typeColors, typeLabels } from '../data/trainingPlan'
import { useApp, useCurrentProfile, useProfilePlan } from '../context/AppContext'
import { formatDuration, toHours } from '../utils/format'
import WorkoutLogModal from './WorkoutLogModal'
import StravaSync from './StravaSync'
import AddPlanModal from './AddPlanModal'
import AssignToWorkoutModal from './AssignToWorkoutModal'

const STAT_CONFIG = {
  workouts: { title: 'אימונים', filter: (l) => true },
  distance: { title: 'מרחק', filter: (l) => l.distance > 0 },
  duration: { title: 'זמן', filter: (l) => l.duration > 0 },
}

function StatsDetailModal({ logs, plan, statKey, dispatch, profileId, onClose }) {
  const [confirmId, setConfirmId] = useState(null)
  const [reassignEntry, setReassignEntry] = useState(null)
  const config = STAT_CONFIG[statKey]
  const filtered = logs.filter(config.filter)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

  function workoutLabel(log) {
    if (!plan || !log.workoutId) return null
    for (const week of plan.weeks) {
      const wo = week.workouts.find((w) => w.id === log.workoutId)
      if (wo) return `שבוע ${week.week} — ${wo.label}`
    }
    return null
  }

  function deleteEntry(entry) {
    if (entry._type === 'plan') {
      dispatch({ type: 'DELETE_WORKOUT_LOG', id: entry.id })
    } else {
      dispatch({ type: 'DELETE_FREE_RUN', id: entry.id })
    }
    setConfirmId(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-t-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">פירוט — {config.title}</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">{filtered.length} רשומות</span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 px-4 py-3 space-y-2">
          {filtered.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-8">אין רשומות</div>
          )}
          {filtered.map((entry) => {
            const isConfirming = confirmId === entry.id
            const label = entry._type === 'plan' ? workoutLabel(entry) : (entry.title || 'ריצה חופשית')
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
                    <button onClick={() => deleteEntry(entry)} className="text-xs font-bold text-white bg-red-500 px-3 py-1.5 rounded-lg hover:bg-red-600">מחק</button>
                    <button onClick={() => setConfirmId(null)} className="text-xs text-gray-500 px-2 py-1.5 rounded-lg hover:bg-gray-200">ביטול</button>
                  </div>
                ) : (
                  <div className="flex gap-1 flex-shrink-0">
                    {entry._type === 'plan' && (
                      <button onClick={() => setReassignEntry(entry)} className="text-gray-300 hover:text-indigo-500 p-1" title="שנה שיוך">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </button>
                    )}
                    <button onClick={() => setConfirmId(entry.id)} className="text-gray-300 hover:text-red-400 p-1" title="מחק">
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
        </div>
      </div>
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

function Countdown({ raceDate, raceLabel }) {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft())

  function calcTimeLeft() {
    const target = new Date(raceDate)
    const diff = target - new Date()
    if (diff <= 0) return null
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    }
  }

  useEffect(() => {
    setTimeLeft(calcTimeLeft())
    const t = setInterval(() => setTimeLeft(calcTimeLeft()), 60000)
    return () => clearInterval(t)
  }, [raceDate])

  if (!timeLeft) return (
    <div className="card bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center py-6">
      <div className="text-4xl mb-2">🏁</div>
      <div className="text-2xl font-extrabold">יום המרוץ הגיע!</div>
      <div className="text-sm opacity-90 mt-1">{raceLabel}</div>
    </div>
  )

  return (
    <div className="card bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-indigo-200 text-xs font-medium uppercase tracking-wide">ספירה לאחור</p>
          <p className="text-white font-bold text-sm">
            {raceLabel} — {new Date(raceDate).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' })} 🏁
          </p>
        </div>
        <span className="text-3xl">🏃</span>
      </div>
      <div className="flex gap-3 justify-center">
        {[
          { val: timeLeft.days, label: 'ימים' },
          { val: timeLeft.hours, label: 'שעות' },
          { val: timeLeft.minutes, label: 'דקות' },
        ].map(({ val, label }) => (
          <div key={label} className="flex-1 bg-white/20 rounded-xl py-3 text-center">
            <div className="text-3xl font-extrabold">{val}</div>
            <div className="text-xs text-indigo-200 font-medium">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WeekProgress({ week, planId, logs, onLog }) {
  const total = week.workouts.length
  const done = week.workouts.filter((w) =>
    logs.some((l) => l.planId === planId && l.weekNum === week.week && l.workoutId === w.id)
  ).length
  const pct = total > 0 ? (done / total) * 100 : 0

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-900">שבוע {week.week}</h3>
          <p className="text-xs text-gray-500">
            {new Date(week.startDate).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })}
            {' – '}
            {new Date(week.endDate).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })}
          </p>
        </div>
        <div className="text-left">
          <span className="text-2xl font-extrabold text-indigo-600">{done}</span>
          <span className="text-gray-400 font-medium">/{total}</span>
          <p className="text-xs text-gray-500">אימונים</p>
        </div>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
        <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="space-y-2">
        {week.workouts.map((workout) => {
          const log = logs.find(
            (l) => l.planId === planId && l.weekNum === week.week && l.workoutId === workout.id
          )
          return (
            <WorkoutRow key={workout.id} workout={workout} log={log} onLog={() => onLog(week.week, workout, log)} />
          )
        })}
      </div>
    </div>
  )
}

function WorkoutRow({ workout, log, onLog }) {
  const done = !!log
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
        ${done ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-100 hover:border-indigo-200'}`}
      onClick={onLog}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
        ${done ? 'bg-green-500' : 'bg-gray-200'}`}>
        {done ? (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-gray-900">{workout.label}</div>
        {workout.description && <div className="text-xs text-gray-500 truncate">{workout.description}</div>}
        {done && (
          <div className="flex gap-2 mt-1 flex-wrap">
            <span className="text-xs text-green-700 font-medium">✓ {formatDuration(log.duration)}</span>
            {log.distance && <span className="text-xs text-gray-500">{log.distance} ק"מ</span>}
            {log.kneeFeeling && (
              <span className={`text-xs font-medium ${log.kneeFeeling >= 7 ? 'text-red-500' : log.kneeFeeling >= 4 ? 'text-yellow-600' : 'text-green-600'}`}>
                ברך: {log.kneeFeeling}/10
              </span>
            )}
          </div>
        )}
      </div>
      {workout.type && (
        <span className={`badge ${typeColors[workout.type] ?? 'bg-gray-100 text-gray-500'} text-[10px]`}>
          {typeLabels[workout.type] ?? workout.type}
        </span>
      )}
    </div>
  )
}

export default function Dashboard({ setActiveTab }) {
  const { state, dispatch } = useApp()
  const profile = useCurrentProfile()
  const plan = useProfilePlan(profile?.id)
  const [logTarget, setLogTarget] = useState(null)
  const [showAddPlan, setShowAddPlan] = useState(false)
  const [statDetail, setStatDetail] = useState(null) // 'workouts' | 'distance' | 'duration'

  const planLogs = plan ? state.workoutLogs.filter((l) => l.planId === plan.id) : []
  const freeRunLogs = state.freeRuns.filter((r) => r.profileId === profile?.id)
  const planStravaIds = new Set(planLogs.map((l) => l.stravaId).filter(Boolean))
  const dedupedFreeRuns = freeRunLogs.filter((r) => !r.stravaId || !planStravaIds.has(r.stravaId))
  const allLogs = [...planLogs, ...dedupedFreeRuns]

  const totalCompleted = planLogs.length
  const totalDistance = allLogs.reduce((s, l) => s + (l.distance || 0), 0)
  const totalDuration = allLogs.reduce((s, l) => s + (l.duration || 0), 0)

  const currentWeek = plan ? getCurrentWeek(plan.weeks) : null
  const today = new Date()
  const planStarted = plan ? today >= new Date(plan.startDate) : false

  function handleLog(weekNum, workout, existing) {
    setLogTarget({ weekNum, workout, existing })
  }

  return (
    <div className="space-y-4">
      {/* Countdown */}
      {plan ? (
        <Countdown raceDate={plan.raceDate} raceLabel={plan.raceLabel} />
      ) : (
        <div className="card bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-6">
          <div className="text-4xl mb-2">🏃</div>
          <div className="text-lg font-bold">ברוך הבא, {profile?.name}!</div>
          <div className="text-sm text-indigo-200 mt-1">הוסף תוכנית אימונים כדי להתחיל</div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { key: 'workouts', value: totalCompleted, label: 'אימונים', color: 'text-indigo-600' },
          { key: 'distance', value: totalDistance.toFixed(1), label: 'ק"מ', color: 'text-purple-600' },
          { key: 'duration', value: toHours(totalDuration), label: 'שעות', color: 'text-green-600' },
        ].map(({ key, value, label, color }) => (
          <button
            key={key}
            onClick={() => setStatDetail(key)}
            className="card text-center py-3 hover:border-indigo-200 hover:shadow-md transition-all active:scale-95"
          >
            <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
            <div className="text-xs text-gray-500 font-medium">{label}</div>
            <div className="text-[10px] text-gray-300 mt-0.5">לפירוט לחצי ↗</div>
          </button>
        ))}
      </div>

      {/* Strava sync */}
      {profile?.isStravaUser && <StravaSync />}

      {/* No plan state */}
      {!plan && (
        <div className="card border-dashed border-2 border-indigo-200 bg-indigo-50 text-center py-8">
          <div className="text-4xl mb-3">📋</div>
          <p className="font-bold text-gray-800 text-lg">אין תוכנית אימונים</p>
          <p className="text-sm text-gray-500 mt-1 mb-5">הוסף תוכנית כדי לעקוב אחרי האימונים</p>
          <button onClick={() => setShowAddPlan(true)} className="btn-primary mx-auto">
            הוסף תוכנית
          </button>
        </div>
      )}

      {/* Current week */}
      {plan && !planStarted && (
        <div className="card bg-amber-50 border-amber-200 text-center py-5">
          <div className="text-3xl mb-2">📅</div>
          <div className="font-bold text-amber-800">
            התכנית מתחילה ב-{new Date(plan.startDate).toLocaleDateString('he-IL', { day: 'numeric', month: 'long' })}
          </div>
          <div className="text-sm text-amber-600 mt-1">בינתיים אפשר לתעד ריצות חופשיות</div>
        </div>
      )}

      {plan && planStarted && currentWeek && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900 text-lg">השבוע הנוכחי</h2>
            <div className="flex gap-1.5">
              {currentWeek.isRecovery && <span className="badge bg-amber-100 text-amber-700 text-xs">התאוששות</span>}
              {currentWeek.isTaper && <span className="badge bg-blue-100 text-blue-700 text-xs">הורדת עומס</span>}
            </div>
          </div>
          <WeekProgress
            week={currentWeek}
            planId={plan.id}
            logs={state.workoutLogs}
            onLog={handleLog}
          />
        </>
      )}

      {/* Quick link to full plan */}
      {plan && (
        <button
          onClick={() => setActiveTab('plan')}
          className="w-full card flex items-center justify-between hover:border-indigo-200 hover:shadow-md transition-all"
        >
          <div>
            <div className="font-bold text-gray-900">צפה בתכנית המלאה</div>
            <div className="text-sm text-gray-500">{plan.weeks.length} שבועות | {plan.raceLabel}</div>
          </div>
          <svg className="w-5 h-5 text-indigo-400 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {logTarget && plan && (
        <WorkoutLogModal
          weekNum={logTarget.weekNum}
          workout={logTarget.workout}
          existing={logTarget.existing}
          planId={plan.id}
          profileId={profile?.id}
          onClose={() => setLogTarget(null)}
        />
      )}

      {showAddPlan && (
        <AddPlanModal profileId={profile?.id} onClose={() => setShowAddPlan(false)} />
      )}

      {statDetail && (
        <StatsDetailModal
          logs={allLogs.map((l) => ({
            ...l,
            _type: planLogs.includes(l) ? 'plan' : 'free',
          }))}
          plan={plan}
          statKey={statDetail}
          dispatch={dispatch}
          profileId={profile?.id}
          onClose={() => setStatDetail(null)}
        />
      )}
    </div>
  )
}
