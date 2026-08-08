import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { QrCode, Printer } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FormModal } from '@/components/forms/FormComponents'
import { customerQrUrl, qrDataUrl, printHtml } from '@/lib/qr'

export function CustomerQrModal({ customer, open, onOpenChange }) {
  const { t } = useTranslation()
  const [qrSrc, setQrSrc] = useState(null)

  useEffect(() => {
    if (open && customer) {
      setQrSrc(null)
      qrDataUrl(customerQrUrl(customer)).then(setQrSrc)
    }
  }, [open, customer])

  if (!customer) return null

  const handlePrint = async () => {
    const src = qrSrc || (await qrDataUrl(customerQrUrl(customer)))
    const body = `
      <div class="bill-header">
        <h1>TailorPro</h1>
        <p>${t('customers.qrTitle')}</p>
      </div>
      <table>
        <tr><td class="l">${t('customers.name')}</td><td style="text-align:right">${customer.name}</td></tr>
        <tr><td class="l">${t('customers.phone')}</td><td style="text-align:right">${customer.phone}</td></tr>
        <tr><td class="l">${t('customers.email')}</td><td class="muted" style="text-align:right">${customer.email}</td></tr>
      </table>
      <div class="qr-wrap"><img src="${src}" /></div>
      <p class="qr-hint">${t('customers.scanToTrack')}</p>
    `
    printHtml(t('customers.qrTitle'), body)
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={t('customers.qrTitle')}
      description={customer.name}
      size="max-w-sm"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.close')}
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            {t('customers.printQr')}
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center gap-4 py-2">
        <div className="rounded-xl border bg-white p-4">
          {qrSrc ? (
            <img src={qrSrc} alt={customer.name} className="h-52 w-52" />
          ) : (
            <div className="flex h-52 w-52 items-center justify-center">
              <QrCode className="h-8 w-8 animate-pulse text-muted-foreground" />
            </div>
          )}
        </div>
        <p className="text-center text-sm text-muted-foreground">{t('customers.scanToTrack')}</p>
      </div>
    </FormModal>
  )
}
