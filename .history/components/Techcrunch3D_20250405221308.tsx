"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text3D, Stars } from "@react-three/drei"
import * as THREE from "three"
import { useRef, useMemo } from "react"
import { EffectComposer, Bloom, DepthOfField } from "@react-three/postprocessing"

const helvetiker = require("three/examples/fonts/helvetiker_bold.typeface.json")

function TechcrunchText() {
  const textRef = useRef()
  useFrame(({ clock }) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.2
    }
  })

  return (
    <Text3D
      ref={textRef}
      font={helvetiker}
      size={0.6}
      height={0.15}
      bevelEnabled
      bevelSize={0.03}
      bevelThickness={0.04}
      position={[-2.9, -0.2, 0]}
    >
      TECHCRUNCH
      <meshStandardMaterial>
        <gradientTexture />
      </meshStandardMaterial>
    </Text3D>
  )
}

function gradientTexture() {
  const texture = useMemo(() => {
    const size = 512
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const context = canvas.getContext("2d")

    const gradient = context.createLinearGradient(0, 0, size, size)
    gradient.addColorStop(0, "#a020f0") // purple
    gradient.addColorStop(1, "#ff69b4") // pink

    context.fillStyle = gradient
    context.fillRect(0, 0, size, size)

    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [])

  return <meshStandardMaterial map={texture} />
}

function FloatingSquares({ count = 100 }) {
  const group = useRef()
  const squares = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 30
      ],
      scale: Math.random() * 0.2 + 0.05,
      color: new THREE.Color(
        `hsl(${Math.random() * 360}, 100%, 75%)`
      )
    }))
  }, [count])

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = clock.getElapsedTime() * 0.1
    }
  })

  return (
    <group ref={group}>
      {squares.map((sq, i) => (
        <mesh key={i} position={sq.position} scale={sq.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={sq.color}
            emissive={sq.color}
            emissiveIntensity={1.5}
            metalness={1}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

function Tesseract() {
  const group = useRef()
  const edgeColor = new THREE.Color("#a020f0")
  const tesseractLines = useMemo(() => {
    const vertices = [
      [-1, -1, -1],
      [-1, -1, 1],
      [-1, 1, -1],
      [-1, 1, 1],
      [1, -1, -1],
      [1, -1, 1],
      [1, 1, -1],
      [1, 1, 1]
    ]

    const edges = [
      [0, 1], [0, 2], [0, 4],
      [1, 3], [1, 5],
      [2, 3], [2, 6],
      [3, 7],
      [4, 5], [4, 6],
      [5, 7],
      [6, 7]
    ]

    return edges.map(([a, b]) => {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...vertices[a]),
        new THREE.Vector3(...vertices[b])
      ])
      return geometry
    })
  }, [])

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.x = clock.getElapsedTime() * 0.4
      group.current.rotation.y = clock.getElapsedTime() * 0.6
    }
  })

  return (
    <group ref={group} scale={3}>
      {tesseractLines.map((geom, i) => (
        <lineSegments key={i} geometry={geom}>
          <lineBasicMaterial color={edgeColor} linewidth={2} />
        </lineSegments>
      ))}
    </group>
  )
}

function CoreGlow() {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[0.5, 64, 64]} />
      <meshStandardMaterial
        emissive={"#ff00ff"}
        emissiveIntensity={4}
        transparent
        opacity={0.8}
        metalness={1}
        roughness={0.1}
        color="#ffffff"
      />
    </mesh>
  )
}

function SceneComposition() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ff00ff" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#00ffff" />
      <Stars radius={80} depth={50} count={2000} factor={4} fade speed={1} />
      <Tesseract />
      <CoreGlow />
      <TechcrunchText />
      <FloatingSquares />
      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={0.1} luminanceSmoothing={0.9} />
        <DepthOfField focusDistance={0.01} focalLength={0.02} bokehScale={5} />
      </EffectComposer>
    </>
  )
}

export default function PremiumTechcrunchTesseract() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} shadows>
        <color attach="background" args={["#000000"]} />
        <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={0.4} />
        <SceneComposition />
      </Canvas>
    </div>
  )
}
