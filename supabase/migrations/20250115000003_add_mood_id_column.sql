-- Add mood_id column to mood_entries table to store specific mood identifiers
-- This will allow us to store the exact mood that was selected (e.g., 'positive_002_happy')

-- Add the mood_id column
ALTER TABLE mood_entries 
ADD COLUMN IF NOT EXISTS mood_id VARCHAR(50);

-- Update existing records to have a default mood_id based on their mood_type and emoji
UPDATE mood_entries 
SET mood_id = CASE 
  WHEN mood_type = 'Happy' AND emoji = '😊' THEN 'positive_002_happy'
  WHEN mood_type = 'Joyful' AND emoji = '🙏' THEN 'positive_001_blessed'
  WHEN mood_type = 'Joyful' AND emoji = '😄' THEN 'positive_003_joyful'
  WHEN mood_type = 'Joyful' AND emoji = '🙏' THEN 'positive_004_grateful'
  WHEN mood_type = 'Joyful' AND emoji = '💕' THEN 'positive_006_loved'
  WHEN mood_type = 'Joyful' AND emoji = '🏆' THEN 'positive_007_proud'
  WHEN mood_type = 'Excited' AND emoji = '🤩' THEN 'positive_005_excited'
  WHEN mood_type = 'Excited' AND emoji = '💪' THEN 'energetic_001_motivated'
  WHEN mood_type = 'Excited' AND emoji = '🎯' THEN 'energetic_002_focused'
  WHEN mood_type = 'Excited' AND emoji = '🎨' THEN 'energetic_003_creative'
  WHEN mood_type = 'Excited' AND emoji = '✨' THEN 'energetic_004_inspired'
  WHEN mood_type = 'Peaceful' AND emoji = '😇' THEN 'calm_001_peaceful'
  WHEN mood_type = 'Peaceful' AND emoji = '🙏' THEN 'calm_004_prayerful'
  WHEN mood_type = 'Calm' AND emoji = '😌' THEN 'calm_002_calm'
  WHEN mood_type = 'Neutral' AND emoji = '😊' THEN 'calm_003_content'
  WHEN mood_type = 'Neutral' AND emoji = '😴' THEN 'challenging_006_tired'
  WHEN mood_type = 'Neutral' AND emoji = '🤔' THEN 'curious_001_curious'
  WHEN mood_type = 'Sad' AND emoji = '😔' THEN 'challenging_001_sad'
  WHEN mood_type = 'Sad' AND emoji = '🥺' THEN 'challenging_007_lonely'
  WHEN mood_type = 'Anxious' AND emoji = '😰' THEN 'challenging_002_anxious'
  WHEN mood_type = 'Stressed' AND emoji = '😓' THEN 'challenging_003_stressed'
  WHEN mood_type = 'Stressed' AND emoji = '😠' THEN 'challenging_004_angry'
  WHEN mood_type = 'Stressed' AND emoji = '😤' THEN 'challenging_005_frustrated'
  WHEN mood_type = 'Worried' AND emoji = '😕' THEN 'challenging_008_confused'
  ELSE 'calm_003_content' -- default fallback
END
WHERE mood_id IS NULL;
