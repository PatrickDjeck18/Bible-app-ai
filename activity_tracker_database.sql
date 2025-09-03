-- Activity Tracker Database Setup for Supabase
-- Run this SQL manually in your Supabase SQL editor

-- Drop existing tables if they exist (WARNING: This will delete all data)
DROP TABLE IF EXISTS daily_activities CASCADE;
DROP TABLE IF EXISTS activity_categories CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievement_types CASCADE;

-- Create activity categories table
CREATE TABLE activity_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(20),
    color VARCHAR(7),
    target_daily INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily activities table
CREATE TABLE daily_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID, -- Add this if you want to support multiple users
    category_id UUID NOT NULL REFERENCES activity_categories(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create achievement types table
CREATE TABLE achievement_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(20),
    color VARCHAR(7),
    requirement_type VARCHAR(20) NOT NULL, -- 'streak', 'count', 'percentage'
    requirement_value INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user achievements table
CREATE TABLE user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID, -- Add this if you want to support multiple users
    achievement_type_id UUID NOT NULL REFERENCES achievement_types(id) ON DELETE CASCADE,
    unlocked BOOLEAN DEFAULT false,
    unlocked_at TIMESTAMP WITH TIME ZONE,
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert activity categories
INSERT INTO activity_categories (name, description, icon, color, target_daily) VALUES
('Bible Reading', 'Daily Bible reading and study', '📖', '#3B82F6', 1),
('Prayer', 'Daily prayer and meditation', '🙏', '#10B981', 1),
('Worship', 'Worship and praise time', '🎵', '#8B5CF6', 1),
('Devotional', 'Daily devotional reading', '📚', '#F59E0B', 1),
('Gratitude', 'Expressing gratitude and thankfulness', '💝', '#EC4899', 1),
('Service', 'Helping others and community service', '🤝', '#06B6D4', 1),
('Reflection', 'Personal reflection and journaling', '💭', '#6366F1', 1),
('Fellowship', 'Connecting with other believers', '👥', '#84CC16', 1);

-- Insert achievement types
INSERT INTO achievement_types (name, description, icon, color, requirement_type, requirement_value) VALUES
('First Steps', 'Complete your first activity', '🌟', '#FFD700', 'count', 1),
('Week Warrior', 'Complete 7 days in a row', '🔥', '#FF6B6B', 'streak', 7),
('Fortnight Faithful', 'Complete 14 days in a row', '⚡', '#F59E0B', 'streak', 14),
('Monthly Master', 'Complete 30 days in a row', '👑', '#10B981', 'streak', 30),
('Century Club', 'Complete 100 total activities', '💎', '#8B5CF6', 'count', 100),
('Perfect Week', 'Complete all daily goals for 7 days', '🏆', '#FFD700', 'percentage', 100),
('Bible Scholar', 'Complete 50 Bible reading activities', '📚', '#3B82F6', 'count', 50),
('Prayer Warrior', 'Complete 50 prayer activities', '🙏', '#10B981', 'count', 50),
('Gratitude Guru', 'Complete 30 gratitude activities', '💝', '#EC4899', 'count', 30),
('Service Star', 'Complete 25 service activities', '🤝', '#06B6D4', 'count', 25);

-- Insert sample daily activities for the last 30 days
INSERT INTO daily_activities (category_id, completed, completed_at, notes)
SELECT 
    c.id,
    CASE 
        WHEN random() > 0.3 THEN true -- 70% completion rate
        ELSE false
    END,
    CASE 
        WHEN random() > 0.3 THEN 
            NOW() - (interval '1 day' * generate_series(0, 29)) + 
            (interval '1 hour' * floor(random() * 24)) +
            (interval '1 minute' * floor(random() * 60))
        ELSE NULL
    END,
    CASE 
        WHEN random() > 0.7 THEN 
            ARRAY['Great session today!', 'Feeling blessed', 'God is good', 'Amazing insights', 'Powerful time of prayer'][floor(random() * 5 + 1)]
        ELSE NULL
    END
FROM activity_categories c
CROSS JOIN generate_series(0, 29) day_offset;

-- Create indexes for better performance
CREATE INDEX idx_daily_activities_user_id ON daily_activities(user_id);
CREATE INDEX idx_daily_activities_category_id ON daily_activities(category_id);
CREATE INDEX idx_daily_activities_created_at ON daily_activities(created_at DESC);
CREATE INDEX idx_daily_activities_completed ON daily_activities(completed);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_type_id ON user_achievements(achievement_type_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_daily_activities_updated_at 
    BEFORE UPDATE ON daily_activities 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_achievements_updated_at 
    BEFORE UPDATE ON user_achievements 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create a function to get daily activity summary
CREATE OR REPLACE FUNCTION get_daily_activity_summary(target_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
    category_name VARCHAR(50),
    category_icon VARCHAR(20),
    category_color VARCHAR(7),
    completed BOOLEAN,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ac.name,
        ac.icon,
        ac.color,
        da.completed,
        da.completed_at,
        da.notes
    FROM activity_categories ac
    LEFT JOIN daily_activities da ON ac.id = da.category_id 
        AND DATE(da.created_at) = target_date
    ORDER BY ac.name;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get weekly progress
CREATE OR REPLACE FUNCTION get_weekly_progress(start_date DATE DEFAULT CURRENT_DATE - INTERVAL '6 days')
RETURNS TABLE (
    day_name VARCHAR(10),
    date DATE,
    completed_count INTEGER,
    total_count INTEGER,
    percentage INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TO_CHAR(day_series.day, 'Day') as day_name,
        day_series.day as date,
        COALESCE(completed.count, 0) as completed_count,
        (SELECT COUNT(*) FROM activity_categories) as total_count,
        CASE 
            WHEN (SELECT COUNT(*) FROM activity_categories) > 0 THEN
                ROUND((COALESCE(completed.count, 0)::DECIMAL / (SELECT COUNT(*) FROM activity_categories) * 100)::INTEGER)
            ELSE 0
        END as percentage
    FROM generate_series(start_date, start_date + INTERVAL '6 days', INTERVAL '1 day') day_series(day)
    LEFT JOIN (
        SELECT 
            DATE(da.created_at) as day,
            COUNT(*) as count
        FROM daily_activities da
        WHERE da.completed = true
        GROUP BY DATE(da.created_at)
    ) completed ON day_series.day = completed.day
    ORDER BY day_series.day;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get current streak
CREATE OR REPLACE FUNCTION get_current_streak()
RETURNS INTEGER AS $$
DECLARE
    streak_count INTEGER := 0;
    current_date DATE := CURRENT_DATE;
BEGIN
    WHILE EXISTS (
        SELECT 1 FROM daily_activities 
        WHERE DATE(created_at) = current_date 
        AND completed = true
    ) LOOP
        streak_count := streak_count + 1;
        current_date := current_date - INTERVAL '1 day';
    END LOOP;
    
    RETURN streak_count;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get achievement progress
CREATE OR REPLACE FUNCTION get_achievement_progress()
RETURNS TABLE (
    achievement_name VARCHAR(100),
    achievement_description TEXT,
    achievement_icon VARCHAR(20),
    achievement_color VARCHAR(7),
    requirement_type VARCHAR(20),
    requirement_value INTEGER,
    current_progress INTEGER,
    unlocked BOOLEAN,
    progress_percentage INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        at.name,
        at.description,
        at.icon,
        at.color,
        at.requirement_type,
        at.requirement_value,
        COALESCE(ua.progress, 0) as current_progress,
        COALESCE(ua.unlocked, false) as unlocked,
        CASE 
            WHEN at.requirement_value > 0 THEN
                LEAST(ROUND((COALESCE(ua.progress, 0)::DECIMAL / at.requirement_value * 100)::INTEGER), 100)
            ELSE 0
        END as progress_percentage
    FROM achievement_types at
    LEFT JOIN user_achievements ua ON at.id = ua.achievement_type_id
    ORDER BY at.requirement_value;
END;
$$ LANGUAGE plpgsql;

-- Create a view for today's activities
CREATE OR REPLACE VIEW today_activities AS
SELECT 
    ac.id as category_id,
    ac.name as category_name,
    ac.icon as category_icon,
    ac.color as category_color,
    ac.target_daily,
    COALESCE(da.completed, false) as completed,
    da.completed_at,
    da.notes
FROM activity_categories ac
LEFT JOIN daily_activities da ON ac.id = da.category_id 
    AND DATE(da.created_at) = CURRENT_DATE
ORDER BY ac.name;

-- Create a view for activity statistics
CREATE OR REPLACE VIEW activity_stats AS
SELECT 
    COUNT(*) as total_activities,
    COUNT(CASE WHEN completed = true THEN 1 END) as completed_activities,
    COUNT(CASE WHEN completed = false THEN 1 END) as pending_activities,
    ROUND((COUNT(CASE WHEN completed = true THEN 1 END)::DECIMAL / COUNT(*) * 100)::INTEGER) as completion_percentage,
    get_current_streak() as current_streak
FROM daily_activities 
WHERE DATE(created_at) = CURRENT_DATE;

-- Insert initial user achievements (all locked initially)
INSERT INTO user_achievements (achievement_type_id, progress)
SELECT 
    at.id,
    0
FROM achievement_types at;

-- Update some achievements to be unlocked for demo purposes
UPDATE user_achievements 
SET unlocked = true, unlocked_at = NOW(), progress = 1
WHERE id IN (
    SELECT ua.id 
    FROM user_achievements ua
    JOIN achievement_types at ON ua.achievement_type_id = at.id
    WHERE at.name IN ('First Steps', 'Week Warrior')
    LIMIT 2
);

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON TABLE daily_activities TO your_user;
-- GRANT ALL PRIVILEGES ON TABLE activity_categories TO your_user;
-- GRANT ALL PRIVILEGES ON TABLE user_achievements TO your_user;
-- GRANT ALL PRIVILEGES ON TABLE achievement_types TO your_user;
-- GRANT EXECUTE ON FUNCTION get_daily_activity_summary(DATE) TO your_user;
-- GRANT EXECUTE ON FUNCTION get_weekly_progress(DATE) TO your_user;
-- GRANT EXECUTE ON FUNCTION get_current_streak() TO your_user;
-- GRANT EXECUTE ON FUNCTION get_achievement_progress() TO your_user;

-- Display the created data
SELECT 'Database setup complete!' as status;

-- Show sample data
SELECT 'Activity Categories:' as info;
SELECT name, icon, color, target_daily FROM activity_categories;

SELECT 'Today''s Activities:' as info;
SELECT * FROM today_activities;

SELECT 'Weekly Progress:' as info;
SELECT * FROM get_weekly_progress();

SELECT 'Current Streak:' as info;
SELECT get_current_streak() as current_streak;

SELECT 'Achievement Progress:' as info;
SELECT * FROM get_achievement_progress();

SELECT 'Activity Statistics:' as info;
SELECT * FROM activity_stats;






