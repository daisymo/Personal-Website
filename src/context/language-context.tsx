import { createContext } from 'react'
import type { Resume } from '../types/resume'
import type { UiStrings } from '../i18n/ui'

export interface LanguageContextValue {
  locale: 'zh'
  t: UiStrings
  resume: Resume | null
  isResumeLoading: boolean
  resumeError: string | null
  retry: () => void
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)
