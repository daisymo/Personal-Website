export type ChatRole = 'system' | 'user' | 'assistant'

export const CHAT_MODEL = 'deepseek-v4-flash' as const

export interface ChatMessage {
  role: ChatRole
  content: string
}

export interface ChatRequestBody {
  messages: ChatMessage[]
  locale?: 'zh' | 'en'
  profileHint?: string
}
export interface ChatSuccessResponse {
  content: string
  model: string
  fromClientCache?: boolean
  usage?: {
    prompt_cache_hit_tokens?: number
    prompt_cache_miss_tokens?: number
    completion_tokens?: number
  }
}

export interface ChatErrorResponse {
  error: string
  retryAfter?: number
}

export const CHAT_LIMITS = {
  maxMessages: 24,
  maxContentLen: 2000,
  maxProfileHintLen: 1200,
  maxTokens: 512,
} as const

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions'
/** Stable system prompts — keep byte-identical per locale for DeepSeek prefix cache. */
const SYSTEM_ZH =
  '你是 Aster 个人作品集网站上的 AI 助手。语气简洁、友好、略带文艺感。优先回答与访客、作品、技能、经历相关的问题；不确定时诚实说明。不要编造联系方式或敏感隐私。'

const SYSTEM_EN =
  "You are the AI assistant on Aster's personal portfolio site. Be concise, friendly, and slightly literary. Answer questions about the visitor, work, skills, and experience; say when you are unsure. Do not invent contact details or private data."

export function buildSystemContent(locale: 'zh' | 'en', profileHint?: string): string {  const base = locale === 'zh' ? SYSTEM_ZH : SYSTEM_EN
  const hint = profileHint?.trim().slice(0, CHAT_LIMITS.maxProfileHintLen)
  if (!hint) return base
  const label = locale === 'zh' ? '站点背景摘要' : 'Site context'
  return `${base}\n\n${label}:\n${hint}`
}

export function sanitizeHistory(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return []
  const out: ChatMessage[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const role = (item as ChatMessage).role
    const content = (item as ChatMessage).content
    if (role !== 'user' && role !== 'assistant') continue
    if (typeof content !== 'string' || !content.trim()) continue
    out.push({
      role,
      content: content.trim().slice(0, CHAT_LIMITS.maxContentLen),
    })
    if (out.length >= CHAT_LIMITS.maxMessages) break
  }
  return out
}

/** Prefix-stable message list: system first, then chronological history (append-only). */
export function buildDeepSeekMessages(
  locale: 'zh' | 'en',
  profileHint: string | undefined,
  history: ChatMessage[],
): ChatMessage[] {
  return [{ role: 'system', content: buildSystemContent(locale, profileHint) }, ...history]
}

export async function callDeepSeek(
  apiKey: string,
  messages: ChatMessage[],
  model: string,
  maxTokens: number,
): Promise<
  | { content: string; model: string; usage?: ChatSuccessResponse['usage'] }
  | { error: string; status: number }
> {
  const response = await fetch(DEEPSEEK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: maxTokens,
      stream: false,
    }),
  })

  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[]
    error?: { message?: string }
    usage?: {
      prompt_cache_hit_tokens?: number
      prompt_cache_miss_tokens?: number
      completion_tokens?: number
    }
  }

  if (!response.ok) {
    const msg = payload.error?.message ?? `DeepSeek API error (${response.status})`
    return { error: msg, status: response.status >= 500 ? 502 : response.status }
  }

  const content = payload.choices?.[0]?.message?.content?.trim()
  if (!content) {
    return { error: 'Empty response from DeepSeek.', status: 502 }
  }

  return {
    content,
    model,
    usage: payload.usage,
  }
}

export interface ChatHandlerConfig {
  apiKey: string | undefined
  rateLimitPerMinute: number
  rateLimitPerDay: number
  allowedOrigins: string[]
}

export interface ChatHandlerResult {
  status: number
  body: ChatSuccessResponse | ChatErrorResponse
  headers?: Record<string, string>
}

export class SlidingWindowRateLimiter {
  private readonly hits = new Map<string, number[]>()

  constructor(
    private max: number,
    private readonly windowMs: number,
  ) {}

  setMax(max: number): void {
    this.max = max
  }

  check(key: string): { ok: true } | { ok: false; retryAfter: number } {
    const now = Date.now()
    const windowStart = now - this.windowMs
    const list = (this.hits.get(key) ?? []).filter((t) => t > windowStart)
    this.hits.set(key, list)

    if (list.length >= this.max) {
      const retryAfter = Math.ceil((list[0]! + this.windowMs - now) / 1000)
      return { ok: false, retryAfter: Math.max(1, retryAfter) }
    }
    return { ok: true }
  }

  record(key: string): void {
    const now = Date.now()
    const windowStart = now - this.windowMs
    const list = (this.hits.get(key) ?? []).filter((t) => t > windowStart)
    list.push(now)
    this.hits.set(key, list)
  }
}

const minuteLimiter = new SlidingWindowRateLimiter(10, 60_000)
const dayLimiter = new SlidingWindowRateLimiter(100, 86_400_000)

export function parseAllowedOrigins(raw: string | undefined): string[] {
  if (!raw?.trim()) return []
  return raw
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)
}

function corsHeaders(origin: string | null, allowed: string[]): Record<string, string> {
  if (!origin || !allowed.includes(origin)) return {}
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
}

export function handleChatOptions(origin: string | null, allowed: string[]): ChatHandlerResult {
  return {
    status: 204,
    body: { error: '' },
    headers: corsHeaders(origin, allowed),
  }
}

export async function handleChatRequest(
  body: ChatRequestBody,
  clientKey: string,
  origin: string | null,
  config: ChatHandlerConfig,
): Promise<ChatHandlerResult> {
  const headers = corsHeaders(origin, config.allowedOrigins)

  if (!config.apiKey?.trim()) {
    return {
      status: 503,
      headers,
      body: { error: 'Chat API is not configured on the server.' },
    }
  }

  const perMinute = config.rateLimitPerMinute
  const perDay = config.rateLimitPerDay
  minuteLimiter.setMax(perMinute)
  dayLimiter.setMax(perDay)

  const dayCheck = dayLimiter.check(clientKey)
  if (!dayCheck.ok) {
    return {
      status: 429,
      headers: { ...headers, 'Retry-After': String(dayCheck.retryAfter) },
      body: { error: 'Daily chat limit reached. Please try again tomorrow.', retryAfter: dayCheck.retryAfter },
    }
  }

  const minCheck = minuteLimiter.check(clientKey)
  if (!minCheck.ok) {
    return {
      status: 429,
      headers: { ...headers, 'Retry-After': String(minCheck.retryAfter) },
      body: { error: 'Too many messages. Please wait a moment.', retryAfter: minCheck.retryAfter },
    }
  }

  const locale = body.locale === 'en' ? 'en' : 'zh'
  const history = sanitizeHistory(body.messages)
  if (history.length === 0) {
    return { status: 400, headers, body: { error: 'No messages provided.' } }
  }

  const messages = buildDeepSeekMessages(locale, body.profileHint, history)

  const result = await callDeepSeek(config.apiKey, messages, CHAT_MODEL, CHAT_LIMITS.maxTokens)
  if ('error' in result) {
    return { status: result.status, headers, body: { error: result.error } }
  }

  minuteLimiter.record(clientKey)
  dayLimiter.record(clientKey)

  return {
    status: 200,
    headers,
    body: {
      content: result.content,
      model: result.model,
      usage: result.usage,
    },
  }
}
