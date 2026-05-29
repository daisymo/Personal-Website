interface ContactChannelIconProps {
  channelId: string
  className?: string
}

export function ContactChannelIcon({ channelId, className }: ContactChannelIconProps) {
  const cn = className ?? 'contact-modal__icon-svg'

  switch (channelId) {
    case 'email':
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 6.5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="m5 8 7 5.25L19 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    case 'wechat':
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M9.5 3C5.91 3 3 5.46 3 8.5c0 1.66.87 3.14 2.24 4.08L4 17l3.02-1.2A8.4 8.4 0 0 0 9.5 14c.3 0 .6-.02.88-.06C9.94 16.44 12.6 19 16 19c.35 0 .7-.03 1.03-.08l2.67 1.06-.72-2.45A4.9 4.9 0 0 0 21 14.5C21 11.46 18.09 9 14.5 9c-.34 0-.67.03-1 .08C12.6 5.56 11.2 3 9.5 3Zm-2 6.25a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Zm4 0a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Zm5.5 4.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Zm3 0a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
        </svg>
      )
    case 'github':
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.12-1.5-1.12-1.5-.92-.65.07-.64.07-.64 1.02.07 1.55 1.07 1.55 1.07.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.27 2.75 1.04A9.2 9.2 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.31 2.75-1.04 2.75-1.04.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
        </svg>
      )
    case 'phone':
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M8.5 4h2l1.2 5-2.2 1.2a11 11 0 0 0 4.3 4.3L15 12.3 20 13.5v2a2 2 0 0 1-2 1.8A14.5 14.5 0 0 1 5.7 6.5 2 2 0 0 1 7.5 4.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'location':
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 21s6-5.15 6-10a6 6 0 1 0-12 0c0 4.85 6 10 6 10Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="12" cy="11" r="2.25" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    default:
      return (
        <svg className={cn} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
  }
}
