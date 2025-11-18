# 📘 KTP Website Admin Portal — Project Steps (High-Level Overview)

This document outlines the **architecture**, **setup steps**, and **implementation phases** required to add a secure admin portal and CMS to the KTP website using **Supabase (Postgres + Auth)** and **Next.js**.

---

# 🚀 Goal

Create a secure `/admin` dashboard where authorized KTP admins can:

- Sign in with **Google + @umich.edu** email  
- Edit and manage the **Rush Schedule**
- Have changes reflected instantly on the public `/rush` page

---

# 1. Supabase Setup

## 1.1 Create Supabase Project
- Create a new project at https://supabase.com
- Retrieve:
  - Project URL  
  - Public `anon` key  

## 1.2 Add Environment Variables
Add the following to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=<your-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

## 1.3 Enable Google Auth
- Go to **Authentication → Providers → Google**
- Enable Google OAuth
- Add redirect URLs for development + production

## 1.4 Create Admins Table
Create an `admins` table to determine who can access `/admin`:

```
admins (id uuid primary key)
```

After the first login, insert your own user ID.

---

# 2. Authentication Flow

## 2.1 Login Page
- Add a `/login` page with a **“Sign in with Google”** button
- Use Google OAuth through Supabase
- Add a hint restricting to `@umich.edu` (`hd=umich.edu`)

## 2.2 Server-Side Verification
Every `/admin` page or API route must:
1. Check user is logged in  
2. Ensure email ends with `@umich.edu`  
3. Confirm user is in the `admins` table  

Unauthorized users should be redirected.

---

# 3. Rush Schedule Database Table

Create `rush_events` table.  
**Date & time should be combined into one text field** (per your request):

Fields:

- `title` (text)
- `datetime` (text) — combined date/time
- `location` (text)
- `description` (text, optional)
- `button_label` (text, optional)
- `button_url` (text, optional)
- `order_index` (int for sorting)

This table maps directly to your UI.

---

# 4. Public Rush Page (`/rush`)

Convert the page from hardcoded data → dynamic data loaded from Supabase.

The page should:
- Fetch all rush events from `rush_events`
- Order by `order_index`
- Render using your existing timeline component

This page is always public and read-only.

---

# 5. Admin Dashboard (`/admin`)

## 5.1 Protected Layout
Wrap all admin pages in a layout that:
- Checks Supabase user
- Verifies UMich email
- Confirms admin status using `admins` table

## 5.2 Admin Homepage
The dashboard should contain:
- A “Rush Schedule” management widget
- Ability to add more widgets in the future

---

# 6. Rush Schedule Admin Widget

This widget should include:

### View Mode:
- Shows the current rush schedule exactly as `/rush` does

### Edit Mode:
Admins can:
- Edit fields:
  - Title  
  - Date/Time (combined text field)  
  - Location  
  - Description  
  - Button label  
  - Button URL  
- Reorder events  
- Add/remove events  
- Save changes  

Saving triggers an Admin-only API route.

---

# 7. Admin API Route

Create an API endpoint such as:

```
/api/rush-events/bulk
```

This route must:
- Validate the user is an admin  
- Accept the list of updated events  
- Update the `rush_events` table:
  - Insert new events  
  - Update existing events  
  - Delete removed events  
  - Reassign ordering  

This ensures `/rush` always reflects the latest data.

---

# 8. Final Integration

## 8.1 Public + Admin Sync
Changes saved in `/admin` appear immediately on `/rush`.

## 8.2 UI Consistency
- Reuse your existing Rush timeline component  
- Admin version should look similar but editable

---

# 9. Optional Future Extensions

This setup supports future features:
- Member directory
- E-board role management
- Rush cycle switching
- Chapters resources
- Analytics + dashboards

---

# ✅ Summary Checklist (for Cursor)

1. Add Supabase env vars  
2. Create Supabase clients (browser + server)  
3. Build Google login page  
4. Protect `/admin` with auth + admin checks  
5. Create `admins` table  
6. Create `rush_events` table (with combined datetime text field)  
7. Convert `/rush` to load from DB  
8. Implement admin dashboard  
9. Build rush schedule edit widget  
10. Add admin-only API route for saving  
