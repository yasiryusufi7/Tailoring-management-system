import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ShoppingBag, Ruler, Phone, Mail, MapPin, Clock, Calendar, FileText, Pencil, History
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { FormModal } from '@/components/forms/FormComponents'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { EmptyState } from '@/components/common/States'

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

export function CustomerDetailsModal({ open, onOpenChange, customer, orders, measurements, onUpdateMeasurement }) {
  const { t } = useTranslation()

  const customerOrders = useMemo(
    () => (customer ? orders.filter((o) => o.customerId === customer.id) : []),
    [customer, orders]
  )

  const customerMeasurements = useMemo(
    () => (customer ? measurements.filter((m) => m.customerId === customer.id) : []),
    [customer, measurements]
  )

  const timeline = useMemo(() => {
    if (!customer) return []
    const events = [
      ...customerOrders.map((o) => ({
        id: `order-${o.id}`,
        date: o.createdAt,
        type: 'order',
        title: `${t('orders.title')} ${o.id}`,
        description: `${o.type} · PKR ${o.amount.toLocaleString()}`,
      })),
      ...customerMeasurements.map((m) => ({
        id: `measurement-${m.id}`,
        date: m.date,
        type: 'measurement',
        title: t('measurements.title'),
        description: `${t('measurements.measuredBy')}: ${m.measuredBy} · ${m.units}`,
      })),
    ]
    return events.sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [customer, customerOrders, customerMeasurements, t])

  if (!customer) return null

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={t('customers.details')}
      description={customer.name}
      size="max-w-3xl"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.close')}
          </Button>
          <Button onClick={() => onUpdateMeasurement(customer)}>
            <Pencil className="h-4 w-4" />
            {t('customers.updateMeasurement')}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Customer info */}
        <div className="flex items-start gap-4 rounded-xl border bg-muted/30 p-4">
          <Avatar alt={customer.name} size="lg" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg">{customer.name}</h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{customer.phone}</div>
              <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" />{customer.email}</div>
              <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{customer.address}</div>
              <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" />{t('customers.lastVisit')}: {customer.lastVisit}</div>
            </div>
            {customer.notes && (
              <p className="mt-2 text-sm text-muted-foreground">
                <FileText className="h-3.5 w-3.5 inline me-1" />
                {customer.notes}
              </p>
            )}
          </div>
          <div className="text-end shrink-0">
            <p className="text-xs text-muted-foreground">{t('customers.totalOrders')}</p>
            <p className="text-xl font-bold">{customer.totalOrders}</p>
            <Badge variant={customer.balance > 0 ? 'warning' : 'success'} className="mt-1">
              {t('customers.balance')}: PKR {customer.balance.toLocaleString()}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders">{t('customers.history')}</TabsTrigger>
            <TabsTrigger value="measurements">{t('measurements.title')}</TabsTrigger>
            <TabsTrigger value="timeline">{t('customers.timeline')}</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-3">
            {customerOrders.length === 0 ? (
              <EmptyState title={t('customers.noOrders')} description={t('customers.noOrdersDesc')} icon={ShoppingBag} />
            ) : (
              customerOrders.map((o) => (
                <div key={o.id} className="flex items-center gap-3 rounded-xl border p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <ShoppingBag className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{o.id} · {o.type}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />{o.createdAt} · {t('orders.deliveryDate')}: {o.deliveryDate}
                    </p>
                  </div>
                  <div className="text-end shrink-0">
                    <p className="text-sm font-bold">PKR {o.amount.toLocaleString()}</p>
                    <Badge variant={statusVariant[o.status] || 'secondary'} className="mt-0.5">
                      {t(`orders.statuses.${o.status}`)}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="measurements" className="space-y-3">
            {customerMeasurements.length === 0 ? (
              <EmptyState title={t('customers.noMeasurements')} description={t('customers.noMeasurementsDesc')} icon={Ruler} />
            ) : (
              customerMeasurements.map((m) => (
                <div key={m.id} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Ruler className="h-4 w-4 text-primary" />
                      <span>{t('measurements.measuredBy')}: <span className="font-medium text-foreground">{m.measuredBy}</span></span>
                      <span>·</span>
                      <span>{m.date}</span>
                      <Badge variant="secondary">{m.units}</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                    {Object.entries(m.data).map(([key, value]) => (
                      <div key={key} className="text-center rounded-lg bg-muted/50 p-2">
                        <p className="text-[10px] uppercase text-muted-foreground">{key}</p>
                        <p className="text-sm font-bold">{value}</p>
                      </div>
                    ))}
                  </div>
                  {m.notes && <p className="mt-2 text-xs text-muted-foreground">{m.notes}</p>}
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="timeline" className="space-y-0">
            {timeline.length === 0 ? (
              <EmptyState title={t('customers.noOrders')} description={t('customers.noOrdersDesc')} icon={History} />
            ) : (
              <div className="relative ps-6">
                <div className="absolute start-2 top-1 bottom-1 w-px bg-border" />
                {timeline.map((event) => (
                  <div key={event.id} className="relative pb-5 last:pb-0">
                    <div className={`absolute -start-6 top-1 h-4 w-4 rounded-full border-2 border-background ${event.type === 'order' ? 'bg-primary' : 'bg-violet-500'}`} />
                    <p className="text-xs text-muted-foreground">{event.date}</p>
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </FormModal>
  )
}
