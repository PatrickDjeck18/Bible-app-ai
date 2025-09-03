import { supabase } from './supabase';
import { FirestoreService, COLLECTIONS } from './firestore';
import { auth } from './firebase';

export interface MigrationProgress {
  totalRecords: number;
  migratedRecords: number;
  currentTable: string;
  status: 'idle' | 'migrating' | 'completed' | 'error';
  error?: string;
}

export class DatabaseMigrationService {
  private static progress: MigrationProgress = {
    totalRecords: 0,
    migratedRecords: 0,
    currentTable: '',
    status: 'idle'
  };

  static getProgress(): MigrationProgress {
    return { ...this.progress };
  }

  static async migrateAllData(userId: string): Promise<void> {
    try {
      this.progress.status = 'migrating';
      this.progress.migratedRecords = 0;
      this.progress.totalRecords = 0;

      // Calculate total records to migrate
      const tables = ['profiles', 'daily_activities', 'mood_entries', 'prayers', 'dreams', 'quiz_sessions', 'user_quiz_stats'];
      
      for (const table of tables) {
        const { count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
        
        this.progress.totalRecords += count || 0;
      }

      // Migrate each table
      await this.migrateProfiles(userId);
      await this.migrateDailyActivities(userId);
      await this.migrateMoodEntries(userId);
      await this.migratePrayers(userId);
      await this.migrateDreams(userId);
      await this.migrateQuizSessions(userId);
      await this.migrateUserQuizStats(userId);

      this.progress.status = 'completed';
      console.log('✅ Database migration completed successfully!');
    } catch (error) {
      this.progress.status = 'error';
      this.progress.error = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Database migration failed:', error);
      throw error;
    }
  }

  private static async migrateProfiles(userId: string): Promise<void> {
    this.progress.currentTable = 'profiles';
    console.log('🔄 Migrating profiles...');

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('❌ Error fetching profiles:', error);
      return;
    }

    for (const profile of profiles || []) {
      try {
        // Check if profile already exists in Firestore
        const existingProfiles = await FirestoreService.query(
          COLLECTIONS.PROFILES,
          [{ field: 'user_id', operator: '==', value: userId }]
        );

        if (existingProfiles.length === 0) {
          await FirestoreService.create(COLLECTIONS.PROFILES, {
            user_id: profile.user_id,
            full_name: profile.full_name,
            email: profile.email,
            avatar_url: profile.avatar_url,
            journey_start_date: profile.journey_start_date,
            current_streak: profile.current_streak || 0,
            total_prayers: profile.total_prayers || 0,
            total_bible_readings: profile.total_bible_readings || 0
          });
        }
        this.progress.migratedRecords++;
      } catch (error) {
        console.error('❌ Error migrating profile:', error);
      }
    }
  }

  private static async migrateDailyActivities(userId: string): Promise<void> {
    this.progress.currentTable = 'daily_activities';
    console.log('🔄 Migrating daily activities...');

    const { data: activities, error } = await supabase
      .from('daily_activities')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('❌ Error fetching daily activities:', error);
      return;
    }

    for (const activity of activities || []) {
      try {
        await FirestoreService.create(COLLECTIONS.DAILY_ACTIVITIES, {
          user_id: activity.user_id,
          activity_date: activity.activity_date,
          bible_reading_minutes: activity.bible_reading_minutes || 0,
          prayer_minutes: activity.prayer_minutes || 0,
          devotional_completed: activity.devotional_completed || false,
          mood_rating: activity.mood_rating,
          activities_completed: activity.activities_completed || 0,
          goal_percentage: activity.goal_percentage || 0
        });
        this.progress.migratedRecords++;
      } catch (error) {
        console.error('❌ Error migrating daily activity:', error);
      }
    }
  }

  private static async migrateMoodEntries(userId: string): Promise<void> {
    this.progress.currentTable = 'mood_entries';
    console.log('🔄 Migrating mood entries...');

    const { data: moodEntries, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('❌ Error fetching mood entries:', error);
      return;
    }

    for (const entry of moodEntries || []) {
      try {
        await FirestoreService.create(COLLECTIONS.MOOD_ENTRIES, {
          user_id: entry.user_id,
          entry_date: entry.entry_date,
          mood_type: entry.mood_type,
          intensity_rating: entry.intensity_rating,
          emoji: entry.emoji,
          note: entry.note
        });
        this.progress.migratedRecords++;
      } catch (error) {
        console.error('❌ Error migrating mood entry:', error);
      }
    }
  }

  private static async migratePrayers(userId: string): Promise<void> {
    this.progress.currentTable = 'prayers';
    console.log('🔄 Migrating prayers...');

    const { data: prayers, error } = await supabase
      .from('prayers')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('❌ Error fetching prayers:', error);
      return;
    }

    for (const prayer of prayers || []) {
      try {
        await FirestoreService.create(COLLECTIONS.PRAYERS, {
          user_id: prayer.user_id,
          title: prayer.title,
          description: prayer.description,
          status: prayer.status,
          frequency: prayer.frequency,
          category: prayer.category,
          priority: prayer.priority,
          is_shared: prayer.is_shared || false,
          is_community: prayer.is_community || false,
          answered_at: prayer.answered_at,
          answered_notes: prayer.answered_notes,
          prayer_notes: prayer.prayer_notes,
          gratitude_notes: prayer.gratitude_notes,
          reminder_time: prayer.reminder_time,
          reminder_frequency: prayer.reminder_frequency,
          last_prayed_at: prayer.last_prayed_at,
          prayer_count: prayer.prayer_count || 0,
          answered_prayer_count: prayer.answered_prayer_count || 0
        });
        this.progress.migratedRecords++;
      } catch (error) {
        console.error('❌ Error migrating prayer:', error);
      }
    }
  }

  private static async migrateDreams(userId: string): Promise<void> {
    this.progress.currentTable = 'dreams';
    console.log('🔄 Migrating dreams...');

    const { data: dreams, error } = await supabase
      .from('dreams')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('❌ Error fetching dreams:', error);
      return;
    }

    for (const dream of dreams || []) {
      try {
        await FirestoreService.create(COLLECTIONS.DREAMS, {
          user_id: dream.user_id,
          title: dream.title,
          description: dream.description,
          dream_date: dream.dream_date,
          category: dream.category,
          emotional_tone: dream.emotional_tone,
          is_lucid: dream.is_lucid || false,
          interpretation: dream.interpretation,
          tags: dream.tags || []
        });
        this.progress.migratedRecords++;
      } catch (error) {
        console.error('❌ Error migrating dream:', error);
      }
    }
  }

  private static async migrateQuizSessions(userId: string): Promise<void> {
    this.progress.currentTable = 'quiz_sessions';
    console.log('🔄 Migrating quiz sessions...');

    const { data: sessions, error } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('❌ Error fetching quiz sessions:', error);
      return;
    }

    for (const session of sessions || []) {
      try {
        await FirestoreService.create(COLLECTIONS.QUIZ_SESSIONS, {
          user_id: session.user_id,
          questions_answered: session.questions_answered || 0,
          correct_answers: session.correct_answers || 0,
          wrong_answers: session.wrong_answers || 0,
          total_score: session.total_score || 0,
          category: session.category,
          difficulty: session.difficulty,
          time_taken_seconds: session.time_taken_seconds || 0,
          completed_at: session.completed_at
        });
        this.progress.migratedRecords++;
      } catch (error) {
        console.error('❌ Error migrating quiz session:', error);
      }
    }
  }

  private static async migrateUserQuizStats(userId: string): Promise<void> {
    this.progress.currentTable = 'user_quiz_stats';
    console.log('🔄 Migrating user quiz stats...');

    const { data: stats, error } = await supabase
      .from('user_quiz_stats')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('❌ Error fetching user quiz stats:', error);
      return;
    }

    for (const stat of stats || []) {
      try {
        await FirestoreService.create(COLLECTIONS.USER_QUIZ_STATS, {
          user_id: stat.user_id,
          total_sessions: stat.total_sessions || 0,
          total_questions_answered: stat.total_questions_answered || 0,
          total_correct_answers: stat.total_correct_answers || 0,
          best_score: stat.best_score || 0,
          current_streak: stat.current_streak || 0,
          longest_streak: stat.longest_streak || 0,
          favorite_category: stat.favorite_category,
          total_time_spent_seconds: stat.total_time_spent_seconds || 0
        });
        this.progress.migratedRecords++;
      } catch (error) {
        console.error('❌ Error migrating user quiz stats:', error);
      }
    }
  }

  static async verifyMigration(userId: string): Promise<{
    success: boolean;
    details: Record<string, { supabase: number; firestore: number }>;
  }> {
    const details: Record<string, { supabase: number; firestore: number }> = {};
    const tables = ['profiles', 'daily_activities', 'mood_entries', 'prayers', 'dreams', 'quiz_sessions', 'user_quiz_stats'];

    for (const table of tables) {
      try {
        // Count Supabase records
        const { count: supabaseCount } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        // Count Firestore records
        const firestoreRecords = await FirestoreService.getByUserId(
          COLLECTIONS[table.toUpperCase() as keyof typeof COLLECTIONS],
          userId
        );

        details[table] = {
          supabase: supabaseCount || 0,
          firestore: firestoreRecords.length
        };
      } catch (error) {
        console.error(`❌ Error verifying ${table}:`, error);
        details[table] = { supabase: 0, firestore: 0 };
      }
    }

    const success = Object.values(details).every(
      ({ supabase, firestore }) => supabase === firestore
    );

    return { success, details };
  }
}

export default DatabaseMigrationService;
