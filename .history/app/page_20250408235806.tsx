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
      description: "Code Quest Challenge is an exciting coding competition designed to test participants' problem-solving, debugging, and programming skills through multiple rounds.",
      entryFee: "₹ 30",
      contactInfo: "Nayan Dadulkar ~ 9309532899 | Janvi Nanotkar ~ 8605614353",
      registrationLink: "https://forms.gle/6XgYcnxvfS9LDX9D9",
      organizer: "GHRCEM Coding Club",
      capacity: "Not specified",
      additionalInfo: "Single member participation only. Bring your own laptop.",
      speakers: [],
      technologies: ["C++", "Python", "Java"],
    },
    {
      id: "2",
      date: "April 17, 2025",
      time: "11:00 AM",
      location: "GF-021, Near Basketball Ground, GHRCEM, Nagpur",
      type: "Tech Hunt",
      category: "Tech Based Scavenger Hunt",
      description: "Tech Hunt is an interactive and thrilling event where participants use their problem-solving skills, speed, and logical thinking to progress through multiple challenging rounds.",
      entryFee: "₹ 50",
      contactInfo: "Tanmay Kadbe ~ 9325490381 | Kalash Samrit ~ 8530086137 | Pawan Krishnappa ~ 7447418003",
      registrationLink: "https://forms.gle/8Hg1vT7cJGbzm9FP9",
      organizer: "GHRCEM Tech Crew",
      capacity: "Not specified",
      additionalInfo: "Teams of 2 members only. Bring your own device.",
      speakers: [],
      technologies: ["General Tech", "Typing", "Logic"],
    },
    // ... (other events remain the same)
  ]);

  const [editingEvent, setEditingEvent] = useState<EventInfo | null>(null);
  const [adminState, setAdminState] = useState<AdminState>({
    isAdmin: false,
    password: "ADMIN@123",
  });

  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const handleEdit = (event: EventInfo) => {
    if (!adminState.isAdmin) return;
    setEditingEvent(event);
  };

  const handleSave = (updatedEvent: EventInfo) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
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

        {/* Terminal with adjusted top spacing */}
        <div className="w-full flex justify-center px-1 mt-0 sm:mt-2">
          <TerminalWithTechcrunch />
        </div>

        {/* Event cards with reduced top padding only */}
        <div className="container mx-auto px-4 pt-2 pb-12 sm:pt-6">
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
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
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

        <footer className="bg-white border-t border-gray-300 py-6 sm:py-8 relative z-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                  DATA-TRON 
                </span>
                <span className="text-sm font-mono bg-purple-200 text-purple-800 px-2 py-1 rounded ml-2">
                  TECHKRUNCH
                </span>
              </div>
              <div className="text-gray-500 font-mono text-sm">
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