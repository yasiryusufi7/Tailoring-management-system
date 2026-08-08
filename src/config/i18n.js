import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../locales/en/translation.json'
import ur from '../locales/ur/translation.json'
import ps from '../locales/ps/translation.json'
import fa from '../locales/fa/translation.json'

const savedLang = localStorage.getItem('language') || 'en'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ur: { translation: ur },
    ps: { translation: ps },
    fa: { translation: fa },
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

document.documentElement.dir = savedLang === 'en' ? 'ltr' : 'rtl'
document.documentElement.lang = savedLang

export const changeLanguage = (lng) => {
  i18n.changeLanguage(lng)
  localStorage.setItem('language', lng)
  const dir = lng === 'en' ? 'ltr' : 'rtl'
  document.documentElement.dir = dir
  document.documentElement.lang = lng
}

export default i18n
