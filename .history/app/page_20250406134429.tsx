"use client"

import { useState, useEffect, useRef } from "react"
import Navbar from "@/components/navbar"
import TechEventCard from "@/components/tech-event-card"
import TechEditForm from "@/components/tech-edit-form"
import type { EventInfo, AdminState } from "@/utils/types"
import "@/styles/animated-grid.css"
import Techcrunch3D from "@/components/Techcrunch3D"
import { motion, useInView } from "framer-motion"
import GradientWaves from "@/components/GradientWaves"
import { TerminalEdgeGlow } from "@/components/TerminalEdgeGlow"
import { TerminalPulseBackground } from "@/components/TerminalPulseBackground"

export default function Home() {
  const [events, setEvents] = useState<EventInfo[]>([
    // ... (keep all your existing event data exactly as is)
  ]);

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
    setEvents((prev) =>
      prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    )
    setEditingEvent(null)
  }

  const handleCancel = () => setEditingEvent(null)

  const ref = useRef<HTMLDivElement | null>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.04 }
    )
    if (ref.current) observer.observe(ref.current)

    return () => {
      if (ref.current) observer.unobserve(ref.current)
    }
  }, [])

  return (
    <main className="relative min-h-screen text-black overflow-hidden">
      <div className="absolute inset-0 bg-white z-0" />
      <div className="animated-grid z-10" />
      <div className="relative z-20">
        <Navbar adminState={adminState} setAdminState={setAdminState} />

        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-20 relative">
            {/* Add the animation components here */}
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              <TerminalPulseBackground intensity={0.25} speed={4} />
              <TerminalEdgeGlow intensity={0.2} speed={3} color="purple-600" />
            </div>

            {/* Your existing terminal container */}
            <div className="relative mt-6 max-w-2xl mx-auto bg-[#ffffff] border border-purple-700 rounded-lg p-4 font-mono text-sm text-gray-200 text-left shadow-[0_0_20px_#a855f766] backdrop-blur-sm">
              <div className="w-full h-1 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4" />
              <div className="absolute -top-12 -left-12 w-72 h-72 bg-purple-200 rounded-full opacity-30 blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-pink-200 rounded-full opacity-20 blur-2xl animate-spin-slow"></div>
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-md"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2 shadow-md"></div>
                <div className="w-3 h-3 rounded-full bg-green-400 mr-2 shadow-md"></div>
                <span className="text-xs text-purple-400 ml-2">terminal v.2025</span>
              </div>
              <Techcrunch3D />
              <p>
                <span className="text-green-600">user@techcrunch</span>:<span className="text-gray-800">
                  $ find events --category="tech" --sort="date"~
                </span>
              </p>
              <p className="text-pink-500 animate-pulse">Crunching data...</p>
              <p className="text-green-600 font-semibold">
                Found 6 mind-blowing tech events in your area!
              </p>
            </div>
          </div>
          
          <div ref={ref}>
            {editingEvent ? (
              <TechEditForm event={editingEvent} onSave={handleSave} onCancel={handleCancel} />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {events.map((event, index) => (
                  <TechEventCard
                    key={event.id}
                    event={event}
                    variant={index}
                    onEdit={handleEdit}
                    isAdmin={adminState.isAdmin}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </div>

        <footer className="bg-white border-t border-gray-300 py-8 mt-12 relative z-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                  DataTech
                </span>
                <span className="text-sm font-mono bg-purple-200 text-purple-800 px-2 py-1 rounded ml-2">
                  Events
                </span>
              </div>
              <div className="text-gray-500 font-mono text-sm">
                &copy; {new Date().getFullYear()} DataTech Events |{" "}
                <span className="text-purple-500">v1.0.0</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}