import { useState, useEffect, useRef } from "react"
import { Text3D } from "@react-three/drei"
import * as THREE from "three"

const fontUrl = "/fonts/helvetiker_bold.typeface.json"
const fullText = "TECHCRUNCH"

function TechcrunchText() {
  const textRef = useRef<THREE.Mesh>(null)
  const [text, setText] = useState("")

  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      setText(fullText.slice(0, currentIndex + 1))
      currentIndex++
      if (currentIndex === fullText.length) clearInterval(interval)
    }, 150) // Adjust speed here

    return () => clearInterval(interval)
  }, [])

  return (
    <Text3D
      ref={textRef}
      font={fontUrl}
      size={0.8}
      height={0.2}
      bevelEnabled
      bevelSize={0.03}
      bevelThickness={0.05}
      position={[-4, -0.4, 0]}
      letterSpacing={0.1}
    >
      {text}
      <meshStandardMaterial color={"#a855f7"} />
    </Text3D>
  )
}
