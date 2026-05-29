import { createContext, lazy, Suspense, useContext, useMemo, useState, type ReactNode } from 'react'

interface ContactModalContextValue {
  openContact: () => void
}

const ContactModal = lazy(() =>
  import('../components/layout/ContactModal').then((module) => ({ default: module.ContactModal })),
)

const ContactModalContext = createContext<ContactModalContextValue | null>(null)

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const value = useMemo(() => ({ openContact: () => setOpen(true) }), [])

  return (
    <ContactModalContext.Provider value={value}>
      {children}
      {open ? (
        <Suspense fallback={null}>
          <ContactModal open={open} onClose={() => setOpen(false)} />
        </Suspense>
      ) : null}
    </ContactModalContext.Provider>
  )
}

export function useContactModal() {
  const ctx = useContext(ContactModalContext)
  if (!ctx) {
    throw new Error('useContactModal must be used within ContactModalProvider')
  }
  return ctx
}
