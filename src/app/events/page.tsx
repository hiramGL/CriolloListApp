'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/clients';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function CreateEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    start_time: '',
    end_time: '',
  });

  const [loading, setLoading] = useState(false); // Loading state for form submission
  const [error, setError] = useState<string | null>(null); // Error state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [events, setEvents] = useState<
    { id: number; title: string; description: string; event_date: string; start_time: string; end_time: string }[]
  >([]); // All events fetched from the database
  const [filteredEvents, setFilteredEvents] = useState<
    { id: number; title: string; description: string; event_date: string; start_time: string; end_time: string }[]
  >([]); // Events filtered by the selected month
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1); // Current month by default

  // Fetch all events from the Supabase database
  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: true });
      if (error) {
        console.error('Error fetching events:', error);
        setError('Failed to fetch events.');
        return;
      }
      setEvents(data || []);
    } catch (err) {
      console.error('Unexpected error fetching events:', err);
      setError('An unexpected error occurred.');
    }
  };

  // Filter events by the selected month
  const filterEventsByMonth = (month: number) => {
    const filtered = events.filter((event) => {
      const eventDate = new Date(event.event_date);
      return eventDate.getMonth() + 1 === month; // Months are 0-indexed in JavaScript
    });
    setFilteredEvents(filtered);
  };

  // Handle month selection
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = parseInt(e.target.value, 10);
    setSelectedMonth(month);
    filterEventsByMonth(month);
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Get the authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Prepare the event data
    const eventData = {
      ...formData,
      user_id: user?.id || null, // Associate the event with the authenticated user
    };

    console.log('Event data:', eventData); // Debugging

    // Validate the data
    if (!eventData.title || !eventData.description || !eventData.event_date || !eventData.start_time || !eventData.end_time) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      // Insert the event into the 'events' table
      const { data, error } = await supabase.from('events').insert([eventData]);
      if (error) {
        console.error('Error creating event:', error);
        setError('Failed to create event. Please try again.');
        return;
      }
      console.log('Event created successfully:', data);
      alert('Event created successfully!');
      setFormData({
        title: '',
        description: '',
        event_date: '',
        start_time: '',
        end_time: '',
      }); // Reset the form
      setIsModalOpen(false); // Close the modal
      fetchEvents(); // Refresh the events list
    } catch (err) {
      console.error('Unexpected error creating event:', err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events whenever the selected month or events list changes
  useEffect(() => {
    filterEventsByMonth(selectedMonth);
  }, [selectedMonth, events]);

  return (
    <div className="container mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-green-300">Events</h1>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Create Event
      </Button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Create an Event</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded p-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded p-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="event_date" className="block font-medium text-gray-700">
                  Event Date
                </label>
                <input
                  type="date"
                  id="event_date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded p-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="start_time" className="block font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  type="time"
                  id="start_time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded p-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="end_time" className="block font-medium text-gray-700">
                  End Time
                </label>
                <input
                  type="time"
                  id="end_time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  className="w-full border-gray-300 rounded p-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Event'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Month Filter */}
      <div className="mt-8">
        <label htmlFor="month" className="block font-medium mb-2 text-white">
          Filter by Month
        </label>
        <select
          id="month"
          value={selectedMonth}
          onChange={handleMonthChange}
          className="border-gray-300 rounded p-2 focus:ring-green-500 focus:border-green-500 bg-gray-800 text-white"
          style={{ scrollBehavior: 'smooth' }}
        >
          {Array.from({ length: 12 }, (_, i) => (
        <option key={i + 1} value={i + 1}>
          {new Date(0, i).toLocaleString('default', { month: 'long' })}
        </option>
          ))}
        </select>
      </div>

      {/* Events List */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-green-300">
          Events for {new Date(0, selectedMonth - 1).toLocaleString('default', { month: 'long' })}
        </h2>
        {filteredEvents.length > 0 ? (
          <ul className="space-y-4">
            {filteredEvents.map((event) => (
              <li
                key={event.id}
                className="p-4 border rounded-lg bg-gray-800 text-gray-100 shadow-sm hover:bg-green-100 hover:text-green-800 transition-colors"
              >
                <h3 className="text-lg font-bold">{event.title}</h3>
                <p className="text-sm">Date: {event.event_date}</p>
                <p className="text-sm">Start Time: {event.start_time}</p>
                <p className="text-sm">End Time: {event.end_time}</p>
                <p className="text-sm">{event.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white">No events found for the selected month.</p>
        )}
      </section>

      {/* Back to Home Button */}
      <Button
        variant="outline"
        className="mt-4 bg-gray-300 text-gray-700 hover:bg-gray-400"
        onClick={() => router.push('/')}
      >
        Back to Home
      </Button>
    </div>
  );
}