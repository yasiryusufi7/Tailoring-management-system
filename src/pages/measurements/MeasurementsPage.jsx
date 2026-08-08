import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Ruler, Plus, User, Calendar, Clock, GitCompare, ChevronDown, ChevronUp, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, RotateCcw, Pencil } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { Avatar } from '@/components/ui/Avatar'
import { MeasurementForm } from '@/components/forms/MeasurementForm'
import { MeasurementUpdateForm } from '@/components/forms/MeasurementUpdateForm'
import { useBranchScope } from '@/hooks/useBranchScope'
import { measurements as seedMeasurements, customers as seedCustomers } from '@/data/mockData'

const measurementFields = [
  { key: 'neck', icon: '👔', color: 'from-blue-500 to-indigo-500' },
  { key: 'chest', icon: '💪', color: 'from-emerald-500 to-green-500' },
  { key: 'waist', icon: '📏', color: 'from-amber-500 to-orange-500' },
  { key: 'hip', icon: '📐', color: 'from-purple-500 to-violet-500' },
  { key: 'shoulder', icon: '🏋️', color: 'from-red-500 to-rose-500' },
  { key: 'sleeve', icon: '👕', color: 'from-cyan-500 to-blue-500' },
  { key: 'arm', icon: '💪', color: 'from-pink-500 to-rose-500' },
  { key: 'shirtLength', icon: '📏', color: 'from-teal-500 to-emerald-500' },
  { key: 'trouserLength', icon: '👖', color: 'from-indigo-500 to-blue-500' },
  { key: 'bottom', icon: '📐', color: 'from-amber-500 to-yellow-500' },
  { key: 'collar', icon: '👔', color: 'from-violet-500 to-purple-500' },
  { key: 'cuff', icon: '🖇️', color: 'from-rose-500 to-red-500' },
]

function MeasurementCard({ field, value, units, index }) {
  const { t } = useTranslation()
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.05, y: -2 }}
      className="relative overflow-hidden rounded-xl border bg-card p-4 hover:shadow-lg transition-all duration-300 cursor-default group"
    >
      <div className={`absolute top-0 end-0 w-16 h-16 bg-gradient-to-br ${field.color} opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity`} />
      <div className="flex items-center gap-3">
        <span className="text-2xl">{field.icon}</span>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            {t(`measurements.body.${field.key}`)}
          </p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold">{value}</span>
            <span className="text-xs text-muted-foreground">{units}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function MeasurementsPage() {
  const { t } = useTranslation()
  const { scoped } = useBranchScope()
  const customers = scoped(seedCustomers)
  const [measurements, setMeasurements] = useState(() => scoped(seedMeasurements))
  const [selectedMeasurement, setSelectedMeasurement] = useState(measurements[0])
  const [expandedHistoryId, setExpandedHistoryId] = useState(null)
  const [historySearch, setHistorySearch] = useState('')
  const [historyMeasuredBy, setHistoryMeasuredBy] = useState('all')
  const [historyCustomer, setHistoryCustomer] = useState('all')
  const [historyDateFrom, setHistoryDateFrom] = useState('')
  const [historyDateTo, setHistoryDateTo] = useState('')
  const [historySortField, setHistorySortField] = useState('date')
  const [historySortDir, setHistorySortDir] = useState('desc')
  const [comparisonSelected, setComparisonSelected] = useState([])
  const [formOpen, setFormOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [updateMeasurement, setUpdateMeasurement] = useState(null)

  const handleSaveMeasurement = (data) => {
    const { measuredBy, date, units, notes, ...body } = data
    const updated = {
      ...updateMeasurement,
      measuredBy,
      date,
      units,
      notes: notes || '',
      data: { ...updateMeasurement.data, ...body },
    }
    setMeasurements((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
    if (selectedMeasurement?.id === updated.id) setSelectedMeasurement(updated)
    setUpdateOpen(false)
  }

  const openUpdate = (m) => {
    setUpdateMeasurement(m)
    setUpdateOpen(true)
  }

  const getCustomerName = (id) => customers.find((c) => c.id === id)?.name || t('common.unknown')
  const getCustomer = (id) => customers.find((c) => c.id === id)

  const measuredByOptions = useMemo(() => {
    const names = [...new Set(measurements.map((m) => m.measuredBy))]
    return ['all', ...names]
  }, [measurements])

  const customerOptions = useMemo(() => {
    const ids = [...new Set(measurements.map((m) => m.customerId))]
    return ['all', ...ids.map((id) => ({ id, name: getCustomerName(id) }))]
  }, [measurements, getCustomerName])

  const historyMeasurements = useMemo(() => {
    let result = [...measurements]

    if (historySearch) {
      const q = historySearch.toLowerCase()
      result = result.filter((m) => {
        const name = getCustomerName(m.customerId).toLowerCase()
        return name.includes(q) || m.date.includes(q) || m.measuredBy.toLowerCase().includes(q)
      })
    }

    if (historyCustomer !== 'all') {
      result = result.filter((m) => m.customerId === Number(historyCustomer))
    }

    if (historyMeasuredBy !== 'all') {
      result = result.filter((m) => m.measuredBy === historyMeasuredBy)
    }

    if (historyDateFrom) {
      result = result.filter((m) => m.date >= historyDateFrom)
    }

    if (historyDateTo) {
      result = result.filter((m) => m.date <= historyDateTo)
    }

    result.sort((a, b) => {
      let aVal, bVal
      if (historySortField === 'date') {
        aVal = a.date
        bVal = b.date
      } else if (historySortField === 'customer') {
        aVal = getCustomerName(a.customerId)
        bVal = getCustomerName(b.customerId)
      } else if (historySortField === 'measuredBy') {
        aVal = a.measuredBy
        bVal = b.measuredBy
      } else {
        aVal = a.date
        bVal = b.date
      }
      if (aVal < bVal) return historySortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return historySortDir === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [historySearch, historyCustomer, historyMeasuredBy, historyDateFrom, historyDateTo, historySortField, historySortDir, measurements])

  const toggleComparison = (id) => {
    setComparisonSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev
    )
  }

  const comparisonMeasurements = useMemo(() => {
    if (comparisonSelected.length === 0) return measurements
    return measurements.filter((m) => comparisonSelected.includes(m.id))
  }, [comparisonSelected, measurements])

  const hasActiveFilters = historySearch || historyMeasuredBy !== 'all' || historyCustomer !== 'all' || historyDateFrom || historyDateTo

  const resetHistoryFilters = () => {
    setHistorySearch('')
    setHistoryMeasuredBy('all')
    setHistoryCustomer('all')
    setHistoryDateFrom('')
    setHistoryDateTo('')
    setHistorySortField('date')
    setHistorySortDir('desc')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('measurements.title')}
        subtitle={t('measurements.subtitle')}
        icon={Ruler}
        breadcrumbs={[t('nav.dashboard'), t('nav.measurements')]}
        actions={<Button onClick={() => setFormOpen(true)}><Plus className="h-4 w-4" />{t('measurements.addMeasurement')}</Button>}
      />

      <Tabs defaultValue="current">
        <TabsList>
          <TabsTrigger value="current">{t('measurements.current')}</TabsTrigger>
          <TabsTrigger value="history">{t('measurements.historyTab')}</TabsTrigger>
          <TabsTrigger value="comparison">{t('measurements.comparison')}</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          {/* Customer Selection */}
          <div className="flex flex-wrap gap-3">
            {measurements.map((m) => (
              <motion.button
                key={m.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMeasurement(m)}
                className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 transition-all duration-200 ${
                  selectedMeasurement.id === m.id
                    ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20'
                    : 'hover:border-primary/30 hover:bg-muted/50'
                }`}
              >
                <Avatar alt={getCustomerName(m.customerId)} size="sm" />
                <div className="text-start">
                  <p className="text-sm font-medium">{getCustomerName(m.customerId)}</p>
                  <p className="text-xs text-muted-foreground">{m.date}</p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Measurement Details */}
          {selectedMeasurement && (
            <motion.div key={selectedMeasurement.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {/* Info Bar */}
              <Card>
                <CardContent className="p-4 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{getCustomerName(selectedMeasurement.customerId)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{selectedMeasurement.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{t('measurements.by', { name: selectedMeasurement.measuredBy })}</span>
                  </div>
                  <Badge variant="info">{selectedMeasurement.units}</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ms-auto"
                    onClick={() => openUpdate(selectedMeasurement)}
                  >
                    <Pencil className="h-4 w-4" />
                    {t('measurements.updateMeasurement')}
                  </Button>
                </CardContent>
              </Card>

              {/* Body Diagram Header */}
              <div className="text-center">
                <h3 className="text-lg font-semibold">{t('measurements.bodyTitle')}</h3>
                <p className="text-sm text-muted-foreground">{t('measurements.allIn', { units: selectedMeasurement.units })}</p>
              </div>

              {/* Measurement Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {measurementFields.map((field, i) => (
                  <MeasurementCard
                    key={field.key}
                    field={field}
                    value={selectedMeasurement.data[field.key] || '—'}
                    units={selectedMeasurement.units}
                    index={i}
                  />
                ))}
              </div>

              {/* Notes */}
              {selectedMeasurement.notes && (
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium mb-1">{t('measurements.notes')}</p>
                    <p className="text-sm text-muted-foreground">{selectedMeasurement.notes}</p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {/* History Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Row 1: Search + Customer + Measured By */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('measurements.search')}
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      className="ps-9"
                    />
                  </div>

                  <select
                    value={historyCustomer}
                    onChange={(e) => setHistoryCustomer(e.target.value)}
                    className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
                  >
                    <option value="all">{t('measurements.allCustomers')}</option>
                    {customerOptions.filter(c => c !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  <select
                    value={historyMeasuredBy}
                    onChange={(e) => setHistoryMeasuredBy(e.target.value)}
                    className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
                  >
                    {measuredByOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt === 'all' ? t('measurements.allMeasuredBy') : opt}</option>
                    ))}
                  </select>

                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={resetHistoryFilters}>
                      <RotateCcw className="h-3.5 w-3.5 me-1" /> {t('measurements.reset')}
                    </Button>
                  )}
                </div>

                {/* Row 2: Date Range + Sort */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground shrink-0">{t('measurements.from')}</span>
                    <input
                      type="date"
                      value={historyDateFrom}
                      onChange={(e) => setHistoryDateFrom(e.target.value)}
                      className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground shrink-0">{t('measurements.to')}</span>
                    <input
                      type="date"
                      value={historyDateTo}
                      onChange={(e) => setHistoryDateTo(e.target.value)}
                      className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                    />
                  </div>

                  <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

                  <div className="flex items-center gap-1 border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setHistorySortField('date')}
                      className={`px-3 h-9 text-xs font-medium transition-colors ${historySortField === 'date' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    >
                      {t('measurements.date')}
                    </button>
                    <button
                      onClick={() => setHistorySortField('customer')}
                      className={`px-3 h-9 text-xs font-medium transition-colors ${historySortField === 'customer' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    >
                      {t('measurements.customer')}
                    </button>
                    <button
                      onClick={() => setHistorySortField('measuredBy')}
                      className={`px-3 h-9 text-xs font-medium transition-colors ${historySortField === 'measuredBy' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    >
                      {t('measurements.measuredBy')}
                    </button>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setHistorySortDir(historySortDir === 'asc' ? 'desc' : 'asc')}
                  >
                    {historySortDir === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-sm text-muted-foreground">{t('measurements.found', { count: historyMeasurements.length })}</p>

          {historyMeasurements.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                <p className="text-muted-foreground">{t('measurements.noResults')}</p>
                <Button variant="ghost" size="sm" className="mt-2" onClick={resetHistoryFilters}>{t('measurements.clearFilters')}</Button>
              </CardContent>
            </Card>
          ) : (
            historyMeasurements.map((m, i) => {
              const isExpanded = expandedHistoryId === m.id
              const customer = getCustomer(m.customerId)
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className={`hover:shadow-md transition-all duration-300 ${isExpanded ? 'border-primary/30' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar alt={getCustomerName(m.customerId)} size="sm" />
                          <div>
                            <p className="font-medium">{getCustomerName(m.customerId)}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{t('measurements.by', { name: m.measuredBy })}</span>
                              <span>·</span>
                              <span>{m.units}</span>
                              {customer?.phone && (
                                <>
                                  <span>·</span>
                                  <span>{customer.phone}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{m.date}</Badge>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openUpdate(m)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setExpandedHistoryId(isExpanded ? null : m.id)}
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            {/* Customer full details */}
                            {customer && (
                              <div className="mt-4 p-3 rounded-xl bg-muted/30 border">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t('customers.details')}</p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                                  <div>
                                    <p className="text-xs text-muted-foreground">{t('customers.name')}</p>
                                    <p className="font-medium">{customer.name}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">{t('customers.phone')}</p>
                                    <p className="font-medium">{customer.phone}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">{t('customers.email')}</p>
                                    <p className="font-medium">{customer.email}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">{t('customers.address')}</p>
                                    <p className="font-medium">{customer.address}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">{t('customers.totalOrders')}</p>
                                    <p className="font-medium">{customer.totalOrders}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">{t('customers.balance')}</p>
                                    <p className="font-medium">PKR {customer.balance.toLocaleString()}</p>
                                  </div>
                                  <div className="sm:col-span-2">
                                    <p className="text-xs text-muted-foreground">{t('measurements.notes')}</p>
                                    <p className="font-medium">{customer.notes || '—'}</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Measurement values */}
                            <div className="mt-3">
                              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t('measurements.title')}</p>
                              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                                {measurementFields.map((field) => (
                                  <div key={field.key} className="text-center p-2 rounded-lg bg-muted/50">
                                    <p className="text-[10px] uppercase text-muted-foreground">{field.key}</p>
                                    <p className="text-sm font-bold">{m.data[field.key]}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {m.notes && (
                              <div className="mt-3">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{t('measurements.notes')}</p>
                                <p className="text-sm text-muted-foreground">{m.notes}</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          {/* Customer picker for comparison */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium">{t('measurements.compare')}</span>
                {measurements.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => toggleComparison(m.id)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-all ${
                      comparisonSelected.includes(m.id)
                        ? 'border-primary bg-primary/10 text-primary font-medium'
                        : comparisonSelected.length >= 4
                        ? 'opacity-40 cursor-not-allowed'
                        : 'hover:border-primary/40 hover:bg-muted/50'
                    }`}
                    disabled={comparisonSelected.length >= 4 && !comparisonSelected.includes(m.id)}
                  >
                    <Avatar alt={getCustomerName(m.customerId)} size="xs" />
                    {getCustomerName(m.customerId)}
                  </button>
                ))}
                {comparisonSelected.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setComparisonSelected([])}>
                    <RotateCcw className="h-3.5 w-3.5 me-1" /> {t('measurements.clear')}
                  </Button>
                )}
                <Badge variant="secondary" className="ms-auto text-xs">
                  {comparisonSelected.length === 0 ? t('measurements.showingAll') : t('measurements.selected', { count: comparisonSelected.length })}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="h-10 text-start text-xs font-semibold uppercase text-muted-foreground">{t('measurements.measurement')}</th>
                      {comparisonMeasurements.map((m) => (
                        <th key={m.id} className="h-10 text-center text-xs font-semibold uppercase text-muted-foreground">
                          <div className="flex flex-col items-center">
                            <span>{getCustomerName(m.customerId)}</span>
                            <span className="font-normal normal-case">{m.date}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {measurementFields.map((field, i) => (
                      <tr key={field.key} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="h-10 text-sm font-medium capitalize">{field.key}</td>
                        {comparisonMeasurements.map((m) => (
                          <td key={m.id} className="h-10 text-center text-sm font-medium">
                            {m.data[field.key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <MeasurementForm open={formOpen} onOpenChange={setFormOpen} />

      <MeasurementUpdateForm
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        customer={updateMeasurement ? getCustomer(updateMeasurement.customerId) : undefined}
        latestMeasurement={updateMeasurement}
        onSave={handleSaveMeasurement}
      />
    </div>
  )
}
