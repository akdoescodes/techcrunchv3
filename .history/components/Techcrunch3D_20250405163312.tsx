"use client"
import fontJson from "@/../public/fonts/helvetiker_bold.typeface.json";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

const font = new FontLoader().parse(fontJson);

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stars } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from "three"

import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"

function TechcrunchText() {
  const meshRef = useRef<THREE.Mesh>(null)

  const font = new FontLoader().parse(
    require("../../public/fonts/helvetiker_bold.typeface.json")
  )

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
      <textGeometry args={["TECHCRUNCH", textOptions]} />
      <meshStandardMaterial color="#a855f7" metalness={0.6} roughness={0.2} />
    </mesh>
  )
}

export default function Techcrunch3D() {
  return (
    <div className="w-full h-[400px] md:h-[600px] rounded-xl overflow-hidden bg-black shadow-xl border border-purple-600">
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={1} />

        {/* Stars + Orbit */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />

        {/* 3D Text */}
        <TechcrunchText />
      </Canvas>
    </div>
  )
}
