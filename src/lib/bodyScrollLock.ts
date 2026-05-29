let lockCount = 0
let savedScrollY = 0

function scrollbarWidth(): number {
  return Math.max(0, window.innerWidth - document.documentElement.clientWidth)
}

function lock() {
  savedScrollY = window.scrollY
  const width = scrollbarWidth()
  document.documentElement.classList.add('is-scroll-locked')
  document.documentElement.style.setProperty('--scrollbar-width', `${width}px`)
  document.body.classList.add('body-scroll-locked')
  document.body.style.top = `-${savedScrollY}px`
}

function unlock() {
  const scrollY = savedScrollY
  document.documentElement.classList.remove('is-scroll-locked')
  document.documentElement.style.removeProperty('--scrollbar-width')
  document.body.classList.remove('body-scroll-locked')
  document.body.style.top = ''
  requestAnimationFrame(() => {
    if (Math.abs(window.scrollY - scrollY) > 2) {
      window.scrollTo({ top: scrollY, left: 0, behavior: 'instant' })
    }
  })
}

/** Ref-counted scroll lock via fixed body — avoids scrollbar layout shift. */
export function acquireBodyScrollLock(): () => void {
  lockCount += 1
  if (lockCount === 1) lock()
  return () => {
    lockCount = Math.max(0, lockCount - 1)
    if (lockCount === 0) unlock()
  }
}
