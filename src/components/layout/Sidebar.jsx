import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, Ruler, ShoppingBag, Scissors, Package,
  Truck, Calculator, FileText, BarChart3, Bell, Building2,
  Settings, Database, ClipboardList, LogOut, ChevronLeft, ScissorsIcon, UserCog
} from 'lucide-react'
import { useSidebar } from '@/context/SidebarContext'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/Tooltip'

export const menuItems = [
  { key: 'dashboard', path: '/', icon: LayoutDashboard, roles: ['administrator', 'manager'] },
  { key: 'myWork', path: '/my-work', icon: Scissors, roles: ['tailor'] },
  { key: 'customers', path: '/customers', icon: Users, roles: ['administrator', 'manager'] },
  { key: 'measurements', path: '/measurements', icon: Ruler, roles: ['administrator', 'manager'] },
  { key: 'orders', path: '/orders', icon: ShoppingBag, roles: ['administrator', 'manager'] },
  { key: 'tailors', path: '/tailors', icon: ScissorsIcon, roles: ['administrator', 'manager'] },
  { key: 'inventory', path: '/inventory', icon: Package, roles: ['administrator', 'manager'] },
  { key: 'suppliers', path: '/suppliers', icon: Truck, roles: ['administrator', 'manager'] },
  { type: 'divider' },
  { key: 'accounting', path: '/accounting', icon: Calculator, roles: ['administrator'] },
  { key: 'invoices', path: '/invoices', icon: FileText, roles: ['administrator'] },
  { key: 'reports', path: '/reports', icon: BarChart3, roles: ['administrator'] },
  { key: 'branches', path: '/branches', icon: Building2, roles: ['administrator'] },
  { key: 'managers', path: '/managers', icon: UserCog, roles: ['administrator'] },
  { type: 'divider' },
  { key: 'notifications', path: '/notifications', icon: Bell, roles: ['administrator', 'manager', 'tailor'] },
  { type: 'divider' },
  { key: 'settings', path: '/settings', icon: Settings, roles: ['administrator', 'manager', 'tailor'] },
  { key: 'backup', path: '/backup', icon: Database, roles: ['administrator'] },
  { key: 'auditLogs', path: '/audit-logs', icon: ClipboardList, roles: ['administrator'] },
]

export function Sidebar() {
  const { t } = useTranslation()
  const { collapsed, toggle } = useSidebar()
  const { currentUser } = useAuth()
  const location = useLocation()

  const visibleItems = menuItems.filter((item) =>
    item.type === 'divider' || item.roles.includes(currentUser.role)
  )

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-0 start-0 z-40 h-screen bg-sidebar border-e border-sidebar-border flex flex-col"
      >
        {/* Logo */}
        <div className={cn('flex h-16 items-center border-b border-sidebar-border px-4', collapsed && 'justify-center')}>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shrink-0">
              <ScissorsIcon className="h-5 w-5" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-base font-bold tracking-tight">TailorPro</h1>
                  <p className="text-[10px] text-muted-foreground -mt-0.5">{t('common.erpSystem')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 min-h-0 overflow-y-auto lg:overflow-visible py-3 px-2 scrollbar-thin">
          <ul className="space-y-0.5">
            {visibleItems.map((item, i) => {
              if (item.type === 'divider') {
                return <li key={`div-${i}`} className="my-2 mx-3 border-t border-sidebar-border" />
              }
              const Icon = item.icon
              const isActive = location.pathname === item.path

              const navLink = (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-accent text-primary shadow-sm'
                      : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50',
                    collapsed && 'justify-center px-0'
                  )}
                >
                  <Icon className={cn('h-5 w-5 shrink-0', isActive && 'text-primary')} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {t(`nav.${item.key}`)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              )

              return (
                <li key={item.path}>
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                      <TooltipContent side="right">{t(`nav.${item.key}`)}</TooltipContent>
                    </Tooltip>
                  ) : navLink}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="border-t border-sidebar-border p-2">
          <button
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200',
              collapsed && 'justify-center px-0'
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{t('nav.logout')}</span>}
          </button>
        </div>

        {/* Collapse Button */}
        <button
          onClick={toggle}
          className={cn(
            'hidden lg:flex absolute -end-3 top-20 h-6 w-6 items-center justify-center rounded-full border bg-background shadow-md hover:shadow-lg transition-all duration-200 z-50'
          )}
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </motion.div>
        </button>
      </motion.aside>
    </TooltipProvider>
  )
}
