"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/navbar";
import TechEventCard from "@/components/tech-event-card";
import TechEditForm from "@/components/tech-edit-form";
import { motion, useInView } from "framer-motion";
import GradientWaves from "@/components/GradientWaves";  // Importing GradientWaves

const Home: React.FC = () => {
  const [events, setEvents] = useState<EventInfo[]>([
    {
      id: "1",
      date: "April 15, 2025",
      time: "6:00 PM - 9:00 PM",
      location: "Grand Conference Center",
      type: "Data Science Workshop",
      category: "Technology",
      description: "Join us for an interactive workshop on the latest data science techniques.",
      entryFee: "$25",
      contactInfo: "events@datascience.com | (555) 123-4567",
      registrationLink: "https://forms.google.com/your-form-link-here",
      organizer: "Data Science Community",
      capacity: "50 attendees",
      additionalInfo: "Bring your laptop with Python installed.",
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
      description: "Explore the cutting edge of artificial intelligence with industry leaders.",
      entryFee: "$75",
      contactInfo: "ai@techhub.com | (555) 987-6543",
      registrationLink: "https://forms.google.com/your-form-link-here",
      organizer: "AI Research Group",
      capacity: "200 attendees",
      additionalInfo: "Conference proceedings will be published online.",
      speakers: ["Dr. Alan Turing", "Grace Hopper", "Satya Nadella"],
      technologies: ["TensorFlow", "PyTorch", "NLP"],
    },
    // Add more events as needed
  ]);

  const [editingEvent, setEditingEvent] = useState<EventInfo | null>(null);
  const [adminState, setAdminState] = useState<AdminState>({ isAdmin: false, password: "ADMIN@123" });

  const ref = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  const handleEdit = (event: EventInfo) => {
    setEditingEvent(event);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.04 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);

  return (
    <main className="relative min-h-screen text-black overflow-hidden">
      {/* Gradient Waves animation */}
      <GradientWaves />

      <div className="absolute inset-0 bg-white z-0" />
      <div className="relative z-20">
        <Navbar adminState={adminState} setAdminState={setAdminState} />

        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-20">
            <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg font-mono">
              <Techcrunch3D />
              <p className="text-pink-500 animate-pulse">Crunching data...</p>
              <p className="text-green-600 font-semibold">Found 6 tech events in your area!</p>
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
      </div>
    </main>
  );
};

export default Home;
