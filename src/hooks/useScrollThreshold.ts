import { useEffect, useState } from 'react'

export function useScrollThreshold(threshold = 16) {
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const updateState = () => setTriggered(window.scrollY > threshold)
    updateState()
    window.addEventListener('scroll', updateState, { passive: true })
    return () => window.removeEventListener('scroll', updateState)
  }, [threshold])

  return triggered
}
