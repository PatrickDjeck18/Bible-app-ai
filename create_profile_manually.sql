-- Manually create the user profile for the specific user ID
-- Run this script in your Supabase SQL Editor

-- Create the profile
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

-- Show all profiles
SELECT id, full_name, email, created_at FROM profiles ORDER BY created_at DESC LIMIT 5;
