import type { Project } from '../types/resume'

export interface ProjectSections {
  intro?: string
  responsibilities: string[]
  outcomes: string[]
}

export function getProjectSections(project: Project): ProjectSections {
  return {
    intro: project.introduction || undefined,
    responsibilities: project.responsibilities ?? [],
    outcomes: project.outcomes ?? [],
  }
}
