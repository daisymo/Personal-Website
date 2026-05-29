import type { SectionId } from '../types/resume'

export function scrollToSection(id: SectionId, behavior: ScrollBehavior = 'smooth') {
  if (id === 'hero') {
    window.scrollTo({ top: 0, behavior })
    return
  }
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior, block: 'start' })
}

export type SectionScrollState = {
  scrollTo?: SectionId
}

export function readSectionScrollState(state: unknown): SectionId | undefined {
  if (!state || typeof state !== 'object') return undefined
  const scrollTo = (state as SectionScrollState).scrollTo
  if (
    scrollTo === 'hero' ||
    scrollTo === 'projects' ||
    scrollTo === 'experience' ||
    scrollTo === 'skills' ||
    scrollTo === 'about'
  ) {
    return scrollTo
  }
  return undefined
}
