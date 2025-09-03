/*
  # Allow Multiple Mood Entries Per Day

  This migration removes the unique constraint on (user_id, entry_date) 
  to allow users to log multiple moods throughout the day.
*/

-- Remove the unique constraint that prevents multiple mood entries per day
ALTER TABLE mood_entries DROP CONSTRAINT IF EXISTS mood_entries_user_id_entry_date_key;

-- Add a new index for better performance when querying by user and date
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_date_performance 
ON mood_entries(user_id, entry_date);

-- Update the mood_entries table to allow multiple entries per day
-- The existing table structure remains the same, just without the unique constraint




