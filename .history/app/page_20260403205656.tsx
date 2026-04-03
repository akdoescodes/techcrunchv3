"use client";

import { useState } from "react";
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
        id: "2",
        date: "8th April",
        time: "Starts at 11:00 AM",
        location: "RS Lab, near Basketball Court, GHRCEM, Nagpur",
        type: "Tech Hunt",
        category: "Tech Based Scavenger Hunt",
        description:
          "Tech Hunt is an exciting treasure-hunt style event that combines technical knowledge with problem-solving and exploration. Participants will follow clues, solve challenges, and navigate through different stages to reach the final goal. It tests logical thinking, teamwork, and quick decision-making skills in a fun and engaging way.",
        entryFee: "₹80 per team",
        contactInfo: "Tanmay Kadbe ~ 9325490381 | Kalash Samrit ~ 8149086137 | Pawan Krishnappa ~ 7447418003",
        registrationLink: "https://forms.gle/XpnSvUNfRLqnoPPY9",
        organizer:
          "Department of Data Science, GH Raisoni College of Engineering & Management, Nagpur (DATATRON)",
        capacity: "Not specified",
        additionalInfo:
          "Follow clues carefully. Use both technical and logical skills. Be quick and accurate to win.",
        speakers: [],
        technologies: ["Treasure Hunt", "Problem Solving", "Teamwork"],
      },
      {
        id: "3",
        date: "8th April",
        time: "10:00 AM",
        location: "In front of C-Block",
        type: "Fusion Frenzy Cup",
        category: "Gaming Competition",
        description:
          "Fusion Frenzy Cup is a fun-filled gaming competition featuring multiple levels and challenges. Teams compete in pairs, testing coordination, speed, and strategy to become the ultimate duo.",
        entryFee: "₹40 per duo",
        contactInfo: "Devyani Sadar ~ 8408996987 | Devyani Dhote ~ 8766422518 | Amol Rahangdale ~ 8766608831",
        registrationLink: "https://docs.google.com/forms/d/e/1FAIpQLSe5_EX_r_XDfnoCiNukk9GS-MbXsqtTAschHsBrTRbncN3_KA/viewform?usp=publish-editor",
        organizer: "Department of Data Science – DATACRUX",
        capacity: "Not specified",
        additionalInfo: "4 Levels. Ultimate Duo Competition.",
        speakers: [],
        technologies: ["Gaming", "Teamwork", "Strategy"],
      },
      {
        id: "5",
        date: "8th April",
        time: "Limited Time Challenge",
        location: "Block C",
        type: "Color Capture",
        category: "Photography Challenge",
        description:
          "DATA-TRON2K26 presents COLOR CAPTURE - a vibrant photography challenge where creativity meets observation! Get assigned a specific color, explore the campus to find it, and capture photos where the color is the main focus. Think photography is just clicking pictures? Think again! Every color tells a story in this limited time challenge.",
        entryFee: " Solo ₹30  Duo ₹50 ",
        contactInfo: "Atharva ~ 7083584566 | Rahul ~ 7030804822 | Amol ~ 8766608831",
        registrationLink: "https://forms.gle/XPdPso7v83ixY6JdA",
        organizer:
          "Department of Data Science, GH Raisoni College of Engineering and Management",
        capacity: "Not specified",
        additionalInfo:
          "Use phone/camera. Individual/Team participation. Color must be clearly visible. Fair & original entries only. Focus on creativity, uniqueness, composition & visual appeal.",
        speakers: [],
        technologies: ["Photography", "Creativity", "Observation"],
      },
      {
        id: "6",
        date: "7th April 2026",
        time: "10:00 AM – 5:00 PM",
        location: "Auditorium, 2nd Floor, Block A",
        type: "Campus Innovate Hackathon 2.0",
        category: "Coding & Innovation",
        description:
          "Campus Innovate Hackathon 2.0 is a dynamic coding competition where participants collaborate to solve real-world problems using innovative ideas and technology. It tests creativity, coding skills, and teamwork in a time-bound environment.",
        entryFee: "₹400 per team",
        contactInfo:
          "Nayan Dadulkar ~ 9309532459 | Prajwal Maidpawar ~ 9834047813 | Hitesh Rinayat ~ 8645607876",
        registrationLink: "https://forms.gle/HCPw5vzVD8vaPVi99",
        organizer: "Department of Data Science – Code Crafter Club",
        capacity: "Not specified",
        additionalInfo: "Teams of 2 – 4 members.",
        speakers: [],
        technologies: ["Hackathon", "Innovation", "Tech"],
      },
      {
        id: "7",
        date: "7th April 2026",
        time: "11:00 AM",
        location: "103 LAB, Block A",
        type: "Silent Disco Debate",
        category: "Debate & Communication",
        description:
          "Silent Disco Debate is a unique and engaging event where participants debate while wearing headphones, combining music and arguments in a fun and competitive environment. It challenges communication, presence of mind, and creativity.",
        entryFee: "₹50 (Duo only)",
        contactInfo:
          "Gauri Dakhole ~ 8390040969 | Diksha Zode ~ 9370760735 | Devyani Dhote ~ 8766422518",
        registrationLink: "https://docs.google.com/forms/d/e/1FAIpQLSco5VvKNe-MbfGPOPxUyIeODDRD2uv0kIvRQVmOYXY3G-NoJA/viewform?usp=publish-editor",
        organizer: "Department of Data Science – DATATRON",
        capacity: "Not specified",
        additionalInfo: "Solo and duo participation options available.",
        speakers: [],
        technologies: ["Debate", "Creative Thinking", "Public Speaking"],
      },
    ]);

  const [editingEvent, setEditingEvent] = useState<EventInfo | null>(null);
  const [adminState, setAdminState] = useState<AdminState>({
    isAdmin: false,
    password: "ADMIN@123",
  });

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

        {/* Terminal with responsive margins */}
        <div className="w-full flex justify-center px-1 
            mt-[0.5rem] mb-[-1rem]
            sm:mt-[1rem] sm:mb-[-2rem]
            md:mt-[1.5rem] md:mb-[1.2rem]
            lg:mt-[2rem] lg:mb-[1.2rem]">
          <TerminalWithTechcrunch />
        </div>

        {/* Event cards container */}
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

        {/* Footer */}
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
