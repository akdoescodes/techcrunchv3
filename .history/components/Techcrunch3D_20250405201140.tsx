"use client"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text3D, Center } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { useRef } from "react"
import * as THREE from "three"
import helvetiker from "three/examples/fonts/helvetiker_bold.typeface.json"

const Electron = ({ radius = 5, speed = 1, offset = 0, tilt = 0 }) => {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset
    const x = Math.cos(t) * radius
    const z = Math.sin(t) * radius
    const y = Math.sin(t * 0.5) * 0.5

    const sinTilt = Math.sin(tilt)
    const cosTilt = Math.cos(tilt)

    // Apply tilt transform
    ref.current?.position.set(
      x,
      y * cosTilt - z * sinTilt,
      y * sinTilt + z * cosTilt
    )
  })

  return (
    <mesh ref={ref}>
  <sphereGeometry args={[0.25, 16, 16]} />
  <meshStandardMaterial
    color="#00FF88" // vibrant green
    emissive="#00FF88"
    emissiveIntensity={2}
    metalness={0.6}
    roughness={0.1}
  />
</mesh>

  )
}

const OrbitRing = ({ radius = 5, tilt = 0 }) => {
  const ring = new THREE.RingGeometry(radius - 0.01, radius + 0.01, 64)
  ring.rotateX(Math.PI / 2)

  return (
    <mesh rotation={[tilt, 0, 0]}>
      <primitive object={ring} attach="geometry" />
      <meshBasicMaterial color="#cccccc" transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  )
}

const Nucleus = () => {
  return (
    <>
      {/* Glowing core */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color="#FF4D4D"
          emissive="#FF4D4D"
          emissiveIntensity={1.5}
          roughness={0.3}
          metalness={1}
        />
      </mesh>

      {/* Floating text */}
      <Center position={[0, 2.5, 0]}>
      <Text3D
        font={helvetiker}
        size={0.8}
        height={0.2}
        bevelEnabled
        bevelSize={0.02}
        bevelThickness={0.04}
        >
        TECHCRUNCH
        <meshStandardMaterial
            color="#8000FF" // rich purple
            emissive="#8000FF"
            emissiveIntensity={1.5}
            metalness={0.9}
            roughness={0.1}
        />
    </Text3D>

      </Center>
    </>
  )
}

export default function AtomScene() {
  return (
    <div className="w-full h-screen bg-white rounded-xl border border-gray-300">
      <Canvas shadows camera={{ position: [0, 0, 15], fov: 50 }}>
        <color attach="background" args={["#ffffff"]} />

        {/* Lights */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#FF4D4D" />
        <pointLight position={[-10, -10, -10]} intensity={0.6} color="#4D79FF" />

        {/* Controls (no auto rotate) */}
        <OrbitControls enableZoom enableRotate autoRotate={false} />

        {/* Atom Core */}
        <Nucleus />

        {/* First Shell */}
        <OrbitRing radius={5} tilt={0} />
        <Electron radius={5} speed={1} offset={0} tilt={0} />
        <Electron radius={5} speed={1} offset={Math.PI} tilt={0} />

        {/* Second Shell (tilted) */}
        <OrbitRing radius={7} tilt={Math.PI / 4} />
        <Electron radius={7} speed={0.8} offset={0} tilt={Math.PI / 4} />
        <Electron radius={7} speed={0.8} offset={Math.PI / 2} tilt={Math.PI / 4} />
        <Electron radius={7} speed={0.8} offset={Math.PI} tilt={Math.PI / 4} />
        <Electron radius={7} speed={0.8} offset={(3 * Math.PI) / 2} tilt={Math.PI / 4} />

        {/* Bloom/Glow Effects */}
        <EffectComposer>
  <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.95} intensity={0.3} />
</EffectComposer>

      </Canvas>
    </div>
  )
}
