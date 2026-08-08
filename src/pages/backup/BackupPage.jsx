import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Database, Download, Upload, Trash2, RefreshCw, CheckCircle, Clock, HardDrive, AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'
import { backups } from '@/data/mockData'

export function BackupPage() {
  const { t } = useTranslation()
  const [creating, setCreating] = useState(false)
  const [restoreDialog, setRestoreDialog] = useState(false)
  const [selectedBackup, setSelectedBackup] = useState(null)

  const handleCreateBackup = () => {
    setCreating(true)
    setTimeout(() => setCreating(false), 2000)
  }

  const handleRestore = (backup) => {
    setSelectedBackup(backup)
    setRestoreDialog(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('backup.title')}
        icon={Database}
        breadcrumbs={[t('nav.dashboard'), t('nav.backup')]}
        actions={
          <Button onClick={handleCreateBackup} disabled={creating}>
            {creating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
            {creating ? t('backup.creating') : t('backup.createBackup')}          </Button>
        }
      />

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: HardDrive, label: t('backup.totalBackups'), value: backups.length, color: 'text-primary', bg: 'bg-primary/10' },
          { icon: CheckCircle, label: t('backup.lastBackup'), value: t('backup.todayTime'), color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { icon: Clock, label: t('backup.nextBackup'), value: t('backup.tomorrowTime'), color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <CardTitle>{t('backup.history')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="h-12 px-4 text-start text-xs font-semibold uppercase text-muted-foreground">{t('backup.date')}</th>
                  <th className="h-12 px-4 text-start text-xs font-semibold uppercase text-muted-foreground">{t('backup.size')}</th>
                  <th className="h-12 px-4 text-start text-xs font-semibold uppercase text-muted-foreground">{t('common.type')}</th>
                  <th className="h-12 px-4 text-start text-xs font-semibold uppercase text-muted-foreground">{t('backup.status')}</th>
                  <th className="h-12 px-4 text-end text-xs font-semibold uppercase text-muted-foreground">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {backups.map((backup, i) => (
                  <motion.tr
                    key={backup.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b last:border-0 hover:bg-muted/30"
                  >
                    <td className="h-14 px-4 text-sm font-mono">{backup.date}</td>
                    <td className="h-14 px-4 text-sm">{backup.size}</td>
                    <td className="h-14 px-4">
                      <Badge variant={backup.type === 'manual' ? 'info' : 'secondary'}>{backup.type}</Badge>
                    </td>
                    <td className="h-14 px-4">
                      <Badge variant="success">{backup.status}</Badge>
                    </td>
                    <td className="h-14 px-4 text-end">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => handleRestore(backup)}>
                          <Upload className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Restore Dialog */}
      <Dialog open={restoreDialog} onOpenChange={setRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('backup.restoreTitle')}</DialogTitle>
            <DialogDescription>
              {t('backup.restoreConfirmDesc', { date: selectedBackup?.date })}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-400">{t('backup.restoreWarning')}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestoreDialog(false)}>{t('common.cancel')}</Button>
            <Button variant="destructive" onClick={() => setRestoreDialog(false)}>{t('backup.restore')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
