-- Temporarily disable RLS for Firebase auth compatibility
-- Run this script in your Supabase SQL Editor for testing

-- Disable RLS for all tables
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE prayers DISABLE ROW LEVEL SECURITY;

-- Disable RLS for other tables if they exist
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'dreams') THEN
        ALTER TABLE dreams DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'quiz_sessions') THEN
        ALTER TABLE quiz_sessions DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_quiz_stats') THEN
        ALTER TABLE user_quiz_stats DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Grant all permissions to authenticated users
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON mood_entries TO authenticated;
GRANT ALL ON daily_activities TO authenticated;
GRANT ALL ON prayers TO authenticated;

-- Grant permissions for other tables if they exist
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'dreams') THEN
        GRANT ALL ON dreams TO authenticated;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'quiz_sessions') THEN
        GRANT ALL ON quiz_sessions TO authenticated;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_quiz_stats') THEN
        GRANT ALL ON user_quiz_stats TO authenticated;
    END IF;
END $$;

-- Verify RLS is disabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('profiles', 'mood_entries', 'daily_activities', 'prayers', 'dreams', 'quiz_sessions', 'user_quiz_stats')
ORDER BY tablename;

-- Show current permissions
SELECT 
    grantee,
    table_name,
    privilege_type
FROM information_schema.role_table_grants 
WHERE table_name IN ('profiles', 'mood_entries', 'daily_activities', 'prayers', 'dreams', 'quiz_sessions', 'user_quiz_stats')
AND grantee = 'authenticated'
ORDER BY table_name, privilege_type;
