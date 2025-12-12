'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { insertRushEvent, deleteRushEvent, type RushEventInput } from '@/app/admin/actions'
import RushEvent from './RushEvent'

interface RushEventData {
  id: string
  title: string
  datetime: string
  location: string
  description: string | null
  button_label: string | null
  button_url: string | null
  order_index: number
}

export default function RushScheduleManager() {
  const [rushEvents, setRushEvents] = useState<RushEventData[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<RushEventInput>({
    title: '',
    datetime: '',
    location: '',
    description: '',
    button_label: '',
    button_url: '',
    order_index: 0,
  })
  const [startDateTime, setStartDateTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const supabase = createClient()

  // Convert datetime-local format to readable format with time range
  // Matches format like "Wednesday, August 27, 4:30-6:00 PM"
  // startDateTime: datetime-local format (YYYY-MM-DDTHH:mm)
  // endTime: time format (HH:mm)
  const formatDateTimeRange = (startDateTime: string, endTime: string): string => {
    if (!startDateTime) return ''
    
    try {
      const startDate = new Date(startDateTime)
      const weekday = startDate.toLocaleDateString('en-US', { weekday: 'long' })
      const month = startDate.toLocaleDateString('en-US', { month: 'long' })
      const day = startDate.getDate()
      
      // Format start time
      const startHour = startDate.getHours()
      const startMinute = startDate.getMinutes()
      const startAmpm = startHour >= 12 ? 'PM' : 'AM'
      const startDisplayHour = startHour % 12 || 12
      const startDisplayMinute = startMinute.toString().padStart(2, '0')
      const startTimeStr = `${startDisplayHour}:${startDisplayMinute}`
      
      // Format end time if provided (endTime is in HH:mm format)
      if (endTime) {
        const [endHourStr, endMinuteStr] = endTime.split(':')
        const endHour = parseInt(endHourStr, 10)
        const endMinute = parseInt(endMinuteStr, 10)
        const endAmpm = endHour >= 12 ? 'PM' : 'AM'
        const endDisplayHour = endHour % 12 || 12
        const endDisplayMinute = endMinute.toString().padStart(2, '0')
        const endTimeStr = `${endDisplayHour}:${endDisplayMinute}`
        
        // If both times are in the same AM/PM period, only show it once
        if (startAmpm === endAmpm) {
          return `${weekday}, ${month} ${day}, ${startTimeStr}-${endTimeStr} ${startAmpm}`
        } else {
          // Different periods, show both
          return `${weekday}, ${month} ${day}, ${startTimeStr} ${startAmpm}-${endTimeStr} ${endAmpm}`
        }
      } else {
        return `${weekday}, ${month} ${day}, ${startTimeStr} ${startAmpm}`
      }
    } catch (e) {
      // If parsing fails, return as-is
      return startDateTime
    }
  }

  // Fetch rush events from Supabase
  useEffect(() => {
    async function fetchRushEvents() {
      try {
        const { data, error } = await supabase
          .from('rush_events')
          .select('*')
          .order('order_index', { ascending: true })

        if (error) {
          console.error('Error fetching rush events:', error)
          setError('Failed to load rush events')
        } else {
          setRushEvents(data || [])
        }
      } catch (err) {
        console.error('Error:', err)
        setError('Failed to load rush events')
      } finally {
        setLoading(false)
      }
    }

    fetchRushEvents()
  }, [supabase])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Convert datetime-local to readable format with time range
    const formattedDateTime = formatDateTimeRange(startDateTime, endTime)

    // Convert empty strings to null for optional fields
    const eventData: RushEventInput = {
      title: formData.title.trim(),
      datetime: formattedDateTime,
      location: formData.location.trim(),
      description: formData.description?.trim() || null,
      button_label: formData.button_label?.trim() || null,
      button_url: formData.button_url?.trim() || null,
      order_index: Number(formData.order_index) || 0,
    }

    const result = await insertRushEvent(eventData)

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      // Reset form and close modal
      setFormData({
        title: '',
        datetime: '',
        location: '',
        description: '',
        button_label: '',
        button_url: '',
        order_index: rushEvents.length, // Set to next index
      })
      setStartDateTime('')
      setEndTime('')
      setIsModalOpen(false)
      setIsSubmitting(false)

      // Refresh the events list
      const { data, error } = await supabase
        .from('rush_events')
        .select('*')
        .order('order_index', { ascending: true })

      if (!error && data) {
        setRushEvents(data)
      }
    }
  }

  const handleOpenModal = () => {
    // Set order_index to the next available index
    setFormData((prev) => ({
      ...prev,
      order_index: rushEvents.length,
    }))
    setStartDateTime('')
    setEndTime('')
    setIsModalOpen(true)
    setError(null)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setError(null)
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this rush event?')) {
      return
    }

    setIsDeleting(eventId)
    setError(null)

    const result = await deleteRushEvent(eventId)

    if (result.error) {
      setError(result.error)
      setIsDeleting(null)
    } else {
      // Refresh the events list
      const { data, error } = await supabase
        .from('rush_events')
        .select('*')
        .order('order_index', { ascending: true })

      if (!error && data) {
        setRushEvents(data)
      }
      setIsDeleting(null)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold font-inter">Rush Schedule</h2>
        <button
          onClick={handleOpenModal}
          className="px-4 py-2 bg-[#315CA9] text-white rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer"
        >
          Add Rush Event
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600 text-sm">Loading rush events...</p>
      ) : error && !isModalOpen ? (
        <p className="text-red-600 text-sm">{error}</p>
      ) : rushEvents.length === 0 ? (
        <p className="text-gray-600 text-sm">No rush events scheduled yet.</p>
      ) : (
        <div className="space-y-4">
          {rushEvents.map((event) => (
            <div
              key={event.id}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative"
            >
              <button
                onClick={() => handleDelete(event.id)}
                disabled={isDeleting === event.id}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete event"
              >
                {isDeleting === event.id ? (
                  <span className="text-sm">Deleting...</span>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
              <RushEvent
                title={event.title}
                datetime={event.datetime}
                location={event.location}
                description={event.description}
                buttonLabel={event.button_label}
                buttonUrl={event.button_url}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold font-inter">Add Rush Event</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#315CA9]"
                />
              </div>

              <div>
                <label
                  htmlFor="startDateTime"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date & Start Time <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="datetime-local"
                    id="startDateTime"
                    name="startDateTime"
                    value={startDateTime}
                    onChange={(e) => setStartDateTime(e.target.value)}
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#315CA9]"
                  />
                  {startDateTime && (
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#315CA9]"
                      placeholder="End time"
                    />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Select date and start time. Optionally add end time for time ranges.
                </p>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#315CA9]"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#315CA9]"
                />
              </div>

              <div>
                <label
                  htmlFor="button_label"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Button Label
                </label>
                <input
                  type="text"
                  id="button_label"
                  name="button_label"
                  value={formData.button_label || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., Join Zoom Meeting"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#315CA9]"
                />
              </div>

              <div>
                <label
                  htmlFor="button_url"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Button URL
                </label>
                <input
                  type="url"
                  id="button_url"
                  name="button_url"
                  value={formData.button_url || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#315CA9]"
                />
              </div>

              <div>
                <label
                  htmlFor="order_index"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Order Index
                </label>
                <input
                  type="number"
                  id="order_index"
                  name="order_index"
                  value={formData.order_index}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#315CA9]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers appear first. Default: {rushEvents.length}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#315CA9] text-white rounded-md font-semibold hover:bg-[#234c8b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Adding...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

