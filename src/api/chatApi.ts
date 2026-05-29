import type { Locale } from '../data'
import type { ChatMessage } from '../types/chat'
import {
  buildChatCacheKey,
  getCachedChatReply,
  setCachedChatReply,
} from '../lib/chatCache'

interface ChatApiMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatApiResult {
  content: string
  fromClientCache: boolean
}

function resolveChatUrl(): string {
  const base = import.meta.env.VITE_CHAT_API_URL?.trim().replace(/\/$/, '')
  if (base) return `${base}/chat`
  return '/api/chat'
}

export async function sendChatMessage(
  history: ChatMessage[],
  locale: Locale,
  profileHint: string,
): Promise<ChatApiResult> {
  const cacheKey = buildChatCacheKey(locale, profileHint, history)
  const cached = getCachedChatReply(cacheKey)
  if (cached) {
    return { content: cached, fromClientCache: true }
  }

  const messages: ChatApiMessage[] = history.map((m) => ({
    role: m.role,
    content: m.content,
  }))

  const response = await fetch(resolveChatUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, locale, profileHint }),
  })

  const data = (await response.json()) as {
    content?: string
    error?: string
    retryAfter?: number
  }

  if (!response.ok) {
    if (response.status === 429 && data.retryAfter) {
      throw new Error(`${data.error ?? 'Rate limited'} (${data.retryAfter}s)`)
    }
    throw new Error(data.error ?? `Request failed (${response.status})`)
  }

  if (!data.content) {
    throw new Error('Empty response')
  }

  setCachedChatReply(cacheKey, data.content)
  return { content: data.content, fromClientCache: false }
}
