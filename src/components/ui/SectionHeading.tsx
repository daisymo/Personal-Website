import { motion, useReducedMotion } from '../../motion/framer'
import { cn } from '../../lib/cn'
import { fadeUp } from '../../motion/presets'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  label?: string
  id?: string
  align?: 'left' | 'center'
}

export function SectionHeading({
  title,
  subtitle,
  label,
  id,
  align = 'left',
}: SectionHeadingProps) {
  const reduced = useReducedMotion()
  const centered = align === 'center'

  return (
    <motion.header
      id={id}
      className={cn('section-head', centered && 'section-head--center')}
      initial={reduced ? false : 'hidden'}
      whileInView={reduced ? undefined : 'visible'}
      viewport={{ once: true, margin: '-10%' }}
      variants={fadeUp}
    >
      {label ? <span className="section-label">{label}</span> : null}
      <h2 className="section-title">{title}</h2>
      <motion.span
        className="section-head__rule"
        aria-hidden
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={reduced ? undefined : { scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      />
      {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
    </motion.header>
  )
}
