import type { EventInfo } from "@/utils/types"
import Link from "next/link"

interface Template4Props {
  event: EventInfo
}

export default function Template4({ event }: Template4Props) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg border-l-8 border-purple-600 flex flex-col transform transition-all hover:translate-x-2">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900">{event.type}</h3>
          <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
            {event.category}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
          <div>
            <p className="text-xs text-gray-500">📅 Date</p>
            <p className="text-sm font-medium">{event.date}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">🕒 Time</p>
            <p className="text-sm font-medium">{event.time}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">📍 Location</p>
            <p className="text-sm font-medium">{event.location}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">👥 Type</p>
            <p className="text-sm font-medium">{event.type}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1">📝 Description:</p>
          <p className="text-sm">{event.description}</p>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 mb-1">💰 Entry Fee:</p>
            <p className="text-sm font-bold text-purple-700">{event.entryFee}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">📢 Contact:</p>
            <p className="text-sm">{event.contactInfo}</p>
          </div>
        </div>
      </div>

      <Link
        href={event.registrationLink}
        target="_blank"
        className="bg-black text-white text-center py-3 hover:bg-purple-900 transition-colors"
      >
        Register Now
      </Link>
    </div>
  )
}

