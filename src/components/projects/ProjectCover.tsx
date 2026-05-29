import type { CSSProperties } from 'react'
import type { Project } from '../../types/resume'
import { getProjectCoverHue, getProjectCoverInitial, getProjectCoverSrc } from '../../lib/projectCover'

interface ProjectCoverProps {
  project: Project
  index: number
  className?: string
}

export function ProjectCover({ project, index, className = '' }: ProjectCoverProps) {
  const src = getProjectCoverSrc(project)
  const hue = getProjectCoverHue(project.id, index)
  const initial = getProjectCoverInitial(project.title)

  if (src) {
    return (
      <img
        src={src}
        alt=""
        className={`project-cover project-cover--photo ${className}`.trim()}
        loading="lazy"
        decoding="async"
      />
    )
  }

  return (
    <div
      className={`project-cover project-cover--fallback ${className}`.trim()}
      style={{ '--cover-h': hue } as CSSProperties}
      aria-hidden
    >
      <span className="project-cover__mesh" />
      <span className="project-cover__glyph">{initial}</span>
    </div>
  )
}
