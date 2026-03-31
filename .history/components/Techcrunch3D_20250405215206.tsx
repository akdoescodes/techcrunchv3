"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text3D, Stars } from "@react-three/drei"
import * as THREE from "three"
import { useRef, useMemo } from "react"
import { EffectComposer, Bloom, DepthOfField, ChromaticAberration, Vignette } from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"

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
      <meshStandardMaterial
        color={"#ffffff"}
        emissive={"#ff00ff"}
        metalness={0.9}
        roughness={0.2}
      />
    </Text3D>
  )
}

function FloatingSquares({ count = 100 }) {
  const group = useRef()
  const squares = useMemo(() => {
    return Array.from({ length: count }, () => ({
      angleOffset: Math.random() * Math.PI * 2,
      radius: 4 + Math.random() * 4,
      heightOffset: Math.random() * 2,
      scale: Math.random() * 0.2 + 0.05,
      color: new THREE.Color(`hsl(${Math.random() * 360}, 100%, 75%)`)
    }))
  }, [count])

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    if (group.current) {
      group.current.children.forEach((child, i) => {
        const sq = squares[i]
        const angle = time * 0.2 + sq.angleOffset
        child.position.x = Math.cos(angle) * sq.radius
        child.position.z = Math.sin(angle) * sq.radius
        child.position.y = Math.sin(time * 0.3 + i) * 2
      })
    }
  })

  return (
    <group ref={group}>
      {squares.map((sq, i) => (
        <mesh key={i} scale={sq.scale}>
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
      [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1],
      [1, -1, -1], [1, -1, 1], [1, 1, -1], [1, 1, 1]
    ]
    const edges = [
      [0, 1], [0, 2], [0, 4], [1, 3], [1, 5],
      [2, 3], [2, 6], [3, 7], [4, 5], [4, 6], [5, 7], [6, 7]
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
    const t = clock.getElapsedTime()
    if (group.current) {
      const scale = 3 + Math.sin(t * 2) * 0.05
      group.current.scale.set(scale, scale, scale)
      group.current.rotation.x = t * 0.4
      group.current.rotation.y = t * 0.6
    }
  })

  return (
    <group ref={group}>
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
      <meshPhysicalMaterial
        transmission={1}
        thickness={1}
        roughness={0}
        metalness={0.5}
        clearcoat={1}
        clearcoatRoughness={0.1}
        color="#ff00ff"
        emissive="#ff00ff"
        emissiveIntensity={5}
        reflectivity={1}
      />
    </mesh>
  )
}

function OrbitingText({ text = "AI", radius = 3, speed = 0.6, angleOffset = 0 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    const angle = clock.getElapsedTime() * speed + angleOffset
    ref.current.position.x = Math.cos(angle) * radius
    ref.current.position.z = Math.sin(angle) * radius
    ref.current.rotation.y = -angle
  })

  return (
    <Text3D
      ref={ref}
      font={helvetiker}
      size={0.2}
      height={0.05}
      bevelEnabled
      bevelSize={0.01}
      bevelThickness={0.01}
    >
      {text}
      <meshStandardMaterial
        color={"#00ffff"}
        emissive={"#00ffff"}
        metalness={0.9}
        roughness={0.1}
      />
    </Text3D>
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
      <OrbitingText text="AI" radius={4} angleOffset={0} />
      <OrbitingText text="JS" radius={4} angleOffset={1} />
      <OrbitingText text="3D" radius={4} angleOffset={2} />
      <EffectComposer>
        <Bloom intensity={1.5} luminanceThreshold={0.1} luminanceSmoothing={0.8} />
        <DepthOfField focusDistance={0.01} focalLength={0.015} bokehScale={6} />
        <ChromaticAberration offset={[0.002, 0.002]} blendFunction={BlendFunction.NORMAL} />
        <Vignette eskil={false} offset={0.1} darkness={0.8} />
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
