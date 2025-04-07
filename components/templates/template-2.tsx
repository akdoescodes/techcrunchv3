import type { EventInfo } from "@/utils/types"
import Link from "next/link"

interface Template2Props {
  event: EventInfo
}

export default function Template2({ event }: Template2Props) {
  return (
    <div className="bg-black text-white rounded-lg overflow-hidden shadow-lg border border-purple-400 transform transition-all hover:-translate-y-2">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-purple-400">{event.type}</h3>
            <p className="text-purple-200">{event.category}</p>
          </div>
          <div className="bg-purple-600 text-white px-4 py-2 rounded-full">{event.entryFee}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="space-y-1">
            <p className="text-gray-400">📅 Date</p>
            <p className="text-white">{event.date}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-400">🕒 Time</p>
            <p className="text-white">{event.time}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-400">📍 Location</p>
            <p className="text-white">{event.location}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-400">👥 Type</p>
            <p className="text-white">{event.type}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-gray-400">📝 Description:</p>
          <p className="text-white">{event.description}</p>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-gray-400">📢 Contact Info:</p>
          <p className="text-white">{event.contactInfo}</p>
        </div>

        <Link
          href={event.registrationLink}
          target="_blank"
          className="mt-6 block w-full bg-purple-600 text-white text-center py-3 rounded-md hover:bg-purple-700 transition-colors"
        >
          Register Now
        </Link>
      </div>
    </div>
  )
}

