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
  getRushEventsForCycle,
  patchRushEvent,
  removeRushEvent,
  reorderRushEvents,
  toClientRushEvent,
} from '@/lib/rush-events'
import { parseAdminEmail } from '@/lib/admin-schema'
import { addAdminEmail, removeAdminEmail } from '@/lib/admins'
import { parseCycleId, parseRushCycleApplication, parseRushCycleCreate, parseRushCycleMeta } from '@/lib/rush-cycle-schema'
import {
  activateRushCycle,
  closeRushCycleNow,
  createRushCycle,
  getCycleBundle,
  listRushCycles,
  openRushCycleNow,
  saveRushCycle,
  saveRushCycleMeta,
} from '@/lib/rush-cycles'

export type RushEventInput = RushEventWrite

async function requireAdmin() {
  const user = await checkIsAdmin()
  if (!user) {
    return { error: 'Unauthorized: Admin access required' as const }
  }
  return { user, error: null }
}

function revalidateRush() {
  revalidatePath('/admin')
  revalidatePath('/rush')
  revalidatePath('/apply')
}

export async function addAdmin(email: string) {
  const auth = await requireAdmin()
  if (auth.error) {
    return { data: null, error: auth.error }
  }

  const parsed = parseAdminEmail(email)
  if (parsed.error || !parsed.data) {
    return { data: null, error: parsed.error }
  }

  try {
    const result = await addAdminEmail(parsed.data)
    if (result.error) return { data: null, error: result.error }
    revalidatePath('/admin')
    return { data: result.admin, error: null }
  } catch (error) {
    console.error('Error adding admin:', error)
    return { data: null, error: 'Failed to add admin' }
  }
}

export async function removeAdmin(email: string) {
  const auth = await requireAdmin()
  if (auth.error) {
    return { data: null, error: auth.error }
  }

  const parsed = parseAdminEmail(email)
  if (parsed.error || !parsed.data) {
    return { data: null, error: parsed.error }
  }

  try {
    const result = await removeAdminEmail(parsed.data, auth.user.email ?? '')
    if (result.error) return { data: null, error: result.error }
    revalidatePath('/admin')
    return { data: null, error: null }
  } catch (error) {
    console.error('Error removing admin:', error)
    return { data: null, error: 'Failed to remove admin' }
  }
}

export async function listRushEvents(cycleId: string) {
  const auth = await requireAdmin()
  if (auth.error) {
    return { data: null, error: auth.error }
  }

  const parsedId = parseCycleId(cycleId)
  if (parsedId.error || !parsedId.data) {
    return { data: null, error: parsedId.error }
  }

  const events = await getRushEventsForCycle(parsedId.data)
  return { data: events.map(toClientRushEvent), error: null }
}

export async function insertRushEvent(cycleId: string, event: RushEventInput) {
  const auth = await requireAdmin()
  if (auth.error) {
    return { data: null, error: auth.error }
  }

  const parsedId = parseCycleId(cycleId)
  if (parsedId.error || !parsedId.data) {
    return { data: null, error: parsedId.error }
  }

  const parsed = parseRushEvent(event)
  if (parsed.error || !parsed.data) {
    return { data: null, error: parsed.error }
  }

  try {
    const created = await createRushEvent(parsedId.data, parsed.data)
    revalidateRush()
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
    revalidateRush()
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
    revalidateRush()
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
    revalidateRush()
    return { data: null, error: null }
  } catch (error) {
    console.error('Error updating order_index:', error)
    return { data: null, error: 'Failed to update event order' }
  }
}

export async function getRushCycleBundle(cycleId: string) {
  const auth = await requireAdmin()
  if (auth.error) {
    return { data: null, error: auth.error }
  }

  const parsedId = parseCycleId(cycleId)
  if (parsedId.error || !parsedId.data) {
    return { data: null, error: parsedId.error }
  }

  const data = await getCycleBundle(parsedId.data)
  if (!data) return { data: null, error: 'Cycle not found' }
  return { data, error: null }
}

export async function createRushCycleRecord(input: unknown) {
  const auth = await requireAdmin()
  if (auth.error) {
    return { data: null, error: auth.error }
  }

  const parsed = parseRushCycleCreate(input)
  if (parsed.error || !parsed.data) {
    return { data: null, error: parsed.error }
  }

  try {
    const bundle = await createRushCycle(parsed.data)
    if (!bundle) return { data: null, error: 'Failed to create cycle' }
    const cycles = await listRushCycles()
    revalidateRush()
    return { data: { ...bundle, cycles }, error: null }
  } catch (error) {
    console.error('Error creating rush cycle:', error)
    return { data: null, error: 'Failed to create cycle' }
  }
}

export async function saveRushApplicationCycle(cycleId: string, input: unknown) {
  const auth = await requireAdmin()
  if (auth.error) {
    return { data: null, error: auth.error }
  }

  const parsedId = parseCycleId(cycleId)
  if (parsedId.error || !parsedId.data) {
    return { data: null, error: parsedId.error }
  }

  const parsed = parseRushCycleApplication(input)
  if (parsed.error || !parsed.data) {
    return { data: null, error: parsed.error }
  }

  try {
    await saveRushCycle(parsedId.data, parsed.data)
    revalidateRush()
    const data = await getCycleBundle(parsedId.data)
    if (!data) return { data: null, error: 'Cycle not found' }
    return { data, error: null }
  } catch (error) {
    console.error('Error saving rush cycle:', error)
    const message = error instanceof Error ? error.message : 'Failed to save rush application'
    return { data: null, error: message }
  }
}

export async function saveRushCycleDetails(cycleId: string, input: unknown) {
  const auth = await requireAdmin()
  if (auth.error) {
    return { data: null, error: auth.error }
  }

  const parsedId = parseCycleId(cycleId)
  if (parsedId.error || !parsedId.data) {
    return { data: null, error: parsedId.error }
  }

  const parsed = parseRushCycleMeta(input)
  if (parsed.error || !parsed.data) {
    return { data: null, error: parsed.error }
  }

  try {
    const updated = await saveRushCycleMeta(parsedId.data, parsed.data)
    if (!updated) return { data: null, error: 'Cycle not found' }
    revalidateRush()
    const data = await getCycleBundle(parsedId.data)
    if (!data) return { data: null, error: 'Cycle not found' }
    return { data, error: null }
  } catch (error) {
    console.error('Error saving rush cycle:', error)
    return { data: null, error: 'Failed to save rush cycle' }
  }
}

export async function showRushCycleOnSite(cycleId: string) {
  const auth = await requireAdmin()
  if (auth.error) {
    return { data: null, error: auth.error }
  }

  const parsedId = parseCycleId(cycleId)
  if (parsedId.error || !parsedId.data) {
    return { data: null, error: parsedId.error }
  }

  try {
    const updated = await activateRushCycle(parsedId.data)
    if (!updated) return { data: null, error: 'Cycle not found' }
    revalidateRush()
    const [data, cycles] = await Promise.all([
      getCycleBundle(parsedId.data),
      listRushCycles(),
    ])
    if (!data) return { data: null, error: 'Cycle not found' }
    return { data: { ...data, cycles }, error: null }
  } catch (error) {
    console.error('Error activating rush cycle:', error)
    return { data: null, error: 'Failed to show cycle on site' }
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
    revalidateRush()
    const data = await getCycleBundle(parsedId.data)
    if (!data) return { data: null, error: 'Cycle not found' }
    return { data, error: null }
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
    revalidateRush()
    const [data, cycles] = await Promise.all([
      getCycleBundle(parsedId.data),
      listRushCycles(),
    ])
    if (!data) return { data: null, error: 'Cycle not found' }
    return { data: { ...data, cycles }, error: null }
  } catch (error) {
    console.error('Error opening rush cycle:', error)
    return { data: null, error: 'Failed to open applications' }
  }
}
