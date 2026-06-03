import { useMemo, useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import type { MotionValue } from '../../../motion/framer'
import type { Group, Mesh, Points } from 'three'
import * as THREE from 'three'

interface HeroOrbitWorldProps {
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
  reduced?: boolean
  density?: 'low' | 'medium' | 'high'
}

// 流星组件
function ShootingStar({ delay }: { delay: number }) {
  const ref = useRef<Group>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useFrame((state) => {
    if (!ref.current || !visible) return
    const t = (state.clock.elapsedTime + delay * 0.3) % 8
    const progress = t / 8
    ref.current.position.set(
      -3 + progress * 6,
      1.5 - progress * 3,
      -2 + progress * 4,
    )
    ref.current.lookAt(
      -3 + progress * 6 + 0.5,
      1.5 - progress * 3 - 0.3,
      -2 + progress * 4,
    )
  })

  if (!visible) return null

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.008, 0.4, 4]} />
        <meshBasicMaterial color="#b8cff0" transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

// 第三颗行星
function PlanetThird({
  radius,
  color,
  emissive,
  orbitRadius,
  speed,
  y = 0,
}: {
  radius: number
  color: string
  emissive: string
  orbitRadius: number
  speed: number
  y?: number
}) {
  const ref = useRef<Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * speed + Math.PI * 0.7
    ref.current.position.set(Math.cos(t) * orbitRadius, y, Math.sin(t) * orbitRadius)
    ref.current.rotation.y = t * 1.2
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius, 28, 28]} />
      <meshPhysicalMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.28}
        roughness={0.5}
        metalness={0.05}
        clearcoat={0.5}
        clearcoatRoughness={0.2}
      />
    </mesh>
  )
}

function Planet({
  radius,
  color,
  emissive,
  orbitRadius,
  speed,
  y = 0,
}: {
  radius: number
  color: string
  emissive: string
  orbitRadius: number
  speed: number
  y?: number
}) {
  const ref = useRef<Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * speed
    ref.current.position.set(Math.cos(t) * orbitRadius, y, Math.sin(t) * orbitRadius)
    ref.current.rotation.y = t * 1.6
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius, 28, 28]} />
      <meshPhysicalMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.32}
        roughness={0.4}
        metalness={0.1}
        clearcoat={0.7}
        clearcoatRoughness={0.18}
      />
    </mesh>
  )
}

function FlowerParticles({ count }: { count: number }) {
  const ref = useRef<Points>(null)
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const radius = 1.85 + (i % 5) * 0.08
      data[i * 3] = Math.cos(angle) * radius
      data[i * 3 + 1] = (i % 3) * 0.06 - 0.04
      data[i * 3 + 2] = Math.sin(angle) * radius
    }
    return data
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.28
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#f0b4d4" size={0.055} transparent opacity={0.82} sizeAttenuation />
    </points>
  )
}

function generateParticlePositions(count: number): Float32Array {
  const data = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    const r = 2.2 + Math.random() * 0.8
    data[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    data[i * 3 + 1] = r * Math.cos(phi) * 0.6
    data[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
  }
  return data
}

function GlowParticles({ count }: { count: number }) {
  const ref = useRef<Points>(null)
  const positions = useMemo(() => generateParticlePositions(count), [count])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.15
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#6b93d4"
        size={0.025}
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function CatCompanion() {
  const group = useRef<Group>(null)

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime * 0.72
    group.current.position.set(Math.cos(t) * 2.45, -0.35 + Math.sin(t * 2) * 0.06, Math.sin(t) * 2.45)
    group.current.rotation.y = -t + Math.PI / 2
  })

  return (
    <group ref={group} scale={0.22}>
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.05, 0]} scale={[0.75, 1, 0.65]}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshStandardMaterial color="#eef3fc" roughness={0.5} />
      </mesh>
      <mesh position={[-0.28, 0.82, 0]} rotation={[0, 0, 0.35]}>
        <coneGeometry args={[0.14, 0.28, 8]} />
        <meshStandardMaterial color="#dce9fb" />
      </mesh>
      <mesh position={[0.28, 0.82, 0]} rotation={[0, 0, -0.35]}>
        <coneGeometry args={[0.14, 0.28, 8]} />
        <meshStandardMaterial color="#dce9fb" />
      </mesh>
      <mesh position={[0, 0.62, 0.42]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#6b93d4" />
      </mesh>
    </group>
  )
}

export function HeroOrbitWorld({ mouseX, mouseY, reduced, density = 'medium' }: HeroOrbitWorldProps) {
  const stage = useRef<Group>(null)
  const core = useRef<Mesh>(null)
  const flowerCount = density === 'low' ? 20 : density === 'high' ? 72 : 44
  const starCount = density === 'low' ? 360 : density === 'high' ? 1200 : 820
  const stageScale = density === 'low' ? 0.82 : density === 'high' ? 1.06 : 0.94
  const showCat = density !== 'low'

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const mx = mouseX.get()
    const my = mouseY.get()

    if (stage.current) {
      stage.current.rotation.y = reduced ? 0.2 : t * 0.08 + mx * 0.52
      stage.current.rotation.x = reduced ? 0.08 : my * 0.26
    }
    if (core.current && !reduced) {
      core.current.rotation.y = t * 0.22
    }
  })

  return (
    <>
      <ambientLight intensity={0.74} />
      <directionalLight position={[5, 6, 4]} intensity={1.1} />
      <pointLight position={[-3, -2, 4]} intensity={0.5} color="#b8cff0" />

      {/* 增强星空 */}
      <Stars radius={40} depth={26} count={starCount} factor={2.1} saturation={0.32} fade speed={0.35} />

      {/* 流星效果 */}
      {!reduced && density !== 'low' && (
        <>
          <ShootingStar delay={2} />
          <ShootingStar delay={6} />
        </>
      )}

      <group ref={stage} scale={stageScale}>
        {/* 核心星球 */}
        <mesh ref={core}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshPhysicalMaterial
            color="#eef3fc"
            emissive="#6b93d4"
            emissiveIntensity={0.2}
            roughness={0.36}
            metalness={0.12}
            clearcoat={0.82}
            clearcoatRoughness={0.14}
          />
        </mesh>

        {/* 核心光晕 */}
        <mesh>
          <sphereGeometry args={[1.08, 32, 32]} />
          <meshBasicMaterial color="#6b93d4" transparent opacity={0.08} side={THREE.BackSide} />
        </mesh>

        {/* 轨道环 1 */}
        <mesh rotation={[Math.PI / 2.1, 0, 0]}>
          <torusGeometry args={[1.52, 0.016, 10, 96]} />
          <meshBasicMaterial color="#b8cff0" transparent opacity={0.42} />
        </mesh>

        {/* 轨道环 2 */}
        <mesh rotation={[Math.PI / 3.4, 0.35, 0.15]}>
          <torusGeometry args={[2.05, 0.01, 10, 96]} />
          <meshBasicMaterial color="#8fafe8" transparent opacity={0.26} />
        </mesh>

        {!reduced ? (
          <>
            {/* 花瓣粒子 */}
            <FlowerParticles count={flowerCount} />

            {/* 光晕粒子层 */}
            {density !== 'low' && <GlowParticles count={density === 'high' ? 60 : 40} />}

            {/* 行星 1 */}
            <Planet radius={0.2} color="#dce9fb" emissive="#6b93d4" orbitRadius={1.35} speed={0.82} y={0.12} />

            {/* 行星 2 */}
            <Planet radius={0.14} color="#f7f9fd" emissive="#8fafe8" orbitRadius={1.65} speed={1.05} y={-0.08} />

            {/* 行星 3 - 新增 */}
            {density !== 'low' && (
              <PlanetThird radius={0.1} color="#e8d4f0" emissive="#c4a7d4" orbitRadius={1.85} speed={0.65} y={0.05} />
            )}

            {/* 小猫 */}
            {showCat ? <CatCompanion /> : null}
          </>
        ) : null}
      </group>
    </>
  )
}
