import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Users, ShoppingBag, Scissors, Truck, ArrowRight, Command, FileText, Calculator, Package } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { customers, orders, tailors, suppliers } from '@/data/mockData'

const sections = [
  { key: 'customers', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', items: customers.map(c => ({ id: c.id, name: c.name, desc: c.phone, path: '/customers' })) },
  { key: 'orders', icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-500/10', items: orders.map(o => ({ id: o.id, name: o.id, desc: `${o.type} - PKR ${o.amount.toLocaleString()}`, path: '/orders' })) },
  { key: 'tailors', icon: Scissors, color: 'text-purple-500', bg: 'bg-purple-500/10', items: tailors.map(t => ({ id: t.id, name: t.name, desc: t.specialization, path: '/tailors' })) },
  { key: 'suppliers', icon: Truck, color: 'text-amber-500', bg: 'bg-amber-500/10', items: suppliers.map(s => ({ id: s.id, name: s.name, desc: s.address, path: '/suppliers' })) },
]

export function SearchPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const results = query.length > 0
    ? sections.map(section => ({
        ...section,
        items: section.items.filter(item =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.desc.toLowerCase().includes(query.toLowerCase())
        )
      })).filter(s => s.items.length > 0)
    : []

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-6"
      >
        <Search className="absolute start-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search.placeholder')}
          className="w-full h-14 ps-12 pe-20 rounded-2xl border bg-card text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        />
        <kbd className="absolute end-4 top-1/2 -translate-y-1/2 pointer-events-none inline-flex items-center gap-1 rounded-lg border bg-muted px-2 py-1 text-xs text-muted-foreground">
          <Command className="h-3 w-3" /> K
        </kbd>
      </motion.div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {query.length > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {results.length > 0 ? results.map((section) => {
              const SectionIcon = section.icon
              return (
                <motion.div
                  key={section.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border bg-card overflow-hidden"
                >
                  <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
                    <SectionIcon className={`h-4 w-4 ${section.color}`} />
                    <h3 className="text-sm font-semibold">{t(`search.${section.key}`)}</h3>
                    <Badge variant="secondary" className="ms-auto text-xs">{section.items.length}</Badge>
                  </div>
                  <div>
                    {section.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => navigate(section.path)}
                        className="flex w-full items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-start border-b last:border-0"
                      >
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${section.bg} ${section.color}`}>
                          <SectionIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )
            }) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">{t('search.noResults')}</p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="shortcuts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <p className="text-center text-sm text-muted-foreground">{t('search.entireSystem')}</p>
            <div className="grid grid-cols-2 gap-3">
              {sections.map((section) => {
                const SectionIcon = section.icon
                return (
                  <motion.button
                    key={section.key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setQuery(section.key.charAt(0))}
                    className="flex items-center gap-3 rounded-xl border bg-card p-4 hover:shadow-md transition-all text-start"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${section.bg} ${section.color}`}>
                      <SectionIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t(`search.${section.key}`)}</p>
                      <p className="text-xs text-muted-foreground">{t('search.items', { count: section.items.length })}</p>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
