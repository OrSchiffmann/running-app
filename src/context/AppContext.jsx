import React, { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react'
import { supabase } from '../utils/supabase'
import { useAuth } from './AuthContext'
import { getCurrentProfileId, setCurrentProfileId, generateId } from '../utils/storage'

const AppContext = createContext(null)

// ─── DB ↔ JS field mappers ────────────────────────────────────────────────────

function profileFromDB(row) {
  return {
    id: row.id,
    name: row.name,
    photo: row.photo || null,
    isStravaUser: row.is_strava_user || false,
    stravaTokens: row.strava_tokens || null,
  }
}

function planFromDB(row) {
  return {
    id: row.id,
    profileId: row.profile_id,
    name: row.name,
    raceDate: row.race_date,
    raceLabel: row.race_label,
    startDate: row.start_date,
    weeks: row.weeks || [],
    createdAt: row.created_at,
  }
}

function logFromDB(row) {
  return {
    id: row.id,
    profileId: row.profile_id,
    planId: row.plan_id,
    weekNum: row.week_num,
    workoutId: row.workout_id,
    duration: row.duration,
    distance: row.distance ? Number(row.distance) : null,
    avgHeartRate: row.avg_heart_rate,
    pace: row.pace,
    kneeFeeling: row.knee_feeling,
    notes: row.notes,
    date: row.date,
    photos: row.photos || [],
    stravaId: row.strava_id,
    stravaName: row.strava_name,
    completedAt: row.completed_at,
  }
}

function freeRunFromDB(row) {
  return {
    id: row.id,
    profileId: row.profile_id,
    title: row.title,
    date: row.date,
    duration: row.duration,
    distance: row.distance ? Number(row.distance) : null,
    avgHeartRate: row.avg_heart_rate,
    pace: row.pace,
    kneeFeeling: row.knee_feeling,
    notes: row.notes,
    photos: row.photos || [],
    stravaId: row.strava_id,
  }
}

// ─── Pure reducer (in-memory state only) ─────────────────────────────────────

const INITIAL_STATE = {
  profiles: [],
  plans: [],
  workoutLogs: [],
  freeRuns: [],
  currentProfileId: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_DATA':
      return {
        ...state,
        profiles: action.profiles,
        plans: action.plans,
        workoutLogs: action.workoutLogs,
        freeRuns: action.freeRuns,
      }

    case 'RESET':
      setCurrentProfileId(null)
      return INITIAL_STATE

    case 'SELECT_PROFILE':
      setCurrentProfileId(action.id)
      return { ...state, currentProfileId: action.id }

    case 'LOGOUT':
      setCurrentProfileId(null)
      return { ...state, currentProfileId: null }

    case 'ADD_PROFILE':
      return { ...state, profiles: [...state.profiles, action.profile] }

    case 'UPDATE_PROFILE':
      return {
        ...state,
        profiles: state.profiles.map((p) => p.id === action.profile.id ? action.profile : p),
      }

    case 'DELETE_PROFILE': {
      const currentProfileId = state.currentProfileId === action.id ? null : state.currentProfileId
      if (currentProfileId !== state.currentProfileId) setCurrentProfileId(null)
      return {
        ...state,
        currentProfileId,
        profiles: state.profiles.filter((p) => p.id !== action.id),
        plans: state.plans.filter((p) => p.profileId !== action.id),
        workoutLogs: state.workoutLogs.filter((l) => l.profileId !== action.id),
        freeRuns: state.freeRuns.filter((r) => r.profileId !== action.id),
      }
    }

    case 'ADD_PLAN':
      return { ...state, plans: [...state.plans, action.plan] }

    case 'UPDATE_PLAN':
      return { ...state, plans: state.plans.map((p) => p.id === action.plan.id ? action.plan : p) }

    case 'DELETE_PLAN':
      return {
        ...state,
        plans: state.plans.filter((p) => p.id !== action.id),
        workoutLogs: state.workoutLogs.filter((l) => l.planId !== action.id),
      }

    case 'LOG_WORKOUT': {
      const idx = state.workoutLogs.findIndex(
        (l) => l.planId === action.log.planId &&
               l.weekNum === action.log.weekNum &&
               l.workoutId === action.log.workoutId
      )
      return {
        ...state,
        workoutLogs: idx >= 0
          ? state.workoutLogs.map((l, i) => i === idx ? { ...l, ...action.log } : l)
          : [...state.workoutLogs, { id: generateId(), ...action.log }],
      }
    }

    case 'DELETE_WORKOUT_LOG':
      return { ...state, workoutLogs: state.workoutLogs.filter((l) => l.id !== action.id) }

    case 'ADD_FREE_RUN':
      return { ...state, freeRuns: [...state.freeRuns, { id: generateId(), ...action.run }] }

    case 'UPDATE_FREE_RUN':
      return { ...state, freeRuns: state.freeRuns.map((r) => r.id === action.run.id ? action.run : r) }

    case 'DELETE_FREE_RUN':
      return { ...state, freeRuns: state.freeRuns.filter((r) => r.id !== action.id) }

    case 'SAVE_STRAVA_TOKENS':
      return {
        ...state,
        profiles: state.profiles.map((p) =>
          p.id === action.profileId ? { ...p, stravaTokens: action.tokens } : p
        ),
      }

    case 'CLEAR_STRAVA_TOKENS':
      return {
        ...state,
        profiles: state.profiles.map((p) =>
          p.id === action.profileId ? { ...p, stravaTokens: null } : p
        ),
      }

    default:
      return state
  }
}

// ─── Supabase sync per action ─────────────────────────────────────────────────

function throwIfError({ error }) {
  if (error) throw new Error(error.message || JSON.stringify(error))
}

async function syncToSupabase(action, userId, state) {
  if (!userId) return

  switch (action.type) {
    case 'ADD_PROFILE':
      throwIfError(await supabase.from('profiles').insert({
        id: action.profile.id,
        user_id: userId,
        name: action.profile.name,
        photo: action.profile.photo || null,
        is_strava_user: action.profile.isStravaUser || false,
        strava_tokens: null,
      }))
      break

    case 'UPDATE_PROFILE':
      throwIfError(await supabase.from('profiles').update({
        name: action.profile.name,
        photo: action.profile.photo || null,
        is_strava_user: action.profile.isStravaUser || false,
      }).eq('id', action.profile.id))
      break

    case 'DELETE_PROFILE':
      throwIfError(await supabase.from('profiles').delete().eq('id', action.id))
      break

    case 'ADD_PLAN':
      throwIfError(await supabase.from('plans').insert({
        id: action.plan.id,
        user_id: userId,
        profile_id: action.plan.profileId,
        name: action.plan.name,
        race_date: action.plan.raceDate,
        race_label: action.plan.raceLabel,
        start_date: action.plan.startDate,
        weeks: action.plan.weeks,
      }))
      break

    case 'UPDATE_PLAN':
      throwIfError(await supabase.from('plans').update({
        name: action.plan.name,
        race_date: action.plan.raceDate,
        race_label: action.plan.raceLabel,
        start_date: action.plan.startDate,
        weeks: action.plan.weeks,
      }).eq('id', action.plan.id))
      break

    case 'DELETE_PLAN':
      throwIfError(await supabase.from('plans').delete().eq('id', action.id))
      break

    case 'LOG_WORKOUT': {
      const log = action.log
      const { data: existing, error: findErr } = await supabase
        .from('workout_logs')
        .select('id')
        .eq('plan_id', log.planId)
        .eq('week_num', log.weekNum)
        .eq('workout_id', log.workoutId)
        .maybeSingle()
      throwIfError({ error: findErr })

      if (existing) {
        throwIfError(await supabase.from('workout_logs').update({
          duration: log.duration,
          distance: log.distance,
          avg_heart_rate: log.avgHeartRate,
          pace: log.pace,
          knee_feeling: log.kneeFeeling,
          notes: log.notes,
          date: log.date,
          photos: log.photos,
          strava_id: log.stravaId || null,
          strava_name: log.stravaName || null,
          completed_at: log.completedAt,
        }).eq('id', existing.id))
      } else {
        throwIfError(await supabase.from('workout_logs').insert({
          id: log.id || generateId(),
          user_id: userId,
          profile_id: log.profileId,
          plan_id: log.planId,
          week_num: log.weekNum,
          workout_id: log.workoutId,
          duration: log.duration,
          distance: log.distance,
          avg_heart_rate: log.avgHeartRate,
          pace: log.pace,
          knee_feeling: log.kneeFeeling,
          notes: log.notes,
          date: log.date,
          photos: log.photos || [],
          strava_id: log.stravaId || null,
          strava_name: log.stravaName || null,
          completed_at: log.completedAt,
        }))
      }
      break
    }

    case 'DELETE_WORKOUT_LOG':
      throwIfError(await supabase.from('workout_logs').delete().eq('id', action.id))
      break

    case 'ADD_FREE_RUN': {
      const run = action.run
      throwIfError(await supabase.from('free_runs').insert({
        id: run.id || generateId(),
        user_id: userId,
        profile_id: run.profileId,
        title: run.title,
        date: run.date,
        duration: run.duration,
        distance: run.distance,
        avg_heart_rate: run.avgHeartRate,
        pace: run.pace,
        knee_feeling: run.kneeFeeling,
        notes: run.notes,
        photos: run.photos || [],
        strava_id: run.stravaId || null,
      }))
      break
    }

    case 'UPDATE_FREE_RUN': {
      const run = action.run
      throwIfError(await supabase.from('free_runs').update({
        title: run.title,
        date: run.date,
        duration: run.duration,
        distance: run.distance,
        avg_heart_rate: run.avgHeartRate,
        pace: run.pace,
        knee_feeling: run.kneeFeeling,
        notes: run.notes,
        photos: run.photos || [],
        profile_id: run.profileId,
      }).eq('id', run.id))
      break
    }

    case 'DELETE_FREE_RUN':
      throwIfError(await supabase.from('free_runs').delete().eq('id', action.id))
      break

    case 'SAVE_STRAVA_TOKENS':
      throwIfError(await supabase.from('profiles').update({
        strava_tokens: action.tokens,
      }).eq('id', action.profileId))
      break

    case 'CLEAR_STRAVA_TOKENS':
      throwIfError(await supabase.from('profiles').update({
        strava_tokens: null,
      }).eq('id', action.profileId))
      break
  }
}

// ─── Load all user data from Supabase ────────────────────────────────────────

async function loadUserData(userId) {
  const [profilesRes, plansRes, logsRes, runsRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', userId).order('created_at'),
    supabase.from('plans').select('*').eq('user_id', userId).order('created_at'),
    supabase.from('workout_logs').select('*').eq('user_id', userId).order('created_at'),
    supabase.from('free_runs').select('*').eq('user_id', userId).order('created_at'),
  ])

  return {
    profiles: (profilesRes.data || []).map(profileFromDB),
    plans: (plansRes.data || []).map(planFromDB),
    workoutLogs: (logsRes.data || []).map(logFromDB),
    freeRuns: (runsRes.data || []).map(freeRunFromDB),
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }) {
  const { user } = useAuth()
  const [state, localDispatch] = useReducer(reducer, {
    ...INITIAL_STATE,
    currentProfileId: getCurrentProfileId(),
  })
  const [dataLoading, setDataLoading] = useState(true)
  const [syncError, setSyncError] = useState(null)

  // Load / reset data when auth user changes
  useEffect(() => {
    if (!user) {
      localDispatch({ type: 'RESET' })
      setDataLoading(false)
      return
    }
    setDataLoading(true)
    loadUserData(user.id).then((data) => {
      localDispatch({ type: 'LOAD_DATA', ...data })
      // Restore last selected profile if still valid
      const savedId = getCurrentProfileId()
      if (savedId && data.profiles.some((p) => p.id === savedId)) {
        localDispatch({ type: 'SELECT_PROFILE', id: savedId })
      }
      setDataLoading(false)
    }).catch((err) => {
      console.error('Failed to load data from Supabase', err)
      setDataLoading(false)
    })
  }, [user?.id])

  // Async dispatch: optimistic update + background Supabase sync
  const dispatch = useCallback(async (action) => {
    // 1. Update local state immediately (optimistic)
    localDispatch(action)

    // 2. Actions that don't need Supabase sync
    const localOnly = ['SELECT_PROFILE', 'LOGOUT', 'LOAD_DATA', 'RESET']
    if (localOnly.includes(action.type) || !user) return

    // 3. Sync to Supabase in background
    try {
      setSyncError(null)
      await syncToSupabase(action, user.id, state)
    } catch (err) {
      console.error('Supabase sync error:', err)
      setSyncError(`שגיאה בשמירה: ${err.message || err}`)
    }
  }, [user, state])

  return (
    <AppContext.Provider value={{ state, dispatch, dataLoading, syncError }}>
      {children}
    </AppContext.Provider>
  )
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export function useCurrentProfile() {
  const { state } = useApp()
  return state.profiles.find((p) => p.id === state.currentProfileId) || null
}

export function useProfilePlan(profileId) {
  const { state } = useApp()
  return state.plans.find((p) => p.profileId === profileId) || null
}
