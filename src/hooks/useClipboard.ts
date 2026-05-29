import { useCallback, useState } from 'react'

export function useClipboard() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copy = useCallback(async (id: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedId(id)
      window.setTimeout(() => setCopiedId(null), 2000)
    } catch {
      setCopiedId(null)
    }
  }, [])

  return { copiedId, copy }
}
