import { motion, useScroll, useSpring } from '../../motion/framer'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      className="scroll-progress pointer-events-none fixed left-0 right-0 z-[60] origin-left"
      style={{ top: 'var(--header-h)', scaleX }}
      aria-hidden
    />
  )
}
