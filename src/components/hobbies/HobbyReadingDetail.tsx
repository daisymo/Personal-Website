import type { AboutTag, ReadingItem } from '../../types/resume'
import { useLanguage } from '../../hooks/useLanguage'
import { getCurrentYear, withYear } from '../../lib/currentYear'
import { HobbyDetailShell } from './HobbyDetailShell'

interface HobbyReadingDetailProps {
  hobby: AboutTag
}

const SHELF_META = {
  read: { mark: '✓', accent: 'read' },
  reading: { mark: '◐', accent: 'reading' },
  wish: { mark: '☆', accent: 'wish' },
} as const

function ReadingShelf({
  title,
  items,
  tone,
  hint,
}: {
  title: string
  items: ReadingItem[]
  tone: keyof typeof SHELF_META
  hint: string
}) {
  if (items.length === 0) return null
  const meta = SHELF_META[tone]

  return (
    <section className={`reading-shelf reading-shelf--${meta.accent}`}>
      <header className="reading-shelf__head">
        <span className="reading-shelf__mark" aria-hidden>
          {meta.mark}
        </span>
        <div className="reading-shelf__titles">
          <h2 className="reading-shelf__title">{title}</h2>
          <p className="reading-shelf__hint">{hint}</p>
        </div>
        <span className="reading-shelf__count">{items.length}</span>
      </header>
      <ul className="reading-shelf__books">
        {items.map((item, index) => (
          <li key={item.id} className="reading-shelf__book">
            <span className="reading-shelf__spine" aria-hidden />
            <div className="reading-shelf__ticket">
              <span className="reading-shelf__num">{String(index + 1).padStart(2, '0')}</span>
              <div className="reading-shelf__meta">
                <span className="reading-shelf__book-title">{item.title}</span>
                {item.author ? <span className="reading-shelf__author">{item.author}</span> : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function HobbyReadingDetail({ hobby }: HobbyReadingDetailProps) {
  const { t } = useLanguage()
  const lists = hobby.reading ?? { read: [], reading: [], wish: [] }
  const total = lists.read.length + lists.reading.length + lists.wish.length
  const year = getCurrentYear()

  return (
    <HobbyDetailShell hobby={hobby} variant="reading" hideEyebrow>
      <div className="reading-atelier">
        <p className="reading-atelier__ledger">
          <span>{withYear(t.hobbies.readingLedger, year)}</span>
          <em>{total}</em>
          <span>{t.hobbies.readingVolumes}</span>
        </p>
        <div className="reading-atelier__shelves">
          <ReadingShelf
            title={t.hobbies.readDone}
            items={lists.read}
            tone="read"
            hint={t.hobbies.readDoneHint}
          />
          <ReadingShelf
            title={t.hobbies.readingNow}
            items={lists.reading}
            tone="reading"
            hint={t.hobbies.readingNowHint}
          />
          <ReadingShelf
            title={t.hobbies.readWish}
            items={lists.wish}
            tone="wish"
            hint={t.hobbies.readWishHint}
          />
        </div>
      </div>
    </HobbyDetailShell>
  )
}
