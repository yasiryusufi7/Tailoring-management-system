import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Scissors, Shirt, Sparkles, CheckCircle2, Phone, Calendar,
  ChevronDown, ChevronUp, AlertTriangle, ClipboardList, PackageCheck
} from 'lucide-react'
import toast from 'react-hot-toast'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/context/AuthContext'
import { useBranchScope } from '@/hooks/useBranchScope'
import { useOrders, updateOrderStatus } from '@/data/orderStore'
import { customers as seedCustomers, measurements as seedMeasurements } from '@/data/mockData'

const MEASUREMENT_KEYS = [
  'neck', 'chest', 'waist', 'hip', 'shoulder', 'sleeve',
  'arm', 'shirtLength', 'trouserLength', 'bottom', 'collar', 'cuff',
]

const STAGES = ['cutting', 'stitching', 'ironing', 'ready']
const STAGE_ICONS = { cutting: Scissors, stitching: Shirt, ironing: Sparkles, ready: CheckCircle2 }

const NEXT_STEP = {
  received: { next: 'cutting', key: 'startCutting' },
  assigned: { next: 'cutting', key: 'startCutting' },
  cutting: { next: 'stitching', key: 'startStitching' },
  stitching: { next: 'ironing', key: 'sendToIroning' },
  ironing: { next: 'ready', key: 'markReady' },
}

const TAILOR_STATUSES = ['received', 'assigned', 'cutting', 'stitching', 'ironing']
const DONE_STATUSES = ['delivered', 'cancelled']

const priorityVariant = { high: 'destructive', medium: 'warning', low: 'secondary' }

const dayDiff = (date, today) =>
  Math.round((new Date(date).setHours(0, 0, 0, 0) - new Date(today).setHours(0, 0, 0, 0)) / 86400000)

function StatCard({ icon: Icon, label, value, tone }) {
  const tones = {
    primary: 'bg-primary/10 text-primary',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    danger: 'bg-red-500/10 text-red-600 dark:text-red-400',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  }
  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  )
}

function StageStepper({ status }) {
  const { t } = useTranslation()
  const currentIdx = STAGES.indexOf(status)

  return (
    <div className="grid grid-cols-4 select-none">
      {STAGES.map((stage, i) => {
        const Icon = STAGE_ICONS[stage]
        const done = currentIdx > -1 && i < currentIdx
        const current = i === currentIdx
        return (
          <div key={stage} className="relative flex flex-col items-center gap-1">
            {i < STAGES.length - 1 && (
              <div
                className={`absolute top-4 start-1/2 w-full h-0.5 rounded ${
                  done ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}
            <div
              className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background transition-colors ${
                done
                  ? 'border-primary bg-primary text-primary-foreground'
                  : current
                  ? 'border-primary text-primary bg-primary/10 shadow-[0_0_0_3px] shadow-primary/15'
                  : 'border-border text-muted-foreground/50'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
            </div>
            <span className={`text-[10px] leading-tight text-center ${current ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
              {t(`orders.statuses.${stage}`)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function QueueSection({ title, tone, count, children }) {
  if (!count) return null
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold">{title}</h2>
        <Badge variant={tone}>{count}</Badge>
      </div>
      {children}
    </div>
  )
}

function OrderWorkCard({ order, customer, measurement }) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  const today = new Date().toISOString().slice(0, 10)
  const step = NEXT_STEP[order.status]
  const isReady = order.status === 'ready'
  const daysLeft = dayDiff(order.deliveryDate, today)
  const isOverdue = daysLeft < 0 && !isReady
  const isDueToday = daysLeft === 0 && !DONE_STATUSES.includes(order.status)

  const advance = () => {
    if (!step) return
    updateOrderStatus(order.id, step.next)
    toast.success(t('tailorWork.statusUpdated', { status: t(`orders.statuses.${step.next}`) }))
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Card className={`overflow-hidden ${isOverdue ? 'border-red-300 dark:border-red-900' : ''}`}>
        {/* Priority strip */}
        <div className={`h-1 w-full ${
          order.priority === 'high' ? 'bg-red-500' : order.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
        }`} />
        <CardContent className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar alt={customer?.name || '?'} />
              <div className="min-w-0">
                <p className="font-semibold truncate">{customer?.name || '—'}</p>
                <p className="text-sm text-muted-foreground truncate">{order.type}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <Badge variant={priorityVariant[order.priority] || 'secondary'}>
                {t(`orders.${order.priority}`)}
              </Badge>
              <span className="text-xs text-muted-foreground">{order.id}</span>
            </div>
          </div>

          {/* Production pipeline */}
          <StageStepper status={order.status} />

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <Badge variant={isReady ? 'success' : isOverdue ? 'destructive' : isDueToday ? 'warning' : 'info'}>
              <Calendar className="h-3 w-3 me-1" />
              {order.deliveryDate}
            </Badge>
            {!DONE_STATUSES.includes(order.status) && !isOverdue && daysLeft > 0 && (
              <span className="text-xs text-muted-foreground">{t('tailorWork.daysLeft', { count: daysLeft })}</span>
            )}
            {isOverdue && (
              <span className="flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                <AlertTriangle className="h-3.5 w-3.5" />
                {t('tailorWork.overdue')}
              </span>
            )}
            {customer?.phone && (
              <a href={`tel:${customer.phone}`} className="flex items-center gap-1.5 text-primary hover:underline ms-auto">
                <Phone className="h-3.5 w-3.5" />
                {customer.phone}
              </a>
            )}
          </div>

          {order.notes && (
            <p className="text-sm text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">{order.notes}</p>
          )}

          {/* Measurements */}
          {measurement && (
            <>
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted/50 transition-colors"
              >
                <ClipboardList className="h-4 w-4 text-primary" />
                {t('tailorWork.customerMeasurements')}
                <span className="ms-auto text-muted-foreground">{measurement.units}</span>
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {expanded && (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                  {MEASUREMENT_KEYS.map((key) => (
                    <div key={key} className="text-center p-2 rounded-lg bg-muted/50">
                      <p className="text-[10px] uppercase text-muted-foreground">{t(`measurements.body.${key}`)}</p>
                      <p className="text-sm font-bold">{measurement.data[key]}</p>
                    </div>
                  ))}
                  {measurement.notes && (
                    <p className="col-span-full text-xs text-muted-foreground px-1">{measurement.notes}</p>
                  )}
                </div>
              )}
            </>
          )}

          {/* Action */}
          <div className="pt-1 flex items-center justify-between gap-2">
            <Badge variant={isReady ? 'success' : 'default'}>
              {t(`orders.statuses.${order.status}`)}
            </Badge>
            {step ? (
              <Button size="sm" onClick={advance}>
                {order.status === 'ironing'
                  ? <Sparkles className="h-4 w-4 me-1" />
                  : ['cutting', 'received', 'assigned'].includes(order.status)
                  ? <Scissors className="h-4 w-4 me-1" />
                  : <Shirt className="h-4 w-4 me-1" />}
                {t(`tailorWork.${step.key}`)}
              </Button>
            ) : isReady ? (
              <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <PackageCheck className="h-4 w-4" />
                {t('tailorWork.awaitingPickup')}
              </span>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function TailorWorkPage() {
  const { t } = useTranslation()
  const { currentUser } = useAuth()
  const { scoped } = useBranchScope()
  const allOrders = useOrders()

  const customers = scoped(seedCustomers)
  const measurements = scoped(seedMeasurements)

  const tailorId = currentUser.tailorId
  const myOrders = tailorId != null
    ? allOrders.filter((o) => o.tailorId === tailorId && !DONE_STATUSES.includes(o.status))
    : []

  const today = new Date().toISOString().slice(0, 10)

  const activeOrders = myOrders.filter((o) => TAILOR_STATUSES.includes(o.status))
  const readyOrders = myOrders.filter((o) => o.status === 'ready')
  const overdueOrders = activeOrders.filter((o) => o.deliveryDate < today)
  const dueTodayOrders = activeOrders.filter((o) => o.deliveryDate === today)
  const upcomingOrders = activeOrders.filter((o) => o.deliveryDate > today)

  const getCustomer = (id) => customers.find((c) => c.id === id)
  const getMeasurement = (customerId) =>
    [...measurements]
      .filter((m) => m.customerId === customerId)
      .sort((a, b) => b.date.localeCompare(a.date))[0]

  const renderCards = (list) => (
    <div className="space-y-4">
      {list.map((order) => (
        <OrderWorkCard
          key={order.id}
          order={order}
          customer={getCustomer(order.customerId)}
          measurement={getMeasurement(order.customerId)}
        />
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('tailorWork.title')}
        subtitle={`${currentUser.name} · ${t('tailorWork.subtitle')}`}
        icon={Scissors}
        breadcrumbs={[t('nav.dashboard'), t('nav.myWork')]}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Scissors} label={t('tailorWork.activeOrders')} value={activeOrders.length} tone="primary" />
        <StatCard icon={Calendar} label={t('tailorWork.dueToday')} value={dueTodayOrders.length} tone="warning" />
        <StatCard icon={AlertTriangle} label={t('tailorWork.overdue')} value={overdueOrders.length} tone="danger" />
        <StatCard icon={CheckCircle2} label={t('tailorWork.readyPickup')} value={readyOrders.length} tone="success" />
      </div>

      {/* Work queue grouped by urgency */}
      {myOrders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Scissors className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="font-medium">{t('tailorWork.noOrders')}</p>
            <p className="text-sm text-muted-foreground mt-1">{t('tailorWork.noOrdersHint')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <QueueSection title={t('tailorWork.overdue')} tone="destructive" count={overdueOrders.length}>
            {renderCards(overdueOrders)}
          </QueueSection>
          <QueueSection title={t('tailorWork.dueToday')} tone="warning" count={dueTodayOrders.length}>
            {renderCards(dueTodayOrders)}
          </QueueSection>
          <QueueSection title={t('tailorWork.activeOrders')} tone="info" count={upcomingOrders.length}>
            {renderCards(upcomingOrders)}
          </QueueSection>
          <QueueSection title={t('tailorWork.readyPickup')} tone="success" count={readyOrders.length}>
            {renderCards(readyOrders)}
          </QueueSection>
        </div>
      )}
    </div>
  )
}
