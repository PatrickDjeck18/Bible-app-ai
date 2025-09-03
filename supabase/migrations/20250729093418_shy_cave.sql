/*
  # Create Spiritual App Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `email` (text)
      - `avatar_url` (text, optional)
      - `journey_start_date` (date)
      - `current_streak` (integer, default 0)
      - `total_prayers` (integer, default 0)
      - `total_bible_readings` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `daily_activities`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `activity_date` (date)
      - `bible_reading_minutes` (integer, default 0)
      - `prayer_minutes` (integer, default 0)
      - `devotional_completed` (boolean, default false)
      - `mood_rating` (integer, 1-10)
      - `activities_completed` (integer, default 0)
      - `goal_percentage` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `prayers`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `description` (text)
      - `status` (text, 'active' or 'answered')
      - `frequency` (text, 'daily', 'weekly', 'monthly')
      - `is_shared` (boolean, default false)
      - `is_community` (boolean, default false)
      - `answered_at` (timestamp, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `bible_verses`
      - `id` (uuid, primary key)
      - `reference` (text)
      - `text` (text)
      - `is_daily_verse` (boolean, default false)
      - `date_featured` (date, optional)
      - `created_at` (timestamp)

    - `devotionals`
      - `id` (uuid, primary key)
      - `title` (text)
      - `subtitle` (text)
      - `content` (text)
      - `reading_time_minutes` (integer)
      - `category` (text)
      - `views_count` (integer, default 0)
      - `likes_count` (integer, default 0)
      - `is_featured` (boolean, default false)
      - `featured_date` (date, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access to bible_verses and devotionals
</*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  avatar_url text,
  journey_start_date date DEFAULT CURRENT_DATE,
  current_streak integer DEFAULT 0,
  total_prayers integer DEFAULT 0,
  total_bible_readings integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create daily_activities table
CREATE TABLE IF NOT EXISTS daily_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
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

-- Create prayers table
CREATE TABLE IF NOT EXISTS prayers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'answered')),
  frequency text DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  is_shared boolean DEFAULT false,
  is_community boolean DEFAULT false,
  answered_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bible_verses table
CREATE TABLE IF NOT EXISTS bible_verses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL,
  text text NOT NULL,
  is_daily_verse boolean DEFAULT false,
  date_featured date,
  created_at timestamptz DEFAULT now()
);

-- Create devotionals table
CREATE TABLE IF NOT EXISTS devotionals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  content text NOT NULL,
  reading_time_minutes integer DEFAULT 5,
  category text DEFAULT 'Inspirational',
  views_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  featured_date date,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE devotionals ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Daily activities policies
CREATE POLICY "Users can manage own daily activities"
  ON daily_activities
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Prayers policies
CREATE POLICY "Users can manage own prayers"
  ON prayers
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Bible verses policies (public read)
CREATE POLICY "Anyone can read bible verses"
  ON bible_verses
  FOR SELECT
  TO authenticated
  USING (true);

-- Devotionals policies (public read)
CREATE POLICY "Anyone can read devotionals"
  ON devotionals
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample data
INSERT INTO bible_verses (reference, text, is_daily_verse, date_featured) VALUES
('Jeremiah 29:11', '"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future."', true, CURRENT_DATE),
('Philippians 4:13', 'I can do all things through Christ who strengthens me.', false, null),
('Psalm 23:1', 'The Lord is my shepherd, I shall not want.', false, null);

INSERT INTO devotionals (title, subtitle, content, reading_time_minutes, category, is_featured, featured_date, views_count, likes_count) VALUES
('Walking in Faith', 'Trusting God in uncertain times', 'Faith is not about having all the answers, but trusting God even when we don''t understand. Today, let''s explore how to strengthen our faith journey and learn to walk confidently in God''s promises, even when the path ahead seems unclear.', 5, 'Inspirational', true, CURRENT_DATE, 1200, 89);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_activities_updated_at BEFORE UPDATE ON daily_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prayers_updated_at BEFORE UPDATE ON prayers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();