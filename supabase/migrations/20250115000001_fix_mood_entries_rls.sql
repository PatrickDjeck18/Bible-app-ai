-- Fix RLS policy for mood_entries table
-- Since profiles table might not exist, let's use a simpler approach

-- Drop the existing policy
DROP POLICY IF EXISTS "Users can manage own mood entries" ON mood_entries;

-- Create new policy that directly checks user_id against auth.uid()
-- This assumes user_id stores the auth user ID directly
CREATE POLICY "Users can manage own mood entries"
  ON mood_entries
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());
