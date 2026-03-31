import type { EventInfo } from "@/utils/types"
import Link from "next/link"
import { useEffect, useRef } from "react"

export default function Template6({ event }: { event: EventInfo }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const particleCount = 25 // Increased particle count

    // Create energy particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.className = "absolute rounded-full pointer-events-none"
      
      // Random size between 3px and 8px
      const size = Math.random() * 5 + 3
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      
      // Random position around the card (some outside)
      const posX = Math.random() * 120 - 10
      const posY = Math.random() * 120 - 10
      particle.style.left = `${posX}%`
      particle.style.top = `${posY}%`
      
      // Energy particle gradient
      const hue = 270 + Math.random() * 40 - 20 // purple-ish range with more variation
      particle.style.background = `radial-gradient(circle at center, 
        hsla(${hue}, 100%, 70%, 1) 0%, 
        hsla(${hue}, 100%, 50%, 0.7) 70%, 
        transparent 100%)`
      
      // Random glow animation
      const duration = Math.random() * 3 + 2
      const delay = Math.random() * 5
      const intensity = Math.random() * 0.7 + 0.3
      
      particle.style.animation = `
        energy-pulse ${duration}s ease-in-out ${delay}s infinite,
        energy-float ${duration * 2}s ease-in-out ${delay}s infinite
      `
      
      particle.style.boxShadow = `0 0 ${intensity * 15}px ${intensity * 5}px hsla(${hue}, 100%, 60%, ${intensity})`
      
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
      {/* Energy particle styles */}
      <style jsx global>{`
        @keyframes energy-pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }
        
        @keyframes energy-float {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px);
          }
          50% {
            transform: translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px);
          }
          75% {
            transform: translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px);
          }
        }
      `}</style>
      
      <div className="p-6 relative z-10">
        {/* Rest of your card content remains the same */}
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