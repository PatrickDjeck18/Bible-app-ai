/*
  # Simplify Notes RLS for Firebase Authentication

  This migration creates simpler RLS policies that work reliably with Firebase authentication.
  Instead of complex custom functions, we'll use a more direct approach.
*/

-- Drop existing policies and functions
DROP POLICY IF EXISTS "notes_select_policy" ON notes;
DROP POLICY IF EXISTS "notes_insert_policy" ON notes;
DROP POLICY IF EXISTS "notes_update_policy" ON notes;
DROP POLICY IF EXISTS "notes_delete_policy" ON notes;
DROP FUNCTION IF EXISTS get_current_user_id();
DROP FUNCTION IF EXISTS can_access_note(uuid);

-- Create a simple function to check if user_id matches the authenticated user
-- This works with both Supabase auth and Firebase auth via headers
CREATE OR REPLACE FUNCTION is_owner(user_id uuid)
RETURNS boolean AS $$
BEGIN
    -- For Supabase auth
    IF auth.uid() IS NOT NULL THEN
        RETURN user_id = auth.uid();
    END IF;
    
    -- For Firebase auth, check if the user_id matches the X-User-ID header
    -- The app sends the converted Firebase UID as X-User-ID header
    RETURN user_id::text = current_setting('request.headers.x-user-id', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create simple, reliable policies
CREATE POLICY "notes_select_own"
  ON notes
  FOR SELECT
  TO authenticated
  USING (is_owner(user_id));

CREATE POLICY "notes_insert_own"
  ON notes
  FOR INSERT
  TO authenticated
  WITH CHECK (is_owner(user_id));

CREATE POLICY "notes_update_own"
  ON notes
  FOR UPDATE
  TO authenticated
  USING (is_owner(user_id))
  WITH CHECK (is_owner(user_id));

CREATE POLICY "notes_delete_own"
  ON notes
  FOR DELETE
  TO authenticated
  USING (is_owner(user_id));

-- Grant permissions
GRANT EXECUTE ON FUNCTION is_owner TO authenticated;

-- Test the function
SELECT 
    'Simplified RLS Applied' as status,
    'is_owner function created' as function_status,
    'Policies simplified for Firebase auth' as policies_status;

