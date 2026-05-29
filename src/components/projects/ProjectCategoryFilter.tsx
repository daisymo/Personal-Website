import { useLanguage } from '../../hooks/useLanguage'
import type { ProjectCategory, ProjectCategoryFilter } from '../../constants/projectCategories'
import { cn } from '../../lib/cn'

const FILTERS: ProjectCategoryFilter[] = ['all', 'work', 'personal', 'ai']

interface ProjectCategoryFilterProps {
  value: ProjectCategoryFilter
  onChange: (value: ProjectCategoryFilter) => void
}

export function ProjectCategoryFilterBar({ value, onChange }: ProjectCategoryFilterProps) {
  const { t } = useLanguage()

  const labels: Record<ProjectCategoryFilter, string> = {
    all: t.projects.filterAll,
    work: t.projects.filterWork,
    personal: t.projects.filterPersonal,
    ai: t.projects.filterAi,
  }

  return (
    <div className="project-filter" role="tablist" aria-label={t.projects.filterLabel}>
      {FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          role="tab"
          aria-selected={value === filter}
          className={cn('project-filter__tab', value === filter && 'project-filter__tab--active')}
          onClick={() => onChange(filter)}
        >
          {labels[filter]}
        </button>
      ))}
    </div>
  )
}

export function getCategoryLabel(
  category: ProjectCategory,
  t: { projects: { filterWork: string; filterPersonal: string; filterAi: string } },
): string {
  const map = {
    work: t.projects.filterWork,
    personal: t.projects.filterPersonal,
    ai: t.projects.filterAi,
  } as const
  return map[category]
}
