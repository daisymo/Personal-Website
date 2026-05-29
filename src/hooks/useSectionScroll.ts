import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { readSectionScrollState, scrollToSection } from '../lib/scrollToSection'

export function useSectionScroll() {
  const location = useLocation()
  const navigate = useNavigate()
  const scrollTo = readSectionScrollState(location.state)

  useEffect(() => {
    if (location.pathname !== '/' || !scrollTo) return

    const timer = window.setTimeout(() => {
      scrollToSection(scrollTo)
      navigate(location.pathname, { replace: true, state: null })
    }, 80)

    return () => window.clearTimeout(timer)
  }, [location.pathname, scrollTo, navigate])
}
