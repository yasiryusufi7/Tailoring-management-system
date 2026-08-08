import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormModal, FormField, SelectField, FormGrid } from '@/components/forms/FormComponents'
import { customers, orders } from '@/data/mockData'

const invoiceStatuses = ['unpaid', 'paid', 'overdue']

export function InvoiceForm({ open, onOpenChange }) {
  const { t } = useTranslation()

  const schema = z.object({
    customerId: z.string().min(1, t('forms.errors.required')),
    orderId: z.string().min(1, t('forms.errors.required')),
    amount: z.coerce.number().min(1, t('forms.errors.number')),
    discount: z.coerce.number().min(0, t('forms.errors.number')),
    status: z.string().min(1, t('forms.errors.required')),
    date: z.string().min(1, t('forms.errors.required')),
    dueDate: z.string().min(1, t('forms.errors.required')),
  })

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), mode: 'onTouched' })

  useEffect(() => {
    if (open) reset()
  }, [open, reset])

  const onSubmit = () => {
    toast.success(t('forms.invoiceCreated'))
    onOpenChange(false)
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={t('invoices.newInvoice')}
      description={t('forms.addInvoiceDesc')}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="invoice-form" disabled={isSubmitting}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      <form id="invoice-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormGrid>
          <SelectField
            control={control}
            name="customerId"
            label={t('invoices.customer')}
            required
            placeholder={t('forms.select')}
            options={customers.map((c) => ({ value: String(c.id), label: c.name }))}
            error={errors.customerId?.message}
          />
          <SelectField
            control={control}
            name="orderId"
            label={t('invoices.order')}
            required
            placeholder={t('forms.select')}
            options={orders.map((o) => ({ value: o.id, label: `${o.id} — ${o.type}` }))}
            error={errors.orderId?.message}
          />
        </FormGrid>

        <FormGrid>
          <FormField label={t('invoices.amount')} htmlFor="invoice-amount" required error={errors.amount?.message}>
            <Input id="invoice-amount" type="number" min="0" step="50" {...register('amount')} placeholder="8500" />
          </FormField>
          <SelectField
            control={control}
            name="status"
            label={t('invoices.status')}
            required
            placeholder={t('forms.select')}
            options={invoiceStatuses.map((s) => ({ value: s, label: t(`invoices.${s}`) }))}
            error={errors.status?.message}
          />
        </FormGrid>

        <FormGrid>
          <FormField label={t('invoices.date')} htmlFor="invoice-date" required error={errors.date?.message}>
            <Input id="invoice-date" type="date" {...register('date')} />
          </FormField>
          <FormField label={t('invoices.dueDate')} htmlFor="invoice-due" required error={errors.dueDate?.message}>
            <Input id="invoice-due" type="date" {...register('dueDate')} />
          </FormField>
        </FormGrid>

        <FormField label={t('invoices.discount')} htmlFor="invoice-discount" error={errors.discount?.message}>
          <Input id="invoice-discount" type="number" min="0" step="50" {...register('discount')} placeholder="0" />
        </FormField>
      </form>
    </FormModal>
  )
}
