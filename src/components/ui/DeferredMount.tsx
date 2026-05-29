import { useEffect, useRef, useState, type ReactNode } from 'react'

interface DeferredMountProps {
  children: ReactNode
  rootMargin?: string
  minHeight?: string
  initialVisible?: boolean
}

export function DeferredMount({
  children,
  rootMargin = '280px 0px',
  minHeight,
  initialVisible = false,
}: DeferredMountProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [scrolledIntoView, setScrolledIntoView] = useState(
    () => typeof window !== 'undefined' && !('IntersectionObserver' in window),
  )
  const visible = initialVisible || scrolledIntoView

  useEffect(() => {
    if (visible) return

    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setScrolledIntoView(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [rootMargin, visible])

  return (
    <div ref={ref} style={minHeight ? { minHeight } : undefined}>
      {visible ? children : null}
    </div>
  )
}
