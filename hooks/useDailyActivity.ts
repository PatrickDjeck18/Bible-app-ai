import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { DailyActivity } from '@/lib/supabase';
import { useAuth } from './useAuth';

// Define activity goals
const DAILY_GOALS = {
  bible_reading_minutes: 15,
  prayer_minutes: 10,
  devotional_completed: true,
  mood_rating: 1, // Just needs to be set
};

export function useDailyActivity() {
  const { user } = useAuth();
  const [todayActivity, setTodayActivity] = useState<DailyActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [weeklyProgress, setWeeklyProgress] = useState<any[]>([]);
  const [tableExists, setTableExists] = useState<boolean | null>(null);

  // Check if the daily_activities table exists
  const checkTableExists = async () => {
    try {
      const { error } = await supabase
        .from('daily_activities')
        .select('id')
        .limit(1);
      
      if (error && error.code === '42P01') {
        // Table doesn't exist
        setTableExists(false);
        console.error('❌ daily_activities table does not exist. Please run the Supabase migration:');
        console.error('   Run this SQL in your Supabase SQL editor:');
        console.error(`
-- Create daily_activities table
CREATE TABLE IF NOT EXISTS daily_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
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

-- Create policy
CREATE POLICY "Allow all operations for daily activities"
  ON daily_activities
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_daily_activities_updated_at 
  BEFORE UPDATE ON daily_activities 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        `);
        return false;
      } else if (error) {
        console.error('Error checking table existence:', error);
        return false;
      } else {
        setTableExists(true);
        return true;
      }
    } catch (error) {
      console.error('Error checking table existence:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      checkTableExists().then((exists) => {
        if (exists) {
          fetchTodayActivity();
          fetchWeeklyProgress();
        } else {
          setLoading(false);
        }
      });
    } else {
      setTodayActivity(null);
      setWeeklyProgress([]);
      setLoading(false);
    }
  }, [user]);

  // Realtime subscription to keep today's progress in sync
  useEffect(() => {
    if (!user || tableExists === false) return;

    const channel = supabase
      .channel(`daily-activities:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_activities',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchTodayActivity();
          fetchWeeklyProgress();
        }
      )
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (e) {
        // noop
      }
    };
  }, [user, tableExists]);

  const fetchTodayActivity = async () => {
    if (!user || tableExists === false) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      console.log('🔴 Fetching daily activity for user:', user.id, 'date:', today);
      
      const { data, error } = await supabase
        .from('daily_activities')
        .select('*')
        .eq('user_id', user.id)
        .eq('activity_date', today)
        .maybeSingle();

      if (error) {
        if (error.code === '42P01') {
          console.error('❌ daily_activities table does not exist. Please run the migration.');
          setTableExists(false);
          return;
        }
        if (error.code === '42501') {
          console.error('❌ RLS policy violation. This might be due to authentication issues.');
          console.error('   Error details:', error);
          return;
        }
        console.error('Error fetching daily activity:', error);
        return;
      }

      if (data) {
        console.log('🔴 Found existing daily activity:', data);
        setTodayActivity(data);
      } else {
        // Create today's activity if it doesn't exist
        console.log('🔴 Creating new daily activity for user:', user.id);
        const { data: newActivity, error: createError } = await supabase
          .from('daily_activities')
          .insert({
            user_id: user.id,
            activity_date: today,
            bible_reading_minutes: 0,
            prayer_minutes: 0,
            devotional_completed: false,
            mood_rating: null,
            activities_completed: 0,
            goal_percentage: 0,
          })
          .select()
          .single();

        if (createError) {
          if (createError.code === '42P01') {
            console.error('❌ daily_activities table does not exist. Please run the migration.');
            setTableExists(false);
            return;
          }
          if (createError.code === '42501') {
            console.error('❌ RLS policy violation when creating daily activity.');
            console.error('   This might be due to authentication issues or missing RLS policies.');
            console.error('   Error details:', createError);
            return;
          }
          console.error('Error creating daily activity:', createError);
          return;
        }

        console.log('🔴 Successfully created daily activity:', newActivity);
        setTodayActivity(newActivity);
      }
    } catch (error) {
      console.error('Error fetching daily activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyProgress = async () => {
    if (!user || tableExists === false) return;

    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('daily_activities')
        .select('*')
        .eq('user_id', user.id)
        .gte('activity_date', sevenDaysAgoStr)
        .lte('activity_date', today)
        .order('activity_date', { ascending: true });

      if (error) {
        if (error.code === '42P01') {
          console.error('❌ daily_activities table does not exist. Please run the migration.');
          setTableExists(false);
          return;
        }
        console.error('Error fetching weekly progress:', error);
        return;
      }

      setWeeklyProgress(data || []);
    } catch (error) {
      console.error('Error fetching weekly progress:', error);
    }
  };

  const updateTodayActivity = async (updates: Partial<DailyActivity>) => {
    if (!user || !todayActivity || tableExists === false) return { error: 'No activity found or table missing' };

    try {
      // Calculate activities completed based on updates
      const updatedActivity = { ...todayActivity, ...updates };
      const activitiesCompleted = calculateActivitiesCompleted(updatedActivity);

      const finalUpdates = {
        ...updates,
        activities_completed: activitiesCompleted,
        goal_percentage: Math.round((activitiesCompleted / 4) * 100),
      };

      const { data, error } = await supabase
        .from('daily_activities')
        .update(finalUpdates)
        .eq('id', todayActivity.id)
        .select()
        .single();

      if (error) {
        if (error.code === '42P01') {
          console.error('❌ daily_activities table does not exist. Please run the migration.');
          setTableExists(false);
          return { error: 'Table missing - run migration' };
        }
        console.error('Error updating daily activity:', error);
        return { error };
      }

      setTodayActivity(data);
      // Refresh weekly progress after update
      await fetchWeeklyProgress();
      return { data, error: null };
    } catch (error) {
      console.error('Error updating daily activity:', error);
      return { error };
    }
  };

  const calculateActivitiesCompleted = (activity: DailyActivity) => {
    const goals = [
      activity.bible_reading_minutes >= DAILY_GOALS.bible_reading_minutes,
      activity.prayer_minutes >= DAILY_GOALS.prayer_minutes,
      activity.devotional_completed === DAILY_GOALS.devotional_completed,
      activity.mood_rating !== null,
    ];
    return goals.filter(Boolean).length;
  };

  const calculateGoalPercentage = () => {
    if (!todayActivity) return 0;
    
    return todayActivity.goal_percentage || 0;
  };

  const getWeeklyStats = () => {
    if (weeklyProgress.length === 0) return { averagePercentage: 0, totalDays: 0, completedDays: 0 };

    const totalDays = weeklyProgress.length;
    const completedDays = weeklyProgress.filter(day => day.goal_percentage >= 100).length;
    const averagePercentage = Math.round(
      weeklyProgress.reduce((sum, day) => sum + (day.goal_percentage || 0), 0) / totalDays
    );

    return { averagePercentage, totalDays, completedDays };
  };

  const getTodayGoals = () => {
    if (!todayActivity) return [];

    return [
      {
        id: 'bible_reading',
        title: 'Bible Reading',
        target: `${DAILY_GOALS.bible_reading_minutes} minutes`,
        current: todayActivity.bible_reading_minutes,
        completed: todayActivity.bible_reading_minutes >= DAILY_GOALS.bible_reading_minutes,
        icon: '📖',
        color: '#3B82F6',
      },
      {
        id: 'prayer',
        title: 'Prayer Time',
        target: `${DAILY_GOALS.prayer_minutes} minutes`,
        current: todayActivity.prayer_minutes,
        completed: todayActivity.prayer_minutes >= DAILY_GOALS.prayer_minutes,
        icon: '🙏',
        color: '#10B981',
      },
      {
        id: 'devotional',
        title: 'Devotional',
        target: 'Complete daily reading',
        current: todayActivity.devotional_completed ? 1 : 0,
        completed: todayActivity.devotional_completed,
        icon: '📚',
        color: '#F59E0B',
      },
      {
        id: 'mood',
        title: 'Mood Check',
        target: 'Record your mood',
        current: todayActivity.mood_rating ? 1 : 0,
        completed: todayActivity.mood_rating !== null,
        icon: '😊',
        color: '#EC4899',
      },
    ];
  };

  const updateBibleReading = async (minutes: number) => {
    return await updateTodayActivity({ bible_reading_minutes: minutes });
  };

  const updatePrayerTime = async (minutes: number) => {
    return await updateTodayActivity({ prayer_minutes: minutes });
  };

  const markDevotionalComplete = async () => {
    return await updateTodayActivity({ devotional_completed: true });
  };

  const updateMoodRating = async (rating: number) => {
    return await updateTodayActivity({ mood_rating: rating });
  };
  const getCurrentStreak = () => {
    if (!user || weeklyProgress.length === 0) return 0;

    let streak = 0;
    const sortedDays = [...weeklyProgress].reverse(); // Most recent first

    for (const day of sortedDays) {
      if (day.goal_percentage >= 100) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  return {
    todayActivity,
    weeklyProgress,
    loading,
    tableExists,
    updateTodayActivity,
    calculateGoalPercentage,
    getWeeklyStats,
    getTodayGoals,
    getCurrentStreak,
    updateBibleReading,
    updatePrayerTime,
    markDevotionalComplete,
    updateMoodRating,
    refetch: () => Promise.all([fetchTodayActivity(), fetchWeeklyProgress()]),
  };
}