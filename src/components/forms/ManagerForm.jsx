import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormModal, FormField, SelectField, FormGrid } from '@/components/forms/FormComponents'

export function ManagerForm({ open, onOpenChange, onCreate, branchOptions, branches }) {
  const { t } = useTranslation()

  const schema = z.object({
    name: z.string().min(2, t('forms.errors.required')),
    email: z.string().email(t('forms.errors.email')),
    password: z.string().min(6, t('forms.errors.password')),
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
    if (open) reset()
  }, [open, reset])

  const onSubmit = (data) => {
    onCreate?.({ ...data, branchId: Number(data.branchId) })
    toast.success(t('branches.managerAdded'))
    onOpenChange(false)
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={t('branches.addManager')}
      description={t('branches.addManagerDesc')}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="manager-form" disabled={isSubmitting}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      <form id="manager-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormGrid>
          <FormField label={t('branches.managerName')} htmlFor="manager-name" required error={errors.name?.message}>
            <Input id="manager-name" {...register('name')} placeholder={t('forms.placeholders.fullName')} />
          </FormField>
          <FormField label={t('branches.managerEmail')} htmlFor="manager-email" required error={errors.email?.message}>
            <Input id="manager-email" type="email" {...register('email')} placeholder={t('forms.placeholders.email')} />
          </FormField>
        </FormGrid>

        <FormField label={t('forms.password')} htmlFor="manager-password" required error={errors.password?.message}>
          <Input id="manager-password" type="password" {...register('password')} placeholder={t('forms.placeholders.password')} />
        </FormField>

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
