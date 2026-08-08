import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { useSidebar } from '@/context/SidebarContext'
import { cn } from '@/lib/utils'

export function AppLayout() {
  const { collapsed, mobileOpen, closeMobile } = useSidebar()
  const { i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'
  const mobileX = isRTL ? 280 : -280

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: mobileX }}
            animate={{ x: 0 }}
            exit={{ x: mobileX }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-y-0 start-0 z-50 lg:hidden"
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <div
        className={cn(
          'min-h-screen flex flex-col transition-[margin-inline-start] duration-300 ease-out',
          collapsed ? 'lg:ms-[72px]' : 'lg:ms-[260px]'
        )}
      >
        <Navbar />
        <main className="flex-1 p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
