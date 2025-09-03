-- Add background color columns to prayers table for customizable prayer card backgrounds

-- Add backgroundColor column for solid colors
ALTER TABLE prayers ADD COLUMN IF NOT EXISTS background_color text;

-- Add gradientColors column for gradient backgrounds (stored as JSON array)
ALTER TABLE prayers ADD COLUMN IF NOT EXISTS gradient_colors jsonb;

-- Add comment for documentation
COMMENT ON COLUMN prayers.background_color IS 'Solid background color for prayer cards (hex color)';
COMMENT ON COLUMN prayers.gradient_colors IS 'Gradient colors for prayer cards (array of hex colors)';

-- Add missing columns that the app expects
ALTER TABLE prayers ADD COLUMN IF NOT EXISTS category text DEFAULT 'personal';
ALTER TABLE prayers ADD COLUMN IF NOT EXISTS priority text DEFAULT 'medium';

-- Add check constraints for category and priority
ALTER TABLE prayers ADD CONSTRAINT check_prayer_category 
    CHECK (category IN ('personal', 'family', 'health', 'work', 'financial', 'spiritual', 'community', 'gratitude'));

ALTER TABLE prayers ADD CONSTRAINT check_prayer_priority 
    CHECK (priority IN ('low', 'medium', 'high', 'urgent'));

-- Update status constraint to include 'paused'
ALTER TABLE prayers DROP CONSTRAINT IF EXISTS prayers_status_check;
ALTER TABLE prayers ADD CONSTRAINT prayers_status_check 
    CHECK (status IN ('active', 'answered', 'paused'));

-- Create indexes for better performance on new columns
CREATE INDEX IF NOT EXISTS idx_prayers_category ON prayers(category);
CREATE INDEX IF NOT EXISTS idx_prayers_priority ON prayers(priority);

-- Show the updated table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'prayers'
ORDER BY ordinal_position;