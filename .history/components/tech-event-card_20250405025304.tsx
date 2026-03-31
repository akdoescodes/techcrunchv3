"use client"

import type { EventInfo } from "@/utils/types"
import Link from "next/link"
import { useState } from "react"

interface TechEventCardProps {
  event: EventInfo
  variant: number
  onEdit: (event: EventInfo) => void
  isAdmin: boolean
}

export default function TechEventCard({ event, variant, onEdit, isAdmin }: TechEventCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Different color schemes based on variant
  const getColors = () => {
    const variants = [
      { primary: "from-purple-600 to-pink-500", secondary: "purple-500", accent: "pink-400" },
      { primary: "from-blue-600 to-indigo-600", secondary: "blue-500", accent: "indigo-400" },
      { primary: "from-indigo-600 to-purple-600", secondary: "indigo-500", accent: "purple-400" },
      { primary: "from-violet-600 to-purple-600", secondary: "violet-500", accent: "purple-400" },
      { primary: "from-fuchsia-600 to-pink-600", secondary: "fuchsia-500", accent: "pink-400" },
      { primary: "from-purple-600 to-indigo-600", secondary: "purple-500", accent: "indigo-400" },
    ]

    return variants[variant % variants.length]
  }

  const colors = getColors()

  return (
    <div
      className={`relative overflow-hidden rounded-xl shadow-xl transform transition-all duration-500 ease-in-out ${isHovered ? "scale-105 shadow-2xl shadow-purple-300/30 translate-y-[-10px]" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "rgba(15, 15, 35, 0.95)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(147, 51, 234, 0.2)",
      }}
    >
      {/* Top gradient bar */}
      <div className={`h-2 w-full bg-gradient-to-r ${colors.primary}`}></div>

      {/* Main content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center mb-2">
              <span
                className={`inline-block px-3 py-1 bg-${colors.secondary} bg-opacity-20 text-${colors.accent} rounded-full text-xs font-mono`}
              >
                {event.category}
              </span>
              {event.technologies && event.technologies.length > 0 && (
                <div className="ml-2 flex space-x-1">
                  {event.technologies.map((tech, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-gray-800 text-gray-300 rounded text-[10px] font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{event.type}</h3>
            {event.organizer && (
              <p className="text-sm text-gray-400">
                <span className="text-purple-400">by</span> {event.organizer}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className={`px-3 py-1 bg-${colors.secondary} bg-opacity-20 rounded-lg`}>
              <p className="text-xs text-gray-400">Entry Fee</p>
              <p className={`text-lg font-bold text-${colors.accent}`}>{event.entryFee}</p>
            </div>
            {event.capacity && <p className="text-xs text-gray-400 mt-1">Capacity: {event.capacity}</p>}
          </div>
        </div>

        {/* Data visualization style bar */}
        <div className="w-full h-2 bg-gray-800 rounded-full mb-6 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${colors.primary} rounded-full`}
            style={{ width: `${Math.random() * 30 + 70}%` }}
          ></div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-lg bg-${colors.secondary} bg-opacity-20 flex items-center justify-center text-${colors.accent}`}
              >
                <span>📅</span>
              </div>
              <div>
                <p className="text-xs text-gray-400">Date</p>
                <p className="text-white">{event.date}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-lg bg-${colors.secondary} bg-opacity-20 flex items-center justify-center text-${colors.accent}`}
              >
                <span>🕒</span>
              </div>
              <div>
                <p className="text-xs text-gray-400">Time</p>
                <p className="text-white">{event.time}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-lg bg-${colors.secondary} bg-opacity-20 flex items-center justify-center text-${colors.accent}`}
              >
                <span>📍</span>
              </div>
              <div>
                <p className="text-xs text-gray-400">Location</p>
                <p className="text-white">{event.location}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div
              className={`p-3 rounded-lg bg-${colors.secondary} bg-opacity-10 border border-${colors.secondary} border-opacity-20`}
            >
              <p className="text-xs text-gray-400 mb-1">📝 Description:</p>
              <p className="text-sm text-white">{event.description}</p>
            </div>

            <div
              className={`p-3 rounded-lg bg-${colors.secondary} bg-opacity-10 border border-${colors.secondary} border-opacity-20`}
            >
              <p className="text-xs text-gray-400 mb-1">📢 Contact:</p>
              <p className="text-sm text-white font-mono">{event.contactInfo}</p>
            </div>
          </div>
        </div>

        {/* Additional info */}
        {event.additionalInfo && (
          <div
            className={`p-3 rounded-lg bg-${colors.secondary} bg-opacity-10 border border-${colors.secondary} border-opacity-20 mb-6`}
          >
            <div className="flex items-center mb-1">
              <span className="text-xs text-gray-400">ℹ️ Additional Information:</span>
              <div className="ml-2 h-px flex-grow bg-gray-700"></div>
            </div>
            <p className="text-sm text-white">{event.additionalInfo}</p>
          </div>
        )}

        {/* Speakers */}
        {event.speakers && event.speakers.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <span className="text-xs text-gray-400">👥 Speakers:</span>
              <div className="ml-2 h-px flex-grow bg-gray-700"></div>
            </div>
            <div className="flex flex-wrap gap-2">
              {event.speakers.map((speaker, i) => (
                <span key={i} className={`px-2 py-1 bg-${colors.secondary} bg-opacity-20 text-white rounded text-xs`}>
                  {speaker}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Register button */}
        <Link
          href={event.registrationLink}
          target="_blank"
          className={`block w-full bg-gradient-to-r ${colors.primary} text-white text-center py-3 rounded-md font-bold hover:opacity-90 transition-all`}
        >
          Register Now
        </Link>

        {/* Terminal-like footer */}
        <div className="mt-4 font-mono text-xs text-gray-500 flex items-center">
          <span className="mr-2">$</span>
          <span className="typing-animation">
            register --event="{event.type}" --date="{event.date}"
          </span>
        </div>
      </div>

      {/* Admin edit button */}
      {isAdmin && isHovered && (
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

      {/* Animated corner accent */}
      <div
        className={`absolute -bottom-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-r ${colors.primary} opacity-30 blur-md transition-all duration-700 ease-in-out ${isHovered ? "scale-150" : "scale-100"}`}
      ></div>
    </div>
  )
}

