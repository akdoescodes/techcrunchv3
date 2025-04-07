"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import TechEventCard from "@/components/tech-event-card";
import TechEditForm from "@/components/tech-edit-form";
import type { EventInfo, AdminState } from "@/utils/types";
import "@/styles/animated-grid.css";
import Techcrunch3D from "@/components/Techcrunch3D";

export default function Home() {
  const [events, setEvents] = useState<EventInfo[]>([ /* your event data */ ]);

  const [editingEvent, setEditingEvent] = useState<EventInfo | null>(null);
  const [adminState, setAdminState] = useState<AdminState>({
    isAdmin: false,
    password: "ADMIN@123",
  });

  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) setEvents(JSON.parse(savedEvents));
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

  const handleCancel = () => {
    setEditingEvent(null);
  };

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

            {/* Terminal-style intro with 3D Techcrunch animation */}
            <div className="mt-6 max-w-2xl mx-auto bg-[#ffffff] border border-purple-700 rounded-lg p-4 font-mono text-sm text-gray-800 text-left shadow-[0_0_20px_#a855f766] backdrop-blur-sm relative overflow-hidden">

              {/* Top gradient strip */}
              <div className="w-full h-1 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4" />

              {/* Background glowing elements */}
              <div className="absolute -top-12 -left-12 w-72 h-72 bg-purple-200 rounded-full opacity-30 blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-pink-200 rounded-full opacity-20 blur-2xl animate-spin-slow" />

              {/* Terminal header */}
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-md"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2 shadow-md"></div>
                <div className="w-3 h-3 rounded-full bg-green-400 mr-2 shadow-md"></div>
                <span className="text-xs text-purple-400 ml-2">terminal</span>
              </div>

              {/* 3D Animation Component */}
              <div className="relative w-full h-[300px] flex items-center justify-center mb-4">
                <Techcrunch3D />
              </div>

              {/* Terminal-style text output */}
              <p>
                <span className="text-green-600">user@techcrunch</span>:<span className="text-blue-500">~</span>$ find
                events --category="tech" --sort="date"
              </p>
              <p className="text-pink-500 animate-pulse">Crunching data...</p>
              <p className="text-green-700 font-semibold">
                Found 6 mind-blowing tech events in your area!
              </p>
            </div>
          </div> {/* ✅ This closing div was missing */}
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
  );
}
