import React, { useState, useEffect } from 'react'
import { useApp, useCurrentProfile } from '../context/AppContext'
import {
  getStravaAuthUrl, exchangeStravaCode, fetchStravaRuns,
  getValidToken, mapStravaActivity,
} from '../utils/strava'
import { getWeekForDate } from '../data/trainingPlan'
import { useProfilePlan } from '../context/AppContext'

export default function StravaSync() {
  const { state, dispatch } = useApp()
  const profile = useCurrentProfile()
  const [syncing, setSyncing] = useState(false)
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)

  const tokens = profile?.stravaTokens ?? null
  const connected = !!tokens
  const plan = useProfilePlan(profile?.id)

  // Handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state_param = params.get('state')

    if (code && state_param === 'strava_auth' && profile?.isStravaUser) {
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname)
      handleCode(code)
    }
  }, [profile?.id])

  async function handleCode(code) {
    setSyncing(true)
    setError(null)
    try {
      const tokenData = await exchangeStravaCode(code)
      dispatch({ type: 'SAVE_STRAVA_TOKENS', profileId: profile.id, tokens: tokenData })
      setStatus('מחובר ל-Strava! מסנכרן ריצות...')
      await doSync(tokenData)
    } catch (e) {
      setError('שגיאה בחיבור ל-Strava: ' + e.message)
    } finally {
      setSyncing(false)
    }
  }

  async function doSync(overrideTokens) {
    setSyncing(true)
    setError(null)
    const tok = overrideTokens || tokens
    try {
      const accessToken = await getValidToken(tok, (fresh) => {
        dispatch({ type: 'SAVE_STRAVA_TOKENS', profileId: profile.id, tokens: fresh })
      })

      // Fetch runs since plan start (or 3 months ago if no plan)
      const since = plan?.startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      const runs = await fetchStravaRuns(accessToken, since)
      let imported = 0

      for (const activity of runs) {
        const mapped = mapStravaActivity(activity)
        const stravaId = String(activity.id)

        // Check if already imported
        const alreadyPlan = state.workoutLogs.some(
          (l) => l.stravaId === stravaId
        )
        const alreadyFree = state.freeRuns.some(
          (r) => r.profileId === profile.id && r.stravaId === stravaId
        )
        if (alreadyPlan || alreadyFree) continue

        // Try to match to a plan week
        const week = plan ? getWeekForDate(mapped.date, plan.weeks) : null
        let matched = false

        if (week && plan) {
          const unlogged = week.workouts.find((w) =>
            !state.workoutLogs.some(
              (l) => l.planId === plan.id && l.weekNum === week.week && l.workoutId === w.id
            )
          )
          if (unlogged) {
            dispatch({
              type: 'LOG_WORKOUT',
              log: {
                profileId: profile.id,
                planId: plan.id,
                weekNum: week.week,
                workoutId: unlogged.id,
                stravaId,
                stravaName: mapped.stravaName,
                date: mapped.date,
                duration: mapped.duration,
                distance: mapped.distance,
                avgHeartRate: mapped.avgHeartRate,
                pace: mapped.pace,
                kneeFeeling: null,
                notes: `יובא מ-Strava: ${mapped.stravaName}`,
                photos: [],
                completedAt: new Date().toISOString(),
              },
            })
            matched = true
            imported++
          }
        }

        if (!matched) {
          // Add as free run
          dispatch({
            type: 'ADD_FREE_RUN',
            run: {
              profileId: profile.id,
              stravaId,
              title: mapped.stravaName || 'ריצה מ-Strava',
              date: mapped.date,
              duration: mapped.duration,
              distance: mapped.distance,
              avgHeartRate: mapped.avgHeartRate,
              pace: mapped.pace,
              kneeFeeling: null,
              notes: 'יובא מ-Strava',
              photos: [],
            },
          })
          imported++
        }
      }

      setStatus(`סנכרון הושלם — ${imported} ריצות חדשות יובאו`)
    } catch (e) {
      setError('שגיאה בסנכרון: ' + e.message)
    } finally {
      setSyncing(false)
    }
  }

  function disconnect() {
    dispatch({ type: 'CLEAR_STRAVA_TOKENS', profileId: profile.id })
    setStatus(null)
    setError(null)
  }

  if (!profile?.isStravaUser) return null

  return (
    <div className="card border-orange-100 bg-orange-50">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-500">
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
          </svg>
        </div>
        <div>
          <div className="font-bold text-gray-900 text-sm">Strava</div>
          <div className="text-xs text-gray-500">
            {connected ? '✓ מחובר' : 'לא מחובר'}
          </div>
        </div>
        <div className="mr-auto flex items-center gap-2">
          {connected ? (
            <>
              <button
                onClick={() => doSync()}
                disabled={syncing}
                className="text-xs font-semibold bg-orange-500 text-white px-3 py-1.5 rounded-lg
                  hover:bg-orange-600 disabled:opacity-50 transition-colors flex items-center gap-1"
              >
                {syncing ? (
                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                סנכרן
              </button>
              <button
                onClick={disconnect}
                className="text-xs text-gray-400 hover:text-red-500 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
              >
                נתק
              </button>
            </>
          ) : (
            <a
              href={getStravaAuthUrl()}
              className="text-xs font-semibold bg-orange-500 text-white px-3 py-1.5 rounded-lg
                hover:bg-orange-600 transition-colors inline-flex items-center gap-1"
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
              </svg>
              חבר ל-Strava
            </a>
          )}
        </div>
      </div>

      {status && (
        <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          {status}
        </div>
      )}
      {error && (
        <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
    </div>
  )
}
