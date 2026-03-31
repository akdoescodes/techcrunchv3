"use client"

import type React from "react"

import type { EventInfo } from "@/utils/types"
import { useState } from "react"

interface TechEditFormProps {
  event: EventInfo
  onSave: (event: EventInfo) => void
  onCancel: () => void
}

export default function TechEditForm({ event, onSave, onCancel }: TechEditFormProps) {
  const [formData, setFormData] = useState<EventInfo>(event)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: "speakers" | "technologies") => {
    const values = e.target.value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
    setFormData((prev) => ({ ...prev, [field]: values }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 p-6 rounded-xl shadow-2xl border border-purple-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Edit Event</span>
        </h2>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">📅 Date</label>
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">🕒 Time</label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">📍 Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">👥 Type</label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">🎯 Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">💰 Entry Fee</label>
              <input
                type="text"
                name="entryFee"
                value={formData.entryFee}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">👤 Organizer</label>
              <input
                type="text"
                name="organizer"
                value={formData.organizer || ""}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">👥 Capacity</label>
              <input
                type="text"
                name="capacity"
                value={formData.capacity || ""}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">👥 Speakers (comma separated)</label>
              <input
                type="text"
                value={formData.speakers?.join(", ") || ""}
                onChange={(e) => handleArrayChange(e, "speakers")}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="John Doe, Jane Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">💻 Technologies (comma separated)</label>
              <input
                type="text"
                value={formData.technologies?.join(", ") || ""}
                onChange={(e) => handleArrayChange(e, "technologies")}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Python, Data Science, ML"
              />
            </div>
          </div>
        </div>

        {/* Full width fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">📝 Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">ℹ️ Additional Information</label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo || ""}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">📢 Contact Info</label>
            <input
              type="text"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Registration Link (Google Form)</label>
            <input
              type="text"
              name="registrationLink"
              value={formData.registrationLink}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-md hover:opacity-90 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

