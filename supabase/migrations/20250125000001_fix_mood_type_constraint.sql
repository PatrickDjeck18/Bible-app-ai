/*
  # Fix Mood Type Constraint
  
  The app is trying to save 'Grateful' as a mood type, but the database constraint
  doesn't include it in the allowed values. This migration updates the constraint
  to include 'Grateful' as a valid mood type.
*/

-- Drop the existing check constraint
ALTER TABLE mood_entries DROP CONSTRAINT IF EXISTS mood_entries_mood_type_check;

-- Add the updated check constraint that includes 'Grateful'
ALTER TABLE mood_entries ADD CONSTRAINT mood_entries_mood_type_check 
CHECK (mood_type IN ('Sad', 'Worried', 'Neutral', 'Happy', 'Joyful', 'Anxious', 'Peaceful', 'Excited', 'Calm', 'Stressed', 'Grateful'));

-- Verify the constraint was updated correctly
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conname = 'mood_entries_mood_type_check';
