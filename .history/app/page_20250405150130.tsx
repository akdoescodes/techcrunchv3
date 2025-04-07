"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import DataParticles from "@/components/data-particles"
import TechEventCard from "@/components/tech-event-card"
import TechEditForm from "@/components/tech-edit-form"
import type { EventInfo, AdminState } from "@/utils/types"
import "@/styles/animated-grid.css"

export default function Home() {
  const [events, setEvents] = useState<EventInfo[]>([
    {
      id: "1",
      date: "April 15, 2025",
      time: "6:00 PM - 9:00 PM",
      location: "Grand Conference Center",
      type: "Data Science Workshop",
      category: "Technology",
      description:
        "Join us for an interactive workshop on the latest data science techniques and tools.",
      entryFee: "$25",
      contactInfo: "events@datascience.com | (555) 123-4567",
      registrationLink: "https://forms.google.com/your-form-link-here",
      organizer: "Data Science Community",
      capacity: "50 attendees",
      additionalInfo: "Bring your laptop with Python installed.",
      speakers: ["Dr. Jane Smith", "Prof. John Davis"],
      technologies: ["Python", "ML", "AI"],
    },
    {
      id: "2",
      date: "May 20, 2025",
      time: "7:30 PM - 10:00 PM",
      location: "Tech Innovation Hub",
      type: "AI Conference",
      category: "Artificial Intelligence",
      description:
        "Explore the cutting edge of AI with talks, demos, and networking opportunities.",
      entryFee: "$75",
      contactInfo: "ai@techhub.com | (555) 987-6543",
      registrationLink: "https://forms.google.com/your-form-link-here",
      organizer: "AI Research Group",
      capacity: "200 attendees",
      additionalInfo: "Talks will be recorded and published online.",
      speakers: ["Dr. Alan Turing", "Grace Hopper"],
      technologies: ["TensorFlow", "NLP"],
    },
  ])

  const [editingEvent, setEditingEvent] = useState<EventInfo | null>(null)
  const [adminState, setAdminState] = useState<AdminState>({
    isAdmin: false,
    password: "ADMIN@123",
  })

  useEffect(() => {
    const saved = localStorage.getItem("events")
    try {
      const parsed = saved ? JSON.parse(saved) : null
      if (parsed && Array.isArray(parsed) && parsed.length > 0) {
        setEvents(parsed)
      }
    } catch (err) {
      console.warn("Invalid localStorage data")
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events))
  }, [events])

  const handleEdit = (event: EventInfo) => {
    if (!adminState.isAdmin) return
    setEditingEvent(event)
  }

  const handleSave = (updated: EventInfo) => {
    setEvents(prev =>
      prev.map(event => (event.id === updated.id ? updated : event))
    )
    setEditingEvent(null)
  }

  const handleCancel = () => setEditingEvent(null)

  return (
    <main className="relative min-h-screen text-black bg-white overflow-hidden">

      {/* Z-0: White Background */}
      <div className="absolute inset-0 bg-white z-0" />

      {/* Z-10: Animated Grid */}
      <div className="absolute inset-0 z-10 bg-animated-grid pointer-events-none" />

      {/* Z-30: Foreground Content */}
      <div className="relative z-30">
        <Navbar adminState={adminState} setAdminState={setAdminState} />

        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
              DataTech Events
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover cutting-edge data science and technology events.
            </p>

            {/* Terminal-style block */}
            <div className="mt-6 max-w-2xl mx-auto bg-gray-100 border border-gray-300 rounded-lg p-4 font-mono text-sm text-gray-800 text-left">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                <span className="text-xs text-gray-500">terminal</span>
              </div>
              <p>
                <span className="text-green-600">user@datatech</span>:<span className="text-blue-500">~</span>$ find
                events --category="data-science"
              </p>
              <p className="text-purple-600">Finding events...</p>
              <p className="text-green-600">Found {events.length} events</p>
            </div>
          </div>

          {/* Event Cards or Edit Form */}
          {editingEvent ? (
            <TechEditForm
              event={editingEvent}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.length > 0 ? (
                events.map((event, index) => (
                  <TechEventCard
                    key={event.id}
                    event={event}
                    variant={index}
                    onEdit={handleEdit}
                    isAdmin={adminState.isAdmin}
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-400">No events found.</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-8 mt-12 relative z-30">
          <div className="container mx-auto px-4 text-center text-sm text-gray-600 font-mono">
            &copy; {new Date().getFullYear()} DataTech Events |{" "}
            <span className="text-purple-500">v1.0.0</span>
          </div>
        </footer>
      </div>
    </main>
  )
}
