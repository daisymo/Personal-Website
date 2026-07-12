import type { ReactNode } from 'react'
import { ErrorState } from '../components/ui/ErrorState'
import { HeroSkeleton, SectionSkeleton } from '../components/ui/Skeleton'
import { useLanguage } from '../hooks/useLanguage'

interface ResumeShellProps {
  children: ReactNode
}

export function ResumeShell({ children }: ResumeShellProps) {
  const { isResumeLoading, resumeError, t, retry } = useLanguage()

  if (resumeError) {
    return <ErrorState message={resumeError || t.common.error} retryLabel={t.common.retry} onRetry={retry} />
  }

  if (isResumeLoading) {
    return (
      <div className="site-shell">
        <main className="site-main">
          <div className="site-content">
            <HeroSkeleton />
            <SectionSkeleton />
            <SectionSkeleton />
          </div>
        </main>
      </div>
    )
  }

  return <>{children}</>
}
