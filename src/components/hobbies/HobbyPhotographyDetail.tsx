import { useCallback, useEffect, useState } from 'react'
import type { AboutTag } from '../../types/resume'
import { useLanguage } from '../../hooks/useLanguage'
import { OverlayModal } from '../ui/OverlayModal'
import { HobbyDetailShell } from './HobbyDetailShell'

interface HobbyPhotographyDetailProps {
  hobby: AboutTag
}

export function HobbyPhotographyDetail({ hobby }: HobbyPhotographyDetailProps) {
  const { t } = useLanguage()
  const photos = hobby.photos ?? []
  const total = photos.length
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const closeLightbox = useCallback(() => setActiveIndex(null), [])
  const showPrev = useCallback(() => {
    setActiveIndex((index) => {
      if (index === null || total === 0) return index
      return (index - 1 + total) % total
    })
  }, [total])
  const showNext = useCallback(() => {
    setActiveIndex((index) => {
      if (index === null || total === 0) return index
      return (index + 1) % total
    })
  }, [total])

  useEffect(() => {
    if (activeIndex === null) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') showPrev()
      if (event.key === 'ArrowRight') showNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeIndex, showPrev, showNext])

  const activePhoto = activeIndex !== null ? photos[activeIndex] : null

  return (
    <HobbyDetailShell hobby={hobby} variant="photo" hideYear hideEyebrow>
      <div className="photo-folio">
        <header className="photo-folio__head">
          <p className="photo-folio__kicker">{t.hobbies.photoFolio}</p>
          <p className="photo-folio__stat">
            <span className="photo-folio__stat-num">{total}</span>
            <span className="photo-folio__stat-label">{t.hobbies.photoFrames}</span>
          </p>
        </header>

        <div className="photo-folio__masonry" role="list">
          {photos.map((photo, index) => (
            <figure key={photo.id} className="photo-folio__tile" role="listitem">
              <button
                type="button"
                className="photo-folio__trigger"
                onClick={() => setActiveIndex(index)}
                aria-label={`${t.hobbies.photoExpand} ${index + 1}`}
              >
                <span className="photo-folio__index" aria-hidden>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <img src={photo.src} alt={photo.caption ?? ''} loading="lazy" decoding="async" />
              </button>
              {photo.caption ? <figcaption className="photo-folio__caption">{photo.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>

      <OverlayModal
        open={activeIndex !== null}
        onClose={closeLightbox}
        ariaLabel={t.hobbies.photoExpand}
        panelClassName="photo-lightbox__panel"
        panelStyle={{ ['--modal-width' as string]: 'min(96vw, 72rem)' }}
      >
        {activePhoto && activeIndex !== null ? (
          <div className="photo-lightbox">
            <div className="photo-lightbox__toolbar">
              <span className="photo-lightbox__counter" aria-live="polite">
                {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
              <button type="button" className="photo-lightbox__close" onClick={closeLightbox}>
                {t.hobbies.photoClose}
              </button>
            </div>
            <div className="photo-lightbox__stage">
              {total > 1 ? (
                <button type="button" className="photo-lightbox__nav photo-lightbox__nav--prev" onClick={showPrev}>
                  <span aria-hidden>‹</span>
                  <span className="sr-only">{t.hobbies.photoPrev}</span>
                </button>
              ) : null}
              <img
                key={activePhoto.src}
                className="photo-lightbox__image"
                src={activePhoto.src}
                alt={activePhoto.caption ?? ''}
                decoding="async"
              />
              {total > 1 ? (
                <button type="button" className="photo-lightbox__nav photo-lightbox__nav--next" onClick={showNext}>
                  <span aria-hidden>›</span>
                  <span className="sr-only">{t.hobbies.photoNext}</span>
                </button>
              ) : null}
            </div>
            {activePhoto.caption ? (
              <p className="photo-lightbox__caption">{activePhoto.caption}</p>
            ) : null}
          </div>
        ) : null}
      </OverlayModal>
    </HobbyDetailShell>
  )
}
