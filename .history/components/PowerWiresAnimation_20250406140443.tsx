// components/PowerWiresAnimation.tsx
"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect } from "react"

export const PowerWiresAnimation = () => {
  const energyFlow = useMotionValue(0)

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        await animate(energyFlow, 1, { duration: 2, ease: "linear" })
        await animate(energyFlow, 0, { duration: 0 }) // Instant reset
      }
    }
    sequence()
  }, [energyFlow])

  // Positions for 5 wires coming from different edges
  const wirePaths = [
    // Top-left to center
    { 
      path: "M-100,-100 L0,0",
      gradient: "from-purple-500 via-pink-500 to-purple-800",
      width: "w-1"
    },
    // Top-right to center
    { 
      path: "M100,-100 L0,0",
      gradient: "from-purple-600 via-pink-600 to-purple-900",
      width: "w-1.5"
    },
    // Bottom-left to center
    { 
      path: "M-100,100 L0,0",
      gradient: "from-purple-400 via-pink-400 to-purple-700",
      width: "w-1"
    },
    // Bottom-right to center
    { 
      path: "M100,100 L0,0",
      gradient: "from-purple-700 via-pink-700 to-purple-900",
      width: "w-1.5"
    },
    // Top-center to center
    { 
      path: "M0,-100 L0,0",
      gradient: "from-purple-300 via-pink-300 to-purple-600",
      width: "w-2"
    }
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {wirePaths.map((wire, index) => (
        <motion.svg
          key={index}
          className={`absolute ${wire.width} h-full`}
          viewBox="-100 -100 200 200"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <motion.path
            d={wire.path}
            stroke={`url(#gradient${index})`}
            strokeWidth="2"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={useTransform(energyFlow, [0, 1], [1, 0])}
          />
          <defs>
            <linearGradient id={`gradient${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#7E22CE" />
            </linearGradient>
          </defs>
        </motion.svg>
      ))}
      
      {/* Energy pulse at center */}
      <motion.div
        className="absolute left-1/2 top-1/2 w-4 h-4 bg-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.8, 1, 0.8],
          boxShadow: [
            "0 0 0 0 rgba(168, 85, 247, 0.4)",
            "0 0 0 10px rgba(168, 85, 247, 0)",
            "0 0 0 20px rgba(168, 85, 247, 0)"
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}