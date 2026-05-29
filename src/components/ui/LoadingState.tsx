import { motion, useReducedMotion } from '../../motion/framer'

interface LoadingStateProps {
  label: string
}

export function LoadingState({ label }: LoadingStateProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--bg)]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-8">
        <div className="relative h-14 w-14">
          <span className="absolute inset-0 rounded-2xl border-2 border-[var(--border)]" />
          <span className="absolute inset-2 rounded-xl bg-[var(--bg-muted)] loader-pulse" />
        </div>
        <motion.p
          className="text-sm font-medium text-[var(--ink-muted)]"
          animate={reduced ? undefined : { opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {label}
        </motion.p>
      </div>
    </motion.div>
  )
}
