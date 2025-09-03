-- Create daily_activities table for the Bible app
-- Run this SQL in your Supabase SQL editor to fix the database errors

-- Create daily_activities table
CREATE TABLE IF NOT EXISTS daily_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date date DEFAULT CURRENT_DATE,
  bible_reading_minutes integer DEFAULT 0,
  prayer_minutes integer DEFAULT 0,
  devotional_completed boolean DEFAULT false,
  mood_rating integer CHECK (mood_rating >= 1 AND mood_rating <= 10),
  activities_completed integer DEFAULT 0,
  goal_percentage integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, activity_date)
);

-- Enable Row Level Security
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own daily activities
CREATE POLICY "Users can manage own daily activities"
  ON daily_activities
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create function to update updated_at timestamp (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_daily_activities_updated_at 
  BEFORE UPDATE ON daily_activities 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (optional)
-- INSERT INTO daily_activities (user_id, activity_date, bible_reading_minutes, prayer_minutes, devotional_completed, mood_rating, activities_completed, goal_percentage)
-- VALUES 
--   ('your-user-id-here', CURRENT_DATE, 15, 10, true, 8, 4, 100),
--   ('your-user-id-here', CURRENT_DATE - INTERVAL '1 day', 10, 5, false, 6, 2, 50);

