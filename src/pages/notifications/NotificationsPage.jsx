import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Bell, Check, CheckCheck, Filter, Settings, Package, DollarSign, AlertTriangle, Truck } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { notifications } from '@/data/mockData'

const typeConfig = {
  info: { icon: Bell, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  success: { icon: Check, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  error: { icon: Package, color: 'text-red-500', bg: 'bg-red-500/10' },
}

export function NotificationsPage() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('all')
  const [notifs, setNotifs] = useState(notifications)

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'info', label: 'Info' },
    { key: 'success', label: 'Payments' },
    { key: 'warning', label: 'System' },
  ]

  const filtered = notifs.filter((n) => {
    if (filter === 'all') return true
    if (filter === 'unread') return !n.read
    return n.type === filter
  })

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('nav.notifications')}
        icon={Bell}
        breadcrumbs={[t('nav.dashboard'), t('nav.notifications')]}
        actions={
          <Button variant="outline" onClick={markAllRead}>
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {filters.map((f) => (
          <Button
            key={f.key}
            variant={filter === f.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            {f.key === 'unread' && (
              <Badge variant="destructive" className="ms-1 text-[10px]">
                {notifs.filter((n) => !n.read).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filtered.map((notif, i) => {
          const config = typeConfig[notif.type] || typeConfig.info
          const Icon = config.icon
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`hover:shadow-md transition-all duration-200 ${!notif.read ? 'border-primary/30 bg-primary/5' : ''}`}>
                <CardContent className="p-4 flex items-start gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${config.bg}`}>
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold">{notif.title}</h4>
                      {!notif.read && <div className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                  </div>
                  {!notif.read && (
                    <Button variant="ghost" size="icon-sm" onClick={() => {
                      setNotifs(prev => prev.map(n => n.id === notif.id ? {...n, read: true} : n))
                    }}>
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
