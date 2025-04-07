// src/app/tech-scene/page.tsx
"use client"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text, Stars } from "@react-three/drei"

export default function TechScene() {
  return (
    <div style={{ 
      width: '100%', 
      height: '600px', 
      background: 'black',
      border: '2px solid red'  ← Debug border
    }}>
      <Canvas>
        {/* Debug axes helper */}
        <axesHelper args={[5]} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="white" />
        
        <Text
          position={[0, 0, 0]}
          fontSize={1.5}
          color="#FF0000"  ← Bright red for visibility
          font="/fonts/helvetiker_bold.typeface.json"
          anchorX="center"
          anchorY="middle"
        >
          TECHCRUNCH
        </Text>
        
        <OrbitControls />
      </Canvas>
    </div>
  )
}