"use client"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Stars, Text3D, Center } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from "three"
import helvetiker from "three/examples/fonts/helvetiker_bold.typeface.json"

const CodingLanguageBalls = () => {
  const balls = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (balls.current) {
      const time = clock.getElapsedTime()
      balls.current.children.forEach((group, i) => {
        const angle = time * 0.5 + i
        const radius = 4 + (i % 2) * 1.5
        const tilt = (i % 2 === 0) ? 0 : Math.PI / 4

        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const y = Math.sin(angle) * radius * Math.sin(tilt)

        group.position.set(x, y, z)
        group.rotation.y = angle
      })
    }
  })

  const languages = [
    { short: "C++", color: "#004482" },
    { short: "Py", color: "#3572A5" },
    { short: "C#", color: "#178600" },
    { short: "Jv", color: "#B07219" },
    { short: "JS", color: "#F7DF1E" },
    { short: "Go", color: "#00ADD8" },
    { short: "Rs", color: "#DEA584" },
    { short: "Rb", color: "#CC342D" }
  ]

  return (
    <group ref={balls}>
      {languages.map((lang, i) => (
        <group key={lang.short}>
          <mesh>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial 
              color={lang.color}
              emissive={lang.color}
              emissiveIntensity={0.4}
              metalness={0.6}
              roughness={0.3}
            />
            <Center>
              <Text3D
                font={helvetiker}
                size={0.2}
                height={0.05}
                curveSegments={8}
                bevelEnabled
                bevelThickness={0.01}
                bevelSize={0.01}
                bevelSegments={2}
              >
                {lang.short}
                <meshStandardMaterial color="white" metalness={0.5} roughness={0.2} />
              </Text3D>
            </Center>
          </mesh>
        </group>
      ))}
    </group>
  )
}

const TechcrunchNucleus = () => {
  return (
    <group>
      <Center>
        <Text3D
          font={helvetiker}
          size={1.8}
          height={0.1}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.05}
          bevelSize={0.04}
          bevelSegments={4}
        >
          TECHCRUNCH
          <meshStandardMaterial 
            color="#FF4D4D"
            emissive="#FF4D4D"
            emissiveIntensity={1}
            metalness={0.8}
            roughness={0.1}
          />
        </Text3D>
      </Center>

      {/* Soft glowing sphere behind text */}
      <mesh>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshStandardMaterial
          color="#FF4D4D"
          transparent
          opacity={0.05}
          emissive="#FF4D4D"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  )
}

export default function TechScene() {
  return (
    <div className="w-full h-screen bg-white rounded-xl border border-gray-300">
      <Canvas shadows camera={{ position: [0, 0, 15], fov: 50 }}>
        {/* White background */}
        <color attach="background" args={["#ffffff"]} />

        {/* Lights for white background */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#FF4D4D" castShadow />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#4D79FF" />

        <OrbitControls
          enableZoom={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />

        <TechcrunchNucleus />
        <CodingLanguageBalls />
      </Canvas>
    </div>
  )
}
