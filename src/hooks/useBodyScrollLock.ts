import { useEffect } from 'react'
import { acquireBodyScrollLock } from '../lib/bodyScrollLock'

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    return acquireBodyScrollLock()
  }, [active])
}
