-- Quiz Tables Migration
-- Creates tables for storing quiz sessions and user statistics

-- Create quiz_sessions table
CREATE TABLE IF NOT EXISTS quiz_sessions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    questions_answered INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    wrong_answers INTEGER NOT NULL DEFAULT 0,
    total_score INTEGER NOT NULL DEFAULT 0,
    category TEXT NOT NULL DEFAULT 'mixed',
    difficulty TEXT NOT NULL DEFAULT 'mixed',
    time_taken_seconds INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_quiz_stats table
CREATE TABLE IF NOT EXISTS user_quiz_stats (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    total_sessions INTEGER NOT NULL DEFAULT 0,
    total_questions_answered INTEGER NOT NULL DEFAULT 0,
    total_correct_answers INTEGER NOT NULL DEFAULT 0,
    best_score INTEGER NOT NULL DEFAULT 0,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    favorite_category TEXT NOT NULL DEFAULT 'mixed',
    total_time_spent_seconds INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user_id ON quiz_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_completed_at ON quiz_sessions(completed_at);
CREATE INDEX IF NOT EXISTS idx_user_quiz_stats_user_id ON user_quiz_stats(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for user_quiz_stats table
CREATE TRIGGER update_user_quiz_stats_updated_at 
    BEFORE UPDATE ON user_quiz_stats 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for quiz_sessions
CREATE POLICY "Users can view their own quiz sessions" ON quiz_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz sessions" ON quiz_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_quiz_stats
CREATE POLICY "Users can view their own quiz stats" ON user_quiz_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz stats" ON user_quiz_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz stats" ON user_quiz_stats
    FOR UPDATE USING (auth.uid() = user_id);
