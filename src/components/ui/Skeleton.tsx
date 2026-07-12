import type { ReactNode } from 'react'

interface SkeletonProps {
  className?: string
  children?: ReactNode
}

function SkeletonBlock({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-[var(--bg-muted)] rounded-[var(--radius-md)] ${className}`}
    />
  )
}

export function Skeleton({ children }: SkeletonProps) {
  return <>{children}</>
}

Skeleton.Block = SkeletonBlock

export function HeroSkeleton() {
  return (
    <section className="hero">
      <div className="hero__container">
        <div className="hero__grid-layout">
          <div className="hero__info">
            <Skeleton.Block className="h-5 w-32 mb-6" />
            <Skeleton.Block className="h-16 w-64 mb-4" />
            <Skeleton.Block className="h-6 w-40 mb-6" />
            <Skeleton.Block className="h-8 w-80 mb-6" />
            <Skeleton.Block className="h-12 w-48" />
          </div>
          <div className="hero__canvas">
            <Skeleton.Block className="w-full h-full rounded-full" />
          </div>
        </div>
      </div>
    </section>
  )
}

export function SectionSkeleton() {
  return (
    <section className="page-section">
      <div className="section-head">
        <Skeleton.Block className="h-4 w-20 mb-4" />
        <Skeleton.Block className="h-10 w-64 mb-4" />
        <Skeleton.Block className="h-6 w-80" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton.Block key={i} className="h-40 w-full" />
        ))}
      </div>
    </section>
  )
}
