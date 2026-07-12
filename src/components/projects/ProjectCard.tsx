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

const cardEase = [0.22, 1, 0.36, 1] as const

export function ProjectCard({ project, index, detailLabel }: ProjectCardProps) {
  const { t } = useLanguage()
  const to = projectDetailPath(project.slug)

  return (
    <motion.article
      className="project-card-v2"
      variants={fadeUp}
      initial={{ opacity: 0, y: 24 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: cardEase }}
    >
      <Link to={to} className="project-card-v2__link" aria-label={`${project.title} — ${detailLabel}`}>
        <div className="project-card-v2__inner">
          <div className="project-card-v2__media">
            <motion.div
              className="project-card-v2__cover-wrapper"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4, ease: cardEase }}
            >
              <ProjectCover project={project} index={index} className="project-card-v2__cover" />
            </motion.div>
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
              <motion.span
                className="project-card-v2__arrow"
                aria-hidden
                whileHover={{ x: 4 }}
                transition={{ duration: 0.25, ease: cardEase }}
              >
                ↗
              </motion.span>
            </div>

            <p className="project-card-v2__summary">{project.summary}</p>

            <ul className="project-card-v2__skills">
              {project.skills.map((tag) => (
                <motion.li
                  key={tag}
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.2, ease: cardEase }}
                >
                  <span className="project-skill-tag">{tag}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
