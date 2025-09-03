import { FirestoreService, COLLECTIONS } from '../firestore';
import { auth } from '../firebase';
import type { 
  Profile, 
  DailyActivity, 
  MoodEntry, 
  Prayer, 
  QuizSession, 
  UserQuizStats 
} from '../supabase';

export class DatabaseService {
  private static getCurrentUserId(): string {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return user.uid;
  }

  // Profile operations
  static async getProfile(): Promise<Profile | null> {
    try {
      const userId = this.getCurrentUserId();
      const profiles = await FirestoreService.getByUserId<Profile>(
        COLLECTIONS.PROFILES,
        userId
      );
      return profiles.length > 0 ? profiles[0] : null;
    } catch (error) {
      console.error('❌ Error getting profile:', error);
      return null;
    }
  }

  static async createProfile(profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const userId = this.getCurrentUserId();
      return await FirestoreService.create(COLLECTIONS.PROFILES, {
        ...profileData,
        user_id: userId
      });
    } catch (error) {
      console.error('❌ Error creating profile:', error);
      throw error;
    }
  }

  static async updateProfile(profileId: string, updates: Partial<Profile>): Promise<void> {
    try {
      await FirestoreService.update(COLLECTIONS.PROFILES, profileId, updates);
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      throw error;
    }
  }

  // Daily Activities operations
  static async getDailyActivities(): Promise<DailyActivity[]> {
    try {
      const userId = this.getCurrentUserId();
      return await FirestoreService.getByUserId<DailyActivity>(
        COLLECTIONS.DAILY_ACTIVITIES,
        userId,
        'activity_date',
        'desc'
      );
    } catch (error) {
      console.error('❌ Error getting daily activities:', error);
      return [];
    }
  }

  static async getDailyActivityByDate(date: string): Promise<DailyActivity | null> {
    try {
      const userId = this.getCurrentUserId();
      const activities = await FirestoreService.query<DailyActivity>(
        COLLECTIONS.DAILY_ACTIVITIES,
        [
          { field: 'user_id', operator: '==', value: userId },
          { field: 'activity_date', operator: '==', value: date }
        ]
      );
      return activities.length > 0 ? activities[0] : null;
    } catch (error) {
      console.error('❌ Error getting daily activity by date:', error);
      return null;
    }
  }

  static async createDailyActivity(activityData: Omit<DailyActivity, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const userId = this.getCurrentUserId();
      return await FirestoreService.create(COLLECTIONS.DAILY_ACTIVITIES, {
        ...activityData,
        user_id: userId
      });
    } catch (error) {
      console.error('❌ Error creating daily activity:', error);
      throw error;
    }
  }

  static async updateDailyActivity(activityId: string, updates: Partial<DailyActivity>): Promise<void> {
    try {
      await FirestoreService.update(COLLECTIONS.DAILY_ACTIVITIES, activityId, updates);
    } catch (error) {
      console.error('❌ Error updating daily activity:', error);
      throw error;
    }
  }

  // Mood Entries operations
  static async getMoodEntries(): Promise<MoodEntry[]> {
    try {
      const userId = this.getCurrentUserId();
      return await FirestoreService.getByUserId<MoodEntry>(
        COLLECTIONS.MOOD_ENTRIES,
        userId,
        'entry_date',
        'desc'
      );
    } catch (error) {
      console.error('❌ Error getting mood entries:', error);
      return [];
    }
  }

  static async getMoodEntryByDate(date: string): Promise<MoodEntry | null> {
    try {
      const userId = this.getCurrentUserId();
      const entries = await FirestoreService.query<MoodEntry>(
        COLLECTIONS.MOOD_ENTRIES,
        [
          { field: 'user_id', operator: '==', value: userId },
          { field: 'entry_date', operator: '==', value: date }
        ]
      );
      return entries.length > 0 ? entries[0] : null;
    } catch (error) {
      console.error('❌ Error getting mood entry by date:', error);
      return null;
    }
  }

  static async createMoodEntry(entryData: Omit<MoodEntry, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const userId = this.getCurrentUserId();
      return await FirestoreService.create(COLLECTIONS.MOOD_ENTRIES, {
        ...entryData,
        user_id: userId
      });
    } catch (error) {
      console.error('❌ Error creating mood entry:', error);
      throw error;
    }
  }

  static async updateMoodEntry(entryId: string, updates: Partial<MoodEntry>): Promise<void> {
    try {
      await FirestoreService.update(COLLECTIONS.MOOD_ENTRIES, entryId, updates);
    } catch (error) {
      console.error('❌ Error updating mood entry:', error);
      throw error;
    }
  }

  static async deleteMoodEntry(entryId: string): Promise<void> {
    try {
      await FirestoreService.delete(COLLECTIONS.MOOD_ENTRIES, entryId);
    } catch (error) {
      console.error('❌ Error deleting mood entry:', error);
      throw error;
    }
  }

  // Prayers operations
  static async getPrayers(): Promise<Prayer[]> {
    try {
      const userId = this.getCurrentUserId();
      return await FirestoreService.getByUserId<Prayer>(
        COLLECTIONS.PRAYERS,
        userId,
        'created_at',
        'desc'
      );
    } catch (error) {
      console.error('❌ Error getting prayers:', error);
      return [];
    }
  }

  static async getPrayerById(prayerId: string): Promise<Prayer | null> {
    try {
      return await FirestoreService.getById<Prayer>(COLLECTIONS.PRAYERS, prayerId);
    } catch (error) {
      console.error('❌ Error getting prayer by ID:', error);
      return null;
    }
  }

  static async createPrayer(prayerData: Omit<Prayer, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const userId = this.getCurrentUserId();
      return await FirestoreService.create(COLLECTIONS.PRAYERS, {
        ...prayerData,
        user_id: userId
      });
    } catch (error) {
      console.error('❌ Error creating prayer:', error);
      throw error;
    }
  }

  static async updatePrayer(prayerId: string, updates: Partial<Prayer>): Promise<void> {
    try {
      await FirestoreService.update(COLLECTIONS.PRAYERS, prayerId, updates);
    } catch (error) {
      console.error('❌ Error updating prayer:', error);
      throw error;
    }
  }

  static async deletePrayer(prayerId: string): Promise<void> {
    try {
      await FirestoreService.delete(COLLECTIONS.PRAYERS, prayerId);
    } catch (error) {
      console.error('❌ Error deleting prayer:', error);
      throw error;
    }
  }

  // Quiz operations
  static async getQuizSessions(): Promise<QuizSession[]> {
    try {
      const userId = this.getCurrentUserId();
      return await FirestoreService.getByUserId<QuizSession>(
        COLLECTIONS.QUIZ_SESSIONS,
        userId,
        'created_at',
        'desc'
      );
    } catch (error) {
      console.error('❌ Error getting quiz sessions:', error);
      return [];
    }
  }

  static async createQuizSession(sessionData: Omit<QuizSession, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const userId = this.getCurrentUserId();
      return await FirestoreService.create(COLLECTIONS.QUIZ_SESSIONS, {
        ...sessionData,
        user_id: userId
      });
    } catch (error) {
      console.error('❌ Error creating quiz session:', error);
      throw error;
    }
  }

  static async getUserQuizStats(): Promise<UserQuizStats | null> {
    try {
      const userId = this.getCurrentUserId();
      const stats = await FirestoreService.getByUserId<UserQuizStats>(
        COLLECTIONS.USER_QUIZ_STATS,
        userId
      );
      return stats.length > 0 ? stats[0] : null;
    } catch (error) {
      console.error('❌ Error getting user quiz stats:', error);
      return null;
    }
  }

  static async createUserQuizStats(statsData: Omit<UserQuizStats, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
      const userId = this.getCurrentUserId();
      return await FirestoreService.create(COLLECTIONS.USER_QUIZ_STATS, {
        ...statsData,
        user_id: userId
      });
    } catch (error) {
      console.error('❌ Error creating user quiz stats:', error);
      throw error;
    }
  }

  static async updateUserQuizStats(statsId: string, updates: Partial<UserQuizStats>): Promise<void> {
    try {
      await FirestoreService.update(COLLECTIONS.USER_QUIZ_STATS, statsId, updates);
    } catch (error) {
      console.error('❌ Error updating user quiz stats:', error);
      throw error;
    }
  }

  // Utility methods
  static async getRecentMoodEntries(limit: number = 7): Promise<MoodEntry[]> {
    try {
      const userId = this.getCurrentUserId();
      const entries = await FirestoreService.getByUserId<MoodEntry>(
        COLLECTIONS.MOOD_ENTRIES,
        userId,
        'entry_date',
        'desc'
      );
      return entries.slice(0, limit);
    } catch (error) {
      console.error('❌ Error getting recent mood entries:', error);
      return [];
    }
  }

  static async getPrayerStats(): Promise<{
    total: number;
    active: number;
    answered: number;
    paused: number;
  }> {
    try {
      const prayers = await this.getPrayers();
      return {
        total: prayers.length,
        active: prayers.filter(p => p.status === 'active').length,
        answered: prayers.filter(p => p.status === 'answered').length,
        paused: prayers.filter(p => p.status === 'paused').length,
      };
    } catch (error) {
      console.error('❌ Error getting prayer stats:', error);
      return { total: 0, active: 0, answered: 0, paused: 0 };
    }
  }

  static async getActivityStats(): Promise<{
    totalActivities: number;
    currentStreak: number;
    averageMood: number;
  }> {
    try {
      const activities = await this.getDailyActivities();
      const moodEntries = await this.getRecentMoodEntries(30);
      
      const totalActivities = activities.length;
      const currentStreak = activities.filter(a => a.activities_completed > 0).length;
      const averageMood = moodEntries.length > 0 
        ? moodEntries.reduce((sum, entry) => sum + entry.intensity_rating, 0) / moodEntries.length 
        : 0;

      return {
        totalActivities,
        currentStreak,
        averageMood: Math.round(averageMood * 10) / 10
      };
    } catch (error) {
      console.error('❌ Error getting activity stats:', error);
      return { totalActivities: 0, currentStreak: 0, averageMood: 0 };
    }
  }
}

export default DatabaseService;
