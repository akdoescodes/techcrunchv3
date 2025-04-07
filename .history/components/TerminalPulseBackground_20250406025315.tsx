// components/animations/TerminalPulseBackground.tsx
"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect } from "react"

export const TerminalPulseBackground = () => {
  const pulse = useMotionValue(0)
  const size = useTransform(pulse, [0, 1], ["90%", "95%"])
  const opacity = useTransform(pulse, [0, 1], [0.1, 0.2])

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        await animate(pulse, 1, { duration: 3, ease: "easeInOut" })
        await animate(pulse, 0, { duration: 3, ease: "easeInOut" })
      }
    }
    sequence()
  }, [pulse])

  return (
    <motion.div
      style={{ width: size, height: size, opacity }}
      className="absolute inset-0 mx-auto my-auto bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-xl blur-lg"
    />
  )
}