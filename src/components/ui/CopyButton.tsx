interface CopyButtonProps {
  copied: boolean
  copyLabel: string
  copiedLabel: string
  onCopy: () => void
  inverted?: boolean
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CopyButton({
  copied,
  copyLabel,
  copiedLabel,
  onCopy,
  inverted = false,
}: CopyButtonProps) {
  return (
    <button
      type="button"
      onClick={onCopy}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all ${
        copied
          ? inverted
            ? 'border-[var(--bg)] bg-[var(--bg)] text-[var(--ink)]'
            : 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]'
          : inverted
            ? 'border-white/25 bg-white/10 text-white hover:border-white/40 hover:bg-white/15'
            : 'border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--ink-muted)] hover:border-[var(--border-strong)] hover:text-[var(--ink)]'
      }`}
      aria-label={copied ? copiedLabel : copyLabel}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  )
}
