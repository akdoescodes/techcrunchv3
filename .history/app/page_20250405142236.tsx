"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import TechEventCard from "@/components/tech-event-card"
import TechEditForm from "@/components/tech-edit-form"
import type { EventInfo, AdminState } from "@/utils/types"
import "@/styles/animated-grid.css"

export default function Home() {
  const [events, setEvents] = useState<EventInfo[]>([
    // [Your 6 event objects unchanged...]
  ])

  const [editingEvent, setEditingEvent] = useState<EventInfo | null>(null)
  const [adminState, setAdminState] = useState<AdminState>({
    isAdmin: false,
    password: "ADMIN@123",
  })

  useEffect(() => {
    const savedEvents = localStorage.getItem("events")
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents))
    }
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
    <main className="relative min-h-screen text-gray-800 bg-white overflow-hidden">
      {/* Light background */}
      <div className="absolute inset-0 bg-white z-0" />

      {/* Dark grid background with more opacity */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        <div className="w-full h-full bg-animated-grid opacity-20" />
      </div>

      {/* Removed DataParticles */}

      <div className="relative z-20">
        <Navbar adminState={adminState} setAdminState={setAdminState} />

        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-gray-900">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                DataTech Events
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover cutting-edge data science and technology events.
              <span className="font-mono text-purple-500"> &lt;code/&gt;</span>
              <span className="font-mono text-pink-500"> &lt;data/&gt;</span>
              <span className="font-mono text-indigo-500"> &lt;innovation/&gt;</span>
            </p>

            <div className="mt-6 max-w-2xl mx-auto bg-gray-100 rounded-lg p-4 font-mono text-sm text-gray-700 text-left shadow">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                <span className="text-xs text-gray-400 ml-2">terminal</span>
              </div>
              <p>
                <span className="text-green-600">user@datatech</span>:<span className="text-blue-600">~</span>$ find
                events --category="data-science" --sort="date"
              </p>
              <p className="text-purple-600">Finding events...</p>
              <p className="text-green-600">Found 6 upcoming events in your area!</p>
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

        <footer className="bg-gray-100 border-t border-gray-300 py-8 mt-12 text-center">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                  DataTech
                </span>
                <span className="text-sm font-mono bg-purple-100 text-purple-700 px-2 py-1 rounded ml-2">Events</span>
              </div>
              <div className="text-gray-500 font-mono text-sm">
                &copy; {new Date().getFullYear()} DataTech Events |{" "}
                <span className="text-purple-600">v1.0.0</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
