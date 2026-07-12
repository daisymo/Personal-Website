import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import type { MotionValue } from '../../motion/framer'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { HeroOrbitWorld } from './hero/HeroOrbitWorld'

interface HeroOrbitSceneProps {
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}

type SceneDensity = 'low' | 'medium' | 'high'

function densityFromSize(minSide: number): SceneDensity {
  if (minSide < 260) return 'low'
  if (minSide < 420) return 'medium'
  return 'high'
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      (window as unknown as { WebGLRenderingContext: unknown }).WebGLRenderingContext &&
      canvas.getContext('webgl')
    )
  } catch {
    return false
  }
}

export function HeroOrbitScene({ mouseX, mouseY }: HeroOrbitSceneProps) {
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const [minSide, setMinSide] = useState(360)
  const webglSupported = typeof window !== 'undefined' && supportsWebGL()
  const density = densityFromSize(minSide)
  const cameraZ = minSide < 260 ? 5.6 : minSide < 420 ? 5.2 : 4.9

  useEffect(() => {
    const node = rootRef.current
    if (!node) return

    const update = (width: number, height: number) => {
      setMinSide(Math.min(width, height))
    }

    update(node.clientWidth, node.clientHeight)
    const observer = new ResizeObserver(([entry]) => {
      update(entry.contentRect.width, entry.contentRect.height)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  if (!webglSupported) {
    return null
  }

  return (
    <div ref={rootRef} className="hero-orbit" aria-hidden>
      <Canvas
        className="hero-orbit__canvas"
        dpr={[1, 2]}
        camera={{ position: [0, 0.15, cameraZ], fov: 42, near: 0.1, far: 80 }}
        gl={{
          alpha: true,
          antialias: window.devicePixelRatio <= 1,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
        }}
      >
        <Suspense fallback={null}>
          <HeroOrbitWorld mouseX={mouseX} mouseY={mouseY} reduced={reduced} density={density} />
        </Suspense>
      </Canvas>
    </div>
  )
}
