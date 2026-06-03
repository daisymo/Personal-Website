/** Resolve a root-relative public asset path for the current deploy base (e.g. GitHub Pages). */
export function publicPath(path: string): string {
  const trimmed = path.trim()
  if (!trimmed) return import.meta.env.BASE_URL
  if (/^https?:\/\//i.test(trimmed)) return trimmed

  const base = import.meta.env.BASE_URL
  const relative = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed
  return `${base}${relative}`
}
