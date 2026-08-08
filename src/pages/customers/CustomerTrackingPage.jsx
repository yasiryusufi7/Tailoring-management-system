import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Scissors, Phone, ShoppingBag, Calendar, MapPin } from 'lucide-react'
import { useOrders } from '@/data/orderStore'
import { customers as seedCustomers } from '@/data/mockData'
import { Badge } from '@/components/ui/Badge'

const statusVariant = {
  received: 'info',
  cutting: 'warning',
  assigned: 'purple',
  stitching: 'info',
  ironing: 'warning',
  ready: 'success',
  delivered: 'success',
  cancelled: 'destructive',
}

const statusFlow = ['received', 'cutting', 'assigned', 'stitching', 'ironing', 'ready', 'delivered']

function StatusProgress({ status }) {
  const { t } = useTranslation()
  if (status === 'cancelled') {
    return (
      <div className="mt-3">
        <p className="text-xs font-medium text-muted-foreground mb-1.5">{t('tracking.progress')}</p>
        <Badge variant="destructive">{t('orders.statuses.cancelled')}</Badge>
      </div>
    )
  }
  const currentIndex = statusFlow.indexOf(status)
  return (
    <div className="mt-3">
      <p className="text-xs font-medium text-muted-foreground mb-2">{t('tracking.progress')}</p>
      <div className="flex items-center">
        {statusFlow.map((step, i) => {
          const done = i <= currentIndex
          const isLast = i === statusFlow.length - 1
          return (
            <div key={step} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-bold ${
                    done ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-muted-foreground'
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`text-[9px] leading-tight text-center ${done ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                  {t(`orders.statuses.${step}`)}
                </span>
              </div>
              {!isLast && (
                <div className={`h-0.5 flex-1 mx-1 mt-[-10px] ${i < currentIndex ? 'bg-primary' : 'bg-border'}`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function CustomerTrackingPage() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const allOrders = useOrders()
  const isRTL = i18n.dir() === 'rtl'

  const customer = useMemo(
    () => seedCustomers.find((c) => c.id === Number(id)),
    [id]
  )

  const customerOrders = useMemo(
    () => (customer ? allOrders.filter((o) => o.customerId === customer.id) : []),
    [customer, allOrders]
  )

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-background">
      <div className="mx-auto max-w-xl px-4 py-6">
        {/* Brand header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Scissors className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">TailorPro</h1>
            <p className="text-xs text-muted-foreground">{t('tracking.subtitle')}</p>
          </div>
        </div>

        {!customer ? (
          <div className="rounded-2xl border bg-card p-8 text-center">
            <p className="font-medium">{t('tracking.notFound')}</p>
            <Link to="/" className="mt-3 inline-block text-sm text-primary">
              {t('tracking.backHome')}
            </Link>
          </div>
        ) : (
          <>
            {/* Customer info */}
            <div className="rounded-2xl border bg-card p-5 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  {customer.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold truncate">{customer.name}</h2>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    {customer.phone}
                  </div>
                </div>
                <div className="text-end shrink-0">
                  <p className="text-xs text-muted-foreground">{t('tracking.orderStatus')}</p>
                  <p className="text-xl font-bold text-primary">{customerOrders.length}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {customer.address}
              </div>
            </div>

            {/* Orders */}
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              {t('tracking.title')}
            </h3>

            {customerOrders.length === 0 ? (
              <div className="rounded-2xl border bg-card p-8 text-center">
                <ShoppingBag className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="font-medium">{t('tracking.noOrders')}</p>
                <p className="text-sm text-muted-foreground mt-1">{t('tracking.noOrdersDesc')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {customerOrders.map((o) => (
                  <div key={o.id} className="rounded-2xl border bg-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-sm font-medium">{o.id}</p>
                        <p className="text-sm font-semibold mt-0.5">{o.type}</p>
                      </div>
                      <Badge variant={statusVariant[o.status] || 'secondary'} className="shrink-0">
                        {t(`orders.statuses.${o.status}`)}
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {t('orders.deliveryDate')}: {o.deliveryDate}
                      </span>
                      <span className="font-bold">PKR {o.amount.toLocaleString()}</span>
                    </div>
                    <StatusProgress status={o.status} />
                  </div>
                ))}
              </div>
            )}

            <p className="mt-6 text-center text-xs text-muted-foreground">
              {t('tracking.footer')}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
