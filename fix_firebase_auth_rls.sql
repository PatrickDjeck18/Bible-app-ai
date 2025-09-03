-- Fix RLS policies for Firebase authentication compatibility
-- Run this script in your Supabase SQL Editor

-- ========================================
-- Fix profiles table RLS policies
-- ========================================

-- Drop existing policies for profiles
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to read profiles" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to update profiles" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to insert profiles" ON profiles;

-- Create permissive policies for profiles that work with Firebase auth
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

-- Grant permissions for profiles
GRANT ALL ON profiles TO authenticated;

-- ========================================
-- Fix mood_entries table RLS policies
-- ========================================

-- Drop existing policies for mood_entries
DROP POLICY IF EXISTS "Users can manage own mood entries" ON mood_entries;
DROP POLICY IF EXISTS "Allow all operations on mood_entries" ON mood_entries;
DROP POLICY IF EXISTS "Allow authenticated users to manage mood entries" ON mood_entries;

-- Create permissive policy for mood_entries
CREATE POLICY "Allow authenticated users to manage mood entries"
  ON mood_entries
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Grant permissions for mood_entries
GRANT ALL ON mood_entries TO authenticated;

-- ========================================
-- Fix daily_activities table RLS policies
-- ========================================

-- Drop existing policies for daily_activities
DROP POLICY IF EXISTS "Users can manage own daily activities" ON daily_activities;
DROP POLICY IF EXISTS "Allow all operations for daily activities" ON daily_activities;
DROP POLICY IF EXISTS "Users can manage own daily activities with profile check" ON daily_activities;

-- Create permissive policy for daily_activities
CREATE POLICY "Allow authenticated users to manage daily activities"
  ON daily_activities
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Grant permissions for daily_activities
GRANT ALL ON daily_activities TO authenticated;

-- ========================================
-- Fix prayers table RLS policies
-- ========================================

-- Drop existing policies for prayers
DROP POLICY IF EXISTS "Users can view own prayers" ON prayers;
DROP POLICY IF EXISTS "Users can insert own prayers" ON prayers;
DROP POLICY IF EXISTS "Users can update own prayers" ON prayers;
DROP POLICY IF EXISTS "Users can delete own prayers" ON prayers;
DROP POLICY IF EXISTS "Allow authenticated users to manage prayers" ON prayers;

-- Create permissive policy for prayers
CREATE POLICY "Allow authenticated users to manage prayers"
  ON prayers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Grant permissions for prayers
GRANT ALL ON prayers TO authenticated;

-- ========================================
-- Fix dreams table RLS policies (if it exists)
-- ========================================

-- Drop existing policies for dreams
DROP POLICY IF EXISTS "Users can view their own dreams" ON dreams;
DROP POLICY IF EXISTS "Users can insert their own dreams" ON dreams;
DROP POLICY IF EXISTS "Users can update their own dreams" ON dreams;
DROP POLICY IF EXISTS "Users can delete their own dreams" ON dreams;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON dreams;

-- Create permissive policy for dreams
CREATE POLICY "Allow authenticated users to manage dreams"
  ON dreams
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Grant permissions for dreams
GRANT ALL ON dreams TO authenticated;

-- ========================================
-- Fix quiz tables RLS policies
-- ========================================

-- Drop existing policies for quiz_sessions
DROP POLICY IF EXISTS "Users can view their own quiz sessions" ON quiz_sessions;
DROP POLICY IF EXISTS "Users can insert their own quiz sessions" ON quiz_sessions;

-- Create permissive policy for quiz_sessions
CREATE POLICY "Allow authenticated users to manage quiz sessions"
  ON quiz_sessions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Drop existing policies for user_quiz_stats
DROP POLICY IF EXISTS "Users can view their own quiz stats" ON user_quiz_stats;
DROP POLICY IF EXISTS "Users can insert their own quiz stats" ON user_quiz_stats;
DROP POLICY IF EXISTS "Users can update their own quiz stats" ON user_quiz_stats;

-- Create permissive policy for user_quiz_stats
CREATE POLICY "Allow authenticated users to manage quiz stats"
  ON user_quiz_stats
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Grant permissions for quiz tables
GRANT ALL ON quiz_sessions TO authenticated;
GRANT ALL ON user_quiz_stats TO authenticated;

-- ========================================
-- Verify all changes
-- ========================================

-- Show all policies for all tables
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename IN ('profiles', 'mood_entries', 'daily_activities', 'prayers', 'dreams', 'quiz_sessions', 'user_quiz_stats')
ORDER BY tablename, policyname;

-- Show table permissions
SELECT 
    grantee,
    table_name,
    privilege_type
FROM information_schema.role_table_grants 
WHERE table_name IN ('profiles', 'mood_entries', 'daily_activities', 'prayers', 'dreams', 'quiz_sessions', 'user_quiz_stats')
AND grantee = 'authenticated'
ORDER BY table_name, privilege_type;
