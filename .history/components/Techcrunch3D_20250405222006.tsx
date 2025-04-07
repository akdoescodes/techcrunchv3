"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text3D } from "@react-three/drei"
import * as THREE from "three"
import { useRef, useMemo } from "react"

// Make sure you have this font in public/fonts folder
const fontUrl = "/fonts/helvetiker_bold.typeface.json"

function TechcrunchText() {
  const textRef = useRef<THREE.Mesh>(null)

  // Animate rotation
  useFrame(({ clock }) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.2
    }
  })

  // Create canvas gradient texture
  const gradientMap = useMemo(() => {
    const size = 512
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")!

    const gradient = ctx.createLinearGradient(0, 0, size, size)
    gradient.addColorStop(0, "#2a2aff")   // deep blue
    gradient.addColorStop(1, "#8a2be2")   // electric violet

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [])

  return (
    <Text3D
      ref={textRef}
      font={fontUrl}
      size={0.4}
      height={0.1}
      bevelEnabled
      bevelSize={0.02}
      bevelThickness={0.02}
      position={[-2.3, -0.2, 0]}
    >
      TECHCRUNCH
      <meshBasicMaterial map={gradientMap} toneMapped={false} />
    </Text3D>
  )
}

export default function Techcrunch3DText() {
  return (
    <div className="w-full h-screen bg-white">
      <Canvas camera={{ position: [0, 0, 6.5], fov: 50 }}>
        <color attach="background" args={["#ffffff"]} />
        <ambientLight intensity={1.2} />
        <TechcrunchText />
        <OrbitControls enableZoom enablePan />
      </Canvas>
    </div>
  )
}
