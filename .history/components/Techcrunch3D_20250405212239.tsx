"use client"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text3D } from "@react-three/drei"
import * as THREE from "three"
import { useRef, useMemo } from "react"

// Font import
const helvetiker = require("three/examples/fonts/helvetiker_bold.typeface.json")

function GradientTechcrunch() {
  return (
    <group position={[0, 0, 0]}>
      <Text3D
        font={helvetiker}
        size={1.2}
        height={0.3}
        curveSegments={12}
        bevelEnabled
        bevelSize={0.02}
        bevelThickness={0.05}
        position={[-4.5, -0.5, 0]} // Adjusted for perfect center
      >
        TECHCRUNCH
        <meshStandardMaterial
          color="#FF00FF" // Pink base
          emissive="#AA00FF" // Purple emissive
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </Text3D>
    </group>
  )
}

function OrbitingBalls({ count = 6, radius = 2.5, orbitRadius = 5, tilt = 0, speed = 1 }) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.5
      groupRef.current.children.forEach((ball, i) => {
        const angle = (i / count) * Math.PI * 2
        ball.position.x = Math.cos(angle) * radius
        ball.position.z = Math.sin(angle) * radius
      })
    }
  })

  return (
    <group ref={groupRef} rotation={[tilt, 0, 0]}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} position={[orbitRadius, 0, 0]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial
            color={new THREE.Color().lerpColors(
              new THREE.Color("#FFFF00"), // Yellow
              new THREE.Color("#00FF00"), // Green
              i / count
            )}
            metalness={0.9}
            roughness={0.1}
            emissive={i % 2 === 0 ? "#AAFF00" : "#FFAA00"}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

function createOrbitRing(radius: number, color: string) {
  const curve = new THREE.EllipseCurve(
    0, 0, radius, radius * 0.8, 0, Math.PI * 2, false, 0
  )
  const points = curve.getPoints(128)
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  return (
    <line geometry={geometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={0.2}
        linewidth={1}
      />
    </line>
  )
}

export default function TechcrunchOrbitalSystem() {
  const orbitConfigs = useMemo(() => [
    { tilt: 0, radius: 3.5, speed: 0.8, color: "#FF00FF" },
    { tilt: Math.PI/4, radius: 4, speed: 1, color: "#AA00FF" },
    { tilt: Math.PI/3, radius: 3.2, speed: 0.7, color: "#FF00AA" },
    { tilt: -Math.PI/4, radius: 3.8, speed: 0.9, color: "#CC00FF" },
    { tilt: Math.PI/6, radius: 4.2, speed: 1.1, color: "#FF0088" },
    { tilt: -Math.PI/6, radius: 3, speed: 0.6, color: "#DD00FF" },
    { tilt: Math.PI/2, radius: 4.5, speed: 1.2, color: "#FF0066" },
    { tilt: -Math.PI/3, radius: 3.5, speed: 0.85, color: "#EE00FF" }
  ], [])

  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
        <color attach="background" args={["#000000"]} />
        
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#FF00FF" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#AA00FF" />
        
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          autoRotate={true}
          autoRotateSpeed={0.3}
        />
        
        {/* Central TECHCRUNCH text */}
        <GradientTechcrunch />
        
        {/* 8 Orbital rings with balls */}
        {orbitConfigs.map((config, i) => (
          <group key={i} rotation={[config.tilt, 0, 0]}>
            {createOrbitRing(config.radius, config.color)}
            <OrbitingBalls 
              count={6} 
              radius={config.radius * 0.3} 
              orbitRadius={config.radius}
              tilt={config.tilt}
              speed={config.speed}
            />
          </group>
        ))}
      </Canvas>
    </div>
  )
}