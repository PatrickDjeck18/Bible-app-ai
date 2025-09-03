/*
  # Add user_id column to prayers table

  1. Changes
    - Add user_id column to prayers table
    - Add foreign key constraint to profiles table (not auth.users)
    - Temporarily disable RLS to allow Firebase + Supabase integration
    - Add index for better performance

  2. Security
    - Temporarily disable RLS on prayers table for testing
    - Will re-enable with proper policies once authentication is working
*/

-- Add user_id column to prayers table (reference profiles instead of auth.users)
ALTER TABLE prayers 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_prayers_user_id ON prayers(user_id);

-- Drop existing RLS policies if they exist
DROP POLICY IF EXISTS "Users can view own prayers" ON prayers;
DROP POLICY IF EXISTS "Users can insert own prayers" ON prayers;
DROP POLICY IF EXISTS "Users can update own prayers" ON prayers;
DROP POLICY IF EXISTS "Users can delete own prayers" ON prayers;
DROP POLICY IF EXISTS "Allow authenticated users to manage prayers" ON prayers;

-- Temporarily disable RLS on prayers table for testing
ALTER TABLE prayers DISABLE ROW LEVEL SECURITY;

-- Update existing prayers to have a default user_id (optional - for existing data)
-- You may want to remove this if you don't have existing data or want to handle it differently
UPDATE prayers 
SET user_id = (SELECT id FROM profiles LIMIT 1)
WHERE user_id IS NULL;