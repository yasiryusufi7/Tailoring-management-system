import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, Plus, Search, Filter, Grid, List, AlertTriangle, XCircle, CheckCircle, ArrowUpDown } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FabricForm } from '@/components/forms/FabricForm'
import { useBranchScope } from '@/hooks/useBranchScope'
import { fabricInventory as seedFabricInventory, suppliers as seedSuppliers } from '@/data/mockData'

export function FabricInventoryPage() {
  const { t } = useTranslation()
  const { scoped } = useBranchScope()
  const fabricInventory = scoped(seedFabricInventory)
  const suppliers = scoped(seedSuppliers)
  const [view, setView] = useState('table')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [formOpen, setFormOpen] = useState(false)

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find((s) => s.id === supplierId)
    return supplier ? supplier.name : 'Unknown'
  }

  const totalFabrics = fabricInventory.length
  const totalStockValue = fabricInventory.reduce((sum, f) => sum + f.quantity * f.price, 0)
  const lowStockCount = fabricInventory.filter((f) => f.status === 'lowStock').length
  const outOfStockCount = fabricInventory.filter((f) => f.status === 'outOfStock').length

  const filteredFabrics = useMemo(() => {
    return fabricInventory.filter((f) => {
      const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'all' || f.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  const summaryCards = [
    { label: t('inventory.totalFabrics', 'Total Fabrics'), value: totalFabrics, color: 'text-primary', bg: 'bg-primary/10', icon: Package },
    { label: t('inventory.stockValue', 'Total Stock Value'), value: `PKR ${totalStockValue.toLocaleString()}`, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: ArrowUpDown },
    { label: t('inventory.lowStock', 'Low Stock Items'), value: lowStockCount, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30', icon: AlertTriangle },
    { label: t('inventory.outOfStock', 'Out of Stock'), value: outOfStockCount, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', icon: XCircle },
  ]

  const statusBadge = (status) => {
    const map = {
      inStock: { label: t('inventory.inStock', 'In Stock'), variant: 'success' },
      lowStock: { label: t('inventory.lowStock', 'Low Stock'), variant: 'warning' },
      outOfStock: { label: t('inventory.outOfStock', 'Out of Stock'), variant: 'destructive' },
    }
    const s = map[status] || map.inStock
    return <Badge variant={s.variant}>{s.label}</Badge>
  }

  const stockProgress = (fabric) => {
    const max = Math.max(fabric.reorderLevel * 3, fabric.quantity, 1)
    const percent = Math.min((fabric.quantity / max) * 100, 100)
    const reorderPercent = Math.min((fabric.reorderLevel / max) * 100, 100)
    const barColor =
      fabric.status === 'outOfStock'
        ? 'bg-red-500'
        : fabric.status === 'lowStock'
        ? 'bg-amber-500'
        : 'bg-emerald-500'

    return (
      <div className="w-full">
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute start-0 top-0 h-full bg-border/60 rounded-full"
            style={{ width: `${reorderPercent}%` }}
          />
          <motion.div
            className={`absolute start-0 top-0 h-full rounded-full ${barColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-muted-foreground">{fabric.quantity} {fabric.unit}</span>
          <span className="text-[10px] text-muted-foreground">{t('inventory.reorder', 'Reorder')}: {fabric.reorderLevel}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('inventory.title', 'Fabric Inventory')}
        subtitle={t('inventory.subtitle', 'Manage and track your fabric stock levels')}
        icon={Package}
        breadcrumbs={[t('nav.dashboard', 'Dashboard'), t('nav.inventory', 'Inventory')]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setView(view === 'table' ? 'grid' : 'table')}>
              {view === 'table' ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
            </Button>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4" />
              {t('inventory.addFabric', 'Add Fabric')}
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((stat, i) => (
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

      {/* Search & Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('inventory.search', 'Search fabrics...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-9"
            />
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all', label: t('inventory.all', 'All') },
              { key: 'inStock', label: t('inventory.inStock', 'In Stock') },
              { key: 'lowStock', label: t('inventory.lowStock', 'Low Stock') },
              { key: 'outOfStock', label: t('inventory.outOfStock', 'Out of Stock') },
            ].map((f) => (
              <Button
                key={f.key}
                variant={statusFilter === f.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(f.key)}
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Table View */}
      <AnimatePresence mode="wait">
        {view === 'table' ? (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-start text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">{t('inventory.fabric', 'Fabric')}</th>
                        <th className="text-start text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">{t('inventory.color', 'Color')}</th>
                        <th className="text-start text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">{t('inventory.quantity', 'Quantity')}</th>
                        <th className="text-start text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">{t('inventory.price', 'Price')}</th>
                        <th className="text-start text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">{t('inventory.supplier', 'Supplier')}</th>
                        <th className="text-start text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">{t('inventory.reorderLevel', 'Reorder Level')}</th>
                        <th className="text-start text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">{t('inventory.status', 'Status')}</th>
                        <th className="text-start text-xs font-semibold text-muted-foreground uppercase tracking-wider p-4">{t('inventory.stockLevel', 'Stock Level')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFabrics.map((fabric, i) => (
                        <motion.tr
                          key={fabric.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="h-4 w-4 rounded-full ring-2 ring-border shadow-sm shrink-0"
                                style={{ backgroundColor: fabric.color }}
                              />
                              <span className="font-medium text-sm">{fabric.name}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-6 w-6 rounded-md ring-1 ring-border shadow-inner"
                                style={{ backgroundColor: fabric.color }}
                              />
                              <span className="text-xs text-muted-foreground font-mono">{fabric.color}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm font-medium">{fabric.quantity} {fabric.unit}</td>
                          <td className="p-4 text-sm">PKR {fabric.price.toLocaleString()}</td>
                          <td className="p-4 text-sm text-muted-foreground">{getSupplierName(fabric.supplierId)}</td>
                          <td className="p-4 text-sm text-muted-foreground">{fabric.reorderLevel} {fabric.unit}</td>
                          <td className="p-4">{statusBadge(fabric.status)}</td>
                          <td className="p-4 w-48">{stockProgress(fabric)}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredFabrics.length === 0 && (
                  <div className="p-12 text-center text-muted-foreground">
                    <Package className="h-10 w-10 mx-auto mb-3 opacity-40" />
                    <p className="font-medium">{t('inventory.noResults', 'No fabrics found')}</p>
                    <p className="text-sm mt-1">{t('inventory.noResultsHint', 'Try adjusting your search or filters')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredFabrics.map((fabric, i) => (
              <motion.div
                key={fabric.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300 group overflow-hidden">
                  {/* Color band */}
                  <div className="h-2 w-full" style={{ backgroundColor: fabric.color }} />
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="h-8 w-8 rounded-lg ring-2 ring-border shadow-sm flex-shrink-0"
                          style={{ backgroundColor: fabric.color }}
                        />
                        <div>
                          <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{fabric.name}</h3>
                          <p className="text-xs text-muted-foreground">{getSupplierName(fabric.supplierId)}</p>
                        </div>
                      </div>
                      {statusBadge(fabric.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-muted/30 rounded-lg p-2.5">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('inventory.quantity', 'Quantity')}</p>
                        <p className="text-sm font-bold mt-0.5">{fabric.quantity} {fabric.unit}</p>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-2.5">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('inventory.price', 'Price')}</p>
                        <p className="text-sm font-bold mt-0.5">PKR {fabric.price.toLocaleString()}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-muted-foreground">{t('inventory.reorderLevel', 'Reorder Level')}: {fabric.reorderLevel} {fabric.unit}</span>
                        <span className="text-xs font-semibold">{fabric.quantity > 0 ? Math.round((fabric.quantity / (fabric.reorderLevel * 2)) * 100) : 0}%</span>
                      </div>
                      {stockProgress(fabric)}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {filteredFabrics.length === 0 && (
              <div className="col-span-full p-12 text-center text-muted-foreground">
                <Package className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">{t('inventory.noResults', 'No fabrics found')}</p>
                <p className="text-sm mt-1">{t('inventory.noResultsHint', 'Try adjusting your search or filters')}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <FabricForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  )
}
