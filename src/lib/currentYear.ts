export function getCurrentYear(): number {
  return new Date().getFullYear()
}

export function withYear(template: string, year = getCurrentYear()): string {
  return template.replaceAll('{year}', String(year))
}
