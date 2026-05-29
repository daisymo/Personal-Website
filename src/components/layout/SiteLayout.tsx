import { lazy, Suspense, useEffect, useState } from 'react'
import { ContactModalProvider } from '../../context/ContactModalContext'
import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { SiteNav } from './SiteNav'
import { PageAmbient } from '../motion/PageAmbient'

const ScrollProgress = lazy(() =>
  import('../motion/ScrollProgress').then((module) => ({ default: module.ScrollProgress })),
)
const FloatingChatWidget = lazy(() =>
  import('../chat/FloatingChatWidget').then((module) => ({ default: module.FloatingChatWidget })),
)

export function SiteLayout() {
  const [showDeferredUi, setShowDeferredUi] = useState(false)

  useEffect(() => {
    const idle = window.requestIdleCallback(() => setShowDeferredUi(true))
    return () => window.cancelIdleCallback(idle)
  }, [])

  return (
    <ContactModalProvider>
      <div className="site-shell">
        <PageAmbient />
        {showDeferredUi ? (
          <Suspense fallback={null}>
            <ScrollProgress />
          </Suspense>
        ) : null}
        <SiteNav />
        <div className="site-main">
          <main className="site-content">
            <Outlet />
          </main>
          <Footer />
        </div>
        {showDeferredUi ? (
          <Suspense fallback={null}>
            <FloatingChatWidget />
          </Suspense>
        ) : null}
      </div>
    </ContactModalProvider>
  )
}
