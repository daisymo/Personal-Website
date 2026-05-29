import type { NavItem, SectionId } from '../types/resume'
import type { UiStrings } from '../i18n/ui'
import type { SectionScrollState } from './scrollToSection'

export function buildNavItems(t: UiStrings): NavItem[] {
  return [
    { id: 'hero', label: t.nav.hero },
    { id: 'projects', label: t.nav.projects },
    { id: 'experience', label: t.nav.experience },
    { id: 'skills', label: t.nav.skills },
    { id: 'about', label: t.nav.about },
  ]
}

export function navHref(_id: SectionId) {
  return '/'
}

export function navScrollState(id: SectionId): SectionScrollState {
  return { scrollTo: id }
}
