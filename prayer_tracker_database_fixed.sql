-- Prayer Tracker Database Setup - FIXED VERSION
-- Run this SQL manually in your database management tool

-- First, drop the existing table if it exists (WARNING: This will delete all data)
DROP TABLE IF EXISTS prayers CASCADE;

-- Drop any existing functions and triggers
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP VIEW IF EXISTS prayer_stats CASCADE;
DROP FUNCTION IF EXISTS get_prayers_by_category(VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS get_prayers_by_priority(VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS search_prayers(TEXT) CASCADE;

-- Create the prayers table with correct structure
CREATE TABLE prayers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'answered', 'paused')),
    category VARCHAR(20) NOT NULL DEFAULT 'personal' CHECK (category IN ('personal', 'family', 'health', 'work', 'spiritual', 'community', 'world', 'other')),
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    answered_at TIMESTAMP WITH TIME ZONE,
    user_id UUID -- Add this if you want to support multiple users
);

-- Verify the table was created correctly
SELECT 'Table created successfully' as status, 
       COUNT(*) as column_count 
FROM information_schema.columns 
WHERE table_name = 'prayers';

-- Show the table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'prayers' 
ORDER BY ordinal_position;

-- Create indexes for better performance
CREATE INDEX idx_prayers_status ON prayers(status);
CREATE INDEX idx_prayers_category ON prayers(category);
CREATE INDEX idx_prayers_priority ON prayers(priority);
CREATE INDEX idx_prayers_created_at ON prayers(created_at DESC);
CREATE INDEX idx_prayers_user_id ON prayers(user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_prayers_updated_at 
    BEFORE UPDATE ON prayers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample prayer data
INSERT INTO prayers (title, description, status, category, priority, created_at) VALUES
('Healing for my grandmother', 'Praying for complete recovery from surgery', 'active', 'family', 'high', NOW() - INTERVAL '5 days'),
('Job interview success', 'Important interview for senior developer position', 'active', 'work', 'urgent', NOW() - INTERVAL '2 days'),
('Peace in our community', 'Praying for unity and understanding among neighbors', 'active', 'community', 'medium', NOW() - INTERVAL '1 week'),
('Spiritual growth', 'Deepening my relationship with God', 'active', 'spiritual', 'high', NOW() - INTERVAL '3 days'),
('Financial wisdom', 'Making wise decisions about investments and savings', 'paused', 'personal', 'medium', NOW() - INTERVAL '2 weeks'),
('Mission trip preparation', 'Preparing for upcoming mission trip to Africa', 'active', 'spiritual', 'high', NOW() - INTERVAL '1 day'),
('Health recovery', 'Recovering from recent illness', 'answered', 'health', 'high', NOW() - INTERVAL '3 weeks'),
('Family reconciliation', 'Healing broken relationships in our family', 'active', 'family', 'urgent', NOW() - INTERVAL '4 days'),
('Work project success', 'Completing major project on time and within budget', 'active', 'work', 'medium', NOW() - INTERVAL '1 week'),
('World peace', 'Praying for peace in conflict zones around the world', 'active', 'world', 'low', NOW() - INTERVAL '2 weeks');

-- Update some prayers to have answered_at dates
UPDATE prayers 
SET answered_at = NOW() - INTERVAL '1 week', 
    status = 'answered' 
WHERE title = 'Health recovery';

-- Verify data was inserted
SELECT 'Data inserted successfully' as status, COUNT(*) as prayer_count FROM prayers;

-- Create a view for prayer statistics
CREATE OR REPLACE VIEW prayer_stats AS
SELECT 
    COUNT(*) as total_prayers,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_prayers,
    COUNT(CASE WHEN status = 'answered' THEN 1 END) as answered_prayers,
    COUNT(CASE WHEN status = 'paused' THEN 1 END) as paused_prayers,
    COUNT(CASE WHEN priority = 'urgent' THEN 1 END) as urgent_prayers,
    COUNT(CASE WHEN priority = 'high' THEN 1 END) as high_priority_prayers,
    COUNT(CASE WHEN category = 'spiritual' THEN 1 END) as spiritual_prayers,
    COUNT(CASE WHEN category = 'family' THEN 1 END) as family_prayers,
    COUNT(CASE WHEN category = 'health' THEN 1 END) as health_prayers,
    COUNT(CASE WHEN category = 'work' THEN 1 END) as work_prayers
FROM prayers;

-- Create a function to get prayers by category
CREATE OR REPLACE FUNCTION get_prayers_by_category(prayer_category VARCHAR(20))
RETURNS TABLE (
    id UUID,
    title VARCHAR(255),
    description TEXT,
    status VARCHAR(20),
    category VARCHAR(20),
    priority VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE,
    answered_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.title, p.description, p.status, p.category, p.priority, p.created_at, p.answered_at
    FROM prayers p
    WHERE p.category = prayer_category
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get prayers by priority
CREATE OR REPLACE FUNCTION get_prayers_by_priority(prayer_priority VARCHAR(20))
RETURNS TABLE (
    id UUID,
    title VARCHAR(255),
    description TEXT,
    status VARCHAR(20),
    category VARCHAR(20),
    priority VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE,
    answered_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.title, p.description, p.status, p.category, p.priority, p.created_at, p.answered_at
    FROM prayers p
    WHERE p.priority = prayer_priority
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create a function to search prayers
CREATE OR REPLACE FUNCTION search_prayers(search_term TEXT)
RETURNS TABLE (
    id UUID,
    title VARCHAR(255),
    description TEXT,
    status VARCHAR(20),
    category VARCHAR(20),
    priority VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE,
    answered_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.title, p.description, p.status, p.category, p.priority, p.created_at, p.answered_at
    FROM prayers p
    WHERE p.title ILIKE '%' || search_term || '%'
       OR p.description ILIKE '%' || search_term || '%'
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Test the functions
SELECT 'Testing functions...' as status;

-- Test category function
SELECT COUNT(*) as prayers_by_category FROM get_prayers_by_category('spiritual');

-- Test priority function  
SELECT COUNT(*) as prayers_by_priority FROM get_prayers_by_priority('high');

-- Test search function
SELECT COUNT(*) as search_results FROM search_prayers('healing');

-- Display the created data
SELECT 'Database setup complete!' as status;

-- Show sample data
SELECT 
    title,
    status,
    category,
    priority,
    created_at::date as created_date
FROM prayers 
ORDER BY created_at DESC;

-- Show statistics
SELECT * FROM prayer_stats;






