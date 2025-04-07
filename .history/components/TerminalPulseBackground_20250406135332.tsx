"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect } from "react"

interface TwistedWireTerminalProps {
  intensity?: number
  speed?: number
  className?: string
}

export const TwistedWireTerminal = ({
  intensity = 0.6,
  speed = 2,
  className = ""
}: TwistedWireTerminalProps): JSX.Element => {
  const energyPulse = useMotionValue(0)
  const glowIntensity = useTransform(energyPulse, [0, 0.5, 1], [0.1, intensity, 0.1])
  const energyScale = useTransform(energyPulse, [0, 0.5, 1], [0.98, 1.02, 0.98])
  
  useEffect(() => {
    const controls = animate(energyPulse, [0, 1, 0], {
      duration: speed,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop"
    })
    
    return () => {
      controls.stop()
    }
  }, [energyPulse, speed])
  
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Glass background effect */}
      <div className="absolute inset-0 bg-black/5 backdrop-blur-sm rounded-xl border border-purple-500/20" />
      
      {/* Left wire */}
      <motion.div 
        className="absolute top-1/2 left-0 h-2 w-1/2 bg-gradient-to-r from-purple-800/80 via-purple-600/80 to-fuchsia-500/80 rounded-full"
        style={{
          filter: "drop-shadow(0 0 8px rgba(168, 85, 247, 0.4))",
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.1) 5px, rgba(255,255,255,0.1) 10px)"
        }}
      />
      
      {/* Right wire */}
      <motion.div 
        className="absolute top-1/2 right-0 h-2 w-1/2 bg-gradient-to-l from-purple-800/80 via-purple-600/80 to-fuchsia-500/80 rounded-full"
        style={{
          filter: "drop-shadow(0 0 8px rgba(168, 85, 247, 0.4))",
          backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(255,255,255,0.1) 5px, rgba(255,255,255,0.1) 10px)"
        }}
      />
      
      {/* Energy core at the center */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-500 via-purple-600 to-violet-800"
        style={{
          scale: energyScale,
          boxShadow: "0 0 20px rgba(168, 85, 247, 0.8)",
          opacity: glowIntensity
        }}
      />
      
      {/* Energy pulses emanating from center */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(168, 85, 247, 0) 70%)",
          scale: energyScale,
          opacity: glowIntensity
        }}
      />
      
      {/* Small energy particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-purple-400 rounded-full"
          style={{
            top: `${30 + Math.random() * 40}%`,
            left: `${40 + Math.random() * 20}%`,
            opacity: useTransform(energyPulse, [0, 0.5, 1], [0.1, 0.8, 0.1]),
            filter: "blur(1px)",
          }}
          animate={{
            x: [0, Math.random() * 20 - 10],
            y: [0, Math.random() * 20 - 10],
          }}
          transition={{
            duration: 2 + Math.random(),
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
      
      {/* Twisted wire details - decorative elements suggesting twists */}
      <motion.div 
        className="absolute top-1/2 left-1/4 h-4 w-4 rounded-full bg-purple-300/30"
        style={{ marginTop: -8 }}
      />
      <motion.div 
        className="absolute top-1/2 right-1/4 h-4 w-4 rounded-full bg-purple-300/30"
        style={{ marginTop: -8 }}
      />
    </div>
  )
}