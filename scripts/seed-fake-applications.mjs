/**
 * Seed fake submitted applications for local review testing.
 *
 * Usage:
 *   npm run db:seed-apps
 *   npm run db:seed-apps -- --count 12
 *   npm run db:seed-apps -- --cycle "Fall 2026 IN TEST"
 *
 * Requires DATABASE_URL in .env.local. Safe to re-run — skips seed emails
 * already present on the target cycle.
 */

import { randomUUID } from 'crypto'
import nextEnv from '@next/env'
import postgres from 'postgres'

const { loadEnvConfig } = nextEnv
loadEnvConfig(process.cwd())

const args = process.argv.slice(2)
const countArg = args.find((arg, i) => args[i - 1] === '--count')
const cycleArg = args.find((arg, i) => args[i - 1] === '--cycle')
const count = Math.max(1, Math.min(50, Number(countArg ?? 16) || 16))

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set.')
  process.exit(1)
}

const sql = postgres(process.env.DATABASE_URL, { prepare: false })

const APPLICANTS = [
  {
    first: 'Alex',
    last: 'Chen',
    preferred: null,
    majors: 'Computer Science',
    activities: 'MRacing, Michigan Hackers',
  },
  {
    first: 'Jordan',
    last: 'Patel',
    preferred: 'Jo',
    majors: 'Data Science, Statistics',
    activities: 'KTP interest event, WOLV TV',
  },
  {
    first: 'Sam',
    last: 'Nguyen',
    preferred: null,
    majors: 'Informatics',
    activities: 'UX Club, Design at Michigan',
  },
  {
    first: 'Riley',
    last: 'Johnson',
    preferred: null,
    majors: 'Computer Engineering',
    activities: 'Engineering Council, Solar Car',
  },
  {
    first: 'Casey',
    last: 'Kim',
    preferred: 'Casey',
    majors: 'Business Administration, CS minor',
    activities: 'Entrepreneurship club, consulting group',
  },
  {
    first: 'Morgan',
    last: 'Williams',
    preferred: null,
    majors: 'Mathematics',
    activities: 'Putnam prep, tutoring',
  },
  {
    first: 'Taylor',
    last: 'Brown',
    preferred: null,
    majors: 'Information Analysis',
    activities: 'Campus recycling, IM sports',
  },
  {
    first: 'Avery',
    last: 'Martinez',
    preferred: 'Ave',
    majors: 'Computer Science, Economics',
    activities: 'Investment club, app dev side projects',
  },
  {
    first: 'Quinn',
    last: 'Lee',
    preferred: null,
    majors: 'Electrical Engineering',
    activities: 'IEEE, robotics lab',
  },
  {
    first: 'Drew',
    last: 'Singh',
    preferred: null,
    majors: 'Computer Science',
    activities: 'Open-source contributions, hackathons',
  },
  {
    first: 'Jamie',
    last: 'Okafor',
    preferred: 'Jamie',
    majors: 'SI (UX Design)',
    activities: 'Design for America, photography',
  },
  {
    first: 'Blake',
    last: 'Foster',
    preferred: null,
    majors: 'Computer Science',
    activities: 'Teaching assistant, peer mentor',
  },
  {
    first: 'Cameron',
    last: 'Wright',
    preferred: null,
    majors: 'Cognitive Science',
    activities: 'Research lab, debate',
  },
  {
    first: 'Harper',
    last: 'Diaz',
    preferred: 'Harps',
    majors: 'Computer Science, Spanish',
    activities: 'Language exchange, hackathons',
  },
  {
    first: 'Reese',
    last: 'Nguyen',
    preferred: null,
    majors: 'Data Science',
    activities: 'Analytics club, intramural soccer',
  },
  {
    first: 'Parker',
    last: 'Brooks',
    preferred: null,
    majors: 'Computer Engineering',
    activities: 'MHacks, maker space',
  },
  {
    first: 'Skyler',
    last: 'Adams',
    preferred: 'Sky',
    majors: 'Business, CS minor',
    activities: 'Startups club, volunteer tutoring',
  },
]

const ESSAY_1 =
  'I would build a campus study-match app that pairs students by course and study style. As a first-gen student, finding study groups was hard; this product reflects my value of accessible community.'
const ESSAY_2 =
  'A memory that stayed with me was fixing the projector before my high school club presentation. I learned to stay calm under pressure, which is how I approach team projects today.'
const ESSAY_3 =
  'Technology — KTP would help me grow technical depth while giving back through mentorship.'

function cycleSlug(name) {
  return (
    name
      .replace(/\s*\(local\)\s*/gi, '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'cycle'
  )
}

function fakeS3Key(cycleName, applicationId, slot, ext) {
  return `applications/${cycleSlug(cycleName)}/${applicationId}/${slot}/${randomUUID()}.${ext}`
}

try {
  const [cycle] = cycleArg
    ? await sql`
        select id, name
        from public.rush_cycles
        where name = ${cycleArg}
        limit 1
      `
    : await sql`
        select id, name
        from public.rush_cycles
        where is_active = true
        limit 1
      `

  if (!cycle) {
    console.error(
      cycleArg
        ? `No rush cycle named "${cycleArg}".`
        : 'No active rush cycle found. Pass --cycle "Your Cycle Name".'
    )
    process.exit(1)
  }

  const questions = await sql`
    select id, sort_order
    from public.cycle_questions
    where cycle_id = ${cycle.id}
    order by sort_order asc
  `

  if (questions.length === 0) {
    console.error(`Cycle "${cycle.name}" has no questions.`)
    process.exit(1)
  }

  const [{ max_num: maxDisplay }] = await sql`
    select coalesce(max(display_number), 0) as max_num
    from public.applications
    where cycle_id = ${cycle.id}
  `

  let nextDisplay = Number(maxDisplay) + 1
  let created = 0
  let skipped = 0

  for (let i = 0; i < count; i += 1) {
    const profile = APPLICANTS[i % APPLICANTS.length]
    const index = i + 1
    const email = `seed-applicant-${index}@umich.edu`
    const userId = randomUUID()

    const [existing] = await sql`
      select id
      from public.applications
      where cycle_id = ${cycle.id}
        and email = ${email}
      limit 1
    `

    if (existing) {
      skipped += 1
      continue
    }

    const submittedAt = new Date(Date.now() - index * 3600_000).toISOString()
    const displayNumber = nextDisplay
    nextDisplay += 1

    const [app] = await sql`
      insert into public.applications (
        cycle_id,
        user_id,
        email,
        status,
        submitted_at,
        first_name,
        last_name,
        preferred_name,
        pronouns,
        phone,
        majors,
        minors,
        graduation_year,
        gpa,
        semesters_remaining,
        other_professional_fraternity,
        campus_activities,
        hear_about,
        anything_else,
        display_number,
        review_count
      )
      values (
        ${cycle.id},
        ${userId},
        ${email},
        'submitted',
        ${submittedAt},
        ${profile.first},
        ${profile.last},
        ${profile.preferred},
        'they/them',
        '734-555-0100',
        ${profile.majors},
        null,
        2027,
        3.750,
        4,
        false,
        ${profile.activities},
        ${['Instagram', 'Word of mouth']},
        ${'Excited to rush KTP! (seed data)'},
        ${displayNumber},
        0
      )
      returning id
    `

    const essayBodies = [ESSAY_1, ESSAY_2, ESSAY_3]
    for (const question of questions) {
      const body = essayBodies[question.sort_order] ?? `Seed essay for question ${question.sort_order + 1}.`
      await sql`
        insert into public.application_answers (application_id, question_id, body)
        values (${app.id}, ${question.id}, ${body})
        on conflict (application_id, question_id) do nothing
      `
    }

    const files = [
      { slot: 'photo', ext: 'png', mime: 'image/png', name: 'photo.png' },
      { slot: 'transcript', ext: 'pdf', mime: 'application/pdf', name: 'transcript.pdf' },
      { slot: 'resume', ext: 'pdf', mime: 'application/pdf', name: 'resume.pdf' },
      {
        slot: 'resume_anonymized',
        ext: 'pdf',
        mime: 'application/pdf',
        name: 'resume-anonymized.pdf',
      },
      {
        slot: 'life_app_screenshot',
        ext: 'png',
        mime: 'image/png',
        name: 'life-app.png',
      },
    ]

    for (const file of files) {
      await sql`
        insert into public.application_files (
          application_id,
          slot,
          s3_key,
          mime_type,
          original_filename
        )
        values (
          ${app.id},
          ${file.slot},
          ${fakeS3Key(cycle.name, app.id, file.slot, file.ext)},
          ${file.mime},
          ${file.name}
        )
        on conflict (application_id, slot) do nothing
      `
    }

    created += 1
    console.log(
      `  #${displayNumber} ${profile.first} ${profile.last} <${email}>`
    )
  }

  console.log(
    `\nCycle: ${cycle.name}\nCreated ${created} application(s), skipped ${skipped} existing.`
  )
  if (created === 0 && skipped > 0) {
    console.log(
      'All seed applicants already exist. Use a higher --count for new emails (seed-applicant-N@umich.edu).'
    )
  }
} finally {
  await sql.end()
}
