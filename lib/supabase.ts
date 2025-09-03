import { createClient } from '@supabase/supabase-js';

// Use your actual Supabase project credentials
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://rlzngxvmqcufzgxwdnyg.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsem5neHZtcWN1ZnpneHdkbnlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3ODAxODcsImV4cCI6MjA2OTM1NjE4N30.ZKX_MN09Y_GXiflzsOuX3d5Iw6XfRW-z0VHqRmukxlY';

console.log('🔴 Supabase configuration:', { 
  url: supabaseUrl, 
  hasKey: !!supabaseAnonKey,
  keyLength: supabaseAnonKey?.length 
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storage: undefined, // Let Supabase handle storage automatically
    storageKey: 'supabase.auth.token',
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'daily-bread-app',
      'apikey': supabaseAnonKey, // Add API key to headers for better compatibility
    }
  }
});

// Helper function to create a Supabase client with Firebase auth headers
export const createFirebaseSupabaseClient = (firebaseUser: any) => {
  // Convert Firebase UID to UUID format to match the database user_id
  const firebaseIdToUUID = (firebaseId: string): string => {
    let hash = 0;
    for (let i = 0; i < firebaseId.length; i++) {
      const char = firebaseId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    const hashStr = Math.abs(hash).toString(16).padStart(8, '0');
    const part1 = hashStr.substring(0, 8);
    const part2 = hashStr.substring(8, 12) || '0000';
    const part3 = '4' + (hashStr.substring(12, 15) || '000');
    const part4 = '8' + (hashStr.substring(15, 18) || '000');
    const part5 = hashStr.substring(18, 30) || '000000000000';
    const paddedPart5 = part5.padEnd(12, '0');
    
    return `${part1}-${part2}-${part3}-${part4}-${paddedPart5}`;
  };

  const convertedUserId = firebaseUser?.uid ? firebaseIdToUUID(firebaseUser.uid) : '';
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      storage: undefined,
      storageKey: 'supabase.auth.token',
      flowType: 'pkce'
    },
    global: {
      headers: {
        'X-Client-Info': 'daily-bread-app',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'X-User-ID': convertedUserId,
        'X-User-Email': firebaseUser?.email || '',
      }
    }
  });
};

// Database types
export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  journey_start_date: string;
  current_streak: number;
  total_prayers: number;
  total_bible_readings: number;
  created_at: string;
  updated_at: string;
}

export interface DailyActivity {
  id: string;
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

export interface MoodEntry {
  id: string;
  user_id: string;
  entry_date: string;
  mood_id: string;
  mood_type: string;
  intensity_rating: number;
  emoji: string;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface MoodInfluence {
  id: string;
  mood_entry_id: string;
  influence_name: string;
  influence_category: string;
  created_at: string;
}

export interface MoodAnalytics {
  user_id: string;
  entry_date: string;
  mood_type: string;
  intensity_rating: number;
  emoji: string;
  note: string | null;
  influences: string[];
  influence_categories: string[];
}

export interface Prayer {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: 'active' | 'answered' | 'paused' | 'archived';
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  category: 'personal' | 'family' | 'health' | 'work' | 'spiritual' | 'community' | 'world' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_shared: boolean;
  is_community: boolean;
  answered_at: string | null;
  answered_notes: string | null;
  prayer_notes: string | null;
  gratitude_notes: string | null;
  reminder_time: string | null;
  reminder_frequency: 'daily' | 'weekly' | 'monthly' | 'custom' | null;
  last_prayed_at: string | null;
  prayer_count: number;
  answered_prayer_count: number;
  created_at: string;
  updated_at: string;
}

export interface BibleVerse {
  id: string;
  reference: string;
  text: string;
  is_daily_verse: boolean;
  date_featured: string | null;
  created_at: string;
}

export interface Devotional {
  id: string;
  title: string;
  subtitle: string | null;
  content: string;
  reading_time_minutes: number;
  category: string;
  views_count: number;
  likes_count: number;
  is_featured: boolean;
  featured_date: string | null;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  testament: 'old' | 'new';
  book_reference: string | null;
  verse_reference: string | null;
  created_at: string;
}

export interface QuizSession {
  id: string;
  user_id: string;
  questions_answered: number;
  correct_answers: number;
  wrong_answers: number;
  total_score: number;
  category: string;
  difficulty: string;
  time_taken_seconds: number;
  completed_at: string | null;
  created_at: string;
}

export interface UserQuizStats {
  id: string;
  user_id: string;
  total_sessions: number;
  total_questions_answered: number;
  total_correct_answers: number;
  best_score: number;
  current_streak: number;
  longest_streak: number;
  favorite_category: string;
  total_time_spent_seconds: number;
  created_at: string;
  updated_at: string;
}
