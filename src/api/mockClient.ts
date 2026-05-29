/** Mock API delay (ms) to simulate network latency. */
export const MOCK_API_DELAY_MS = 400

export function mockDelay(ms = MOCK_API_DELAY_MS): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

export async function fetchMockJson<T>(path: string): Promise<T> {
  await mockDelay()
  const response = await fetch(path, {
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) {
    throw new Error(`Mock API error: ${response.status} ${path}`)
  }
  return response.json() as Promise<T>
}
