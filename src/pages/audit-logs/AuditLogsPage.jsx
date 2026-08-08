import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ClipboardList, User, Clock, Download, Filter, Search } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { auditLogs } from '@/data/mockData'

export function AuditLogsPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('auditLogs.title')}
        icon={ClipboardList}
        breadcrumbs={[t('nav.dashboard'), t('nav.auditLogs')]}
        actions={
          <Button variant="outline">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
        }
      />

      <div className="flex items-center gap-3">
        <Input placeholder={t('auditLogs.search')} className="max-w-sm" />
        <Button variant="outline" size="sm"><Filter className="h-4 w-4 me-1" />{t('common.filter')}</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="relative">
            <div className="absolute start-6 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-0">
              {auditLogs.map((log, i) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative flex gap-4 px-6 py-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-background shrink-0">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{log.user}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                    </div>
                    <p className="text-sm">{log.action}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{log.details}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
