"use client"

import Navbar from "@/components/navbar"
import Link from "next/link"
import DataParticles from "@/components/data-particles"
import { useState } from "react"
import type { AdminState } from "@/utils/types"
import "@/styles/animated-grid.css"

export default function About() {
  const [adminState, setAdminState] = useState<AdminState>({
    isAdmin: false,
    password: "ADMIN@123",
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-100 text-gray-900 relative overflow-hidden">
      {/* 🔹 Animated Background Grid */}
      <div className="animated-grid absolute inset-0 z-0" />

      {/* 🔹 Particles (behind content, above grid) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <DataParticles />
      </div>

      {/* 🔹 Navbar & Content (top layer) */}
      <div className="relative z-20">
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

              {/* Other Sections: Mission, Features, Tech Stack, Contact */}
              {/* ... (unchanged) ... */}

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
