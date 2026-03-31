"use client"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text3D, Center } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from "three"
import helvetiker from "three/examples/fonts/helvetiker_bold.typeface.json"

const LanguageInitialsOrbit = () => {
  const groupRef = useRef<THREE.Group>(null)

  const languages = [
    { short: "C++", color: "#004482" },
    { short: "Py", color: "#3572A5" },
    { short: "C#", color: "#178600" },
    { short: "Jv", color: "#B07219" },
    { short: "JS", color: "#F7DF1E" },
    { short: "Go", color: "#00ADD8" },
    { short: "Rs", color: "#DEA584" },
    { short: "Rb", color: "#CC342D" }
  ]

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.children.forEach((text, i) => {
        const angle = t * 0.4 + (i / languages.length) * Math.PI * 2
        const radius = 6
        const tilt = (i % 2 === 0) ? 0 : Math.PI / 5

        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const y = Math.sin(angle + i) * 1.5 * Math.sin(tilt)

        text.position.set(x, y, z)
        text.rotation.y = -angle
      })
    }
  })

  return (
    <group ref={groupRef}>
      {languages.map((lang, i) => (
        <Text3D
          key={i}
          font={helvetiker}
          size={0.8}
          height={0.3}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.03}
          bevelSize={0.03}
          bevelSegments={3}
        >
          {lang.short}
          <meshStandardMaterial color={lang.color} metalness={0.6} roughness={0.2} />
        </Text3D>
      ))}
    </group>
  )
}

const TechcrunchText = () => {
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
          emissiveIntensity={1}
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

        {/* Lighting setup */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[6, 6, 6]} intensity={1.2} color="#FF4D4D" />
        <directionalLight position={[-6, -6, -6]} intensity={0.8} color="#4D79FF" />

        <OrbitControls
          enableZoom={true}
          autoRotate={true}
          autoRotateSpeed={0.6}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />

        <TechcrunchText />
        <LanguageInitialsOrbit />
      </Canvas>
    </div>
  )
}
