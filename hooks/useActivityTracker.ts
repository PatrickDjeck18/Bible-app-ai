import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface ActivityCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  target_daily: number;
}

export interface DailyActivity {
  id: string;
  category_id: string;
  completed: boolean;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TodayActivity extends ActivityCategory {
  category_id: string;
  completed: boolean;
  completed_at: string | null;
  notes: string | null;
}

export interface WeeklyProgress {
  day_name: string;
  date: string;
  completed_count: number;
  total_count: number;
  percentage: number;
}

export interface Achievement {
  achievement_name: string;
  achievement_description: string;
  achievement_icon: string;
  achievement_color: string;
  requirement_type: string;
  requirement_value: number;
  current_progress: number;
  unlocked: boolean;
  progress_percentage: number;
}

export interface ActivityStats {
  total_activities: number;
  completed_activities: number;
  pending_activities: number;
  completion_percentage: number;
  current_streak: number;
}

export function useActivityTracker() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayActivities, setTodayActivities] = useState<TodayActivity[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);

  // Fetch today's activities
  const fetchTodayActivities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('today_activities')
        .select('*')
        .order('category_name');

      if (error) throw error;
      setTodayActivities(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch weekly progress
  const fetchWeeklyProgress = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_weekly_progress');

      if (error) throw error;
      setWeeklyProgress(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Fetch achievements
  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_achievement_progress');

      if (error) throw error;
      setAchievements(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Fetch activity stats
  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_stats')
        .select('*')
        .single();

      if (error) throw error;
      setStats(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Mark activity as completed
  const markActivityCompleted = async (categoryId: string, notes?: string) => {
    try {
      setLoading(true);
      
      // Check if activity already exists for today
      const { data: existingActivity } = await supabase
        .from('daily_activities')
        .select('id')
        .eq('category_id', categoryId)
        .gte('created_at', new Date().toISOString().split('T')[0])
        .single();

      if (existingActivity) {
        // Update existing activity
        const { error } = await supabase
          .from('daily_activities')
          .update({
            completed: true,
            completed_at: new Date().toISOString(),
            notes: notes || null
          })
          .eq('id', existingActivity.id);

        if (error) throw error;
      } else {
        // Create new activity
        const { error } = await supabase
          .from('daily_activities')
          .insert({
            category_id: categoryId,
            completed: true,
            completed_at: new Date().toISOString(),
            notes: notes || null
          });

        if (error) throw error;
      }

      // Refresh data
      await Promise.all([
        fetchTodayActivities(),
        fetchWeeklyProgress(),
        fetchStats()
      ]);

      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Mark activity as incomplete
  const markActivityIncomplete = async (categoryId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('daily_activities')
        .update({
          completed: false,
          completed_at: null
        })
        .eq('category_id', categoryId)
        .gte('created_at', new Date().toISOString().split('T')[0]);

      if (error) throw error;

      // Refresh data
      await Promise.all([
        fetchTodayActivities(),
        fetchWeeklyProgress(),
        fetchStats()
      ]);

      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Get goal percentage for today
  const getGoalPercentage = () => {
    if (!todayActivities.length) return 0;
    const completed = todayActivities.filter(activity => activity.completed).length;
    return Math.round((completed / todayActivities.length) * 100);
  };

  // Get current streak
  const getCurrentStreak = () => {
    return stats?.current_streak || 0;
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchTodayActivities(),
        fetchWeeklyProgress(),
        fetchAchievements(),
        fetchStats()
      ]);
    };

    initializeData();
  }, []);

  return {
    loading,
    error,
    todayActivities,
    weeklyProgress,
    achievements,
    stats,
    getGoalPercentage,
    getCurrentStreak,
    markActivityCompleted,
    markActivityIncomplete,
    refreshData: () => Promise.all([
      fetchTodayActivities(),
      fetchWeeklyProgress(),
      fetchAchievements(),
      fetchStats()
    ])
  };
}






