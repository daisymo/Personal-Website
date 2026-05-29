import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { fetchResume } from '../api/resumeApi'
import { LanguageContext } from '../context/language-context'
import type { Locale } from '../data'
import type { UiStrings } from '../i18n/ui'
import type { Resume } from '../types/resume'
import { getDocumentLang, persistLocale, readStoredLocale } from '../lib/locale'

interface LanguageProviderProps {
  children: ReactNode
}

const uiLoaders: Record<Locale, () => Promise<{ uiStrings: UiStrings }>> = {
  zh: () => import('../i18n/zh'),
  en: () => import('../i18n/en'),
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale)
  const [ui, setUi] = useState<UiStrings | null>(null)
  const [resume, setResume] = useState<Resume | null>(null)
  const [isResumeLoading, setIsResumeLoading] = useState(true)
  const [resumeError, setResumeError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const resumeRef = useRef<Resume | null>(null)

  useEffect(() => {
    let active = true
    void uiLoaders[locale]().then((module) => {
      if (active) setUi(module.uiStrings)
    })
    return () => {
      active = false
    }
  }, [locale])

  const loadResume = useCallback(async (loc: Locale, signal: AbortSignal) => {
    if (resumeRef.current === null) {
      setIsResumeLoading(true)
    }
    setResumeError(null)
    try {
      const data = await fetchResume(loc)
      if (!signal.aborted) {
        resumeRef.current = data
        setResume(data)
      }
    } catch (err) {
      if (!signal.aborted) {
        setResumeError(err instanceof Error ? err.message : 'Unknown error')
        resumeRef.current = null
        setResume(null)
      }
    } finally {
      if (!signal.aborted) {
        setIsResumeLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadResume(locale, controller.signal)
    return () => controller.abort()
  }, [locale, reloadKey, loadResume])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    persistLocale(next)
  }, [])

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'zh' ? 'en' : 'zh')
  }, [locale, setLocale])

  const retry = useCallback(() => {
    setReloadKey((k) => k + 1)
  }, [])

  const value = useMemo(
    () =>
      ui
        ? {
            locale,
            setLocale,
            toggleLocale,
            t: ui,
            resume,
            isResumeLoading,
            resumeError,
            retry,
          }
        : null,
    [locale, setLocale, toggleLocale, ui, resume, isResumeLoading, resumeError, retry],
  )

  useEffect(() => {
    document.documentElement.lang = getDocumentLang(locale)
  }, [locale])

  if (!value) return null

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
