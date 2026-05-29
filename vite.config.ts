import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { buildChatConfigFromEnv, handleNodeChatRequest } from './server/nodeChat'
import type { ChatHandlerConfig } from './server/chatApi'

function deepseekChatPlugin(chatConfig: ChatHandlerConfig): Plugin {
  return {
    name: 'deepseek-chat-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/chat')) {
          next()
          return
        }
        await handleNodeChatRequest(req, res, chatConfig)
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const chatConfig = buildChatConfigFromEnv(env)

  return {
    plugins: [
      react(),
      tailwindcss(),
      mode === 'development' ? deepseekChatPlugin(chatConfig) : undefined,
    ].filter(Boolean),
    build: {
      target: 'es2020',
      modulePreload: {
        polyfill: false,
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('/i18n/zh')) return 'i18n-zh'
            if (id.includes('/i18n/en')) return 'i18n-en'
            if (id.includes('framer-motion')) return 'vendor-motion'
            if (id.includes('react-router')) return 'vendor-router'
            if (
              id.includes('/react/') ||
              id.includes('/react-dom/') ||
              id.includes('scheduler/')
            ) {
              return 'vendor-react'
            }
          },
        },
      },
    },
  }
})
