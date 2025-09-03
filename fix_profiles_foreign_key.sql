-- Fix foreign key constraint in profiles table to work with Firebase auth
-- Run this script in your Supabase SQL Editor

-- First, let's see the current foreign key constraints on profiles table
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
    AND tc.table_name='profiles';

-- Drop the foreign key constraint that references auth.users
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Verify the constraint was dropped
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
    AND tc.table_name='profiles';

-- Now try to create the profile again
INSERT INTO profiles (id, full_name, email, journey_start_date, created_at, updated_at)
VALUES (
    '175edd99-0000-4000-8000-000000000000',
    'User',
    'user@example.com',
    CURRENT_DATE,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    updated_at = NOW();

-- Verify the profile was created
SELECT * FROM profiles WHERE id = '175edd99-0000-4000-8000-000000000000';
