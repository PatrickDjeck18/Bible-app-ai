/*
  # Add Background Color to Notes Table
  
  This migration adds a background_color field to the notes table to make
  the color background persistent for user notes. This allows users to
  customize the visual appearance of their notes and have those colors
  saved and restored.
*/

-- Add background_color column to notes table
ALTER TABLE notes 
ADD COLUMN background_color text DEFAULT '#ffffff' CHECK (
  background_color ~ '^#[0-9A-Fa-f]{6}$' OR 
  background_color ~ '^#[0-9A-Fa-f]{3}$' OR
  background_color IN ('transparent', 'inherit')
);

-- Add comment for documentation
COMMENT ON COLUMN notes.background_color IS 'Hex color code for note background (e.g., #ffffff, #ff0000) or special values like transparent';

-- Drop the existing search_notes function first (required when changing return type)
DROP FUNCTION IF EXISTS search_notes(text, uuid, text, boolean);

-- Recreate the search_notes function to include background_color
CREATE OR REPLACE FUNCTION search_notes(
  search_term text,
  user_uuid uuid DEFAULT auth.uid(),
  note_category text DEFAULT NULL,
  favorite_only boolean DEFAULT false
)
RETURNS TABLE (
  id uuid,
  title text,
  content text,
  category text,
  tags text[],
  is_favorite boolean,
  mood_rating integer,
  bible_reference text,
  background_color text,
  created_at timestamptz,
  updated_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    n.id,
    n.title,
    n.content,
    n.category,
    n.tags,
    n.is_favorite,
    n.mood_rating,
    n.bible_reference,
    n.background_color,
    n.created_at,
    n.updated_at
  FROM notes n
  WHERE n.user_id = user_uuid
    AND (
      n.title ILIKE '%' || search_term || '%' 
      OR n.content ILIKE '%' || search_term || '%'
      OR search_term = ANY(n.tags)
    )
    AND (note_category IS NULL OR n.category = note_category)
    AND (NOT favorite_only OR n.is_favorite = true)
  ORDER BY n.updated_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the existing notes_with_prayers view first (required when changing column structure)
DROP VIEW IF EXISTS notes_with_prayers;

-- Recreate the notes_with_prayers view to include background_color
CREATE OR REPLACE VIEW notes_with_prayers AS
SELECT 
  n.id,
  n.user_id,
  n.title,
  n.content,
  n.category,
  n.tags,
  n.is_private,
  n.is_favorite,
  n.mood_rating,
  n.bible_reference,
  n.background_color,
  n.related_prayer_id,
  p.title as prayer_title,
  p.status as prayer_status,
  n.created_at,
  n.updated_at
FROM notes n
LEFT JOIN prayers p ON n.related_prayer_id = p.id;

-- Update existing notes to have a default background color if they don't have one
UPDATE notes 
SET background_color = '#ffffff' 
WHERE background_color IS NULL;

-- Create an index for background_color for potential filtering
CREATE INDEX IF NOT EXISTS idx_notes_background_color ON notes(background_color);

-- Show the updated table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'notes' 
ORDER BY ordinal_position;
