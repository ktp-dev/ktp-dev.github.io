# Database diagram (DBML)

Paste into [dbdiagram.io](https://dbdiagram.io).

```dbml
// Public Postgres schema for the rush application portal.
// auth.users is Supabase Auth. applications.user_id stores that UUID with no FK.

Table admins {
  email varchar [primary key, note: 'Extra web allowlist; e-board is also admin via assignments later']
  created_at timestamptz [not null, default: `now()`]
}

Table brothers {
  id uuid [pk]
  first_name varchar
  last_name varchar
  umich_email varchar [note: 'nullable; unique when set; /portal login']
  contact_email varchar
  linkedin_url varchar
  photo_filename varchar [note: 'Dummy filename until S3']
  status varchar [not null, default: 'active', note: 'active | alumni']
  pledge_class varchar
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}

Table rush_cycles {
  id uuid [primary key, default: `gen_random_uuid()`]
  name varchar [not null]
  opens_at timestamptz [not null]
  closes_at timestamptz [not null]
  intro_markdown text [note: 'Welcome copy on /apply']
  closed_markdown text [note: 'Shown on /apply after close']
  public_blurb text [note: 'Copy on /rush']
  interest_form_url varchar
  youtube_url varchar
  calendar_url varchar
  hear_about_options varchar[] [not null, default: `{}`]
  is_active boolean [not null, default: false, note: 'At most one true (partial unique index)']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Note: 'One live cycle on the site. Owns /rush, schedule, and application questions.'
}

Table rush_events {
  id uuid [primary key, default: `gen_random_uuid()`]
  cycle_id uuid [not null]
  title varchar [not null]
  datetime varchar [not null]
  location varchar [not null]
  description text
  button_label varchar
  button_url varchar
  order_index integer [not null, default: 0]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (cycle_id, order_index) [name: 'rush_events_cycle_id_idx']
  }
}

Table cycle_questions {
  id uuid [primary key, default: `gen_random_uuid()`]
  cycle_id uuid [not null]
  prompt text [not null]
  help_text text
  max_words integer [not null]
  sort_order integer [not null, default: 0]
  required boolean [not null, default: true]

  indexes {
    (cycle_id, sort_order) [name: 'cycle_questions_cycle_id_idx']
  }
}

Table applications {
  id uuid [primary key, default: `gen_random_uuid()`]
  cycle_id uuid [not null]
  user_id uuid [not null, note: 'auth.users.id; no FK']
  email varchar [not null]
  status varchar [not null, default: 'draft', note: 'draft | submitted']
  submitted_at timestamptz
  first_name varchar
  last_name varchar
  preferred_name varchar
  pronouns varchar
  phone varchar
  majors varchar
  minors varchar
  graduation_year integer
  gpa numeric
  semesters_remaining integer
  other_professional_fraternity boolean
  campus_activities text
  hear_about varchar[]
  hear_about_other varchar
  anything_else text
  rush_feedback text
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  indexes {
    (cycle_id, user_id) [unique, name: 'applications_cycle_user_unique']
    user_id [name: 'applications_user_id_idx']
    (cycle_id, status) [name: 'applications_cycle_status_idx']
  }
}

Table application_answers {
  id uuid [primary key, default: `gen_random_uuid()`]
  application_id uuid [not null]
  question_id uuid [not null]
  body text

  indexes {
    (application_id, question_id) [unique, name: 'application_answers_app_question_unique']
  }
}

Table application_files {
  id uuid [primary key, default: `gen_random_uuid()`]
  application_id uuid [not null]
  slot varchar [not null, note: 'photo | transcript | resume | resume_anonymized | life_app_screenshot']
  s3_key varchar [not null]
  mime_type varchar
  size_bytes integer
  original_filename varchar
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (application_id, slot) [unique, name: 'application_files_app_slot_unique']
  }
}

Table auth_users [note: 'Supabase Auth; not a public table we migrate'] {
  id uuid [primary key]
  email varchar
}

Ref: rush_events.cycle_id > rush_cycles.id [delete: cascade]
Ref: cycle_questions.cycle_id > rush_cycles.id [delete: cascade]
Ref: applications.cycle_id > rush_cycles.id [delete: restrict]
Ref: application_answers.application_id > applications.id [delete: cascade]
Ref: application_answers.question_id > cycle_questions.id [delete: restrict]
Ref: application_files.application_id > applications.id [delete: cascade]
```
