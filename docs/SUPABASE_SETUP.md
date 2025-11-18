# Supabase Setup Guide

This guide will help you set up Supabase for the KTP Admin Portal.

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details:
   - Name: `ktp-admin-portal` (or your preferred name)
   - Database Password: (save this securely)
   - Region: Choose closest to your users
4. Wait for the project to be created (takes ~2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

## Step 3: Set Up Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Enable Google OAuth

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** and click to enable it
3. You'll need to:
   - Create a Google OAuth app at [Google Cloud Console](https://console.cloud.google.com/)
   - Get your **Client ID** and **Client Secret**
   - Add them to Supabase
4. **Important**: Add these redirect URLs in Supabase:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://your-domain.com/auth/callback` (for production)

## Step 5: Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor**
2. Open the file `supabase/migrations/001_create_tables.sql`
3. Copy the entire SQL content
4. Paste it into the SQL Editor
5. Click **Run** to execute the migration

This will create:
- `admins` table (stores authorized admin user IDs)
- `rush_events` table (stores rush schedule events)
- Row Level Security (RLS) policies
- Indexes for performance

## Step 6: Add Your First Admin

After you log in for the first time:

1. Go to **Authentication** → **Users** in Supabase dashboard
2. Find your user and copy the **User UID**
3. Go to **SQL Editor** and run:
   ```sql
   INSERT INTO admins (id) VALUES ('your-user-uid-here');
   ```

## Step 7: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/login`
3. Click "Log in with Google"
4. Sign in with your @umich.edu email
5. You should be redirected to `/admin` (once that page is created)

## Troubleshooting

### "Invalid API key" error
- Make sure your `.env.local` file has the correct values
- Restart your dev server after changing `.env.local`

### Google OAuth not working
- Verify redirect URLs are correctly set in both Google Cloud Console and Supabase
- Make sure you're using an @umich.edu email address

### Database errors
- Make sure you ran the migration SQL in Step 5
- Check that RLS policies are enabled in Supabase dashboard

## Next Steps

After setup is complete, you can:
1. Create the `/admin` dashboard page
2. Build the rush schedule management interface
3. Connect the public `/rush` page to load data from Supabase

