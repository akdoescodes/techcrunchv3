'use client';
import React, { useState } from 'react';

// Animations
import Techcrunch3D from '@/components/animations/Techcrunch3D';
import PowerWiresAnimation from '@/components/animations/PowerWiresAnimation';
import GradientWaves from '@/components/animations/GradientWaves';
import TwistedWireTerminal from '@/components/animations/TwistedWireTerminal';

// Event Card Component
import TechEventCard from '@/components/events/TechEventCard';

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);

  const staticEvents = [
    {
      title: 'Hackathon 2025',
      description: 'Build innovative tech projects in 24 hours!',
      date: '2025-05-12',
      time: '10:00 AM',
      location: 'Main Auditorium',
      type: 'Offline',
      category: 'Coding',
      entryFee: 'Free',
      contact: 'tech@college.com',
      registerLink: 'https://forms.gle/hackathon2025'
    },
    {
      title: 'AI Workshop',
      description: 'Learn AI with hands-on TensorFlow projects.',
      date: '2025-06-02',
      time: '2:00 PM',
      location: 'Lab 204',
      type: 'Offline',
      category: 'Workshop',
      entryFee: '₹50',
      contact: 'ai@college.com',
      registerLink: 'https://forms.gle/aiworkshop'
    },
    {
      title: 'Startup Pitch Fest',
      description: 'Pitch your startup idea and win funding!',
      date: '2025-05-25',
      time: '11:00 AM',
      location: 'Seminar Hall',
      type: 'Offline',
      category: 'Business',
      entryFee: 'Free',
      contact: 'startup@college.com',
      registerLink: 'https://forms.gle/startupfest'
    }
  ];

  const handleLogin = () => {
    const input = prompt("Enter admin password:");
    if (input === "ADMIN@123") {
      setIsAdmin(true);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#0c0c1e] to-[#1b0028] text-white overflow-x-hidden relative">

      {/* Hero & Animations */}
      <section className="relative z-10 h-screen w-full">
        <Techcrunch3D />
        <PowerWiresAnimation />
        <GradientWaves />
        <TwistedWireTerminal />
      </section>

      {/* Static Event Cards */}
      <section className="z-20 py-12 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {staticEvents.map((event, index) => (
          <TechEventCard key={index} event={event} isAdmin={isAdmin} />
        ))}
      </section>

      {/* Admin Login */}
      {!isAdmin && (
        <button
          onClick={handleLogin}
          className="fixed bottom-6 right-6 px-4 py-2 bg-purple-700 hover:bg-purple-800 rounded-lg shadow-lg z-30"
        >
          Admin Login
        </button>
      )}
    </main>
  );
}
