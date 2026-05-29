import { lazy, Suspense, type ReactNode } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { hobbyDetailPath } from '../lib/routes'
import type { AboutTag } from '../types/resume'

const HobbyArcheryDetail = lazy(() =>
  import('../components/hobbies/HobbyArcheryDetail').then((module) => ({
    default: module.HobbyArcheryDetail,
  })),
)
const HobbyGenericDetail = lazy(() =>
  import('../components/hobbies/HobbyGenericDetail').then((module) => ({
    default: module.HobbyGenericDetail,
  })),
)
const HobbyHikingDetail = lazy(() =>
  import('../components/hobbies/HobbyHikingDetail').then((module) => ({
    default: module.HobbyHikingDetail,
  })),
)
const HobbyMusicDetail = lazy(() =>
  import('../components/hobbies/HobbyMusicDetail').then((module) => ({
    default: module.HobbyMusicDetail,
  })),
)
const HobbyPhotographyDetail = lazy(() =>
  import('../components/hobbies/HobbyPhotographyDetail').then((module) => ({
    default: module.HobbyPhotographyDetail,
  })),
)
const HobbyReadingDetail = lazy(() =>
  import('../components/hobbies/HobbyReadingDetail').then((module) => ({
    default: module.HobbyReadingDetail,
  })),
)

function resolveHobbyDetail(hobby: AboutTag): ReactNode {
  if (hobby.photos?.length) return <HobbyPhotographyDetail hobby={hobby} />
  if (hobby.reading) return <HobbyReadingDetail hobby={hobby} />
  if (hobby.peaks?.length) return <HobbyHikingDetail hobby={hobby} />
  if (hobby.tracks?.length) return <HobbyMusicDetail hobby={hobby} />
  if (hobby.slug === 'archery') return <HobbyArcheryDetail hobby={hobby} />
  return <HobbyGenericDetail hobby={hobby} />
}

export function HobbyDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { resume } = useLanguage()

  if (!resume) return null

  const hobby =
    resume.about.hobbies.find((item) => item.slug === slug) ??
    resume.about.hobbies.find((item) => item.id === slug)

  if (!hobby) return <Navigate to="/" replace state={{ scrollTo: 'about' }} />

  if (hobby.slug !== slug) {
    return <Navigate to={`/hobbies/${hobby.slug}`} replace />
  }

  return <Suspense fallback={null}>{resolveHobbyDetail(hobby)}</Suspense>
}

export function HobbyLegacyRedirect() {
  const { hobbyId } = useParams<{ hobbyId: string }>()
  const { resume } = useLanguage()

  if (!resume) return null

  const hobby = resume.about.hobbies.find((item) => item.id === hobbyId)
  if (!hobby) return <Navigate to="/" replace state={{ scrollTo: 'about' }} />

  return <Navigate to={hobbyDetailPath(hobby.slug)} replace />
}
