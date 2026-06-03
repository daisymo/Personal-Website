import type { AboutTag } from '../../types/resume'
import { HobbyDetailShell } from './HobbyDetailShell'
import { HobbyMusicPlayer } from './HobbyMusicPlayer'

interface HobbyMusicDetailProps {
  hobby: AboutTag
}

export function HobbyMusicDetail({ hobby }: HobbyMusicDetailProps) {
  const tracks = hobby.tracks ?? []

  return (
    <HobbyDetailShell hobby={hobby} variant="music" hideYear hideEyebrow>
      <HobbyMusicPlayer tracks={tracks} />
    </HobbyDetailShell>
  )
}
