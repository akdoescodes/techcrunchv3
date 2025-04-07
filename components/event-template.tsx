"use client"

import type { EventInfo } from "@/utils/types"
import Link from "next/link"
import { useState } from "react"

interface EventTemplateProps {
  event: EventInfo
  variant: number
  onEdit: (event: EventInfo) => void
}

export default function EventTemplate({ event, variant, onEdit }: EventTemplateProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Different color schemes based on variant
  const getColors = () => {
    const variants = [
      { bg: "from-purple-600 to-purple-800", accent: "purple-500" },
      { bg: "from-purple-700 to-purple-900", accent: "purple-400" },
      { bg: "from-purple-500 to-purple-700", accent: "purple-300" },
      { bg: "from-purple-800 to-purple-600", accent: "purple-500" },
      { bg: "from-purple-600 to-purple-400", accent: "purple-600" },
      { bg: "from-purple-500 to-purple-800", accent: "purple-400" },
    ]

    return variants[variant % variants.length]
  }

  const colors = getColors()

  return (
    <div
      className={`relative bg-gradient-to-tr ${colors.bg} text-white rounded-lg overflow-hidden shadow-lg transform transition-all duration-500 ease-in-out ${isHovered ? "scale-105 shadow-xl shadow-purple-300/30 rotate-1" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className={`inline-block px-3 py-1 bg-${colors.accent} rounded-full text-xs font-semibold mb-2`}>
              {event.category}
            </span>
            <h3 className="text-2xl font-bold">{event.type}</h3>
            {event.organizer && <p className="text-sm text-purple-200">Organized by: {event.organizer}</p>}
          </div>
          <div className="text-right">
            <p className="text-xs text-purple-300">Entry Fee</p>
            <p className="text-lg font-bold">{event.entryFee}</p>
            {event.capacity && <p className="text-xs text-purple-200">Capacity: {event.capacity}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-800 bg-opacity-50 rounded-full flex items-center justify-center mr-3">
                <span>📅</span>
              </div>
              <div>
                <p className="text-xs text-purple-300">Date</p>
                <p>{event.date}</p>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-800 bg-opacity-50 rounded-full flex items-center justify-center mr-3">
                <span>🕒</span>
              </div>
              <div>
                <p className="text-xs text-purple-300">Time</p>
                <p>{event.time}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-800 bg-opacity-50 rounded-full flex items-center justify-center mr-3">
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

        {event.additionalInfo && (
          <div className="p-3 bg-white/10 rounded-lg mb-6">
            <p className="text-xs text-purple-300 mb-1">ℹ️ Additional Information:</p>
            <p className="text-sm">{event.additionalInfo}</p>
          </div>
        )}

        <Link
          href={event.registrationLink}
          target="_blank"
          className="block w-full bg-purple-600 text-white text-center py-3 rounded-md font-bold hover:bg-purple-700 transition-colors"
        >
          Register Now
        </Link>
      </div>

      {isHovered && (
        <button
          onClick={() => onEdit(event)}
          className="absolute top-2 right-2 bg-white text-purple-700 p-2 rounded-full hover:bg-purple-100 transition-colors"
          aria-label="Edit event"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
      )}
    </div>
  )
}

