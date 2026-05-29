const MIN_INTERVAL_MS = 2500
let lastSentAt = 0

export function canSendChatNow(): boolean {
  return Date.now() - lastSentAt >= MIN_INTERVAL_MS
}

export function markChatSent(): void {
  lastSentAt = Date.now()
}

export function msUntilNextChatSend(): number {
  const wait = MIN_INTERVAL_MS - (Date.now() - lastSentAt)
  return wait > 0 ? wait : 0
}
