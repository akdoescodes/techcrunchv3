// components/animations/TerminalEdgeGlow.tsx
"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect } from "react"

interface TerminalEdgeGlowProps {
  intensity?: number
  speed?: number
  color?: string
}

export const TerminalEdgeGlow = ({
  intensity = 0.15,
  speed = 2,
  color = "purple-500"
}: TerminalEdgeGlowProps): JSX.Element => {
  const glowWidth = useMotionValue(0)
  const glowOpacity = useTransform(glowWidth, [0, 20], [0, intensity])

  useEffect(() => {
    const controls = animate(glowWidth, [0, 20, 0], {
      duration: speed,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop"
    })

    return () => controls.stop()
  }, [glowWidth, speed])

  return (
    <>
      <motion.div 
        style={{ 
          width: glowWidth, 
          opacity: glowOpacity 
        }}
        className={`absolute left-0 top-0 h-full bg-gradient-to-r from-${color} to-transparent`}
        aria-hidden="true"
      />
      <motion.div 
        style={{ 
          width: glowWidth, 
          opacity: glowOpacity 
        }}
        className={`absolute right-0 top-0 h-full bg-gradient-to-l from-${color} to-transparent`}
        aria-hidden="true"
      />
    </>
  )
}