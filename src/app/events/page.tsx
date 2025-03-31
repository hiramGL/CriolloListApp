"use client"

import { useState } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css" // Import default styles
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function EventsPage() {
    const router = useRouter()
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [events, setEvents] = useState([
        { id: 1, date: "2025-04-01", title: "Design Workshop" },
        { id: 2, date: "2025-04-05", title: "Tutoring Session" },
        { id: 3, date: "2025-04-10", title: "Finance Seminar" },
    ])
    const [filteredEvents, setFilteredEvents] = useState<{ id: number; date: string; title: string }[]>([])

    // Filter events by the selected date
    const filterEventsByDate = (date: Date) => {
        const formattedDate = date.toISOString().split("T")[0]
        const filtered = events.filter((event) => event.date === formattedDate)
        setFilteredEvents(filtered)
    }

    // Handle date selection
    const handleDateChange = (value: Date | Date[] | null, event?: React.MouseEvent<HTMLButtonElement>) => {
        const selected = value as Date; // Explicitly cast value to Date
        if (selected instanceof Date) {
            setSelectedDate(selected)
            filterEventsByDate(selected)
        }
    }

    return (
        <main className="min-h-screen bg-[#f9fafb] text-gray-800 p-6">
            <h1 className="text-3xl font-bold text-green-900 mb-6">Events Calendar</h1>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
                <Button
                    className="bg-green-900 text-white hover:bg-green-800"
                    onClick={() => router.push("/")}
                >
                    Back to Home
                </Button>
                <Button
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                    onClick={() => filterEventsByDate(selectedDate)}
                >
                    Filter by Selected Date
                </Button>
                <Button
                    className="bg-green-700 text-white hover:bg-green-600"
                    onClick={() => alert("Create Event functionality coming soon!")}
                >
                    Create Event
                </Button>
            </div>

            <div className="mb-6">
                <Calendar
                    //onChange={handleDateChange}
                    value={selectedDate}
                    className="border rounded-lg shadow-md"
                />
            </div>

            {/* Events List */}
            <section>
                <h2 className="text-xl font-semibold mb-4 text-green-900">Events on {selectedDate.toDateString()}</h2>
                {filteredEvents.length > 0 ? (
                    <ul className="space-y-4">
                        {filteredEvents.map((event) => (
                            <li
                                key={event.id}
                                className="p-4 border rounded-lg bg-white shadow-sm hover:bg-green-100 transition-colors"
                            >
                                <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
                                <p className="text-sm text-gray-600">Date: {event.date}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">No events found for the selected date.</p>
                )}
            </section>
        </main>
    )
}