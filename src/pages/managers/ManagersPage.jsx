import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserCog, Plus, Users, Scissors, ShoppingBag, Building2, Mail, Clock, KeyRound, UserCheck, Pencil
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select'
import { ManagerForm } from '@/components/forms/ManagerForm'
import { ManagerEditForm } from '@/components/forms/ManagerEditForm'
import { useAuth } from '@/context/AuthContext'
import { branches as seedBranches, users as seedUsers, customers, tailors, orders } from '@/data/mockData'
import toast from 'react-hot-toast'

export function ManagersPage() {
  const { t } = useTranslation()
  const { isAdmin } = useAuth()

  const [managers, setManagers] = useState(seedUsers.filter((u) => u.role === 'manager'))
  const [branches, setBranches] = useState(seedBranches)
  const [formOpen, setFormOpen] = useState(false)
  const [editingManager, setEditingManager] = useState(null)

  const branchOptions = branches.map((b) => ({ value: String(b.id), label: b.name }))

  const branchStats = useMemo(() => {
    const count = (branchId, list) => list.filter((item) => item.branchId === branchId).length
    return branches.reduce((acc, b) => {
      acc[b.id] = {
        customers: count(b.id, customers),
        tailors: count(b.id, tailors),
        orders: count(b.id, orders),
      }
      return acc
    }, {})
  }, [branches])

  const getBranch = (id) => branches.find((b) => b.id === id)

  const handleAddManager = (data) => {
    const newManager = { id: Date.now(), name: data.name, email: data.email, role: 'manager', status: 'active', lastLogin: '—', branchId: data.branchId, phone: '', shopName: '', joined: '2026-08-03' }
    setManagers((prev) => [...prev, newManager])
    setBranches((prev) => prev.map((b) => (b.id === data.branchId ? { ...b, managerId: newManager.id } : b)))
  }

  const handleUpdateManager = (data) => {
    const { branchId, ...fields } = data
    const prev = managers.find((m) => m.id === editingManager.id)
    if (prev.branchId !== branchId) {
      setBranches((prevB) => prevB.map((b) => (b.managerId === editingManager.id ? { ...b, managerId: null } : b)))
      setBranches((prevB) => prevB.map((b) => (b.id === branchId ? { ...b, managerId: editingManager.id } : b)))
    }
    setManagers((prevM) => prevM.map((m) => (m.id === editingManager.id ? { ...m, ...fields, branchId } : m)))
  }

  const handleAssignBranch = (managerId, branchId) => {
    const value = branchId ? Number(branchId) : null
    setBranches((prev) => prev.map((b) => (b.managerId === managerId ? { ...b, managerId: null } : b)))
    setManagers((prev) => prev.map((m) => (m.id === managerId ? { ...m, branchId: value } : m)))
    if (value) {
      setBranches((prev) => prev.map((b) => (b.id === value ? { ...b, managerId } : b)))
      toast.success(t('branches.managerAssigned'))
    }
  }

  const activeCount = managers.filter((m) => m.status === 'active').length
  const coveredCount = managers.filter((m) => m.branchId).length

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <UserCog className="h-12 w-12 text-muted-foreground opacity-40 mb-3" />
        <h2 className="text-lg font-semibold">{t('managers.adminOnlyTitle')}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t('managers.adminOnlyDesc')}</p>
      </div>
    )
  }

  const stats = [
    { label: t('managers.totalManagers'), value: managers.length, color: 'text-primary', icon: UserCog, bg: 'bg-primary/10' },
    { label: t('managers.activeManagers'), value: activeCount, color: 'text-emerald-600', icon: UserCheck, bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { label: t('managers.branchesCovered'), value: coveredCount, color: 'text-violet-600', icon: Building2, bg: 'bg-violet-100 dark:bg-violet-900/30' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('managers.title')}
        subtitle={t('managers.subtitle')}
        icon={UserCog}
        breadcrumbs={[t('nav.dashboard'), t('managers.title')]}
        actions={
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" />
            {t('managers.addManager')}
          </Button>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 end-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full group-hover:from-primary/10 transition-all duration-300" />
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className={`text-2xl font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Manager Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <AnimatePresence>
          {managers.map((manager, i) => {
            const branch = getBranch(manager.branchId)
            const statsForBranch = branch ? branchStats[branch.id] : null
            return (
              <motion.div
                key={manager.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-5">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-4">
                      <Avatar alt={manager.name} size="lg" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-base truncate">{manager.name}</h3>
                          <Badge variant="purple">{t('roles.manager')}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{manager.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={manager.status === 'active' ? 'success' : 'warning'}>
                          {t('managers.status')}: {manager.status === 'active' ? t('common.active', 'Active') : manager.status}
                        </Badge>
                        <button
                          onClick={() => setEditingManager(manager)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                          title={t('common.edit')}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Branch */}
                    <div className="flex items-center justify-between rounded-xl border p-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{t('managers.assignedBranch')}</p>
                          <p className="text-sm font-medium">{branch ? branch.name : t('managers.unassigned')}</p>
                        </div>
                      </div>
                      <Select
                        value={manager.branchId ? String(manager.branchId) : undefined}
                        onValueChange={(val) => handleAssignBranch(manager.id, val)}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue placeholder={t('managers.selectBranch')} />
                        </SelectTrigger>
                        <SelectContent>
                          {branchOptions.map((b) => (
                            <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Branch Data */}
                    {statsForBranch ? (
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="bg-muted/30 rounded-lg p-2.5 text-center">
                          <Users className="h-4 w-4 mx-auto mb-1 text-primary" />
                          <p className="text-lg font-bold">{statsForBranch.customers}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('managers.managedCustomers')}</p>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-2.5 text-center">
                          <Scissors className="h-4 w-4 mx-auto mb-1 text-violet-600" />
                          <p className="text-lg font-bold">{statsForBranch.tailors}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('managers.managedTailors')}</p>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-2.5 text-center">
                          <ShoppingBag className="h-4 w-4 mx-auto mb-1 text-emerald-600" />
                          <p className="text-lg font-bold">{statsForBranch.orders}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('managers.managedOrders')}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 rounded-xl bg-muted/30 p-3 mb-4 text-sm text-muted-foreground">
                        <KeyRound className="h-4 w-4" />
                        {t('managers.unassigned')}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {t('managers.lastLogin')}: {manager.lastLogin}
                      </span>
                      {branch && <span className="text-[10px]">{branch.address}</span>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <ManagerForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onCreate={handleAddManager}
        branchOptions={branchOptions}
      />

      <ManagerEditForm
        open={!!editingManager}
        onOpenChange={(open) => !open && setEditingManager(null)}
        onUpdate={handleUpdateManager}
        branchOptions={branchOptions}
        manager={editingManager}
      />
    </div>
  )
}
