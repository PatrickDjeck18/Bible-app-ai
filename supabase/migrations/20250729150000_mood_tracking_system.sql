/*
  # Create Comprehensive Mood Tracking System

  1. New Tables
    - `mood_entries` - Dedicated table for mood tracking with detailed information
    - `mood_influences` - Junction table for mood influences and notes
    
  2. Features
    - Track mood with intensity (1-10 scale)
    - Multiple influences per mood entry
    - Detailed notes and context
    - Timestamp tracking
    - User-specific data with RLS
*/

-- Create mood_entries table
CREATE TABLE IF NOT EXISTS mood_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  entry_date date NOT NULL,
  mood_type text NOT NULL CHECK (mood_type IN ('Sad', 'Worried', 'Neutral', 'Happy', 'Joyful', 'Anxious', 'Peaceful', 'Excited', 'Calm', 'Stressed')),
  intensity_rating integer NOT NULL CHECK (intensity_rating >= 1 AND intensity_rating <= 10),
  emoji text NOT NULL,
  note text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create mood_influences table
CREATE TABLE IF NOT EXISTS mood_influences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mood_entry_id uuid REFERENCES mood_entries(id) ON DELETE CASCADE,
  influence_name text NOT NULL,
  influence_category text NOT NULL CHECK (influence_category IN ('spiritual', 'social', 'physical', 'emotional', 'environmental', 'work', 'other')),
  created_at timestamptz DEFAULT now()
);

-- Create mood_analytics view for easier querying
CREATE OR REPLACE VIEW mood_analytics AS
SELECT 
  me.user_id,
  me.entry_date,
  me.mood_type,
  me.intensity_rating,
  me.emoji,
  me.note,
  array_agg(mi.influence_name) as influences,
  array_agg(mi.influence_category) as influence_categories
FROM mood_entries me
LEFT JOIN mood_influences mi ON me.id = mi.mood_entry_id
GROUP BY me.id, me.user_id, me.entry_date, me.mood_type, me.intensity_rating, me.emoji, me.note;

-- Enable Row Level Security
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_influences ENABLE ROW LEVEL SECURITY;

-- Mood entries policies
CREATE POLICY "Users can manage own mood entries"
  ON mood_entries
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Mood influences policies
CREATE POLICY "Users can manage own mood influences"
  ON mood_influences
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM mood_entries me 
      WHERE me.id = mood_influences.mood_entry_id 
      AND me.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_date ON mood_entries(user_id, entry_date);
CREATE INDEX IF NOT EXISTS idx_mood_entries_date ON mood_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_mood_influences_entry_id ON mood_influences(mood_entry_id);

-- Create function to get mood streak
CREATE OR REPLACE FUNCTION get_mood_streak(user_uuid uuid)
RETURNS integer AS $$
DECLARE
  streak_count integer := 0;
  current_date date := CURRENT_DATE;
  entry_exists boolean;
BEGIN
  LOOP
    SELECT EXISTS(
      SELECT 1 FROM mood_entries 
      WHERE user_id = user_uuid AND entry_date = current_date
    ) INTO entry_exists;
    
    IF entry_exists THEN
      streak_count := streak_count + 1;
      current_date := current_date - INTERVAL '1 day';
    ELSE
      EXIT;
    END IF;
  END LOOP;
  
  RETURN streak_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get weekly mood average
CREATE OR REPLACE FUNCTION get_weekly_mood_average(user_uuid uuid)
RETURNS numeric AS $$
DECLARE
  week_start date := CURRENT_DATE - INTERVAL '6 days';
  avg_rating numeric;
BEGIN
  SELECT COALESCE(AVG(intensity_rating), 0)
  INTO avg_rating
  FROM mood_entries
  WHERE user_id = user_uuid 
    AND entry_date >= week_start 
    AND entry_date <= CURRENT_DATE;
  
  RETURN ROUND(avg_rating, 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get mood trends
CREATE OR REPLACE FUNCTION get_mood_trends(user_uuid uuid, days_back integer DEFAULT 30)
RETURNS TABLE(
  entry_date date,
  mood_type text,
  intensity_rating integer,
  emoji text,
  influences text[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    me.entry_date,
    me.mood_type,
    me.intensity_rating,
    me.emoji,
    array_agg(mi.influence_name) as influences
  FROM mood_entries me
  LEFT JOIN mood_influences mi ON me.id = mi.mood_entry_id
  WHERE me.user_id = user_uuid 
    AND me.entry_date >= CURRENT_DATE - INTERVAL '1 day' * days_back
  GROUP BY me.id, me.entry_date, me.mood_type, me.intensity_rating, me.emoji
  ORDER BY me.entry_date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for updated_at
CREATE TRIGGER update_mood_entries_updated_at 
  BEFORE UPDATE ON mood_entries 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample mood data for testing (optional)
-- INSERT INTO mood_entries (user_id, entry_date, mood_type, intensity_rating, emoji, note) VALUES
-- ('sample-user-id', CURRENT_DATE, 'Happy', 8, '😊', 'Had a great day at church today!');

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON mood_entries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON mood_influences TO authenticated;
GRANT SELECT ON mood_analytics TO authenticated;








