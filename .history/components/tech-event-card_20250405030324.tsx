"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { EventInfo } from "@/utils/types"

interface TechEventCardProps {
  event: EventInfo
  variant: number
  onEdit: (event: EventInfo) => void
  isAdmin: boolean
}

const colorVariants = [
  { primary: "from-purple-600 to-pink-500", secondary: "purple-500", accent: "pink-400" },
  { primary: "from-blue-600 to-indigo-600", secondary: "blue-500", accent: "indigo-400" },
  { primary: "from-indigo-600 to-purple-600", secondary: "indigo-500", accent: "purple-400" },
  { primary: "from-violet-600 to-purple-600", secondary: "violet-500", accent: "purple-400" },
  { primary: "from-fuchsia-600 to-pink-600", secondary: "fuchsia-500", accent: "pink-400" },
  { primary: "from-purple-600 to-indigo-600", secondary: "purple-500", accent: "indigo-400" },
]

export default function TechEventCard({ event, variant, onEdit, isAdmin }: TechEventCardProps) {
  const colors = colorVariants[variant % colorVariants.length]
  const [isHovered, setIsHovered] = useState(false)
  const [progressWidth, setProgressWidth] = useState("100%")
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    if (variant !== 0) {
      const random = `${Math.floor(Math.random() * 30 + 70)}%`
      setProgressWidth(random)
    }
  }, [variant])

  return (
    <div
      className={`relative overflow-hidden rounded-xl transition-all duration-500 ease-in-out transform ${
        isHovered ? "scale-105 shadow-2xl translate-y-[-10px]" : "shadow-lg"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "rgba(15, 15, 35, 0.95)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(147, 51, 234, 0.2)",
      }}
    >
      {/* Top gradient border */}
      <div className={`h-2 w-full bg-gradient-to-r ${colors.primary}`} />

      <div className="p-6">
        {/* Header section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className={`inline-block px-3 py-1 text-xs font-mono rounded-full bg-${colors.secondary} bg-opacity-20 text-${colors.accent}`}>
              {event.category}
            </span>
            <h3 className="text-2xl font-bold text-white mt-2">{event.type}</h3>
            {event.organizer && (
              <p className="text-sm text-gray-400 mt-1">
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

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-800 rounded-full mb-6 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${colors.primary} rounded-full transition-all duration-700`}
            style={{ width: progressWidth }}
          ></div>
        </div>

        {/* Quick Info Rows */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <InfoRow icon="📅" label="Date" value={event.date} colors={colors} />
          <InfoRow icon="🕒" label="Time" value={event.time} colors={colors} />
          <InfoRow icon="📍" label="Location" value={event.location} colors={colors} />
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-4">
            {event.description && <InfoBlock title="📝 Description" value={event.description} colors={colors} />}
            {event.contactInfo && <InfoBlock title="📢 Contact Info" value={event.contactInfo} colors={colors} />}
            {event.additionalInfo && <InfoBlock title="ℹ️ Additional Info" value={event.additionalInfo} colors={colors} />}

            {event.speakers?.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-1">👥 Speakers:</p>
                <div className="flex flex-wrap gap-2">
                  {event.speakers.map((speaker, i) => (
                    <span
                      key={i}
                      className={`px-2 py-1 text-xs rounded bg-${colors.secondary} bg-opacity-20 text-white`}
                    >
                      {speaker}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {event.registrationLink && (
              <Link
                href={event.registrationLink}
                target="_blank"
                className={`block w-full bg-gradient-to-r ${colors.primary} text-white text-center py-3 rounded-md font-bold hover:opacity-90 transition-all`}
              >
                Register Now
              </Link>
            )}
          </div>
        )}

        {/* View More Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full text-sm text-purple-400 hover:text-purple-300 transition-all font-mono"
        >
          {isExpanded ? "▲ View Less" : "▼ View More"}
        </button>
      </div>

      {/* Admin Edit Button */}
      {isAdmin && isHovered && (
        <button
          onClick={() => onEdit(event)}
          className="absolute top-2 right-2 bg-white text-purple-700 p-2 rounded-full hover:bg-purple-100 transition-colors"
        >
          ✏️
        </button>
      )}

      {/* Animated Glow */}
      <div
        className={`absolute -bottom-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-r ${colors.primary} opacity-30 blur-md transition-all duration-700 ease-in-out ${
          isHovered ? "scale-150" : "scale-100"
        }`}
      />
    </div>
  )
}

// Small Info Row Component
function InfoRow({ icon, label, value, colors }: any) {
  return (
    <div className="flex items-center space-x-3">
      <div className={`w-10 h-10 rounded-lg bg-${colors.secondary} bg-opacity-20 flex items-center justify-center text-${colors.accent}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-white">{value}</p>
      </div>
    </div>
  )
}

// Block Display for Expanded Section
function InfoBlock({ title, value, colors }: any) {
  return (
    <div className={`p-3 rounded-lg bg-${colors.secondary} bg-opacity-10 border border-${colors.secondary} border-opacity-20`}>
      <p className="text-xs text-gray-400 mb-1">{title}</p>
      <p className="text-sm text-white">{value}</p>
    </div>
  )
}
s