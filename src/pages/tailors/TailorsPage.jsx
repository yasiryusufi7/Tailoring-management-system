import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Scissors, Plus, Star, DollarSign, Clock, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { TailorForm } from '@/components/forms/TailorForm'
import { useBranchScope } from '@/hooks/useBranchScope'
import { tailors as seedTailors } from '@/data/mockData'

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe']

export function TailorsPage() {
  const { t } = useTranslation()
  const { scoped } = useBranchScope()
  const tailors = scoped(seedTailors)
  const [hoveredId, setHoveredId] = useState(null)
  const [formOpen, setFormOpen] = useState(false)

  const totalTailors = tailors.length
  const avgDailyProduction = (tailors.reduce((sum, tailor) => sum + tailor.dailyProduction, 0) / tailors.length).toFixed(1)
  const totalWages = tailors.reduce((sum, tailor) => sum + tailor.monthlyWage, 0)
  const totalPending = tailors.reduce((sum, tailor) => sum + tailor.pendingPayment, 0)

  const chartData = tailors.map((tailor) => ({
    name: tailor.name.split(' ')[0],
    pieces: tailor.completed,
    inProgress: tailor.inProgress,
  }))

  const stats = [
    { label: t('tailors.totalTailors', 'Total Tailors'), value: totalTailors, color: 'text-primary', icon: Scissors, bg: 'bg-primary/10' },
    { label: t('tailors.avgProduction', 'Avg Daily Production'), value: `${avgDailyProduction} pcs`, color: 'text-violet-600', icon: TrendingUp, bg: 'bg-violet-100 dark:bg-violet-900/30' },
    { label: t('tailors.totalWages', 'Total Monthly Wages'), value: `PKR ${totalWages.toLocaleString()}`, color: 'text-emerald-600', icon: DollarSign, bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { label: t('tailors.pendingPayments', 'Total Pending'), value: `PKR ${totalPending.toLocaleString()}`, color: 'text-amber-600', icon: Clock, bg: 'bg-amber-100 dark:bg-amber-900/30' },
  ]

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const hasHalf = rating % 1 >= 0.5
    const stars = []
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)
      } else if (i === fullStars && hasHalf) {
        stars.push(
          <span key={i} className="relative inline-block h-3.5 w-3.5">
            <Star className="absolute inset-0 h-3.5 w-3.5 text-gray-200 dark:text-gray-700" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            </span>
          </span>
        )
      } else {
        stars.push(<Star key={i} className="h-3.5 w-3.5 text-gray-200 dark:text-gray-700" />)
      }
    }
    return stars
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('tailors.title', 'Tailors')}
        subtitle={t('tailors.subtitle', 'Manage tailor workforce and track production')}
        icon={Scissors}
        breadcrumbs={[t('nav.dashboard', 'Dashboard'), t('nav.tailors', 'Tailors')]}
        actions={
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" />
            {t('tailors.addTailor', 'Add Tailor')}
          </Button>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 end-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full group-hover:from-primary/10 transition-all duration-300" />
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className={`text-2xl font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Productivity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t('tailors.productivity', 'Tailor Productivity Comparison')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                  />
                  <Bar dataKey="pieces" radius={[6, 6, 0, 0]} name="Completed">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                  <Bar dataKey="inProgress" radius={[6, 6, 0, 0]} fill="#fbbf24" name="In Progress" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tailor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {tailors.map((tailor, i) => {
          const progressPercent = Math.min((tailor.completed / (tailor.completed + 10)) * 100, 100)
          return (
            <motion.div
              key={tailor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
              onMouseEnter={() => setHoveredId(tailor.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Card className={`transition-all duration-300 ${hoveredId === tailor.id ? 'shadow-xl scale-[1.02] border-primary/20' : 'hover:shadow-lg'}`}>
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="p-5 pb-4">
                    <div className="flex items-start gap-3.5">
                      <Avatar alt={tailor.name} size="lg" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-base truncate">{tailor.name}</h3>
                          <Badge variant="info" className="text-[10px] shrink-0">{tailor.specialization}</Badge>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {renderStars(tailor.rating)}
                          <span className="text-xs font-medium text-muted-foreground ms-1">{tailor.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-px bg-border/50 border-t">
                    <div className="bg-background p-3 text-center">
                      <p className="text-xs text-muted-foreground">{t('tailors.dailyProduction', 'Daily')}</p>
                      <p className="text-lg font-bold text-primary mt-0.5">{tailor.dailyProduction}</p>
                      <p className="text-[10px] text-muted-foreground">{t('tailors.pieces', 'pieces')}</p>
                    </div>
                    <div className="bg-background p-3 text-center border-x border-border/50">
                      <p className="text-xs text-muted-foreground">{t('tailors.pieceRate', 'Rate')}</p>
                      <p className="text-lg font-bold text-violet-600 mt-0.5">{tailor.pieceRate}</p>
                      <p className="text-[10px] text-muted-foreground">PKR/pc</p>
                    </div>
                    <div className="bg-background p-3 text-center">
                      <p className="text-xs text-muted-foreground">{t('tailors.dailyWage', 'Daily Wage')}</p>
                      <p className="text-lg font-bold text-emerald-600 mt-0.5">{tailor.dailyWage.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">PKR</p>
                    </div>
                  </div>

                  {/* Bottom Details */}
                  <div className="p-5 pt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t('tailors.monthlyWage', 'Monthly Wage')}</span>
                      <span className="font-semibold">PKR {tailor.monthlyWage.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t('tailors.pendingPayment', 'Pending Payment')}</span>
                      {tailor.pendingPayment > 0 ? (
                        <Badge variant="warning" className="text-xs">PKR {tailor.pendingPayment.toLocaleString()}</Badge>
                      ) : (
                        <Badge variant="success" className="text-xs">{t('tailors.paid', 'Paid')}</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t('tailors.completed', 'Completed')}</span>
                      <span className="font-medium">{tailor.completed} {t('tailors.pieces', 'pieces')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t('tailors.inProgress', 'In Progress')}</span>
                      <Badge variant="secondary" className="text-xs">{tailor.inProgress} {t('tailors.pieces', 'pieces')}</Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-muted-foreground">{t('tailors.monthlyProgress', 'Monthly Progress')}</span>
                        <span className="text-xs font-semibold text-primary">{Math.round(progressPercent)}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <TailorForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  )
}
