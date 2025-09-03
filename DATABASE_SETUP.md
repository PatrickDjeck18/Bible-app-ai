# Database Setup Instructions

## Fix for "daily_activities table does not exist" Error

The app is showing database errors because the `daily_activities` table is missing from your Supabase database. Here's how to fix it:

### Option 1: Run the SQL Script (Recommended)

1. **Open your Supabase Dashboard**
   - Go to [supabase.com](https://supabase.com)
   - Sign in and select your project

2. **Open the SQL Editor**
   - In your Supabase dashboard, click on "SQL Editor" in the left sidebar

3. **Run the Migration Script**
   - Copy and paste the contents of `create_daily_activities_table.sql` into the SQL editor
   - Click "Run" to execute the script

4. **Verify the Table was Created**
   - Go to "Table Editor" in the left sidebar
   - You should see a new `daily_activities` table

### Option 2: Run the Existing Migration

If you have Supabase CLI installed:

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (if not already linked)
supabase link --project-ref YOUR_PROJECT_REF

# Run the migration
supabase db push
```

### What the Migration Does

The migration creates:

- **`daily_activities` table** - Stores user's daily spiritual activities
- **Row Level Security (RLS)** - Ensures users can only access their own data
- **Policies** - Defines who can read/write to the table
- **Triggers** - Automatically updates timestamps

### Table Schema

```sql
daily_activities (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  activity_date date,
  bible_reading_minutes integer DEFAULT 0,
  prayer_minutes integer DEFAULT 0,
  devotional_completed boolean DEFAULT false,
  mood_rating integer CHECK (1-10),
  activities_completed integer DEFAULT 0,
  goal_percentage integer DEFAULT 0,
  created_at timestamptz,
  updated_at timestamptz
)
```

### After Running the Migration

1. **Restart your app** - The errors should disappear
2. **Test the features** - Try using the mood tracker and activity tracking
3. **Check the console** - No more database errors should appear

### Troubleshooting

If you still see errors after running the migration:

1. **Check the table exists** - Go to Table Editor in Supabase
2. **Verify RLS is enabled** - The table should have RLS enabled
3. **Check policies** - There should be a policy for authenticated users
4. **Restart the app** - Sometimes the app needs a fresh start

### Need Help?

If you're still having issues:

1. Check the Supabase logs in your dashboard
2. Verify your environment variables are correct
3. Make sure you're using the right Supabase project
4. Contact support if the problem persists

---

**Note**: The app now includes error handling that will show helpful messages in the console if the table is missing, and will gracefully handle the missing table without crashing.

