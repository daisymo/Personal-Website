import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from '../../motion/framer'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

interface HeroAmbientProps {
  mouseX?: MotionValue<number>
  mouseY?: MotionValue<number>
}

export function HeroAmbient({ mouseX: externalX, mouseY: externalY }: HeroAmbientProps) {
  const reduced = usePrefersReducedMotion()
  const localX = useMotionValue(0)
  const localY = useMotionValue(0)
  const mouseX = externalX ?? localX
  const mouseY = externalY ?? localY
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 26 })
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 26 })
  const blobAX = useTransform(smoothX, (v) => v * 40)
  const blobAY = useTransform(smoothY, (v) => v * 32)
  const blobBX = useTransform(smoothX, (v) => v * -28)
  const blobBY = useTransform(smoothY, (v) => v * -24)
  const glowX = useMotionTemplate`calc(58% + ${smoothX}px * 64px)`
  const glowY = useMotionTemplate`calc(40% + ${smoothY}px * 48px)`

  return (
    <div className="hero-ambient pointer-events-none absolute inset-0" aria-hidden>
      <div className="hero-ambient__paper" />
      <motion.div
        className="hero-ambient__blob hero-ambient__blob--a"
        style={{ x: blobAX, y: blobAY }}
        animate={
          reduced
            ? undefined
            : {
                scale: [1, 1.06, 1],
                opacity: [0.45, 0.65, 0.45],
              }
        }
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="hero-ambient__blob hero-ambient__blob--b"
        style={{ x: blobBX, y: blobBY }}
        animate={
          reduced
            ? undefined
            : {
                scale: [1.04, 0.96, 1.04],
                opacity: [0.3, 0.5, 0.3],
              }
        }
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
      />
      <motion.div
        className="hero-ambient__blob hero-ambient__blob--c"
        animate={
          reduced
            ? undefined
            : {
                x: [0, 10, -6, 0],
                y: [0, -8, 5, 0],
              }
        }
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      {!reduced ? (
        <motion.div className="hero-ambient__glow" style={{ left: glowX, top: glowY }} />
      ) : null}

      <svg className="hero-ambient__grid" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="hero-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(15,23,42,0.04)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>
    </div>
  )
}
