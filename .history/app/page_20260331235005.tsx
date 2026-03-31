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
      {
        id: "2",
        date: "April 17, 2025",
        time: "11:00 AM",
        location: "GF-021, Near Basketball Ground, GHRCEM, Nagpur",
        type: "Tech Hunt",
        category: "Tech Based Scavenger Hunt",
        description:
          "Tech Hunt is an interactive and thrilling event where participants use their problem-solving skills, speed, and logical thinking to progress through multiple challenging rounds. Teams will navigate through riddles, typing speed challenges, and a final treasure hunt to claim victory!",
        entryFee: "₹ 50",
        contactInfo: "Tanmay Kadbe ~ 9325490381 | Kalash Samrit ~ 8530086137 | Pawan Krishnappa ~ 7447418003",
        registrationLink: "https://forms.gle/XpnSvUNfRLqnoPPY9",
        organizer: "GHRCEM Tech Crew",
        capacity: "Not specified",
        additionalInfo: "Decode. Discover. Dominate. Register now!",
        speakers: [],
        technologies: ["General Tech", "Typing", "Logic"],
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
        registrationLink: "",
        organizer: "Department of Data Science – DATACRUX",
        capacity: "Not specified",
        additionalInfo: "4 Levels. Ultimate Duo Competition.",
        speakers: [],
        technologies: ["Gaming", "Teamwork", "Strategy"],
      },
      {
        id: "4",
        date: "April 16 & 17, 2025",
        time: "11:00 AM",
        location: "Block-C Atrium, GHRCEM, Nagpur",
        type: "Balloon Bash",
        category: "Fun Physical Challenge",
        description:
          "Balloon Bash is a thrilling and action-packed game where participants try to burst each other’s balloons while protecting their own! Quick reflexes, agility, and strategy are the keys to victory in this high-energy battle.",
        entryFee: "₹ 30",
        contactInfo: "Siddhi Dhomne ~ 9130450877 | Janhavi Bhende ~ 9284275258",
        registrationLink: "https://forms.gle/mnbSUQcojsn72U4x6",
        organizer: "GHRCEM Events Team",
        capacity: "Not specified",
        additionalInfo: "Single member event. Wear comfortable clothing and shoes.",
        speakers: [],
        technologies: ["None"],
      },
      {
        id: "5",
        date: "7th – 8th April 2026",
        time: "Not specified",
        location: "Basketball Court, GHRCEM Nagpur",
        type: "Box Cricket Tournament 2026",
        category: "Sports – Cricket",
        description:
          "Box Cricket Tournament 2026 is an exciting and competitive sports event designed to bring out teamwork, strategy, and cricketing skills among participants. Teams will compete in short-format matches, showcasing their coordination and performance under pressure.",
        entryFee: "₹250 per team",
        contactInfo:
          "Sujal Gonde ~ 8483077337 | Meghanshu Atram ~ 9309274116 | Vivek Hanwat ~ 7058379915",
        registrationLink: "",
        organizer:
          "Department of Data Science, GH Raisoni College of Engineering & Management, Nagpur",
        capacity: "Not specified",
        additionalInfo:
          "Match format: 5 overs per innings. Rules will be explained on the match day.",
        speakers: [],
        technologies: ["Sports", "Cricket", "Teamwork"],
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
        registrationLink: "https://campus-innovate-hackathon.vercel.app/",
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
        entryFee: "₹30 (Solo) / ₹50 (Duo)",
        contactInfo:
          "Gauri Dakhole ~ 8390040969 | Diksha Zode ~ 9370760735 | Devyani Dhote ~ 8766422518",
        registrationLink: "",
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
