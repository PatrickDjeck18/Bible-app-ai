-- Fix foreign key constraint in mood_entries table
-- Change from referencing profiles(id) to auth.users(id)

-- Drop the existing foreign key constraint
ALTER TABLE mood_entries DROP CONSTRAINT IF EXISTS mood_entries_user_id_fkey;

-- Add new foreign key constraint referencing auth.users
ALTER TABLE mood_entries 
ADD CONSTRAINT mood_entries_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
