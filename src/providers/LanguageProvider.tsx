import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { fetchResumeOptimized } from '../api/resumeApi'
import { LanguageContext } from '../context/language-context'
import type { UiStrings } from '../i18n/ui'
import type { Resume } from '../types/resume'
import { getDocumentLang } from '../lib/locale'

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [ui, setUi] = useState<UiStrings | null>(null)
  const [resume, setResume] = useState<Resume | null>(null)
  const [isResumeLoading, setIsResumeLoading] = useState(true)
  const [resumeError, setResumeError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const resumeRef = useRef<Resume | null>(null)

  useEffect(() => {
    void import('../i18n/zh').then((module) => {
      setUi(module.uiStrings)
    })
  }, [])

  const handleResumeUpdate = useCallback((data: Resume) => {
    resumeRef.current = data
    setResume(data)
  }, [])

  const loadResume = useCallback(async (signal: AbortSignal) => {
    if (resumeRef.current === null) {
      setIsResumeLoading(true)
    }
    setResumeError(null)
    try {
      const data = await fetchResumeOptimized(handleResumeUpdate)
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
  }, [handleResumeUpdate])

  useEffect(() => {
    const controller = new AbortController()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadResume(controller.signal)
    return () => controller.abort()
  }, [reloadKey, loadResume])

  const retry = useCallback(() => {
    setReloadKey((k) => k + 1)
  }, [])

  const value = useMemo(
    () =>
      ui
        ? {
            locale: 'zh' as const,
            t: ui,
            resume,
            isResumeLoading,
            resumeError,
            retry,
          }
        : null,
    [ui, resume, isResumeLoading, resumeError, retry],
  )

  useEffect(() => {
    document.documentElement.lang = getDocumentLang()
  }, [])

  if (!value) return null

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
