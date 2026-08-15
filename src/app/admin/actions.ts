'use server'

import { revalidatePath } from 'next/cache'
import { checkIsAdmin } from '@/lib/supabase/auth-helpers'
import {
  parseRushEvent,
  parseRushEventId,
  parseRushEventOrder,
  type RushEventWrite,
} from '@/lib/rush-event-schema'
import {
  createRushEvent,
  getRushEvents,
  patchRushEvent,
  removeRushEvent,
  reorderRushEvents,
  toClientRushEvent,
} from '@/lib/rush-events'

export type RushEventInput = RushEventWrite

async function requireAdmin() {
  const user = await checkIsAdmin()
  if (!user) {
    return { error: 'Unauthorized: Admin access required' as const }
  }
  return { user, error: null }
}

export async function listRushEvents() {
  const auth = await requireAdmin()
  if (auth.error) {
    return { data: null, error: auth.error }
  }

  const events = await getRushEvents()
  return { data: events.map(toClientRushEvent), error: null }
}

export async function insertRushEvent(event: RushEventInput) {
  const auth = await requireAdmin()
  if (auth.error) {
    return { data: null, error: auth.error }
  }

  const parsed = parseRushEvent(event)
  if (parsed.error || !parsed.data) {
    return { data: null, error: parsed.error }
  }

  try {
    const created = await createRushEvent(parsed.data)
    revalidatePath('/rush')
    revalidatePath('/admin')
    return { data: toClientRushEvent(created), error: null }
  } catch (error) {
    console.error('Error inserting rush event:', error)
    return { data: null, error: 'Failed to insert rush event' }
  }
}

export async function deleteRushEvent(eventId: string) {
  const auth = await requireAdmin()
  if (auth.error) {
    return { data: null, error: auth.error }
  }

  const parsedId = parseRushEventId(eventId)
  if (parsedId.error || !parsedId.data) {
    return { data: null, error: parsedId.error }
  }

  try {
    await removeRushEvent(parsedId.data)
    revalidatePath('/rush')
    revalidatePath('/admin')
    return { data: null, error: null }
  } catch (error) {
    console.error('Error deleting rush event:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete rush event'
    return { data: null, error: message }
  }
}

export async function updateRushEvent(eventId: string, event: RushEventInput) {
  const auth = await requireAdmin()
  if (auth.error) {
    return { data: null, error: auth.error }
  }

  const parsedId = parseRushEventId(eventId)
  if (parsedId.error || !parsedId.data) {
    return { data: null, error: parsedId.error }
  }

  const parsed = parseRushEvent(event)
  if (parsed.error || !parsed.data) {
    return { data: null, error: parsed.error }
  }

  try {
    const updated = await patchRushEvent(parsedId.data, parsed.data)
    if (!updated) {
      return { data: null, error: 'Event not found' }
    }
    revalidatePath('/rush')
    revalidatePath('/admin')
    return { data: toClientRushEvent(updated), error: null }
  } catch (error) {
    console.error('Error updating rush event:', error)
    return { data: null, error: 'Failed to update rush event' }
  }
}

export async function updateRushEventOrder(
  orderUpdates: Array<{ id: string; order_index: number }>
) {
  const auth = await requireAdmin()
  if (auth.error) {
    return { data: null, error: auth.error }
  }

  const parsed = parseRushEventOrder(orderUpdates)
  if (parsed.error || !parsed.data) {
    return { data: null, error: parsed.error }
  }

  try {
    await reorderRushEvents(parsed.data)
    revalidatePath('/rush')
    revalidatePath('/admin')
    return { data: null, error: null }
  } catch (error) {
    console.error('Error updating order_index:', error)
    return { data: null, error: 'Failed to update event order' }
  }
}
