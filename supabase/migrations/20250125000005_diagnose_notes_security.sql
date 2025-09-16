/*
  # Diagnose Notes Security Issues

  This migration helps diagnose why notes might be visible to all users:
  1. Checks authentication context
  2. Verifies user ID formats
  3. Tests RLS policies
  4. Identifies potential issues
*/

-- Create a diagnostic function to check authentication and RLS
CREATE OR REPLACE FUNCTION diagnose_notes_security()
RETURNS TABLE (
  check_name text,
  result text,
  details text
) AS $$
DECLARE
    current_user_id uuid;
    current_role text;
    notes_count integer;
    user_notes_count integer;
    rls_enabled boolean;
    policy_count integer;
BEGIN
    -- Get current authentication context
    current_user_id := auth.uid();
    current_role := auth.role();
    
    -- Check 1: Authentication context
    IF current_user_id IS NULL THEN
        RETURN QUERY SELECT 'Authentication Check'::text, 'FAILED'::text, 'No authenticated user found'::text;
    ELSE
        RETURN QUERY SELECT 'Authentication Check'::text, 'PASSED'::text, 
            format('User ID: %s, Role: %s', current_user_id, current_role)::text;
    END IF;
    
    -- Check 2: RLS status
    SELECT rowsecurity INTO rls_enabled FROM pg_tables WHERE tablename = 'notes';
    IF rls_enabled THEN
        RETURN QUERY SELECT 'RLS Status Check'::text, 'PASSED'::text, 'RLS is enabled on notes table'::text;
    ELSE
        RETURN QUERY SELECT 'RLS Status Check'::text, 'FAILED'::text, 'RLS is NOT enabled on notes table'::text;
    END IF;
    
    -- Check 3: Policy count
    SELECT COUNT(*) INTO policy_count FROM pg_policies WHERE tablename = 'notes';
    IF policy_count = 4 THEN
        RETURN QUERY SELECT 'Policy Count Check'::text, 'PASSED'::text, 
            format('Found %s policies as expected', policy_count)::text;
    ELSE
        RETURN QUERY SELECT 'Policy Count Check'::text, 'FAILED'::text, 
            format('Found %s policies, expected 4', policy_count)::text;
    END IF;
    
    -- Check 4: Notes visibility (this is the critical test)
    SELECT COUNT(*) INTO notes_count FROM notes;
    SELECT COUNT(*) INTO user_notes_count FROM notes WHERE user_id = current_user_id;
    
    IF notes_count = user_notes_count THEN
        RETURN QUERY SELECT 'Notes Visibility Check'::text, 'PASSED'::text, 
            format('User can only see %s notes (all their own)', user_notes_count)::text;
    ELSE
        RETURN QUERY SELECT 'Notes Visibility Check'::text, 'FAILED'::text, 
            format('User can see %s total notes, %s their own, %s from other users', 
                   notes_count, user_notes_count, notes_count - user_notes_count)::text;
    END IF;
    
    -- Check 5: User ID format consistency
    IF EXISTS (SELECT 1 FROM notes WHERE user_id IS NOT NULL AND user_id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$') THEN
        RETURN QUERY SELECT 'User ID Format Check'::text, 'WARNING'::text, 
            'Some notes have non-standard user_id formats'::text;
    ELSE
        RETURN QUERY SELECT 'User ID Format Check'::text, 'PASSED'::text, 
            'All user_ids are in proper UUID format'::text;
    END IF;
    
    -- Check 6: Test direct policy enforcement
    BEGIN
        -- Try to access a note that doesn't belong to the current user
        IF EXISTS (SELECT 1 FROM notes WHERE user_id != current_user_id LIMIT 1) THEN
            RETURN QUERY SELECT 'Policy Enforcement Test'::text, 'FAILED'::text, 
                'RLS policies are not working - user can see other users notes'::text;
        ELSE
            RETURN QUERY SELECT 'Policy Enforcement Test'::text, 'PASSED'::text, 
                'RLS policies are working correctly'::text;
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            RETURN QUERY SELECT 'Policy Enforcement Test'::text, 'ERROR'::text, SQLERRM::text;
    END;
    
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to test notes access with different user contexts
CREATE OR REPLACE FUNCTION test_notes_access_with_user(test_user_id uuid)
RETURNS TABLE (
  test_name text,
  result text,
  details text
) AS $$
DECLARE
    notes_count integer;
    user_notes_count integer;
BEGIN
    -- Count total notes visible
    SELECT COUNT(*) INTO notes_count FROM notes;
    
    -- Count notes belonging to the test user
    SELECT COUNT(*) INTO user_notes_count FROM notes WHERE user_id = test_user_id;
    
    IF notes_count = user_notes_count THEN
        RETURN QUERY SELECT 'User Access Test'::text, 'PASSED'::text, 
            format('User %s can only see %s notes (all their own)', test_user_id, user_notes_count)::text;
    ELSE
        RETURN QUERY SELECT 'User Access Test'::text, 'FAILED'::text, 
            format('User %s can see %s total notes, %s their own, %s from other users', 
                   test_user_id, notes_count, user_notes_count, notes_count - user_notes_count)::text;
    END IF;
    
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION diagnose_notes_security TO authenticated;
GRANT EXECUTE ON FUNCTION test_notes_access_with_user TO authenticated;

-- Run the diagnostic
SELECT 'Running Notes Security Diagnostics...' as status;
SELECT * FROM diagnose_notes_security();

-- Show current policies
SELECT 
    'Current Notes Policies:' as info,
    policyname as policy_name,
    cmd as command,
    qual as using_clause,
    with_check as with_check_clause
FROM pg_policies 
WHERE tablename = 'notes'
ORDER BY policyname;

-- Show sample notes data (without sensitive content)
SELECT 
    'Sample Notes Data:' as info,
    id,
    user_id,
    title,
    category,
    created_at
FROM notes 
ORDER BY created_at DESC 
LIMIT 5;
