import type { Project } from '../types/resume'

const COVER_HUES: Record<string, number> = {
  p0: 214,
  p1: 214,
  p2: 158,
  p3: 268,
  p4: 42,
  p5: 330,
  p6: 200,
  p7: 24,
}

export function getProjectCoverHue(projectId: string, index: number): number {
  return COVER_HUES[projectId] ?? [214, 158, 268, 42, 330][index % 5]
}

export function getProjectCoverSrc(project: Project): string | null {
  return project.image?.trim() || null
}

export function getProjectCoverInitial(title: string): string {
  const trimmed = title.trim()
  if (!trimmed) return 'P'
  const first = trimmed[0]
  return /[\u4e00-\u9fff]/.test(first) ? first : first.toUpperCase()
}
