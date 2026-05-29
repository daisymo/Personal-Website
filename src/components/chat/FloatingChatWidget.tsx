import { AnimatePresence, motion } from '../../motion/framer'
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { sendChatMessage } from '../../api/chatApi'
import { canSendChatNow, markChatSent, msUntilNextChatSend } from '../../lib/chatClientLimit'
import { useLanguage } from '../../hooks/useLanguage'
import type { ChatMessage } from '../../types/chat'
import { ChatFabIcon } from './ChatFabIcon'

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function buildProfileHint(
  profile: { name: string; title: string; summary: string; location: string } | undefined,
): string {
  if (!profile) return ''
  return `${profile.name} · ${profile.title} · ${profile.location}\n${profile.summary}`
}

export function FloatingChatWidget() {
  const { resume, locale, t } = useLanguage()
  const titleId = useId()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const toggle = useCallback(() => {
    setOpen((prev) => {
      if (prev) {
        inputRef.current?.blur()
      }
      return !prev
    })
    setError(null)
  }, [])

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => inputRef.current?.focus(), 120)
    return () => window.clearTimeout(timer)
  }, [open])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, loading])

  const submitMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    if (!canSendChatNow()) {
      const waitSec = Math.ceil(msUntilNextChatSend() / 1000)
      setError(t.chat.rateLimitClient.replace('{n}', String(waitSec)))
      return
    }

    const userMessage: ChatMessage = { id: createId(), role: 'user', content: text }
    const nextHistory = [...messages, userMessage]
    setMessages(nextHistory)
    setInput('')
    setLoading(true)
    setError(null)
    markChatSent()

    try {
      const profileHint = buildProfileHint(resume?.profile)
      const { content } = await sendChatMessage(nextHistory, locale, profileHint)
      setMessages((prev) => [
        ...prev,
        { id: createId(), role: 'assistant', content },
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : t.chat.error)
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages, locale, resume, t.chat.error, t.chat.rateLimitClient])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    void submitMessage()
  }

  const onInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void submitMessage()
    }
  }

  return (
    <div className="chat-widget" data-open={open || undefined}>
      <AnimatePresence>
        {open ? (
          <motion.section
            key="panel"
            className="chat-widget__panel"
            role="dialog"
            aria-labelledby={titleId}
            aria-modal="false"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="chat-widget__head">
              <div>
                <p className="chat-widget__eyebrow">{t.chat.eyebrow}</p>
                <h2 id={titleId} className="chat-widget__title">
                  {t.chat.title}
                </h2>
              </div>
              <span className="chat-widget__status" aria-live="polite">
                {loading ? t.chat.thinking : t.chat.online}
              </span>
            </header>

            <div ref={listRef} className="chat-widget__messages" role="log" aria-live="polite">
              {messages.length === 0 ? (
                <p className="chat-widget__empty">{t.chat.empty}</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`chat-widget__bubble chat-widget__bubble--${msg.role}`}
                  >
                    <span className="chat-widget__bubble-label">
                      {msg.role === 'user' ? t.chat.you : t.chat.assistant}
                    </span>
                    <p className="chat-widget__bubble-text">{msg.content}</p>
                  </div>
                ))
              )}
              {loading ? (
                <div className="chat-widget__bubble chat-widget__bubble--assistant chat-widget__bubble--typing">
                  <span className="chat-widget__typing" aria-hidden>
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              ) : null}
            </div>

            {error ? <p className="chat-widget__error">{error}</p> : null}

            <form className="chat-widget__form" onSubmit={handleSubmit}>
              <textarea
                ref={inputRef}
                className="chat-widget__input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder={t.chat.placeholder}
                rows={2}
                disabled={loading}
                aria-label={t.chat.placeholder}
              />
              <button
                type="submit"
                className="chat-widget__send btn-primary"
                disabled={loading || !input.trim()}
              >
                {t.chat.send}
              </button>
            </form>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        className="chat-widget__fab"
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          toggle()
        }}
        aria-expanded={open}
        aria-controls={open ? titleId : undefined}
        aria-label={open ? t.chat.close : t.chat.open}
      >
        <span className="chat-widget__fab-ring" aria-hidden />
        <ChatFabIcon open={open} />
      </button>
    </div>
  )
}
