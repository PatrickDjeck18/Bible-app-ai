-- Test script to verify quiz questions are properly loaded
-- Run this in your Supabase SQL editor to test

-- Check if quiz_questions table exists and has data
SELECT COUNT(*) as total_questions FROM quiz_questions;

-- Get a sample of questions
SELECT 
  id,
  question,
  difficulty,
  category,
  testament,
  correct_answer
FROM quiz_questions 
ORDER BY RANDOM() 
LIMIT 5;

-- Test the random questions function
SELECT * FROM get_random_quiz_questions(3, 'easy', 'gospels');

-- Check user_quiz_stats table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_quiz_stats';

-- Test user stats function (replace with actual user_id)
-- SELECT * FROM get_user_quiz_stats();
