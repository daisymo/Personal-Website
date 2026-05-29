import { runChatApi, parseAllowedOrigins, type ChatHandlerConfig } from '../server/chatApi'
import type { ChatRequestBody } from '../shared/chatCore'

export interface Env {
  DEEPSEEK_API_KEY: string
  CHAT_RATE_LIMIT_PER_MINUTE?: string
  CHAT_RATE_LIMIT_PER_DAY?: string
  CHAT_ALLOWED_ORIGINS?: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    if (!url.pathname.endsWith('/chat') && url.pathname !== '/') {
      return new Response('Not found', { status: 404 })
    }

    let body: ChatRequestBody | undefined
    if (request.method === 'POST') {
      try {
        body = (await request.json()) as ChatRequestBody
      } catch {
        return Response.json({ error: 'Invalid JSON body.' }, { status: 400 })
      }
    }

    const headers: Record<string, string | string[] | undefined> = {}
    request.headers.forEach((value, key) => {
      headers[key] = value
    })

    const clientIp = request.headers.get('CF-Connecting-IP') ?? 'unknown'
    headers['x-forwarded-for'] = clientIp

    const config: ChatHandlerConfig = {
      apiKey: env.DEEPSEEK_API_KEY,
      rateLimitPerMinute: Number(env.CHAT_RATE_LIMIT_PER_MINUTE ?? 10),
      rateLimitPerDay: Number(env.CHAT_RATE_LIMIT_PER_DAY ?? 100),
      allowedOrigins: parseAllowedOrigins(env.CHAT_ALLOWED_ORIGINS),
    }

    const result = await runChatApi(request.method, body, { headers }, config)

    const responseHeaders = new Headers(result.headers ?? {})
    if (result.status !== 204) {
      responseHeaders.set('Content-Type', 'application/json')
    }

    if (result.status === 204) {
      return new Response(null, { status: 204, headers: responseHeaders })
    }

    return Response.json(result.json, { status: result.status, headers: responseHeaders })
  },
}
