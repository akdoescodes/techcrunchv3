// components/animations/TerminalPulseBackground.tsx
"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect } from "react"

interface TerminalPulseBackgroundProps {
  intensity?: number
  speed?: number
}

export const TerminalPulseBackground = ({
  intensity = 0.2,
  speed = 3
}: TerminalPulseBackgroundProps): JSX.Element => {
  const pulse = useMotionValue(0)
  const size = useTransform(pulse, [0, 1], ["90%", "95%"])
  const opacity = useTransform(pulse, [0, 1], [0.1, intensity])

  useEffect(() => {
    let isMounted = true
    let animation: Promise<void> | null = null

    const animatePulse = async () => {
      while (isMounted) {
        await animate(pulse, 1, { duration: speed, ease: "easeInOut" })
        if (!isMounted) break
        await animate(pulse, 0, { duration: speed, ease: "easeInOut" })
      }
    }

    animation = animatePulse()

    return () => {
      isMounted = false
      if (animation) {
        // Cancel any pending animations
        pulse.stop()
      }
    }
  }, [pulse, speed])

  return (
    <motion.div
      style={{ 
        width: size, 
        height: size, 
        opacity 
      }}
      className="absolute inset-0 mx-auto my-auto bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-xl blur-lg"
      aria-hidden="true"
    />
  )
} le