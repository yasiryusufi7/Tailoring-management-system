import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShoppingBag, Clock, CheckCircle, Truck, DollarSign, TrendingUp,
  TrendingDown, AlertTriangle, Scissors, ArrowRight, Plus, UserPlus,
  Ruler, FileText, Bell
} from 'lucide-react'
import { StatCard } from '@/components/common/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/common/PageHeader'
import { OrderForm } from '@/components/forms/OrderForm'
import { useAuth } from '@/context/AuthContext'
import { useBranchScope } from '@/hooks/useBranchScope'
import { orders as seedOrders, recentOrders, notifications, accountingData, tailors as seedTailors, customers as seedCustomers, fabricInventory as seedFabricInventory } from '@/data/mockData'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts'

const statusColors = {
  received: 'info',
  cutting: 'warning',
  assigned: 'purple',
  stitching: 'default',
  ironing: 'warning',
  ready: 'success',
  delivered: 'success',
  cancelled: 'destructive',
}

export function DashboardPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { currentUser, isManager } = useAuth()
  const { scoped } = useBranchScope()
  const [formOpen, setFormOpen] = useState(false)

  const orders = scoped(seedOrders)
  const tailors = scoped(seedTailors)
  const customers = scoped(seedCustomers)
  const branchFabrics = scoped(seedFabricInventory)

  const chartColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4']

  const getCustomerName = (id) => customers.find((c) => c.id === id)?.name || '—'

  const today = new Date().toISOString().slice(0, 10)
  const pendingStatuses = ['received', 'cutting', 'assigned', 'stitching', 'ironing']
  const branchRevenue = orders.reduce((sum, o) => sum + o.amount, 0)
  const computed = {
    todaysOrders: orders.filter((o) => o.createdAt === today).length,
    pendingOrders: orders.filter((o) => pendingStatuses.includes(o.status)).length,
    readyOrders: orders.filter((o) => o.status === 'ready').length,
    deliveredOrders: orders.filter((o) => o.status === 'delivered').length,
    monthlyRevenue: branchRevenue,
    profit: Math.round(branchRevenue * 0.4),
    expenses: Math.round(branchRevenue * 0.6),
    lowStock: branchFabrics.filter((f) => f.status === 'lowStock' || f.status === 'outOfStock').length,
  }

  const buildMonthly = (list) => {
    const monthKey = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' }
    return accountingData.monthlyRevenue.map((m) => {
      const revenue = list.filter((o) => o.createdAt.slice(5, 7) === monthKey[m.month]).reduce((s, o) => s + o.amount, 0)
      return { month: m.month, revenue, expenses: Math.round(revenue * 0.6) }
    })
  }

  const buildStatus = (list) => {
    const map = { received: 'Received', cutting: 'Cutting', assigned: 'Assigned', stitching: 'Stitching', ironing: 'Ironing', ready: 'Ready', delivered: 'Delivered', cancelled: 'Cancelled' }
    return Object.entries(map).map(([key, label]) => ({ status: label, count: list.filter((o) => o.status === key).length }))
  }

  const revenueData = isManager ? buildMonthly(orders) : accountingData.monthlyRevenue
  const pieData = isManager ? buildStatus(orders) : accountingData.ordersByStatus

  const recentOrdersList = isManager
    ? [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5).map((o) => ({
        id: o.id,
        customer: getCustomerName(o.customerId),
        type: o.type,
        status: o.status,
        amount: o.amount,
      }))
    : recentOrders

  const quickActions = [
    { icon: ShoppingBag, label: t('dashboard.newOrder'), color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', path: '/orders' },
    { icon: UserPlus, label: t('dashboard.addCustomer'), color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', path: '/customers' },
    { icon: Ruler, label: t('dashboard.newMeasurement'), color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400', path: '/measurements' },
    ...(isManager ? [] : [{ icon: FileText, label: t('dashboard.generateInvoice'), color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', path: '/invoices' }]),
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('dashboard.title')}
        subtitle={`${t('dashboard.welcome')}, ${currentUser.name}`}
        icon={null}
        breadcrumbs={[t('nav.dashboard')]}
        actions={
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" />
            {t('dashboard.newOrder')}
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('dashboard.todaysOrders')} value={isManager ? computed.todaysOrders : '24'} change={t('dashboard.vsLastMonth') + ': +12%'} changeType="positive" icon={ShoppingBag} color="primary" index={0} />
        <StatCard title={t('dashboard.pendingOrders')} value={isManager ? computed.pendingOrders : '18'} change="-3 from yesterday" changeType="negative" icon={Clock} color="warning" index={1} />
        <StatCard title={t('dashboard.readyOrders')} value={isManager ? computed.readyOrders : '7'} change="+2 ready today" changeType="positive" icon={CheckCircle} color="success" index={2} />
        <StatCard title={t('dashboard.deliveredOrders')} value={isManager ? computed.deliveredOrders : '156'} change={t('dashboard.vsLastMonth') + ': +8%'} changeType="positive" icon={Truck} color="purple" index={3} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('dashboard.monthlyRevenue')} value={isManager ? `PKR ${(computed.monthlyRevenue / 1000).toFixed(1)}K` : 'PKR 485K'} change={t('dashboard.vsLastMonth') + ': +5.2%'} changeType="positive" icon={DollarSign} color="primary" index={4} />
        <StatCard title={t('dashboard.profit')} value={isManager ? `PKR ${(computed.profit / 1000).toFixed(1)}K` : 'PKR 173K'} change="+3.8% growth" changeType="positive" icon={TrendingUp} color="success" index={5} />
        <StatCard title={t('dashboard.expenses')} value={isManager ? `PKR ${(computed.expenses / 1000).toFixed(1)}K` : 'PKR 312K'} change="+2.1% from last" changeType="negative" icon={TrendingDown} color="warning" index={6} />
        <StatCard title={t('dashboard.lowStock')} value={isManager ? `${computed.lowStock} items` : '3 items'} change="Need reorder" changeType="negative" icon={AlertTriangle} color="danger" index={7} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('dashboard.revenueChart')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                      formatter={(value) => [`PKR ${value.toLocaleString()}`, '']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#revenueGrad)" />
                    <Area type="monotone" dataKey="expenses" stroke="#f59e0b" strokeWidth={2.5} fill="url(#expenseGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders by Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">{t('dashboard.ordersChart')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="count"
                      paddingAngle={3}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={index} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {pieData.map((item, i) => (
                  <div key={item.status} className="flex items-center gap-2 text-xs">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: chartColors[i] }} />
                    <span className="text-muted-foreground">{item.status}</span>
                    <span className="ms-auto font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Profit */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('dashboard.monthlyProfit')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }}
                      formatter={(value, name) => [`PKR ${value.toLocaleString()}`, name === 'revenue' ? 'Revenue' : 'Expenses']}
                    />
                    <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} opacity={0.7} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tailor Productivity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">{t('dashboard.tailorProductivity')}</CardTitle>
              <Badge variant="info">{t('dashboard.tailorPerformance')}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tailors.map((tailor, i) => (
                  <div key={tailor.id} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold shrink-0">
                      {tailor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium truncate">{tailor.name}</p>
                        <span className="text-xs text-muted-foreground">{tailor.completed} pcs</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (tailor.completed / 70) * 100)}%` }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${chartColors[i]}, ${chartColors[(i + 1) % chartColors.length]})` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">{t('dashboard.recentOrders')}</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary">
                {t('common.view')} all <ArrowRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="h-10 text-start text-xs font-semibold uppercase text-muted-foreground">{t('dashboard.order')}</th>
                      <th className="h-10 text-start text-xs font-semibold uppercase text-muted-foreground">{t('dashboard.customer')}</th>
                      <th className="h-10 text-start text-xs font-semibold uppercase text-muted-foreground">{t('dashboard.type')}</th>
                      <th className="h-10 text-start text-xs font-semibold uppercase text-muted-foreground">{t('dashboard.status')}</th>
                      <th className="h-10 text-end text-xs font-semibold uppercase text-muted-foreground">{t('dashboard.amount')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrdersList.map((order) => (
                      <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="h-12 text-sm font-medium">{order.id}</td>
                        <td className="h-12 text-sm">{order.customer}</td>
                        <td className="h-12 text-sm text-muted-foreground">{order.type}</td>
                        <td className="h-12">
                          <Badge variant={statusColors[order.status]}>
                            {t(`orders.statuses.${order.status}`)}
                          </Badge>
                        </td>
                        <td className="h-12 text-sm text-end font-medium">PKR {order.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">{t('dashboard.quickActions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(action.path)}
                  className="flex w-full items-center gap-3 rounded-xl p-3 hover:bg-muted/50 transition-all duration-200 text-start"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.color}`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                  <ArrowRight className="h-4 w-4 ms-auto text-muted-foreground" />
                </motion.button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Upcoming Deliveries & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming Deliveries */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('dashboard.upcomingDeliveries')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{order.id} - {order.type}</p>
                      <p className="text-xs text-muted-foreground">Delivery: {order.deliveryDate}</p>
                    </div>
                  </div>
                  <Badge variant={statusColors[order.status]}>{t(`orders.statuses.${order.status}`)}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('dashboard.recentNotifications')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.slice(0, 5).map((notif) => {
                const typeStyles = {
                  info: 'bg-blue-500/10 text-blue-600',
                  success: 'bg-emerald-500/10 text-emerald-600',
                  warning: 'bg-amber-500/10 text-amber-600',
                  error: 'bg-red-500/10 text-red-600',
                }
                return (
                  <div key={notif.id} className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${!notif.read ? 'bg-primary/5' : 'bg-muted/30'} hover:bg-muted/50`}>
                    <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${typeStyles[notif.type]}`}>
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{notif.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{notif.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                    </div>
                    {!notif.read && <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <OrderForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  )
}
