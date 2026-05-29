interface ErrorStateProps {
  message: string
  retryLabel: string
  onRetry: () => void
}

export function ErrorState({ message, retryLabel, onRetry }: ErrorStateProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 bg-[var(--white)] px-4 text-center">
      <p className="max-w-md text-lg font-medium text-[var(--ink-muted)]">{message}</p>
      <button type="button" onClick={onRetry} className="btn-primary">
        {retryLabel}
      </button>
    </div>
  )
}
