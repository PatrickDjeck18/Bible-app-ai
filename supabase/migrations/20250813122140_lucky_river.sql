/*
  # Create Dreams Table and Functions

  1. New Tables
    - `dreams`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `description` (text)
      - `mood` (text)
      - `date` (timestamp)
      - `interpretation` (text)
      - `biblical_insights` (jsonb array)
      - `spiritual_meaning` (text)
      - `symbols` (jsonb array)
      - `prayer` (text)
      - `significance` (text: low/medium/high)
      - `is_analyzed` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on dreams table
    - Add policies for users to manage their own dreams

  3. Functions
    - `add_and_interpret_dream` - RPC function to add dream and get interpretation
*/

-- Create dreams table
CREATE TABLE IF NOT EXISTS dreams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  mood text,
  date timestamptz DEFAULT now(),
  interpretation text,
  biblical_insights jsonb,
  spiritual_meaning text,
  symbols jsonb,
  prayer text,
  significance text CHECK (significance IN ('low', 'medium', 'high')),
  is_analyzed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE dreams ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own dreams"
  ON dreams
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dreams"
  ON dreams
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dreams"
  ON dreams
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dreams"
  ON dreams
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER handle_dreams_updated_at
  BEFORE UPDATE ON dreams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create RPC function to add and interpret dream
CREATE OR REPLACE FUNCTION add_and_interpret_dream(
  dream_title text,
  dream_description text,
  dream_mood text DEFAULT 'peaceful'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_dream_id uuid;
  result jsonb;
BEGIN
  -- Insert the dream first
  INSERT INTO dreams (
    user_id,
    title,
    description,
    mood,
    is_analyzed
  ) VALUES (
    auth.uid(),
    dream_title,
    dream_description,
    dream_mood,
    false
  ) RETURNING id INTO new_dream_id;

  -- Create a basic interpretation based on mood (will be enhanced by Edge Function)
  result := jsonb_build_object(
    'id', new_dream_id,
    'title', dream_title,
    'description', dream_description,
    'mood', dream_mood,
    'date', now(),
    'interpretation', 
    CASE 
      WHEN dream_mood IN ('peaceful', 'joyful', 'hopeful') THEN
        'This dream appears to carry positive spiritual significance. The peaceful nature suggests divine guidance and favor in your life. Consider this as a reminder of God''s presence and His plans for your future.'
      WHEN dream_mood IN ('anxious', 'confused') THEN
        'This dream may be processing concerns or uncertainties. While it may feel unsettling, it could be an invitation to bring these feelings before God in prayer and seek His comfort and guidance.'
      ELSE
        'This dream may contain important spiritual messages that require prayerful reflection. Consider seeking God''s wisdom to understand its meaning.'
    END,
    'biblicalInsights', jsonb_build_array(
      'Philippians 4:6-7 - "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."',
      'Jeremiah 29:11 - "For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."',
      'Psalm 16:7 - "I will praise the Lord, who counsels me; even at night my heart instructs me."'
    ),
    'spiritualMeaning',
    CASE 
      WHEN dream_mood IN ('peaceful', 'joyful', 'hopeful') THEN
        'This dream reflects God''s blessing and favor in your life. It suggests a season of spiritual growth and divine guidance.'
      WHEN dream_mood IN ('anxious', 'confused') THEN
        'This dream may be highlighting areas of concern in your spiritual journey. It''s an invitation to bring these matters before God and trust in His guidance.'
      ELSE
        'This dream represents a call to deeper spiritual reflection and prayer. It may be highlighting areas where God wants to bring clarity.'
    END,
    'symbols', jsonb_build_array(
      jsonb_build_object('symbol', 'Light', 'meaning', 'Represents God''s presence and guidance', 'bibleVerse', 'John 8:12'),
      jsonb_build_object('symbol', 'Water', 'meaning', 'Symbolizes spiritual cleansing and renewal', 'bibleVerse', 'John 4:14')
    ),
    'prayer',
    CASE 
      WHEN dream_mood IN ('peaceful', 'joyful', 'hopeful') THEN
        'Heavenly Father, thank You for this dream and the peace it brings. Help me recognize Your guidance in my life and walk confidently in Your path. In Jesus'' name, Amen.'
      WHEN dream_mood IN ('anxious', 'confused') THEN
        'Father God, I bring before You the concerns this dream has revealed. Grant me Your peace and help me trust in Your guidance. In Jesus'' name, Amen.'
      ELSE
        'Lord, grant me wisdom to understand this dream and discernment to recognize Your voice. Guide me in the decisions I need to make. In Jesus'' name, Amen.'
    END,
    'significance',
    CASE 
      WHEN dream_mood IN ('peaceful', 'joyful', 'hopeful') THEN 'high'
      WHEN dream_mood IN ('anxious', 'confused') THEN 'medium'
      ELSE 'medium'
    END,
    'isAnalyzed', true,
    'is_analyzed', true,
    'created_at', now(),
    'updated_at', now()
  );

  -- Update the dream with the interpretation
  UPDATE dreams 
  SET 
    interpretation = result->>'interpretation',
    biblical_insights = result->'biblicalInsights',
    spiritual_meaning = result->>'spiritualMeaning',
    symbols = result->'symbols',
    prayer = result->>'prayer',
    significance = result->>'significance',
    is_analyzed = true,
    updated_at = now()
  WHERE id = new_dream_id;

  RETURN result;
END;
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dreams_user_id ON dreams(user_id);
CREATE INDEX IF NOT EXISTS idx_dreams_date ON dreams(date);
CREATE INDEX IF NOT EXISTS idx_dreams_is_analyzed ON dreams(is_analyzed);