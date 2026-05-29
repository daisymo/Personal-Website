import type { AboutTag } from '../../types/resume'
import { useLanguage } from '../../hooks/useLanguage'
import { HobbyDetailShell } from './HobbyDetailShell'

interface HobbyGenericDetailProps {
  hobby: AboutTag
}

export function HobbyGenericDetail({ hobby }: HobbyGenericDetailProps) {
  const { t } = useLanguage()

  return (
    <HobbyDetailShell hobby={hobby} eyebrow={t.about.hobbiesLabel} variant="generic">
      <div className="hobby-generic">
        <p className="hobby-generic__text">{hobby.detail ?? t.about.hobbyFallback}</p>
      </div>
    </HobbyDetailShell>
  )
}
