import type { EventInfo } from "@/utils/types"
import { Calendar, Clock, MapPin, Users, Target, FileText, DollarSign, Phone } from "lucide-react"
import Link from "next/link"

interface Template1Props {
  event: EventInfo
}

export default function Template1({ event }: Template1Props) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg border-2 border-purple-500 transform transition-all hover:scale-105">
      <div className="bg-purple-600 p-4 text-white">
        <h3 className="text-xl font-bold">{event.type}</h3>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="text-purple-600" size={20} />
            <span className="text-gray-800">📅 {event.date}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="text-purple-600" size={20} />
            <span className="text-gray-800">🕒 {event.time}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="text-purple-600" size={20} />
            <span className="text-gray-800">📍 {event.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="text-purple-600" size={20} />
            <span className="text-gray-800">👥 {event.type}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="text-purple-600" size={20} />
            <span className="text-gray-800">🎯 {event.category}</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="text-purple-600" size={20} />
            <span className="text-gray-800">💰 {event.entryFee}</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-start space-x-2">
            <FileText className="text-purple-600 mt-1" size={20} />
            <div>
              <span className="text-gray-800 font-semibold">📝 Description:</span>
              <p className="text-gray-700">{event.description}</p>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Phone className="text-purple-600 mt-1" size={20} />
          <div>
            <span className="text-gray-800 font-semibold">📢 Contact Info:</span>
            <p className="text-gray-700">{event.contactInfo}</p>
          </div>
        </div>

        <Link
          href={event.registrationLink}
          target="_blank"
          className="mt-4 block w-full bg-purple-600 text-white text-center py-3 rounded-md hover:bg-purple-700 transition-colors"
        >
          Register Now
        </Link>
      </div>
    </div>
  )
}

