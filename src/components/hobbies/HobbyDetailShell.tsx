import { motion } from '../../motion/framer'
import type { ReactNode } from 'react'
import { getCurrentYear } from '../../lib/currentYear'
import { BackButton } from '../ui/BackButton'
import { PageContainer } from '../ui/PageContainer'
import type { AboutTag } from '../../types/resume'
import { fadeUp } from '../../motion/presets'

interface HobbyDetailShellProps {
  hobby: AboutTag
  eyebrow?: string
  variant: 'photo' | 'reading' | 'hiking' | 'music' | 'archery' | 'generic'
  hideYear?: boolean
  hideEyebrow?: boolean
  hideTitle?: boolean
  hideLede?: boolean
  children: ReactNode
}

export function HobbyDetailShell({
  hobby,
  eyebrow,
  variant,
  hideYear,
  hideEyebrow = true,
  hideTitle,
  hideLede,
  children,
}: HobbyDetailShellProps) {
  const year = getCurrentYear()
  const showMetaRow = !hideEyebrow && (eyebrow || !hideYear)
  const showTitleRow = !hideTitle

  return (
    <article className={`subpage subpage--detail hobby-detail hobby-detail--${variant}`}>
      <div className="hobby-detail__ambient" aria-hidden />
      <div className="page-section page-section--compact">
        <PageContainer>
          <motion.header
            className="hobby-detail__head"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <BackButton className="btn-ghost hobby-detail__back" />
            {showMetaRow ? (
              <div className="hobby-detail__meta-row">
                {eyebrow ? <span className="hobby-detail__eyebrow">{eyebrow}</span> : null}
                {hideYear ? null : <span className="hobby-detail__year">{year}</span>}
              </div>
            ) : null}
            {showTitleRow ? (
              <div className="hobby-detail__title-row">
                {hobby.icon ? (
                  <span className="hobby-detail__icon" aria-hidden>
                    {hobby.icon}
                  </span>
                ) : null}
                <h1 className="hobby-detail__title">{hobby.name}</h1>
              </div>
            ) : null}
            {hideLede || !hobby.detail ? null : <p className="hobby-detail__lede">{hobby.detail}</p>}
          </motion.header>

          <motion.div
            className="hobby-detail__body"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </PageContainer>
      </div>
    </article>
  )
}
