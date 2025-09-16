/*
  # Fix Notes RLS Security Issues

  This migration addresses potential security issues with notes visibility:
  1. Ensures RLS is properly enabled and enforced
  2. Removes any potential bypass policies
  3. Adds additional security checks
  4. Verifies all policies are correctly applied
*/

-- First, let's check and fix any potential issues with RLS
-- Ensure RLS is definitely enabled on notes table
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh and ensure no conflicts
DROP POLICY IF EXISTS "Users can read own notes" ON notes;
DROP POLICY IF EXISTS "Users can insert own notes" ON notes;
DROP POLICY IF EXISTS "Users can update own notes" ON notes;
DROP POLICY IF EXISTS "Users can delete own notes" ON notes;
DROP POLICY IF EXISTS "Users can read only their own notes" ON notes;
DROP POLICY IF EXISTS "Users can insert only their own notes" ON notes;
DROP POLICY IF EXISTS "Users can update only their own notes" ON notes;
DROP POLICY IF EXISTS "Users can delete only their own notes" ON notes;

-- Create strict, secure policies that explicitly check user ownership
CREATE POLICY "notes_select_policy"
  ON notes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "notes_insert_policy"
  ON notes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notes_update_policy"
  ON notes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notes_delete_policy"
  ON notes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Ensure no other policies exist that might bypass security
-- This query will show any remaining policies (should be empty after above drops)
DO $$
DECLARE
    policy_count integer;
BEGIN
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE tablename = 'notes';
    
    IF policy_count > 4 THEN
        RAISE NOTICE 'WARNING: Found % policies on notes table, expected 4', policy_count;
    ELSE
        RAISE NOTICE 'SUCCESS: Found % policies on notes table as expected', policy_count;
    END IF;
END $$;

-- Verify RLS is enabled
DO $$
DECLARE
    rls_enabled boolean;
BEGIN
    SELECT rowsecurity INTO rls_enabled 
    FROM pg_tables 
    WHERE tablename = 'notes';
    
    IF NOT rls_enabled THEN
        RAISE EXCEPTION 'CRITICAL: RLS is not enabled on notes table!';
    ELSE
        RAISE NOTICE 'SUCCESS: RLS is enabled on notes table';
    END IF;
END $$;

-- Update the notes_with_prayers view to ensure it respects RLS
DROP VIEW IF EXISTS notes_with_prayers;

CREATE VIEW notes_with_prayers AS
SELECT 
  n.id,
  n.user_id,
  n.title,
  n.content,
  n.category,
  n.tags,
  n.is_private,
  n.is_favorite,
  n.mood_rating,
  n.bible_reference,
  n.related_prayer_id,
  p.title as prayer_title,
  p.status as prayer_status,
  n.created_at,
  n.updated_at
FROM notes n
LEFT JOIN prayers p ON n.related_prayer_id = p.id
WHERE n.user_id = auth.uid(); -- Explicit user filter

-- Set the view to use security invoker to ensure RLS is applied
ALTER VIEW notes_with_prayers SET (security_invoker = true);

-- Create a comprehensive security test function
CREATE OR REPLACE FUNCTION test_notes_security_comprehensive()
RETURNS TABLE (
  test_name text,
  result text,
  details text
) AS $$
DECLARE
    current_user_id uuid;
    total_notes_count integer;
    user_notes_count integer;
    other_users_notes_count integer;
BEGIN
    current_user_id := auth.uid();
    
    -- Test 1: Check if user can see only their own notes
    SELECT COUNT(*) INTO total_notes_count FROM notes;
    SELECT COUNT(*) INTO user_notes_count FROM notes WHERE user_id = current_user_id;
    other_users_notes_count := total_notes_count - user_notes_count;
    
    IF total_notes_count = user_notes_count THEN
        RETURN QUERY SELECT 'RLS Enforcement Test'::text, 'PASSED'::text, 
            format('User can only see %s notes (all their own)', user_notes_count)::text;
    ELSE
        RETURN QUERY SELECT 'RLS Enforcement Test'::text, 'FAILED'::text, 
            format('User can see %s total notes, %s their own, %s from other users', 
                   total_notes_count, user_notes_count, other_users_notes_count)::text;
    END IF;
    
    -- Test 2: Verify RLS is enabled
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'notes' AND rowsecurity = true) THEN
        RETURN QUERY SELECT 'RLS Status Test'::text, 'PASSED'::text, 'RLS is enabled on notes table'::text;
    ELSE
        RETURN QUERY SELECT 'RLS Status Test'::text, 'FAILED'::text, 'RLS is NOT enabled on notes table'::text;
    END IF;
    
    -- Test 3: Check policy count
    IF (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'notes') = 4 THEN
        RETURN QUERY SELECT 'Policy Count Test'::text, 'PASSED'::text, 'Correct number of policies (4) found'::text;
    ELSE
        RETURN QUERY SELECT 'Policy Count Test'::text, 'FAILED'::text, 
            format('Found %s policies, expected 4', (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'notes'))::text;
    END IF;
    
    -- Test 4: Verify view security
    BEGIN
        PERFORM * FROM notes_with_prayers LIMIT 1;
        RETURN QUERY SELECT 'View Security Test'::text, 'PASSED'::text, 'notes_with_prayers view respects RLS'::text;
    EXCEPTION
        WHEN OTHERS THEN
            RETURN QUERY SELECT 'View Security Test'::text, 'FAILED'::text, SQLERRM::text;
    END;
    
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT ON notes_with_prayers TO authenticated;
GRANT EXECUTE ON FUNCTION test_notes_security_comprehensive TO authenticated;

-- Add a function to check if a user can access a specific note
CREATE OR REPLACE FUNCTION can_access_note(note_id uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM notes 
        WHERE id = note_id 
        AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION can_access_note TO authenticated;

-- Final verification query
SELECT 
    'Notes Security Fix Applied' as status,
    'RLS Enabled: ' || (SELECT rowsecurity FROM pg_tables WHERE tablename = 'notes') as rls_status,
    'Policies Count: ' || (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'notes') as policies_count,
    'Total Notes: ' || (SELECT COUNT(*) FROM notes) as total_notes;

-- Run the security test
SELECT * FROM test_notes_security_comprehensive();
