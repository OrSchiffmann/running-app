const CLIENT_ID = '257746'
const CLIENT_SECRET = 'c93e40681ff5016b584f8c5126a302cf62be4f2c'
const AUTH_URL = 'https://www.strava.com/oauth/authorize'
const TOKEN_URL = 'https://www.strava.com/api/v3/oauth/token'
const API_BASE = 'https://www.strava.com/api/v3'

export function getStravaAuthUrl() {
  const redirectUri = window.location.origin + window.location.pathname
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    approval_prompt: 'auto',
    scope: 'activity:read_all',
    state: 'strava_auth',
  })
  return `${AUTH_URL}?${params.toString()}`
}

export async function exchangeStravaCode(code) {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  })
  if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`)
  return res.json()
}

export async function refreshStravaToken(refreshToken) {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })
  if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`)
  return res.json()
}

export function isTokenExpired(tokens) {
  if (!tokens?.expires_at) return true
  return Date.now() / 1000 >= tokens.expires_at - 60
}

export async function getValidToken(tokens, onRefresh) {
  if (!tokens) return null
  if (!isTokenExpired(tokens)) return tokens.access_token
  const fresh = await refreshStravaToken(tokens.refresh_token)
  if (onRefresh) onRefresh(fresh)
  return fresh.access_token
}

export async function fetchStravaRuns(accessToken, after = null) {
  const params = new URLSearchParams({ per_page: '200' })
  if (after) params.set('after', String(Math.floor(new Date(after).getTime() / 1000)))

  const res = await fetch(`${API_BASE}/athlete/activities?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error(`Strava fetch failed: ${res.status}`)
  const activities = await res.json()
  return activities.filter((a) => a.type === 'Run')
}

export function mapStravaActivity(activity) {
  const durationSec = activity.moving_time || 0
  const distanceKm = activity.distance ? +(activity.distance / 1000).toFixed(2) : null
  const avgHR = activity.average_heartrate ? Math.round(activity.average_heartrate) : null

  let pace = null
  if (distanceKm && durationSec && activity.distance) {
    const secPerKm = (durationSec / activity.distance) * 1000
    const paceMin = Math.floor(secPerKm / 60)
    const paceSec = Math.round(secPerKm % 60)
    pace = `${paceMin}:${String(paceSec).padStart(2, '0')}`
  }

  return {
    stravaId: String(activity.id),
    stravaName: activity.name,
    date: activity.start_date_local?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    duration: durationSec,
    distance: distanceKm,
    avgHeartRate: avgHR,
    pace,
  }
}
