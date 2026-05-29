import { motion } from '../../motion/framer'
import { Link } from 'react-router-dom'
import type { Project } from '../../types/resume'
import { ProjectCover } from './ProjectCover'
import { getCategoryLabel } from './ProjectCategoryFilter'
import { projectDetailPath } from '../../lib/routes'
import { useLanguage } from '../../hooks/useLanguage'
import { fadeUp } from '../../motion/presets'

interface ProjectCardProps {
  project: Project
  index: number
  detailLabel: string
}

export function ProjectCard({ project, index, detailLabel }: ProjectCardProps) {
  const { t } = useLanguage()
  const to = projectDetailPath(project.slug)

  return (
    <motion.article className="project-card-v2" variants={fadeUp}>
      <Link to={to} className="project-card-v2__link" aria-label={`${project.title} — ${detailLabel}`}>
        <div className="project-card-v2__inner">
          <div className="project-card-v2__media">
            <ProjectCover project={project} index={index} className="project-card-v2__cover" />
            {project.categories.length > 0 ? (
              <div className="project-card-v2__categories">
                {project.categories.map((category) => (
                  <span key={category} className="project-card-v2__category">
                    {getCategoryLabel(category, t)}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="project-card-v2__content">
            <div className="project-card-v2__head">
              <h3 className="project-card-v2__title">{project.title}</h3>
              <span className="project-card-v2__arrow" aria-hidden>
                ↗
              </span>
            </div>

            <p className="project-card-v2__summary">{project.summary}</p>

            <ul className="project-card-v2__skills">
              {project.skills.map((tag) => (
                <li key={tag}>
                  <span className="project-skill-tag">{tag}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
