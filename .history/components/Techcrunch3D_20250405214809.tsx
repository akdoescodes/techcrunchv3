"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, useMemo, Suspense } from "react"
import { OrbitControls, Text3D, Environment, Stars } from "@react-three/drei"
import * as THREE from "three"
import { easing } from "maath"

const helvetiker = require("three/examples/fonts/helvetiker_bold.typeface.json")

function GlowingCube({ size = 2.5, color = "#C084FC" }) {
  const meshRef = useRef()

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.0015
      meshRef.current.rotation.y += 0.002
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.07}
        emissive={color}
        emissiveIntensity={0.9}
        roughness={0.1}
        metalness={0.8}
      />
    </mesh>
  )
}

function TesseractEdges({ size = 2.5, color = "#A855F7" }) {
  const groupRef = useRef()
  const edgeGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(size, size, size))

  useFrame(() => {
    groupRef.current.rotation.x += 0.002
    groupRef.current.rotation.y += 0.0012
  })

  return (
    <group ref={groupRef}>
      {[...Array(4)].map((_, i) => (
        <lineSegments key={i} geometry={edgeGeometry}>
          <lineBasicMaterial
            color={color}
            linewidth={2}
            toneMapped={false}
          />
        </lineSegments>
      ))}
    </group>
  )
}

function FloatingText() {
  const meshRef = useRef()

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.3
    }
  })

  return (
    <Text3D
      ref={meshRef}
      font={helvetiker}
      size={0.7}
      height={0.3}
      bevelEnabled
      bevelSize={0.04}
      bevelThickness={0.07}
      curveSegments={16}
      position={[-2.8, 0, 0]}
    >
      TECHCRUNCH
      <meshPhysicalMaterial
        color="#ffffff"
        metalness={0.95}
        roughness={0.25}
        clearcoat={1}
        clearcoatRoughness={0.1}
        emissive="#9333EA"
        emissiveIntensity={0.9}
        iridescence={1}
        iridescenceIOR={1.3}
        envMapIntensity={1.8}
      />
    </Text3D>
  )
}

function AnimatedSquares({ count = 40 }) {
  const squares = useMemo(() => {
    return [...Array(count)].map(() => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
      ],
      scale: 0.1 + Math.random() * 0.2,
    }))
  }, [count])

  return (
    <group>
      {squares.map((square, idx) => (
        <mesh key={idx} position={square.position}>
          <boxGeometry args={[square.scale, square.scale, square.scale]} />
          <meshStandardMaterial
            color="#9333EA"
            emissive="#A855F7"
            emissiveIntensity={0.7}
            roughness={0.2}
            metalness={1}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}

function PremiumTesseractScene() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
      <color attach="background" args={["#0f0f1b"]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#E879F9" />
      <directionalLight position={[-5, 5, 5]} intensity={1.5} color="#7C3AED" />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.7}
      />

      <fog attach="fog" args={["#0f0f1b", 10, 25]} />

      <Suspense fallback={null}>
        <Environment preset="city" />
        <GlowingCube />
        <TesseractEdges />
        <FloatingText />
        <AnimatedSquares />
      </Suspense>
    </Canvas>
  )
}

export default function TechcrunchTesseract3D() {
  return (
    <div className="w-full h-screen bg-black">
      <PremiumTesseractScene />
    </div>
  )
}
