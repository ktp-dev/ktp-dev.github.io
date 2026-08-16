import { sql } from 'drizzle-orm'
import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

// TypeScript map of public tables for queries.
// RLS, functions, triggers, and auth.users FKs live in supabase/migrations.

export const admins = pgTable('admins', {
  email: text('email').primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .default(sql`timezone('utc'::text, now())`)
    .notNull(),
})

export const brothers = pgTable(
  'brothers',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    firstName: text('first_name'),
    lastName: text('last_name'),
    umichEmail: text('umich_email'),
    contactEmail: text('contact_email'),
    linkedinUrl: text('linkedin_url'),
    photoFilename: text('photo_filename'),
    status: text('status').default('active').notNull().$type<'active' | 'alumni'>(),
    pledgeClass: text('pledge_class'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .default(sql`timezone('utc'::text, now())`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .default(sql`timezone('utc'::text, now())`)
      .notNull(),
  },
  (table) => [
    uniqueIndex('brothers_umich_email_key')
      .on(table.umichEmail)
      .where(sql`${table.umichEmail} is not null`),
  ]
)

export const rushCycles = pgTable(
  'rush_cycles',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    name: text('name').notNull(),
    opensAt: timestamp('opens_at', { withTimezone: true, mode: 'string' }).notNull(),
    closesAt: timestamp('closes_at', { withTimezone: true, mode: 'string' }).notNull(),
    introMarkdown: text('intro_markdown'),
    closedMarkdown: text('closed_markdown'),
    publicBlurb: text('public_blurb'),
    interestFormUrl: text('interest_form_url'),
    youtubeUrl: text('youtube_url'),
    calendarUrl: text('calendar_url'),
    hearAboutOptions: text('hear_about_options').array().notNull().default(sql`ARRAY[]::text[]`),
    isActive: boolean('is_active').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .default(sql`timezone('utc'::text, now())`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .default(sql`timezone('utc'::text, now())`)
      .notNull(),
  },
  (table) => [
    uniqueIndex('rush_cycles_one_active')
      .on(table.isActive)
      .where(sql`${table.isActive}`),
  ]
)

export const rushEvents = pgTable(
  'rush_events',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    cycleId: uuid('cycle_id')
      .notNull()
      .references(() => rushCycles.id, { onDelete: 'cascade' }),
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
    index('rush_events_cycle_id_idx').on(table.cycleId, table.orderIndex),
  ]
)

export const cycleQuestions = pgTable(
  'cycle_questions',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    cycleId: uuid('cycle_id')
      .notNull()
      .references(() => rushCycles.id, { onDelete: 'cascade' }),
    prompt: text('prompt').notNull(),
    helpText: text('help_text'),
    maxWords: integer('max_words').notNull(),
    sortOrder: integer('sort_order').default(0).notNull(),
    required: boolean('required').default(true).notNull(),
  },
  (table) => [index('cycle_questions_cycle_id_idx').on(table.cycleId, table.sortOrder)]
)

export const applications = pgTable(
  'applications',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    cycleId: uuid('cycle_id')
      .notNull()
      .references(() => rushCycles.id, { onDelete: 'restrict' }),
    userId: uuid('user_id').notNull(),
    email: text('email').notNull(),
    status: text('status').default('draft').notNull().$type<'draft' | 'submitted'>(),
    submittedAt: timestamp('submitted_at', { withTimezone: true, mode: 'string' }),
    firstName: text('first_name'),
    lastName: text('last_name'),
    preferredName: text('preferred_name'),
    pronouns: text('pronouns'),
    phone: text('phone'),
    majors: text('majors'),
    minors: text('minors'),
    graduationYear: integer('graduation_year'),
    gpa: numeric('gpa', { precision: 5, scale: 3 }),
    semestersRemaining: integer('semesters_remaining'),
    otherProfessionalFraternity: boolean('other_professional_fraternity'),
    campusActivities: text('campus_activities'),
    hearAbout: text('hear_about').array(),
    hearAboutOther: text('hear_about_other'),
    anythingElse: text('anything_else'),
    rushFeedback: text('rush_feedback'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .default(sql`timezone('utc'::text, now())`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .default(sql`timezone('utc'::text, now())`)
      .notNull(),
  },
  (table) => [
    unique('applications_cycle_user_unique').on(table.cycleId, table.userId),
    index('applications_user_id_idx').on(table.userId),
    index('applications_cycle_status_idx').on(table.cycleId, table.status),
  ]
)

export const applicationAnswers = pgTable(
  'application_answers',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    applicationId: uuid('application_id')
      .notNull()
      .references(() => applications.id, { onDelete: 'cascade' }),
    questionId: uuid('question_id')
      .notNull()
      .references(() => cycleQuestions.id, { onDelete: 'restrict' }),
    body: text('body'),
  },
  (table) => [
    unique('application_answers_app_question_unique').on(
      table.applicationId,
      table.questionId
    ),
  ]
)

export const applicationFiles = pgTable(
  'application_files',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    applicationId: uuid('application_id')
      .notNull()
      .references(() => applications.id, { onDelete: 'cascade' }),
    slot: text('slot')
      .notNull()
      .$type<
        | 'photo'
        | 'transcript'
        | 'resume'
        | 'resume_anonymized'
        | 'life_app_screenshot'
      >(),
    s3Key: text('s3_key').notNull(),
    mimeType: text('mime_type'),
    sizeBytes: integer('size_bytes'),
    originalFilename: text('original_filename'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .default(sql`timezone('utc'::text, now())`)
      .notNull(),
  },
  (table) => [unique('application_files_app_slot_unique').on(table.applicationId, table.slot)]
)
