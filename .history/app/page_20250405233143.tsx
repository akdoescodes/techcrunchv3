"use client";

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import TechEventCard from "@/components/tech-event-card"
import TechEditForm from "@/components/tech-edit-form"
import type { EventInfo, AdminState } from "@/utils/types"
import "@/styles/animated-grid.css"
import Techcrunch3D from "@/components/Techcrunch3D"


export default function Home() {
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
    {
      id: "3",
      date: "June 5, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "Business Analytics Center",
      type: "Big Data Summit",
      category: "Data Engineering",
      description:
        "Annual big data summit featuring keynote speakers, technical workshops, and case studies on handling massive datasets efficiently.",
      entryFee: "$150",
      contactInfo: "info@bigdatasummit.com | (555) 456-7890",
      registrationLink: "https://forms.google.com/your-form-link-here",
      organizer: "Data Engineering Association",
      capacity: "300 attendees",
      additionalInfo: "Early bird tickets available until March 31. Includes lunch and conference materials.",
      speakers: ["Jeff Dean", "Hilary Mason", "DJ Patil"],
      technologies: ["Hadoop", "Spark", "Kafka"],
    },
    {
      id: "4",
      date: "July 12, 2025",
      time: "10:00 AM - 4:00 PM",
      location: "Community Tech Center",
      type: "Python Hackathon",
      category: "Programming",
      description:
        "24-hour hackathon focused on building data science applications with Python. Open to all skill levels, with mentors available to help.",
      entryFee: "Free",
      contactInfo: "hackathon@pythongroup.org | (555) 789-0123",
      registrationLink: "https://forms.google.com/your-form-link-here",
      organizer: "Python Developers Group",
      capacity: "100 participants",
      additionalInfo: "Teams of up to 4 people. Food and drinks provided. Prizes for the top 3 projects.",
      speakers: ["Guido van Rossum", "Wes McKinney", "Jake VanderPlas"],
      technologies: ["Python", "Django", "Flask"],
    },
    {
      id: "5",
      date: "August 8, 2025",
      time: "6:30 PM - 8:30 PM",
      location: "Data Visualization Lab",
      type: "Tableau Workshop",
      category: "Data Visualization",
      description:
        "Hands-on workshop on creating effective data visualizations with Tableau. Learn to transform your data into compelling visual stories.",
      entryFee: "$35",
      contactInfo: "viz@datavizlab.com | (555) 234-5678",
      registrationLink: "https://forms.google.com/your-form-link-here",
      organizer: "Data Visualization Society",
      capacity: "40 attendees",
      additionalInfo:
        "No prior Tableau experience required. Trial licenses will be provided for those who don't have Tableau.",
      speakers: ["Edward Tufte", "Alberto Cairo", "Nadieh Bremer"],
      technologies: ["Tableau", "D3.js", "R"],
    },
    {
      id: "6",
      date: "September 25, 2025",
      time: "8:00 AM - 5:00 PM",
      location: "Machine Learning Institute",
      type: "Deep Learning Bootcamp",
      category: "Machine Learning",
      description:
        "Intensive one-day bootcamp on deep learning fundamentals and applications. From neural networks basics to advanced architectures.",
      entryFee: "$199",
      contactInfo: "bootcamp@mlinstitute.org | (555) 345-6789",
      registrationLink: "https://forms.google.com/your-form-link-here",
      organizer: "ML Research Institute",
      capacity: "50 participants",
      additionalInfo: "Intermediate Python knowledge required. GPUs will be provided for training exercises.",
      speakers: ["Andrew Ng", "Yann LeCun", "Fei-Fei Li"],
      technologies: ["PyTorch", "TensorFlow", "Keras"],
    },
  ])

  const [editingEvent, setEditingEvent] = useState<EventInfo | null>(null)
  const [adminState, setAdminState] = useState<AdminState>({
    isAdmin: false,
    password: "ADMIN@123",
  })

  useEffect(() => {
    const savedEvents = localStorage.getItem("events")
    if (savedEvents) setEvents(JSON.parse(savedEvents))
  }, [])

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events))
  }, [events])

  const handleEdit = (event: EventInfo) => {
    if (!adminState.isAdmin) return
    setEditingEvent(event)
  }

  const handleSave = (updatedEvent: EventInfo) => {
    setEvents((prev) => prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
    setEditingEvent(null)
  }

  const handleCancel = () => {
    setEditingEvent(null)
  }

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
            <div className="mt-6 max-w-2xl mx-auto bg-[#ffffff] border border-purple-700 rounded-lg p-4 font-mono text-sm text-gray-200 text-left shadow-[0_0_20px_#a855f766] backdrop-blur-sm">

            <div className="w-full h-1 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4" />

            <div className="absolute -top-12 -left-12 w-72 h-72 bg-purple-200 rounded-full opacity-10 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-pink-200 rounded-full opacity-20 blur-2xl animate-spin-slow"></div>

            <div className="flex items-center mb-2">
  <div className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-md"></div>
  <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2 shadow-md"></div>
  <div className="w-3 h-3 rounded-full bg-green-400 mr-2 shadow-md"></div>
  <span className="text-xs text-purple-400 ml-2">terminal</span>
</div>

  
              <Techcrunch3D />
  
              <p>
                <span className="text-green-600">user@techcrunch</span>:<span className="text-blue-500">~</span>$ find
                events --category="tech" --sort="date"
              </p>
              <p className="text-pink-500 animate-pulse">Crunching data...</p>
<p className="text-green-700 font-semibold">Found 6 mind-blowing tech events in your area!</p>

            </div>
          </div>
  
          {/* Events Section or Edit Form */}
          {editingEvent ? (
            <TechEditForm event={editingEvent} onSave={handleSave} onCancel={handleCancel} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                &copy; {new Date().getFullYear()} DataTech Events | <span className="text-purple-500">v1.0.0</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}