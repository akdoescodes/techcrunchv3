"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, useMemo } from "react"
import * as THREE from "three"

const NUM_WIRES = 10

const generateWireConfigs = () => {
  const configs = []
  const angleStep = (Math.PI * 2) / NUM_WIRES

  for (let i = 0; i < NUM_WIRES; i++) {
    const angle = angleStep * i
    const length = 3
    const x = Math.cos(angle) * length
    const y = Math.sin(angle) * length
    const z = 0
    configs.push({
      start: [0, 0, 0],
      end: [x, y, z],
      radius: 0.03 + 0.01 * (i % 3),
    })
  }

  return configs
}

const Wire = ({ start, end, radius }: any) => {
  const meshRef = useRef<THREE.Mesh>(null!)

  const points = useMemo(() => {
    return [new THREE.Vector3(...start), new THREE.Vector3(...end)]
  }, [start, end])

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points])

  const geometry = useMemo(() => {
    const tubularSegments = 100
    return new THREE.TubeGeometry(curve, tubularSegments, radius, 16, false)
  }, [curve, radius])

  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      transmission: 1, // glass effect
      thickness: 0.5,
      roughness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0,
      reflectivity: 1,
      ior: 1.4,
      color: new THREE.Color(0xffffff),
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 0.05,
      opacity: 0.4,
      transparent: true,
    })
  }, [])

  useFrame(({ clock }) => {
    const glow = 0.05 + Math.sin(clock.elapsedTime * 2) * 0.02
    material.emissiveIntensity = glow
  })

  return <mesh ref={meshRef} geometry={geometry} material={material} />
}

const EnergyCore = () => {
  const meshRef = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    const s = 1 + 0.2 * Math.sin(clock.getElapsedTime() * 2)
    meshRef.current.scale.set(s, s, s)
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.05, 32, 32]} />
      <meshBasicMaterial color="#ffffff" toneMapped={false} />
    </mesh>
  )
}

export const PowerWiresAnimation = () => {
  const configs = generateWireConfigs()

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 3]} intensity={1.5} />
        {configs.map((wire, i) => (
          <Wire key={i} {...wire} />
        ))}
        <EnergyCore />
      </Canvas>
    </div>
  )
}
