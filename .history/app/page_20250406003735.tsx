"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import TechEventCard from "@/components/tech-event-card";
import TechEditForm from "@/components/tech-edit-form";
import type { EventInfo, AdminState } from "@/utils/types";
import "@/styles/animated-grid.css";
import Techcrunch3D from "@/components/Techcrunch3D";

export default function Home() {
  const [events, setEvents] = useState<EventInfo[]>([
    {
      id: 1,
      name: "CodeConquest",
      description: "A fierce coding battle to conquer complex challenges.",
      date: "2025-05-10",
      time: "14:00",
      location: "Auditorium A",
      type: "Offline",
      category: "Hackathon",
      entryFee: "Free",
      contact: "9876543210",
      registerLink: "https://example.com/register1",
    },
    {
      id: 2,
      name: "AI Sparks",
      description: "Explore the world of Artificial Intelligence.",
      date: "2025-05-12",
      time: "11:00",
      location: "Lab 3",
      type: "Online",
      category: "Workshop",
      entryFee: "$10",
      contact: "9123456789",
      registerLink: "https://example.com/register2",
    },
    {
      id: 3,
      name: "WebWizards",
      description: "Create stunning web apps with the latest tools.",
      date: "2025-05-14",
      time: "10:00",
      location: "Room 204",
      type: "Offline",
      category: "Web Development",
      entryFee: "Free",
      contact: "9988776655",
      registerLink: "https://example.com/register3",
    },
    {
      id: 4,
      name: "Debug Duel",
      description: "Find bugs before they find you!",
      date: "2025-05-15",
      time: "15:30",
      location: "Computer Lab",
      type: "Offline",
      category: "Debugging",
      entryFee: "$5",
      contact: "9090909090",
      registerLink: "https://example.com/register4",
    },
    {
      id: 5,
      name: "CryptoCrypt",
      description: "A puzzle-based cryptography challenge.",
      date: "2025-05-18",
      time: "13:00",
      location: "Room 101",
      type: "Online",
      category: "Cryptography",
      entryFee: "Free",
      contact: "9876543210",
      registerLink: "https://example.com/register5",
    },
    {
      id: 6,
      name: "UI Clash",
      description: "Design eye-catching user interfaces under pressure.",
      date: "2025-05-20",
      time: "12:00",
      location: "Design Studio",
      type: "Offline",
      category: "UI/UX",
      entryFee: "$8",
      contact: "9876501234",
      registerLink: "https://example.com/register6",
    },
  ]);

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
    setEvents((prev) => prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)));
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
            {/* Terminal-style intro with 3D Techcrunch animation */}
            <div className="mt-6 max-w-2xl mx-auto bg-[#ffffff] border border-purple-700 rounded-lg p-4 font-mono text-sm text-gray-200 text-left shadow-[0_0_20px_#a855f766] backdrop-blur-sm mb-20">
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

          {/* Events Section or Edit Form */}
          {editingEvent ? (
            <TechEditForm event={editingEvent} onSave={handleSave} onCancel={handleCancel} />
          ) : (
            <div className="pt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
