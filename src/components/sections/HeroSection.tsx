import { lazy, Suspense, type MouseEvent } from 'react'
import { motion, useMotionValue, useReducedMotion } from '../../motion/framer'
import { useLanguage } from '../../hooks/useLanguage'
import { HeroContactButton } from '../hero/HeroContactButton'
import { fadeUp, staggerContainer } from '../../motion/presets'

const HeroAmbient = lazy(() =>
  import('../motion/HeroAmbient').then((module) => ({ default: module.HeroAmbient })),
)
const HeroOrbitScene = lazy(() =>
  import('../motion/HeroOrbitScene').then((module) => ({
    default: module.HeroOrbitScene,
  })),
)

const ease = [0.22, 1, 0.36, 1] as const

export function HeroSection() {
  const { resume, t } = useLanguage()
  const reduced = useReducedMotion()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  if (!resume) return null

  const { profile } = resume
  const firstName = profile.name.split(/\s+/)[0] ?? profile.name
  const motto = profile.motto || profile.summary

  const handlePointerMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  const handlePointerLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <section
      id="hero"
      className="hero"
      onMouseMove={reduced ? undefined : handlePointerMove}
      onMouseLeave={reduced ? undefined : handlePointerLeave}
    >
      <div className="hero__container">
        <div className="hero__grid-layout">
          <motion.div
            className="hero__info"
            variants={staggerContainer}
            initial={reduced ? false : 'hidden'}
            animate={reduced ? undefined : 'visible'}
          >
            <motion.p className="hero__role" variants={fadeUp}>
              {profile.title}
            </motion.p>

            <motion.h1 className="hero__title" variants={fadeUp}>
              <span className="hero__title-name">{firstName}</span>
            </motion.h1>

            {profile.location ? (
              <motion.p className="hero__location" variants={fadeUp}>
                <span className="hero__location-pin" aria-hidden>
                  ⌖
                </span>
                {t.hero.basedIn} {profile.location}
              </motion.p>
            ) : null}

            <motion.p className="hero__motto" variants={fadeUp}>
              {motto}
            </motion.p>

            <HeroContactButton />
          </motion.div>

          <motion.div
            className="hero__canvas"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease }}
          >
            {reduced ? (
              <div className="hero__fallback hero__fallback--orbit" aria-hidden />
            ) : (
              <Suspense fallback={<div className="hero__fallback hero__fallback--orbit" aria-hidden />}>
                <HeroAmbient mouseX={mouseX} mouseY={mouseY} />
                <HeroOrbitScene mouseX={mouseX} mouseY={mouseY} />
              </Suspense>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
