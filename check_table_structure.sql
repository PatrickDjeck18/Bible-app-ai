-- Diagnostic SQL to check table structure
-- Run this first to see what columns actually exist

-- Check if the prayers table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'prayers'
) as table_exists;

-- If table exists, show its current structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'prayers' 
ORDER BY ordinal_position;

-- Show the actual table definition
SELECT 
    schemaname,
    tablename,
    attname,
    format_type(atttypid, atttypmod) as data_type,
    attnotnull as not_null,
    attndims as dimensions
FROM pg_attribute
JOIN pg_class ON pg_attribute.attrelid = pg_class.oid
JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
WHERE pg_class.relname = 'prayers'
AND pg_attribute.attnum > 0
AND NOT pg_attribute.attisdropped
ORDER BY pg_attribute.attnum;

-- Check for any existing data
SELECT COUNT(*) as row_count FROM prayers;

-- If there are rows, show a sample
SELECT * FROM prayers LIMIT 3;






