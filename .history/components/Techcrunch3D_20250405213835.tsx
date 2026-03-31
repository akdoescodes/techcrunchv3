"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text3D } from "@react-three/drei"
import * as THREE from "three"
import { useRef, useMemo } from "react"

// Font import
const helvetiker = require("three/examples/fonts/helvetiker_bold.typeface.json")

function TechcrunchText() {
  const textRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (textRef.current) {
      textRef.current.material.emissiveIntensity = 0.5 + Math.sin(clock.getElapsedTime() * 2) * 0.2
    }
  })

  return (
    <group position={[0, 0, 0]}>
      <Text3D
        ref={textRef}
        font={helvetiker}
        size={0.7}
        height={0.2}
        curveSegments={12}
        bevelEnabled
        bevelSize={0.02}
        bevelThickness={0.05}
        position={[-3.2, -0.2, 0]}
      >
        TECHCRUNCH
        <meshPhysicalMaterial
          color="#ffffff"
          emissive="#ffffff"
          metalness={0.8}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Text3D>
    </group>
  )
}

function FloatingSquare({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002
      meshRef.current.rotation.y += 0.002
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshPhysicalMaterial
        color="#bf6dfd"
        metalness={0.9}
        roughness={0.1}
        clearcoat={1}
        emissive="#bf6dfd"
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

function FloatingSquaresField({ count = 100 }) {
  const positions = useMemo(() => {
    const temp: [number, number, number][] = []
    for (let i = 0; i < count; i++) {
      temp.push([
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ])
    }
    return temp
  }, [count])

  return (
    <>
      {positions.map((pos, i) => (
        <FloatingSquare key={i} position={pos} />
      ))}
    </>
  )
}

export default function TechcrunchScene() {
  return (
    <div className="w-full h-screen bg-neutral-900">
      <Canvas shadows camera={{ position: [0, 0, 12], fov: 45 }}>
        <color attach="background" args={["#111111"]} />

        {/* Lighting */}
        <ambientLight intensity={0.4} color="#9370DB" />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.2}
          color="#9370DB"
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.7} color="#00BFFF" />

        <OrbitControls enableZoom enablePan={false} autoRotate autoRotateSpeed={0.3} />

        {/* Fog */}
        <fog attach="fog" args={["#111111", 5, 15]} />

        {/* Text and Background */}
        <TechcrunchText />
        <FloatingSquaresField count={150} />
      </Canvas>
    </div>
  )
}