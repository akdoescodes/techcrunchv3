"use client"

import Navbar from "@/components/navbar"
import Link from "next/link"
import DataParticles from "@/components/data-particles"
import { useState } from "react"
import type { AdminState } from "@/utils/types"

export default function About() {
  const [adminState, setAdminState] = useState<AdminState>({
    isAdmin: false,
    password: "ADMIN@123",
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      <DataParticles />
      <Navbar adminState={adminState} setAdminState={setAdminState} />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto rounded-3xl shadow-xl border border-white/20 backdrop-blur-xl bg-white/10 p-6 md:p-10 transition-all">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-2xl shadow-inner text-white mb-8">
            <h1 className="text-3xl font-bold tracking-tight">About DataTech Events</h1>
          </div>

          <div className="space-y-10">
            {/* Terminal-style header */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm backdrop-blur">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs text-gray-400 ml-2">about.md</span>
              </div>
              <p><span className="text-purple-400"># DataTech Events Platform</span></p>
              <p className="text-gray-400">A cutting-edge platform for data science and tech events.</p>
              <p><span className="text-purple-400">## Version 1.0.0</span></p>
            </div>

            <section>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-3">Our Mission</h2>
              <p className="text-gray-200 leading-relaxed">
                DataTech Events connects data scientists, engineers, and tech enthusiasts with the most exciting events — conferences, workshops, hackathons, and meetups — all in one platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-3">Platform Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 border border-purple-500 rounded-xl p-4 backdrop-blur-lg hover:scale-[1.02] transition">
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">For Attendees</h3>
                  <ul className="space-y-2 text-gray-200">
                    <li>→ Discover curated events with detailed insights</li>
                    <li>→ Register via built-in Google Forms</li>
                    <li>→ Filter by tech category, level, or date</li>
                    <li>→ Access speaker info and focus topics</li>
                  </ul>
                </div>

                <div className="bg-white/10 border border-pink-500 rounded-xl p-4 backdrop-blur-lg hover:scale-[1.02] transition">
                  <h3 className="text-lg font-semibold text-pink-400 mb-2">For Organizers</h3>
                  <ul className="space-y-2 text-gray-200">
                    <li>→ Admin-only event editing & publishing</li>
                    <li>→ Customize every event detail</li>
                    <li>→ Spotlight speakers and tech used</li>
                    <li>→ Connect Google Form for signups</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-3">Tech Stack</h2>
              <div className="bg-white/5 rounded-xl p-4 font-mono text-sm border border-white/10 backdrop-blur">
                <p><span className="text-green-400">Frontend:</span> Next.js, React, TypeScript, Tailwind CSS</p>
                <p><span className="text-green-400">State:</span> React Hooks, Context API</p>
                <p><span className="text-green-400">Storage:</span> LocalStorage, JSON</p>
                <p><span className="text-green-400">Animations:</span> Canvas API, CSS Transitions</p>
                <p><span className="text-green-400">Integrations:</span> Google Forms API</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-3">Contact Us</h2>
              <div className="bg-white/10 border border-white/10 rounded-xl p-4 backdrop-blur">
                <p className="text-gray-300 mb-4">We’d love your feedback or ideas! Get in touch via:</p>
                <div className="space-y-2 font-mono text-gray-300">
                  <p><span className="text-purple-400">Email:</span> info@datatechevents.com</p>
                  <p><span className="text-purple-400">Phone:</span> (555) 123-4567</p>
                  <p><span className="text-purple-400">GitHub:</span> github.com/datatechevents</p>
                </div>
              </div>
            </section>

            <div className="pt-4 border-t border-white/10 flex justify-center">
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:shadow-[0_0_10px_rgba(236,72,153,0.7)] transition-all"
              >
                &larr; Back to Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
