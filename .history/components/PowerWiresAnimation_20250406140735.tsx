// components/PowerWiresAnimation.tsx
"use client"

import { motion, useMotionValue, animate } from "framer-motion"
import { useEffect } from "react"

interface WireConfig {
  path: string
  width: string
  colors: [string, string, string]
}

export const PowerWiresAnimation = () => {
  const energyFlow = useMotionValue(0)

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        await animate(energyFlow, 1, { duration: 2, ease: "linear" })
        energyFlow.set(0) // Instant reset
      }
    }
    sequence()
  }, [energyFlow])

  const wireConfigs: WireConfig[] = [
    { 
      path: "M-100,-100 L0,0",
      width: "w-1",
      colors: ["#8B5CF6", "#EC4899", "#7E22CE"]
    },
    { 
      path: "M100,-100 L0,0",
      width: "w-1.5",
      colors: ["#7C3AED", "#DB2777", "#6B21A8"]
    },
    { 
      path: "M-100,100 L0,0",
      width: "w-1",
      colors: ["#A78BFA", "#F472B6", "#9333EA"]
    },
    { 
      path: "M100,100 L0,0",
      width: "w-1.5",
      colors: ["#6D28D9", "#BE185D", "#86198F"]
    },
    { 
      path: "M0,-100 L0,0",
      width: "w-2",
      colors: ["#C4B5FD", "#F9A8D4", "#A855F7"]
    }
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {wireConfigs.map((wire, index) => (
        <motion.svg
          key={index}
          className={`absolute ${wire.width} h-full`}
          viewBox="-100 -100 200 200"
          style={{
            left: '50%',
            top: '50%',
            translateX: '-50%',
            translateY: '-50%'
          }}
        >
          <motion.path
            d={wire.path}
            stroke={`url(#gradient${index})`}
            strokeWidth="2"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset={energyFlow}
          />
          <defs>
            <linearGradient id={`gradient${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={wire.colors[0]} />
              <stop offset="50%" stopColor={wire.colors[1]} />
              <stop offset="100%" stopColor={wire.colors[2]} />
            </linearGradient>
          </defs>
        </motion.svg>
      ))}
      
      {/* Energy core */}
      <motion.div
        className="absolute left-1/2 top-1/2 w-4 h-4 bg-purple-500 rounded-full"
        style={{
          translateX: '-50%',
          translateY: '-50%'
        }}
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