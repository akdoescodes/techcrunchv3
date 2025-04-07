"use client"

import { Canvas, extend, useFrame } from "@react-three/fiber"
import { OrbitControls, Stars } from "@react-three/drei"
import { useRef, Suspense } from "react"
import * as THREE from "three"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
import { TextGeometry } from "three-stdlib"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import fontJson from "@/assets/fonts/helvetiker_bold.typeface.json"

// Register TextGeometry with THREE
extend({ TextGeometry })

function TechcrunchText() {
  const meshRef = useRef<THREE.Mesh>(null)
  const font = new FontLoader().parse(fontJson)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.1
      meshRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.2
    }
  })

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
      <meshStandardMaterial 
        color="#a855f7" 
        emissive="#c084fc" 
        emissiveIntensity={1.5}
        metalness={0.8} 
        roughness={0.1} 
      />
    </mesh>
  )
}

export default function Techcrunch3D() {
  return (
    <div className="w-full h-[400px] md:h-[600px] rounded-xl overflow-hidden bg-black shadow-xl border border-purple-600">
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={2} color="#e879f9" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#a855f7" />
          <pointLight position={[0, 0, 5]} intensity={2} color="#c084fc" />
          
          <OrbitControls 
            enableZoom={false} 
            autoRotate 
            autoRotateSpeed={1.5} 
            enablePan={false}
          />
          
          <TechcrunchText />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <EffectComposer>
            <Bloom
              intensity={1.5}
              luminanceThreshold={0.5}
              luminanceSmoothing={0.1}
              height={300}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}