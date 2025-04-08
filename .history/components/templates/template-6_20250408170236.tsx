import type { EventInfo } from "@/utils/types"
import Link from "next/link"
import { useEffect, useRef } from "react"

export default function Template6({ event }: { event: EventInfo }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const particleCount = 15

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.className = "absolute rounded-full backdrop-blur-sm"
      
      // Random size between 4px and 10px
      const size = Math.random() * 6 + 4
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      
      // Random position around the card (some outside)
      const posX = Math.random() * 120 - 10
      const posY = Math.random() * 120 - 10
      particle.style.left = `${posX}%`
      particle.style.top = `${posY}%`
      
      // Glassy color with gradient
      const hue = 270 + Math.random() * 30 - 15 // purple-ish range
      particle.style.background = `radial-gradient(circle at center, 
        hsla(${hue}, 80%, 70%, 0.8) 0%, 
        hsla(${hue}, 100%, 60%, 0.4) 70%, 
        transparent 100%)`
      
      // Add animation
      const duration = Math.random() * 4 + 3
      particle.style.animation = `glassy-glow ${duration}s ease-in-out infinite alternate`
      particle.style.animationDelay = `${Math.random() * 5}s`
      
      container.appendChild(particle)
    }

    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="relative bg-gradient-to-tr from-black via-gray-900 to-purple-900 text-white rounded-lg overflow-hidden shadow-lg transform transition-all hover:shadow-purple-300/20 hover:shadow-2xl border border-white/10"
    >
      {/* Glassy glow styles */}
      <style jsx global>{`
        @keyframes glassy-glow {
          0% {
            opacity: 0.4;
            transform: scale(0.8) translateY(0);
            filter: blur(0.5px);
          }
          50% {
            opacity: 0.9;
            filter: blur(1px);
          }
          100% {
            opacity: 0.6;
            transform: scale(1.2) translateY(-5px);
            filter: blur(0.8px);
          }
        }
      `}</style>
      
      <div className="p-6 relative z-10 backdrop-blur-[1px]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="inline-block px-3 py-1 bg-purple-600/80 backdrop-blur-sm rounded-full text-xs font-semibold mb-2 border border-white/20">
              {event.category}
            </span>
            <h3 className="text-2xl font-bold text-white/90">{event.type}</h3>
          </div>
          <div className="text-right">
            <p className="text-xs text-purple-300/80">Entry Fee</p>
            <p className="text-lg font-bold text-white/90">{event.entryFee}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-800/50 backdrop-blur-sm rounded-full flex items-center justify-center mr-3 border border-white/10">
                <span>📅</span>
              </div>
              <div>
                <p className="text-xs text-purple-300/80">Date</p>
                <p className="text-white/90">{event.date}</p>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-800/50 backdrop-blur-sm rounded-full flex items-center justify-center mr-3 border border-white/10">
                <span>🕒</span>
              </div>
              <div>
                <p className="text-xs text-purple-300/80">Time</p>
                <p className="text-white/90">{event.time}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-800/50 backdrop-blur-sm rounded-full flex items-center justify-center mr-3 border border-white/10">
                <span>📍</span>
              </div>
              <div>
                <p className="text-xs text-purple-300/80">Location</p>
                <p className="text-white/90">{event.location}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <p className="text-xs text-purple-300/80 mb-1">📝 Description:</p>
              <p className="text-sm text-white/90">{event.description}</p>
            </div>
            <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <p className="text-xs text-purple-300/80 mb-1">📢 Contact:</p>
              <p className="text-sm text-white/90">{event.contactInfo}</p>
            </div>
          </div>
        </div>

        <Link
          href={event.registrationLink}
          target="_blank"
          className="block w-full bg-purple-600/80 hover:bg-purple-700/90 text-white/90 text-center py-3 rounded-md font-bold transition-all backdrop-blur-sm border border-white/20 hover:border-white/30 hover:scale-[1.01]"
        >
          Register Now
        </Link>
      </div>
    </div>
  )
}