import { createContext } from 'react'
import type { Locale } from '../data'
import type { Resume } from '../types/resume'
import type { UiStrings } from '../i18n/ui'

export interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  t: UiStrings
  resume: Resume | null
  isResumeLoading: boolean
  resumeError: string | null
  retry: () => void
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)
