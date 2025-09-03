-- Comprehensive fix for RLS policies to work with Firebase authentication
-- Run this script in your Supabase SQL Editor

-- ========================================
-- Fix profiles table RLS policies
-- ========================================

-- Drop existing policies for profiles
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create permissive policies for profiles
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
-- Fix foreign key constraint for mood_entries
-- ========================================

-- Drop the existing foreign key constraint
ALTER TABLE mood_entries DROP CONSTRAINT IF EXISTS mood_entries_user_id_fkey;

-- Add new foreign key constraint that references profiles table
ALTER TABLE mood_entries 
ADD CONSTRAINT mood_entries_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- ========================================
-- Verify all changes
-- ========================================

-- Show all policies for both tables
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename IN ('profiles', 'mood_entries')
ORDER BY tablename, policyname;

-- Show foreign key constraints
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name IN ('mood_entries', 'profiles');

-- Show table permissions
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE tablename IN ('profiles', 'mood_entries');
