import type { EventInfo } from "@/utils/types"
import Link from "next/link"
import { useEffect, useRef } from "react"

interface Template6Props {
  event: EventInfo
}

export default function Template6({ event }: Template6Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const particleCount = 20

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.className = "absolute rounded-full bg-purple-500 opacity-70"
      
      // Random size between 2px and 6px
      const size = Math.random() * 4 + 2
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      
      // Random position around the card
      particle.style.left = `${Math.random() * 100}%`
      particle.style.top = `${Math.random() * 100}%`
      
      // Add animation
      particle.style.animation = `glow ${Math.random() * 3 + 2}s infinite alternate`
      particle.style.animationDelay = `${Math.random() * 2}s`
      
      container.appendChild(particle)
    }

    return () => {
      // Clean up particles when component unmounts
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="relative bg-gradient-to-tr from-black via-gray-900 to-purple-900 text-white rounded-lg overflow-hidden shadow-lg transform transition-all hover:shadow-purple-300/20 hover:shadow-2xl"
    >
      {/* Particles will be inserted here by the useEffect hook */}
      <style jsx>{`
        @keyframes glow {
          0% {
            opacity: 0.3;
            transform: scale(1);
            box-shadow: 0 0 5px 1px rgba(192, 132, 252, 0.5);
          }
          100% {
            opacity: 0.9;
            transform: scale(1.2);
            box-shadow: 0 0 15px 3px rgba(192, 132, 252, 0.8);
          }
        }
      `}</style>
      
      <div className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="inline-block px-3 py-1 bg-purple-600 rounded-full text-xs font-semibold mb-2">
              {event.category}
            </span>
            <h3 className="text-2xl font-bold">{event.type}</h3>
          </div>
          <div className="text-right">
            <p className="text-xs text-purple-300">Entry Fee</p>
            <p className="text-lg font-bold">{event.entryFee}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-800 rounded-full flex items-center justify-center mr-3">
                <span>📅</span>
              </div>
              <div>
                <p className="text-xs text-purple-300">Date</p>
                <p>{event.date}</p>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-800 rounded-full flex items-center justify-center mr-3">
                <span>🕒</span>
              </div>
              <div>
                <p className="text-xs text-purple-300">Time</p>
                <p>{event.time}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-800 rounded-full flex items-center justify-center mr-3">
                <span>📍</span>
              </div>
              <div>
                <p className="text-xs text-purple-300">Location</p>
                <p>{event.location}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-3 bg-white/10 rounded-lg">
              <p className="text-xs text-purple-300 mb-1">📝 Description:</p>
              <p className="text-sm">{event.description}</p>
            </div>
            <div className="p-3 bg-white/10 rounded-lg">
              <p className="text-xs text-purple-300 mb-1">📢 Contact:</p>
              <p className="text-sm">{event.contactInfo}</p>
            </div>
          </div>
        </div>

        <Link
          href={event.registrationLink}
          target="_blank"
          className="block w-full bg-purple-600 text-white text-center py-3 rounded-md font-bold hover:bg-purple-700 transition-colors"
        >
          Register Now
        </Link>
      </div>
    </div>
  )
}