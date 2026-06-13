const KEYS = {
  PROFILES: 'rapp_profiles',
  WORKOUT_LOGS: 'rapp_workout_logs',
  FREE_RUNS: 'rapp_free_runs',
  STRAVA_TOKENS: 'rapp_strava_tokens',
  CURRENT_PROFILE: 'rapp_current_profile',
  PLANS: 'rapp_plans',
}

function get(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('localStorage write failed', e)
  }
}

export function getProfiles() {
  return get(KEYS.PROFILES, [])
}

export function saveProfiles(profiles) {
  set(KEYS.PROFILES, profiles)
}

export function getWorkoutLogs() {
  return get(KEYS.WORKOUT_LOGS, [])
}

export function saveWorkoutLogs(logs) {
  set(KEYS.WORKOUT_LOGS, logs)
}

export function getFreeRuns() {
  return get(KEYS.FREE_RUNS, [])
}

export function saveFreeRuns(runs) {
  set(KEYS.FREE_RUNS, runs)
}

export function getStravaTokens(profileId) {
  const all = get(KEYS.STRAVA_TOKENS, {})
  return all[profileId] || null
}

export function saveStravaTokens(profileId, tokens) {
  const all = get(KEYS.STRAVA_TOKENS, {})
  all[profileId] = tokens
  set(KEYS.STRAVA_TOKENS, all)
}

export function clearStravaTokens(profileId) {
  const all = get(KEYS.STRAVA_TOKENS, {})
  delete all[profileId]
  set(KEYS.STRAVA_TOKENS, all)
}

export function getCurrentProfileId() {
  return sessionStorage.getItem(KEYS.CURRENT_PROFILE) || localStorage.getItem(KEYS.CURRENT_PROFILE)
}

export function setCurrentProfileId(id) {
  if (id) {
    localStorage.setItem(KEYS.CURRENT_PROFILE, id)
    sessionStorage.setItem(KEYS.CURRENT_PROFILE, id)
  } else {
    localStorage.removeItem(KEYS.CURRENT_PROFILE)
    sessionStorage.removeItem(KEYS.CURRENT_PROFILE)
  }
}

export function getPlans() {
  return get(KEYS.PLANS, [])
}

export function savePlans(plans) {
  set(KEYS.PLANS, plans)
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
