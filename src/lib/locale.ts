import type { Locale } from '../data'

export const LOCALE_STORAGE_KEY = 'resume-site-locale'

export function getDocumentLang(locale: Locale) {
  return locale === 'zh' ? 'zh-CN' : 'en'
}

export function readStoredLocale(): Locale {
  return 'zh'
}

export function persistLocale(locale: Locale) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
}
