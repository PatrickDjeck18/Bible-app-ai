/*
  # Create Notes System for Spiritual App

  1. New Tables
    - `notes` - Store user's personal notes, reflections, and spiritual insights
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text, required)
      - `content` (text, required)
      - `category` (text, enum: 'reflection', 'prayer', 'study', 'journal', 'insight', 'gratitude', 'other')
      - `tags` (text array, optional)
      - `is_private` (boolean, default true)
      - `is_favorite` (boolean, default false)
      - `mood_rating` (integer, 1-10, optional)
      - `bible_reference` (text, optional)
      - `related_prayer_id` (uuid, references prayers, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Features
    - Personal note-taking and spiritual journaling
    - Categorization and tagging system
    - Integration with prayers and Bible references
    - Privacy controls and favorites
    - Mood tracking integration
    - Search and filtering capabilities

  3. Security
    - Enable RLS on notes table
    - Add policies for authenticated users to manage their own notes
    - Support for private and shared notes (future feature)
*/

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'reflection' CHECK (category IN (
    'reflection', 'prayer', 'study', 'journal', 'insight', 'gratitude', 'other'
  )),
  tags text[] DEFAULT '{}',
  is_private boolean DEFAULT true,
  is_favorite boolean DEFAULT false,
  mood_rating integer CHECK (mood_rating >= 1 AND mood_rating <= 10),
  bible_reference text,
  related_prayer_id uuid REFERENCES prayers(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Notes policies
CREATE POLICY "Users can read own notes"
  ON notes
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own notes"
  ON notes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own notes"
  ON notes
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own notes"
  ON notes
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_category ON notes(category);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_is_favorite ON notes(is_favorite) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_notes_tags ON notes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_notes_bible_reference ON notes(bible_reference) WHERE bible_reference IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notes_related_prayer ON notes(related_prayer_id) WHERE related_prayer_id IS NOT NULL;

-- Create trigger for updated_at timestamp
CREATE TRIGGER update_notes_updated_at 
  BEFORE UPDATE ON notes 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to search notes by content and title
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

-- Create function to get notes statistics
CREATE OR REPLACE FUNCTION get_notes_stats(user_uuid uuid DEFAULT auth.uid())
RETURNS TABLE (
  total_notes bigint,
  notes_by_category jsonb,
  favorite_notes bigint,
  notes_with_bible_refs bigint,
  recent_notes_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_notes,
    jsonb_object_agg(category, count) as notes_by_category,
    COUNT(*) FILTER (WHERE is_favorite = true) as favorite_notes,
    COUNT(*) FILTER (WHERE bible_reference IS NOT NULL) as notes_with_bible_refs,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as recent_notes_count
  FROM (
    SELECT 
      category,
      COUNT(*) as count
    FROM notes 
    WHERE user_id = user_uuid
    GROUP BY category
  ) category_counts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample data for testing
INSERT INTO notes (user_id, title, content, category, tags, is_favorite, mood_rating, bible_reference) VALUES
-- Note: Replace with actual user_id from your profiles table
((SELECT id FROM profiles LIMIT 1), 
 'Morning Reflection', 
 'Today I feel grateful for the new day and the opportunities it brings. I want to focus on being more patient and kind to others.', 
 'reflection', 
 ARRAY['gratitude', 'patience', 'kindness'], 
 true, 
 8, 
 'Psalm 118:24'),

((SELECT id FROM profiles LIMIT 1), 
 'Prayer for Healing', 
 'Lord, I pray for my friend who is going through a difficult time. Please bring them comfort and healing. Help me to be a source of support for them.', 
 'prayer', 
 ARRAY['healing', 'friendship', 'support'], 
 false, 
 6, 
 'James 5:16'),

((SELECT id FROM profiles LIMIT 1), 
 'Bible Study Notes - Romans 8:28', 
 'This verse reminds me that God works all things together for good for those who love Him. Even in difficult circumstances, I can trust that God has a purpose.', 
 'study', 
 ARRAY['romans', 'trust', 'purpose'], 
 true, 
 9, 
 'Romans 8:28'),

((SELECT id FROM profiles LIMIT 1), 
 'Daily Journal Entry', 
 'Had a challenging day at work, but I''m learning to lean on God''s strength. I''m thankful for the small moments of joy that came my way.', 
 'journal', 
 ARRAY['work', 'challenges', 'joy'], 
 false, 
 5, 
 NULL),

((SELECT id FROM profiles LIMIT 1), 
 'Spiritual Insight', 
 'Realized today that forgiveness is not just about the other person, but about freeing myself from bitterness. This is a gift I give to myself.', 
 'insight', 
 ARRAY['forgiveness', 'freedom', 'bitterness'], 
 true, 
 7, 
 'Ephesians 4:32');

-- Create view for notes with related prayer information
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
  n.related_prayer_id,
  p.title as prayer_title,
  p.status as prayer_status,
  n.created_at,
  n.updated_at
FROM notes n
LEFT JOIN prayers p ON n.related_prayer_id = p.id;

-- Grant permissions for the view
GRANT SELECT ON notes_with_prayers TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE notes IS 'User notes for spiritual journaling, reflections, and insights';
COMMENT ON COLUMN notes.category IS 'Type of note: reflection, prayer, study, journal, insight, gratitude, other';
COMMENT ON COLUMN notes.tags IS 'Array of tags for categorizing and searching notes';
COMMENT ON COLUMN notes.is_private IS 'Whether the note is private to the user (future feature for sharing)';
COMMENT ON COLUMN notes.mood_rating IS 'User mood rating from 1-10 when the note was created';
COMMENT ON COLUMN notes.bible_reference IS 'Related Bible verse or passage reference';
COMMENT ON COLUMN notes.related_prayer_id IS 'Link to a related prayer if applicable';

-- Show the created table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'notes' 
ORDER BY ordinal_position;
