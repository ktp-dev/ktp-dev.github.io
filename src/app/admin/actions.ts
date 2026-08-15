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
import { parseCycleId, parseRushCycle } from '@/lib/rush-cycle-schema'
import {
  closeRushCycleNow,
  createRushCycle,
  getAdminCycle,
  openRushCycleNow,
  saveRushCycle,
} from '@/lib/rush-cycles'

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

export async function getRushApplicationCycle() {
  const auth = await requireAdmin()
  if (auth.error) {
    return { data: null, error: auth.error }
  }

  const data = await getAdminCycle()
  return { data, error: null }
}

export async function saveRushApplicationCycle(
  cycleId: string | null,
  input: unknown
) {
  const auth = await requireAdmin()
  if (auth.error) {
    return { data: null, error: auth.error }
  }

  const parsed = parseRushCycle(input)
  if (parsed.error || !parsed.data) {
    return { data: null, error: parsed.error }
  }

  try {
    if (cycleId) {
      const parsedId = parseCycleId(cycleId)
      if (parsedId.error || !parsedId.data) {
        return { data: null, error: parsedId.error }
      }
      await saveRushCycle(parsedId.data, parsed.data)
    } else {
      await createRushCycle(parsed.data)
    }
    revalidatePath('/admin')
    revalidatePath('/apply')
    return { data: await getAdminCycle(), error: null }
  } catch (error) {
    console.error('Error saving rush cycle:', error)
    const message = error instanceof Error ? error.message : 'Failed to save rush application'
    return { data: null, error: message }
  }
}

export async function closeRushApplicationNow(cycleId: string) {
  const auth = await requireAdmin()
  if (auth.error) {
    return { data: null, error: auth.error }
  }

  const parsedId = parseCycleId(cycleId)
  if (parsedId.error || !parsedId.data) {
    return { data: null, error: parsedId.error }
  }

  try {
    const updated = await closeRushCycleNow(parsedId.data)
    if (!updated) return { data: null, error: 'Cycle not found' }
    revalidatePath('/admin')
    revalidatePath('/apply')
    return { data: await getAdminCycle(), error: null }
  } catch (error) {
    console.error('Error closing rush cycle:', error)
    return { data: null, error: 'Failed to close applications' }
  }
}

export async function openRushApplicationNow(cycleId: string) {
  const auth = await requireAdmin()
  if (auth.error) {
    return { data: null, error: auth.error }
  }

  const parsedId = parseCycleId(cycleId)
  if (parsedId.error || !parsedId.data) {
    return { data: null, error: parsedId.error }
  }

  try {
    const updated = await openRushCycleNow(parsedId.data)
    if (!updated) return { data: null, error: 'Cycle not found' }
    revalidatePath('/admin')
    revalidatePath('/apply')
    return { data: await getAdminCycle(), error: null }
  } catch (error) {
    console.error('Error opening rush cycle:', error)
    return { data: null, error: 'Failed to open applications' }
  }
}
