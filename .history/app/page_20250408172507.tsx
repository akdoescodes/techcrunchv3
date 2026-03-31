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
  const [events, setEvents] = useState<EventInfo[]>([
    {
      id: "1",
      date: "April 16, 2025",
      time: "11:00 AM",
      location: "Lab A-114, Block-A, GHRCEM, Nagpur",
      type: "Code Quest Challenge",
      category: "Algorithmic Coding & Problem Solving",
      description:
        "Code Quest Challenge is an exciting coding competition designed to test participants' problem-solving, debugging, and programming skills through multiple rounds. Teams must demonstrate their coding expertise, logical thinking, and ability to work under pressure.",
      entryFee: "₹ 30",
      contactInfo: "Nayan Dadulkar ~ 9309532899 | Janvi Nanotkar ~ 8605614353",
      registrationLink: "https://forms.gle/6XgYcnxvfS9LDX9D9",
      organizer: "GHRCEM Coding Club",
      capacity: "Not specified",
      additionalInfo: "Single member participation only. Bring your own laptop.",
      speakers: [],
      technologies: ["C++", "Python", "Java"],
    },
    // ... (other event objects remain the same)
  ]);
  
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
      {/* Background elements */}
      <div className="absolute inset-0 bg-white z-0" />
      <div className="animated-grid z-10" />
      
      {/* Main content */}
      <div className="relative z-20">
        <Navbar adminState={adminState} setAdminState={setAdminState} />

        {/* Terminal - adjusted for mobile */}
        <div className="w-full flex justify-center px-1 mt-[-1rem] md:mt-[-2rem]">
          <TerminalWithTechcrunch />
        </div>

        {/* Main Content - optimized for mobile */}
        <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12">
          <div ref={ref}>
            {editingEvent ? (
              <TechEditForm
                event={editingEvent}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
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

        {/* Footer - mobile optimized */}
        <footer className="bg-white border-t border-gray-300 py-6 relative z-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center space-y-4">
              <div>
                <span className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                  DataTron 
                </span>
                <span className="text-xs sm:text-sm font-mono bg-purple-200 text-purple-800 px-2 py-1 rounded ml-1 sm:ml-2">
                  Events
                </span>
              </div>
              <div className="text-gray-500 font-mono text-xs sm:text-sm">
                &copy; {new Date().getFullYear()} DataScience Department |{" "}
                <span className="text-purple-500">v1.0.0</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}