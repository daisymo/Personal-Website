export const PROJECT_CATEGORIES = ['work', 'personal', 'ai'] as const

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]

export type ProjectCategoryFilter = 'all' | ProjectCategory

export function filterProjectsByCategory<
  T extends { categories?: ProjectCategory[] },
>(projects: T[], filter: ProjectCategoryFilter): T[] {
  if (filter === 'all') return projects
  return projects.filter((project) => project.categories?.includes(filter))
}
