"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import TechEventCard from "@/components/tech-event-card"
import TechEditForm from "@/components/tech-edit-form"
import type { EventInfo, AdminState } from "@/utils/types"
import "@/styles/animated-grid.css"
import "@/styles/home-enhanced.css" // Add this for the styles at the end

export default function Home() {
  const [events, setEvents] = useState<EventInfo[]>([ /* your events list remains unchanged */ ])
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

      {/* Z-0: Solid White Background */}
      <div className="absolute inset-0 bg-white z-0" />

      {/* Z-10: Animated Grid Overlay */}
      <div className="animated-grid z-10" />

      {/* Z-20: Main Content */}
      <div className="relative z-20">
        <Navbar adminState={adminState} setAdminState={setAdminState} />

        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                DataTech Events
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover cutting-edge data science and technology events.
              <span className="font-mono text-purple-500"> &lt;code/&gt;</span>
              <span className="font-mono text-pink-500"> &lt;data/&gt;</span>
              <span className="font-mono text-indigo-500"> &lt;innovation/&gt;</span>
            </p>

            {/* Terminal-Style Box */}
            <div className="mt-6 max-w-2xl mx-auto relative bg-white/10 border border-gray-300 backdrop-blur-md rounded-2xl p-6 font-mono text-sm text-gray-100 shadow-xl overflow-hidden">
              <div className="flex items-center mb-4 space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="ml-2 text-xs text-gray-300">terminal — datatech</span>
              </div>

              <div className="relative z-10 flex justify-center items-center h-[150px] bg-transparent mb-6">
                <h1 className="glass-tech-text relative text-5xl md:text-6xl font-extrabold tracking-tight text-white">
                  <span className="animated-gradient">DATATECH</span>
                  <span className="glow-underline"></span>
                </h1>
              </div>

              <p className="text-green-400">
                <span className="text-green-500">user@datatech</span>:<span className="text-blue-400">~</span>$ <span className="typing">find events --category="data-science" --sort="date"</span>
              </p>
              <p className="text-purple-400 mt-1 animate-pulse">Finding events...</p>
              <p className="text-green-300 mt-1">Found 6 upcoming events in your area!</p>
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

        {/* Footer */}
        <footer className="bg-white border-t border-gray-300 py-8 mt-12 relative z-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                  DataTech
                </span>
                <span className="text-sm font-mono bg-purple-200 text-purple-800 px-2 py-1 rounded ml-2">Events</span>
              </div>
              <div className="text-gray-500 font-mono text-sm">
                &copy; {new Date().getFullYear()} DataTech Events | <span className="text-purple-500">v1.0.0</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
