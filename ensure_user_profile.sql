-- Check and ensure user profiles exist for Firebase auth users
-- Run this script in your Supabase SQL Editor

-- First, let's see what profiles exist
SELECT id, full_name, email, created_at FROM profiles LIMIT 10;

-- Check if the specific user ID exists
-- Replace '175edd99-0000-4000-8000-000000000000' with the actual user ID from the error
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM profiles WHERE id = '175edd99-0000-4000-8000-000000000000') 
        THEN 'Profile exists' 
        ELSE 'Profile does not exist' 
    END as profile_status;

-- If the profile doesn't exist, you can create it manually:
-- INSERT INTO profiles (id, full_name, email, journey_start_date) 
-- VALUES ('175edd99-0000-4000-8000-000000000000', 'User', 'user@example.com', CURRENT_DATE);

-- Or create a function to automatically create profiles
CREATE OR REPLACE FUNCTION ensure_user_profile(user_uuid uuid, user_email text DEFAULT NULL, user_name text DEFAULT NULL)
RETURNS void AS $$
BEGIN
    -- Check if profile exists
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = user_uuid) THEN
        -- Create profile if it doesn't exist
        INSERT INTO profiles (id, full_name, email, journey_start_date)
        VALUES (
            user_uuid,
            COALESCE(user_name, 'User'),
            COALESCE(user_email, 'user@example.com'),
            CURRENT_DATE
        );
        RAISE NOTICE 'Created profile for user: %', user_uuid;
    ELSE
        RAISE NOTICE 'Profile already exists for user: %', user_uuid;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION ensure_user_profile(uuid, text, text) TO authenticated;

-- Test the function (replace with actual user ID)
-- SELECT ensure_user_profile('175edd99-0000-4000-8000-000000000000', 'user@example.com', 'User Name');
