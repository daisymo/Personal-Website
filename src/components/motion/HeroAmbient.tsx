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
  const blobAX = useTransform(smoothX, (v) => v * 36)
  const blobAY = useTransform(smoothY, (v) => v * 28)
  const blobBX = useTransform(smoothX, (v) => v * -22)
  const blobBY = useTransform(smoothY, (v) => v * -18)
  const glowX = useMotionTemplate`calc(58% + ${smoothX}px * 64px)`
  const glowY = useMotionTemplate`calc(40% + ${smoothY}px * 48px)`

  return (
    <div className="hero-ambient pointer-events-none absolute inset-0" aria-hidden>
      <div className="hero-ambient__veil" />

      {/* 左侧紫罗兰色光斑 */}
      <motion.div
        className="hero-ambient__blob hero-ambient__blob--a"
        style={{ x: blobAX, y: blobAY }}
        animate={
          reduced
            ? undefined
            : {
                scale: [1, 1.08, 1],
                opacity: [0.28, 0.48, 0.28],
              }
        }
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 右侧蓝白色光斑 */}
      <motion.div
        className="hero-ambient__blob hero-ambient__blob--b"
        style={{ x: blobBX, y: blobBY }}
        animate={
          reduced
            ? undefined
            : {
                scale: [1.03, 0.94, 1.03],
                opacity: [0.18, 0.35, 0.18],
              }
        }
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
      />

      {/* 微光粒子层 */}
      <motion.div
        className="hero-ambient__blob hero-ambient__blob--c"
        animate={
          reduced
            ? undefined
            : {
                x: [0, 12, -8, 0],
                y: [0, -10, 6, 0],
              }
        }
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 鼠标跟随主光点 */}
      {!reduced ? (
        <motion.div className="hero-ambient__glow" style={{ left: glowX, top: glowY }} />
      ) : null}

      {/* 网格背景 */}
      <svg className="hero-ambient__grid" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="hero-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(15,23,42,0.035)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      {/* 边缘高光 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(255,255,255,0.4) 100%)',
        }}
      />
    </div>
  )
}
