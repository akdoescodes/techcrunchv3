"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text3D } from "@react-three/drei"
import * as THREE from "three"
import { useRef } from "react"

const fontUrl = "/fonts/helvetiker_bold.typeface.json"

function TechcrunchText() {
  const textRef = useRef<THREE.Mesh>(null)

  return (
    <Text3D
      ref={textRef}
      font={fontUrl}
      size={0.8} // Larger size
      height={0.2} // Thicker text
      bevelEnabled
      bevelSize={0.03}
      bevelThickness={0.05}
      position={[-4, -0.4, 0]} // Adjusted centering
      letterSpacing={0.1} // Increased spacing
    >
      TECHCRUNCH
      <meshStandardMaterial color={"#a855f7"} />
    </Text3D>
  )
}

export default function Techcrunch3DText() {
  return (
    <div className="w-full h-[60vh] bg-white">
      <Canvas camera={{ position: [0, 0, 7.5], fov: 50 }} shadows>
        <color attach="background" args={["#ffffff"]} />
        <ambientLight intensity={1.5} />
        <TechcrunchText />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
      </Canvas>
    </div>
  )
}
