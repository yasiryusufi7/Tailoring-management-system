import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Building2, Plus, Users, Scissors, ShoppingBag, Phone, MapPin } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select'
import { BranchForm } from '@/components/forms/BranchForm'
import { useAuth } from '@/context/AuthContext'
import { branches as seedBranches, users as seedUsers, customers, tailors, orders } from '@/data/mockData'
import toast from 'react-hot-toast'

const seedManagers = seedUsers.filter((u) => u.role === 'manager')

export function BranchesPage() {
  const { t } = useTranslation()
  const { isAdmin } = useAuth()

  const [branches, setBranches] = useState(seedBranches)
  const [managers, setManagers] = useState(seedManagers)
  const [branchFormOpen, setBranchFormOpen] = useState(false)

  const branchOptions = branches.map((b) => ({ value: String(b.id), label: b.name }))
  const managerOptions = managers.map((m) => ({ value: String(m.id), label: m.name }))

  const stats = useMemo(() => {
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

  const getManagerName = (id) => managers.find((m) => m.id === id)?.name || '—'

  const handleAddBranch = (data) => {
    const newBranch = { ...data, id: Date.now(), managerId: null, createdAt: '2026-08-03' }
    setBranches((prev) => [...prev, newBranch])
  }

  const handleAssignManager = (branchId, managerId) => {
    const value = managerId ? Number(managerId) : null
    setBranches((prev) => prev.map((b) => (b.id === branchId ? { ...b, managerId: value } : b)))
    setManagers((prev) => prev.map((m) => (m.branchId === branchId ? { ...m, branchId: null } : m)))
    if (value) {
      setManagers((prev) => prev.map((m) => (m.id === value ? { ...m, branchId } : m)))
      toast.success(t('branches.managerAssigned'))
    }
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <UserCog className="h-12 w-12 text-muted-foreground opacity-40 mb-3" />
        <h2 className="text-lg font-semibold">{t('branches.adminOnlyTitle')}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t('branches.adminOnlyDesc')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('branches.title')}
        subtitle={t('branches.subtitle')}
        icon={Building2}
        breadcrumbs={[t('nav.dashboard'), t('branches.title')]}
        actions={
          <Button onClick={() => setBranchFormOpen(true)}>
            <Plus className="h-4 w-4" />
            {t('branches.addBranch')}
          </Button>
        }
      />

      {/* Branch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {branches.map((branch, i) => (
          <motion.div
            key={branch.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/20">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">{branch.name}</h3>
                      <p className="text-xs text-muted-foreground">{branch.createdAt}</p>
                    </div>
                  </div>
                  <Badge variant={branch.managerId ? 'success' : 'warning'}>
                    {branch.managerId ? t('branches.managed') : t('branches.unmanaged')}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" />{branch.address}</div>
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" />{branch.phone}</div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-muted/30 rounded-lg p-2.5 text-center">
                    <Users className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-lg font-bold">{stats[branch.id]?.customers || 0}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('branches.customers')}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-2.5 text-center">
                    <Scissors className="h-4 w-4 mx-auto mb-1 text-violet-600" />
                    <p className="text-lg font-bold">{stats[branch.id]?.tailors || 0}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('branches.tailors')}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-2.5 text-center">
                    <ShoppingBag className="h-4 w-4 mx-auto mb-1 text-emerald-600" />
                    <p className="text-lg font-bold">{stats[branch.id]?.orders || 0}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('branches.orders')}</p>
                  </div>
                </div>

                <div className="pt-3 border-t space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">{t('branches.assignedManager')}</p>
                  <div className="flex items-center gap-2">
                    <Avatar alt={getManagerName(branch.managerId)} size="sm" />
                    <Select
                      value={branch.managerId ? String(branch.managerId) : undefined}
                      onValueChange={(val) => handleAssignManager(branch.id, val)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder={t('branches.selectManager')} />
                      </SelectTrigger>
                      <SelectContent>
                        {managerOptions.map((m) => (
                          <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <BranchForm open={branchFormOpen} onOpenChange={setBranchFormOpen} onCreate={handleAddBranch} />
    </div>
  )
}
