const storageKey = (userId) => `tailorpro.prefs.${userId}`

export function getPrefs(userId) {
  if (typeof window === 'undefined' || userId == null) return {}
  try {
    const raw = localStorage.getItem(storageKey(userId))
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function setPrefs(userId, patch) {
  const next = { ...getPrefs(userId), ...patch }
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(next))
  } catch {
    /* storage may be unavailable */
  }
  return next
}
