import { AnimatePresence, motion, useReducedMotion } from '../../motion/framer'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import { useContactModal } from '../../context/ContactModalContext'
import { useLanguage } from '../../hooks/useLanguage'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useScrollThreshold } from '../../hooks/useScrollThreshold'
import { buildNavItems, navHref, navScrollState } from '../../lib/navigation'
import { scrollToSection } from '../../lib/scrollToSection'
import { cn } from '../../lib/cn'
import { AsterMark } from '../ui/AsterMark'
import type { SectionId } from '../../types/resume'

function NavLinks({
  isHome,
  onNavigate,
  className,
  linkClassName,
}: {
  isHome: boolean
  onNavigate?: () => void
  className?: string
  linkClassName: (id: SectionId) => string
}) {
  const { t } = useLanguage()
  const navItems = useMemo(() => buildNavItems(t), [t])

  return (
    <nav className={className} aria-label="Main">
      <ul className="top-nav__items">
        {navItems.map((item) => (
          <li key={item.id}>
            <Link
              to={navHref()}
              state={navScrollState(item.id)}
              className={linkClassName(item.id)}
              onClick={(event) => {
                if (isHome) {
                  event.preventDefault()
                  scrollToSection(item.id)
                }
                onNavigate?.()
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function SiteNav() {
  const { t, toggleLocale, resume } = useLanguage()
  const { openContact } = useContactModal()
  const reduced = useReducedMotion()
  const scrolled = useScrollThreshold(8)
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const isHome = location.pathname === '/'
  const navItems = useMemo(() => buildNavItems(t), [t])
  const sectionIds = useMemo(() => navItems.map((item) => item.id), [navItems])
  const activeSection = useActiveSection(sectionIds, isHome)
  const displayName = resume?.profile.name ?? 'Portfolio'

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrawerOpen(false)
  }, [location.pathname, location.state])

  useBodyScrollLock(drawerOpen)

  const topLinkClass = (id: SectionId) =>
    cn('top-nav__link', isHome && activeSection === id && 'top-nav__link--active')

  const drawerLinkClass = (id: SectionId) =>
    cn('drawer-nav__link', isHome && activeSection === id && 'drawer-nav__link--active')

  const closeDrawer = () => setDrawerOpen(false)
  const handleOpenContact = () => {
    closeDrawer()
    openContact()
  }

  return (
    <>
      <header className={cn('site-header', scrolled && 'site-header--scrolled')}>
        <div className="site-header__inner">
          <Link to="/" className="site-header__brand" aria-label={displayName}>
            <span className="logo-mark">
              <AsterMark />
            </span>
          </Link>

          <NavLinks
            isHome={isHome}
            className="top-nav__list"
            linkClassName={topLinkClass}
          />

          <div className="site-header__actions">
            <motion.button
              type="button"
              onClick={toggleLocale}
              className="header-action lang-toggle"
              whileTap={reduced ? undefined : { scale: 0.97 }}
            >
              {t.common.langToggle}
            </motion.button>
            <button type="button" className="header-action btn-contact" onClick={openContact}>
              {t.nav.contact}
            </button>
            <button
              type="button"
              className="menu-btn"
              aria-expanded={drawerOpen}
              aria-controls="nav-drawer"
              onClick={() => setDrawerOpen((open) => !open)}
            >
              <span className="sr-only">Menu</span>
              <span aria-hidden>{drawerOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {drawerOpen ? (
          <motion.div
            id="nav-drawer"
            className="nav-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              className="nav-drawer__backdrop"
              aria-label="Close menu"
              onClick={closeDrawer}
            />
            <motion.div
              className="nav-drawer__panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <NavLinks
                isHome={isHome}
                onNavigate={closeDrawer}
                className="drawer-nav__list"
                linkClassName={drawerLinkClass}
              />
              <div className="nav-drawer__actions">
                <button type="button" className="header-action btn-contact btn-contact--block" onClick={handleOpenContact}>
                  {t.nav.contact}
                </button>
                <button type="button" className="header-action lang-toggle lang-toggle--block" onClick={toggleLocale}>
                  {t.common.langToggle}
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
