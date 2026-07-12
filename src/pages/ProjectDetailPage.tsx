import type { ReactNode } from 'react'
import { motion } from '../motion/framer'
import { Navigate, useParams } from 'react-router-dom'
import { ProjectCover } from '../components/projects/ProjectCover'
import { getCategoryLabel } from '../components/projects/ProjectCategoryFilter'
import { BackButton } from '../components/ui/BackButton'
import { PageContainer } from '../components/ui/PageContainer'
import { useLanguage } from '../hooks/useLanguage'
import { getProjectSections } from '../lib/projectSections'
import { fadeUp } from '../motion/presets'

interface DetailModuleProps {
  label: string
  children: ReactNode
  variant?: 'default' | 'meta'
}

function DetailModule({ label, children, variant = 'default' }: DetailModuleProps) {
  return (
    <section className={`project-detail__module project-detail__module--${variant}`}>
      <h2 className="project-detail__module-label">{label}</h2>
      <div className="project-detail__module-body">{children}</div>
    </section>
  )
}

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { resume, t } = useLanguage()

  if (!resume) return null

  const project =
    resume.projects.find((p) => p.slug === slug) ??
    resume.projects.find((p) => p.id === slug)

  if (!project) return <Navigate to="/projects" replace />

  if (project.slug !== slug) {
    return <Navigate to={`/projects/${project.slug}`} replace />
  }

  const index = resume.projects.findIndex((p) => p.id === project.id)
  const skills = project.skills
  const sections = getProjectSections(project)

  return (
    <article className="subpage subpage--detail project-detail">
      <div className="page-section page-section--compact">
        <PageContainer>
          <div className="page-back-row project-detail__toolbar">
            <BackButton className="btn-ghost project-detail__back" />
          </div>
          <motion.div
            className="project-detail__layout"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <div className="project-detail__main">
              <header className="project-detail__head">
                <h1 className="project-detail__title">{project.title}</h1>
                <p className="project-detail__summary">{project.summary}</p>
              </header>

              <div className="project-detail__modules">
                {sections.intro ? (
                  <DetailModule label={t.projects.introLabel}>
                    <p className="project-detail__intro">{sections.intro}</p>
                  </DetailModule>
                ) : null}

                {project.company && !project.categories?.includes('personal') ? (
                  <DetailModule label={t.projects.companyLabel} variant="meta">
                    <p className="project-detail__company">{project.company}</p>
                  </DetailModule>
                ) : null}

                {skills.length > 0 ? (
                  <DetailModule label={t.projects.stackLabel} variant="meta">
                    <ul className="project-detail__skills" aria-label={t.projects.stackLabel}>
                      {skills.map((skill) => (
                        <li key={skill}>
                          <span className="project-skill-tag">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </DetailModule>
                ) : null}

                {sections.responsibilities.length > 0 ? (
                  <DetailModule label={t.projects.roleLabel}>
                    <ul className="project-detail__list">
                      {sections.responsibilities.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </DetailModule>
                ) : null}

                {sections.outcomes.length > 0 ? (
                  <DetailModule label={t.projects.outcomesLabel}>
                    <ul className="project-detail__list project-detail__list--outcomes">
                      {sections.outcomes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </DetailModule>
                ) : null}
              </div>
            </div>

            <aside className="project-detail__aside" aria-label={project.title}>
              <div className="project-detail__cover-frame">
                <ProjectCover project={project} index={index} className="project-detail__cover" />
                {project.categories?.length ? (
                  <ul className="project-detail__aside-cats">
                    {project.categories.map((category) => (
                      <li key={category}>
                        <span className="project-detail__aside-cat">{getCategoryLabel(category, t)}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </aside>
          </motion.div>
        </PageContainer>
      </div>
    </article>
  )
}
