import * as React from 'react'
import { Controller } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select'

export function Label({ className, ...props }) {
  return <label className={cn('text-sm font-medium leading-none', className)} {...props} />
}

export function FormModal({ open, onOpenChange, title, description, children, footer, size = 'max-w-lg', bodyClassName }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0', size)}>
        <DialogHeader className="border-b px-6 pb-4 pt-6">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className={cn('flex-1 overflow-y-auto px-6 py-5', bodyClassName)}>{children}</div>
        {footer && <DialogFooter className="border-t px-6 py-4">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}

export function FormField({ label, htmlFor, required, error, hint, children, className }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <Label htmlFor={htmlFor}>
          {label}
          {required && <span className="text-destructive"> *</span>}
        </Label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  )
}

export function SelectField({ control, name, label, required, placeholder, options, error }) {
  return (
    <FormField label={label} htmlFor={name} required={required} error={error}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            value={field.value || undefined}
            onValueChange={(value) => field.onChange(value || '')}
          >
            <SelectTrigger id={name}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </FormField>
  )
}

export function FormGrid({ className, ...props }) {
  return <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2', className)} {...props} />
}
