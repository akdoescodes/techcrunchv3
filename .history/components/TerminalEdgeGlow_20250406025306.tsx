// components/animations/TerminalEdgeGlow.tsx
"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect } from "react"

export const TerminalEdgeGlow = () => {
  const glowWidth = useMotionValue(0)
  const glowOpacity = useTransform(glowWidth, [0, 20], [0, 0.15])

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        await animate(glowWidth, 20, { duration: 2, ease: "easeInOut" })
        await animate(glowWidth, 0, { duration: 2, ease: "easeInOut" })
      }
    }
    sequence()
  }, [glowWidth])

  return (
    <>
      <motion.div 
        style={{ width: glowWidth, opacity: glowOpacity }}
        className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-transparent"
      />
      <motion.div 
        style={{ width: glowWidth, opacity: glowOpacity }}
        className="absolute right-0 top-0 h-full bg-gradient-to-l from-purple-500 to-transparent"
      />
    </>
  )
}