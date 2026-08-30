import 'server-only'

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not set')
}

const globalForDb = globalThis as unknown as {
  postgres: ReturnType<typeof postgres> | undefined
}

// This connection uses the Postgres role and bypasses RLS.
// Authorization must happen in server code, not via database policies.
// prepare: false is required for the Supabase transaction pooler later.
const client =
  globalForDb.postgres ?? postgres(connectionString, { prepare: false })

if (process.env.NODE_ENV !== 'production') {
  globalForDb.postgres = client
}

export const db = drizzle(client, { schema })
export * from './schema'
