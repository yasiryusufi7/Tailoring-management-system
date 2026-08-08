import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ShoppingBag, Plus, GripVertical, Clock, User, Calendar, DollarSign, AlertTriangle, LayoutGrid, List } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { DataTable } from '@/components/common/DataTable'
import { OrderForm } from '@/components/forms/OrderForm'
import { OrderBillModal } from '@/components/common/OrderBillModal'
import { useBranchScope } from '@/hooks/useBranchScope'
import { customers as seedCustomers, tailors as seedTailors } from '@/data/mockData'
import { useOrders, addOrder } from '@/data/orderStore'

const statusConfig = {
  received: { color: 'bg-blue-500', badge: 'info', icon: '📥' },
  cutting: { color: 'bg-amber-500', badge: 'warning', icon: '✂️' },
  assigned: { color: 'bg-purple-500', badge: 'purple', icon: '👤' },
  stitching: { color: 'bg-indigo-500', badge: 'default', icon: '🧵' },
  ironing: { color: 'bg-orange-500', badge: 'warning', icon: '🔥' },
  ready: { color: 'bg-emerald-500', badge: 'success', icon: '✅' },
  delivered: { color: 'bg-green-500', badge: 'success', icon: '📦' },
  cancelled: { color: 'bg-red-500', badge: 'destructive', icon: '❌' },
}

const priorityConfig = {
  high: { variant: 'destructive', label: 'High' },
  medium: { variant: 'warning', label: 'Medium' },
  low: { variant: 'info', label: 'Low' },
}

const kanbanStatuses = ['received', 'cutting', 'assigned', 'stitching', 'ironing', 'ready']

function KanbanCard({ order, index, customers, tailors }) {
  const { t } = useTranslation()
  const customer = customers.find((c) => c.id === order.customerId)
  const tailor = tailors.find((t) => t.id === order.tailorId)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="rounded-xl border bg-card p-4 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">{order.id}</span>
          <Badge variant={priorityConfig[order.priority].variant} className="text-[10px]">
            {t(`orders.${order.priority}`)}
          </Badge>
        </div>
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <h4 className="font-semibold text-sm mb-2">{order.type}</h4>

      <div className="space-y-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <User className="h-3 w-3" />
          {customer?.name || 'Unknown'}
        </div>
        {tailor && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs">🧵</span>
            {tailor.name}
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3 w-3" />
          {order.deliveryDate}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t flex items-center justify-between">
        <span className="text-sm font-bold">PKR {order.amount.toLocaleString()}</span>
        <Avatar alt={customer?.name || '?'} size="xs" />
      </div>
    </motion.div>
  )
}

function KanbanColumn({ status, orders: columnOrders, index, customers, tailors }) {
  const { t } = useTranslation()
  const config = statusConfig[status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col min-w-[280px] max-w-[320px]"
    >
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className={`h-2.5 w-2.5 rounded-full ${config.color}`} />
        <h3 className="text-sm font-semibold">{t(`orders.statuses.${status}`)}</h3>
        <Badge variant="secondary" className="ms-auto text-xs">{columnOrders.length}</Badge>
      </div>

      <div className="flex-1 space-y-3 p-2 rounded-xl bg-muted/30 min-h-[400px]">
        {columnOrders.map((order, i) => (
          <KanbanCard key={order.id} order={order} index={i} customers={customers} tailors={tailors} />
        ))}
        {columnOrders.length === 0 && (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
            No orders
          </div>
        )}
      </div>
    </motion.div>
  )
}

export function OrdersPage() {
  const { t } = useTranslation()
  const { scoped, branchId } = useBranchScope()
  const allOrders = useOrders()
  const orders = scoped(allOrders)
  const customers = scoped(seedCustomers)
  const tailors = scoped(seedTailors)
  const [viewType, setViewType] = useState('kanban')
  const [formOpen, setFormOpen] = useState(false)
  const [billOrder, setBillOrder] = useState(null)

  const handleOrderCreated = (order) => {
    const fullOrder = { ...order, branchId: branchId || null }
    addOrder(fullOrder)
    setBillOrder(fullOrder)
  }

  const columns = [
    { key: 'id', label: 'Order', render: (val) => <span className="font-mono font-medium">{val}</span> },
    { key: 'type', label: t('orders.type') },
    { key: 'customerId', label: t('orders.customer'), render: (val) => customers.find(c => c.id === val)?.name || '—' },
    { key: 'tailorId', label: t('orders.tailor'), render: (val) => tailors.find(t => t.id === val)?.name || '—' },
    { key: 'status', label: t('orders.statuses.received'), render: (val) => (
      <Badge variant={statusConfig[val]?.badge || 'default'}>
        {t(`orders.statuses.${val}`)}
      </Badge>
    )},
    { key: 'amount', label: t('orders.amount'), render: (val) => <span className="font-medium">PKR {val.toLocaleString()}</span> },
    { key: 'priority', label: t('orders.priority'), render: (val) => (
      <Badge variant={priorityConfig[val]?.variant}>{t(`orders.${val}`)}</Badge>
    )},
    { key: 'deliveryDate', label: t('orders.deliveryDate') },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('orders.title')}
        subtitle={t('orders.subtitle')}
        icon={ShoppingBag}
        breadcrumbs={[t('nav.dashboard'), t('nav.orders')]}
        actions={
          <div className="flex items-center gap-2">
            <Tabs value={viewType} onValueChange={setViewType}>
              <TabsList>
                <TabsTrigger value="kanban"><LayoutGrid className="h-4 w-4 me-1" />{t('orders.kanban')}</TabsTrigger>
                <TabsTrigger value="list"><List className="h-4 w-4 me-1" />{t('orders.list')}</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button onClick={() => setFormOpen(true)}><Plus className="h-4 w-4" />{t('orders.newOrder')}</Button>
          </div>
        }
      />

      {/* Progress Stats */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {kanbanStatuses.map((status) => {
          const count = orders.filter((o) => o.status === status).length
          return (
            <motion.div
              key={status}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 rounded-xl border px-3 py-2 bg-card shrink-0"
            >
              <div className={`h-2 w-2 rounded-full ${statusConfig[status].color}`} />
              <span className="text-xs font-medium whitespace-nowrap">{t(`orders.statuses.${status}`)}</span>
              <span className="text-xs font-bold">{count}</span>
            </motion.div>
          )
        })}
      </div>

      {viewType === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {kanbanStatuses.map((status, i) => (
            <KanbanColumn
              key={status}
              status={status}
              orders={orders.filter((o) => o.status === status)}
              index={i}
              customers={customers}
              tailors={tailors}
            />
          ))}
        </div>
      ) : (
        <DataTable columns={columns} data={orders} />
      )}

      <OrderForm open={formOpen} onOpenChange={setFormOpen} onSave={handleOrderCreated} />

      <OrderBillModal
        open={Boolean(billOrder)}
        onOpenChange={(open) => { if (!open) setBillOrder(null) }}
        order={billOrder}
        customer={billOrder ? customers.find((c) => c.id === billOrder.customerId) : null}
      />
    </div>
  )
}
