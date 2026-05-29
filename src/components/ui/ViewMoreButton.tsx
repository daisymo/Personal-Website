import { motion, useReducedMotion } from '../../motion/framer'
import { Link } from 'react-router-dom'
import { fadeUp } from '../../motion/presets'

interface ViewMoreButtonProps {
  to: string
  label: string
}

export function ViewMoreButton({ to, label }: ViewMoreButtonProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className="view-more-wrap"
      initial={reduced ? false : 'hidden'}
      whileInView={reduced ? undefined : 'visible'}
      viewport={{ once: true }}
      variants={fadeUp}
    >
      <Link to={to} className="btn-ghost">
        {label} →
      </Link>
    </motion.div>
  )
}
