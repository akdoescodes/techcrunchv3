"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, useMemo } from "react"
import * as THREE from "three"

const wireConfigs = [
  {
    radius: 0.3,
    turns: 5,
    height: 1.5,
    color: "#A855F7",
    thickness: 0.045,
    phaseOffset: 0,
  },
  {
    radius: 0.5,
    turns: 6,
    height: 2,
    color: "#EC4899",
    thickness: 0.05,
    phaseOffset: Math.PI / 2,
  },
  {
    radius: 0.7,
    turns: 7,
    height: 2.5,
    color: "#7E22CE",
    thickness: 0.06,
    phaseOffset: Math.PI,
  },
]

const HelixWire = ({
    radius,
    turns,
    height,
    thickness,
    phaseOffset,
  }: {
    radius: number
    turns: number
    height: number
    thickness: number
    phaseOffset: number
  }) => {
    const tubeRef = useRef<THREE.Mesh>(null!)
  
    const path = useMemo(() => {
      const curve = new THREE.Curve<THREE.Vector3>()
      curve.getPoint = (t) => {
        const angle = 2 * Math.PI * turns * t + phaseOffset
        const x = radius * Math.cos(angle)
        const y = height * (t - 0.5)
        const z = radius * Math.sin(angle)
        return new THREE.Vector3(x, y, z)
      }
      return curve
    }, [radius, turns, height, phaseOffset])
  
    const geometry = useMemo(
      () => new THREE.TubeGeometry(path, 300, thickness, 64, false),
      [path, thickness]
    )
  
    const material = useMemo(
      () =>
        new THREE.MeshPhysicalMaterial({
          transparent: true,
          transmission: 1.0,         // Full glass transmission
          thickness: 0.6,            // Depth of refraction
          roughness: 0.05,           // Super smooth
          metalness: 0,
          ior: 1.45,                 // Realistic glass IOR
          reflectivity: 0.8,         // Strong reflection
          clearcoat: 1,
          clearcoatRoughness: 0.05,
          attenuationColor: new THREE.Color(0xffffff),
          attenuationDistance: 0.8,
          side: THREE.DoubleSide
        }),
      []
    )
  
    useFrame(({ clock }) => {
      tubeRef.current.rotation.y = clock.getElapsedTime() * 0.3
    })
  
    return <mesh ref={tubeRef} geometry={geometry} material={material} />
  }
  

const EnergyCore = () => {
  const meshRef = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    const s = 1 + 0.2 * Math.sin(clock.getElapsedTime() * 3)
    meshRef.current.scale.set(s, s, s)
    meshRef.current.rotation.y += 0.01
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.12, 64, 64]} />
      <meshStandardMaterial emissive="#A855F7" emissiveIntensity={1.5} color="#A855F7" />
    </mesh>
  )
}

export const PowerWiresAnimation = () => {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[2, 2, 2]} intensity={3} />
        <pointLight position={[-2, -2, -2]} intensity={2} color="#F0F" />
        <EnergyCore />
        {wireConfigs.map((cfg, i) => (
          <HelixWire key={i} {...cfg} />
        ))}
      </Canvas>
    </div>
  )
}
