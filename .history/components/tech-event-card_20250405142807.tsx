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
  { primary: "from-[#FFD3A5] to-[#FD6585]", accent: "#FD6585", text: "text-[#FD6585]" },
  { primary: "from-[#C2FFD8] to-[#465EFB]", accent: "#465EFB", text: "text-[#465EFB]" },
  { primary: "from-[#F6D365] to-[#FDA085]", accent: "#FDA085", text: "text-[#FDA085]" },
  { primary: "from-[#A1C4FD] to-[#C2E9FB]", accent: "#A1C4FD", text: "text-[#3B82F6]" },
  { primary: "from-[#FBC2EB] to-[#A6C1EE]", accent: "#A6C1EE", text: "text-[#6B21A8]" },
  { primary: "from-[#FDEB71] to-[#F8D800]", accent: "#F8D800", text: "text-[#CA8A04]" },
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
      className={`relative overflow-hidden rounded-2xl transition-all duration-500 ease-in-out transform ${
        isHovered ? "scale-105 shadow-2xl" : "shadow-lg"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "rgba(255, 255, 255, 0.45)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(0,0,0,0.1)",
      }}
    >
      {/* Top Gradient Strip */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${colors.primary}`} />

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full bg-white bg-opacity-60 ${colors.text}`}>
              {event.category}
            </span>
            <h3 className="text-2xl font-bold text-gray-800 mt-2">{event.type}</h3>
            {event.organizer && (
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-medium text-gray-700">by</span> {event.organizer}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="px-3 py-1 bg-white bg-opacity-60 rounded-lg">
              <p className="text-xs text-gray-500">Entry Fee</p>
              <p className="text-lg font-bold" style={{ color: colors.accent }}>{event.entryFee}</p>
            </div>
            {event.capacity && <p className="text-xs text-gray-500 mt-1">Capacity: {event.capacity}</p>}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
          <div
            className={`h-full bg-gradient-to-r ${colors.primary} rounded-full transition-all duration-700`}
            style={{ width: progressWidth }}
          ></div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <InfoRow icon="📅" label="Date" value={event.date} />
          <InfoRow icon="🕒" label="Time" value={event.time} />
          <InfoRow icon="📍" label="Location" value={event.location} />
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div className="space-y-4">
            {event.description && <InfoBlock title="📝 Description" value={event.description} />}
            {event.contactInfo && <InfoBlock title="📢 Contact Info" value={event.contactInfo} />}
            {event.additionalInfo && <InfoBlock title="ℹ️ Additional Info" value={event.additionalInfo} />}
            {event.speakers?.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-1">👥 Speakers:</p>
                <div className="flex flex-wrap gap-2">
                  {event.speakers.map((speaker, i) => (
                    <span key={i} className="px-2 py-1 text-xs rounded bg-white bg-opacity-50 text-gray-700">
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
                className={`block w-full text-center py-3 rounded-md font-bold text-white transition-all bg-gradient-to-r ${colors.primary} hover:opacity-90`}
              >
                Register Now
              </Link>
            )}
          </div>
        )}

        {/* Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full text-sm text-gray-600 hover:text-gray-800 font-semibold transition-all"
        >
          {isExpanded ? "▲ View Less" : "▼ View More"}
        </button>
      </div>

      {/* Edit Button */}
      {isAdmin && isHovered && (
        <button
          onClick={() => onEdit(event)}
          className="absolute top-2 right-2 bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 shadow-sm transition"
        >
          ✏️
        </button>
      )}

      {/* Glow */}
      <div
        className={`absolute -bottom-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-r ${colors.primary} opacity-30 blur-2xl transition-all duration-700 ${
          isHovered ? "scale-150" : "scale-100"
        }`}
      />
    </div>
  )
}

function InfoRow({ icon, label, value }: any) {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-lg bg-white bg-opacity-60 flex items-center justify-center text-lg">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm text-gray-800 font-medium">{value}</p>
      </div>
    </div>
  )
}

function InfoBlock({ title, value }: any) {
  return (
    <div className="p-3 rounded-lg bg-white bg-opacity-60 border border-gray-200">
      <p className="text-xs text-gray-500 mb-1">{title}</p>
      <p className="text-sm text-gray-800">{value}</p>
    </div>
  )
}
