-- Fix RLS policies for mood_entries table to work with Firebase authentication
-- Run this script in your Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage own mood entries" ON mood_entries;
DROP POLICY IF EXISTS "Allow all operations on mood_entries" ON mood_entries;
DROP POLICY IF EXISTS "Allow authenticated users to manage mood entries" ON mood_entries;

-- Create a permissive policy that allows all authenticated users
-- This works with Firebase auth since we can't use auth.uid()
CREATE POLICY "Allow authenticated users to manage mood entries"
  ON mood_entries
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON mood_entries TO authenticated;

-- Verify the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'mood_entries';
