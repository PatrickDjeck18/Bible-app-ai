-- Fix Mood Entries Table to Allow Multiple Entries Per Day
-- Run this in your Supabase SQL Editor

-- Remove the unique constraint that prevents multiple mood entries per day
ALTER TABLE mood_entries DROP CONSTRAINT IF EXISTS mood_entries_user_id_entry_date_key;

-- Add a new index for better performance when querying by user and date
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_date_performance 
ON mood_entries(user_id, entry_date);

-- Verify the change
SELECT 
    constraint_name,
    table_name,
    constraint_type
FROM information_schema.table_constraints 
WHERE table_name = 'mood_entries' 
AND constraint_type = 'UNIQUE';

-- Show the new index
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE tablename = 'mood_entries' 
AND indexname LIKE '%user_date%';




