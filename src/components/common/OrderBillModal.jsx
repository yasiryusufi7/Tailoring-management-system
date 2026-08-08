import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Printer, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { FormModal } from '@/components/forms/FormComponents'
import { customerQrUrl, qrDataUrl, printHtml } from '@/lib/qr'

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

export function OrderBillModal({ order, customer, open, onOpenChange }) {
  const { t } = useTranslation()
  const [qrSrc, setQrSrc] = useState(null)

  useEffect(() => {
    if (open && customer) {
      setQrSrc(null)
      qrDataUrl(customerQrUrl(customer)).then(setQrSrc)
    }
  }, [open, customer])

  if (!order || !customer) return null

  const currency = (n) => `PKR ${n.toLocaleString()}`

  const buildPrintBody = (src) => `
    <div class="bill-header">
      <h1>TailorPro</h1>
      <p>${t('invoices.tagline')}</p>
      <p class="muted">${t('invoices.companyAddress')}</p>
    </div>
    <div class="section">
      <h3>${t('bill.customer')}</h3>
      <table>
        <tr><td class="l">${t('customers.name')}</td><td style="text-align:right">${customer.name}</td></tr>
        <tr><td class="l">${t('customers.phone')}</td><td style="text-align:right">${customer.phone}</td></tr>
        <tr><td class="l">${t('customers.address')}</td><td class="muted" style="text-align:right">${customer.address}</td></tr>
      </table>
    </div>
    <div class="section">
      <h3>${t('bill.order')}</h3>
      <table>
        <tr><td class="l">${t('bill.billNo')}</td><td style="text-align:right">${order.id}</td></tr>
        <tr><td class="l">${t('bill.item')}</td><td style="text-align:right">${order.type}</td></tr>
        <tr><td class="l">${t('bill.deliveryDate')}</td><td style="text-align:right">${order.deliveryDate}</td></tr>
        <tr><td class="l">${t('bill.status')}</td><td style="text-align:right">${t(`orders.statuses.${order.status}`)}</td></tr>
      </table>
    </div>
    <table class="total">
      <tr><td>${t('bill.total')}</td><td style="text-align:right">${currency(order.amount)}</td></tr>
    </table>
    ${order.notes ? `<p class="muted" style="margin-top:8px"><b>${t('bill.notes')}:</b> ${order.notes}</p>` : ''}
    <div class="qr-wrap"><img src="${src}" /></div>
    <p class="qr-hint">${t('bill.scanToTrack')}</p>
    <p class="thanks">${t('bill.thanks')}</p>
  `

  const handlePrint = async () => {
    const src = qrSrc || (await qrDataUrl(customerQrUrl(customer)))
    printHtml(t('bill.title'), buildPrintBody(src))
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={t('bill.title')}
      description={`${t('bill.billNo')}: ${order.id}`}
      size="max-w-md"
      bodyClassName="overflow-y-visible"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.close')}
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            {t('bill.print')}
          </Button>
        </>
      }
    >
      <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
        <div className="text-center border-b border-border pb-2">
          <h3 className="text-lg font-bold text-primary">TailorPro</h3>
          <p className="text-xs text-muted-foreground">{t('invoices.tagline')}</p>
        </div>

        <div>
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{t('bill.customer')}</h4>
          <div className="text-sm space-y-0.5">
            <p className="font-semibold">{customer.name}</p>
            <p className="text-muted-foreground">{customer.phone}</p>
            <p className="text-muted-foreground">{customer.address}</p>
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{t('bill.order')}</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between"><span className="text-muted-foreground">{t('bill.billNo')}</span><span className="font-mono font-medium">{order.id}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t('bill.item')}</span><span className="font-medium">{order.type}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t('bill.deliveryDate')}</span><span>{order.deliveryDate}</span></div>
            <div className="flex justify-between items-center"><span className="text-muted-foreground">{t('bill.status')}</span><Badge variant={statusVariant[order.status] || 'secondary'}>{t(`orders.statuses.${order.status}`)}</Badge></div>
            {order.notes && (
              <div className="flex justify-between gap-4"><span className="text-muted-foreground shrink-0">{t('bill.notes')}</span><span className="text-end">{order.notes}</span></div>
            )}
          </div>
        </div>

        <div className="flex justify-between border-t-2 border-border pt-2 text-sm font-bold">
          <span>{t('bill.total')}</span>
          <span>{currency(order.amount)}</span>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <div className="rounded-lg bg-white p-2">
            {qrSrc ? (
              <img src={qrSrc} alt={customer.name} className="h-24 w-24" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center">
                <QrCode className="h-6 w-6 animate-pulse text-muted-foreground" />
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-center">{t('bill.scanToTrack')}</p>
        </div>
      </div>
    </FormModal>
  )
}
