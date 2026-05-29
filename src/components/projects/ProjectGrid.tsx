import { motion, useReducedMotion } from '../../motion/framer'
import type { Project } from '../../types/resume'
import { ProjectCard } from './ProjectCard'
import { staggerContainer } from '../../motion/presets'

interface ProjectGridProps {
  projects: Project[]
  detailLabel: string
  /** When set, re-animates the grid on change (e.g. category filter). */
  listKey?: string
}

export function ProjectGrid({ projects, detailLabel, listKey }: ProjectGridProps) {
  const reduced = useReducedMotion()
  const gridKey = listKey ?? projects.map((project) => project.id).join('|')
  const filterable = listKey !== undefined

  return (
    <motion.div
      key={gridKey}
      className="project-grid"
      initial={reduced ? false : 'hidden'}
      animate={filterable && !reduced ? 'visible' : undefined}
      whileInView={filterable || reduced ? undefined : 'visible'}
      viewport={filterable ? undefined : { once: true, margin: '-60px' }}
      variants={staggerContainer}
    >
      {projects.map((project, i) => (
        <ProjectCard key={project.id} project={project} index={i} detailLabel={detailLabel} />
      ))}
    </motion.div>
  )
}
