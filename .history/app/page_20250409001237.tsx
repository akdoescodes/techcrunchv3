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
        registrationLink: "https://forms.gle/8Hg1vT7cJGbzm9FP9",
        organizer: "GHRCEM Tech Crew",
        capacity: "Not specified",
        additionalInfo: "Teams of 2 members only. Bring your own device.",
        speakers: [],
        technologies: ["General Tech", "Typing", "Logic"],
      },
      {
        id: "3",
        date: "April 17, 2025",
        time: "11:00 AM",
        location: "Lab A-114, Block-A, GHRCEM, Nagpur",
        type: "Emoji Enigma",
        category: "Emoji-Based Puzzle Challenge",
        description:
          "Emoji Enigma is a fun and fast-paced decoding challenge where teams must interpret and decipher emoji sequences into meaningful phrases. The team with the highest correct guesses wins the round!",
        entryFee: "₹ 50",
        contactInfo: "Aarya Ashtankar ~ 9307523277 | Veena Punde ~ 7559411680 | Gungun Bagde ~ 7588396043",
        registrationLink: "https://forms.gle/U3RCUSc6ayPX94yTA",
        organizer: "GHRCEM Puzzle Society",
        capacity: "Not specified",
        additionalInfo: "Teams of 2 members. No phones or external help allowed during rounds.",
        speakers: [],
        technologies: ["Emoji", "Logic", "Interpretation"],
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
        date: "April 16 & 17, 2025",
        time: "11:00 AM",
        location: "Green Gym, Near Block-C, GHRCEM, Nagpur",
        type: "XtreamFit",
        category: "Fitness & Endurance Challenge",
        description:
          "XtreamFit is the ultimate test of strength, endurance, and determination! Participants will compete in a series of bodyweight challenges, to prove who has the best stamina and fitness level.",
        entryFee: "₹ 50",
        contactInfo: "Pranay Tarekar ~ 8600924181 | Tejas Nikode ~ 7378884195 | Prasanna Bade ~ 9322287457",
        registrationLink: "https://forms.gle/pQSr8RmxZD6252qc9",
        organizer: "GHRCEM Fitness Club",
        capacity: "Not specified",
        additionalInfo: "Single member participation. Comfortable sports attire is mandatory.",
        speakers: [],
        technologies: ["Bodyweight", "Fitness", "Endurance"],
      },
      {
        id: "6",
        date: "April 16, 2025",
        time: "11:00 AM",
        location: "GF-021, Near Basketball Ground, GHRCEM, Nagpur",
        type: "Code Relay",
        category: "Coding & Debugging Challenge",
        description:
          "Code Relay is a fast-paced coding challenge where teamwork, problem-solving, and debugging skills are put to the test. Teams of two must collaborate and switch roles to solve a series of interconnected coding challenges across multiple PCs.",
        entryFee: "₹ 50 per team",
        contactInfo: "Vatsal Rungta ~ 7507441034 | Hitesh Rinayat ~ 8698107876 | Prajwal Maidpawar ~ 9834042813",
        registrationLink: "https://forms.gle/CQtBfztumwsuDZYz7",
        organizer: "GHRCEM Coding Club",
        capacity: "Not specified",
        additionalInfo: "Teams of 2 only. Laptops will be provided.",
        speakers: [],
        technologies: ["C", "C++", "Debugging"],
      }  
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
      <div className="absolute inset-0 bg-white z-0" />
      <div className="animated-grid z-10" />
      <div className="relative z-20">
        <Navbar adminState={adminState} setAdminState={setAdminState} />

        {/* Terminal */}
        <div className="w-full flex justify-center px-1 mt-[2rem]">
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
                  DATA-TRON 
                </span>
                <span className="text-sm font-mono bg-purple-200 text-purple-800 px-1 py-0 rounded ml-2">
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
