import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormModal, FormField, FormGrid, SelectField } from '@/components/forms/FormComponents'
import { useAuth } from '@/context/AuthContext'
import { useBranchScope } from '@/hooks/useBranchScope'

export function TailorForm({ open, onOpenChange, tailor, onSave }) {
  const { t } = useTranslation()
  const isEdit = Boolean(tailor)
  const { isAdmin } = useAuth()
  const { branchOptions, branchId } = useBranchScope()

  const schema = z.object({
    name: z.string().min(2, t('forms.errors.required')),
    specialization: z.string().min(2, t('forms.errors.required')),
    dailyProduction: z.coerce.number().min(1, t('forms.errors.number')).max(20, t('forms.errors.numberMax')),
    pieceRate: z.coerce.number().min(1, t('forms.errors.number')),
    dailyWage: z.coerce.number().min(1, t('forms.errors.number')),
    monthlyWage: z.coerce.number().min(1, t('forms.errors.number')),
    ...(isAdmin ? { branchId: z.string().min(1, t('forms.errors.required')) } : {}),
  })

  const defaultValues = {
    name: tailor?.name || '',
    specialization: tailor?.specialization || '',
    dailyProduction: tailor?.dailyProduction || '',
    pieceRate: tailor?.pieceRate || '',
    dailyWage: tailor?.dailyWage || '',
    monthlyWage: tailor?.monthlyWage || '',
    branchId: tailor?.branchId ? String(tailor.branchId) : '',
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
  }, [open, reset, tailor])

  const onSubmit = (data) => {
    const branch = isAdmin ? Number(data.branchId) : branchId
    onSave?.({ ...data, branchId: branch ?? null })
    toast.success(isEdit ? t('forms.tailorUpdated') : t('forms.tailorAdded'))
    onOpenChange(false)
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={t('tailors.addTailor')}
      description={t('forms.addTailorDesc')}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="tailor-form" disabled={isSubmitting}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      <form id="tailor-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormGrid>
          <FormField label={t('tailors.name')} htmlFor="tailor-name" required error={errors.name?.message}>
            <Input id="tailor-name" {...register('name')} placeholder={t('forms.placeholders.fullName')} />
          </FormField>
          <FormField
            label={t('tailors.specialization')}
            htmlFor="tailor-specialization"
            required
            error={errors.specialization?.message}
          >
            <Input id="tailor-specialization" {...register('specialization')} placeholder="Suits & Blazers" />
          </FormField>
        </FormGrid>

        <FormGrid>
          <FormField
            label={t('tailors.dailyProduction')}
            htmlFor="tailor-daily"
            required
            error={errors.dailyProduction?.message}
          >
            <Input id="tailor-daily" type="number" min="0" {...register('dailyProduction')} placeholder="3" />
          </FormField>
          <FormField label={t('tailors.pieceRate')} htmlFor="tailor-piece" required error={errors.pieceRate?.message}>
            <Input id="tailor-piece" type="number" min="0" step="50" {...register('pieceRate')} placeholder="800" />
          </FormField>
        </FormGrid>

        <FormGrid>
          <FormField label={t('tailors.dailyWage')} htmlFor="tailor-dailyWage" required error={errors.dailyWage?.message}>
            <Input id="tailor-dailyWage" type="number" min="0" step="50" {...register('dailyWage')} placeholder="1500" />
          </FormField>
          <FormField
            label={t('tailors.monthlyWage')}
            htmlFor="tailor-monthly"
            required
            error={errors.monthlyWage?.message}
          >
            <Input id="tailor-monthly" type="number" min="0" step="100" {...register('monthlyWage')} placeholder="45000" />
          </FormField>
        </FormGrid>

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
      </form>
    </FormModal>
  )
}
