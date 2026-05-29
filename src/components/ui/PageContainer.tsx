import type { ElementType, ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface PageContainerProps {
  children: ReactNode
  className?: string
  as?: ElementType
}

export function PageContainer({ children, className, as: Tag = 'div' }: PageContainerProps) {
  return <Tag className={cn('page-container', className)}>{children}</Tag>
}
