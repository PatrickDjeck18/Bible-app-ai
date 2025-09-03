-- Fix RLS policy for mood_entries table to work with current setup
-- The issue is that we're storing auth user IDs but the RLS policy might not be working correctly

-- Drop the existing policy
DROP POLICY IF EXISTS "Users can manage own mood entries" ON mood_entries;

-- Create a new policy that allows users to manage their own mood entries
-- This policy will work with auth user IDs stored in user_id column
CREATE POLICY "Users can manage own mood entries"
  ON mood_entries
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Also ensure the table has the correct permissions
GRANT ALL ON mood_entries TO authenticated;
