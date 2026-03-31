"use client"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text3D } from "@react-three/drei"
import * as THREE from "three"
import { useRef, useMemo } from "react"

// Font import
const helvetiker = require("three/examples/fonts/helvetiker_bold.typeface.json")

function ProceduralTechcrunch() {
  const textRef = useRef<THREE.Mesh>(null)
  
  useFrame(({ clock }) => {
    if (textRef.current) {
      // Subtle pulsing animation
      textRef.current.material.emissiveIntensity = 0.5 + Math.sin(clock.getElapsedTime() * 2) * 0.2
    }
  })

  return (
    <group position={[0, 0, 0]}>
      <Text3D
        ref={textRef}
        font={helvetiker}
        size={0.7} // Optimal size for orbiting electrons
        height={0.2}
        curveSegments={12}
        bevelEnabled
        bevelSize={0.02}
        bevelThickness={0.05}
        position={[-2.8, -0.2, 0]}
      >
        TECHCRUNCH
        <meshPhysicalMaterial
          color="#8A2BE2" // Base purple
          emissive="#4B0082" // Deep indigo emissive
          emissiveIntensity={0.5}
          metalness={0.97}
          roughness={0.25}
          clearcoat={1}
          clearcoatRoughness={0.1}
          iridescence={1}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[100, 400]}
          envMapIntensity={1.5}
        />
      </Text3D>
    </group>
  )
}

function ProceduralElectron({ position, colorGradient }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.02
    }
  })

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshPhysicalMaterial
        color={colorGradient}
        metalness={0.98}
        roughness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.05}
        emissive={colorGradient}
        emissiveIntensity={0.3}
        iridescence={0.8}
        iridescenceIOR={1.2}
        envMapIntensity={2}
      />
    </mesh>
  )
}

function ElectronOrbit({ radius = 3.5, tilt = 0, speed = 1 }) {
  const groupRef = useRef<THREE.Group>(null)
  const electronCount = 6
  
  const electronPositions = useMemo(() => {
    return Array.from({ length: electronCount }).map((_, i) => {
      const angle = (i / electronCount) * Math.PI * 2
      return {
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        ),
        color: new THREE.Color().lerpColors(
          new THREE.Color("#FFFF00"), // Yellow
          new THREE.Color("#00FF00"), // Green
          i / electronCount
        )
      }
    })
  }, [radius, electronCount])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * speed
    }
  })

  return (
    <group ref={groupRef} rotation={[tilt, 0, 0]}>
      {electronPositions.map(({ position, color }, i) => (
        <ProceduralElectron 
          key={i} 
          position={position} 
          colorGradient={color} 
        />
      ))}
    </group>
  )
}

export default function AtomicOrbitSystem() {
  const orbitConfigs = useMemo(() => [
    { radius: 3.0, tilt: 0, speed: 0.7 },
    { radius: 3.8, tilt: Math.PI/4, speed: 0.9 },
    { radius: 4.2, tilt: Math.PI/3, speed: 1.1 },
    { radius: 4.6, tilt: -Math.PI/4, speed: 0.8 },
    { radius: 5.0, tilt: Math.PI/6, speed: 1.0 },
    { radius: 5.4, tilt: -Math.PI/3, speed: 0.6 },
    { radius: 5.8, tilt: Math.PI/2, speed: 1.2 },
    { radius: 6.2, tilt: -Math.PI/6, speed: 0.85 }
  ], [])

  return (
    <div className="w-full h-screen bg-neutral-900">
      <Canvas shadows camera={{ position: [0, 0, 12], fov: 45 }}>
        <color attach="background" args={["#111111"]} />
        
        {/* Professional lighting */}
        <ambientLight intensity={0.4} color="#4040FF" />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.2}
          color="#9370DB" // Medium purple
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.7} color="#00BFFF" />
        
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.3}
        />

        {/* Fog for depth */}
        <fog attach="fog" args={["#111111", 5, 15]} />
        
        {/* Central element */}
        <ProceduralTechcrunch />
        
        {/* 8 Orbital systems */}
        {orbitConfigs.map((config, i) => (
          <ElectronOrbit 
            key={i}
            radius={config.radius}
            tilt={config.tilt}
            speed={config.speed}
          />
        ))}
      </Canvas>
    </div>
  )
}