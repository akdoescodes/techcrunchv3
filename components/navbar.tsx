"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import type { AdminState } from "@/utils/types"

interface NavbarProps {
  adminState: AdminState
  setAdminState: (state: AdminState) => void
}

export default function Navbar({ adminState, setAdminState }: NavbarProps) {
  const [showLogin, setShowLogin] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (password === adminState.password) {
      setAdminState({ ...adminState, isAdmin: true })
      setError("")
      setShowLogin(false)
    } else {
      setError("Incorrect password. Please try again.")
    }
  }

  const handleLogout = () => {
    setAdminState({ ...adminState, isAdmin: false })
  }

  return (
    <nav className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white p-4 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white flex items-center">
          <span className="mr-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            DataTech
          </span>
          <span className="text-sm font-mono bg-purple-700 px-2 py-1 rounded">Events</span>
        </Link>

        <div className="flex items-center space-x-6">
          <Link href="/" className="hover:text-purple-300 transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-purple-300 transition-colors">
            About
          </Link>

          {adminState.isAdmin ? (
            <div className="flex items-center">
              <span className="text-green-300 mr-2">Admin</span>
              <button
                onClick={handleLogout}
                className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowLogin(!showLogin)}
                className="bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-sm transition-colors"
              >
                Admin Login
              </button>

              {showLogin && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-xl z-50 overflow-hidden">
                  <div className="p-4">
                    <h3 className="text-gray-800 font-medium mb-2">Admin Login</h3>
                    <form onSubmit={handleLogin}>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full p-2 border border-gray-300 rounded mb-2 text-gray-800"
                      />
                      {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
                      <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition-colors"
                      >
                        Login
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

