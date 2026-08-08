import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function StatCard({ title, value, change, changeType = 'positive', icon: Icon, color = 'primary', index = 0 }) {
  const colorMap = {
    primary: 'from-blue-500 to-indigo-600',
    success: 'from-emerald-500 to-green-600',
    warning: 'from-amber-400 to-orange-500',
    danger: 'from-red-500 to-rose-600',
    purple: 'from-purple-500 to-violet-600',
  }

  const iconBgMap = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    danger: 'bg-red-500/10 text-red-600 dark:text-red-400',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="card-premium p-6 group hover:shadow-lg transition-all duration-300 relative overflow-hidden"
    >
      <div className={`absolute top-0 end-0 w-24 h-24 bg-gradient-to-br ${colorMap[color]} opacity-5 rounded-bl-full transition-all duration-300 group-hover:opacity-10 group-hover:w-28 group-hover:h-28`} />
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className="text-2xl font-bold tracking-tight"
          >
            {value}
          </motion.p>
          {change && (
            <p className={cn('text-xs font-medium', changeType === 'positive' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')}>
              {changeType === 'positive' ? '+' : ''}{change}
            </p>
          )}
        </div>
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', iconBgMap[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  )
}
