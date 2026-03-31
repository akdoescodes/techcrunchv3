"use client"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text3D, Center } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from "three"
import helvetiker from "three/examples/fonts/helvetiker_bold.typeface.json"

const ElectronOrbit = () => {
  const groupRef = useRef<THREE.Group>(null)

  const electronCount = 6

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.children.forEach((electron, i) => {
        const angle = (i / electronCount) * Math.PI * 2 + time * 0.8
        const orbitTilt = i % 2 === 0 ? 0 : Math.PI / 4
        const radius = 6

        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const y = Math.sin(angle + i) * 1.5 * Math.sin(orbitTilt)

        electron.position.set(x, y, z)
      })
    }
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: electronCount }).map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial
            color="#00AEEF"
            emissive="#00AEEF"
            emissiveIntensity={1}
            metalness={0.5}
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

const TechcrunchNucleus = () => {
  return (
    <Center>
      <Text3D
        font={helvetiker}
        size={2}
        height={0.4}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.08}
        bevelSize={0.05}
        bevelSegments={6}
      >
        TECHCRUNCH
        <meshStandardMaterial
          color="#FF4D4D"
          emissive="#FF4D4D"
          emissiveIntensity={1.2}
          metalness={0.9}
          roughness={0.1}
        />
      </Text3D>
    </Center>
  )
}

export default function TechScene() {
  return (
    <div className="w-full h-screen bg-white rounded-xl border border-gray-300">
      <Canvas shadows camera={{ position: [0, 0, 20], fov: 50 }}>
        <color attach="background" args={["#ffffff"]} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#FF4D4D" />
        <pointLight position={[-10, -10, -10]} intensity={0.6} color="#4D79FF" />

        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />

        <TechcrunchNucleus />
        <ElectronOrbit />
      </Canvas>
    </div>
  )
}
