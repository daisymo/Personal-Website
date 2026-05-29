import type { Locale } from '../data'
import type { ChatMessage } from '../types/chat'

const STORAGE_KEY = 'portfolio-chat-cache-v2'
const TTL_MS = 30 * 60 * 1000
const MAX_ENTRIES = 40

interface CacheEntry {
  content: string
  at: number
}

interface CacheStore {
  entries: Record<string, CacheEntry>
}

function hashString(input: string): string {
  let hash = 5381
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 33) ^ input.charCodeAt(i)
  }
  return (hash >>> 0).toString(36)
}

export function buildChatCacheKey(
  locale: Locale,
  profileHint: string,
  history: ChatMessage[],
): string {
  const payload = JSON.stringify({
    locale,
    profileHint,
    history: history.map((m) => ({ role: m.role, content: m.content })),
  })
  return hashString(payload)
}

function readStore(): CacheStore {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return { entries: {} }
    const parsed = JSON.parse(raw) as CacheStore
    if (!parsed.entries || typeof parsed.entries !== 'object') return { entries: {} }
    return parsed
  } catch {
    return { entries: {} }
  }
}

function writeStore(store: CacheStore): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // quota exceeded — ignore
  }
}

function prune(store: CacheStore): CacheStore {
  const now = Date.now()
  const entries: Record<string, CacheEntry> = {}
  for (const [key, entry] of Object.entries(store.entries)) {
    if (now - entry.at <= TTL_MS) entries[key] = entry
  }

  const keys = Object.keys(entries)
  if (keys.length <= MAX_ENTRIES) return { entries }

  keys
    .sort((a, b) => entries[a]!.at - entries[b]!.at)
    .slice(0, keys.length - MAX_ENTRIES)
    .forEach((key) => delete entries[key])

  return { entries }
}

export function getCachedChatReply(key: string): string | null {
  const store = prune(readStore())
  writeStore(store)
  const entry = store.entries[key]
  if (!entry) return null
  if (Date.now() - entry.at > TTL_MS) return null
  return entry.content
}

export function setCachedChatReply(key: string, content: string): void {
  const store = prune(readStore())
  store.entries[key] = { content, at: Date.now() }
  writeStore(prune(store))
}
