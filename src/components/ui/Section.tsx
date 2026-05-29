import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface SectionProps {
  id?: string
  children: ReactNode
  className?: string
  tone?: 'white' | 'subtle'
}

const toneStyles: Record<NonNullable<SectionProps['tone']>, string> = {
  white: 'section-tone-white',
  subtle: 'section-tone-subtle',
}

export function Section({ id, children, className, tone = 'white' }: SectionProps) {
  return (
    <section id={id} className={cn('page-section', toneStyles[tone], className)}>
      {children}
    </section>
  )
}
