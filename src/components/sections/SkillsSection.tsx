import { AnimatePresence, motion, useReducedMotion } from '../../motion/framer'
import { useEffect, useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'

const ease = [0.22, 1, 0.36, 1] as const
const CYCLE_MS = 5200

export function SkillsSection() {
  const { resume, t } = useLanguage()
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [cycleKey, setCycleKey] = useState(0)

  const groups = resume?.skills ?? []
  const current = groups[active]

  useEffect(() => {
    if (reduced || groups.length <= 1) return
    const timer = window.setInterval(() => {
      setActive((i) => (i + 1) % groups.length)
      setCycleKey((k) => k + 1)
    }, CYCLE_MS)
    return () => window.clearInterval(timer)
  }, [groups.length, reduced])

  const selectGroup = (index: number) => {
    setActive(index)
    setCycleKey((k) => k + 1)
  }

  if (!resume) return null

  return (
    <Section id="skills" tone="white">
      <SectionHeading title={t.skills.title} subtitle={t.skills.subtitle} />

      <div className="page-container skill-showcase">
        <div className="skill-showcase__nav" role="tablist" aria-label={t.skills.title}>
          {groups.map((group, index) => (
            <button
              key={group.category}
              type="button"
              role="tab"
              aria-selected={active === index}
              className={`skill-showcase__tab${active === index ? ' skill-showcase__tab--active' : ''}`}
              onClick={() => selectGroup(index)}
            >
              <span className="skill-showcase__tab-num">{String(index + 1).padStart(2, '0')}</span>
              <span className="skill-showcase__tab-label">{group.category}</span>
              {active === index ? (
                <motion.span
                  className="skill-showcase__tab-line"
                  layoutId="skill-showcase-line"
                  transition={{ duration: 0.38, ease }}
                />
              ) : null}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {current ? (
            <motion.div
              key={current.category}
              className="skill-showcase__panel"
              role="tabpanel"
              initial={reduced ? false : { opacity: 0, filter: 'blur(6px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={reduced ? undefined : { opacity: 0, filter: 'blur(4px)' }}
              transition={{ duration: 0.42, ease }}
            >
              <header className="skill-showcase__head">
                <h3 className="skill-showcase__title">{current.category}</h3>
              </header>

              <ul className="skill-showcase__grid">
                {current.items.map((skill, index) => (
                  <motion.li
                    key={skill}
                    className="skill-showcase__item"
                    initial={reduced ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.38, ease, delay: 0.06 + index * 0.035 }}
                  >
                    <motion.span
                      className="skill-showcase__item-mark"
                      aria-hidden
                      initial={reduced ? false : { scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.32, ease, delay: 0.08 + index * 0.035 }}
                    />
                    <span className="skill-showcase__item-label">{skill}</span>
                  </motion.li>
                ))}
              </ul>

              {groups.length > 1 && !reduced ? (
                <div className="skill-showcase__progress" aria-hidden>
                  <motion.span
                    key={cycleKey}
                    className="skill-showcase__progress-fill"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: CYCLE_MS / 1000, ease: 'linear' }}
                  />
                </div>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </Section>
  )
}
