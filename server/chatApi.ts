import {
  handleChatOptions,
  handleChatRequest,
  parseAllowedOrigins,
  type ChatHandlerConfig,
  type ChatRequestBody,
} from '../shared/chatCore'

function readConfig(): ChatHandlerConfig {
  return {
    apiKey: process.env.DEEPSEEK_API_KEY,
    rateLimitPerMinute: Number(process.env.CHAT_RATE_LIMIT_PER_MINUTE ?? 10),
    rateLimitPerDay: Number(process.env.CHAT_RATE_LIMIT_PER_DAY ?? 100),
    allowedOrigins: parseAllowedOrigins(process.env.CHAT_ALLOWED_ORIGINS),
  }
}

function clientKeyFromRequest(req: {
  headers: Record<string, string | string[] | undefined>
  socket?: { remoteAddress?: string }
}): string {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded) return forwarded.split(',')[0]!.trim()
  return req.socket?.remoteAddress ?? 'unknown'
}

export async function runChatApi(
  method: string,
  body: ChatRequestBody | undefined,
  req: {
    headers: Record<string, string | string[] | undefined>
    socket?: { remoteAddress?: string }
  },
  configOverride?: ChatHandlerConfig,
): Promise<{ status: number; json: unknown; headers?: Record<string, string> }> {
  const config = configOverride ?? readConfig()
  const origin = typeof req.headers.origin === 'string' ? req.headers.origin : null

  if (method === 'OPTIONS') {
    const result = handleChatOptions(origin, config.allowedOrigins)
    return { status: result.status, json: null, headers: result.headers }
  }

  if (method !== 'POST') {
    return { status: 405, json: { error: 'Method not allowed' } }
  }

  const clientKey = clientKeyFromRequest(req)
  const result = await handleChatRequest(body ?? { messages: [] }, clientKey, origin, config)
  return { status: result.status, json: result.body, headers: result.headers }
}

export { parseAllowedOrigins, type ChatHandlerConfig }
