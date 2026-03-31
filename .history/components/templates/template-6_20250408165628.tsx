import type { EventInfo } from "@/utils/types"
import Link from "next/link"

interface Template6Props {
  event: EventInfo
}

export default function Template6({ event }: Template6Props) {
  return (
    <div className="bg-gradient-to-tr from-black via-gray-900 to-purple-900 text-white rounded-lg overflow-hidden shadow-lg transform transition-all hover:shadow-purple-300/20 hover:shadow-2xl">
      <div className="p-6">
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

