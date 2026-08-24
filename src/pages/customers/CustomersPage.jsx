import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Users, Plus, Search, Phone, Mail, MapPin, ShoppingBag, Ruler, Eye, Edit, Trash2, QrCode, Filter, Grid, List, Building2 } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { DataTable } from '@/components/common/DataTable'
import { EmptyState } from '@/components/common/States'
import { CustomerForm } from '@/components/forms/CustomerForm'
import { MeasurementUpdateForm } from '@/components/forms/MeasurementUpdateForm'
import { CustomerDetailsModal } from '@/components/common/CustomerDetailsModal'
import { CustomerQrModal } from '@/components/common/CustomerQrModal'
import { useBranchScope } from '@/hooks/useBranchScope'
import { customers as seedCustomers, orders as seedOrders, measurements as seedMeasurements, branches } from '@/data/mockData'
import { useAuth } from '@/context/AuthContext'

export function CustomersPage() {
  const { t } = useTranslation()
  const { scoped, branchId } = useBranchScope()
  const { isAdmin } = useAuth()

  const [customers, setCustomers] = useState(seedCustomers)
  const [measurements, setMeasurements] = useState(seedMeasurements)
  const [view, setView] = useState('table')
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [detailsCustomer, setDetailsCustomer] = useState(null)
  const [qrCustomer, setQrCustomer] = useState(null)
  const [updateMeasurementFor, setUpdateMeasurementFor] = useState(null)

  const visibleCustomers = useMemo(() => scoped(customers), [customers, scoped])

  const filteredCustomers = visibleCustomers.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  )

  const getLatestMeasurement = (customerId) =>
    measurements
      .filter((m) => m.customerId === customerId)
      .sort((a, b) => (a.date < b.date ? 1 : -1))[0]

  const getBranchName = (id) =>
    branches.find((b) => b.id === id)?.name || '—'

  const handleSaveCustomer = (data) => {
    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === editingCustomer.id ? { ...c, ...data } : c))
      )
    } else {
      setCustomers((prev) => [
        ...prev,
        {
          ...data,
          id: Date.now(),
          totalOrders: 0,
          lastVisit: new Date().toISOString().slice(0, 10),
          balance: 0,
          branchId: data.branchId ?? branchId ?? null,
        },
      ])
    }
    setEditingCustomer(null)
  }

  const handleSaveMeasurement = (data) => {
    const { measuredBy, date, units, notes, ...body } = data
    setMeasurements((prev) => {
      const latest = getLatestMeasurement(updateMeasurementFor.id)
      if (latest) {
        return prev.map((m) =>
          m.id === latest.id
            ? { ...m, measuredBy, date, units, notes, data: { ...latest.data, ...body } }
            : m
        )
      }
      return [
        ...prev,
        {
          id: Date.now(),
          customerId: updateMeasurementFor.id,
          branchId: branchId || null,
          measuredBy,
          date,
          units,
          notes: notes || '',
          data: body,
        },
      ]
    })
    setUpdateMeasurementFor(null)
  }

  const openAdd = () => {
    setEditingCustomer(null)
    setFormOpen(true)
  }

  const openEdit = (customer) => {
    setEditingCustomer(customer)
    setFormOpen(true)
  }

  const columns = [
    ...(isAdmin ? [{
      key: 'branchId',
      label: t('forms.branch'),
      render: (val) => (
        <Badge variant="outline" className="text-xs">
          <Building2 className="h-3 w-3 me-1" />
          {getBranchName(val)}
        </Badge>
      ),
    }] : []),
    { key: 'name', label: t('customers.name'), render: (val, row) => (
      <div className="flex items-center gap-3">
        <Avatar alt={val} size="sm" />
        <div>
          <p className="font-medium">{val}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      </div>
    )},
    { key: 'phone', label: t('customers.phone'), render: (val) => (
      <div className="flex items-center gap-1.5 text-sm"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{val}</div>
    )},
    { key: 'address', label: t('customers.address'), render: (val) => (
      <div className="flex items-center gap-1.5 text-sm"><MapPin className="h-3.5 w-3.5 text-muted-foreground" />{val}</div>
    )},
    { key: 'totalOrders', label: t('customers.totalOrders'), render: (val) => (
      <Badge variant="info">{val} {t('orders.title')}</Badge>
    )},
    { key: 'balance', label: t('customers.balance'), render: (val) => (
      <span className={val > 0 ? 'text-amber-600 font-medium' : 'text-emerald-600 font-medium'}>
        PKR {val.toLocaleString()}
      </span>
    )},
    { key: 'lastVisit', label: t('customers.lastVisit') },
    { key: 'actions', label: t('common.actions'), sortable: false, render: (_, row) => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" onClick={() => setDetailsCustomer(row)}><Eye className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon-sm" onClick={() => openEdit(row)}><Edit className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon-sm" onClick={() => setUpdateMeasurementFor(row)}><Ruler className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon-sm" onClick={() => setQrCustomer(row)}><QrCode className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon-sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('customers.title')}
        subtitle={t('customers.subtitle')}
        icon={Users}
        breadcrumbs={[t('nav.dashboard'), t('nav.customers')]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setView(view === 'table' ? 'grid' : 'table')}>
              {view === 'table' ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
            </Button>
            <Button onClick={openAdd}><Plus className="h-4 w-4" />{t('customers.addCustomer')}</Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: t('customers.summaryTotal'), value: visibleCustomers.length, color: 'text-primary' },
          { label: t('customers.summaryBalance'), value: visibleCustomers.filter(c => c.balance > 0).length, color: 'text-amber-600' },
          { label: t('customers.summaryActive'), value: visibleCustomers.filter((c) => new Date(c.lastVisit).getMonth() === new Date().getMonth()).length, color: 'text-emerald-600' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {view === 'table' ? (
        <DataTable columns={columns} data={filteredCustomers} searchPlaceholder={t('customers.search')} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCustomers.map((customer, i) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setDetailsCustomer(customer)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar alt={customer.name} size="lg" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">{customer.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{customer.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" /> {customer.phone}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {customer.address}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ShoppingBag className="h-3.5 w-3.5" /> {customer.totalOrders} {t('orders.title')}
                    </div>
                    {isAdmin && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5" /> {getBranchName(customer.branchId)}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{t('customers.lastVisit')}: {customer.lastVisit}</span>
                    {customer.balance > 0 && <Badge variant="warning">PKR {customer.balance.toLocaleString()}</Badge>}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <CustomerForm
        open={formOpen}
        onOpenChange={setFormOpen}
        customer={editingCustomer}
        onSave={handleSaveCustomer}
      />

      <CustomerDetailsModal
        open={Boolean(detailsCustomer)}
        onOpenChange={(open) => { if (!open) setDetailsCustomer(null) }}
        customer={detailsCustomer}
        orders={seedOrders}
        measurements={measurements}
        onUpdateMeasurement={(customer) => {
          setDetailsCustomer(null)
          setUpdateMeasurementFor(customer)
        }}
      />

      <CustomerQrModal
        open={Boolean(qrCustomer)}
        onOpenChange={(open) => { if (!open) setQrCustomer(null) }}
        customer={qrCustomer}
      />

      <MeasurementUpdateForm
        open={Boolean(updateMeasurementFor)}
        onOpenChange={(open) => { if (!open) setUpdateMeasurementFor(null) }}
        customer={updateMeasurementFor}
        latestMeasurement={updateMeasurementFor ? getLatestMeasurement(updateMeasurementFor.id) : undefined}
        onSave={handleSaveMeasurement}
      />
    </div>
  )
}
