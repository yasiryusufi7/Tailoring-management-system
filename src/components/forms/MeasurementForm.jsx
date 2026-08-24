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

const bodyFields = [
  'neck', 'chest', 'waist', 'hip', 'shoulder', 'sleeve',
  'arm', 'shirtLength', 'trouserLength', 'bottom', 'collar', 'cuff',
]

export function MeasurementForm({ open, onOpenChange }) {
  const { t } = useTranslation()
  const { scoped } = useBranchScope()
  const branchCustomers = scoped(customers)
  const branchTailors = scoped(tailors)

  const schema = z.object({
    customerId: z.string().min(1, t('forms.errors.required')),
    measuredBy: z.string().min(1, t('forms.errors.required')),
    date: z.string().min(1, t('forms.errors.required')),
    units: z.string().min(1, t('forms.errors.required')),
    ...Object.fromEntries(
      bodyFields.map((key) => [
        key,
        z.coerce.number().min(1, t('forms.errors.number')).max(100, t('forms.errors.numberMax')),
      ])
    ),
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

  const onSubmit = () => {
    toast.success(t('forms.measurementAdded'))
    onOpenChange(false)
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={t('measurements.addMeasurement')}
      description={t('forms.addMeasurementDesc')}
      size="max-w-3xl"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="measurement-form" disabled={isSubmitting}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      <form id="measurement-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormGrid>
          <SelectField
            control={control}
            name="customerId"
            label={t('measurements.customer')}
            required
            placeholder={t('forms.select')}
            options={branchCustomers.map((c) => ({ value: String(c.id), label: c.name }))}
            error={errors.customerId?.message}
          />
          <SelectField
            control={control}
            name="measuredBy"
            label={t('measurements.measuredBy')}
            required
            placeholder={t('forms.select')}
            options={branchTailors.map((tl) => ({ value: tl.name, label: tl.name }))}
            error={errors.measuredBy?.message}
          />
        </FormGrid>

        <FormGrid>
          <FormField label={t('measurements.date')} htmlFor="measurement-date" required error={errors.date?.message}>
            <Input id="measurement-date" type="date" {...register('date')} />
          </FormField>
          <SelectField
            control={control}
            name="units"
            label={t('measurements.units')}
            required
            placeholder={t('forms.select')}
            options={[
              { value: 'inches', label: t('measurements.inches') },
              { value: 'centimeters', label: t('measurements.centimeters') },
            ]}
            error={errors.units?.message}
          />
        </FormGrid>

        <div>
          <p className="mb-3 text-sm font-medium">{t('measurements.body.neck', 'Body')}</p>
          <FormGrid className="sm:grid-cols-3">
            {bodyFields.map((key) => (
              <FormField
                key={key}
                label={t(`measurements.body.${key}`)}
                htmlFor={`measurement-${key}`}
                required
                error={errors[key]?.message}
              >
                <Input
                  id={`measurement-${key}`}
                  type="number"
                  step="0.5"
                  min="0"
                  {...register(key)}
                  placeholder="0"
                />
              </FormField>
            ))}
          </FormGrid>
        </div>

        <FormField label={t('forms.notes')} htmlFor="measurement-notes" error={errors.notes?.message}>
          <Textarea id="measurement-notes" {...register('notes')} placeholder={t('forms.placeholders.notes')} />
        </FormField>
      </form>
    </FormModal>
  )
}
