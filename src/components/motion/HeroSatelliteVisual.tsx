import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from '../../motion/framer'
import { useContainerSize, type ContainerTier } from '../../hooks/useContainerSize'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

interface HeroSatelliteVisualProps {
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}

type RingConfig = {
  tiltX: number
  tiltZ: number
  size: number
  duration: number
  moon: number
  delay: number
  dual: boolean
}

const RINGS_BY_TIER: Record<ContainerTier, RingConfig[]> = {
  xs: [
    { tiltX: 70, tiltZ: -18, size: 88, duration: 26, moon: 5, delay: 0, dual: false },
  ],
  sm: [
    { tiltX: 70, tiltZ: -20, size: 92, duration: 28, moon: 5.5, delay: 0, dual: false },
    { tiltX: 62, tiltZ: 52, size: 72, duration: 20, moon: 4, delay: -6, dual: false },
  ],
  md: [
    { tiltX: 72, tiltZ: -24, size: 96, duration: 30, moon: 6, delay: 0, dual: true },
    { tiltX: 58, tiltZ: 38, size: 80, duration: 22, moon: 5, delay: -8, dual: false },
    { tiltX: 68, tiltZ: 108, size: 102, duration: 38, moon: 4.5, delay: -12, dual: false },
  ],
  lg: [
    { tiltX: 72, tiltZ: -24, size: 98, duration: 32, moon: 7, delay: 0, dual: true },
    { tiltX: 58, tiltZ: 38, size: 82, duration: 22, moon: 5.5, delay: -8, dual: true },
    { tiltX: 68, tiltZ: 112, size: 108, duration: 40, moon: 4.5, delay: -14, dual: false },
  ],
}

const STARS = [
  { cx: -38, cy: -32, r: 1.25, o: 0.85 },
  { cx: 42, cy: -48, r: 1, o: 0.7 },
  { cx: -52, cy: 18, r: 1.5, o: 0.55 },
  { cx: 58, cy: 36, r: 1.1, o: 0.75 },
  { cx: -22, cy: 52, r: 0.9, o: 0.65 },
  { cx: 28, cy: -12, r: 1.2, o: 0.5 },
  { cx: -64, cy: -8, r: 0.8, o: 0.45 },
  { cx: 12, cy: 62, r: 1, o: 0.6 },
] as const

const LINES = [
  [0, 1],
  [1, 4],
  [4, 7],
  [0, 3],
  [3, 5],
] as const

const MOTION_SCALE: Record<ContainerTier, { tilt: number; drift: number; glow: number }> = {
  xs: { tilt: 8, drift: 14, glow: 40 },
  sm: { tilt: 10, drift: 18, glow: 52 },
  md: { tilt: 12, drift: 22, glow: 64 },
  lg: { tilt: 14, drift: 26, glow: 72 },
}

export function HeroSatelliteVisual({ mouseX, mouseY }: HeroSatelliteVisualProps) {
  const reduced = usePrefersReducedMotion()
  const coarsePointer = useMediaQuery('(pointer: coarse)')
  const { ref, tier } = useContainerSize<HTMLDivElement>()
  const rings = RINGS_BY_TIER[tier]
  const motionScale = MOTION_SCALE[tier]

  const autoX = useMotionValue(0)
  const autoY = useMotionValue(0)

  useAnimationFrame((time) => {
    if (reduced) return
    const t = time / 1000
    autoX.set(Math.sin(t * 0.55) * (coarsePointer ? 0.42 : 0.12))
    autoY.set(Math.cos(t * 0.45) * (coarsePointer ? 0.35 : 0.1))
  })

  const blendX = useTransform([mouseX, autoX], ([mx, ax]) => (mx as number) + (ax as number))
  const blendY = useTransform([mouseY, autoY], ([my, ay]) => (my as number) + (ay as number))

  const smoothX = useSpring(blendX, { stiffness: 42, damping: 22 })
  const smoothY = useSpring(blendY, { stiffness: 42, damping: 22 })
  const tiltX = useTransform(smoothY, (v) => v * -motionScale.tilt)
  const tiltY = useTransform(smoothX, (v) => v * motionScale.tilt)
  const driftX = useTransform(smoothX, (v) => v * motionScale.drift)
  const driftY = useTransform(smoothY, (v) => v * motionScale.drift)
  const glowX = useMotionTemplate`calc(50% + ${smoothX}px * ${motionScale.glow}px)`
  const glowY = useMotionTemplate`calc(48% + ${smoothY}px * ${motionScale.glow * 0.78}px)`

  const spinDuration = tier === 'xs' ? 72 : tier === 'sm' ? 80 : 88

  return (
    <div ref={ref} className="hero-celestial" data-tier={tier} aria-hidden>
      <motion.div
        className="hero-celestial__aurora"
        style={reduced ? undefined : { left: glowX, top: glowY }}
      />

      <motion.div
        className="hero-celestial__stage"
        style={
          reduced
            ? undefined
            : {
                rotateX: tiltX,
                rotateY: tiltY,
                x: driftX,
                y: driftY,
              }
        }
        animate={reduced ? undefined : { rotateZ: [0, 2, 0, -2, 0] }}
        transition={reduced ? undefined : { duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          className="hero-celestial__universe"
          animate={reduced ? undefined : { rotateY: [0, 360] }}
          transition={reduced ? undefined : { duration: spinDuration, repeat: Infinity, ease: 'linear' }}
        >
          <div className="hero-celestial__nebula" />
          <div className="hero-celestial__nebula hero-celestial__nebula--b" />

          <svg className="hero-celestial__chart" viewBox="-100 -100 200 200" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="hero-star-fill" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="55%" stopColor="#b8cff0" />
                <stop offset="100%" stopColor="#6b93d4" stopOpacity="0.35" />
              </radialGradient>
            </defs>
            {tier !== 'xs'
              ? LINES.map(([a, b], index) => {
                  const p1 = STARS[a]
                  const p2 = STARS[b]
                  if (!p1 || !p2) return null
                  return (
                    <line
                      key={index}
                      x1={p1.cx}
                      y1={p1.cy}
                      x2={p2.cx}
                      y2={p2.cy}
                      className="hero-celestial__chart-line"
                    />
                  )
                })
              : null}
            {STARS.map((star, index) => (
              <circle
                key={index}
                cx={star.cx}
                cy={star.cy}
                r={star.r}
                className="hero-celestial__star-dot"
                style={{ ['--star-o' as string]: String(star.o), ['--star-d' as string]: `${index * 0.65}s` }}
              />
            ))}
          </svg>

          {rings.map((ring, index) => (
            <div
              key={index}
              className="hero-celestial__ring"
              style={{
                ['--tilt-x' as string]: `${ring.tiltX}deg`,
                ['--tilt-z' as string]: `${ring.tiltZ}deg`,
                ['--ring-size' as string]: `${ring.size}%`,
                ['--orbit-dur' as string]: `${ring.duration}s`,
                ['--moon-size' as string]: `${ring.moon}px`,
                ['--orbit-delay' as string]: `${ring.delay}s`,
              }}
            >
              <div className="hero-celestial__ring-line" />
              {!reduced ? (
                <>
                  <div className="hero-celestial__orbit">
                    <span className="hero-celestial__moon" />
                  </div>
                  {ring.dual ? (
                    <div className="hero-celestial__orbit hero-celestial__orbit--lag">
                      <span className="hero-celestial__moon hero-celestial__moon--dim" />
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>
          ))}

          <div className="hero-celestial__globe-wrap">
            <div className="hero-celestial__globe-halo" />
            <motion.div
              className="hero-celestial__globe"
              animate={reduced ? undefined : { rotateY: [0, 360] }}
              transition={
                reduced ? undefined : { duration: spinDuration * 0.55, repeat: Infinity, ease: 'linear' }
              }
            >
              <div className="hero-celestial__globe-atmo" />
              <div className="hero-celestial__globe-body">
                <div className="hero-celestial__globe-shine" />
                <div className="hero-celestial__globe-depth" />
              </div>
              <div className="hero-celestial__globe-equator" />
              {tier !== 'xs' ? <div className="hero-celestial__globe-meridian" /> : null}
              <motion.div
                className="hero-celestial__globe-core"
                animate={reduced ? undefined : { opacity: [0.55, 0.95, 0.55], scale: [0.92, 1.05, 0.92] }}
                transition={reduced ? undefined : { duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
