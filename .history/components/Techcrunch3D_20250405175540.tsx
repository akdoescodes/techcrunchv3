"use client"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Stars, Text3D } from "@react-three/drei"
import { useRef, Suspense, useMemo } from "react"
import * as THREE from "three"

export default function Techcrunch3D() {
  return (
    <div className="w-full h-[400px] md:h-[600px] rounded-xl overflow-hidden bg-black shadow-xl border border-purple-600">
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}

function Scene() {
  const textRef = useRef<THREE.Mesh>(null)
  
  useFrame(({ clock }) => {
    if (textRef.current) {
      textRef.current.rotation.y = clock.getElapsedTime() * 0.2
    }
  })

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#a855f7" />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#ffffff" />

      {/* Stars */}
      <Stars radius={100} depth={50} count={2000} factor={4} fade speed={0.5} />

      {/* 3D Text */}
      <Text3D
        ref={textRef}
        font="/fonts/helvetiker_bold.typeface.json"
        size={1.2}
        height={0.3}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.04}
        bevelSegments={3}
        position={[-5, 0, 0]}
      >
        TECHCRUNCH
        <meshStandardMaterial 
          color="#a855f7" 
          metalness={0.8} 
          roughness={0.2} 
          emissive="#7e22ce"
          emissiveIntensity={0.3}
        />
      </Text3D>

      {/* Controls */}
      <OrbitControls 
        enableZoom={false} 
        autoRotate 
        autoRotateSpeed={1.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
      />
    </>
  )
}