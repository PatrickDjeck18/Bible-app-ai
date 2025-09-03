-- Check current user context in Supabase
-- Run this script in your Supabase SQL Editor to diagnose authentication issues

-- ========================================
-- Check Authentication Context
-- ========================================

-- Check if user is authenticated and get their UUID
SELECT 
  'Current User UUID' as check_type,
  auth.uid() as value,
  CASE 
    WHEN auth.uid() IS NULL THEN '❌ No user authenticated'
    WHEN auth.uid()::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN '✅ Valid UUID format'
    ELSE '⚠️ Invalid UUID format'
  END as status;

-- Check user role
SELECT 
  'Current User Role' as check_type,
  auth.role() as value,
  CASE 
    WHEN auth.role() = 'authenticated' THEN '✅ Authenticated user'
    WHEN auth.role() = 'anon' THEN '❌ Anonymous user'
    WHEN auth.role() = 'service_role' THEN '⚠️ Service role (bypasses RLS)'
    ELSE '❓ Unknown role'
  END as status;

-- Check if user exists in auth.users table
SELECT 
  'User in auth.users' as check_type,
  CASE 
    WHEN auth.uid() IS NULL THEN 'N/A - No user authenticated'
    WHEN EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid()) THEN '✅ User exists in auth.users'
    ELSE '❌ User not found in auth.users'
  END as value,
  CASE 
    WHEN auth.uid() IS NULL THEN 'N/A'
    WHEN EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid()) THEN '✅ Found'
    ELSE '❌ Not found'
  END as status;

-- Check if user has a profile
SELECT 
  'User Profile' as check_type,
  CASE 
    WHEN auth.uid() IS NULL THEN 'N/A - No user authenticated'
    WHEN EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid()) THEN '✅ Profile exists'
    ELSE '❌ No profile found'
  END as value,
  CASE 
    WHEN auth.uid() IS NULL THEN 'N/A'
    WHEN EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid()) THEN '✅ Found'
    ELSE '❌ Not found'
  END as status;

-- ========================================
-- Check RLS Status
-- ========================================

-- Check which tables have RLS enabled
SELECT 
  'RLS Status' as check_type,
  tablename as value,
  CASE 
    WHEN rowsecurity THEN '🔒 RLS Enabled'
    ELSE '🔓 RLS Disabled'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'mood_entries', 'daily_activities', 'prayers', 'dreams', 'quiz_sessions', 'user_quiz_stats')
ORDER BY tablename;

-- ========================================
-- Check RLS Policies
-- ========================================

-- Show all RLS policies for relevant tables
SELECT 
  'RLS Policies' as check_type,
  tablename || '.' || policyname as value,
  cmd as status
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'mood_entries', 'daily_activities', 'prayers', 'dreams', 'quiz_sessions', 'user_quiz_stats')
ORDER BY tablename, policyname;

-- ========================================
-- Check Table Permissions
-- ========================================

-- Check permissions for authenticated users
SELECT 
  'Table Permissions' as check_type,
  table_name as value,
  string_agg(privilege_type, ', ') as status
FROM information_schema.role_table_grants 
WHERE grantee = 'authenticated'
  AND table_name IN ('profiles', 'mood_entries', 'daily_activities', 'prayers', 'dreams', 'quiz_sessions', 'user_quiz_stats')
GROUP BY table_name
ORDER BY table_name;

-- ========================================
-- Test Database Access
-- ========================================

-- Test if we can read from profiles table
SELECT 
  'Test Profiles Read' as check_type,
  CASE 
    WHEN auth.uid() IS NULL THEN 'N/A - No user authenticated'
    ELSE (
      SELECT CASE 
        WHEN COUNT(*) > 0 THEN '✅ Can read profiles (' || COUNT(*) || ' rows)'
        ELSE '⚠️ Can read profiles but no data found'
      END
      FROM profiles
      LIMIT 1
    )
  END as value,
  CASE 
    WHEN auth.uid() IS NULL THEN 'N/A'
    ELSE '✅ Success'
  END as status;

-- Test if we can read from mood_entries table
SELECT 
  'Test Mood Entries Read' as check_type,
  CASE 
    WHEN auth.uid() IS NULL THEN 'N/A - No user authenticated'
    ELSE (
      SELECT CASE 
        WHEN COUNT(*) > 0 THEN '✅ Can read mood_entries (' || COUNT(*) || ' rows)'
        ELSE '⚠️ Can read mood_entries but no data found'
      END
      FROM mood_entries
      LIMIT 1
    )
  END as value,
  CASE 
    WHEN auth.uid() IS NULL THEN 'N/A'
    ELSE '✅ Success'
  END as status;

-- ========================================
-- Summary
-- ========================================

-- Create a summary of the authentication state
SELECT 
  'SUMMARY' as check_type,
  CASE 
    WHEN auth.uid() IS NULL THEN '❌ No user authenticated - This is the problem!'
    WHEN auth.role() != 'authenticated' THEN '❌ User not in authenticated role - This is the problem!'
    WHEN NOT EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid()) THEN '❌ User not in auth.users - This is the problem!'
    ELSE '✅ Authentication appears to be working correctly'
  END as value,
  CASE 
    WHEN auth.uid() IS NULL OR auth.role() != 'authenticated' THEN '❌ Authentication Issue'
    ELSE '✅ Authentication OK'
  END as status;
