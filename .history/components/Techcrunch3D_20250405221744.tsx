"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text3D } from "@react-three/drei"
import * as THREE from "three"
import { useRef, useMemo } from "react"

const fontUrl = "/fonts/helvetiker_bold.typeface.json"

function TechcrunchText() {
  const meshRef = useRef<THREE.Mesh>(null)

  // Optional: Slow rotation for style
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.1
    }
  })

  const gradientTexture = useMemo(() => {
    const size = 512
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")!

    const gradient = ctx.createLinearGradient(0, 0, size, size)
    gradient.addColorStop(0, "#a020f0") // purple
    gradient.addColorStop(1, "#ff69b4") // pink
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
  }, [])

  return (
    <Text3D
      ref={meshRef}
      font={fontUrl}
      size={1}
      height={0.3}
      curveSegments={12}
      bevelEnabled
      bevelThickness={0.05}
      bevelSize={0.03}
      bevelOffset={0}
      bevelSegments={5}
      position={[-4.5, -0.5, 0]}
    >
      TECHCRUNCH
      <meshStandardMaterial map={gradientTexture} metalness={0.8} roughness={0.2} />
    </Text3D>
  )
}

export default function Techcrunch3DText() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <TechcrunchText />
        <OrbitControls enableZoom={true} enablePan={true} />
      </Canvas>
    </div>
  )
}
