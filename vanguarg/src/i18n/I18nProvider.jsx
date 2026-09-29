import { useEffect, useMemo, useState } from 'react'
import { translations } from './translations'
import { I18nContext } from './context'

const STORAGE_KEY = 'vanguarg.lang'

function getDefaultLang() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'en' || saved === 'de') return saved
  return 'de'
}

function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] != null ? acc[key] : undefined), obj)
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => getDefaultLang())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
  }, [lang])

  const value = useMemo(() => {
    const dict = translations[lang] ?? translations.de

    function t(key, vars) {
      const raw = getByPath(dict, key) ?? getByPath(translations.de, key) ?? key
      if (typeof raw !== 'string') return String(raw)
      if (!vars) return raw
      return raw.replace(/\{(\w+)\}/g, (_, name) => (vars[name] != null ? String(vars[name]) : `{${name}}`))
    }

    return { lang, setLang, t }
  }, [lang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

