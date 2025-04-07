"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"

export default function TechcrunchSimple() {
  return (
    <div className="w-full h-[70vh] bg-white flex flex-col items-center justify-center">
      {/* Gradient TECHCRUNCH Text */}
      <h1
        className="text-6xl font-extrabold mb-10 text-transparent bg-clip-text"
        style={{
          backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
        }}
      >
        TECHCRUNCH
      </h1>

      {/* 3D Canvas with Green Ball */}
      <div className="w-full h-[40vh]">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[2, 2, 2]} intensity={1} />
          <mesh>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="green" />
          </mesh>
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>
    </div>
  )
}
