import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import {
  Bell, Check, CheckCheck, AlertTriangle, Package, Send,
  Users, User as UserIcon, Inbox,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input, Textarea } from '@/components/ui/Input'
import { Label } from '@/components/forms/FormComponents'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select'
import { useAuth } from '@/context/AuthContext'
import { users as allUsers, tailors as allTailors } from '@/data/mockData'
import { useBranchScope } from '@/hooks/useBranchScope'
import {
  useNotifications,
  notificationsFor,
  markAsRead,
  markAllReadFor,
  addNotification,
  notifAge,
} from '@/data/notificationStore'

const typeConfig = {
  info: { icon: Bell, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  success: { icon: Check, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  error: { icon: Package, color: 'text-red-500', bg: 'bg-red-500/10' },
}

export function NotificationsPage() {
  const { t } = useTranslation()
  const { currentUser, isAdmin, isManager } = useAuth()
  const { scoped } = useBranchScope()

  const [filter, setFilter] = useState('all')
  const [tab, setTab] = useState('inbox')
  const [recipient, setRecipient] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [type, setType] = useState('info')

  const canSend = isAdmin || isManager
  const storeNotifs = useNotifications()
  const myNotifs = notificationsFor(currentUser)
  const sent = storeNotifs
    .filter((n) => n.senderId === currentUser.id)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))

  const filtered = myNotifs.filter((n) => {
    if (filter === 'all') return true
    if (filter === 'unread') return !n.read
    return n.type === filter
  })

  const unreadCount = myNotifs.filter((n) => !n.read).length

  const userName = (id) => allUsers.find((u) => u.id === id)?.name || t('notifications.system')

  const recipientOptions = () => {
    if (isAdmin) {
      return [
        { value: 'role:manager', label: t('notifications.allManagers') },
        ...allUsers
          .filter((u) => u.role === 'manager')
          .map((m) => ({ value: `user:${m.id}`, label: m.name })),
      ]
    }
    if (isManager) {
      return [
        { value: `roletailor:${currentUser.branchId}`, label: t('notifications.myTailors') },
        ...scoped(allTailors).map((tl) => ({ value: `tailor:${tl.id}`, label: tl.name })),
      ]
    }
    return []
  }

  const handleSend = () => {
    if (!recipient || !subject.trim() || !message.trim()) {
      toast.error(t('forms.errors.required'))
      return
    }
    const payload = { title: subject.trim(), message: message.trim(), type, senderId: currentUser.id }
    if (recipient.startsWith('user:')) {
      payload.recipientUserId = Number(recipient.split(':')[1])
    } else if (recipient.startsWith('tailor:')) {
      payload.recipientTailorId = Number(recipient.split(':')[1])
      payload.branchId = currentUser.branchId
    } else if (recipient.startsWith('role:')) {
      payload.recipientRole = recipient.split(':')[1]
    } else if (recipient.startsWith('roletailor:')) {
      payload.recipientRole = 'tailor'
      payload.branchId = Number(recipient.split(':')[1])
    }
    addNotification(payload)
    toast.success(t('notifications.sent'))
    setRecipient('')
    setSubject('')
    setMessage('')
    setType('info')
  }

  const targetLabel = (n) => {
    if (n.recipientUserId != null) return userName(n.recipientUserId)
    if (n.recipientTailorId != null) {
      return allTailors.find((tl) => tl.id === n.recipientTailorId)?.name || '—'
    }
    if (n.recipientRole === 'manager') return t('notifications.allManagers')
    if (n.recipientRole === 'tailor') return t('notifications.myTailors')
    return '—'
  }

  const filters = [
    { key: 'all', label: t('notifications.all') },
    { key: 'unread', label: t('notifications.unread'), count: unreadCount },
    { key: 'info', label: t('notifications.typeInfo') },
    { key: 'success', label: t('notifications.typeSuccess') },
    { key: 'warning', label: t('notifications.typeWarning') },
    { key: 'error', label: t('notifications.typeError') },
  ]

  const renderNotifCard = (notif, i) => {
    const config = typeConfig[notif.type] || typeConfig.info
    const Icon = config.icon
    const age = notifAge(notif.createdAt)
    return (
      <motion.div
        key={notif.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(i * 0.04, 0.3) }}
      >
        <Card className={`hover:shadow-md transition-all duration-200 ${!notif.read && tab === 'inbox' ? 'border-primary/30 bg-primary/5' : ''}`}>
          <CardContent className="p-4 flex items-start gap-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${config.bg}`}>
              <Icon className={`h-5 w-5 ${config.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h4 className="text-sm font-semibold">{notif.title}</h4>
                {!notif.read && tab === 'inbox' && <div className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                {tab === 'sent' && (
                  <Badge variant="outline" className="text-[11px] gap-1">
                    <UserIcon className="h-3 w-3" />
                    {t('notifications.to', { name: targetLabel(notif) })}
                  </Badge>
                )}
                {tab === 'inbox' && notif.senderId != null && (
                  <span className="text-xs text-muted-foreground">{t('notifications.from', { name: userName(notif.senderId) })}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{notif.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{t(`notifications.${age.unit}`, { count: age.count })}</p>
            </div>
            {!notif.read && tab === 'inbox' && (
              <Button variant="ghost" size="icon-sm" onClick={() => markAsRead(notif.id)}>
                <Check className="h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('nav.notifications')}
        subtitle={canSend ? t('notifications.sendDesc') : undefined}
        icon={Bell}
        breadcrumbs={[t('nav.dashboard'), t('nav.notifications')]}
        actions={
          tab === 'inbox' ? (
            <Button variant="outline" onClick={() => markAllReadFor(currentUser)} disabled={unreadCount === 0}>
              <CheckCheck className="h-4 w-4" />
              {t('notifications.markAllRead')}
            </Button>
          ) : undefined
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant={tab === 'inbox' ? 'default' : 'outline'} size="sm" onClick={() => setTab('inbox')}>
          <Inbox className="h-4 w-4" />
          {t('notifications.inbox')}
          {unreadCount > 0 && <Badge variant="destructive" className="ms-1 text-[10px]">{unreadCount}</Badge>}
        </Button>
        {canSend && (
          <>
            <Button variant={tab === 'sent' ? 'default' : 'outline'} size="sm" onClick={() => setTab('sent')}>
              <Send className="h-4 w-4" />
              {t('notifications.sentItems')}
            </Button>
            <Button variant={tab === 'compose' ? 'default' : 'outline'} size="sm" onClick={() => setTab('compose')}>
              <Users className="h-4 w-4" />
              {t('notifications.sendTitle')}
            </Button>
          </>
        )}
      </div>

      {/* Compose */}
      {tab === 'compose' && canSend && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Send className="h-5 w-5 text-primary" />
                {t('notifications.sendTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-w-2xl">
              <div className="space-y-1.5">
                <Label>
                  {t('notifications.recipient')}
                  <span className="text-destructive"> *</span>
                </Label>
                <Select value={recipient} onValueChange={setRecipient}>
                  <SelectTrigger id="notif-recipient">
                    <SelectValue placeholder={t('notifications.selectRecipient')} />
                  </SelectTrigger>
                  <SelectContent>
                    {recipientOptions().map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t('notifications.subjectPlaceholder')}
              />
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('notifications.messagePlaceholder')}
                rows={4}
              />
              <div className="flex items-center gap-2 flex-wrap">
                {['info', 'success', 'warning', 'error'].map((tp) => (
                  <Button
                    key={tp}
                    type="button"
                    size="sm"
                    variant={type === tp ? 'default' : 'outline'}
                    onClick={() => setType(tp)}
                  >
                    {t(`notifications.type${tp.charAt(0).toUpperCase()}${tp.slice(1)}`)}
                  </Button>
                ))}
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSend}>
                  <Send className="h-4 w-4" />
                  {t('notifications.send')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filters (inbox only) */}
      {tab === 'inbox' && (
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((f) => (
            <Button
              key={f.key}
              variant={filter === f.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              {f.key === 'unread' && f.count > 0 && (
                <Badge variant="destructive" className="ms-1 text-[10px]">{f.count}</Badge>
              )}
            </Button>
          ))}
        </div>
      )}

      {/* List */}
      <div className="space-y-2">
        {(tab === 'inbox' ? filtered : sent).map((notif, i) => renderNotifCard(notif, i))}
        {(tab === 'inbox' ? filtered : sent).length === 0 && (
          <Card>
            <CardContent className="py-14 text-center space-y-1.5">
              <Bell className="h-8 w-8 mx-auto text-muted-foreground/40" />
              <p className="text-sm font-medium">{tab === 'inbox' ? t('notifications.empty') : t('notifications.nothingSent')}</p>
              <p className="text-xs text-muted-foreground">{t('notifications.emptyHint')}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
