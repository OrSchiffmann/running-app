/**
 * Format total seconds as "Xדק' Yשנ'" (or just "Xדק'" when seconds=0).
 */
export function formatDuration(totalSeconds) {
  if (!totalSeconds && totalSeconds !== 0) return null
  const s = Math.round(Number(totalSeconds))
  const min = Math.floor(s / 60)
  const sec = s % 60
  if (sec === 0) return `${min} דק'`
  return `${min} דק' ${sec} שנ'`
}

/**
 * Convert separate minutes + seconds inputs to total seconds.
 */
export function toSeconds(min, sec) {
  return (Number(min) || 0) * 60 + (Number(sec) || 0)
}

/**
 * Split total seconds into { min, sec } for pre-filling inputs.
 */
export function splitSeconds(totalSeconds) {
  if (!totalSeconds && totalSeconds !== 0) return { min: '', sec: '' }
  const s = Math.round(Number(totalSeconds))
  return { min: Math.floor(s / 60), sec: s % 60 }
}

/**
 * Format total seconds as decimal hours (for summary stats).
 */
export function toHours(totalSeconds) {
  return Math.round((totalSeconds / 3600) * 10) / 10
}
