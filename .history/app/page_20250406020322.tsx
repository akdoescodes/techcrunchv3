// page.tsx
"use client";  // <-- Add this line at the very top

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/navbar";
import TechEventCard from "@/components/tech-event-card";
import TechEditForm from "@/components/tech-edit-form";
import type { EventInfo, AdminState } from "@/utils/types";
import "@/styles/animated-grid.css";
import Techcrunch3D from "@/components/Techcrunch3D";
import { motion, useInView } from "framer-motion";
import GradientWaves from "@/components/GradientWaves"; // Import GradientWaves component

const Home: React.FC = () => {
  const [events, setEvents] = useState<EventInfo[]>([
    {
      id: "1",
      date: "April 15, 2025",
      time: "6:00 PM - 9:00 PM",
      location: "Grand Conference Center",
      type: "Data Science Workshop",
      category: "Technology",
      description:
        "Join us for an interactive workshop on the latest data science techniques and tools. Perfect for beginners and experienced data scientists alike.",
      entryFee: "$25",
      contactInfo: "events@datascience.com | (555) 123-4567",
      registrationLink: "https://forms.google.com/your-form-link-here",
      organizer: "Data Science Community",
      capacity: "50 attendees",
      additionalInfo: "Bring your laptop with Python installed. We'll be working with pandas, numpy, and scikit-learn.",
      speakers: ["Dr. Jane Smith", "Prof. John Davis", "Sarah Johnson, PhD"],
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
        "Explore the cutting edge of artificial intelligence with industry leaders and researchers. Featuring talks, demos, and networking opportunities.",
      entryFee: "$75",
      contactInfo: "ai@techhub.com | (555) 987-6543",
      registrationLink: "https://forms.google.com/your-form-link-here",
      organizer: "AI Research Group",
      capacity: "200 attendees",
      additionalInfo:
        "Conference proceedings will be published online. All talks will be recorded and made available to attendees.",
      speakers: ["Dr. Alan Turing", "Grace Hopper", "Satya Nadella"],
      technologies: ["TensorFlow", "PyTorch", "NLP"],
    },
    // Add more events as needed
  ]);

  const [editingEvent, setEditingEvent] = useState<EventInfo | null>(null);
  const [adminState, setAdminState] = useState<AdminState>({
    isAdmin: false,
    password: "ADMIN@123",
  });

  const ref = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.04 }
    );
    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <main className="relative min-h-screen text-black overflow-hidden">
      {/* Gradient Waves animation */}
      <GradientWaves />

      <div className="absolute inset-0 bg-white z-0" />
      <div className="animated-grid z-10" />
      <div className="relative z-20">
        <Navbar adminState={adminState} setAdminState={setAdminState} />

        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-20">
            <div className="mt-6 max-w-2xl mx-auto bg-[#ffffff] border border-purple-700 rounded-lg p-4 font-mono text-sm text-gray-200 text-left shadow-[0_0_20px_#a855f766] backdrop-blur-sm">
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
  );
};

export default Home;
