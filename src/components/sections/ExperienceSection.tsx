import { motion, useReducedMotion } from '../../motion/framer'
import { useLanguage } from '../../hooks/useLanguage'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'
import { fadeUp, staggerContainer } from '../../motion/presets'

export function ExperienceSection() {
  const { resume, t } = useLanguage()
  const reduced = useReducedMotion()
  if (!resume) return null

  return (
    <Section id="experience" tone="white">
      <SectionHeading title={t.experience.title} subtitle={t.experience.subtitle} />

      <motion.div
        className="page-container exp-timeline"
        variants={staggerContainer}
        initial={reduced ? false : 'hidden'}
        whileInView={reduced ? undefined : 'visible'}
        viewport={{ once: true, margin: '-8%' }}
      >
        {resume.experience.map((job) => (
          <motion.article key={job.id} className="exp-item" variants={fadeUp}>
            <time className="exp-period">{job.period}</time>
            <div className="exp-card">
              <header className="exp-card__head">
                <h3 className="exp-card__role">{job.role}</h3>
                <p className="exp-card__company">{job.company}</p>
              </header>
              <ul className="exp-card__highlights">
                {job.highlights.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </Section>
  )
}
