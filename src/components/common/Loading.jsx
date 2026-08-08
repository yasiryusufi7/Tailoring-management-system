import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export function LoadingSpinner({ size = 'default', className = '' }) {
  const sizes = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizes[size]} rounded-full border-2 border-primary/20 border-t-primary`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

export function PageLoader() {
  const { t } = useTranslation()
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground animate-pulse">{t('common.loading')}</p>
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <div key={j} className="h-10 flex-1 shimmer-bg rounded-md" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="card-premium p-6 space-y-4">
      <div className="h-4 w-32 shimmer-bg rounded" />
      <div className="h-8 w-24 shimmer-bg rounded" />
      <div className="h-3 w-48 shimmer-bg rounded" />
    </div>
  )
}
