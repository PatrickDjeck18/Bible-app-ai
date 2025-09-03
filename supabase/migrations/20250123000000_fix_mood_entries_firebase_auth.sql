-- Fix RLS policies for mood_entries table to work with Firebase authentication
-- Since the app uses Firebase Auth, we need to create policies that don't rely on auth.uid()

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage own mood entries" ON mood_entries;
DROP POLICY IF EXISTS "Allow all operations on mood_entries" ON mood_entries;
DROP POLICY IF EXISTS "Allow authenticated users to manage mood entries" ON mood_entries;

-- Option 1: Disable RLS for mood_entries (simplest solution for Firebase auth)
-- ALTER TABLE mood_entries DISABLE ROW LEVEL SECURITY;

-- Option 2: Create a permissive policy that allows all authenticated users
-- This is more secure than disabling RLS but still allows Firebase auth to work
CREATE POLICY "Allow authenticated users to manage mood entries"
  ON mood_entries
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON mood_entries TO authenticated;

-- Create a function to help with user ID validation
CREATE OR REPLACE FUNCTION validate_user_id(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  -- Check if the user exists in profiles table
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION validate_user_id(uuid) TO authenticated;
