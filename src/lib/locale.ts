import type { Locale } from '../data'

export const LOCALE_STORAGE_KEY = 'resume-site-locale'

export function getDocumentLang(locale: Locale) {
  return locale === 'zh' ? 'zh-CN' : 'en'
}

export function readStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'zh'
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  return stored === 'en' ? 'en' : 'zh'
}

export function persistLocale(locale: Locale) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
}
