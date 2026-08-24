import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { FormModal, FormField, FormGrid, SelectField } from '@/components/forms/FormComponents'
import { useAuth } from '@/context/AuthContext'
import { useBranchScope } from '@/hooks/useBranchScope'

export function CustomerForm({ open, onOpenChange, customer, onSave }) {
  const { t } = useTranslation()
  const isEdit = Boolean(customer)
  const { isAdmin } = useAuth()
  const { branchOptions, branchId } = useBranchScope()

  const schema = z.object({
    name: z.string().min(2, t('forms.errors.required')),
    phone: z.string().min(5, t('forms.errors.phone')),
    email: z.string().email(t('forms.errors.email')),
    address: z.string().min(3, t('forms.errors.required')),
    ...(isAdmin ? { branchId: z.string().min(1, t('forms.errors.required')) } : {}),
    notes: z.string().optional(),
  })

  const defaultValues = {
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    address: customer?.address || '',
    branchId: customer?.branchId ? String(customer.branchId) : '',
    notes: customer?.notes || '',
  }

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), mode: 'onTouched', defaultValues })

  useEffect(() => {
    if (open) reset(defaultValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reset, customer])

  const onSubmit = (data) => {
    const branch = isAdmin ? Number(data.branchId) : branchId
    onSave?.({ ...data, branchId: branch ?? null })
    toast.success(isEdit ? t('forms.customerUpdated') : t('forms.customerAdded'))
    onOpenChange(false)
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? t('customers.edit') : t('customers.addCustomer')}
      description={isEdit ? customer?.name : t('forms.addCustomerDesc')}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="customer-form" disabled={isSubmitting}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      <form id="customer-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label={t('customers.name')} htmlFor="customer-name" required error={errors.name?.message}>
          <Input id="customer-name" {...register('name')} placeholder={t('forms.placeholders.fullName')} />
        </FormField>

        <FormGrid>
          <FormField label={t('customers.phone')} htmlFor="customer-phone" required error={errors.phone?.message}>
            <Input id="customer-phone" {...register('phone')} placeholder={t('forms.placeholders.phone')} />
          </FormField>
          <FormField label={t('customers.email')} htmlFor="customer-email" required error={errors.email?.message}>
            <Input id="customer-email" type="email" {...register('email')} placeholder={t('forms.placeholders.email')} />
          </FormField>
        </FormGrid>

        <FormField label={t('customers.address')} htmlFor="customer-address" required error={errors.address?.message}>
          <Input id="customer-address" {...register('address')} placeholder={t('forms.placeholders.address')} />
        </FormField>

        {isAdmin && (
          <SelectField
            control={control}
            name="branchId"
            label={t('forms.branch')}
            required
            placeholder={t('branches.selectBranch')}
            options={branchOptions}
            error={errors.branchId?.message}
          />
        )}

        <FormField label={t('forms.notes')} htmlFor="customer-notes" error={errors.notes?.message}>
          <Textarea id="customer-notes" {...register('notes')} placeholder={t('forms.placeholders.notes')} />
        </FormField>
      </form>
    </FormModal>
  )
}
