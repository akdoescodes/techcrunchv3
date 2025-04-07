import type { EventInfo } from "@/utils/types"
import Link from "next/link"

interface Template5Props {
  event: EventInfo
}

export default function Template5({ event }: Template5Props) {
  return (
    <div className="relative bg-white rounded-lg overflow-hidden shadow-xl transform transition-all hover:rotate-1">
      <div className="absolute top-0 right-0 bg-purple-600 text-white px-4 py-1 rounded-bl-lg">{event.entryFee}</div>

      <div className="pt-12 pb-6 px-6">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-purple-600 text-2xl">🎯</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{event.type}</h3>
          <p className="text-purple-600">{event.category}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-2 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-500">📅 Date</p>
            <p className="font-medium">{event.date}</p>
          </div>
          <div className="text-center p-2 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-500">🕒 Time</p>
            <p className="font-medium">{event.time}</p>
          </div>
          <div className="text-center p-2 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-500">📍 Location</p>
            <p className="font-medium">{event.location}</p>
          </div>
          <div className="text-center p-2 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-500">👥 Type</p>
            <p className="font-medium">{event.type}</p>
          </div>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">📝 Description:</p>
          <p className="text-sm">{event.description}</p>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg mb-6">
          <p className="text-xs text-gray-500 mb-1">📢 Contact Info:</p>
          <p className="text-sm">{event.contactInfo}</p>
        </div>
      </div>

      <Link
        href={event.registrationLink}
        target="_blank"
        className="block w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white text-center py-3 font-medium hover:from-purple-700 hover:to-purple-900 transition-colors"
      >
        Register Now
      </Link>
    </div>
  )
}

