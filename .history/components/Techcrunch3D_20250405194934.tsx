"use client"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Stars } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from "three"

const CodingLanguageBalls = () => {
  const balls = useRef<THREE.Group>(null)
  
  useFrame(({ clock }) => {
    if (balls.current) {
      // Orbit animation
      balls.current.children.forEach((ball, i) => {
        const time = clock.getElapsedTime()
        const angle = (i / balls.current!.children.length) * Math.PI * 2 + time * 0.5
        const radius = 5 + Math.sin(time * 0.3 + i) * 0.5 // Dynamic radius
        ball.position.x = Math.cos(angle) * radius
        ball.position.z = Math.sin(angle) * radius
        ball.position.y = Math.sin(time * 0.5 + i * 2) * 1.5 // Vertical movement
        ball.rotation.x += 0.02
        ball.rotation.y += 0.03
      })
    }
  })

  const languages = [
    { name: "C++", color: "#004482" },
    { name: "Python", color: "#3572A5" },
    { name: "C#", color: "#178600" },
    { name: "Java", color: "#B07219" },
    { name: "JS", color: "#F7DF1E" },
    { name: "Go", color: "#00ADD8" },
    { name: "Rust", color: "#DEA584" },
    { name: "Ruby", color: "#CC342D" }
  ]

  return (
    <group ref={balls}>
      {languages.map((lang, i) => (
        <mesh key={lang.name} castShadow position={[
          Math.cos((i / languages.length) * Math.PI * 2) * 5,
          Math.sin(i * 2) * 1.5,
          Math.sin((i / languages.length) * Math.PI * 2) * 5
        ]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial 
            color={lang.color} 
            emissive={lang.color} 
            emissiveIntensity={0.5}
            metalness={0.7}
            roughness={0.2}
          />
          <Text
            position={[0, 0, 0.6]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {lang.name}
          </Text>
        </mesh>
      ))}
    </group>
  )
}

const TechcrunchNucleus = () => {
  return (
    <group>
      {/* Main TECHCRUNCH text */}
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
      
      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshStandardMaterial
          color="#FF4D4D"
          transparent
          opacity={0.1}
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
        
        {/* Grid floor */}
        <gridHelper args={[20, 20, "#303030", "#202020"]} rotation-x={Math.PI / 2} position-y={-4} />
      </Canvas>
    </div>
  )
}