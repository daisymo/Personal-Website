const CACHE_TTL_MS = 5 * 60 * 1000
const STALE_CACHE_TTL_MS = 24 * 60 * 60 * 1000
const REQUEST_TIMEOUT_MS = 8000
const STORAGE_KEY_PREFIX = 'resume_cache_'

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const cache = new Map<string, CacheEntry<unknown>>()
const revalidating = new Set<string>()

function isExternalUrl(path: string): boolean {
  return /^https?:\/\//i.test(path)
}

function getCacheKey(path: string): string {
  return path
}

function getStorageKey(path: string): string {
  return `${STORAGE_KEY_PREFIX}${btoa(path)}`
}

function getCachedData<T>(path: string, allowStale = false): T | null {
  const cacheKey = getCacheKey(path)
  let entry = cache.get(cacheKey)

  if (!entry) {
    try {
      const stored = localStorage.getItem(getStorageKey(path))
      if (stored) {
        entry = JSON.parse(stored) as CacheEntry<T>
        cache.set(cacheKey, entry)
      }
    } catch (e) {
      console.warn('[Cache] Failed to read from localStorage:', e)
    }
  }

  if (!entry) return null

  const age = Date.now() - entry.timestamp
  if (age > CACHE_TTL_MS) {
    if (allowStale && age <= STALE_CACHE_TTL_MS) {
      return entry.data as T
    }
    cache.delete(cacheKey)
    try {
      localStorage.removeItem(getStorageKey(path))
    } catch (e) {
      console.warn('[Cache] Failed to remove from localStorage:', e)
    }
    return null
  }
  return entry.data as T
}

function setCachedData<T>(path: string, data: T): void {
  const cacheKey = getCacheKey(path)
  const entry: CacheEntry<T> = { data, timestamp: Date.now() }
  cache.set(cacheKey, entry)
  try {
    localStorage.setItem(getStorageKey(path), JSON.stringify(entry))
  } catch (e) {
    console.warn('[Cache] Failed to write to localStorage:', e)
  }
}

function timeoutPromise<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Request timed out after ${ms}ms`))
    }, ms)
    promise.then(
      (result) => {
        clearTimeout(timer)
        resolve(result)
      },
      (error) => {
        clearTimeout(timer)
        reject(error)
      },
    )
  })
}

export async function fetchMockJson<T>(path: string, skipCache = false): Promise<T> {
  if (!skipCache) {
    const cached = getCachedData<T>(path)
    if (cached) {
      return cached
    }
  }

  const response = await timeoutPromise(
    fetch(path, {
      headers: { Accept: 'application/json' },
      cache: isExternalUrl(path) ? 'no-cache' : 'default',
    }),
    REQUEST_TIMEOUT_MS,
  )

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${path}`)
  }

  const data = (await response.json()) as T
  setCachedData(path, data)
  return data
}

export async function fetchWithStaleWhileRevalidate<T>(
  path: string,
  onUpdate: (data: T) => void,
): Promise<T> {
  const cacheKey = getCacheKey(path)
  const stale = getCachedData<T>(path, true)

  if (stale && !revalidating.has(cacheKey)) {
    revalidating.add(cacheKey)
    fetch(path, {
      headers: { Accept: 'application/json' },
      cache: isExternalUrl(path) ? 'no-cache' : 'default',
    })
      .then(async (response) => {
        if (response.ok) {
          const data = (await response.json()) as T
          setCachedData(path, data)
          onUpdate(data)
        }
      })
      .catch(() => {})
      .finally(() => {
        revalidating.delete(cacheKey)
      })
    return stale
  }

  return fetchMockJson<T>(path, false)
}

export function clearCache(): void {
  cache.clear()
  try {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_KEY_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  } catch (e) {
    console.warn('[Cache] Failed to clear localStorage:', e)
  }
}

export function invalidateCache(path: string): void {
  cache.delete(getCacheKey(path))
  try {
    localStorage.removeItem(getStorageKey(path))
  } catch (e) {
    console.warn('[Cache] Failed to invalidate in localStorage:', e)
  }
}
