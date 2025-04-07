// pages/index.tsx (or wherever you show events)
import { useEffect, useState } from "react"
import eventsData from "@/data/events.json" // or wherever your JSON is

export default function HomePage() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    // If events are static, this is fine
    setEvents(eventsData)
  }, [])

  return (
    <div>
      {events.map((event, i) => (
        <TechEventCard key={i} event={event} variant={i} ... />
      ))}
    </div>
  )
}
