import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Settings, Globe, Bell, Shield, Palette,
  Sun, Moon, Save, Store, Lock, Eye, EyeOff,
  User, Mail, Phone, MapPin, Key,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { changeLanguage } from '@/config/i18n'
import { getPrefs, setPrefs } from '@/data/userPrefsStore'

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

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'ps', name: 'پښتو', flag: '🇦🇫' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
]

export function SettingsPage() {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()
  const { currentUser } = useAuth()
  const savedPrefs = getPrefs(currentUser.id)

  const [shopSettings, setShopSettings] = useState(
    savedPrefs.shop || {
      shopName: 'TailorPro',
      address: 'Kabul, Shar-e-Naw, Afghanistan',
      phone: '+93 700 000 000',
      email: 'info@tailorpro.com',
    }
  )

  const [notifications, setNotifications] = useState(
    savedPrefs.notifPrefs || {
      orderUpdates: true,
      paymentAlerts: true,
      lowStock: true,
      deliveryReminders: true,
      dailyReport: false,
      weeklyReport: true,
    }
  )

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: savedPrefs.twoFactor || false,
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const handleShopSave = () => {
    setPrefs(currentUser.id, { shop: shopSettings })
    toast.success(t('settings.shopSaved', 'Shop settings saved successfully!'))
  }

  const handleLanguageChange = (code) => {
    changeLanguage(code)
    toast.success(t('settings.languageChanged', 'Language updated'))
  }

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => {
      const updated = { ...prev, [key]: !prev[key] }
      setPrefs(currentUser.id, { notifPrefs: updated })
      toast.success(t('settings.notificationsUpdated', 'Notification preferences updated'))
      return updated
    })
  }

  const handlePasswordChange = () => {
    if (!security.currentPassword || !security.newPassword || !security.confirmPassword) {
      toast.error(t('settings.fillAllFields', 'Please fill all password fields'))
      return
    }
    if (security.newPassword !== security.confirmPassword) {
      toast.error(t('settings.passwordMismatch', 'New passwords do not match'))
      return
    }
    toast.success(t('settings.passwordChanged', 'Password changed successfully!'))
    setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '', twoFactor: security.twoFactor })
  }

  const handleTwoFactorToggle = () => {
    setSecurity((prev) => {
      const updated = { ...prev, twoFactor: !prev.twoFactor }
      setPrefs(currentUser.id, { twoFactor: updated.twoFactor })
      toast.success(
        updated.twoFactor
          ? t('settings.twoFactorEnabled', 'Two-factor authentication enabled')
          : t('settings.twoFactorDisabled', 'Two-factor authentication disabled')
      )
      return updated
    })
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const notificationItems = [
    { key: 'orderUpdates', label: t('settings.orderUpdates', 'Order Updates'), desc: t('settings.orderUpdatesDesc', 'Get notified when order status changes') },
    { key: 'paymentAlerts', label: t('settings.paymentAlerts', 'Payment Alerts'), desc: t('settings.paymentAlertsDesc', 'Receive alerts for payments received or due') },
    { key: 'lowStock', label: t('settings.lowStockAlerts', 'Low Stock Alerts'), desc: t('settings.lowStockDesc', 'Get notified when fabric stock is low') },
    { key: 'deliveryReminders', label: t('settings.deliveryReminders', 'Delivery Reminders'), desc: t('settings.deliveryRemindersDesc', 'Reminders for upcoming deliveries') },
    { key: 'dailyReport', label: t('settings.dailyReport', 'Daily Report'), desc: t('settings.dailyReportDesc', 'Receive daily summary of business activity') },
    { key: 'weeklyReport', label: t('settings.weeklyReport', 'Weekly Report'), desc: t('settings.weeklyReportDesc', 'Receive weekly performance report') },
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageHeader
        title={t('settings.title', 'Settings')}
        subtitle={t('settings.subtitle', 'Manage your application preferences')}
        icon={Settings}
        breadcrumbs={[t('nav.dashboard'), t('nav.settings', 'Settings')]}
      />

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="h-auto flex-wrap gap-1 p-1.5">
            <TabsTrigger value="general" className="gap-2">
              <Store className="h-4 w-4" />
              {t('settings.general', 'General')}
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              {t('settings.appearance', 'Appearance')}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              {t('settings.notifications', 'Notifications')}
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              {t('settings.security', 'Security')}
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-primary" />
                    {t('settings.shopInformation', 'Shop Information')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Store className="h-4 w-4 text-muted-foreground" />
                        {t('settings.shopName', 'Shop Name')}
                      </label>
                      <Input
                        value={shopSettings.shopName}
                        onChange={(e) => setShopSettings({ ...shopSettings, shopName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {t('settings.address', 'Address')}
                      </label>
                      <Input
                        value={shopSettings.address}
                        onChange={(e) => setShopSettings({ ...shopSettings, address: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {t('settings.phone', 'Phone')}
                      </label>
                      <Input
                        value={shopSettings.phone}
                        onChange={(e) => setShopSettings({ ...shopSettings, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {t('settings.email', 'Email')}
                      </label>
                      <Input
                        type="email"
                        value={shopSettings.email}
                        onChange={(e) => setShopSettings({ ...shopSettings, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button onClick={handleShopSave}>
                      <Save className="h-4 w-4" />
                      {t('settings.saveChanges', 'Save Changes')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <motion.div variants={itemVariants} className="space-y-4">
              {/* Theme */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    {t('settings.theme', 'Theme')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Light Theme */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTheme('light')}
                      className={`relative rounded-xl border-2 p-4 text-start transition-all duration-200 ${
                        theme === 'light'
                          ? 'border-primary shadow-md bg-primary/5'
                          : 'border-border hover:border-muted-foreground/30'
                      }`}
                    >
                      {theme === 'light' && (
                        <Badge variant="default" className="absolute top-2 end-2 text-[10px]">
                          {t('settings.active', 'Active')}
                        </Badge>
                      )}
                      <div className="rounded-lg bg-white border border-gray-200 p-3 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-3 w-3 rounded-full bg-primary" />
                          <div className="h-2 w-16 rounded bg-gray-200" />
                        </div>
                        <div className="space-y-1">
                          <div className="h-1.5 w-full rounded bg-gray-100" />
                          <div className="h-1.5 w-3/4 rounded bg-gray-100" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sun className="h-5 w-5 text-amber-500" />
                        <span className="font-medium">{t('settings.lightMode', 'Light Mode')}</span>
                      </div>
                    </motion.button>

                    {/* Dark Theme */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTheme('dark')}
                      className={`relative rounded-xl border-2 p-4 text-start transition-all duration-200 ${
                        theme === 'dark'
                          ? 'border-primary shadow-md bg-primary/5'
                          : 'border-border hover:border-muted-foreground/30'
                      }`}
                    >
                      {theme === 'dark' && (
                        <Badge variant="default" className="absolute top-2 end-2 text-[10px]">
                          {t('settings.active', 'Active')}
                        </Badge>
                      )}
                      <div className="rounded-lg bg-gray-900 border border-gray-700 p-3 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500" />
                          <div className="h-2 w-16 rounded bg-gray-700" />
                        </div>
                        <div className="space-y-1">
                          <div className="h-1.5 w-full rounded bg-gray-700" />
                          <div className="h-1.5 w-3/4 rounded bg-gray-700" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Moon className="h-5 w-5 text-blue-400" />
                        <span className="font-medium">{t('settings.darkMode', 'Dark Mode')}</span>
                      </div>
                    </motion.button>
                  </div>
                </CardContent>
              </Card>

              {/* Language */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    {t('settings.language', 'Language')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {languages.map((lang) => (
                      <motion.button
                        key={lang.code}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`flex items-center gap-3 rounded-xl border-2 p-4 text-start transition-all duration-200 ${
                          i18n.language === lang.code
                            ? 'border-primary shadow-md bg-primary/5'
                            : 'border-border hover:border-muted-foreground/30'
                        }`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <div>
                          <p className="font-medium">{lang.name}</p>
                          <p className="text-xs text-muted-foreground">{lang.code.toUpperCase()}</p>
                        </div>
                        {i18n.language === lang.code && (
                          <Badge variant="default" className="ms-auto text-[10px]">
                            {t('settings.active', 'Active')}
                          </Badge>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    {t('settings.notificationPreferences', 'Notification Preferences')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {notificationItems.map((item, i) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between py-4 border-b last:border-0"
                    >
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => handleNotificationToggle(item.key)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          notifications[item.key] ? 'bg-primary' : 'bg-muted'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                            notifications[item.key] ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <motion.div variants={itemVariants} className="space-y-4">
              {/* Change Password */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    {t('settings.changePassword', 'Change Password')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      {t('settings.currentPassword', 'Current Password')}
                    </label>
                    <div className="relative">
                      <Input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={security.currentPassword}
                        onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                        placeholder={t('settings.enterCurrentPassword', 'Enter current password')}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        {t('settings.newPassword', 'New Password')}
                      </label>
                      <div className="relative">
                        <Input
                          type={showPasswords.new ? 'text' : 'password'}
                          value={security.newPassword}
                          onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                          placeholder={t('settings.enterNewPassword', 'Enter new password')}
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        {t('settings.confirmPassword', 'Confirm Password')}
                      </label>
                      <div className="relative">
                        <Input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={security.confirmPassword}
                          onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                          placeholder={t('settings.confirmNewPassword', 'Confirm new password')}
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button onClick={handlePasswordChange}>
                      <Lock className="h-4 w-4" />
                      {t('settings.updatePassword', 'Update Password')}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Two-Factor Authentication */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    {t('settings.twoFactorAuth', 'Two-Factor Authentication')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{t('settings.enableTwoFactor', 'Enable Two-Factor Authentication')}</p>
                      <p className="text-xs text-muted-foreground">
                        {t('settings.twoFactorDesc', 'Add an extra layer of security to your account')}
                      </p>
                    </div>
                    <button
                      onClick={handleTwoFactorToggle}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                        security.twoFactor ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          security.twoFactor ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  {security.twoFactor && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{t('settings.twoFactorActive', 'Two-Factor Authentication is Active')}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t('settings.twoFactorInfo', 'Your account is protected with two-factor authentication. You will need to enter a verification code when signing in.')}
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
