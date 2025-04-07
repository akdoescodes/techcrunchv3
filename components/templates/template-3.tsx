import type { EventInfo } from "@/utils/types"
import Link from "next/link"

interface Template3Props {
  event: EventInfo
}

export default function Template3({ event }: Template3Props) {
  return (
    <div className="bg-gradient-to-br from-purple-900 to-black text-white rounded-lg overflow-hidden shadow-lg transform transition-all hover:shadow-2xl">
      <div className="p-6">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="bg-white text-purple-900 rounded-full px-4 py-1 text-sm font-bold mb-3">{event.category}</div>
          <h3 className="text-2xl font-bold">{event.type}</h3>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-purple-800 bg-opacity-50 p-3 rounded-lg text-center">
            <p className="text-xs text-purple-300">📅 Date</p>
            <p className="font-semibold">{event.date}</p>
          </div>
          <div className="bg-purple-800 bg-opacity-50 p-3 rounded-lg text-center">
            <p className="text-xs text-purple-300">🕒 Time</p>
            <p className="font-semibold">{event.time}</p>
          </div>
          <div className="bg-purple-800 bg-opacity-50 p-3 rounded-lg text-center">
            <p className="text-xs text-purple-300">📍 Location</p>
            <p className="font-semibold">{event.location}</p>
          </div>
          <div className="bg-purple-800 bg-opacity-50 p-3 rounded-lg text-center">
            <p className="text-xs text-purple-300">💰 Entry Fee</p>
            <p className="font-semibold">{event.entryFee}</p>
          </div>
        </div>

        <div className="bg-purple-800 bg-opacity-30 p-4 rounded-lg mb-6">
          <p className="text-xs text-purple-300 mb-1">📝 Description:</p>
          <p>{event.description}</p>
        </div>

        <div className="bg-purple-800 bg-opacity-30 p-4 rounded-lg mb-6">
          <p className="text-xs text-purple-300 mb-1">📢 Contact Info:</p>
          <p>{event.contactInfo}</p>
        </div>

        <Link
          href={event.registrationLink}
          target="_blank"
          className="block w-full bg-white text-purple-900 text-center py-3 rounded-md font-bold hover:bg-purple-100 transition-colors"
        >
          Register Now
        </Link>
      </div>
    </div>
  )
}

