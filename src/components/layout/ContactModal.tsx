import { useLanguage } from '../../hooks/useLanguage'
import { useClipboard } from '../../hooks/useClipboard'
import { CopyButton } from '../ui/CopyButton'
import { OverlayModal } from '../ui/OverlayModal'
import { cn } from '../../lib/cn'
import { ContactChannelIcon } from './ContactChannelIcon'

interface ContactModalProps {
  open: boolean
  onClose: () => void
}

export function ContactModal({ open, onClose }: ContactModalProps) {
  const { resume, t } = useLanguage()
  const { copiedId, copy } = useClipboard()

  if (!resume) return null

  return (
    <OverlayModal
      open={open}
      onClose={onClose}
      titleId="contact-modal-title"
      panelClassName="contact-modal__panel"
      ariaLabel={t.contact.close}
    >
      <header className="contact-modal__head">
        <div className="contact-modal__head-text">
          <p className="contact-modal__eyebrow">{t.nav.contact}</p>
          <h2 id="contact-modal-title" className="contact-modal__title">
            {t.contact.title}
          </h2>
          <p className="contact-modal__subtitle">{t.contact.subtitle}</p>
        </div>
        <button type="button" className="contact-modal__close" onClick={onClose}>
          ✕
        </button>
      </header>

      <div className="contact-modal__body">
        <ul className="contact-modal__list">
          {resume.contact.items.map((item) => (
            <li key={item.id} className="contact-modal__item">
              <span
                className={cn(
                  'contact-modal__icon',
                  item.id === 'wechat' && 'contact-modal__icon--wechat',
                )}
                aria-hidden
              >
                <ContactChannelIcon channelId={item.id} />
              </span>
              <div className="contact-modal__row">
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="contact-modal__value"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span className="contact-modal__value">{item.value}</span>
                )}
              </div>
              {item.copyable ? (
                <CopyButton
                  copied={copiedId === item.id}
                  copyLabel={t.contact.copy}
                  copiedLabel={t.contact.copied}
                  onCopy={() => copy(item.id, item.value)}
                />
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </OverlayModal>
  )
}
