import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Plus, Printer, Download, Eye,
  CheckCircle, Clock, AlertTriangle, Search,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { InvoiceForm } from '@/components/forms/InvoiceForm'
import { invoices, customers, orders } from '@/data/mockData'

const statusConfig = {
  paid: { variant: 'success', icon: CheckCircle },
  unpaid: { variant: 'warning', icon: Clock },
  overdue: { variant: 'destructive', icon: AlertTriangle },
}

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

function InvoicePreview({ invoice, customer, order, onClose }) {
  const { t } = useTranslation()

  return (
    <div className="max-w-2xl mx-auto bg-white text-gray-900 rounded-xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">TailorPro</h2>
                <p className="text-blue-200 text-sm">{t('invoices.tagline')}</p>
              </div>
            </div>
            <p className="text-blue-200 text-sm mt-3">{t('invoices.companyAddress')}</p>
            <p className="text-blue-200 text-sm">{t('invoices.companyContact')}</p>
          </div>
          <div className="text-end">
            <h3 className="text-3xl font-bold uppercase tracking-wider opacity-90">{t('invoices.invoiceLabel')}</h3>
            <p className="text-blue-200 text-sm mt-1">{invoice.id}</p>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8">
          <div>
            <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">{t('invoices.billTo')}</h4>
            <p className="text-lg font-semibold">{customer?.name || t('invoices.customer')}</p>
            <p className="text-sm text-gray-600">{customer?.email || ''}</p>
            <p className="text-sm text-gray-600">{customer?.phone || ''}</p>
            <p className="text-sm text-gray-600">{customer?.address || ''}</p>
          </div>
          <div className="text-start sm:text-end">
            <div className="space-y-2">
              <div>
                <span className="text-xs font-semibold uppercase text-gray-500">{t('invoices.invoiceDateLabel')} </span>
                <span className="text-sm font-medium">{invoice.date}</span>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase text-gray-500">{t('invoices.dueDateLabel')} </span>
                <span className="text-sm font-medium">{invoice.dueDate}</span>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase text-gray-500">{t('invoices.statusLabel')} </span>
                <Badge variant={statusConfig[invoice.status]?.variant || 'default'} className="ms-1">
                  {t(`invoices.${invoice.status}`)}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-start py-3 text-xs font-semibold uppercase text-gray-500">{t('invoices.description')}</th>
                <th className="text-end py-3 text-xs font-semibold uppercase text-gray-500">{t('invoices.amount')}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-4">
                  <p className="font-medium text-gray-900">{order?.type || t('invoices.tailoringService')}</p>
                  <p className="text-sm text-gray-500">
                    {t('invoices.orderReference', { orderId: invoice.orderId })}
                    {order?.notes && ` — ${order.notes}`}
                  </p>
                </td>
                <td className="py-4 text-end font-medium">
                  PKR {invoice.amount.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-72">
            <div className="flex justify-between py-2 text-sm">
              <span className="text-gray-500">{t('invoices.subtotal')}</span>
              <span className="font-medium">PKR {invoice.amount.toLocaleString()}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between py-2 text-sm">
                <span className="text-gray-500">{t('invoices.discount')}</span>
                <span className="font-medium text-red-600">-PKR {invoice.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between py-3 text-lg font-bold border-t-2 border-gray-200 mt-2">
              <span>{t('invoices.totalDue')}</span>
              <span>PKR {(invoice.amount - invoice.discount).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-500">
            <div>
              <h5 className="font-semibold text-gray-700 mb-1">{t('invoices.paymentTerms')}</h5>
              <p>{t('invoices.paymentTermsNote')}</p>
              <p>{t('invoices.paymentMethods')}</p>
            </div>
            <div className="text-start sm:text-end">
              <h5 className="font-semibold text-gray-700 mb-1">{t('invoices.thankYou')}</h5>
              <p>{t('invoices.thankYouNote')}</p>
              <p className="mt-1">{t('invoices.footerTagline')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function InvoicesPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [formOpen, setFormOpen] = useState(false)

  const enrichedInvoices = useMemo(() => {
    return invoices.map((inv) => ({
      ...inv,
      customer: customers.find((c) => c.id === inv.customerId),
      order: orders.find((o) => o.id === inv.orderId),
    }))
  }, [])

  const filteredInvoices = enrichedInvoices.filter((inv) => {
    const matchesSearch =
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      inv.orderId.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'all' || inv.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const summary = useMemo(() => ({
    total: invoices.reduce((s, i) => s + i.amount, 0),
    paid: invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0),
    unpaid: invoices.filter((i) => i.status === 'unpaid').reduce((s, i) => s + i.amount, 0),
    overdue: invoices.filter((i) => i.status === 'overdue').reduce((s, i) => s + i.amount, 0),
  }), [])

  const summaryCards = [
    { label: t('invoices.totalInvoiced', 'Total Invoiced'), value: summary.total, color: 'text-primary', icon: FileText },
    { label: t('invoices.paid', 'Paid'), value: summary.paid, color: 'text-emerald-600', icon: CheckCircle },
    { label: t('invoices.unpaid', 'Unpaid'), value: summary.unpaid, color: 'text-amber-600', icon: Clock },
    { label: t('invoices.overdue', 'Overdue'), value: summary.overdue, color: 'text-red-600', icon: AlertTriangle },
  ]

  const handlePrint = () => {
    window.print()
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageHeader
        title={t('invoices.title', 'Invoices')}
        subtitle={t('invoices.subtitle', 'Manage and track all invoices')}
        icon={FileText}
        breadcrumbs={[t('nav.dashboard'), t('nav.invoices', 'Invoices')]}
        actions={
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" />
            {t('invoices.newInvoice', 'New Invoice')}
          </Button>
        }
      />

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((stat, i) => (
          <Card key={i} className="hover:shadow-lg transition-all duration-300">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  PKR {(stat.value / 1000).toFixed(0)}K
                </p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-muted/50`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filter Bar */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('invoices.search', 'Search invoices...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-9"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'paid', 'unpaid', 'overdue'].map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(status)}
            >
              {status === 'all' ? t('invoices.all', 'All') : t(`invoices.${status}`, status.charAt(0).toUpperCase() + status.slice(1))}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Invoices Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t('invoices.invoiceList', 'Invoice List')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="h-10 text-start text-xs font-semibold uppercase text-muted-foreground">
                      {t('invoices.invoiceNo', 'Invoice #')}
                    </th>
                    <th className="h-10 text-start text-xs font-semibold uppercase text-muted-foreground">
                      {t('invoices.customer', 'Customer')}
                    </th>
                    <th className="h-10 text-start text-xs font-semibold uppercase text-muted-foreground">
                      {t('invoices.orderRef', 'Order Ref')}
                    </th>
                    <th className="h-10 text-start text-xs font-semibold uppercase text-muted-foreground">
                      {t('invoices.date', 'Date')}
                    </th>
                    <th className="h-10 text-start text-xs font-semibold uppercase text-muted-foreground">
                      {t('invoices.dueDate', 'Due Date')}
                    </th>
                    <th className="h-10 text-start text-xs font-semibold uppercase text-muted-foreground">
                      {t('invoices.status', 'Status')}
                    </th>
                    <th className="h-10 text-end text-xs font-semibold uppercase text-muted-foreground">
                      {t('invoices.amount', 'Amount')}
                    </th>
                    <th className="h-10 text-end text-xs font-semibold uppercase text-muted-foreground">
                      {t('invoices.actions', 'Actions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((inv, i) => {
                    const cfg = statusConfig[inv.status] || statusConfig.unpaid
                    return (
                      <motion.tr
                        key={inv.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="h-12 text-sm font-medium">{inv.id}</td>
                        <td className="h-12 text-sm">{inv.customer?.name || '—'}</td>
                        <td className="h-12 text-sm text-muted-foreground">{inv.orderId}</td>
                        <td className="h-12 text-sm text-muted-foreground">{inv.date}</td>
                        <td className="h-12 text-sm text-muted-foreground">{inv.dueDate}</td>
                        <td className="h-12">
                          <Badge variant={cfg.variant}>
                            <span className="flex items-center gap-1">
                              <cfg.icon className="h-3 w-3" />
                              {t(`invoices.${inv.status}`)}
                            </span>
                          </Badge>
                        </td>
                        <td className="h-12 text-sm text-end font-semibold">
                          PKR {(inv.amount - inv.discount).toLocaleString()}
                        </td>
                        <td className="h-12">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setSelectedInvoice(inv)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" onClick={handlePrint}>
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon-sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                  {filteredInvoices.length === 0 && (
                    <tr>
                      <td colSpan={8} className="h-24 text-center text-muted-foreground">
                        {t('invoices.noInvoices', 'No invoices found')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Invoice Preview Modal */}
      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-0 no-print">
            <div className="flex items-center justify-between">
              <DialogTitle>{t('invoices.preview', 'Invoice Preview')}</DialogTitle>
              <div className="flex gap-2">
                <Button size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4" />
                  {t('invoices.print', 'Print')}
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                  {t('invoices.download', 'Download')}
                </Button>
              </div>
            </div>
          </DialogHeader>
          {selectedInvoice && (
            <div className="p-6 pt-2">
              <InvoicePreview
                invoice={selectedInvoice}
                customer={selectedInvoice.customer}
                order={selectedInvoice.order}
                onClose={() => setSelectedInvoice(null)}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <InvoiceForm open={formOpen} onOpenChange={setFormOpen} />
    </motion.div>
  )
}
