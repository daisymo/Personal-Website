import { runChatApi } from './chatApi.js'
import type { ChatRequestBody } from '../shared/chatCore.js'

interface VercelRequest {
  method?: string
  body?: ChatRequestBody
  headers: Record<string, string | string[] | undefined>
  socket?: { remoteAddress?: string }
}

interface VercelResponse {
  status: (code: number) => VercelResponse
  json: (data: unknown) => void
  setHeader: (name: string, value: string) => VercelResponse
  end: () => void
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const result = await runChatApi(req.method ?? 'GET', req.body, req)

  if (result.headers) {
    for (const [key, value] of Object.entries(result.headers)) {
      res.setHeader(key, value)
    }
  }

  if (result.status === 204) {
    return res.status(204).end()
  }

  return res.status(result.status).json(result.json)
}
