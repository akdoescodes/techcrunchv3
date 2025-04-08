import type { EventInfo } from "@/utils/types"
import Link from "next/link"

interface Template6Props {
  event: EventInfo
}

export default function Template6({ event }: Template6Props) {
  return (
    <div className="bg-gradient-to-br from-cyan-900 via-purple-800 to-indigo-900 text-white rounded-2xl overflow-hidden shadow-xl backdrop-blur-md transition-all hover:shadow-cyan-400/30 hover:shadow-2xl border border-white/10">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="inline-block px-3 py-1 bg-cyan-500/80 text-black rounded-full text-xs font-semibold mb-2 shadow-md">
              {event.category}
            </span>
            <h3 className="text-2xl font-bold text-white drop-shadow-md">{event.type}</h3>
          </div>
          <div className="text-right">
            <p className="text-xs text-cyan-200">Entry Fee</p>
            <p className="text-lg font-bold text-pink-400">{event.entryFee}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-cyan-600/30 border border-cyan-400/40 backdrop-blur-sm rounded-full flex items-center justify-center mr-3">
                <span>📅</span>
              </div>
              <div>
                <p className="text-xs text-cyan-300">Date</p>
                <p className="text-white">{event.date}</p>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-cyan-600/30 border border-cyan-400/40 backdrop-blur-sm rounded-full flex items-center justify-center mr-3">
                <span>🕒</span>
              </div>
              <div>
                <p className="text-xs text-cyan-300">Time</p>
                <p className="text-white">{event.time}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-cyan-600/30 border border-cyan-400/40 backdrop-blur-sm rounded-full flex items-center justify-center mr-3">
                <span>📍</span>
              </div>
              <div>
                <p className="text-xs text-cyan-300">Location</p>
                <p className="text-white">{event.location}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-3 bg-white/10 border border-white/10 rounded-lg">
              <p className="text-xs text-pink-300 mb-1">📝 Description:</p>
              <p className="text-sm text-white">{event.description}</p>
            </div>
            <div className="p-3 bg-white/10 border border-white/10 rounded-lg">
              <p className="text-xs text-pink-300 mb-1">📢 Contact:</p>
              <p className="text-sm text-white">{event.contactInfo}</p>
            </div>
          </div>
        </div>

        <Link
          href={event.registrationLink}
          target="_blank"
          className="block w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white text-center py-3 rounded-md font-bold hover:brightness-110 transition-all shadow-lg"
        >
          🚀 Register Now
        </Link>
      </div>
    </div>
  )
}
