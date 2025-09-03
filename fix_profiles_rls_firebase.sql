-- Fix RLS policies for profiles table to work with Firebase authentication
-- Run this script in your Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create permissive policies that work with Firebase auth
CREATE POLICY "Allow authenticated users to read profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert profiles"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON profiles TO authenticated;

-- Verify the policies were created
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
WHERE tablename = 'profiles';
