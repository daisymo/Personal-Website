import type { IncomingMessage } from 'node:http'
import { runChatApi, type ChatHandlerConfig } from './chatApi'
import type { ChatRequestBody } from '../shared/chatCore'

function readJsonBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
    })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

export async function handleNodeChatRequest(
  req: IncomingMessage,
  res: import('node:http').ServerResponse,
  chatConfig?: ChatHandlerConfig,
) {
  const run = (method: string, body?: ChatRequestBody) =>
    runChatApi(method, body, {
      headers: req.headers as Record<string, string | string[] | undefined>,
      socket: req.socket,
    }, chatConfig)

  if (req.method === 'OPTIONS') {
    const result = await run('OPTIONS')
    if (result.headers) {
      for (const [key, value] of Object.entries(result.headers)) {
        res.setHeader(key, value)
      }
    }
    res.statusCode = 204
    res.end()
    return
  }

  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  try {
    const raw = await readJsonBody(req)
    const body = JSON.parse(raw || '{}') as ChatRequestBody
    const result = await run('POST', body)

    if (result.headers) {
      for (const [key, value] of Object.entries(result.headers)) {
        res.setHeader(key, value)
      }
    }
    res.statusCode = result.status
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(result.json))
  } catch {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Chat request failed.' }))
  }
}

export function buildChatConfigFromEnv(env: Record<string, string>): ChatHandlerConfig {
  return {
    apiKey: env.DEEPSEEK_API_KEY,
    rateLimitPerMinute: Number(env.CHAT_RATE_LIMIT_PER_MINUTE ?? 10),
    rateLimitPerDay: Number(env.CHAT_RATE_LIMIT_PER_DAY ?? 100),
    allowedOrigins: env.CHAT_ALLOWED_ORIGINS
      ? env.CHAT_ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
      : [],
  }
}
