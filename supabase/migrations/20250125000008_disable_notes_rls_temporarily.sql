/*
  # Temporarily Disable Notes RLS for Testing

  This migration temporarily disables RLS on the notes table to test if the issue
  is with the RLS policies or with the authentication setup.
  
  WARNING: This makes notes visible to all authenticated users!
  Only use this for testing, then re-enable proper RLS.
*/

-- Temporarily disable RLS on notes table
ALTER TABLE notes DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "notes_select_own" ON notes;
DROP POLICY IF EXISTS "notes_insert_own" ON notes;
DROP POLICY IF EXISTS "notes_update_own" ON notes;
DROP POLICY IF EXISTS "notes_delete_own" ON notes;

-- Drop the function
DROP FUNCTION IF EXISTS is_owner(uuid);

-- Show status
SELECT 
    'RLS Temporarily Disabled' as status,
    'Notes table is now accessible to all authenticated users' as warning,
    'Use this only for testing!' as note;

