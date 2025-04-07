"use client"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text3D, useTexture } from "@react-three/drei"
import * as THREE from "three"
import { useRef, useMemo } from "react"

// Font import
const helvetiker = require("three/examples/fonts/helvetiker_bold.typeface.json")

function MetallicTechcrunch() {
  // Fallback texture URLs from Three.js examples
  const textures = useTexture({
    roughnessMap: '/textures/metal_roughness.jpg',
    normalMap: '/textures/metal_normal.jpg',
    metalnessMap: '/textures/metal_metalness.jpg'
  }, 
  // Fallback loader
  (loadedTextures) => {
    console.log('Textures loaded:', loadedTextures)
  },
  // Error callback
  (error) => {
    console.error('Texture loading error:', error)
    return {
      roughnessMap: new THREE.TextureLoader().load('https://threejs.org/examples/textures/terrain/roughnessmap.jpg'),
      normalMap: new THREE.TextureLoader().load('https://threejs.org/examples/textures/terrain/normalmap.jpg'),
      metalnessMap: new THREE.TextureLoader().load('https://threejs.org/examples/textures/terrain/specularmap.jpg')
    }
  })

  return (
    <group position={[0, 0, 0]}>
      <Text3D
        font={helvetiker}
        size={0.8}
        height={0.2}
        curveSegments={12}
        bevelEnabled
        bevelSize={0.02}
        bevelThickness={0.05}
        position={[-3, -0.25, 0]}
      >
        TECHCRUNCH
        <meshPhysicalMaterial
          {...textures}
          color="#9D50FF"
          emissive="#6A00FF"
          emissiveIntensity={0.5}
          metalness={0.95}
          roughness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1}
        />
      </Text3D>
    </group>
  )
}

// ... [rest of your component code remains the same]

export default function ProfessionalOrbitalSystem() {
  return (
    <div className="w-full h-screen bg-neutral-900">
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
        {/* ... [rest of your scene setup] */}
      </Canvas>
    </div>
  )
}