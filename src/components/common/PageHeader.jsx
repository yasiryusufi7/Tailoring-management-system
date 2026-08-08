import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

export function PageHeader({ title, subtitle, breadcrumbs = [], actions, icon: Icon }) {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      {breadcrumbs.length > 0 && (
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
              <span className={i === breadcrumbs.length - 1 ? 'text-foreground font-medium' : 'hover:text-foreground cursor-pointer transition-colors'}>
                {crumb}
              </span>
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </motion.div>
  )
}
