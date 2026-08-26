'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createPortal, flushSync } from 'react-dom'
import { insertRushEvent, deleteRushEvent, updateRushEvent, updateRushEventOrder, listRushEvents, type RushEventInput } from '@/app/admin/actions'
import RushEvent from './RushEvent'
import {
  adminFieldClass,
  adminFieldEditStyle,
  adminHeadingClass,
  adminIconBtnClass,
  adminIconDangerBtnClass,
  adminInnerCardClass,
  adminInnerCardStyle,
  adminLabelClass,
  adminMutedClass,
  adminPrimaryBtnClass,
  adminSecondaryBtnClass,
} from '@/components/admin/admin-ui'
import type { ClientRushEvent } from '@/lib/rush-events'

export default function RushScheduleManager({
  cycleId,
  initialEvents,
}: {
  cycleId: string
  initialEvents: ClientRushEvent[]
}) {
  const [rushEvents, setRushEvents] = useState<ClientRushEvent[]>(initialEvents)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const draggedEventIdRef = useRef<string | null>(null)
  const rushEventsRef = useRef<ClientRushEvent[]>([])
  const originalEventsRef = useRef<ClientRushEvent[]>([])
  const cardElsRef = useRef<Map<string, HTMLElement>>(new Map())
  const [formData, setFormData] = useState<RushEventInput>({
    title: '',
    datetime: '',
    location: '',
    description: '',
    button_label: '',
    button_url: '',
    order_index: 0,
  })
  const [eventDate, setEventDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const MODAL_ANIMATION_MS = 280

  useEffect(() => {
    rushEventsRef.current = rushEvents
  }, [rushEvents])

  useEffect(() => {
    if (!isModalOpen) return

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsModalVisible(true))
    })

    return () => cancelAnimationFrame(frame)
  }, [isModalOpen])

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  // Parse formatted datetime string back to date + time fields
  // Input: "Wednesday, August 27, 4:30-6:00 PM" or "Wednesday, August 27, 4:30 PM"
  const parseDateTimeString = (
    dateTimeStr: string
  ): { date: string; startTime: string; endTime: string } => {
    if (!dateTimeStr) return { date: '', startTime: '', endTime: '' }

    try {
      const match = dateTimeStr.match(/(\w+),\s+(\w+)\s+(\d+),\s+(\d+):(\d+)(?:\s*-\s*(\d+):(\d+))?\s*(AM|PM)/i)

      if (!match) {
        const parsed = new Date(dateTimeStr)
        if (!isNaN(parsed.getTime())) {
          const year = parsed.getFullYear()
          const month = String(parsed.getMonth() + 1).padStart(2, '0')
          const day = String(parsed.getDate()).padStart(2, '0')
          const hours = String(parsed.getHours()).padStart(2, '0')
          const minutes = String(parsed.getMinutes()).padStart(2, '0')
          return { date: `${year}-${month}-${day}`, startTime: `${hours}:${minutes}`, endTime: '' }
        }
        return { date: '', startTime: '', endTime: '' }
      }

      const [, , monthName, day, startHour, startMin, endHour, endMin, ampm] = match

      const months: { [key: string]: string } = {
        january: '01', february: '02', march: '03', april: '04',
        may: '05', june: '06', july: '07', august: '08',
        september: '09', october: '10', november: '11', december: '12'
      }
      const month = months[monthName.toLowerCase()] || '01'
      const year = new Date().getFullYear()

      let startHour24 = parseInt(startHour, 10)
      if (ampm.toUpperCase() === 'PM' && startHour24 !== 12) {
        startHour24 += 12
      } else if (ampm.toUpperCase() === 'AM' && startHour24 === 12) {
        startHour24 = 0
      }

      let endTimeStr = ''
      if (endHour && endMin) {
        let endHour24 = parseInt(endHour, 10)
        if (ampm.toUpperCase() === 'PM' && endHour24 !== 12) {
          endHour24 += 12
        } else if (ampm.toUpperCase() === 'AM' && endHour24 === 12) {
          endHour24 = 0
        }
        endTimeStr = `${String(endHour24).padStart(2, '0')}:${endMin.padStart(2, '0')}`
      }

      return {
        date: `${year}-${month}-${day.padStart(2, '0')}`,
        startTime: `${String(startHour24).padStart(2, '0')}:${startMin.padStart(2, '0')}`,
        endTime: endTimeStr,
      }
    } catch (e) {
      return { date: '', startTime: '', endTime: '' }
    }
  }

  // Convert date + time fields to readable format with time range
  // Matches format like "Wednesday, August 27, 4:30-6:00 PM"
  const formatDateTimeRange = (date: string, startTimeValue: string, endTimeValue: string): string => {
    if (!date || !startTimeValue) return ''

    try {
      const startDate = new Date(`${date}T${startTimeValue}`)
      const weekday = startDate.toLocaleDateString('en-US', { weekday: 'long' })
      const month = startDate.toLocaleDateString('en-US', { month: 'long' })
      const day = startDate.getDate()

      const startHour = startDate.getHours()
      const startMinute = startDate.getMinutes()
      const startAmpm = startHour >= 12 ? 'PM' : 'AM'
      const startDisplayHour = startHour % 12 || 12
      const startDisplayMinute = startMinute.toString().padStart(2, '0')
      const startTimeStr = `${startDisplayHour}:${startDisplayMinute}`

      if (endTimeValue) {
        const [endHourStr, endMinuteStr] = endTimeValue.split(':')
        const endHour = parseInt(endHourStr, 10)
        const endMinute = parseInt(endMinuteStr, 10)
        const endAmpm = endHour >= 12 ? 'PM' : 'AM'
        const endDisplayHour = endHour % 12 || 12
        const endDisplayMinute = endMinute.toString().padStart(2, '0')
        const endTimeStr = `${endDisplayHour}:${endDisplayMinute}`

        if (startAmpm === endAmpm) {
          return `${weekday}, ${month} ${day}, ${startTimeStr}-${endTimeStr} ${startAmpm}`
        }
        return `${weekday}, ${month} ${day}, ${startTimeStr} ${startAmpm}-${endTimeStr} ${endAmpm}`
      }

      return `${weekday}, ${month} ${day}, ${startTimeStr} ${startAmpm}`
    } catch (e) {
      return date
    }
  }

  const refreshRushEvents = async () => {
    const { data, error: loadError } = await listRushEvents(cycleId)
    if (loadError) {
      setError(loadError)
      return
    }
    setRushEvents(data || [])
  }

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

    const formattedDateTime = formatDateTimeRange(eventDate, startTime, endTime)

    // Convert empty strings to null for optional fields
    const eventData: RushEventInput = {
      title: formData.title.trim(),
      datetime: formattedDateTime,
      location: formData.location.trim(),
      description: formData.description?.trim() || null,
      button_label: formData.button_label?.trim() || null,
      button_url: formData.button_url?.trim() || null,
      order_index: isEditMode ? formData.order_index : rushEvents.length,
    }

    let result
    if (isEditMode && editingEventId) {
      result = await updateRushEvent(editingEventId, eventData)
    } else {
      result = await insertRushEvent(cycleId, eventData)
    }

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
    } else {
      setIsSubmitting(false)
      handleCloseModal()
      await refreshRushEvents()
    }
  }

  const showModal = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setError(null)
    setIsModalOpen(true)
    setIsModalVisible(false)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsModalVisible(true))
    })
  }

  const handleOpenModal = () => {
    setFormData({
      title: '',
      datetime: '',
      location: '',
      description: '',
      button_label: '',
      button_url: '',
      order_index: rushEvents.length,
    })
    setEventDate('')
    setStartTime('')
    setEndTime('')
    setIsEditMode(false)
    setEditingEventId(null)
    showModal()
  }

  const handleEditEvent = (event: ClientRushEvent) => {
    const parsed = parseDateTimeString(event.datetime)

    setFormData({
      title: event.title,
      datetime: event.datetime,
      location: event.location,
      description: event.description || '',
      button_label: event.button_label || '',
      button_url: event.button_url || '',
      order_index: event.order_index,
    })
    setEventDate(parsed.date)
    setStartTime(parsed.startTime)
    setEndTime(parsed.endTime)
    setIsEditMode(true)
    setEditingEventId(event.id)
    showModal()
  }

  const handleCloseModal = () => {
    if (!isModalOpen || closeTimeoutRef.current) return

    setIsModalVisible(false)
    closeTimeoutRef.current = setTimeout(() => {
      setIsModalOpen(false)
      setIsEditMode(false)
      setEditingEventId(null)
      setError(null)
      closeTimeoutRef.current = null
    }, MODAL_ANIMATION_MS)
  }

  const setCardRef = (id: string, el: HTMLElement | null) => {
    if (el) {
      cardElsRef.current.set(id, el)
    } else {
      cardElsRef.current.delete(id)
    }
  }

  const animateCardShift = (previousTops: Map<string, number>) => {
    cardElsRef.current.forEach((el, id) => {
      const previousTop = previousTops.get(id)
      if (previousTop == null) return

      const dy = previousTop - el.getBoundingClientRect().top
      if (Math.abs(dy) < 1) return

      el.style.transition = 'none'
      el.style.transform = `translateY(${dy}px)`
      void el.offsetHeight
      el.style.transition = 'transform 220ms cubic-bezier(0.2, 0, 0, 1)'
      el.style.transform = ''
    })
  }

  const reorderToIndex = (fromId: string, insertIndex: number): ClientRushEvent[] | null => {
    const prev = rushEventsRef.current
    const from = prev.findIndex((event) => event.id === fromId)
    if (from === -1 || insertIndex < 0 || insertIndex >= prev.length || from === insertIndex) {
      return null
    }

    const next = [...prev]
    const [moved] = next.splice(from, 1)
    next.splice(insertIndex, 0, moved)
    const ordered = next.map((event, index) => ({ ...event, order_index: index }))

    const previousTops = new Map<string, number>()
    cardElsRef.current.forEach((el, id) => {
      previousTops.set(id, el.getBoundingClientRect().top)
    })

    flushSync(() => {
      setRushEvents(ordered)
    })
    rushEventsRef.current = ordered
    animateCardShift(previousTops)
    return ordered
  }

  const persistEventOrder = async (events: ClientRushEvent[]) => {
    const orderUpdates = events.map((event, index) => ({
      id: event.id,
      order_index: index,
    }))

    const result = await updateRushEventOrder(orderUpdates)

    if (result.error) {
      setError(result.error)
      setRushEvents(originalEventsRef.current)
    }
  }

  const handleDragStart = (eventId: string, e: React.DragEvent) => {
    const card = cardElsRef.current.get(eventId)
    if (card) {
      const rect = card.getBoundingClientRect()
      e.dataTransfer.setDragImage(card, e.clientX - rect.left, e.clientY - rect.top)
    }

    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', eventId)
    draggedEventIdRef.current = eventId
    originalEventsRef.current = rushEventsRef.current
    setDraggedEventId(eventId)
  }

  const handleDragOver = (targetEventId: string, e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'

    const draggedId = draggedEventIdRef.current
    if (!draggedId || draggedId === targetEventId) return

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const insertAfter = e.clientY > rect.top + rect.height / 2
    const prev = rushEventsRef.current
    const from = prev.findIndex((event) => event.id === draggedId)
    const to = prev.findIndex((event) => event.id === targetEventId)
    if (from === -1 || to === -1) return

    let insertIndex = insertAfter ? to + 1 : to
    if (from < insertIndex) insertIndex -= 1
    reorderToIndex(draggedId, insertIndex)
  }

  const handleMoveClick = async (eventId: string, direction: -1 | 1) => {
    const from = rushEventsRef.current.findIndex((event) => event.id === eventId)
    if (from === -1) return

    originalEventsRef.current = rushEventsRef.current
    const ordered = reorderToIndex(eventId, from + direction)
    if (ordered) {
      await persistEventOrder(ordered)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDragEnd = async () => {
    cardElsRef.current.forEach((el) => {
      el.style.transition = ''
      el.style.transform = ''
    })

    const draggedId = draggedEventIdRef.current
    draggedEventIdRef.current = null
    setDraggedEventId(null)

    if (!draggedId) return

    const currentIds = rushEventsRef.current.map((event) => event.id).join(',')
    const originalIds = originalEventsRef.current.map((event) => event.id).join(',')
    if (currentIds === originalIds) return

    await persistEventOrder(rushEventsRef.current)
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
      await refreshRushEvents()
      setIsDeleting(null)
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className={`text-xl font-bold font-inter ${adminHeadingClass}`}>Rush Schedule</h2>
        <button type="button" onClick={handleOpenModal} className={adminPrimaryBtnClass}>
          Add Rush Event
        </button>
      </div>

      {error && !isModalOpen ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : rushEvents.length === 0 ? (
        <p className={`text-sm ${adminMutedClass}`}>No rush events scheduled yet.</p>
      ) : (
        <div className="space-y-3">
          {rushEvents.map((event, index) => {
            const isFirst = index === 0
            const isLast = index === rushEvents.length - 1

            return (
            <div
              key={event.id}
              ref={(el) => setCardRef(event.id, el)}
              className={`${adminInnerCardClass} items-start transition-opacity duration-200 ${
                draggedEventId === event.id ? 'opacity-0' : ''
              }`}
              style={{
                ...adminInnerCardStyle,
                boxShadow: draggedEventId === event.id ? 'none' : adminInnerCardStyle.boxShadow,
              }}
              onDragOver={(e) => handleDragOver(event.id, e)}
              onDrop={handleDrop}
            >
              <div className="shrink-0 self-center flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => handleMoveClick(event.id, -1)}
                  disabled={isFirst}
                  className={`flex h-8 w-9 items-center justify-center rounded-full transition-all duration-200 ${
                    isFirst
                      ? 'cursor-not-allowed text-slate-600'
                      : `${adminIconBtnClass} !h-8`
                  }`}
                  title={isFirst ? 'Already at top' : 'Move up'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 15l6-6 6 6" />
                  </svg>
                </button>
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(event.id, e)}
                  onDragEnd={handleDragEnd}
                  className="flex h-8 w-9 cursor-grab items-center justify-center rounded-full text-slate-400 transition-all duration-200 hover:scale-110 hover:bg-white/10 hover:text-white active:cursor-grabbing"
                  title="Drag to reorder"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <circle cx="7" cy="5" r="1.6" />
                    <circle cx="13" cy="5" r="1.6" />
                    <circle cx="7" cy="10" r="1.6" />
                    <circle cx="13" cy="10" r="1.6" />
                    <circle cx="7" cy="15" r="1.6" />
                    <circle cx="13" cy="15" r="1.6" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={() => handleMoveClick(event.id, 1)}
                  disabled={isLast}
                  className={`flex h-8 w-9 items-center justify-center rounded-full transition-all duration-200 ${
                    isLast
                      ? 'cursor-not-allowed text-slate-600'
                      : `${adminIconBtnClass} !h-8`
                  }`}
                  title={isLast ? 'Already at bottom' : 'Move down'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <RushEvent
                  title={event.title}
                  datetime={event.datetime}
                  location={event.location}
                  description={event.description}
                  buttonLabel={event.button_label}
                  buttonUrl={event.button_url}
                  compact
                  tone="dark"
                />
              </div>
              <div className="flex shrink-0 gap-0.5 -mt-1 -mr-1">
                <button
                  onClick={() => handleEditEvent(event)}
                  className={`${adminIconBtnClass} h-9 w-9`}
                  title="Edit event"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  disabled={isDeleting === event.id}
                  className={`${adminIconDangerBtnClass} h-9 w-9`}
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
              </div>
            </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen &&
        typeof window !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center"
            style={{ zIndex: 99999 }}
          >
            <div
              className={`absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isModalVisible ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={handleCloseModal}
            />
            <div
              className={`relative z-10 mx-4 max-h-[90vh] w-full min-w-0 max-w-2xl overflow-x-clip overflow-y-auto rounded-xl border border-white/10 bg-[#0f172a] p-6 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isModalVisible
                  ? 'translate-y-0 scale-100 opacity-100'
                  : 'translate-y-3 scale-95 opacity-0'
              }`}
              style={{ boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45)' }}
              onClick={(e) => e.stopPropagation()}
            >
            <div className="mb-4 flex items-center justify-between">
              <h3 className={`text-2xl font-bold font-inter ${adminHeadingClass}`}>
                {isEditMode ? 'Edit Rush Event' : 'Add Rush Event'}
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className={`${adminIconBtnClass} h-9 w-9`}
                title="Close"
              >
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
              </button>
            </div>

            <form onSubmit={handleSubmit} className="min-w-0 max-w-full space-y-4" autoComplete="off">
              <div className="min-w-0">
                <label
                  htmlFor="title"
                  className={adminLabelClass}
                >
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Open House #1"
                  autoComplete="off"
                  required
                  className={adminFieldClass}
                  style={adminFieldEditStyle}
                />
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-3">
                <div className="min-w-0">
                  <label
                    htmlFor="eventDate"
                    className={adminLabelClass}
                  >
                    Date <span className="text-red-400">*</span>
                  </label>
                  <div className="admin-datetime-wrap">
                    <input
                      type="date"
                      id="eventDate"
                      name="eventDate"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      required
                      className={`${adminFieldClass} ${
                        eventDate ? '' : 'datetime-empty'
                      }`}
                      style={adminFieldEditStyle}
                    />
                  </div>
                </div>
                <div className="min-w-0">
                  <label
                    htmlFor="startTime"
                    className={adminLabelClass}
                  >
                    Start Time <span className="text-red-400">*</span>
                  </label>
                  <div className="admin-datetime-wrap">
                    <input
                      type="time"
                      id="startTime"
                      name="startTime"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                      className={`${adminFieldClass} ${
                        startTime ? '' : 'datetime-empty'
                      }`}
                      style={adminFieldEditStyle}
                    />
                  </div>
                </div>
                <div className="min-w-0">
                  <label
                    htmlFor="endTime"
                    className={adminLabelClass}
                  >
                    End Time <span className={`font-normal ${adminMutedClass}`}>(Optional)</span>
                  </label>
                  <div className="admin-datetime-wrap">
                    <input
                      type="time"
                      id="endTime"
                      name="endTime"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className={`${adminFieldClass} ${
                        endTime ? '' : 'datetime-empty'
                      }`}
                      style={adminFieldEditStyle}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className={adminLabelClass}
                >
                  Location <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., Michigan Union"
                  autoComplete="off"
                  required
                  className={adminFieldClass}
                  style={adminFieldEditStyle}
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className={adminLabelClass}
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="e.g., Stop by our table to meet brothers and learn about rush."
                  className={`${adminFieldClass} h-auto`}
                  style={adminFieldEditStyle}
                />
              </div>

              <div>
                <label
                  htmlFor="button_label"
                  className={adminLabelClass}
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
                  className={adminFieldClass}
                  style={adminFieldEditStyle}
                />
              </div>

              <div>
                <label
                  htmlFor="button_url"
                  className={adminLabelClass}
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
                  className={adminFieldClass}
                  style={adminFieldEditStyle}
                />
              </div>

              {error && (
                <div className="rounded border border-red-400/30 bg-red-500/10 px-4 py-3 text-red-300">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={adminSecondaryBtnClass}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={adminPrimaryBtnClass}
                >
                  {isSubmitting ? (isEditMode ? 'Updating...' : 'Adding...') : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

