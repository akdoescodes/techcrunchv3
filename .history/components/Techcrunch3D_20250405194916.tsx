"use client"
import { Canvas, useFrame, extend } from "@react-three/fiber"
import { OrbitControls, Text, Stars, useTexture } from "@react-three/drei"
import { useRef, Suspense } from "react"
import * as THREE from "three"
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

// Extend Three.js with TextGeometry
extend({ TextGeometry })

const CodingLanguageBalls = () => {
  const balls = useRef<THREE.Group>(null)
  
  useFrame(({ clock }) => {
    if (balls.current) {
      balls.current.children.forEach((ball, i) => {
        const time = clock.getElapsedTime()
        const angle = (i / balls.current!.children.length) * Math.PI * 2 + time * 0.5
        const radius = 5 + Math.sin(time * 0.3 + i) * 0.5
        ball.position.x = Math.cos(angle) * radius
        ball.position.z = Math.sin(angle) * radius
        ball.position.y = Math.sin(time * 0.5 + i * 2) * 1.5
        ball.rotation.x += 0.02
        ball.rotation.y += 0.03
      })
    }
  })

  const languages = [
    { name: "C++", color: "#004482" },
    { name: "Py", color: "#3572A5" },
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
        <mesh key={lang.name} castShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
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
            font="/fonts/helvetiker_bold.typeface.json"
          >
            {lang.name}
          </Text>
        </mesh>
      ))}
    </group>
  )
}

const TechcrunchNucleus = () => {
  const font = new FontLoader().parse(require('@/public/fonts/helvetiker_bold.typeface.json'))
  
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <textGeometry args={[
          "TECHCRUNCH", 
          {
            font,
            size: 2,
            height: 0.5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelOffset: 0,
            bevelSegments: 5
          }
        ]} />
        <meshStandardMaterial 
          color="#FF4D4D"
          emissive="#FF4D4D"
          emissiveIntensity={1.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshStandardMaterial
          color="#FF4D4D"
          transparent
          opacity={0.15}
          emissive="#FF4D4D"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  )
}

export default function TechScene() {
  return (
    <div className="w-full h-[600px] bg-black rounded-xl border border-purple-600">
      <Canvas shadows camera={{ position: [0, 0, 15], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#FF4D4D" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#4D79FF" />
          <pointLight position={[0, 5, 0]} intensity={0.5} color="#FFFFFF" />
          
          <OrbitControls 
            enableZoom={true}
            autoRotate={true}
            autoRotateSpeed={0.8}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            enablePan={false}
          />
          
          <TechcrunchNucleus />
          <CodingLanguageBalls />
          
          <Stars radius={100} depth={50} count={3000} factor={6} fade speed={2} />
          
          <gridHelper args={[30, 30, "#404040", "#303030"]} rotation-x={-Math.PI / 2} position-y={-5} />
        </Suspense>
      </Canvas>
    </div>
  )
}