interface ChatFabIconProps {
  open: boolean
}

/** Chibi star mascot for the floating AI assistant button. */
export function ChatFabIcon({ open }: ChatFabIconProps) {
  if (open) {
    return (
      <svg className="chat-fab-icon chat-fab-icon--close" viewBox="0 0 32 32" fill="none" aria-hidden>
        <path
          d="M10 10.5 22 21.5M22 10.5 10 21.5"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  return (
    <svg className="chat-fab-icon chat-fab-icon--mascot" viewBox="0 0 32 32" fill="none" aria-hidden>
      <ellipse className="chat-fab-icon__shadow" cx="16" cy="27.8" rx="7.5" ry="1.75" fill="#6b93d4" fillOpacity="0.28" />
      <g className="chat-fab-icon__bob">
        <path
          d="M16 28.5c-1.35 0-2.45-.4-3.4-1.2L5.8 27.6l1.4-6.6C5.9 19.2 5.2 17.1 5.2 15 5.2 8.05 10 3 16 3s10.8 5.05 10.8 12c0 3.1-.7 5.2-2 5.9l1.4 6.6-6.8-.7c-.95.8-2.05 1.2-3.4 1.2Z"
          fill="#ffffff"
          fillOpacity="0.35"
        />
        <path
          className="chat-fab-icon__body"
          d="M16 26.8c-1.1 0-2-.32-2.8-.95L7.5 26l1.1-5.2c-.5-1.05-.8-2.2-.8-3.45 0-5.55 3.55-9.35 8.2-9.35s8.2 3.8 8.2 9.35c0 1.25-.3 2.4-.8 3.45l1.1 5.2-5.7-.85c-.8.63-1.7.95-2.8.95Z"
          fill="#ffffff"
          stroke="currentColor"
          strokeWidth="1.15"
        />
        <path
          className="chat-fab-icon__arm chat-fab-icon__arm--l"
          d="M8.8 16.8c-1.55.75-2.55 1.75-2.7 2.85"
          stroke="currentColor"
          strokeWidth="1.45"
          strokeLinecap="round"
        />
        <path
          className="chat-fab-icon__arm chat-fab-icon__arm--r"
          d="M23.2 16.8c1.55.75 2.55 1.75 2.7 2.85"
          stroke="currentColor"
          strokeWidth="1.45"
          strokeLinecap="round"
        />
        <g className="chat-fab-icon__face">
          <ellipse cx="11.7" cy="15.6" rx="2.55" ry="2.85" fill="currentColor" />
          <ellipse cx="20.3" cy="15.6" rx="2.55" ry="2.85" fill="currentColor" />
          <ellipse className="chat-fab-icon__eye-shine" cx="12.5" cy="14.55" rx="0.95" ry="1.05" fill="#ffffff" />
          <ellipse className="chat-fab-icon__eye-shine" cx="21.1" cy="14.55" rx="0.95" ry="1.05" fill="#ffffff" />
          <circle cx="13.15" cy="16.2" r="0.5" fill="#b8cff0" />
          <circle cx="21.75" cy="16.2" r="0.5" fill="#b8cff0" />
          <ellipse className="chat-fab-icon__blush chat-fab-icon__blush--l" cx="9.7" cy="17.2" rx="1.5" ry="1" fill="#ffb8cc" fillOpacity="0.8" />
          <ellipse className="chat-fab-icon__blush chat-fab-icon__blush--r" cx="22.3" cy="17.2" rx="1.5" ry="1" fill="#ffb8cc" fillOpacity="0.8" />
          <ellipse className="chat-fab-icon__mouth" cx="16" cy="19.85" rx="2.1" ry="1.45" fill="#ff8fab" fillOpacity="0.9" />
          <ellipse className="chat-fab-icon__mouth-inner" cx="16" cy="19.55" rx="1.35" ry="0.85" fill="#ffffff" fillOpacity="0.55" />
        </g>
        <path
          className="chat-fab-icon__antenna"
          d="M16 8.2V5.2M12.4 6.4l1.2 2M19.6 6.4l-1.2 2"
          stroke="currentColor"
          strokeWidth="1.05"
          strokeLinecap="round"
          strokeOpacity="0.5"
        />
        <path
          className="chat-fab-icon__star"
          d="M16 4.2 16.55 5.85 18.25 5.85 16.9 6.85 17.45 8.5 16 7.55 14.55 8.5 15.1 6.85 13.75 5.85 15.45 5.85Z"
          fill="#ffd76b"
          stroke="#f5b84a"
          strokeWidth="0.35"
        />
        <circle className="chat-fab-icon__spark chat-fab-icon__spark--a" cx="24.8" cy="9.2" r="0.6" fill="#ffd76b" />
        <circle className="chat-fab-icon__spark chat-fab-icon__spark--b" cx="7.5" cy="10.8" r="0.45" fill="#ffb8cc" />
        <path
          className="chat-fab-icon__spark chat-fab-icon__spark--c"
          d="M26.5 14.2 26.85 15.05 27.7 15.4 26.85 15.75 26.5 16.6 26.15 15.75 25.3 15.4 26.15 15.05Z"
          fill="#b8cff0"
        />
        <path
          className="chat-fab-icon__heart"
          d="M6.2 14.1c0-1 .75-1.55 1.45-1.55.55 0 1 .35 1.25.8.25-.45.7-.8 1.25-.8.7 0 1.45.55 1.45 1.55 0 1.15-1.35 2.15-2.7 3.05-1.35-.9-2.7-1.9-2.7-3.05Z"
          fill="#ff8fab"
          fillOpacity="0.85"
        />
      </g>
    </svg>
  )
}
