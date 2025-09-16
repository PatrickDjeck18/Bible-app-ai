import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, updateDoc, Timestamp, getDoc } from 'firebase/firestore';

// Assuming these interfaces are defined elsewhere or can be used directly
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
  completed_at: Timestamp | null;
  notes: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface TodayActivity extends ActivityCategory {
  category_id: string;
  completed: boolean;
  completed_at: Timestamp | null;
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

// Helper function to get the start of the day
const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Assuming a hypothetical useAuth hook exists to get the current user
// function useAuth() { return { user: { uid: 'user-123' } } }

export function useActivityTracker() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayActivities, setTodayActivities] = useState<TodayActivity[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);

  // Hardcoded activity categories as a substitute for a Supabase table
  const activityCategories: ActivityCategory[] = [
    { id: 'cat1', name: 'Prayer', description: 'Daily prayer', icon: '🙏', color: '#FFDDC1', target_daily: 1 },
    { id: 'cat2', name: 'Bible Reading', description: 'Read a chapter from the Bible', icon: '📖', color: '#C1FFD2', target_daily: 1 },
    { id: 'cat3', name: 'Devotional', description: 'Complete a daily devotional', icon: '✍️', color: '#C1D3FF', target_daily: 1 },
  ];

  // Assuming `user` comes from a global auth state or a parent component
  const user = { uid: 'user-123' };

  // Fetch all data
  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);

      const userId = user.uid;
      const dailyActivitiesCol = collection(db, `users/${userId}/daily_activities`);
      const today = startOfDay(new Date());

      // 1. Fetch today's activities
      const todayActivitiesQuery = query(dailyActivitiesCol, where('created_at', '>=', today));
      const todayActivitiesSnapshot = await getDocs(todayActivitiesQuery);

    const todayActivitiesMap = new Map();
      todayActivitiesSnapshot.docs.forEach(doc => {
        const activity = doc.data() as DailyActivity;
        todayActivitiesMap.set(activity.category_id, {
          // Use doc.id as the primary ID, and spread the rest of the data
          id: doc.id,
          completed: activity.completed,
          completed_at: activity.completed_at,
          notes: activity.notes,
          created_at: activity.created_at,
          updated_at: activity.updated_at,
        });
      });

      // Corrected code to fix the 'id' conflict
      const combinedTodayActivities: TodayActivity[] = activityCategories.map(category => {
        const activity = todayActivitiesMap.get(category.id);
        const dailyActivityId = activity?.id || null;
        return {
          ...category,
          category_id: category.id,
          completed: activity?.completed || false,
          completed_at: activity?.completed_at || null,
          notes: activity?.notes || null,
          dailyActivityId: dailyActivityId
        };
      });
      setTodayActivities(combinedTodayActivities);

      // 2. Fetch weekly progress and stats
      const sevenDaysAgo = startOfDay(new Date());
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      const allActivitiesQuery = query(dailyActivitiesCol, where('created_at', '>=', sevenDaysAgo));
      const allActivitiesSnapshot = await getDocs(allActivitiesQuery);

      const allActivities = allActivitiesSnapshot.docs.map(doc => doc.data() as DailyActivity);

      const dailyActivitiesCount = new Map<string, { completed: number, total: number }>();
      const todayString = new Date().toISOString().split('T')[0];

      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dailyActivitiesCount.set(date.toISOString().split('T')[0], { completed: 0, total: activityCategories.length });
      }

      allActivities.forEach(activity => {
        const dateKey = activity.created_at.toDate().toISOString().split('T')[0];
        if (dailyActivitiesCount.has(dateKey)) {
          const counts = dailyActivitiesCount.get(dateKey)!;
          if (activity.completed) {
            counts.completed += 1;
          }
        }
      });

      const weeklyProgressData: WeeklyProgress[] = Array.from(dailyActivitiesCount.entries())
        .map(([date, counts]) => ({
          day_name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
          date,
          completed_count: counts.completed,
          total_count: counts.total,
          percentage: (counts.completed / counts.total) * 100,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setWeeklyProgress(weeklyProgressData);

      // 3. Calculate stats
      const totalActivities = allActivities.length;
      const completedActivities = allActivities.filter(a => a.completed).length;
      const pendingActivities = totalActivities - completedActivities;
      const completionPercentage = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;
      
      let currentStreak = 0;
      let lastDate = new Date();
      let isCounting = true;
      const sortedDates = [...new Set(allActivities.map(a => a.created_at.toDate().toISOString().split('T')[0]))].sort().reverse();
      
      for(const dateStr of sortedDates) {
        const date = new Date(dateStr);
        const dailyCompletions = allActivities.filter(a => a.created_at.toDate().toISOString().split('T')[0] === dateStr && a.completed);
        const isCompletedDay = dailyCompletions.length > 0 && dailyCompletions.length === activityCategories.length;
        
        if (isCounting) {
            if (isCompletedDay && date.getDate() === lastDate.getDate() - currentStreak) {
                currentStreak++;
            } else if (date.getDate() !== lastDate.getDate() && date.getDate() !== lastDate.getDate() - currentStreak) {
                isCounting = false;
            }
        }
      }
      setStats({
        total_activities: totalActivities,
        completed_activities: completedActivities,
        pending_activities: pendingActivities,
        completion_percentage: completionPercentage,
        current_streak: currentStreak,
      });

      // 4. Calculate achievements
      const totalCompletedActivities = completedActivities;
      const mockAchievements: Achievement[] = [
        {
          achievement_name: 'First Step',
          achievement_description: 'Complete one activity',
          achievement_icon: '🥇',
          achievement_color: 'gold',
          requirement_type: 'total_activities',
          requirement_value: 1,
          current_progress: totalCompletedActivities,
          unlocked: totalCompletedActivities >= 1,
          progress_percentage: Math.min(100, (totalCompletedActivities / 1) * 100),
        },
        {
          achievement_name: 'Ten Done',
          achievement_description: 'Complete 10 activities',
          achievement_icon: '🔟',
          achievement_color: 'silver',
          requirement_type: 'total_activities',
          requirement_value: 10,
          current_progress: totalCompletedActivities,
          unlocked: totalCompletedActivities >= 10,
          progress_percentage: Math.min(100, (totalCompletedActivities / 10) * 100),
        },
        {
          achievement_name: 'Consistent Christian',
          achievement_description: 'Complete 7 days in a row',
          achievement_icon: '🔥',
          achievement_color: 'red',
          requirement_type: 'streak',
          requirement_value: 7,
          current_progress: currentStreak,
          unlocked: currentStreak >= 7,
          progress_percentage: Math.min(100, (currentStreak / 7) * 100),
        },
      ];
      setAchievements(mockAchievements);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mark activity as completed
  const markActivityCompleted = async (categoryId: string, notes?: string) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    try {
      setLoading(true);
      const today = startOfDay(new Date());
      const dailyActivitiesCol = collection(db, `users/${user.uid}/daily_activities`);
      
      const q = query(dailyActivitiesCol, where('category_id', '==', categoryId), where('created_at', '>=', today));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Update existing activity
        const docRef = doc(db, `users/${user.uid}/daily_activities`, querySnapshot.docs[0].id);
        await updateDoc(docRef, {
          completed: true,
          completed_at: Timestamp.now(),
          notes: notes || null,
          updated_at: Timestamp.now(),
        });
      } else {
        // Create new activity
        const newDocRef = doc(dailyActivitiesCol);
        await setDoc(newDocRef, {
          category_id: categoryId,
          completed: true,
          completed_at: Timestamp.now(),
          notes: notes || null,
          created_at: Timestamp.now(),
          updated_at: Timestamp.now(),
        });
      }

      await fetchData();
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
    if (!user) return { success: false, error: 'User not authenticated' };
    try {
      setLoading(true);
      const today = startOfDay(new Date());
      const dailyActivitiesCol = collection(db, `users/${user.uid}/daily_activities`);

      const q = query(dailyActivitiesCol, where('category_id', '==', categoryId), where('created_at', '>=', today));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = doc(db, `users/${user.uid}/daily_activities`, querySnapshot.docs[0].id);
        await updateDoc(docRef, {
          completed: false,
          completed_at: null,
          updated_at: Timestamp.now(),
        });
      }

      await fetchData();
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
    fetchData();
  }, [user]);

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
    refreshData: fetchData,
  };
}