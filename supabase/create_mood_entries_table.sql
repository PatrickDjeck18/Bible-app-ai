-- Function to create mood_entries table if it doesn't exist
CREATE OR REPLACE FUNCTION create_mood_entries_table_if_not_exists()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create the mood_entries table if it doesn't exist
  CREATE TABLE IF NOT EXISTS mood_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mood_id VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Add RLS (Row Level Security) policies if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mood_entries') THEN
    -- Enable RLS
    ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
    
    -- Create policy to allow all operations (for demo purposes)
    -- In production, you'd want more restrictive policies
    CREATE POLICY "Allow all operations on mood_entries" ON mood_entries
      FOR ALL USING (true);
  END IF;
  
  RAISE NOTICE 'mood_entries table created or already exists';
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_mood_entries_table_if_not_exists() TO authenticated;
GRANT EXECUTE ON FUNCTION create_mood_entries_table_if_not_exists() TO anon;
