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
              <h1 className="text-3xl font-bold">About DataTron Events</h1>
            </div>

            <div className="p-6 md:p-10 space-y-10">
              {/* Terminal style card */}
              <div className="bg-white bg-opacity-20 border border-purple-200 backdrop-blur-lg p-4 font-mono rounded-xl text-sm shadow-inner">
                <div className="flex items-center mb-2 space-x-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-xs text-gray-600">Team.md</span>
                </div>
                
                {/* Image container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                  {/* Team Member 1 */}
                  <div className="border-2 border-purple-300 rounded-lg p-2 bg-white bg-opacity-50">
                    {/* Replace with your image */}
                    <img 
                      src="@/assets/me@0.33x.png" 
                      alt="Team member" 
                      className="w-full h-auto rounded-md"
                    />
                    
                    {/* Member Details */}
                    <div className="mt-3 p-2 text-center">
                      <h3 className="font-bold text-purple-700">ARJUN KALE</h3>
                      <p className="text-sm text-gray-700">FRONTEND DEVELOPER </p>
                      <p className="text-xs text-gray-600">ANIMATION</p>
                    </div>
                    
                    {/* Social Links */}
                    <div className="flex justify-center space-x-4 mt-2">
                      <a href="#" className="text-purple-600 hover:text-purple-800">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="#" className="text-blue-600 hover:text-blue-800">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Team Member 2 */}
                  <div className="border-2 border-purple-300 rounded-lg p-2 bg-white bg-opacity-50">
                    {/* Replace with your image */}
                    <img 
                      src="@/assets/WhatsApp Image 2025-04-01 at 00.49.53_157dad68-modified.png" 
                      alt="Team member" 
                      className="w-full h-auto rounded-md"
                    />
                    
                    {/* Member Details */}
                    <div className="mt-3 p-2 text-center">
                      <h3 className="font-bold text-purple-700">BRIJESH PARVADIYA</h3>
                      <p className="text-sm text-gray-700">Department/Role</p>
                      <p className="text-xs text-gray-600">Specialization/Responsibility</p>
                    </div>
                    
                    {/* Social Links */}
                    <div className="flex justify-center space-x-4 mt-2">
                      <a href="#" className="text-purple-600 hover:text-purple-800">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="#" className="text-blue-600 hover:text-blue-800">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rest of your existing content... */}
              <section>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
                  Our Mission
                </h2>
                <p className="text-gray-800 leading-relaxed">
                  DataTron Events is dedicated to connecting data scientists, engineers, and technology enthusiasts
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
                  Event Organizers
                </h2>
                <div className="bg-white bg-opacity-30 border border-purple-200 rounded-xl p-4 shadow-inner">
                  <p className="text-gray-800 mb-4">Have questions or suggestions? We'd love to hear from you!</p>
                  <div className="space-y-1 font-mono">
                    <p><span className="text-purple-500">Name: </span>Vansh Kodarlikar</p>
                    <p><span className="text-purple-500">Email: </span>vanshkodarlikar@gmail.com</p>
                    <p><span className="text-purple-500">Phone: </span>7350790715</p>
                  </div>
                </div>

                <div className="bg-white bg-opacity-30 border border-purple-200 rounded-xl p-4 shadow-inner mt-5">
                  <p className="text-gray-800 mb-4">Have questions or suggestions? We'd love to hear from you!</p>
                  <div className="space-y-1 font-mono">
                    <p><span className="text-purple-500">Name: </span>Aryan Gunjewar</p>
                    <p><span className="text-purple-500">Email: </span>aryangunjewar0729@gmail.com</p>
                    <p><span className="text-purple-500">Phone: </span>7058117814</p>
                  </div>
                </div>

                <div className="bg-white bg-opacity-30 border border-purple-200 rounded-xl p-4 shadow-inner mt-5">
                  <p className="text-gray-800 mb-4">Have questions or suggestions? We'd love to hear from you!</p>
                  <div className="space-y-1 font-mono">
                    <p><span className="text-purple-500">Name: </span>Himanshu Vaidya</p>
                    <p><span className="text-purple-500">Email: </span>himanshuvaidya566@gmail.com</p>
                    <p><span className="text-purple-500">Phone: </span>9322096802</p>
                  </div>
                </div>

                <div className="bg-white bg-opacity-30 border border-purple-200 rounded-xl p-4 shadow-inner mt-5">
                  <p className="text-gray-800 mb-4">Have questions or suggestions? We'd love to hear from you!</p>
                  <div className="space-y-1 font-mono">
                    <p><span className="text-purple-500">Name: </span>Sneha Malewar</p>
                    <p><span className="text-purple-500">Email: </span>sneha.malewar19@gmail.com</p>
                    <p><span className="text-purple-500">Phone: </span>7038342842</p>
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