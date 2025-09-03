-- Create a function to create the dreams table
-- Run this in your Supabase SQL Editor

CREATE OR REPLACE FUNCTION create_dreams_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create dreams table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.dreams (
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
  ALTER TABLE public.dreams ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view their own dreams" ON public.dreams;
  DROP POLICY IF EXISTS "Users can insert their own dreams" ON public.dreams;
  DROP POLICY IF EXISTS "Users can update their own dreams" ON public.dreams;
  DROP POLICY IF EXISTS "Users can delete their own dreams" ON public.dreams;

  -- Create RLS policies
  CREATE POLICY "Users can view their own dreams"
    ON public.dreams
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert their own dreams"
    ON public.dreams
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can update their own dreams"
    ON public.dreams
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can delete their own dreams"
    ON public.dreams
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

  -- Create updated_at trigger function if it doesn't exist
  CREATE OR REPLACE FUNCTION public.update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  -- Create updated_at trigger
  DROP TRIGGER IF EXISTS handle_dreams_updated_at ON public.dreams;
  CREATE TRIGGER handle_dreams_updated_at
    BEFORE UPDATE ON public.dreams
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

  -- Create indexes for better performance
  CREATE INDEX IF NOT EXISTS idx_dreams_user_id ON public.dreams(user_id);
  CREATE INDEX IF NOT EXISTS idx_dreams_date ON public.dreams(date);
  CREATE INDEX IF NOT EXISTS idx_dreams_is_analyzed ON public.dreams(is_analyzed);

  -- Grant necessary permissions
  GRANT USAGE ON SCHEMA public TO authenticated;
  GRANT ALL ON public.dreams TO authenticated;
  
  RAISE NOTICE 'Dreams table created successfully!';
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION create_dreams_table() TO authenticated;
