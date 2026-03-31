"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import TechEventCard from "@/components/tech-event-card";
import TechEditForm from "@/components/tech-edit-form";
import TerminalWithTechcrunch from "@/components/TerminalWithTechcrunch";
import type { EventInfo, AdminState } from "@/utils/types";
import "@/styles/animated-grid.css";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function Home() {
  const [events, setEvents] = useState<EventInfo[]>([ /* ... your 6 events ... */ ]);
  const [editingEvent, setEditingEvent] = useState<EventInfo | null>(null);
  const [adminState, setAdminState] = useState<AdminState>({
    isAdmin: false,
    password: "ADMIN@123",
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // Save to localStorage whenever events update
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const handleEdit = (event: EventInfo) => {
    if (!adminState.isAdmin) return;
    setEditingEvent(event);
  };

  const handleSave = (updatedEvent: EventInfo) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    setEditingEvent(null);
  };

  const handleCancel = () => setEditingEvent(null);

  const { ref, inView: isInView } = useInView({ threshold: 0.05 });

  return (
    <main className="relative min-h-screen text-black overflow-hidden">
      <div className="absolute inset-0 bg-white z-0" />
      <div className="animated-grid z-10" />
      <div className="relative z-20">
        <Navbar adminState={adminState} setAdminState={setAdminState} />

        {/* Terminal */}
        <div className="w-full flex justify-center px-1 mt-[-1rem]">
          <TerminalWithTechcrunch />
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div ref={ref}>
            {editingEvent ? (
              <TechEditForm
                event={editingEvent}
                onSave={handleSave}
                onCancel={handleCancel}
              />
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

        {/* Footer */}
        <footer className="bg-white border-t border-gray-300 py-8 relative z-20">
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
  );
}
