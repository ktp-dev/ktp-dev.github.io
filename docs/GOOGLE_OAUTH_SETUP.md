# Google OAuth Setup Guide

This guide will walk you through setting up Google OAuth for Supabase authentication.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top
3. Click **"New Project"**
4. Enter project name: `KTP Admin Portal` (or your preferred name)
5. Click **"Create"**
6. Wait for the project to be created, then select it from the dropdown

## Step 2: Configure OAuth Consent Screen

1. In the left sidebar, go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** (unless you have a Google Workspace account)
3. Click **"Create"**
4. Fill in the required information:
   - **App name**: `KTP Admin Portal`
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
5. Click **"Save and Continue"**
6. On the **Scopes** page, click **"Save and Continue"** (no need to add scopes)
7. On the **Test users** page:
   - Click **"Add Users"**
   - Add your @umich.edu email address
   - Click **"Add"**
   - Click **"Save and Continue"**
8. On the **Summary** page, click **"Back to Dashboard"**

## Step 3: Create OAuth Credentials

1. In the left sidebar, go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**
4. Choose **"Web application"** as the application type
5. Fill in:
   - **Name**: `KTP Admin Portal Web Client`
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (for development)
     - `https://your-domain.com` (for production - add this later)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/auth/callback` (for development)
     - `https://your-domain.com/auth/callback` (for production - add this later)
6. Click **"Create"**
7. **IMPORTANT**: Copy both values that appear:
   - **Client ID** (looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)
   - **Client Secret** (looks like: `GOCSPX-abcdefghijklmnopqrstuvwxyz`)

⚠️ **Save these credentials securely!** You won't be able to see the Client Secret again.

## Step 4: Add Credentials to Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **"Authentication"** → **"Providers"** in the left sidebar
4. Find **"Google"** in the list and click on it
5. Toggle **"Enable Google provider"** to ON
6. Fill in:
   - **Client ID (for OAuth)**: Paste your Google Client ID
   - **Client Secret (for OAuth)**: Paste your Google Client Secret
7. Click **"Save"**

## Step 5: Configure Redirect URLs in Supabase

1. Still in Supabase, go to **"Authentication"** → **"URL Configuration"**
2. Under **"Redirect URLs"**, add:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://your-domain.com/auth/callback` (for production - when you deploy)
3. Click **"Save"**

## Step 6: Test the Setup

1. Make sure your `.env.local` file has your Supabase credentials
2. Start your dev server:
   ```bash
   npm run dev
   ```
3. Navigate to `http://localhost:3000/login`
4. Click **"Log in with Google"**
5. You should see Google's sign-in page
6. Sign in with your @umich.edu email
7. You should be redirected back to your app

## Troubleshooting

### "Error 400: redirect_uri_mismatch"
- Make sure the redirect URL in Supabase matches exactly what you put in Google Cloud Console
- Check both places have: `http://localhost:3000/auth/callback`

### "Access blocked: This app's request is invalid"
- Make sure you added your email as a test user in the OAuth consent screen
- The app might be in "Testing" mode - you need to add test users

### "Invalid client" error
- Double-check that you copied the Client ID and Client Secret correctly
- Make sure there are no extra spaces

### Can't sign in with non-@umich.edu email
- This is expected! The `hd=umich.edu` parameter restricts login to @umich.edu emails only
- If you need to test with a different email, temporarily remove that parameter from the login code

## Production Setup

When you're ready to deploy:

1. In Google Cloud Console, add your production domain to:
   - Authorized JavaScript origins
   - Authorized redirect URIs

2. In Supabase, add your production redirect URL:
   - `https://your-domain.com/auth/callback`

3. Update your OAuth consent screen:
   - Go to "OAuth consent screen"
   - Click "PUBLISH APP" (if you want to allow any Google user)
   - Or keep it in testing mode and add specific users

## Security Notes

- Never commit your Client Secret to git
- The Client Secret is stored securely in Supabase
- The `hd=umich.edu` parameter ensures only @umich.edu emails can sign in
- Make sure your redirect URLs match exactly in both Google and Supabase

