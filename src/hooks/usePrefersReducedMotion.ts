import { useReducedMotion } from '../motion/framer'

export function usePrefersReducedMotion(): boolean {
  return useReducedMotion() ?? false
}
