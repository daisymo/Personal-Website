import { useEffect, useRef, useState } from 'react'

export type ContainerTier = 'xs' | 'sm' | 'md' | 'lg'

function tierFromSide(side: number): ContainerTier {
  if (side < 260) return 'xs'
  if (side < 360) return 'sm'
  if (side < 500) return 'md'
  return 'lg'
}

export function useContainerSize<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [minSide, setMinSide] = useState(0)
  const [tier, setTier] = useState<ContainerTier>('lg')

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const update = (width: number, height: number) => {
      const side = Math.min(width, height)
      setMinSide(side)
      setTier(tierFromSide(side))
    }

    update(el.clientWidth, el.clientHeight)
    const ro = new ResizeObserver(([entry]) => {
      update(entry.contentRect.width, entry.contentRect.height)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return { ref, minSide, tier }
}
