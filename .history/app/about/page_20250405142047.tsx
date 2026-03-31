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
    <main className="min-h-screen bg-gray-900 text-white">
      <DataParticles />
      <Navbar adminState={adminState} setAdminState={setAdminState} />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-purple-500">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
            <h1 className="text-3xl font-bold">About DataTech Events</h1>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {/* Terminal-style header */}
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs text-gray-500">about.md</span>
              </div>
              <p>
                <span className="text-purple-400"># DataTech Events Platform</span>
              </p>
              <p>
                <span className="text-gray-400">A cutting-edge platform for data science and technology events.</span>
              </p>
              <p>
                <span className="text-purple-400">## Version 1.0.0</span>
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-300">
                DataTech Events is dedicated to connecting data scientists, engineers, and technology enthusiasts with
                cutting-edge events in their field. Our platform showcases conferences, workshops, hackathons, and
                meetups focused on data science, machine learning, artificial intelligence, and related technologies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                Platform Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-900 p-4 rounded-lg border border-purple-500">
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">For Event Attendees</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">→</span>
                      <span>Discover relevant tech events with detailed information</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">→</span>
                      <span>Register directly through integrated Google Forms</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">→</span>
                      <span>Filter events by technology, category, or date</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">→</span>
                      <span>View speaker profiles and technical focus areas</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-900 p-4 rounded-lg border border-pink-500">
                  <h3 className="text-lg font-semibold text-pink-400 mb-2">For Event Organizers</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">→</span>
                      <span>Secure admin access to manage event listings</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">→</span>
                      <span>Comprehensive event detail customization</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">→</span>
                      <span>Highlight speakers and technologies</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-pink-400 mr-2">→</span>
                      <span>Connect registration to your Google Forms</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                Technical Stack
              </h2>
              <div className="bg-gray-900 p-4 rounded-lg font-mono text-sm">
                <p>
                  <span className="text-green-400">Frontend:</span>{" "}
                  <span className="text-gray-300">Next.js, React, TypeScript, Tailwind CSS</span>
                </p>
                <p>
                  <span className="text-green-400">State Management:</span>{" "}
                  <span className="text-gray-300">React Hooks, Context API</span>
                </p>
                <p>
                  <span className="text-green-400">Data Storage:</span>{" "}
                  <span className="text-gray-300">LocalStorage, JSON</span>
                </p>
                <p>
                  <span className="text-green-400">Animations:</span>{" "}
                  <span className="text-gray-300">Canvas API, CSS Transitions</span>
                </p>
                <p>
                  <span className="text-green-400">Integration:</span>{" "}
                  <span className="text-gray-300">Google Forms API</span>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
                Contact Us
              </h2>
              <div className="bg-gray-900 p-4 rounded-lg">
                <p className="text-gray-300 mb-4">
                  Have questions or suggestions? We'd love to hear from you! Reach out to us using the information
                  below:
                </p>
                <div className="space-y-2 font-mono">
                  <p className="text-gray-300">
                    <span className="text-purple-400">Email:</span> info@datatechevents.com
                  </p>
                  <p className="text-gray-300">
                    <span className="text-purple-400">Phone:</span> (555) 123-4567
                  </p>
                  <p className="text-gray-300">
                    <span className="text-purple-400">GitHub:</span> github.com/datatechevents
                  </p>
                </div>
              </div>
            </section>

            <div className="pt-4 border-t border-gray-700 flex justify-center">
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-md hover:opacity-90 transition-colors"
              >
                &lt; Back to Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

