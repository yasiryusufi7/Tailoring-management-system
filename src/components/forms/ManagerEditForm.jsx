import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormModal, FormField, SelectField, FormGrid } from '@/components/forms/FormComponents'

export function ManagerEditForm({ open, onOpenChange, onUpdate, branchOptions, manager }) {
  const { t } = useTranslation()

  const schema = z.object({
    name: z.string().min(2, t('forms.errors.required')),
    email: z.string().email(t('forms.errors.email')),
    phone: z.string().optional(),
    shopName: z.string().optional(),
    branchId: z.string().min(1, t('forms.errors.required')),
  })

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), mode: 'onTouched' })

  useEffect(() => {
    if (open && manager) {
      reset({
        name: manager.name || '',
        email: manager.email || '',
        phone: manager.phone || '',
        shopName: manager.shopName || '',
        branchId: manager.branchId ? String(manager.branchId) : '',
      })
    }
  }, [open, manager, reset])

  const onSubmit = (data) => {
    onUpdate?.({ ...data, branchId: Number(data.branchId) })
    toast.success(t('managers.managerUpdated'))
    onOpenChange(false)
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={t('managers.editManager')}
      description={t('managers.editManagerDesc')}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="manager-edit-form" disabled={isSubmitting}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      <form id="manager-edit-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormGrid>
          <FormField label={t('branches.managerName')} htmlFor="manager-edit-name" required error={errors.name?.message}>
            <Input id="manager-edit-name" {...register('name')} placeholder={t('forms.placeholders.fullName')} />
          </FormField>
          <FormField label={t('branches.managerEmail')} htmlFor="manager-edit-email" required error={errors.email?.message}>
            <Input id="manager-edit-email" type="email" {...register('email')} placeholder={t('forms.placeholders.email')} />
          </FormField>
        </FormGrid>

        <FormGrid>
          <FormField label={t('profile.phone')} htmlFor="manager-edit-phone" error={errors.phone?.message}>
            <Input id="manager-edit-phone" {...register('phone')} placeholder={t('forms.placeholders.phone')} />
          </FormField>
          <FormField label={t('profile.shopName')} htmlFor="manager-edit-shop" error={errors.shopName?.message}>
            <Input id="manager-edit-shop" {...register('shopName')} placeholder={t('profile.shopName')} />
          </FormField>
        </FormGrid>

        <SelectField
          control={control}
          name="branchId"
          label={t('branches.assignBranch')}
          required
          placeholder={t('forms.select')}
          options={branchOptions}
          error={errors.branchId?.message}
        />
      </form>
    </FormModal>
  )
}
