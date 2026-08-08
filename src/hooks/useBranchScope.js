import { useMemo } from 'react'
import { useAuth } from '@/context/AuthContext'
import { branches } from '@/data/mockData'

export function useBranchScope() {
  const { isAdmin, scopeBranchId } = useAuth()

  return useMemo(() => {
    const branchId = isAdmin ? null : scopeBranchId
    const branch = branchId ? branches.find((b) => b.id === branchId) : null
    return {
      branchId,
      branch,
      isScoped: branchId !== null && branchId !== undefined,
      scoped: (items) => (branchId ? items.filter((item) => item.branchId === branchId) : items),
      branchOptions: branches.map((b) => ({ value: String(b.id), label: b.name })),
    }
  }, [isAdmin, scopeBranchId])
}
