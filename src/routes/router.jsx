import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { CustomersPage } from '@/pages/customers/CustomersPage'
import { MeasurementsPage } from '@/pages/measurements/MeasurementsPage'
import { OrdersPage } from '@/pages/orders/OrdersPage'
import { TailorsPage } from '@/pages/tailors/TailorsPage'
import { FabricInventoryPage } from '@/pages/inventory/FabricInventoryPage'
import { SuppliersPage } from '@/pages/suppliers/SuppliersPage'
import { AccountingPage } from '@/pages/accounting/AccountingPage'
import { InvoicesPage } from '@/pages/invoices/InvoicesPage'
import { ReportsPage } from '@/pages/reports/ReportsPage'
import { NotificationsPage } from '@/pages/notifications/NotificationsPage'
import { SearchPage } from '@/pages/search/SearchPage'
import { BranchesPage } from '@/pages/branches/BranchesPage'
import { ManagersPage } from '@/pages/managers/ManagersPage'
import { SettingsPage } from '@/pages/settings/SettingsPage'
import { BackupPage } from '@/pages/backup/BackupPage'
import { AuditLogsPage } from '@/pages/audit-logs/AuditLogsPage'
import { ProfilePage } from '@/pages/profile/ProfilePage'
import { CustomerTrackingPage } from '@/pages/customers/CustomerTrackingPage'
import { TailorWorkPage } from '@/pages/tailor/TailorWorkPage'

export const router = createBrowserRouter([
  {
    path: '/customer/:id',
    element: <CustomerTrackingPage />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'measurements', element: <MeasurementsPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'my-work', element: <TailorWorkPage /> },
      { path: 'tailors', element: <TailorsPage /> },
      { path: 'inventory', element: <FabricInventoryPage /> },
      { path: 'suppliers', element: <SuppliersPage /> },
      { path: 'accounting', element: <AccountingPage /> },
      { path: 'invoices', element: <InvoicesPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'branches', element: <BranchesPage /> },
      { path: 'managers', element: <ManagersPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'backup', element: <BackupPage /> },
      { path: 'audit-logs', element: <AuditLogsPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
])
