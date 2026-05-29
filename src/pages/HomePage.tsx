import { lazy, Suspense, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { DeferredMount } from '../components/ui/DeferredMount'
import { HeroSection } from '../components/sections/HeroSection'
import { GrainOverlay } from '../components/motion/GrainOverlay'
import { useSectionScroll } from '../hooks/useSectionScroll'
import { readSectionScrollState } from '../lib/scrollToSection'

const ProjectsSection = lazy(() =>
  import('../components/sections/ProjectsSection').then((module) => ({
    default: module.ProjectsSection,
  })),
)
const ExperienceSection = lazy(() =>
  import('../components/sections/ExperienceSection').then((module) => ({
    default: module.ExperienceSection,
  })),
)
const SkillsSection = lazy(() =>
  import('../components/sections/SkillsSection').then((module) => ({
    default: module.SkillsSection,
  })),
)
const AboutSection = lazy(() =>
  import('../components/sections/AboutSection').then((module) => ({
    default: module.AboutSection,
  })),
)

function LazySection({
  children,
  eager = false,
}: {
  children: ReactNode
  eager?: boolean
}) {
  return (
    <DeferredMount initialVisible={eager}>
      <Suspense fallback={null}>{children}</Suspense>
    </DeferredMount>
  )
}

export function HomePage() {
  useSectionScroll()
  const location = useLocation()
  const eagerBelowFold = Boolean(readSectionScrollState(location.state))

  return (
    <div className="relative">
      <GrainOverlay />
      <HeroSection />
      <LazySection eager={eagerBelowFold}>
        <ProjectsSection />
      </LazySection>
      <LazySection eager={eagerBelowFold}>
        <ExperienceSection />
      </LazySection>
      <LazySection eager={eagerBelowFold}>
        <SkillsSection />
      </LazySection>
      <LazySection eager={eagerBelowFold}>
        <AboutSection />
      </LazySection>
    </div>
  )
}
