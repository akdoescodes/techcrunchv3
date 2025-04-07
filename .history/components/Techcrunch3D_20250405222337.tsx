"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text3D } from "@react-three/drei"
import * as THREE from "three"
import { useRef } from "react"

const fontUrl = "/fonts/helvetiker_bold.typeface.json"

function TechcrunchText() {
  const textRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.2
    }
  })

  return (
    <Text3D
      ref={textRef}
      font={fontUrl}
      size={0.25}
      height={0.05}
      bevelEnabled
      bevelSize={0.015}
      bevelThickness={0.02}
      position={[-1.8, -0.1, 0]}
    >
      TECHCRUNCH
      <meshStandardMaterial
        color="#a855f7"
        metalness={0.0}
        roughness={0.5}
      />
    </Text3D>
  )
}

export default function Techcrunch3DText() {
  return (
    <div className="w-full h-[60vh] bg-white">
      <Canvas camera={{ position: [0, 0, 6.5], fov: 50 }} shadows>
        <color attach="background" args={["#ffffff"]} />
        <ambientLight intensity={1.5} />
        <TechcrunchText />
        <OrbitControls enableZoom enablePan />
      </Canvas>
    </div>
  )
}