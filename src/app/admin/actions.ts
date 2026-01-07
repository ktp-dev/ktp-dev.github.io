'use server'

import { createClient } from '@/lib/supabase/server'
import { checkIsAdmin } from '@/lib/supabase/auth-helpers'

export interface RushEventInput {
  title: string
  datetime: string
  location: string
  description: string | null
  button_label: string | null
  button_url: string | null
  order_index: number
}

export async function insertRushEvent(event: RushEventInput) {
  // Check if user is admin
  const user = await checkIsAdmin()
  if (!user) {
    return { error: 'Unauthorized: Admin access required' }
  }

  // Validate required fields
  if (!event.title || !event.datetime || !event.location) {
    return { error: 'Title, datetime, and location are required' }
  }

  const supabase = await createClient()

  // Insert the rush event
  const { data, error } = await supabase
    .from('rush_events')
    .insert({
      title: event.title,
      datetime: event.datetime,
      location: event.location,
      description: event.description || null,
      button_label: event.button_label || null,
      button_url: event.button_url || null,
      order_index: event.order_index,
    })
    .select()
    .single()

  if (error) {
    console.error('Error inserting rush event:', error)
    return { error: error.message }
  }

  return { data, error: null }
}

export async function deleteRushEvent(eventId: string) {
  // Check if user is admin
  const user = await checkIsAdmin()
  if (!user) {
    return { error: 'Unauthorized: Admin access required' }
  }

  const supabase = await createClient()

  // Get the order_index of the event being deleted
  const { data: eventToDelete, error: fetchError } = await supabase
    .from('rush_events')
    .select('order_index')
    .eq('id', eventId)
    .single()

  if (fetchError || !eventToDelete) {
    return { error: 'Event not found' }
  }

  // Delete the event
  const { error: deleteError } = await supabase
    .from('rush_events')
    .delete()
    .eq('id', eventId)

  if (deleteError) {
    console.error('Error deleting rush event:', deleteError)
    return { error: deleteError.message }
  }

  // Get all remaining events ordered by order_index
  const { data: remainingEvents, error: fetchRemainingError } = await supabase
    .from('rush_events')
    .select('id, order_index')
    .order('order_index', { ascending: true })

  if (fetchRemainingError) {
    console.error('Error fetching remaining events:', fetchRemainingError)
    // Event is deleted, but we couldn't reorder - that's okay
    return { data: null, error: null }
  }

  // Reorder all remaining events sequentially (0, 1, 2, ...)
  if (remainingEvents && remainingEvents.length > 0) {
    const updates = remainingEvents.map((event, index) => ({
      id: event.id,
      order_index: index,
    }))

    // Update all events in a transaction-like manner
    for (const update of updates) {
      const { error: updateError } = await supabase
        .from('rush_events')
        .update({ order_index: update.order_index })
        .eq('id', update.id)

      if (updateError) {
        console.error('Error updating order_index:', updateError)
        // Continue with other updates even if one fails
      }
    }
  }

  return { data: null, error: null }
}

export async function updateRushEvent(eventId: string, event: RushEventInput) {
  // Check if user is admin
  const user = await checkIsAdmin()
  if (!user) {
    return { error: 'Unauthorized: Admin access required' }
  }

  // Validate required fields
  if (!event.title || !event.datetime || !event.location) {
    return { error: 'Title, datetime, and location are required' }
  }

  const supabase = await createClient()

  // Update the rush event
  const { data, error } = await supabase
    .from('rush_events')
    .update({
      title: event.title,
      datetime: event.datetime,
      location: event.location,
      description: event.description || null,
      button_label: event.button_label || null,
      button_url: event.button_url || null,
      order_index: event.order_index,
    })
    .eq('id', eventId)
    .select()
    .single()

  if (error) {
    console.error('Error updating rush event:', error)
    return { error: error.message }
  }

  return { data, error: null }
}

export async function updateRushEventOrder(orderUpdates: Array<{ id: string; order_index: number }>) {
  // Check if user is admin
  const user = await checkIsAdmin()
  if (!user) {
    return { error: 'Unauthorized: Admin access required' }
  }

  const supabase = await createClient()

  // Update all events' order_index in a batch
  for (const update of orderUpdates) {
    const { error } = await supabase
      .from('rush_events')
      .update({ order_index: update.order_index })
      .eq('id', update.id)

    if (error) {
      console.error('Error updating order_index:', error)
      return { error: error.message }
    }
  }

  return { data: null, error: null }
}


