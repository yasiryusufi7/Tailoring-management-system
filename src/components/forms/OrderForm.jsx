import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { FormModal, FormField, SelectField, FormGrid } from '@/components/forms/FormComponents'
import { customers, tailors } from '@/data/mockData'
import { useBranchScope } from '@/hooks/useBranchScope'

const orderPriorities = ['high', 'medium', 'low']

export function OrderForm({ open, onOpenChange, onSave }) {
  const { t } = useTranslation()
  const { scoped } = useBranchScope()
  const branchCustomers = scoped(customers)
  const branchTailors = scoped(tailors)

  const schema = z.object({
    customerId: z.string().min(1, t('forms.errors.required')),
    tailorId: z.string().min(1, t('forms.errors.required')),
    type: z.string().min(2, t('forms.errors.required')),
    amount: z.coerce.number().min(1, t('forms.errors.number')),
    priority: z.string().min(1, t('forms.errors.required')),
    deliveryDate: z.string().min(1, t('forms.errors.required')),
    notes: z.string().optional(),
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

  const onSubmit = (data) => {
    const order = {
      id: `ORD-${Date.now()}`,
      customerId: Number(data.customerId),
      tailorId: Number(data.tailorId),
      type: data.type,
      status: 'assigned',
      priority: data.priority,
      amount: data.amount,
      deliveryDate: data.deliveryDate,
      notes: data.notes || '',
      createdAt: new Date().toISOString().slice(0, 10),
    }
    if (onSave) onSave(order)
    toast.success(t('forms.orderCreated'))
    onOpenChange(false)
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={t('orders.newOrder')}
      description={t('forms.addOrderDesc')}
      size="max-w-2xl"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="order-form" disabled={isSubmitting}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      <form id="order-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormGrid>
          <SelectField
            control={control}
            name="customerId"
            label={t('orders.customer')}
            required
            placeholder={t('forms.select')}
            options={branchCustomers.map((c) => ({ value: String(c.id), label: c.name }))}
            error={errors.customerId?.message}
          />
          <SelectField
            control={control}
            name="tailorId"
            label={t('orders.tailor')}
            required
            placeholder={t('forms.select')}
            options={branchTailors.map((tl) => ({ value: String(tl.id), label: tl.name }))}
            error={errors.tailorId?.message}
          />
        </FormGrid>

        <FormGrid>
          <FormField label={t('orders.type')} htmlFor="order-type" required error={errors.type?.message}>
            <Input id="order-type" {...register('type')} placeholder={t('forms.placeholders.orderType')} />
          </FormField>
          <FormField label={t('orders.amount')} htmlFor="order-amount" required error={errors.amount?.message}>
            <Input id="order-amount" type="number" min="0" step="50" {...register('amount')} placeholder="8500" />
          </FormField>
        </FormGrid>

        <FormGrid>
          <SelectField
            control={control}
            name="priority"
            label={t('orders.priority')}
            required
            placeholder={t('forms.select')}
            options={orderPriorities.map((p) => ({ value: p, label: t(`orders.${p}`) }))}
            error={errors.priority?.message}
          />
          <FormField label={t('orders.deliveryDate')} htmlFor="order-delivery" required error={errors.deliveryDate?.message}>
            <Input id="order-delivery" type="date" {...register('deliveryDate')} />
          </FormField>
        </FormGrid>

        <FormField label={t('forms.notes')} htmlFor="order-notes" error={errors.notes?.message}>
          <Textarea id="order-notes" {...register('notes')} placeholder={t('forms.placeholders.orderNotes')} />
        </FormField>
      </form>
    </FormModal>
  )
}
