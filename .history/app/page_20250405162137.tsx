"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import TechEventCard from "@/components/tech-event-card"
import TechEditForm from "@/components/tech-edit-form"
import type { EventInfo, AdminState } from "@/utils/types"
import "@/styles/animated-grid.css"
import Techcrunch3D from "@/components/Techcrunch3D"

export default function Home() {
  const [events, setEvents] = useState<EventInfo[]>([])
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
    <main className="relative min-h-screen text-black overflow-hidden bg-gradient-to-br from-purple-100 via-white to-pink-100 font-sans">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-purple-100 to-white" />

      {/* Animated grid */}
      <div className="animated-grid z-10" />

      {/* Main content */}
      <div className="relative z-20">
        <Navbar adminState={adminState} setAdminState={setAdminState} />

        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 font-tech text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-fuchsia-500">
              Tech Event Universe
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              <span className="font-mono text-purple-400">&lt;explore/&gt;</span>{" "}
              <span className="font-mono text-pink-400">&lt;build/&gt;</span>{" "}
              <span className="font-mono text-indigo-500">&lt;glow up/&gt;</span>
            </p>

            {/* Terminal box with 3D title */}
            <div className="mt-10 max-w-2xl mx-auto bg-[#f6f3ff] border border-purple-300 rounded-lg p-4 shadow-lg font-mono text-sm text-gray-800">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span className="text-xs text-gray-500">terminal</span>
              </div>

              {/* 3D Title */}
              <div className="h-[250px] w-full mb-4 rounded-lg overflow-hidden bg-transparent">
                <Techcrunch3D />
              </div>

              <p><span className="text-purple-500">user@event-site</span>:~$ show events --filter tech</p>
              <p className="text-pink-600">Crunching...</p>
              <p className="text-green-600">Found 6 mind-blowing tech events near you!</p>
            </div>
          </div>

          {/* Event list or edit form */}
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
        <footer className="bg-white border-t border-gray-200 py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <div className="text-lg text-purple-600 font-bold">
              &copy; {new Date().getFullYear()} TECHCRUNCH Events
            </div>
            <div className="text-xs text-gray-500 font-mono">Stay curious. Stay techy. Stay glowing.</div>
          </div>
        </footer>
      </div>
    </main>
  )
}
