import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { users } from '@/data/mockData'

const AuthContext = createContext(undefined)

const STORAGE_KEY = 'tailorpro.currentUser'

function getInitialUser() {
  if (typeof window === 'undefined') return users[0]
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      const match = users.find((u) => u.id === parsed.id)
      if (match) return match
    } catch {
      /* ignore malformed storage */
    }
  }
  return users[0]
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUserState] = useState(getInitialUser)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser))
  }, [currentUser])

  const setCurrentUser = useCallback((user) => {
    setCurrentUserState(user)
  }, [])

  const updateCurrentUser = useCallback((updates) => {
    setCurrentUserState((prev) => ({ ...prev, ...updates }))
  }, [])

  const value = useMemo(() => {
    const isAdmin = currentUser.role === 'administrator'
    const isManager = currentUser.role === 'manager'
    const isTailor = currentUser.role === 'tailor'
    return {
      currentUser,
      setCurrentUser,
      updateCurrentUser,
      isAdmin,
      isManager,
      isTailor,
      scopeBranchId: isAdmin ? null : currentUser.branchId || null,
    }
  }, [currentUser, setCurrentUser, updateCurrentUser])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
