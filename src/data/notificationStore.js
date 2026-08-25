import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'tailorpro.notifications'

function seed() {
  const now = Date.now()
  const iso = (minsAgo) => new Date(now - minsAgo * 60000).toISOString()
  return [
    {
      id: `seed-1`,
      recipientRole: 'manager',
      branchId: null,
      senderId: 1,
      title: 'Monthly Targets Updated',
      message: 'New production targets have been published for all branches.',
      type: 'info',
      createdAt: iso(45),
      read: false,
    },
    {
      id: `seed-2`,
      recipientUserId: 3,
      senderId: 1,
      title: 'Branch Review Meeting',
      message: 'Kabul branch review scheduled for Friday at 10:00 AM.',
      type: 'warning',
      createdAt: iso(180),
      read: false,
    },
    {
      id: `seed-3`,
      recipientTailorId: 1,
      branchId: 1,
      senderId: 3,
      title: 'Priority Order Assigned',
      message: 'ORD-009 was marked high priority. Please start cutting today.',
      type: 'error',
      createdAt: iso(20),
      read: false,
    },
    {
      id: `seed-4`,
      recipientUserId: 4,
      senderId: 3,
      title: 'Great Work!',
      message: 'You completed all assigned pieces this week.',
      type: 'success',
      createdAt: iso(1440),
      read: true,
    },
  ]
}

let notifications = load()
const listeners = new Set()

function load() {
  if (typeof window === 'undefined') return seed()
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    /* ignore malformed storage */
  }
  return seed()
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
  } catch {
    /* storage may be unavailable */
  }
}

function notify() {
  for (const fn of listeners) fn()
}

export function getNotifications() {
  return notifications
}

export function subscribeNotifications(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useNotifications() {
  return useSyncExternalStore(subscribeNotifications, getNotifications)
}

export function addNotification(payload) {
  const entry = {
    id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    read: false,
    ...payload,
  }
  notifications = [entry, ...notifications]
  persist()
  notify()
  return entry
}

export function markAsRead(id) {
  notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
  persist()
  notify()
}

export function deleteNotification(id) {
  notifications = notifications.filter((n) => n.id !== id)
  persist()
  notify()
}

export function isNotificationFor(n, user) {
  if (!user) return false
  if (n.recipientUserId != null && n.recipientUserId === user.id) return true
  if (n.recipientTailorId != null && user.tailorId != null && n.recipientTailorId === user.tailorId) return true
  if (n.recipientRole != null && n.recipientRole === user.role) {
    if (!n.branchId || user.role === 'administrator' || n.branchId === user.branchId) return true
  }
  return false
}

export function markAllReadFor(user) {
  notifications = notifications.map((n) =>
    !n.read && isNotificationFor(n, user) ? { ...n, read: true } : n
  )
  persist()
  notify()
}

export function notificationsFor(user) {
  return notifications
    .filter((n) => isNotificationFor(n, user))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export function notifAge(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return { unit: 'justNow', count: 0 }
  if (minutes < 60) return { unit: 'minutesAgo', count: minutes }
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return { unit: 'hoursAgo', count: hours }
  return { unit: 'daysAgo', count: Math.floor(hours / 24) }
}
