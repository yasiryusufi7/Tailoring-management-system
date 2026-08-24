import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Scissors, Plus, Star, DollarSign, Clock, TrendingUp, AlertTriangle, Building2, LayoutGrid, List } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { DataTable } from '@/components/common/DataTable'
import { TailorForm } from '@/components/forms/TailorForm'
import { useBranchScope } from '@/hooks/useBranchScope'
import { useAuth } from '@/context/AuthContext'
import { useOrders } from '@/data/orderStore'
import { tailors as seedTailors, branches } from '@/data/mockData'

const ACTIVE_STATUSES = ['received', 'assigned', 'cutting', 'stitching', 'ironing']

export function TailorsPage() {
  const { t } = useTranslation()
  const { scoped } = useBranchScope()
  const { isAdmin } = useAuth()
  const [tailorList, setTailorList] = useState(seedTailors)
  const tailors = scoped(tailorList)
  const orders = scoped(useOrders())
  const [hoveredId, setHoveredId] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [view, setView] = useState('list')

  const handleSaveTailor = (data) => {
    setTailorList((prev) => [
      ...prev,
      {
        ...data,
        id: Date.now(),
        rating: 0,
        completed: 0,
        pendingPayment: 0,
        joinedDate: new Date().toISOString().slice(0, 10),
      },
    ])
  }

  const getBranchName = (id) =>
    branches.find((b) => b.id === id)?.name || '—'

  const today = new Date().toISOString().slice(0, 10)

  const statsByTailor = useMemo(() => {
    const map = {}
    for (const tailor of tailors) {
      const mine = orders.filter((o) => o.tailorId === tailor.id)
      const active = mine.filter((o) => ACTIVE_STATUSES.includes(o.status))
      map[tailor.id] = {
        active: active.length,
        ready: mine.filter((o) => o.status === 'ready').length,
        delivered: mine.filter((o) => o.status === 'delivered').length,
        overdue: active.filter((o) => o.deliveryDate < today).length,
        backlogDays: Math.ceil(active.length / (tailor.dailyProduction || 1)),
      }
    }
    return map
  }, [tailors, orders, today])

  const maxActive = Math.max(1, ...tailors.map((tl) => statsByTailor[tl.id]?.active || 0))

  const totalTailors = tailors.length
  const avgDailyProduction = (tailors.reduce((sum, tailor) => sum + tailor.dailyProduction, 0) / tailors.length).toFixed(1)
  const totalWages = tailors.reduce((sum, tailor) => sum + tailor.monthlyWage, 0)
  const totalPending = tailors.reduce((sum, tailor) => sum + tailor.pendingPayment, 0)

  const chartData = tailors.map((tailor) => ({
    name: tailor.name.split(' ')[0],
    active: statsByTailor[tailor.id]?.active || 0,
    ready: statsByTailor[tailor.id]?.ready || 0,
    delivered: statsByTailor[tailor.id]?.delivered || 0,
  }))

  const stats = [
    { label: t('tailors.totalTailors', 'Total Tailors'), value: totalTailors, color: 'text-primary', icon: Scissors, bg: 'bg-primary/10' },
    { label: t('tailors.avgProduction', 'Avg Daily Production'), value: `${avgDailyProduction} pcs`, color: 'text-violet-600', icon: TrendingUp, bg: 'bg-violet-100 dark:bg-violet-900/30' },
    { label: t('tailors.totalWages', 'Total Monthly Wages'), value: `PKR ${totalWages.toLocaleString()}`, color: 'text-emerald-600', icon: DollarSign, bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { label: t('tailors.pendingPayments', 'Total Pending'), value: `PKR ${totalPending.toLocaleString()}`, color: 'text-amber-600', icon: Clock, bg: 'bg-amber-100 dark:bg-amber-900/30' },
  ]

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const hasHalf = rating % 1 >= 0.5
    const stars = []
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)
      } else if (i === fullStars && hasHalf) {
        stars.push(
          <span key={i} className="relative inline-block h-3.5 w-3.5">
            <Star className="absolute inset-0 h-3.5 w-3.5 text-gray-200 dark:text-gray-700" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            </span>
          </span>
        )
      } else {
        stars.push(<Star key={i} className="h-3.5 w-3.5 text-gray-200 dark:text-gray-700" />)
      }
    }
    return stars
  }

  const listColumns = [
    { key: 'name', label: t('tailors.name'), render: (val, row) => (
      <div className="flex items-center gap-3">
        <Avatar alt={val} size="sm" />
        <div>
          <p className="font-medium">{val}</p>
          <p className="text-xs text-muted-foreground">{row.specialization}</p>
        </div>
      </div>
    )},
    ...(isAdmin ? [{
      key: 'branchId',
      label: t('forms.branch'),
      render: (val) => (
        <Badge variant="outline" className="text-xs">
          <Building2 className="h-3 w-3 me-1" />
          {getBranchName(val)}
        </Badge>
      ),
    }] : []),
    { key: 'rating', label: t('tailors.rating'), sortable: false, render: (val) => (
      <div className="flex items-center gap-1">
        {renderStars(val)}
        <span className="text-xs font-medium text-muted-foreground ms-1">{val}</span>
      </div>
    )},
    { key: 'dailyProduction', label: t('tailors.dailyProduction'), render: (val) => (
      <span>{val} <span className="text-xs text-muted-foreground">{t('tailors.pieces')}</span></span>
    )},
    { key: 'active', label: t('tailorWork.activeOrders'), sortable: false, render: (_, row) => {
      const s = statsByTailor[row.id] || {}
      return (
        <div className="flex items-center gap-1.5">
          <Badge variant="secondary" className="text-xs">{s.active || 0}</Badge>
          {s.overdue > 0 && (
            <Badge variant="destructive" className="text-[10px] gap-0.5">
              <AlertTriangle className="h-3 w-3" />
              {s.overdue}
            </Badge>
          )}
        </div>
      )
    }},
    { key: 'ready', label: t('orders.statuses.ready'), sortable: false, render: (_, row) => (
      <span>{statsByTailor[row.id]?.ready || 0}</span>
    )},
    { key: 'delivered', label: t('orders.statuses.delivered'), sortable: false, render: (_, row) => (
      <span>{statsByTailor[row.id]?.delivered || 0}</span>
    )},
    { key: 'backlog', label: t('tailors.workload'), sortable: false, render: (_, row) => {
      const s = statsByTailor[row.id] || {}
      return (
        <span className={`text-sm ${s.overdue > 0 ? 'text-red-600 font-medium' : ''}`}>
          {s.active > 0 ? t('tailors.backlog', { count: s.backlogDays }) : t('tailors.noWork')}
        </span>
      )
    }},
    { key: 'monthlyWage', label: t('tailors.monthlyWage'), render: (val) => (
      <span className="font-medium">PKR {val.toLocaleString()}</span>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('tailors.title', 'Tailors')}
        subtitle={t('tailors.subtitle', 'Manage tailor workforce and track production')}
        icon={Scissors}
        breadcrumbs={[t('nav.dashboard', 'Dashboard'), t('nav.tailors', 'Tailors')]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setView(view === 'list' ? 'grid' : 'list')}>
              {view === 'list' ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
            </Button>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4" />
              {t('tailors.addTailor', 'Add Tailor')}
            </Button>
          </div>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
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

      {/* Productivity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-base">{t('tailors.workloadChart')}</CardTitle>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-indigo-500" />{t('tailorWork.activeOrders')}</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />{t('orders.statuses.ready')}</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-slate-400" />{t('orders.statuses.delivered')}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {tailors.length === 0 ? (
              <p className="py-12 text-center text-muted-foreground">{t('tailors.totalTailors')}: 0</p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barCategoryGap="25%">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '13px',
                      }}
                      cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                    />
                    <Bar dataKey="active" name={t('tailorWork.activeOrders')} stackId="w" fill="#6366f1" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="ready" name={t('orders.statuses.ready')} stackId="w" fill="#10b981" />
                    <Bar dataKey="delivered" name={t('orders.statuses.delivered')} stackId="w" fill="#94a3b8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Tailors: list (default) or cards */}
      {view === 'grid' ? (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {tailors.map((tailor, i) => {
          const stats = statsByTailor[tailor.id] || { active: 0, ready: 0, delivered: 0, overdue: 0, backlogDays: 0 }
          const workloadPercent = Math.min((stats.active / maxActive) * 100, 100)
          return (
            <motion.div
              key={tailor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
              onMouseEnter={() => setHoveredId(tailor.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Card className={`transition-all duration-300 ${hoveredId === tailor.id ? 'shadow-xl scale-[1.02] border-primary/20' : 'hover:shadow-lg'}`}>
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="p-5 pb-4">
                    <div className="flex items-start gap-3.5">
                      <Avatar alt={tailor.name} size="lg" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-base truncate">{tailor.name}</h3>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {stats.overdue > 0 && (
                              <Badge variant="destructive" className="text-[10px] gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                {t('tailorWork.overdue')}
                              </Badge>
                            )}
                            <Badge variant="info" className="text-[10px]">{tailor.specialization}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                          {renderStars(tailor.rating)}
                          <span className="text-xs font-medium text-muted-foreground ms-1">{tailor.rating}</span>
                          {isAdmin && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground ms-auto">
                              <Building2 className="h-3 w-3" />
                              {getBranchName(tailor.branchId)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-px bg-border/50 border-t">
                    <div className="bg-background p-3 text-center">
                      <p className="text-xs text-muted-foreground">{t('tailors.dailyProduction', 'Daily')}</p>
                      <p className="text-lg font-bold text-primary mt-0.5">{tailor.dailyProduction}</p>
                      <p className="text-[10px] text-muted-foreground">{t('tailors.pieces', 'pieces')}</p>
                    </div>
                    <div className="bg-background p-3 text-center border-x border-border/50">
                      <p className="text-xs text-muted-foreground">{t('tailors.pieceRate', 'Rate')}</p>
                      <p className="text-lg font-bold text-violet-600 mt-0.5">{tailor.pieceRate}</p>
                      <p className="text-[10px] text-muted-foreground">PKR/pc</p>
                    </div>
                    <div className="bg-background p-3 text-center">
                      <p className="text-xs text-muted-foreground">{t('tailors.dailyWage', 'Daily Wage')}</p>
                      <p className="text-lg font-bold text-emerald-600 mt-0.5">{tailor.dailyWage.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">PKR</p>
                    </div>
                  </div>

                  {/* Bottom Details */}
                  <div className="p-5 pt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t('tailors.monthlyWage', 'Monthly Wage')}</span>
                      <span className="font-semibold">PKR {tailor.monthlyWage.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t('tailors.pendingPayment', 'Pending Payment')}</span>
                      {tailor.pendingPayment > 0 ? (
                        <Badge variant="warning" className="text-xs">PKR {tailor.pendingPayment.toLocaleString()}</Badge>
                      ) : (
                        <Badge variant="success" className="text-xs">{t('tailors.paid', 'Paid')}</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t('tailors.completed', 'Completed')}</span>
                      <span className="font-medium">{stats.delivered} {t('tailors.pieces', 'pieces')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t('tailors.inProgress', 'In Progress')}</span>
                      <Badge variant="secondary" className="text-xs">{stats.active} {t('tailors.pieces', 'pieces')}</Badge>
                    </div>

                    {/* Workload */}
                    <div className="pt-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-muted-foreground">{t('tailors.workload')}</span>
                        <span className="text-xs font-semibold text-primary">
                          {stats.active > 0
                            ? t('tailors.backlog', { count: stats.backlogDays })
                            : t('tailors.noWork')}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${stats.overdue > 0 ? 'bg-gradient-to-r from-red-500 to-amber-500' : 'bg-gradient-to-r from-primary to-violet-500'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${workloadPercent}%` }}
                          transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
      ) : (
        <DataTable columns={listColumns} data={tailors} searchPlaceholder={t('tailors.search')} />
      )}

      <TailorForm open={formOpen} onOpenChange={setFormOpen} onSave={handleSaveTailor} />
    </div>
  )
}
