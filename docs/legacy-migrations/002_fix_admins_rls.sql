-- Fix the infinite recursion issue in admins table RLS policy
-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Admins can read admins table" ON admins;

-- Create a new policy that allows authenticated users to read the admins table
-- This is safe because we're checking admin status server-side anyway
-- The admins table only contains user IDs, no sensitive data
CREATE POLICY "Authenticated users can read admins table"
  ON admins
  FOR SELECT
  TO authenticated
  USING (true);

-- Keep the insert/update/delete restricted to admins using a function
-- Create a function to check if a user is an admin (bypasses RLS)
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the policy for INSERT/UPDATE/DELETE to use the function
DROP POLICY IF EXISTS "Admins can manage rush events" ON rush_events;

CREATE POLICY "Admins can manage rush events"
  ON rush_events
  FOR ALL
  USING (is_admin(auth.uid()));

