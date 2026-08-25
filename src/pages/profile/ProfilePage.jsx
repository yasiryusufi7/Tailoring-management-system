import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  User, Mail, Phone, Shield, Calendar, Camera, Save, Key, Eye, EyeOff, Lock, Store, Building2
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { useAuth } from '@/context/AuthContext'
import { branches as seedBranches } from '@/data/mockData'
import toast from 'react-hot-toast'

export function ProfilePage() {
  const { t } = useTranslation()
  const { currentUser, isAdmin, isTailor, updateCurrentUser } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const branch = seedBranches.find((b) => b.id === currentUser.branchId)

  const [form, setForm] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    shopName: currentUser.shopName || '',
  })

  useEffect(() => {
    setForm({
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      shopName: currentUser.shopName || '',
    })
  }, [currentUser.id])

  const isLocked = !isAdmin

  const handleSave = () => {
    updateCurrentUser({ name: form.name, email: form.email, phone: form.phone, shopName: form.shopName })
    toast.success(t('profile.updated'))
  }

  const field = (key, label, value, placeholder, locked) => ({
    key,
    label,
    value,
    placeholder,
    locked,
  })

  const infoFields = isLocked
    ? [
        field('name', t('profile.fullName'), form.name, t('forms.placeholders.fullName'), true),
        field('email', t('profile.email'), form.email, t('forms.placeholders.email'), true),
        field('phone', t('profile.phone'), form.phone, t('forms.placeholders.phone'), true),
        ...(isAdmin ? [field('shopName', t('profile.shopName'), form.shopName, t('profile.shopName'), true)] : []),
      ]
    : [
        field('name', t('profile.fullName'), form.name, t('forms.placeholders.fullName'), false),
        field('email', t('profile.email'), form.email, t('forms.placeholders.email'), false),
        field('phone', t('profile.phone'), form.phone, t('forms.placeholders.phone'), false),
        field('shopName', t('profile.shopName'), form.shopName, t('profile.shopName'), false),
      ]

  const activity = [
    { ref: 'ORD-009', icon: '📦', action: t('profile.createdOrder', { ref: 'ORD-009' }), time: t('profile.hoursAgo', { n: 2 }) },
    { icon: '👤', action: t('profile.updatedCustomer'), time: t('profile.hoursAgo', { n: 5 }) },
    { ref: 'INV-001', icon: '📄', action: t('profile.generatedInvoice', { ref: 'INV-001' }), time: t('profile.yesterday') },
    { icon: '💾', action: t('profile.systemBackup'), time: t('profile.yesterday') },
    { icon: '📏', action: t('profile.addedMeasurement'), time: t('profile.daysAgo', { n: 2 }) },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('nav.profile')}
        icon={User}
        breadcrumbs={[t('nav.dashboard'), t('nav.profile')]}
      />

      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <Avatar alt={currentUser.name} size="xl" />
                <button className="absolute bottom-0 end-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="text-center sm:text-start flex-1">
                <h2 className="text-xl font-bold">{currentUser.name}</h2>
                <p className="text-muted-foreground">{currentUser.email}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2 justify-center sm:justify-start">
                  <Badge variant={isAdmin ? 'destructive' : isTailor ? 'purple' : 'info'}>
                    {t(`roles.${currentUser.role}`)}
                  </Badge>
                  <Badge variant="success">{t('common.active', 'Active')}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {t('profile.joined', { date: currentUser.joined || '—' })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info"><User className="h-4 w-4 me-1" />{t('profile.tabs.info')}</TabsTrigger>
          <TabsTrigger value="security"><Shield className="h-4 w-4 me-1" />{t('profile.tabs.security')}</TabsTrigger>
          <TabsTrigger value="activity"><Calendar className="h-4 w-4 me-1" />{t('profile.tabs.activity')}</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.personalInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLocked && (
                <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 p-3 text-sm">
                  <Lock className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                  <p className="text-amber-700 dark:text-amber-300">{t('profile.lockedNotice')}</p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {infoFields.map((f) => (
                  <div className="space-y-2" key={f.key}>
                    <label className="text-sm font-medium flex items-center gap-1.5">
                      {f.locked && <Lock className="h-3 w-3 text-muted-foreground" />}
                      {f.label}
                    </label>
                    <Input
                      value={f.value}
                      disabled={f.locked}
                      type={f.key === 'email' ? 'email' : 'text'}
                      placeholder={f.placeholder}
                      onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    />
                  </div>
                ))}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('profile.role')}</label>
                  <Input value={t(`roles.${currentUser.role}`)} disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1.5">
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                    {t('profile.branch')}
                  </label>
                  <Input value={branch ? branch.name : t('profile.allBranches')} disabled />
                </div>
              </div>
              {!isLocked && (
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 me-1" />
                  {t('settings.save')}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.securityTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('profile.currentPassword')}</label>
                <div className="relative">
                  <Input type={showPassword ? 'text' : 'password'} placeholder={t('profile.enterCurrentPassword')} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('profile.newPassword')}</label>
                <Input type="password" placeholder={t('profile.enterNewPassword')} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('profile.confirmPassword')}</label>
                <Input type="password" placeholder={t('profile.confirmNewPassword')} />
              </div>
              <Button onClick={() => toast.success(t('profile.passwordChanged'))}>
                <Key className="h-4 w-4 me-1" />
                {t('profile.changePassword')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.activityTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activity.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <span className="text-lg">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
