"use client"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Text3D, useTexture } from "@react-three/drei"
import * as THREE from "three"
import { useRef, useMemo } from "react"

// Font import
const helvetiker = require("three/examples/fonts/helvetiker_bold.typeface.json")

function MetallicTechcrunch() {
  const texture = useTexture({
    roughnessMap: '/textures/metal_roughness.jpg',
    normalMap: '/textures/metal_normal.jpg',
    metalnessMap: '/textures/metal_metalness.jpg'
  })

  return (
    <group position={[0, 0, 0]}>
      <Text3D
        font={helvetiker}
        size={0.8} // Smaller size
        height={0.2}
        curveSegments={12}
        bevelEnabled
        bevelSize={0.02}
        bevelThickness={0.05}
        position={[-3, -0.25, 0]} // Adjusted position
      >
        TECHCRUNCH
        <meshPhysicalMaterial
          {...texture}
          color="#9D50FF" // Base purple
          emissive="#6A00FF" // Deeper purple emissive
          emissiveIntensity={0.5}
          metalness={0.95}
          roughness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1}
          // Gradient effect via vertex colors
          onBeforeCompile={(shader) => {
            shader.vertexShader = shader.vertexShader.replace(
              '#include <common>',
              `
              #include <common>
              varying vec3 vPosition;
              `
            )
            shader.vertexShader = shader.vertexShader.replace(
              '#include <begin_vertex>',
              `
              #include <begin_vertex>
              vPosition = position;
              `
            )
            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <emissivemap_fragment>',
              `
              vec3 gradient = mix(vec3(0.6, 0.0, 1.0), vec3(1.0, 0.0, 0.8), smoothstep(-0.5, 0.5, vPosition.y));
              emissiveColor *= gradient;
              #include <emissivemap_fragment>
              `
            )
          }}
        />
      </Text3D>
    </group>
  )
}

function MetallicOrbitingBall({ position, index, total }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const gradient = useMemo(() => {
    return new THREE.Color().lerpColors(
      new THREE.Color("#FFEE00"), // Vibrant yellow
      new THREE.Color("#00FF88"), // Electric green
      index / total
    )
  }, [index, total])

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.5
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3
    }
  })

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <sphereGeometry args={[0.18, 64, 64]} />
      <meshPhysicalMaterial
        color={gradient}
        metalness={0.95}
        roughness={0.15}
        clearcoat={1}
        clearcoatRoughness={0.05}
        emissive={gradient}
        emissiveIntensity={0.3}
        envMapIntensity={1.5}
      />
    </mesh>
  )
}

function ElectronOrbit({ radius = 3.5, tilt = 0, speed = 1, ballCount = 6 }) {
  const groupRef = useRef<THREE.Group>(null)
  const ballPositions = useMemo(() => {
    return Array.from({ length: ballCount }).map((_, i) => {
      const angle = (i / ballCount) * Math.PI * 2
      return new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      )
    })
  }, [ballCount, radius])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * speed
    }
  })

  return (
    <group ref={groupRef} rotation={[tilt, 0, 0]}>
      {ballPositions.map((pos, i) => (
        <MetallicOrbitingBall 
          key={i} 
          position={pos} 
          index={i} 
          total={ballCount} 
        />
      ))}
    </group>
  )
}

export default function ProfessionalOrbitalSystem() {
  const orbitConfigs = useMemo(() => [
    { radius: 3.0, tilt: 0, speed: 0.8 },
    { radius: 3.5, tilt: Math.PI/4, speed: 1.0 },
    { radius: 4.0, tilt: Math.PI/3, speed: 1.2 },
    { radius: 4.5, tilt: -Math.PI/4, speed: 0.9 },
    { radius: 5.0, tilt: Math.PI/6, speed: 1.1 },
    { radius: 5.5, tilt: -Math.PI/3, speed: 0.7 },
    { radius: 6.0, tilt: Math.PI/2, speed: 1.3 },
    { radius: 6.5, tilt: -Math.PI/6, speed: 0.85 }
  ], [])

  return (
    <div className="w-full h-screen bg-neutral-900">
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
        <color attach="background" args={["#111111"]} />
        
        {/* Professional lighting setup */}
        <ambientLight intensity={0.3} color="#4040FF" />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.5}
          color="#FF00FF"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#00FFFF" />
        
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.4}
          minDistance={5}
          maxDistance={15}
        />

        {/* Environment */}
        <fog attach="fog" args={["#111111", 5, 15]} />
        
        {/* Central element */}
        <MetallicTechcrunch />
        
        {/* 8 Orbital systems */}
        {orbitConfigs.map((config, i) => (
          <ElectronOrbit 
            key={i}
            radius={config.radius}
            tilt={config.tilt}
            speed={config.speed}
            ballCount={6}
          />
        ))}
      </Canvas>
    </div>
  )
}