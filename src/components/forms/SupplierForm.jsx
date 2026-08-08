import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormModal, FormField, FormGrid } from '@/components/forms/FormComponents'

export function SupplierForm({ open, onOpenChange }) {
  const { t } = useTranslation()

  const schema = z.object({
    name: z.string().min(2, t('forms.errors.required')),
    phone: z.string().min(5, t('forms.errors.phone')),
    email: z.string().email(t('forms.errors.email')),
    address: z.string().min(3, t('forms.errors.required')),
    outstandingBalance: z.coerce.number().min(0, t('forms.errors.number')),
    totalPurchases: z.coerce.number().min(0, t('forms.errors.number')),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), mode: 'onTouched' })

  useEffect(() => {
    if (open) reset()
  }, [open, reset])

  const onSubmit = () => {
    toast.success(t('forms.supplierAdded'))
    onOpenChange(false)
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={t('suppliers.addSupplier')}
      description={t('forms.addSupplierDesc')}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="supplier-form" disabled={isSubmitting}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      <form id="supplier-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label={t('suppliers.name')} htmlFor="supplier-name" required error={errors.name?.message}>
          <Input id="supplier-name" {...register('name')} placeholder="Afghan Textiles Co." />
        </FormField>

        <FormGrid>
          <FormField label={t('suppliers.phone')} htmlFor="supplier-phone" required error={errors.phone?.message}>
            <Input id="supplier-phone" {...register('phone')} placeholder="+93 7xx xxx xxx" />
          </FormField>
          <FormField label={t('suppliers.email')} htmlFor="supplier-email" required error={errors.email?.message}>
            <Input id="supplier-email" type="email" {...register('email')} placeholder="info@company.com" />
          </FormField>
        </FormGrid>

        <FormField label={t('suppliers.address')} htmlFor="supplier-address" required error={errors.address?.message}>
          <Input id="supplier-address" {...register('address')} placeholder={t('forms.placeholders.address')} />
        </FormField>

        <FormGrid>
          <FormField
            label={t('suppliers.outstandingBalance')}
            htmlFor="supplier-outstanding"
            required
            error={errors.outstandingBalance?.message}
          >
            <Input id="supplier-outstanding" type="number" min="0" step="50" {...register('outstandingBalance')} placeholder="0" />
          </FormField>
          <FormField
            label={t('suppliers.totalPurchases')}
            htmlFor="supplier-purchases"
            required
            error={errors.totalPurchases?.message}
          >
            <Input id="supplier-purchases" type="number" min="0" step="50" {...register('totalPurchases')} placeholder="0" />
          </FormField>
        </FormGrid>
      </form>
    </FormModal>
  )
}
