import React, { useState } from 'react'
import { getCurrentWeek, typeColors, typeLabels } from '../data/trainingPlan'
import { useApp, useCurrentProfile, useProfilePlan } from '../context/AppContext'
import { formatDuration } from '../utils/format'
import WorkoutLogModal from './WorkoutLogModal'
import WorkoutDefModal from './WorkoutDefModal'
import AddPlanModal from './AddPlanModal'

function formatDate(str) {
  return new Date(str).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })
}

function formatDateRange(start, end) {
  return `${formatDate(start)} – ${formatDate(end)}`
}

function WeekBadges({ week }) {
  const badges = []
  if (week.isRecovery) badges.push({ label: 'התאוששות', cls: 'bg-amber-100 text-amber-700' })
  if (week.isTaper) badges.push({ label: 'הורדת עומס', cls: 'bg-sky-100 text-sky-700' })
  if (week.isRaceWeek) badges.push({ label: '🏁 שבוע המרוץ', cls: 'bg-purple-100 text-purple-700' })
  return (
    <>
      {badges.map((b) => (
        <span key={b.label} className={`badge text-[10px] ${b.cls}`}>{b.label}</span>
      ))}
    </>
  )
}

function WorkoutItem({ workout, log, onLog, onEdit }) {
  const done = !!log
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border transition-all
      ${done ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
      {/* Checkmark / log button */}
      <button
        type="button"
        onClick={onLog}
        className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors
          ${done ? 'bg-green-500' : 'border-2 border-gray-300 hover:border-indigo-400'}`}
      >
        {done && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content — click to log */}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onLog}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm text-gray-900">{workout.label}</span>
          {workout.type && (
            <span className={`badge text-[10px] ${typeColors[workout.type] ?? 'bg-gray-100 text-gray-600'}`}>
              {typeLabels[workout.type] ?? workout.type}
            </span>
          )}
          {workout.targetDuration && (
            <span className="text-xs text-gray-400">יעד: {workout.targetDuration} דק׳</span>
          )}
        </div>
        {workout.description && (
          <p className="text-xs text-gray-600 mt-0.5">{workout.description}</p>
        )}
        {done && (
          <div className="flex gap-3 mt-1 text-xs text-gray-500 flex-wrap">
            <span className="text-green-700 font-medium">✓ {formatDuration(log.duration)}</span>
            {log.distance && <span>{log.distance} ק"מ</span>}
            {log.pace && <span>{log.pace} דק׳/ק"מ</span>}
            {log.avgHeartRate && <span>{log.avgHeartRate} bpm</span>}
            {log.kneeFeeling && (
              <span className={log.kneeFeeling >= 7 ? 'text-red-500 font-medium' : log.kneeFeeling >= 4 ? 'text-yellow-600' : 'text-green-600'}>
                ברך: {log.kneeFeeling}/10
              </span>
            )}
          </div>
        )}
      </div>

      {/* Edit definition button */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onEdit() }}
        className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
        title="ערוך אימון"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
    </div>
  )
}

function WeekCard({ week, logs, planId, isOpen, onToggle, onLog, onEdit, onAddWorkout, isCurrent }) {
  const totalWorkouts = week.workouts.length
  const doneCount = week.workouts.filter((w) =>
    logs.some((l) => l.planId === planId && l.weekNum === week.week && l.workoutId === w.id)
  ).length
  const complete = doneCount === totalWorkouts && totalWorkouts > 0
  const isPast = new Date(week.endDate) < new Date()

  return (
    <div className={`card transition-all ${isCurrent ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}`}>
      <button className="w-full flex items-center gap-3 text-right" onClick={onToggle}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm flex-shrink-0
          ${complete ? 'bg-green-500 text-white'
            : isCurrent ? 'bg-indigo-600 text-white'
            : isPast ? 'bg-gray-300 text-gray-600'
            : 'bg-gray-100 text-gray-500'}`}>
          {complete ? '✓' : week.week}
        </div>

        <div className="flex-1 min-w-0 text-right">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-bold text-sm ${isCurrent ? 'text-indigo-700' : 'text-gray-900'}`}>
              שבוע {week.week}
              {isCurrent && <span className="text-indigo-500 font-normal"> — עכשיו</span>}
            </span>
            <WeekBadges week={week} />
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{formatDateRange(week.startDate, week.endDate)}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-green-500 h-1.5 rounded-full transition-all"
                style={{ width: `${totalWorkouts > 0 ? (doneCount / totalWorkouts) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">{doneCount}/{totalWorkouts}</span>
          </div>
        </div>

        <svg
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
          {week.workouts.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-2">אין אימונים לשבוע זה</p>
          )}
          {week.workouts.map((workout) => {
            const log = logs.find(
              (l) => l.planId === planId && l.weekNum === week.week && l.workoutId === workout.id
            )
            return (
              <WorkoutItem
                key={workout.id}
                workout={workout}
                log={log}
                onLog={() => onLog(week.week, workout, log)}
                onEdit={() => onEdit(week.week, workout)}
              />
            )
          })}

          <button
            type="button"
            onClick={() => onAddWorkout(week.week)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border-2 border-dashed border-gray-200
              text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            הוסף אימון לשבוע
          </button>
        </div>
      )}
    </div>
  )
}

function NoPlanState({ profileId }) {
  const [showAdd, setShowAdd] = useState(false)
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">📋</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">אין תוכנית אימונים</h3>
      <p className="text-gray-500 text-sm mb-6 max-w-xs">
        הוסף תוכנית אימונים לפרופיל זה — תוכנית מוכנה של 20 שבועות, או בנה תוכנית אישית.
      </p>
      <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        הוסף תוכנית
      </button>
      {showAdd && <AddPlanModal profileId={profileId} onClose={() => setShowAdd(false)} />}
    </div>
  )
}

export default function TrainingPlan() {
  const { state, dispatch } = useApp()
  const profile = useCurrentProfile()
  const plan = useProfilePlan(profile?.id)

  const currentWeek = plan ? getCurrentWeek(plan.weeks) : null

  const [openWeeks, setOpenWeeks] = useState(() => {
    if (!plan) return new Set()
    const w = getCurrentWeek(plan.weeks)
    return w ? new Set([w.week]) : new Set()
  })
  const [logTarget, setLogTarget] = useState(null)
  const [defTarget, setDefTarget] = useState(null) // { weekNum, workout | null }
  const [showAddPlan, setShowAddPlan] = useState(false)

  if (!plan) return <NoPlanState profileId={profile?.id} />

  const planLogs = state.workoutLogs.filter((l) => l.planId === plan.id)
  const totalDone = plan.weeks.reduce((sum, week) =>
    sum + week.workouts.filter((w) =>
      planLogs.some((l) => l.weekNum === week.week && l.workoutId === w.id)
    ).length, 0)
  const totalWorkouts = plan.weeks.reduce((s, w) => s + w.workouts.length, 0)

  function toggleWeek(num) {
    setOpenWeeks((prev) => {
      const next = new Set(prev)
      next.has(num) ? next.delete(num) : next.add(num)
      return next
    })
  }

  // Save workout definition (new or edited)
  function handleSaveWorkout(savedWorkout) {
    const { weekNum } = defTarget
    const updatedWeeks = plan.weeks.map((w) => {
      if (w.week !== weekNum) return w
      const exists = w.workouts.some((wo) => wo.id === savedWorkout.id)
      return {
        ...w,
        workouts: exists
          ? w.workouts.map((wo) => wo.id === savedWorkout.id ? savedWorkout : wo)
          : [...w.workouts, savedWorkout],
      }
    })
    dispatch({ type: 'UPDATE_PLAN', plan: { ...plan, weeks: updatedWeeks } })
    setDefTarget(null)
  }

  // Delete a workout definition
  function handleDeleteWorkout() {
    const { weekNum, workout } = defTarget
    const updatedWeeks = plan.weeks.map((w) => {
      if (w.week !== weekNum) return w
      return { ...w, workouts: w.workouts.filter((wo) => wo.id !== workout.id) }
    })
    dispatch({ type: 'UPDATE_PLAN', plan: { ...plan, weeks: updatedWeeks } })
    setDefTarget(null)
  }

  const raceDate = new Date(plan.raceDate)
  const daysLeft = Math.ceil((raceDate - new Date()) / (1000 * 60 * 60 * 24))

  return (
    <div className="space-y-4">
      {/* Plan header */}
      <div className="card bg-gradient-to-l from-indigo-50 to-purple-50 border-indigo-100">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-extrabold text-gray-900 text-lg">{plan.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {new Date(plan.startDate).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })}
              {' – '}
              {new Date(plan.raceDate).toLocaleDateString('he-IL', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
            {daysLeft > 0 && (
              <p className="text-xs text-indigo-600 font-semibold mt-1">
                🏁 {plan.raceLabel} — עוד {daysLeft} ימים
              </p>
            )}
          </div>
          <div className="text-left">
            <div className="text-2xl font-extrabold text-indigo-600">{totalDone}/{totalWorkouts}</div>
            <div className="text-xs text-gray-500">אימונים</div>
          </div>
        </div>
        <div className="w-full bg-white/70 rounded-full h-2 mt-3">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all"
            style={{ width: `${totalWorkouts > 0 ? (totalDone / totalWorkouts) * 100 : 0}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-400">{plan.weeks.length} שבועות</span>
          <button
            onClick={() => setShowAddPlan(true)}
            className="text-xs text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
          >
            החלף תוכנית
          </button>
        </div>
      </div>

      {/* Weeks */}
      {plan.weeks.map((week) => (
        <WeekCard
          key={`${week.week}-${week.startDate}`}
          week={week}
          logs={planLogs}
          planId={plan.id}
          isOpen={openWeeks.has(week.week)}
          onToggle={() => toggleWeek(week.week)}
          onLog={(weekNum, workout, existing) => setLogTarget({ weekNum, workout, existing })}
          onEdit={(weekNum, workout) => setDefTarget({ weekNum, workout })}
          onAddWorkout={(weekNum) => setDefTarget({ weekNum, workout: null })}
          isCurrent={currentWeek?.week === week.week && currentWeek?.startDate === week.startDate}
        />
      ))}

      {/* Log a completed workout */}
      {logTarget && (
        <WorkoutLogModal
          weekNum={logTarget.weekNum}
          workout={logTarget.workout}
          existing={logTarget.existing}
          planId={plan.id}
          profileId={profile?.id}
          onClose={() => setLogTarget(null)}
        />
      )}

      {/* Edit / add workout definition */}
      {defTarget && (
        <WorkoutDefModal
          workout={defTarget.workout}
          onSave={handleSaveWorkout}
          onDelete={defTarget.workout ? handleDeleteWorkout : null}
          onClose={() => setDefTarget(null)}
        />
      )}

      {showAddPlan && (
        <AddPlanModal profileId={profile?.id} replacePlanId={plan.id} onClose={() => setShowAddPlan(false)} />
      )}
    </div>
  )
}
