-- Create user profile for the specific user ID that's causing the error
-- Run this script in your Supabase SQL Editor

-- First, let's check if the profile already exists
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM profiles WHERE id = '175edd99-0000-4000-8000-000000000000') 
        THEN 'Profile already exists' 
        ELSE 'Profile does not exist - will create it' 
    END as status;

-- Create the profile if it doesn't exist
INSERT INTO profiles (id, full_name, email, journey_start_date, created_at, updated_at)
VALUES (
    '175edd99-0000-4000-8000-000000000000',
    'User',
    'user@example.com',
    CURRENT_DATE,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Verify the profile was created
SELECT id, full_name, email, journey_start_date, created_at 
FROM profiles 
WHERE id = '175edd99-0000-4000-8000-000000000000';

-- Show all profiles to verify
SELECT id, full_name, email, created_at FROM profiles ORDER BY created_at DESC LIMIT 5;
