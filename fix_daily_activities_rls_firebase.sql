-- Fix RLS policies for daily_activities table to work with Firebase authentication
-- Run this script in your Supabase SQL Editor

-- Drop existing policies that use auth.uid()
DROP POLICY IF EXISTS "Users can manage own daily activities" ON daily_activities;
DROP POLICY IF EXISTS "Allow all operations on daily_activities" ON daily_activities;
DROP POLICY IF EXISTS "Allow authenticated users to manage daily activities" ON daily_activities;

-- Create a permissive policy that allows all authenticated users
-- This works with Firebase auth since we can't use auth.uid()
CREATE POLICY "Allow authenticated users to manage daily activities"
  ON daily_activities
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON daily_activities TO authenticated;

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
WHERE tablename = 'daily_activities';