import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Calculator, TrendingUp, TrendingDown, DollarSign,
  ArrowUpRight, ArrowDownRight, Wallet, PiggyBank,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { accountingData } from '@/data/mockData'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie,
} from 'recharts'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const expenseCategories = [
  { name: 'Fabric Cost', value: accountingData.fabricCost, color: '#3b82f6' },
  { name: 'Tailor Wages', value: accountingData.tailorWages, color: '#10b981' },
  { name: 'Rent', value: accountingData.rent, color: '#f59e0b' },
  { name: 'Utilities', value: accountingData.utilities, color: '#8b5cf6' },
]

export function AccountingPage() {
  const { t } = useTranslation()
  const [period, setPeriod] = useState('monthly')

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageHeader
        title={t('accounting.title', 'Accounting & Finance')}
        subtitle={t('accounting.subtitle', 'Track income, expenses, and profitability')}
        icon={Calculator}
        breadcrumbs={[t('nav.dashboard'), t('nav.accounting', 'Accounting')]}
        actions={
          <div className="flex items-center gap-2">
            {['weekly', 'monthly', 'yearly'].map((p) => (
              <Button
                key={p}
                variant={period === p ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPeriod(p)}
              >
                {t(`accounting.${p}`, p.charAt(0).toUpperCase() + p.slice(1))}
              </Button>
            ))}
          </div>
        }
      />

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('accounting.monthlyIncome', 'Monthly Income')}
          value={`PKR ${(accountingData.monthlyIncome / 1000).toFixed(0)}K`}
          change="+8.3% vs last month"
          changeType="positive"
          icon={TrendingUp}
          color="success"
          index={0}
        />
        <StatCard
          title={t('accounting.monthlyExpenses', 'Monthly Expenses')}
          value={`PKR ${(accountingData.monthlyExpenses / 1000).toFixed(0)}K`}
          change="+4.2% vs last month"
          changeType="negative"
          icon={TrendingDown}
          color="danger"
          index={1}
        />
        <StatCard
          title={t('accounting.netProfit', 'Net Profit')}
          value={`PKR ${(accountingData.monthlyProfit / 1000).toFixed(0)}K`}
          change="+12.5% vs last month"
          changeType="positive"
          icon={DollarSign}
          color="primary"
          index={2}
        />
        <StatCard
          title={t('accounting.balance', 'Balance')}
          value={`PKR ${((accountingData.monthlyIncome - accountingData.monthlyExpenses) / 1000).toFixed(0)}K`}
          change="Available funds"
          changeType="positive"
          icon={Wallet}
          color="purple"
          index={3}
        />
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue/Expenses Trend */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {t('accounting.revenueTrend', 'Revenue & Expenses Trend')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={accountingData.monthlyRevenue}>
                    <defs>
                      <linearGradient id="accountingRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="accountingExpenseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${v / 1000}K`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      }}
                      formatter={(value) => [`PKR ${value.toLocaleString()}`, '']}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name={t('accounting.revenue', 'Revenue')}
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fill="url(#accountingRevenueGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      name={t('accounting.expenses', 'Expenses')}
                      stroke="#ef4444"
                      strokeWidth={2.5}
                      fill="url(#accountingExpenseGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category-wise Expenses */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">
                {t('accounting.expenseBreakdown', 'Expense Breakdown')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      dataKey="value"
                      paddingAngle={3}
                    >
                      {expenseCategories.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                      }}
                      formatter={(value) => [`PKR ${value.toLocaleString()}`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-3">
                {expenseCategories.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-muted-foreground">{cat.name}</span>
                    </div>
                    <span className="font-medium">PKR {cat.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Expense Bar Chart */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t('accounting.categoryExpenses', 'Category-wise Expenses')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseCategories} barSize={48}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v / 1000}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                    }}
                    formatter={(value) => [`PKR ${value.toLocaleString()}`, '']}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {expenseCategories.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              {t('accounting.recentTransactions', 'Recent Transactions')}
            </CardTitle>
            <Button variant="ghost" size="sm">
              {t('accounting.viewAll', 'View All')}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="h-10 text-start text-xs font-semibold uppercase text-muted-foreground">
                      {t('accounting.date', 'Date')}
                    </th>
                    <th className="h-10 text-start text-xs font-semibold uppercase text-muted-foreground">
                      {t('accounting.description', 'Description')}
                    </th>
                    <th className="h-10 text-start text-xs font-semibold uppercase text-muted-foreground">
                      {t('accounting.category', 'Category')}
                    </th>
                    <th className="h-10 text-start text-xs font-semibold uppercase text-muted-foreground">
                      {t('accounting.type', 'Type')}
                    </th>
                    <th className="h-10 text-end text-xs font-semibold uppercase text-muted-foreground">
                      {t('accounting.amount', 'Amount')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {accountingData.recentTransactions.map((tx) => (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="h-12 text-sm text-muted-foreground">{tx.date}</td>
                      <td className="h-12 text-sm font-medium">{tx.description}</td>
                      <td className="h-12 text-sm">
                        <Badge variant="secondary">{tx.category}</Badge>
                      </td>
                      <td className="h-12 text-sm">
                        <Badge variant={tx.type === 'income' ? 'success' : 'destructive'}>
                          <span className="flex items-center gap-1">
                            {tx.type === 'income' ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                            {tx.type === 'income'
                              ? t('accounting.income', 'Income')
                              : t('accounting.expense', 'Expense')}
                          </span>
                        </Badge>
                      </td>
                      <td className={`h-12 text-sm text-end font-semibold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {tx.type === 'income' ? '+' : '-'}PKR {tx.amount.toLocaleString()}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
