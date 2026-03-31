"use client"

import type React from "react"

import { useState } from "react"
import type { AdminState } from "@/utils/types"

interface AdminLoginProps {
  adminState: AdminState
  setAdminState: (state: AdminState) => void
}

export default function AdminLogin({ adminState, setAdminState }: AdminLoginProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple password check - in a real app, you'd use a more secure method
    if (password === adminState.password) {
      setAdminState({ ...adminState, isAdmin: true })
      setError("")
    } else {
      setError("Incorrect password. Please try again.")
    }
  }

  const handleLogout = () => {
    setAdminState({ ...adminState, isAdmin: false })
  }

  if (adminState.isAdmin) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center">
          <p className="text-green-600 font-medium">✓ Admin mode active - You can edit events</p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Admin Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter admin password"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Login as Admin
        </button>
      </form>
    </div>
  )
}

