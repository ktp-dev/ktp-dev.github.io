import { sql } from 'drizzle-orm'
import { index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

// TypeScript map of public tables for queries.
// RLS, functions, triggers, and auth.users FKs live in supabase/migrations.

export const admins = pgTable('admins', {
  id: uuid('id').primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .default(sql`timezone('utc'::text, now())`)
    .notNull(),
})

export const rushEvents = pgTable(
  'rush_events',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    title: text('title').notNull(),
    datetime: text('datetime').notNull(),
    location: text('location').notNull(),
    description: text('description'),
    buttonLabel: text('button_label'),
    buttonUrl: text('button_url'),
    orderIndex: integer('order_index').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .default(sql`timezone('utc'::text, now())`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .default(sql`timezone('utc'::text, now())`)
      .notNull(),
  },
  (table) => [
    index('idx_rush_events_order_index').using(
      'btree',
      table.orderIndex.asc().nullsLast().op('int4_ops')
    ),
  ]
)
