import { useEffect, useState, useCallback } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy,
  limit,
} from 'firebase/firestore';
import { useAuth } from './useAuth';

// Define activity goals
const DAILY_GOALS = {
  bible_reading_minutes: 15,
  prayer_minutes: 10,
  devotional_completed: true,
  mood_rating: 1, // Just needs to be set
};

// Define the data types for Firestore documents
export interface DailyActivity {
  id?: string;
  user_id: string;
  activity_date: string;
  bible_reading_minutes: number;
  prayer_minutes: number;
  devotional_completed: boolean;
  mood_rating: number | null;
  activities_completed: number;
  goal_percentage: number;
  created_at: string;
  updated_at: string;
}

export function useDailyActivity() {
  const { user } = useAuth();
  const [todayActivity, setTodayActivity] = useState<DailyActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [weeklyProgress, setWeeklyProgress] = useState<DailyActivity[]>([]);

  // Fetches today's activity, creating it if it doesn't exist
  const fetchTodayActivity = useCallback(async () => {
    if (!user) {
      setTodayActivity(null);
      setLoading(false);
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      const todayDocRef = doc(db, 'daily_activities', `${user.uid}_${today}`);
      const docSnap = await getDoc(todayDocRef);

      if (docSnap.exists()) {
        console.log('🔴 Found existing daily activity:', docSnap.data());
        setTodayActivity({ ...docSnap.data(), id: docSnap.id } as DailyActivity);
      } else {
        // Create today's activity if it doesn't exist
        console.log('🔴 Creating new daily activity for user:', user.uid);
        const newActivityData = {
          user_id: user.uid,
          activity_date: today,
          bible_reading_minutes: 0,
          prayer_minutes: 0,
          devotional_completed: false,
          mood_rating: null,
          activities_completed: 0,
          goal_percentage: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        await setDoc(todayDocRef, newActivityData);
        setTodayActivity({ ...newActivityData, id: todayDocRef.id });
        console.log('🔴 Successfully created daily activity.');
      }
    } catch (error) {
      console.error('Error fetching/creating daily activity:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetches the last 7 days of activity
  const fetchWeeklyProgress = useCallback(async () => {
    if (!user) return;

    try {
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6);
      const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
      const todayStr = today.toISOString().split('T')[0];

      const q = query(
        collection(db, 'daily_activities'),
        where('user_id', '==', user.uid),
        where('activity_date', '>=', sevenDaysAgoStr),
        where('activity_date', '<=', todayStr),
        orderBy('activity_date', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const progress: DailyActivity[] = [];
      querySnapshot.forEach((doc) => {
        progress.push({ ...doc.data(), id: doc.id } as DailyActivity);
      });
      setWeeklyProgress(progress);
    } catch (error) {
      console.error('Error fetching weekly progress:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTodayActivity();
      fetchWeeklyProgress();
    } else {
      setTodayActivity(null);
      setWeeklyProgress([]);
      setLoading(false);
    }
  }, [user, fetchTodayActivity, fetchWeeklyProgress]);

  // Realtime subscription to keep today's progress in sync
  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const todayDocRef = doc(db, 'daily_activities', `${user.uid}_${today}`);

    const unsubscribe = onSnapshot(todayDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setTodayActivity({ ...docSnap.data(), id: docSnap.id } as DailyActivity);
      } else {
        setTodayActivity(null);
      }
      fetchWeeklyProgress();
    }, (error) => {
      console.error('Realtime update failed:', error);
    });

    return () => unsubscribe();
  }, [user, fetchWeeklyProgress]);

  const updateTodayActivity = useCallback(async (updates: Partial<DailyActivity>) => {
    if (!user || !todayActivity) return { error: 'No activity found or user not authenticated' };

    try {
      const todayDocRef = doc(db, 'daily_activities', todayActivity.id!);
      const updatedActivity = { ...todayActivity, ...updates };
      const activitiesCompleted = calculateActivitiesCompleted(updatedActivity);

      const finalUpdates = {
        ...updates,
        activities_completed: activitiesCompleted,
        goal_percentage: Math.round((activitiesCompleted / 4) * 100),
        updated_at: new Date().toISOString(),
      };

      await updateDoc(todayDocRef, finalUpdates);
      return { data: finalUpdates, error: null };
    } catch (error) {
      console.error('Error updating daily activity:', error);
      return { error };
    }
  }, [todayActivity, user]);

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
    const sortedDays = [...weeklyProgress].reverse();
    for (const day of sortedDays) {
      if (day.goal_percentage >= 100) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const refetch = useCallback(() => {
    return Promise.all([fetchTodayActivity(), fetchWeeklyProgress()]);
  }, [fetchTodayActivity, fetchWeeklyProgress]);

  return {
    todayActivity,
    weeklyProgress,
    loading,
    updateTodayActivity,
    calculateGoalPercentage,
    getWeeklyStats,
    getTodayGoals,
    getCurrentStreak,
    updateBibleReading,
    updatePrayerTime,
    markDevotionalComplete,
    updateMoodRating,
    refetch,
  };
}