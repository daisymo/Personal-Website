import { useMemo, useState } from 'react'
import { MAX_HOME_PROJECTS } from '../../constants'
import { filterProjectsByCategory, type ProjectCategoryFilter } from '../../constants/projectCategories'
import { useLanguage } from '../../hooks/useLanguage'
import { BackButton } from '../ui/BackButton'
import { ProjectCategoryFilterBar } from '../projects/ProjectCategoryFilter'
import { ProjectGrid } from '../projects/ProjectGrid'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'
import { ViewMoreButton } from '../ui/ViewMoreButton'

interface ProjectsSectionProps {
  showAll?: boolean
}

export function ProjectsSection({ showAll = false }: ProjectsSectionProps) {
  const { resume, t } = useLanguage()
  const [categoryFilter, setCategoryFilter] = useState<ProjectCategoryFilter>('all')

  const allProjects = useMemo(() => resume?.projects ?? [], [resume?.projects])
  const homeProjects = allProjects.slice(0, MAX_HOME_PROJECTS)

  const displayedProjects = useMemo(() => {
    if (!showAll) return homeProjects
    return filterProjectsByCategory(allProjects, categoryFilter)
  }, [allProjects, categoryFilter, homeProjects, showAll])

  if (!resume) return null

  const showMoreOnHome = !showAll && allProjects.length > MAX_HOME_PROJECTS

  return (
    <Section id="projects" tone="white" className={showAll ? 'page-section--compact' : undefined}>
      {showAll ? (
        <div className="page-container page-back-row">
          <BackButton />
        </div>
      ) : null}

      <SectionHeading
        title={showAll ? t.projects.pageTitle : t.projects.title}
        subtitle={showAll ? t.projects.pageSubtitle : t.projects.subtitle}
      />

      {showAll ? (
        <div className="page-container page-toolbar page-toolbar--projects">
          <ProjectCategoryFilterBar value={categoryFilter} onChange={setCategoryFilter} />
        </div>
      ) : null}

      <div className="page-container">
        {showAll && displayedProjects.length === 0 ? (
          <p className="project-filter__empty">{t.projects.filterEmpty}</p>
        ) : (
          <ProjectGrid
            projects={displayedProjects}
            detailLabel={t.projects.viewDetail}
            listKey={showAll ? categoryFilter : undefined}
          />
        )}

        {showMoreOnHome ? <ViewMoreButton to="/projects" label={t.projects.viewMore} /> : null}
      </div>
    </Section>
  )
}
