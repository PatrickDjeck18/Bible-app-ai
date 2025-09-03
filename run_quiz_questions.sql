-- Run Comprehensive Quiz Questions
-- This script adds 50+ questions per category for the Bible quiz system

-- First, let's check how many questions we currently have
SELECT 'Current Questions Count' as status, COUNT(*) as total_questions FROM quiz_questions;

-- Now let's add the Old Testament questions
\i quiz_questions_old_testament.sql

-- Now let's add the New Testament questions  
\i quiz_questions_new_testament.sql

-- Let's verify the questions were added
SELECT 'After Adding Questions' as status, COUNT(*) as total_questions FROM quiz_questions;

-- Check questions per category
SELECT category, COUNT(*) as question_count 
FROM quiz_questions 
GROUP BY category 
ORDER BY category;

-- Check questions per difficulty
SELECT difficulty, COUNT(*) as question_count 
FROM quiz_questions 
GROUP BY difficulty 
ORDER BY difficulty;

-- Check questions per testament
SELECT testament, COUNT(*) as question_count 
FROM quiz_questions 
GROUP BY testament 
ORDER BY testament;
