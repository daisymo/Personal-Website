import type { Locale } from '../data'

export const LOCALE_STORAGE_KEY = 'resume-site-locale'

export function getDocumentLang(): string {
  return 'zh-CN'
}

export function readStoredLocale(): Locale {
  return 'zh'
}

export function persistLocale(): void {
}
