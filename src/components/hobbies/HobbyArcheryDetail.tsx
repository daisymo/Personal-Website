import type { AboutTag } from '../../types/resume'
import { useLanguage } from '../../hooks/useLanguage'
import { HobbyDetailShell } from './HobbyDetailShell'

interface HobbyArcheryDetailProps {
  hobby: AboutTag
}

export function HobbyArcheryDetail({ hobby }: HobbyArcheryDetailProps) {
  const { t } = useLanguage()

  const steps = [
    { id: 'focus', label: t.hobbies.archeryFocus, hint: t.hobbies.archeryFocusHint },
    { id: 'breath', label: t.hobbies.archeryBreath, hint: t.hobbies.archeryBreathHint },
    { id: 'mind', label: t.hobbies.archeryMind, hint: t.hobbies.archeryMindHint },
  ]

  return (
    <HobbyDetailShell hobby={hobby} variant="archery" hideYear hideEyebrow hideLede>
      <div className="archery-range">
        <header className="archery-range__head">
          <p className="archery-range__kicker">{t.hobbies.archeryRange}</p>
          <p className="archery-range__intro">{t.hobbies.archeryIntro}</p>
        </header>

        <div className="archery-range__stage">
          <div className="archery-range__target" aria-hidden>
            <span className="archery-range__ring archery-range__ring--outer" />
            <span className="archery-range__ring archery-range__ring--mid" />
            <span className="archery-range__ring archery-range__ring--inner" />
            <span className="archery-range__bullseye" />
            <span className="archery-range__arrow" />
          </div>

          <ol className="archery-range__steps">
            {steps.map((step, index) => (
              <li key={step.id} className="archery-range__step">
                <span className="archery-range__step-num" aria-hidden>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="archery-range__step-body">
                  <h3 className="archery-range__step-label">{step.label}</h3>
                  <p className="archery-range__step-hint">{step.hint}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </HobbyDetailShell>
  )
}
