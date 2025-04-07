"use client"

import Navbar from "@/components/navbar"
import Link from "next/link"
import { useState } from "react"
import type { AdminState } from "@/utils/types"
import "@/styles/animated-grid.css" // make sure this is the correct path

export default function About() {
  const [adminState, setAdminState] = useState<AdminState>({
    isAdmin: false,
    password: "ADMIN@123",
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100 text-gray-900 relative overflow-hidden">
      {/* 🔹 Animated Background Grid */}
      <div className="animated-grid -z10" />


      {/* 🔹 Navbar & Page Content */}
      <div className="relative z-10">
        <Navbar adminState={adminState} setAdminState={setAdminState} />

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto backdrop-blur-lg bg-white bg-opacity-40 border border-purple-300 rounded-3xl shadow-xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-3xl">
              <h1 className="text-3xl font-bold">About DataTech Events</h1>
            </div>

            <div className="p-6 md:p-10 space-y-10">
              {/* Terminal style card */}
              <div className="bg-white bg-opacity-20 border border-purple-200 backdrop-blur-lg p-4 font-mono rounded-xl text-sm shadow-inner">
                <div className="flex items-center mb-2 space-x-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-xs text-gray-600">about.md</span>
                </div>
                <p><span className="text-purple-500 font-bold"># DataTech Events Platform</span></p>
                <p className="text-gray-700">A cutting-edge platform for data science and tech events.</p>
                <p><span className="text-purple-500 font-bold">## Version 1.0.0</span></p>
              </div>

              {/* Mission */}
              <section>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
                  Our Mission
                </h2>
                <p className="text-gray-800 leading-relaxed">
                  DataTech Events is dedicated to connecting data scientists, engineers, and technology enthusiasts
                  with events like conferences, hackathons, and meetups focused on AI, ML, and data.
                </p>
              </section>

              {/* Features */}
              <section>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
                  Platform Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white bg-opacity-30 border border-purple-200 rounded-xl p-5 shadow-inner">
                    <h3 className="text-lg font-semibold text-purple-600 mb-3">For Attendees</h3>
                    <ul className="space-y-2 text-gray-800">
                      <li>📍 Discover relevant tech events</li>
                      <li>📝 Register via Google forms</li>
                      <li>📆 Filter events by topic or date</li>
                      <li>👥 View speaker profiles</li>
                    </ul>
                  </div>

                  <div className="bg-white bg-opacity-30 border border-pink-200 rounded-xl p-5 shadow-inner">
                    <h3 className="text-lg font-semibold text-pink-600 mb-3">For Organizers</h3>
                    <ul className="space-y-2 text-gray-800">
                      <li>🔒 Secure admin login</li>
                      <li>⚙️ Fully customizable listings</li>
                      <li>🎤 Highlight speakers</li>
                      <li>🔗 Link your registration forms</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Tech Stack */}
              <section>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
                  Technical Stack
                </h2>
                <div className="bg-white bg-opacity-30 border border-purple-200 rounded-xl p-4 font-mono text-sm text-gray-700 shadow-inner">
                  <p><span className="text-green-600">Frontend:</span> Next.js, React, TypeScript, Tailwind CSS</p>
                  <p><span className="text-green-600">State:</span> React Hooks, Context API</p>
                  <p><span className="text-green-600">Storage:</span>  Static JSON</p>
                  <p><span className="text-green-600">Animation:</span>  Framer Motion</p>
                  <p><span className="text-green-600">Integration:</span> Google Forms </p>
                </div>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
                  Contact Us
                </h2>
                <div className="bg-white bg-opacity-30 border border-purple-200 rounded-xl p-4 shadow-inner">
                  <p className="text-gray-800 mb-4">Have questions or suggestions? We'd love to hear from you!</p>
                  <div className="space-y-1 font-mono">
                    <p><span className="text-purple-500">Email:</span> info@datatechevents.com</p>
                    <p><span className="text-purple-500">Phone:</span> (555) 123-4567</p>
                    <p><span className="text-purple-500">GitHub:</span> github.com/datatechevents</p>
                  </div>
                </div>
              </section>

              {/* Back Link */}
              <div className="pt-6 text-center">
                <Link
                  href="/"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:opacity-90 transition-all"
                >
                  ← Back to Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
