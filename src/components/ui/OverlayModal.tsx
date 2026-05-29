import { AnimatePresence, motion, useReducedMotion } from '../../motion/framer'
import { useEffect, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'

interface OverlayModalProps {
  open: boolean
  onClose: () => void
  titleId?: string
  ariaLabel?: string
  panelClassName?: string
  panelStyle?: CSSProperties
  children: ReactNode
}

export function OverlayModal({
  open,
  onClose,
  titleId,
  ariaLabel,
  panelClassName,
  panelStyle,
  children,
}: OverlayModalProps) {
  const reduced = useReducedMotion()
  useBodyScrollLock(open)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="overlay-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-label={ariaLabel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <motion.button
            type="button"
            className="overlay-modal__backdrop"
            aria-label={ariaLabel ?? 'Close'}
            onClick={onClose}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.28 }}
          />
          <motion.div
            className={panelClassName ? `overlay-modal__panel ${panelClassName}` : 'overlay-modal__panel'}
            style={panelStyle}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: 12 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            onClick={(event) => event.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
