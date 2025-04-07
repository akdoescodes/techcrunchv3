"use client"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Stars } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from "three"

const CodingLanguageBalls = () => {
  const balls = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (balls.current) {
      const time = clock.getElapsedTime()
      balls.current.children.forEach((ball, i) => {
        const angle = time * 0.5 + i
        const orbitLevel = 2 + (i % 3) * 2.5 // different orbit radii for symmetry
        const axis = i % 3

        let x = 0, y = 0, z = 0

        if (axis === 0) {
          x = Math.cos(angle) * orbitLevel
          y = Math.sin(angle) * orbitLevel
        } else if (axis === 1) {
          z = Math.cos(angle) * orbitLevel
          y = Math.sin(angle) * orbitLevel
        } else {
          x = Math.cos(angle) * orbitLevel
          z = Math.sin(angle) * orbitLevel
        }

        ball.position.set(x, y, z)
        ball.rotation.x += 0.01
        ball.rotation.y += 0.01
      })
    }
  })

  const languages = [
    { name: "C++", short: "C++", color: "#004482" },
    { name: "Python", short: "Py", color: "#3572A5" },
    { name: "C#", short: "C#", color: "#178600" },
    { name: "Java", short: "Jv", color: "#B07219" },
    { name: "JavaScript", short: "JS", color: "#F7DF1E" },
    { name: "Go", short: "Go", color: "#00ADD8" },
    { name: "Rust", short: "Rs", color: "#DEA584" },
    { name: "Ruby", short: "Rb", color: "#CC342D" }
  ]

  return (
    <group ref={balls}>
      {languages.map((lang, i) => (
        <mesh key={lang.name}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial 
            color={lang.color}
            emissive={lang.color}
            emissiveIntensity={0.4}
            metalness={0.6}
            roughness={0.3}
          />
          <Text
            position={[0, 0, 0.45]}
            fontSize={0.18}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {lang.short}
          </Text>
        </mesh>
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
      
      {/* Glow */}
      <mesh>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial
          color="#FF4D4D"
          transparent
          opacity={0.08}
          emissive="#FF4D4D"
          emissiveIntensity={0.3}
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
