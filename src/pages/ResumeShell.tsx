import { AnimatePresence } from '../motion/framer'
import type { ReactNode } from 'react'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { useLanguage } from '../hooks/useLanguage'

interface ResumeShellProps {
  children: ReactNode
}

export function ResumeShell({ children }: ResumeShellProps) {
  const { isResumeLoading, resumeError, resume, t, retry } = useLanguage()

  return (
    <>
      <AnimatePresence mode="wait">
        {isResumeLoading ? (
          <LoadingState key="loading" label={t.common.loading} />
        ) : null}
      </AnimatePresence>

      {!isResumeLoading && (resumeError || !resume) ? (
        <ErrorState message={t.common.error} retryLabel={t.common.retry} onRetry={retry} />
      ) : null}

      {resume ? children : null}
    </>
  )
}
