"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text3D } from "@react-three/drei"
import * as THREE from "three"
import { useRef } from "react"

const fontUrl = "/fonts/helvetiker_bold.typeface.json"

function TechcrunchText() {
  const textRef = useRef<THREE.Mesh>(null)

  // Create a purple-to-pink gradient-like look using vertex colors approximation
  const purple = new THREE.Color("#a855f7") // Purple
  const pink = new THREE.Color("#ec4899") // Pink
  const gradientColor = purple.clone().lerp(pink, 0.5)

  return (
    <Text3D
      ref={textRef}
      font={fontUrl}
      size={0.6} // Slightly larger text
      height={0.05}
      bevelEnabled
      bevelSize={0.015}
      bevelThickness={0.02}
      position={[-3.3, -0.3, 0]} // Centered
      letterSpacing={0.07} // Adjusted spacing
    >
      TECHCRUNCH
      <meshStandardMaterial color={gradientColor} metalness={0} roughness={0.4} />
    </Text3D>
  )
}

export default function Techcrunch3DText() {
  return (
    <div className="w-full h-[60vh] bg-white">
      <Canvas camera={{ position: [0, 0, 6.5], fov: 50 }} shadows>
        <color attach="background" args={["#ffffff"]} />
        <ambientLight intensity={1.2} />
        <TechcrunchText />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
      </Canvas>
    </div>
  )
}
