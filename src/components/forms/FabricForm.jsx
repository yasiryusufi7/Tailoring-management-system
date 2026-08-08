import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FormModal, FormField, SelectField, FormGrid } from '@/components/forms/FormComponents'
import { suppliers } from '@/data/mockData'

const fabricUnits = ['meters', 'yards', 'rolls']

export function FabricForm({ open, onOpenChange }) {
  const { t } = useTranslation()

  const schema = z.object({
    name: z.string().min(2, t('forms.errors.required')),
    color: z.string().min(1, t('forms.errors.required')),
    quantity: z.coerce.number().min(0, t('forms.errors.number')),
    unit: z.string().min(1, t('forms.errors.required')),
    price: z.coerce.number().min(1, t('forms.errors.number')),
    supplierId: z.string().min(1, t('forms.errors.required')),
    reorderLevel: z.coerce.number().min(0, t('forms.errors.number')),
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
    toast.success(t('forms.fabricAdded'))
    onOpenChange(false)
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={t('inventory.addFabric')}
      description={t('forms.addFabricDesc')}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" form="fabric-form" disabled={isSubmitting}>
            {t('common.save')}
          </Button>
        </>
      }
    >
      <form id="fabric-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormGrid>
          <FormField label={t('inventory.name')} htmlFor="fabric-name" required error={errors.name?.message}>
            <Input id="fabric-name" {...register('name')} placeholder={t('forms.placeholders.fabricName')} />
          </FormField>
          <FormField label={t('inventory.color')} htmlFor="fabric-color" required error={errors.color?.message}>
            <Input id="fabric-color" type="color" {...register('color')} className="h-10 cursor-pointer p-1" />
          </FormField>
        </FormGrid>

        <FormGrid>
          <FormField label={t('inventory.quantity')} htmlFor="fabric-qty" required error={errors.quantity?.message}>
            <Input id="fabric-qty" type="number" min="0" step="1" {...register('quantity')} placeholder="45" />
          </FormField>
          <SelectField
            control={control}
            name="unit"
            label={t('inventory.unit')}
            required
            placeholder={t('forms.select')}
            options={fabricUnits.map((u) => ({ value: u, label: u }))}
            error={errors.unit?.message}
          />
        </FormGrid>

        <FormGrid>
          <FormField label={t('inventory.price')} htmlFor="fabric-price" required error={errors.price?.message}>
            <Input id="fabric-price" type="number" min="0" step="50" {...register('price')} placeholder="2500" />
          </FormField>
          <SelectField
            control={control}
            name="supplierId"
            label={t('inventory.supplier')}
            required
            placeholder={t('forms.select')}
            options={suppliers.map((s) => ({ value: String(s.id), label: s.name }))}
            error={errors.supplierId?.message}
          />
        </FormGrid>

        <FormField
          label={t('inventory.reorderLevel')}
          htmlFor="fabric-reorder"
          required
          error={errors.reorderLevel?.message}
        >
          <Input id="fabric-reorder" type="number" min="0" step="1" {...register('reorderLevel')} placeholder="20" />
        </FormField>
      </form>
    </FormModal>
  )
}
