"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import { useRef } from "react"

function OrbitingBall() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const radius = 3
    const speed = 1
    if (ref.current) {
      ref.current.position.x = Math.cos(t * speed) * radius
      ref.current.position.z = Math.sin(t * speed) * radius
    }
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color="#b6d94c" />
    </mesh>
  )
}

export default function TechcrunchWithOrbitingBall() {
  return (
    <div className="w-full h-[70vh] bg-white flex flex-col items-center justify-center">
      {/* Gradient Text 2D */}
      <h1
        className="text-6xl font-extrabold text-transparent bg-clip-text mb-6"
        style={{
          backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
        }}
      >
        TECHCRUNCH
      </h1>

      {/* 3D Orbiting Ball */}
      <div className="w-full h-[40vh]">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[3, 3, 5]} intensity={0.5} />
          <OrbitingBall />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>
    </div>
  )
}
