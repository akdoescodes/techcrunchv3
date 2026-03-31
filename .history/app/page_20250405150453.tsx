"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import TechEventCard from "@/components/tech-event-card"
import TechEditForm from "@/components/tech-edit-form"
import type { EventInfo, AdminState } from "@/utils/types"
import "@/styles/animated-grid.css"

export default function Home() {
  const [events, setEvents] = useState<EventInfo[]>([
    // ... your events array stays exactly the same ...
  ])

  const [editingEvent, setEditingEvent] = useState<EventInfo | null>(null)
  const [adminState, setAdminState] = useState<AdminState>({
    isAdmin: false,
    password: "ADMIN@123",
  })

  useEffect(() => {
    const savedEvents = localStorage.getItem("events")
    if (savedEvents) setEvents(JSON.parse(savedEvents))
  }, [])

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events))
  }, [events])

  const handleEdit = (event: EventInfo) => {
    if (!adminState.isAdmin) return
    setEditingEvent(event)
  }

  const handleSave = (updatedEvent: EventInfo) => {
    setEvents((prev) => prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
    setEditingEvent(null)
  }

  const handleCancel = () => {
    setEditingEvent(null)
  }

  return (
    <main className="relative min-h-screen text-black overflow-hidden">

      {/* Z-0: White Background */}
      <div className="absolute inset-0 bg-white z-0" />

      {/* Z-10: Animated Grid Overlay */}
      <div className="absolute inset-0 z-10 bg-animated-grid pointer-events-none" />

      {/* Z-20: Main Content */}
      <div className="relative z-20">
        <Navbar adminState={adminState} setAdminState={setAdminState} />

        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                DataTech Events
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover cutting-edge data science and technology events.
              <span className="font-mono text-purple-400"> &lt;code/&gt;</span>
              <span className="font-mono text-pink-400"> &lt;data/&gt;</span>
              <span className="font-mono text-indigo-400"> &lt;innovation/&gt;</span>
            </p>

            <div className="mt-6 max-w-2xl mx-auto bg-gray-800 rounded-lg p-4 font-mono text-sm text-gray-300 text-left">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs text-gray-500">terminal</span>
              </div>
              <p>
                <span className="text-green-400">user@datatech</span>:<span className="text-blue-400">~</span>$ find
                events --category="data-science" --sort="date"
              </p>
              <p className="text-purple-400">Finding events...</p>
              <p className="text-green-400">Found 6 upcoming events in your area!</p>
            </div>
          </div>

          {editingEvent ? (
            <TechEditForm event={editingEvent} onSave={handleSave} onCancel={handleCancel} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <TechEventCard
                  key={event.id}
                  event={event}
                  variant={index}
                  onEdit={handleEdit}
                  isAdmin={adminState.isAdmin}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Z-30: Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8 mt-12 relative z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                DataTech
              </span>
              <span className="text-sm font-mono bg-purple-700 px-2 py-1 rounded ml-2">Events</span>
            </div>
            <div className="text-gray-400 font-mono text-sm">
              &copy; {new Date().getFullYear()} DataTech Events |{" "}
              <span className="text-purple-400">v1.0.0</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
