import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Truck, Plus, Phone, Mail, MapPin, DollarSign, ExternalLink } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { SupplierForm } from '@/components/forms/SupplierForm'
import { useBranchScope } from '@/hooks/useBranchScope'
import { suppliers as seedSuppliers } from '@/data/mockData'

export function SuppliersPage() {
  const { t } = useTranslation()
  const { scoped } = useBranchScope()
  const suppliers = scoped(seedSuppliers)
  const [formOpen, setFormOpen] = useState(false)

  const totalSuppliers = suppliers.length
  const totalOutstanding = suppliers.reduce((sum, s) => sum + s.outstandingBalance, 0)
  const totalPurchases = suppliers.reduce((sum, s) => sum + s.totalPurchases, 0)

  const stats = [
    { label: t('suppliers.totalSuppliers', 'Total Suppliers'), value: totalSuppliers, color: 'text-primary', bg: 'bg-primary/10', icon: Truck },
    { label: t('suppliers.totalOutstanding', 'Total Outstanding'), value: `PKR ${totalOutstanding.toLocaleString()}`, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30', icon: DollarSign },
    { label: t('suppliers.totalPurchases', 'Total Purchases'), value: `PKR ${totalPurchases.toLocaleString()}`, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: ExternalLink },
  ]

  const paymentStatus = (supplier) => {
    if (supplier.outstandingBalance === 0) {
      return <Badge variant="success">{t('suppliers.paid', 'Fully Paid')}</Badge>
    }
    if (supplier.outstandingBalance > 30000) {
      return <Badge variant="destructive">{t('suppliers.overdue', 'Overdue')}</Badge>
    }
    return <Badge variant="warning">{t('suppliers.pending', 'Pending')}</Badge>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('suppliers.title', 'Suppliers')}
        subtitle={t('suppliers.subtitle', 'Manage fabric suppliers and purchase tracking')}
        icon={Truck}
        breadcrumbs={[t('nav.dashboard', 'Dashboard'), t('nav.suppliers', 'Suppliers')]}
        actions={
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" />
            {t('suppliers.addSupplier', 'Add Supplier')}
          </Button>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
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

      {/* Supplier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {suppliers.map((supplier, i) => (
          <motion.div
            key={supplier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
          >
            <Card className="hover:shadow-xl transition-all duration-300 group h-full">
              <CardContent className="p-0">
                {/* Header band */}
                <div className={`h-1.5 w-full ${supplier.outstandingBalance > 0 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-emerald-400 to-emerald-500'}`} />

                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300">
                        <Truck className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base group-hover:text-primary transition-colors">{supplier.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {supplier.address}
                        </p>
                      </div>
                    </div>
                    {paymentStatus(supplier)}
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      <Phone className="h-4 w-4 shrink-0" />
                      <span>{supplier.phone}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      <Mail className="h-4 w-4 shrink-0" />
                      <span className="truncate">{supplier.email}</span>
                    </div>
                  </div>

                  {/* Financial Summary */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-muted/30 rounded-lg p-3">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{t('suppliers.outstanding', 'Outstanding')}</p>
                      <p className={`text-lg font-bold ${supplier.outstandingBalance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        PKR {supplier.outstandingBalance.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{t('suppliers.totalPurchases', 'Total Purchases')}</p>
                      <p className="text-lg font-bold text-primary">PKR {supplier.totalPurchases.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Progress bar for payment */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-muted-foreground">{t('suppliers.paidProgress', 'Payment Progress')}</span>
                      <span className="text-xs font-semibold text-primary">
                        {Math.round(((supplier.totalPurchases - supplier.outstandingBalance) / supplier.totalPurchases) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${supplier.outstandingBalance > 0 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-emerald-400 to-emerald-500'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${((supplier.totalPurchases - supplier.outstandingBalance) / supplier.totalPurchases) * 100}%` }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <SupplierForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  )
}
