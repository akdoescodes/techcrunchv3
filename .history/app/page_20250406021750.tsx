"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"

// ... (your other imports remain the same)

export default function Home() {
  // ... (your existing state and effects remain the same)

  const terminalRef = useRef<HTMLDivElement>(null)
  const edgeGlowWidth = useMotionValue(0)
  const edgeGlowOpacity = useTransform(edgeGlowWidth, [0, 20], [0, 0.3])

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        await animate(edgeGlowWidth, 20, {
          duration: 1.5,
          ease: "easeInOut"
        })
        await animate(edgeGlowWidth, 0, {
          duration: 1.5,
          ease: "easeInOut"
        })
      }
    }
    sequence()
  }, [edgeGlowWidth])

  return (
    <main className="relative min-h-screen text-black overflow-hidden">
      {/* ... (your existing background elements remain the same) */}
      
      <div className="relative z-20">
        <Navbar adminState={adminState} setAdminState={setAdminState} />

        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-20">
            {/* Terminal Container with animated edges */}
            <div 
              ref={terminalRef}
              className="relative mt-6 max-w-2xl mx-auto bg-[#ffffff] border border-purple-700 rounded-lg p-4 font-mono text-sm text-gray-200 text-left shadow-[0_0_20px_#a855f766] backdrop-blur-sm overflow-hidden"
            >
              {/* Left edge glow */}
              <motion.div
                style={{
                  width: edgeGlowWidth,
                  opacity: edgeGlowOpacity,
                  left: 0,
                }}
                className="absolute top-0 h-full bg-gradient-to-r from-purple-500 to-transparent"
              />
              
              {/* Right edge glow */}
              <motion.div
                style={{
                  width: edgeGlowWidth,
                  opacity: edgeGlowOpacity,
                  right: 0,
                }}
                className="absolute top-0 h-full bg-gradient-to-l from-purple-500 to-transparent"
              />
              
              {/* Top edge glow */}
              <motion.div
                style={{
                  height: edgeGlowWidth,
                  opacity: edgeGlowOpacity,
                  top: 0,
                }}
                className="absolute w-full bg-gradient-to-b from-purple-500 to-transparent"
              />
              
              {/* Bottom edge glow */}
              <motion.div
                style={{
                  height: edgeGlowWidth,
                  opacity: edgeGlowOpacity,
                  bottom: 0,
                }}
                className="absolute w-full bg-gradient-to-t from-purple-500 to-transparent"
              />

              {/* Terminal content (your existing terminal code) */}
              <div className="w-full h-1 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4" />
              <div className="absolute -top-12 -left-12 w-72 h-72 bg-purple-200 rounded-full opacity-30 blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-pink-200 rounded-full opacity-20 blur-2xl animate-spin-slow"></div>
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-md"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2 shadow-md"></div>
                <div className="w-3 h-3 rounded-full bg-green-400 mr-2 shadow-md"></div>
                <span className="text-xs text-purple-400 ml-2">terminal v.2025</span>
              </div>
              <Techcrunch3D />
              <p>
                <span className="text-green-600">user@techcrunch</span>:<span className="text-gray-800">
                  $ find events --category="tech" --sort="date"~
                </span>
              </p>
              <p className="text-pink-500 animate-pulse">Crunching data...</p>
              <p className="text-green-600 font-semibold">
                Found 6 mind-blowing tech events in your area!
              </p>
            </div>
          </div>
          
          {/* ... (rest of your code remains the same) */}
        </div>
      </div>
    </main>
  )
}