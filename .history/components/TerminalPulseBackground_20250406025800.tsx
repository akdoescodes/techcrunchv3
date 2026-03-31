// components/animations/TerminalPulseBackground.tsx
"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect } from "react"

interface TerminalPulseBackgroundProps {
  intensity?: number
  speed?: number
  className?: string
}

export const TerminalPulseBackground = ({
  intensity = 0.2,
  speed = 3,
  className = ""
}: TerminalPulseBackgroundProps): JSX.Element => {
  const pulse = useMotionValue(0)
  const size = useTransform(pulse, [0, 1], ["90%", "95%"])
  const opacity = useTransform(pulse, [0, 1], [0.1, intensity])

  useEffect(() => {
    let isMounted = true
    const controls = animate(pulse, [0, 1, 0], {
      duration: speed,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop"
    })

    return () => {
      isMounted = false
      controls.stop()
    }
  }, [pulse, speed])

  return (
    <motion.div
      style={{ 
        width: size, 
        height: size, 
        opacity 
      }}
      className={`absolute inset-0 mx-auto my-auto bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-xl blur-lg ${className}`}
      aria-hidden="true"
    />
  )
}