import { useSyncExternalStore } from 'react'
import { orders as seedOrders } from '@/data/mockData'

const STORAGE_KEY = 'tailorpro.orders'

let orders = load()
const listeners = new Set()

function load() {
  if (typeof window === 'undefined') return [...seedOrders]
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length) return parsed
    }
  } catch {
    /* ignore malformed storage */
  }
  return [...seedOrders]
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  } catch {
    /* storage may be unavailable */
  }
}

function notify() {
  for (const fn of listeners) fn()
}

export function getOrders() {
  return orders
}

export function addOrder(order) {
  orders = [order, ...orders]
  persist()
  notify()
}

export function updateOrderStatus(id, status) {
  orders = orders.map((o) => (o.id === id ? { ...o, status } : o))
  persist()
  notify()
}

export function subscribeOrders(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function useOrders() {
  return useSyncExternalStore(subscribeOrders, getOrders)
}
