import type { Locale } from '../data'
import type { Resume } from '../types/resume'
import { fetchMockJson } from './mockClient'

const MOCK_BASE = '/mock'

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

/** Load resume data from mock JSON. @see public/mock/resume.{locale}.json */
export async function fetchResume(locale: Locale): Promise<Resume> {
  const dto = await fetchMockJson<ResumeDto>(
    `${MOCK_BASE}/resume.${locale}.json`,
  )
  return normalizeResume(dto)
}
