import type { Resume } from '../types/resume'
import { publicPath } from '../lib/publicPath'
import { fetchMockJson, fetchWithStaleWhileRevalidate, invalidateCache } from './mockClient'

type ResumeDto = Omit<Resume, 'profile'> & {
  profile: Omit<Resume['profile'], 'avatar'> & { avatar?: string | null }
}

function normalizeResume(dto: ResumeDto): Resume {
  return {
    ...dto,
    profile: {
      ...dto.profile,
      avatar: dto.profile.avatar ?? undefined,
    },
  }
}

function getGistUrl(): string | null {
  const gistBaseUrl = import.meta.env.VITE_GIST_RESUME_URL
  if (gistBaseUrl) {
    return `${gistBaseUrl}/zh.json`
  }
  return null
}

function getLocalUrl(): string {
  return publicPath('/mock/resume.zh.json')
}

export async function fetchResume(skipCache = false): Promise<Resume> {
  const gistUrl = getGistUrl()
  if (gistUrl) {
    try {
      const dto = await fetchMockJson<ResumeDto>(gistUrl, skipCache)
      return normalizeResume(dto)
    } catch (error) {
      console.warn('[Resume API] Gist fetch failed, falling back to local mock:', error)
    }
  }
  const dto = await fetchMockJson<ResumeDto>(getLocalUrl(), skipCache)
  return normalizeResume(dto)
}

export async function fetchResumeOptimized(
  onUpdate?: (data: Resume) => void,
): Promise<Resume> {
  const gistUrl = getGistUrl()

  if (gistUrl && onUpdate) {
    try {
      return await fetchWithStaleWhileRevalidate<ResumeDto>(gistUrl, (dto) => {
        onUpdate(normalizeResume(dto))
      }).then(normalizeResume)
    } catch (error) {
      console.warn('[Resume API] Gist fetch failed, falling back to local:', error)
    }
  }

  return fetchResume()
}

export function clearResumeCache(): void {
  const gistUrl = getGistUrl()
  if (gistUrl) {
    invalidateCache(gistUrl)
  }
  invalidateCache(getLocalUrl())
}
