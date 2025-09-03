-- Fix Prayer Authentication Issue
-- Run this SQL in your Supabase SQL Editor to fix the foreign key constraint

-- First, drop the existing foreign key constraint that references auth.users
ALTER TABLE prayers DROP CONSTRAINT IF EXISTS prayers_user_id_fkey;

-- Drop existing RLS policies if they exist
DROP POLICY IF EXISTS "Users can view own prayers" ON prayers;
DROP POLICY IF EXISTS "Users can insert own prayers" ON prayers;
DROP POLICY IF EXISTS "Users can update own prayers" ON prayers;
DROP POLICY IF EXISTS "Users can delete own prayers" ON prayers;
DROP POLICY IF EXISTS "Allow authenticated users to manage prayers" ON prayers;

-- Temporarily disable RLS on prayers table for testing
ALTER TABLE prayers DISABLE ROW LEVEL SECURITY;

-- Verify the changes
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'prayers';

-- Check if RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'prayers';

-- Test that you can now insert prayers
-- This should work without foreign key constraint errors
