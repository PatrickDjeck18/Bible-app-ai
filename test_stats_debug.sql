-- Debug script to check user_quiz_stats table
-- Run this in Supabase SQL editor to debug stats issues

-- Check if table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'user_quiz_stats'
);

-- Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_quiz_stats'
ORDER BY ordinal_position;

-- Check if there's any data in the table
SELECT COUNT(*) as total_records FROM user_quiz_stats;

-- Show sample data (if any exists)
SELECT * FROM user_quiz_stats LIMIT 5;

-- Check quiz_questions table
SELECT COUNT(*) as total_questions FROM quiz_questions;

