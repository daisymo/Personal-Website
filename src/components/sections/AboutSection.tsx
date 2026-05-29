import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from '../../motion/framer'
import { useLanguage } from '../../hooks/useLanguage'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'
import { hobbyDetailPath } from '../../lib/routes'
import { fadeUp, staggerContainer } from '../../motion/presets'

const CRED_HUES = [214, 268, 42] as const
const HOBBY_TILTS = [-2.5, 1.5, -1, 2, -1.5] as const

export function AboutSection() {
  const { resume, t } = useLanguage()
  const reduced = useReducedMotion()

  if (!resume) return null

  const { about } = resume

  return (
    <Section id="about" tone="white">
      <SectionHeading title={t.about.title} subtitle={t.about.subtitle} />

      <div className="page-container about-capsule">
        <motion.div
          className="about-capsule__quote"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <blockquote>
            <p className="about-capsule__quote-text">
              {about.quote.text}
              {about.quote.author ? ` — ${about.quote.author}` : ''}
            </p>
          </blockquote>
        </motion.div>

        <motion.div
          className="about-capsule__rest"
          variants={staggerContainer}
          initial={reduced ? false : 'hidden'}
          whileInView={reduced ? undefined : 'visible'}
          viewport={{ once: true }}
        >
          <motion.section className="about-panel about-panel--creds" variants={fadeUp}>
            <header className="about-panel__head">
              <span className="about-panel__mark" aria-hidden>
                01
              </span>
              <div>
                <h3>{t.about.credentialsLabel}</h3>
                <p className="about-panel__hint">{t.about.credentialsHint}</p>
              </div>
            </header>
            <div className="about-panel__body">
              <ul className="about-cred-gallery">
                {about.credentials.map((item, i) => (
                  <motion.li
                    key={item.id}
                    className="about-cred-ticket"
                    style={
                      {
                        '--cred-h': CRED_HUES[i % CRED_HUES.length],
                        '--cred-tilt': `${(i % 2 === 0 ? -1 : 1) * (1.5 + (i % 3))}deg`,
                      } as CSSProperties
                    }
                    whileHover={reduced ? undefined : { y: -5, rotate: 0, scale: 1.02 }}
                  >
                    <span className="about-cred-ticket__stub" aria-hidden />
                    <span className="about-cred-ticket__no">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="about-cred-ticket__icon" aria-hidden>
                      {item.icon ?? '✦'}
                    </span>
                    <span className="about-cred-ticket__label">{item.name}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.section>

          <motion.section className="about-panel about-panel--hobbies" variants={fadeUp}>
            <header className="about-panel__head">
              <span className="about-panel__mark" aria-hidden>
                02
              </span>
              <div>
                <h3>{t.about.hobbiesLabel}</h3>
                <p className="about-panel__hint">{t.about.hobbiesHint}</p>
              </div>
            </header>
            <div className="about-panel__body">
              <ul className="about-hobby-gallery">
                {about.hobbies.map((item, i) => (
                  <motion.li
                    key={item.id}
                    className="about-polaroid"
                    style={{ '--polaroid-tilt': `${HOBBY_TILTS[i % HOBBY_TILTS.length]}deg` } as CSSProperties}
                    whileHover={reduced ? undefined : { y: -6, rotate: 0, scale: 1.02 }}
                  >
                    <Link
                      to={hobbyDetailPath(item.slug)}
                      className="about-polaroid__link"
                      aria-label={`${item.name} — ${t.about.hobbyOpen}`}
                    >
                      <span className="about-polaroid__frame">
                        <span className="about-polaroid__icon" aria-hidden>
                          {item.icon ?? '✦'}
                        </span>
                      </span>
                      <span className="about-polaroid__caption">{item.name}</span>
                      <span className="about-polaroid__peek">{t.about.hobbyOpen} →</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </Section>
  )
}
