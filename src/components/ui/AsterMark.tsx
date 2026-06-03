import { useId } from 'react'
import { cn } from '../../lib/cn'

interface AsterMarkProps {
  className?: string
}

const STAR_TOP = 'M16 16 13.65 12.6 16 4.2 18.35 12.6Z'
const STAR_RIGHT = 'M16 16 18.35 12.6 26.8 13.35 19.35 17.6Z'
const STAR_BOTTOM = 'M16 16 19.35 17.6 16 26.2 12.65 17.6Z'
const STAR_LEFT = 'M16 16 12.65 17.6 5.2 13.35 13.65 12.6Z'
const STAR_OUTLINE =
  'M16 4.2 18.35 12.6 26.8 13.35 19.35 17.6 16 26.2 12.65 17.6 5.2 13.35 13.65 12.6Z'

/** Faceted jewel star — premium mark for nav & favicon. */
export function AsterMark({ className }: AsterMarkProps) {
  const uid = useId().replace(/:/g, '')

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      className={cn('aster-mark', className)}
      aria-hidden
    >
      <defs>
        <radialGradient id={`${uid}-aura`} cx="50%" cy="42%" r="52%">
          <stop stopColor="#8eb4ea" stopOpacity="0.72" />
          <stop offset="0.55" stopColor="#6b93d4" stopOpacity="0.28" />
          <stop offset="1" stopColor="#6b93d4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-f1`} x1="16" y1="4" x2="16" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#dce9fb" />
          <stop offset="0.45" stopColor="#8fafe8" />
          <stop offset="1" stopColor="#2a3142" />
        </linearGradient>
        <linearGradient id={`${uid}-f2`} x1="27" y1="13" x2="16" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c5d8f5" />
          <stop offset="0.5" stopColor="#6b93d4" />
          <stop offset="1" stopColor="#243047" />
        </linearGradient>
        <linearGradient id={`${uid}-f3`} x1="16" y1="27" x2="16" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a8c4ef" />
          <stop offset="0.55" stopColor="#5578b8" />
          <stop offset="1" stopColor="#1e2433" />
        </linearGradient>
        <linearGradient id={`${uid}-f4`} x1="5" y1="13" x2="16" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d0dff8" />
          <stop offset="0.5" stopColor="#7398cf" />
          <stop offset="1" stopColor="#2a3142" />
        </linearGradient>
        <radialGradient id={`${uid}-jewel`} cx="38%" cy="32%" r="68%">
          <stop stopColor="#ffffff" />
          <stop stopColor="#b8cff0" offset="0.35" />
          <stop stopColor="#6b93d4" offset="0.72" />
          <stop stopColor="#2a3142" offset="1" />
        </radialGradient>
        <filter id={`${uid}-glow`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.35" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle className="aster-mark__aura" cx="16" cy="16.5" r="11.5" fill={`url(#${uid}-aura)`} filter={`url(#${uid}-glow)`} />
      <path className="aster-mark__halo" d={STAR_OUTLINE} fill="#6b93d4" fillOpacity="0.16" transform="translate(16 16) scale(1.1) translate(-16 -16)" />
      <path d={STAR_TOP} fill={`url(#${uid}-f1)`} />
      <path d={STAR_RIGHT} fill={`url(#${uid}-f2)`} />
      <path d={STAR_BOTTOM} fill={`url(#${uid}-f3)`} />
      <path d={STAR_LEFT} fill={`url(#${uid}-f4)`} />
      <path
        d={STAR_OUTLINE}
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="0.35"
        fill="none"
      />
      <path
        d="M16 6.2 16.55 11.2"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth="0.55"
        strokeLinecap="round"
      />
      <circle className="aster-mark__jewel" cx="16" cy="16" r="2.35" fill={`url(#${uid}-jewel)`} />
      <circle cx="15.15" cy="15.05" r="0.75" fill="#ffffff" fillOpacity="0.92" />
      <circle cx="16" cy="4.2" r="0.85" fill="#ffffff" fillOpacity="0.95" />
      <circle cx="26.8" cy="13.35" r="0.65" fill="#dce9fb" fillOpacity="0.9" />
      <circle cx="16" cy="26.2" r="0.65" fill="#b8cff0" fillOpacity="0.85" />
      <circle cx="5.2" cy="13.35" r="0.65" fill="#dce9fb" fillOpacity="0.9" />
    </svg>
  )
}
