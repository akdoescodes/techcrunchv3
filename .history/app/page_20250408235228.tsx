"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import TechEventCard from "@/components/tech-event-card";
import TechEditForm from "@/components/tech-edit-form";
import TerminalWithTechcrunch from "@/components/TerminalWithTechcrunch";
import type { EventInfo, AdminState } from "@/utils/types";
import "@/styles/animated-grid.css";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function Home() {
  const [events, setEvents] = useState<EventInfo[]>([
    // ... (keep your existing events data)
  ]);
  
  // ... (keep all your existing state and handlers)

  return (
    <main className="relative min-h-screen text-black overflow-hidden">
      <div className="absolute inset-0 bg-white z-0" />
      <div className="animated-grid z-10" />
      <div className="relative z-20">
        <Navbar adminState={adminState} setAdminState={setAdminState} />

        {/* Terminal with minimal top margin */}
        <div className="w-full flex justify-center px-1 mt-1"> {/* Changed from mt-[-2rem] to mt-1 */}
          <TerminalWithTechcrunch />
        </div>

        {/* Main Content with tight spacing */}
        <div className="container mx-auto px-4 pt-2 pb-12"> {/* Changed from pt-4 to pt-2 */}
          <div ref={ref}>
            {editingEvent ? (
              <TechEditForm
                event={editingEvent}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8" {/* Reduced mobile gap */}
              >
                {events.map((event, index) => (
                  <TechEventCard
                    key={event.id}
                    event={event}
                    variant={index}
                    onEdit={handleEdit}
                    isAdmin={adminState.isAdmin}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer (unchanged) */}
        <footer className="bg-white border-t border-gray-300 py-6 sm:py-8 relative z-20">
          {/* ... (keep existing footer content) */}
        </footer>
      </div>
    </main>
  );
}