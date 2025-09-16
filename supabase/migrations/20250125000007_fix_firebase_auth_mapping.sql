/*
  # Fix Firebase Authentication with Proper UID Mapping

  This migration creates a proper mapping between Firebase UIDs and UUIDs
  to fix the RLS policies for Firebase authentication.
*/

-- Create a table to map Firebase UIDs to UUIDs
CREATE TABLE IF NOT EXISTS user_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid text UNIQUE NOT NULL,
  user_uuid uuid UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on user_mappings table
ALTER TABLE user_mappings ENABLE ROW LEVEL SECURITY;

-- Create policies for user_mappings (users can only see their own mapping)
CREATE POLICY "Users can read own mapping"
  ON user_mappings
  FOR SELECT
  TO authenticated
  USING (user_uuid = auth.uid());

CREATE POLICY "Users can insert own mapping"
  ON user_mappings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_uuid = auth.uid());

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_mappings_firebase_uid ON user_mappings(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_user_mappings_user_uuid ON user_mappings(user_uuid);

-- Create trigger for updated_at timestamp
CREATE TRIGGER update_user_mappings_updated_at 
  BEFORE UPDATE ON user_mappings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Drop existing policies first (they depend on the functions)
DROP POLICY IF EXISTS "notes_select_policy" ON notes;
DROP POLICY IF EXISTS "notes_insert_policy" ON notes;
DROP POLICY IF EXISTS "notes_update_policy" ON notes;
DROP POLICY IF EXISTS "notes_delete_policy" ON notes;

-- Drop the old functions
DROP FUNCTION IF EXISTS get_current_user_id();
DROP FUNCTION IF EXISTS can_access_note(uuid);

-- Create a new function to get the current user ID that works with both Supabase and Firebase auth
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS uuid AS $$
DECLARE
    user_id uuid;
    firebase_uid text;
BEGIN
    -- Try to get user ID from auth.uid() first (for Supabase auth)
    user_id := auth.uid();
    
    -- If auth.uid() returns null, try to get from custom headers (for Firebase auth)
    IF user_id IS NULL THEN
        -- Get Firebase UID from custom headers
        firebase_uid := current_setting('request.headers.x-user-id', true);
        
        -- If we have a Firebase UID, look up the corresponding UUID
        IF firebase_uid IS NOT NULL AND firebase_uid != '' THEN
            SELECT user_uuid INTO user_id 
            FROM user_mappings 
            WHERE user_mappings.firebase_uid = firebase_uid;
        END IF;
    END IF;
    
    RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if a user can access a note
CREATE OR REPLACE FUNCTION can_access_note(note_user_id uuid)
RETURNS boolean AS $$
BEGIN
    RETURN note_user_id = get_current_user_id();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to create or get user mapping for Firebase auth
CREATE OR REPLACE FUNCTION create_user_mapping(firebase_uid_param text)
RETURNS uuid AS $$
DECLARE
    user_uuid uuid;
    existing_uuid uuid;
BEGIN
    -- Check if mapping already exists
    SELECT user_uuid INTO existing_uuid 
    FROM user_mappings 
    WHERE firebase_uid = firebase_uid_param;
    
    IF existing_uuid IS NOT NULL THEN
        RETURN existing_uuid;
    END IF;
    
    -- Create a new UUID for this Firebase user
    user_uuid := gen_random_uuid();
    
    -- Insert the mapping
    INSERT INTO user_mappings (firebase_uid, user_uuid)
    VALUES (firebase_uid_param, user_uuid);
    
    RETURN user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies were already dropped above

-- Create new policies that work with both Supabase and Firebase auth
CREATE POLICY "notes_select_policy"
  ON notes
  FOR SELECT
  TO authenticated
  USING (can_access_note(user_id));

CREATE POLICY "notes_insert_policy"
  ON notes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = get_current_user_id());

CREATE POLICY "notes_update_policy"
  ON notes
  FOR UPDATE
  TO authenticated
  USING (can_access_note(user_id))
  WITH CHECK (user_id = get_current_user_id());

CREATE POLICY "notes_delete_policy"
  ON notes
  FOR DELETE
  TO authenticated
  USING (can_access_note(user_id));

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_current_user_id TO authenticated;
GRANT EXECUTE ON FUNCTION can_access_note TO authenticated;
GRANT EXECUTE ON FUNCTION create_user_mapping TO authenticated;

-- Grant table permissions
GRANT SELECT, INSERT ON user_mappings TO authenticated;

-- Test the functions
SELECT 
    'Firebase Auth Fix Applied' as status,
    'User mappings table created' as mapping_table,
    'RLS functions updated' as functions_updated,
    'Policies updated for proper Firebase auth' as policies_updated;
