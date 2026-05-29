import type { AboutTag, MountainPeak } from '../../types/resume'
import { useLanguage } from '../../hooks/useLanguage'
import { HobbyDetailShell } from './HobbyDetailShell'

interface HobbyHikingDetailProps {
  hobby: AboutTag
}

function parseElevationMeters(elevation?: string): number | null {
  if (!elevation) return null
  const match = elevation.match(/([\d,.]+)/)
  if (!match) return null
  return Number.parseFloat(match[1].replace(',', ''))
}

function getMaxElevation(peaks: MountainPeak[]): string | null {
  let max = 0
  let label: string | null = null

  for (const peak of peaks) {
    const meters = parseElevationMeters(peak.elevation)
    if (meters !== null && meters > max) {
      max = meters
      label = peak.elevation ?? null
    }
  }

  return label
}

export function HobbyHikingDetail({ hobby }: HobbyHikingDetailProps) {
  const { t } = useLanguage()
  const peaks = hobby.peaks ?? []
  const maxElevation = getMaxElevation(peaks)
  const maxMeters = maxElevation ? parseElevationMeters(maxElevation) : null

  return (
    <HobbyDetailShell hobby={hobby} variant="hiking" hideYear hideEyebrow>
      <div className="peak-pass">
        <header className="peak-pass__header">
          <div className="peak-pass__intro">
            <p className="peak-pass__kicker">{t.hobbies.trailJournal}</p>
            <p className="peak-pass__tagline">{t.hobbies.trailTagline}</p>
          </div>
          <div className="peak-pass__stats">
            <div className="peak-pass__stat">
              <span className="peak-pass__stat-value">{peaks.length}</span>
              <span className="peak-pass__stat-label">{t.hobbies.peaksLogged}</span>
            </div>
            {maxElevation ? (
              <div className="peak-pass__stat peak-pass__stat--summit">
                <span className="peak-pass__stat-value">{maxElevation}</span>
                <span className="peak-pass__stat-label">{t.hobbies.peakHigh}</span>
              </div>
            ) : null}
          </div>
        </header>

        <div className="peak-pass__grid">
          {peaks.map((peak, index) => {
            const meters = parseElevationMeters(peak.elevation)
            const barHeight =
              meters !== null && maxMeters ? Math.max(18, Math.round((meters / maxMeters) * 100)) : 0

            return (
              <article key={peak.id} className="peak-pass__stamp">
                <div className="peak-pass__stamp-topo" aria-hidden />
                <span className="peak-pass__stamp-num" aria-hidden>
                  {String(index + 1).padStart(2, '0')}
                </span>
                {peak.elevation ? (
                  <span className="peak-pass__elev-badge">
                    <span className="peak-pass__elev-icon" aria-hidden>
                      ▲
                    </span>
                    <span className="peak-pass__elev-value">{peak.elevation}</span>
                    <span className="sr-only">{t.hobbies.peakElevation}</span>
                  </span>
                ) : null}
                <h3 className="peak-pass__name">{peak.name}</h3>
                {peak.region ? (
                  <p className="peak-pass__region">
                    <span className="peak-pass__region-pin" aria-hidden>
                      ◎
                    </span>
                    {peak.region}
                  </p>
                ) : null}
                {barHeight > 0 ? (
                  <div className="peak-pass__elev-bar" aria-hidden>
                    <span className="peak-pass__elev-fill" style={{ height: `${barHeight}%` }} />
                  </div>
                ) : null}
                <span className="peak-pass__summit-flag" aria-hidden>
                  🚩
                </span>
              </article>
            )
          })}
        </div>
      </div>
    </HobbyDetailShell>
  )
}
