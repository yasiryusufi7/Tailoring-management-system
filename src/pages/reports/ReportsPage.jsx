import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { BarChart3, Download, FileText, Calendar, TrendingUp, Users, Scissors, Package, Printer } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { accountingData } from '@/data/mockData'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const reportTypes = [
  { key: 'revenue', icon: TrendingUp, color: 'from-blue-500 to-indigo-600' },
  { key: 'orders', icon: FileText, color: 'from-emerald-500 to-green-600' },
  { key: 'tailors', icon: Scissors, color: 'from-purple-500 to-violet-600' },
  { key: 'fabric', icon: Package, color: 'from-amber-500 to-orange-600' },
  { key: 'customers', icon: Users, color: 'from-rose-500 to-red-600' },
]

export function ReportsPage() {
  const { t } = useTranslation()
  const [selected, setSelected] = useState('revenue')

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('nav.reports')}
        icon={BarChart3}
        breadcrumbs={[t('nav.dashboard'), t('nav.reports')]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline"><Download className="h-4 w-4 me-1" />{t('common.pdf')}</Button>
            <Button variant="outline"><Printer className="h-4 w-4 me-1" />{t('common.print')}</Button>
          </div>
        }
      />

      {/* Report Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {reportTypes.map((report, i) => {
          const Icon = report.icon
          return (
            <motion.button
              key={report.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              onClick={() => setSelected(report.key)}
              className={`text-start rounded-xl border p-4 transition-all duration-200 ${
                selected === report.key
                  ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary/20'
                  : 'hover:shadow-md bg-card'
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${report.color} text-white mb-3`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold">{t(`reports.${report.key}Title`)}</h3>
              <p className="text-xs text-muted-foreground mt-1">{t(`reports.${report.key}Desc`)}</p>
            </motion.button>
          )
        })}
      </div>

      {/* Report Preview */}
      <motion.div key={selected} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t(`reports.${selected}Title`)}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm"><Calendar className="h-4 w-4 me-1" />{t('reports.dateRange')}</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={accountingData.monthlyRevenue}>
                  <defs>
                    <linearGradient id="reportGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}K`} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#reportGrad)" />
                  <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2.5} fill="rgba(239,68,68,0.1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
