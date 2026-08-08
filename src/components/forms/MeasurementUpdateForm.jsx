import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { FormModal, FormField, SelectField, FormGrid } from '@/components/forms/FormComponents'

const bodyFields = [
  'neck', 'chest', 'waist', 'hip', 'shoulder', 'sleeve',
  'arm', 'shirtLength', 'trouserLength', 'bottom', 'collar', 'cuff',
]

const today = () => new Date().toISOString().slice(0, 10)

export function MeasurementUpdateForm({ open, onOpenChange, customer, latestMeasurement, onSave }) {
  const { t } = useTranslation()

  const schema = z.object({
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

  const defaultValues = {
    measuredBy: latestMeasurement?.measuredBy || '',
    date: latestMeasurement?.date || today(),
    units: latestMeasurement?.units || 'inches',
    notes: latestMeasurement?.notes || '',
    ...Object.fromEntries(
      bodyFields.map((key) => [key, latestMeasurement?.data?.[key] || ''])
    ),
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
  }, [open, reset, latestMeasurement])

  const onSubmit = (data) => {
    onSave?.(data)
    toast.success(t('forms.measurementUpdated'))
    onOpenChange(false)
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={t('customers.updateMeasurement')}
      description={customer ? `${customer.name}` : undefined}
      size="max-w-3xl"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="measurement-update-form" disabled={isSubmitting}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      <form id="measurement-update-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormGrid>
          <FormField label={t('measurements.date')} htmlFor="measurement-update-date" required error={errors.date?.message}>
            <Input id="measurement-update-date" type="date" {...register('date')} />
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

        <FormField label={t('measurements.measuredBy')} htmlFor="measurement-update-measuredBy" required error={errors.measuredBy?.message}>
          <Input id="measurement-update-measuredBy" {...register('measuredBy')} placeholder={t('forms.placeholders.fullName')} />
        </FormField>

        <div>
          <p className="mb-3 text-sm font-medium">{t('measurements.body.neck', 'Body')}</p>
          <FormGrid className="sm:grid-cols-3">
            {bodyFields.map((key) => (
              <FormField
                key={key}
                label={t(`measurements.body.${key}`)}
                htmlFor={`measurement-update-${key}`}
                required
                error={errors[key]?.message}
              >
                <Input
                  id={`measurement-update-${key}`}
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

        <FormField label={t('forms.notes')} htmlFor="measurement-update-notes" error={errors.notes?.message}>
          <Textarea id="measurement-update-notes" {...register('notes')} placeholder={t('forms.placeholders.notes')} />
        </FormField>
      </form>
    </FormModal>
  )
}
