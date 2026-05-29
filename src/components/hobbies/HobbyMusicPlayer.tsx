import { useEffect, useRef, useState, type MouseEvent } from 'react'
import type { MusicTrack } from '../../types/resume'
import { useLanguage } from '../../hooks/useLanguage'

interface HobbyMusicPlayerProps {
  tracks: MusicTrack[]
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function HobbyMusicPlayer({ tracks }: HobbyMusicPlayerProps) {
  const { t } = useLanguage()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [liked, setLiked] = useState<Set<string>>(() => new Set())

  const active = tracks[activeIndex]
  const likedCount = liked.size

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !active?.audio) return

    audio.src = active.audio
    audio.load()
    if (playing) {
      void audio.play().catch(() => setPlaying(false))
    }
  }, [active?.audio, active?.id])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTime = () => {
      setCurrentTime(audio.currentTime)
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0)
    }
    const onMeta = () => setDuration(audio.duration)
    const onEnd = () => {
      setActiveIndex((index) => {
        const next = (index + 1) % tracks.length
        return next
      })
      setPlaying(true)
    }

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('ended', onEnd)
    }
  }, [tracks.length])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) void audio.play().catch(() => setPlaying(false))
    else audio.pause()
  }, [playing])

  if (!active) return null

  const togglePlay = () => setPlaying((value) => !value)

  const selectTrack = (index: number) => {
    if (index === activeIndex) {
      togglePlay()
      return
    }
    setActiveIndex(index)
    setPlaying(true)
  }

  const playPrev = () => {
    setActiveIndex((index) => (index - 1 + tracks.length) % tracks.length)
    setPlaying(true)
  }

  const playNext = () => {
    setActiveIndex((index) => (index + 1) % tracks.length)
    setPlaying(true)
  }

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const seek = (event: MouseEvent<HTMLButtonElement>) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
    audio.currentTime = ratio * audio.duration
  }

  return (
    <div className={`music-studio ${playing ? 'music-studio--playing' : ''}`}>
      <audio ref={audioRef} preload="metadata" />

      <section className="music-studio__deck" aria-label={t.hobbies.musicNowPlaying}>
        <div className="music-studio__visual" aria-hidden>
          <div className="music-studio__disc">
            <span className="music-studio__disc-groove" />
            <span className="music-studio__disc-index">{String(activeIndex + 1).padStart(2, '0')}</span>
          </div>
        </div>

        <div className="music-studio__panel">
          <p className="music-studio__kicker">{t.hobbies.musicNowPlaying}</p>
          <h2 className="music-studio__title">{active.title}</h2>
          <p className="music-studio__artist">{active.artist}</p>

          <div className="music-studio__progress">
            <span className="music-studio__time">{formatTime(currentTime)}</span>
            <button type="button" className="music-studio__bar" onClick={seek} aria-label={t.hobbies.musicSeek}>
              <span className="music-studio__bar-fill" style={{ width: `${progress}%` }} />
            </button>
            <span className="music-studio__time">{formatTime(duration)}</span>
          </div>

          <div className="music-studio__controls">
            <button type="button" className="music-studio__nav" onClick={playPrev} aria-label={t.hobbies.musicPrev}>
              ‹
            </button>
            <button
              type="button"
              className="music-studio__play"
              onClick={togglePlay}
              aria-label={playing ? t.hobbies.musicPause : t.hobbies.musicPlay}
            >
              {playing ? '❚❚' : '▶'}
            </button>
            <button type="button" className="music-studio__nav" onClick={playNext} aria-label={t.hobbies.musicNext}>
              ›
            </button>
            <button
              type="button"
              className={`music-studio__heart ${liked.has(active.id) ? 'music-studio__heart--on' : ''}`}
              onClick={() => toggleLike(active.id)}
              aria-label={t.hobbies.musicLike}
              aria-pressed={liked.has(active.id)}
            >
              ♥
            </button>
          </div>

          <p className="music-studio__liked-note">
            {likedCount > 0
              ? t.hobbies.musicLikedCount.replace('{n}', String(likedCount))
              : t.hobbies.musicLikedEmpty}
          </p>
        </div>
      </section>

      <ol className="music-studio__playlist">
        {tracks.map((track, index) => {
          const isActive = index === activeIndex
          return (
            <li key={track.id} className={`music-studio__track ${isActive ? 'music-studio__track--active' : ''}`}>
              <button type="button" className="music-studio__track-main" onClick={() => selectTrack(index)}>
                <span className="music-studio__track-num">{String(index + 1).padStart(2, '0')}</span>
                <span className="music-studio__track-copy">
                  <span className="music-studio__track-title">{track.title}</span>
                  <span className="music-studio__track-artist">{track.artist}</span>
                </span>
                {isActive && playing ? (
                  <span className="music-studio__equalizer" aria-hidden>
                    <i />
                    <i />
                    <i />
                  </span>
                ) : null}
              </button>
              <button
                type="button"
                className={`music-studio__track-heart ${liked.has(track.id) ? 'music-studio__track-heart--on' : ''}`}
                onClick={() => toggleLike(track.id)}
                aria-label={t.hobbies.musicLike}
                aria-pressed={liked.has(track.id)}
              >
                ♥
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
