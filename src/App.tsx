import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './components/layout/SiteLayout'
import { HomePage } from './pages/HomePage'
import { ResumeShell } from './pages/ResumeShell'
import { useLanguage } from './hooks/useLanguage'

const ProjectsPage = lazy(() =>
  import('./pages/ProjectsPage').then((module) => ({ default: module.ProjectsPage })),
)
const ProjectDetailPage = lazy(() =>
  import('./pages/ProjectDetailPage').then((module) => ({ default: module.ProjectDetailPage })),
)
const HobbyDetailPage = lazy(() =>
  import('./pages/HobbyDetailPage').then((module) => ({ default: module.HobbyDetailPage })),
)
const HobbyLegacyRedirect = lazy(() =>
  import('./pages/HobbyDetailPage').then((module) => ({ default: module.HobbyLegacyRedirect })),
)

function DocumentTitle() {
  const { resume } = useLanguage()
  useEffect(() => {
    if (resume?.profile.name) {
      document.title = resume.profile.name
    }
  }, [resume?.profile.name])
  return null
}

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined

export default function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <DocumentTitle />
      <ResumeShell>
        <Suspense fallback={null}>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route index element={<HomePage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/:slug" element={<ProjectDetailPage />} />
              <Route path="hobbies/:slug" element={<HobbyDetailPage />} />
              <Route path="about/hobbies/:hobbyId" element={<HobbyLegacyRedirect />} />
            </Route>
          </Routes>
        </Suspense>
      </ResumeShell>
    </BrowserRouter>
  )
}
