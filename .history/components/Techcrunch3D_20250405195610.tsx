"use client"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Stars, Text } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from "three"

const CodingLanguageBalls = () => {
  const balls = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (balls.current) {
      const time = clock.getElapsedTime()
      balls.current.children.forEach((group, i) => {
        const angle = time * 0.5 + i
        const radius = 4 + (i % 2) * 1.5
        const orbitTilt = (i % 2 === 0) ? 0 : Math.PI / 4

        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const y = Math.sin(angle) * radius * Math.sin(orbitTilt)

        group.position.set(x, y, z)
        group.rotation.y = angle
      })
    }
  })

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

  return (
    <group ref={balls}>
      {languages.map((lang, i) => (
        <group key={lang.short}>
          <mesh>
            <sphereGeometry args={[0.35, 32, 32]} />
            <meshStandardMaterial 
              color={lang.color}
              emissive={lang.color}
              emissiveIntensity={0.5}
              metalness={0.6}
              roughness={0.3}
            />
            <Text
              position={[0, 0, 0]}
              fontSize={0.2}
              color="white"
              anchorX="center"
              anchorY="middle"
              rotation={[0, 0, 0]}
            >
              {lang.short}
            </Text>
          </mesh>
        </group>
      ))}
    </group>
  )
}

const TechcrunchNucleus = () => {
  return (
    <group>
      <Text
        position={[0, 0, 0]}
        fontSize={2}
        letterSpacing={0.1}
        color="#FF4D4D"
      >
        TECHCRUNCH
        <meshStandardMaterial 
          color="#FF4D4D"
          emissive="#FF4D4D"
          emissiveIntensity={1}
          metalness={0.8}
          roughness={0.1}
        />
      </Text>

      {/* Glow sphere */}
      <mesh>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshStandardMaterial
          color="#FF4D4D"
          transparent
          opacity={0.08}
          emissive="#FF4D4D"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  )
}

export default function TechScene() {
  return (
    <div className="w-full h-screen bg-black rounded-xl border border-gray-800">
      <Canvas shadows camera={{ position: [0, 0, 15], fov: 50 }}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#FF4D4D" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4D79FF" />

        <OrbitControls
          enableZoom={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />

        <TechcrunchNucleus />
        <CodingLanguageBalls />
        <Stars radius={100} depth={50} count={2000} fade speed={2} />
        <gridHelper args={[20, 20, "#303030", "#202020"]} rotation-x={Math.PI / 2} position-y={-4} />
      </Canvas>
    </div>
  )
}
