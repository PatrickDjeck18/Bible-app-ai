-- Fix foreign key constraint issue on daily_activities table
-- The table is trying to reference auth.users but we're using Firebase auth

-- First, let's check if the foreign key constraint exists and remove it
DO $$
BEGIN
  -- Check if the foreign key constraint exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'daily_activities_user_id_fkey' 
    AND table_name = 'daily_activities'
  ) THEN
    -- Remove the foreign key constraint
    ALTER TABLE daily_activities DROP CONSTRAINT daily_activities_user_id_fkey;
    RAISE NOTICE 'Removed foreign key constraint daily_activities_user_id_fkey';
  ELSE
    RAISE NOTICE 'Foreign key constraint daily_activities_user_id_fkey does not exist';
  END IF;
END $$;

-- Also check for any other foreign key constraints that might reference auth.users
DO $$
BEGIN
  -- Check for any other foreign key constraints on user_id
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name LIKE '%user_id%' 
    AND table_name = 'daily_activities'
    AND constraint_type = 'FOREIGN KEY'
  ) THEN
    -- Get the constraint name and remove it
    FOR constraint_rec IN 
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE constraint_name LIKE '%user_id%' 
      AND table_name = 'daily_activities'
      AND constraint_type = 'FOREIGN KEY'
    LOOP
      EXECUTE 'ALTER TABLE daily_activities DROP CONSTRAINT ' || constraint_rec.constraint_name;
      RAISE NOTICE 'Removed foreign key constraint %', constraint_rec.constraint_name;
    END LOOP;
  END IF;
END $$;

-- Make sure the user_id column is properly defined
ALTER TABLE daily_activities ALTER COLUMN user_id TYPE uuid;
ALTER TABLE daily_activities ALTER COLUMN user_id SET NOT NULL;

-- Create an index for better performance (if it doesn't exist)
CREATE INDEX IF NOT EXISTS idx_daily_activities_user_id_date ON daily_activities(user_id, activity_date);

-- Verify the table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'daily_activities' 
ORDER BY ordinal_position;
