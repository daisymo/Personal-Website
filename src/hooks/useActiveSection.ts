import { useEffect, useState } from 'react'
import type { SectionId } from '../types/resume'

export function useActiveSection(sectionIds: SectionId[], enabled: boolean) {
  const [active, setActive] = useState<SectionId>(sectionIds[0] ?? 'hero')

  useEffect(() => {
    if (!enabled || sectionIds.length === 0) return

    const visible = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.target.id) continue
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }

        let bestId = sectionIds[0]
        let bestRatio = 0
        for (const id of sectionIds) {
          const ratio = visible.get(id) ?? 0
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestId = id
          }
        }
        if (bestRatio > 0) setActive(bestId)
      },
      { rootMargin: '-28% 0px -55% 0px', threshold: [0, 0.15, 0.35, 0.55, 0.75] },
    )

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [enabled, sectionIds])

  return active
}
