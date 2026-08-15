import nextEnv from '@next/env'
import postgres from 'postgres'

const { loadEnvConfig } = nextEnv
loadEnvConfig(process.cwd())

const emails = (process.env.LOCAL_ADMIN_EMAILS ?? '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)

if (emails.length === 0) {
  console.error('Set LOCAL_ADMIN_EMAILS in .env.local (comma-separated).')
  process.exit(1)
}

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set.')
  process.exit(1)
}

const sql = postgres(process.env.DATABASE_URL, { prepare: false })

try {
  for (const email of emails) {
    await sql`
      insert into public.admins (email)
      values (${email})
      on conflict (email) do nothing
    `
  }
  console.log(`Seeded ${emails.length} local admin email(s).`)
} finally {
  await sql.end()
}
