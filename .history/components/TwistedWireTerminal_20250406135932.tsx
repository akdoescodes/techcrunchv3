"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect, useState } from "react"

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
  // Always declare all hooks at the top level
  const [isMounted, setIsMounted] = useState(false)
  const energyPulse = useMotionValue(0)
  const glowIntensity = useTransform(energyPulse, [0, 0.5, 1], [0.1, intensity, 0.1])
  const energyScale = useTransform(energyPulse, [0, 0.5, 1], [0.98, 1.02, 0.98])
  
  // Create all transform hooks needed for particles
  const particleOpacity = useTransform(energyPulse, [0, 0.5, 1], [0.1, 0.8, 0.1])
  
  // Fixed particle positions to avoid hydration mismatch
  const particlePositions = [
    { top: "30%", left: "40%" },
    { top: "35%", left: "45%" },
    { top: "40%", left: "50%" },
    { top: "45%", left: "55%" },
    { top: "50%", left: "48%" },
    { top: "55%", left: "42%" }
  ]
  
  useEffect(() => {
    setIsMounted(true)
    
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
      
      {/* Left wire - using div instead of motion.div for reliability */}
      <div 
        className="absolute top-1/2 left-0 h-2 w-1/2 bg-gradient-to-r from-purple-800/80 via-purple-600/80 to-fuchsia-500/80 rounded-full shadow-lg"
        style={{
          transform: "translateY(-50%)",
          background: "linear-gradient(to right, rgba(107, 33, 168, 0.8), rgba(147, 51, 234, 0.8), rgba(232, 121, 249, 0.8))",
          boxShadow: "0 0 10px rgba(147, 51, 234, 0.5)"
        }}
      >
        {/* Wire texture overlay */}
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.2) 5px, rgba(255,255,255,0.2) 10px)"
        }}></div>
      </div>
      
      {/* Right wire - using div instead of motion.div for reliability */}
      <div 
        className="absolute top-1/2 right-0 h-2 w-1/2 bg-gradient-to-l from-purple-800/80 via-purple-600/80 to-fuchsia-500/80 rounded-full shadow-lg"
        style={{
          transform: "translateY(-50%)",
          background: "linear-gradient(to left, rgba(107, 33, 168, 0.8), rgba(147, 51, 234, 0.8), rgba(232, 121, 249, 0.8))",
          boxShadow: "0 0 10px rgba(147, 51, 234, 0.5)"
        }}
      >
        {/* Wire texture overlay */}
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(255,255,255,0.2) 5px, rgba(255,255,255,0.2) 10px)"
        }}></div>
      </div>
      
      {/* Energy core at the center */}
      <motion.div 
        className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-500 via-purple-600 to-violet-800"
        style={{
          transform: "translate(-50%, -50%)",
          scale: isMounted ? energyScale : 1,
          boxShadow: "0 0 20px rgba(168, 85, 247, 0.8)",
          opacity: isMounted ? glowIntensity : 0.4
        }}
      />
      
      {/* Energy pulses emanating from center */}
      <motion.div 
        className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full"
        style={{
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(168, 85, 247, 0) 70%)",
          scale: isMounted ? energyScale : 1,
          opacity: isMounted ? glowIntensity : 0.2
        }}
      />
      
      {/* Small energy particles with deterministic positions */}
      {particlePositions.map((position, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-purple-400 rounded-full"
          style={{
            top: position.top,
            left: position.left,
            opacity: isMounted ? particleOpacity : 0.2,
            filter: "blur(1px)",
          }}
          animate={isMounted ? {
            x: [0, (i % 2 === 0 ? 10 : -10)],
            y: [0, (i % 3 === 0 ? 10 : -10)],
          } : {}}
          transition={{
            duration: 2 + (i * 0.2),
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
      
      {/* Twisted wire details - decorative elements suggesting twists */}
      <div 
        className="absolute top-1/2 left-1/4 h-4 w-4 rounded-full bg-purple-300/30"
        style={{ marginTop: -8 }}
      />
      <div 
        className="absolute top-1/2 right-1/4 h-4 w-4 rounded-full bg-purple-300/30"
        style={{ marginTop: -8 }}
      />
    </div>
  )
}