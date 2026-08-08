import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Moon, Sun, Globe, Bell, Menu, ChevronDown, User, Settings, LogOut, Building2
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useSidebar } from '@/context/SidebarContext'
import { useAuth } from '@/context/AuthContext'
import { changeLanguage } from '@/config/i18n'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { notifications, branches, users } from '@/data/mockData'

export function Navbar() {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const { toggleMobile } = useSidebar()
  const { currentUser, isManager, setCurrentUser } = useAuth()
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const langRef = useRef(null)
  const notifRef = useRef(null)
  const profileRef = useRef(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  const currentBranch = branches.find((b) => b.id === currentUser.branchId)

  const languages = [
    { code: 'en', label: 'English', dir: 'ltr' },
    { code: 'ur', label: 'اردو', dir: 'rtl' },
    { code: 'ps', label: 'پښتو', dir: 'rtl' },
    { code: 'fa', label: 'فارسی', dir: 'rtl' },
  ]

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0]

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageChange = (code) => {
    changeLanguage(code)
    setLangOpen(false)
  }

  const handleSearch = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      navigate('/search')
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleSearch)
    return () => document.removeEventListener('keydown', handleSearch)
  }, [])

  const notifTypeColors = {
    info: 'bg-blue-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-xl px-4 lg:px-6">
      {/* Mobile menu */}
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleMobile}>
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search */}
      <div className="flex items-center gap-1 ms-auto">
        {isManager && currentBranch && (
          <Badge variant="secondary" className="gap-1.5 me-1 hidden sm:inline-flex">
            <Building2 className="h-3.5 w-3.5" />
            {currentBranch.name}
          </Badge>
        )}

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-xl">
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </motion.div>
        </Button>

        {/* Language Switcher */}
        <div className="relative" ref={langRef}>
          <Button variant="ghost" size="sm" onClick={() => setLangOpen(!langOpen)} className="gap-1.5 rounded-xl">
            <Globe className="h-4 w-4" />
            <span className="text-xs font-medium hidden sm:inline">{currentLang.label}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
          <AnimatePresence>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute end-0 top-full mt-2 w-40 rounded-xl border bg-popover p-1 shadow-xl z-50"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      i18n.language === lang.code ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <Button variant="ghost" size="icon" className="rounded-xl relative" onClick={() => setNotifOpen(!notifOpen)}>
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -end-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white h-5 w-5">
                {unreadCount}
              </span>
            )}
          </Button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute end-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border bg-popover shadow-xl z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-semibold text-sm">{t('nav.notifications')}</h3>
                  <Badge variant="info">{unreadCount} new</Badge>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`flex gap-3 p-4 border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer ${!notif.read ? 'bg-primary/5' : ''}`}
                    >
                      <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${notifTypeColors[notif.type]}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{notif.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t">
                  <button
                    onClick={() => { navigate('/notifications'); setNotifOpen(false) }}
                    className="w-full rounded-lg py-2 text-sm text-primary hover:bg-primary/5 transition-colors"
                  >
                    {t('common.view')} {t('nav.notifications')}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-muted transition-colors"
          >
            <Avatar alt={currentUser.name} size="sm" />
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute end-0 top-full mt-2 w-56 rounded-xl border bg-popover p-1.5 shadow-xl z-50"
              >
                <div className="px-3 py-2 border-b mb-1">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  <p className="text-xs text-primary capitalize mt-0.5">{t(`roles.${currentUser.role}`)}</p>
                </div>
                <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('nav.switchUser')}
                </p>
                <div className="space-y-0.5">
                  {users.map((user) => {
                    const isActive = user.id === currentUser.id
                    const userBranch = branches.find((b) => b.id === user.branchId)
                    return (
                      <button
                        key={user.id}
                        disabled={isActive}
                        onClick={() => { setCurrentUser(user); setProfileOpen(false) }}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? 'bg-primary/10 text-primary font-medium cursor-default'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <Avatar alt={user.name} size="xs" />
                        <span className="flex-1 truncate text-start">{user.name}</span>
                        {userBranch && <span className="text-[10px] text-muted-foreground">{userBranch.name}</span>}
                      </button>
                    )
                  })}
                </div>
                <div className="border-t my-1" />
                <button
                  onClick={() => { navigate('/profile'); setProfileOpen(false) }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
                >
                  <User className="h-4 w-4" />
                  {t('nav.profile')}
                </button>
                <button
                  onClick={() => { navigate('/settings'); setProfileOpen(false) }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  {t('nav.settings')}
                </button>
                <div className="border-t my-1" />
                <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                  <LogOut className="h-4 w-4" />
                  {t('nav.logout')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
