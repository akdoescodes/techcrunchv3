"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stars } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from "three"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
import { TextGeometry } from "three-stdlib" // ✅ required to use TextGeometry
import fontJson from "@/assets/fonts/helvetiker_bold.typeface.json"

// ✅ Register TextGeometry with THREE
THREE.TextGeometry = TextGeometry as any

function TechcrunchText() {
  const meshRef = useRef<THREE.Mesh>(null)
  const font = new FontLoader().parse(fontJson)

  const textOptions = {
    font,
    size: 1.2,
    height: 0.3,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.04,
    bevelSegments: 3,
  }

  return (
    <mesh ref={meshRef} position={[-6, 0, 0]}>
      {/* @ts-ignore - suppress TS error for TextGeometry */}
      <textGeometry args={["TECHCRUNCH", textOptions]} />
      <meshStandardMaterial color="#a855f7" metalness={0.6} roughness={0.2} />
    </mesh>
  )
}

export default function Techcrunch3D() {
  return (
    <div className="w-full h-[400px] md:h-[600px] rounded-xl overflow-hidden bg-black shadow-xl border border-purple-600">
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={1} />
        
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
        <TechcrunchText />
      </Canvas>
    </div>
  )
}
