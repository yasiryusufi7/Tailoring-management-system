import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormModal, FormField, FormGrid } from '@/components/forms/FormComponents'

export function BranchForm({ open, onOpenChange, onCreate }) {
  const { t } = useTranslation()

  const schema = z.object({
    name: z.string().min(2, t('forms.errors.required')),
    address: z.string().min(3, t('forms.errors.required')),
    phone: z.string().min(5, t('forms.errors.phone')),
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

  const onSubmit = (data) => {
    onCreate?.(data)
    toast.success(t('branches.branchAdded'))
    onOpenChange(false)
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={t('branches.addBranch')}
      description={t('branches.addBranchDesc')}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="branch-form" disabled={isSubmitting}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      <form id="branch-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label={t('branches.name')} htmlFor="branch-name" required error={errors.name?.message}>
          <Input id="branch-name" {...register('name')} placeholder={t('branches.namePlaceholder')} />
        </FormField>
        <FormField label={t('branches.address')} htmlFor="branch-address" required error={errors.address?.message}>
          <Input id="branch-address" {...register('address')} placeholder={t('forms.placeholders.address')} />
        </FormField>
        <FormField label={t('branches.phone')} htmlFor="branch-phone" required error={errors.phone?.message}>
          <Input id="branch-phone" {...register('phone')} placeholder={t('forms.placeholders.phone')} />
        </FormField>
      </form>
    </FormModal>
  )
}
