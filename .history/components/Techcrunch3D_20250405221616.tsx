"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useRef, useMemo } from "react"

function AbstractFloatingCubes({ count = 80 }) {
  const group = useRef<THREE.Group>(null!)
  const cubes = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 40
      ],
      scale: Math.random() * 0.5 + 0.1,
      color: new THREE.Color(`hsl(${Math.random() * 360}, 100%, 70%)`)
    }))
  }, [count])

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.1
      group.current.rotation.y = clock.elapsedTime * 0.2
    }
  })

  return (
    <group ref={group}>
      {cubes.map((cube, i) => (
        <mesh key={i} position={cube.position} scale={cube.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={cube.color}
            emissive={cube.color}
            emissiveIntensity={1.5}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function AbstractAnimation() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 25], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <AbstractFloatingCubes />
      </Canvas>
    </div>
  )
}
