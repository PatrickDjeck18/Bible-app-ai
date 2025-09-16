// import { initializeApp, FirebaseApp } from 'firebase/app';
// import { getFirestore, Firestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);

// console.log('🟢 Firebase configuration:', { 
//   projectId: firebaseConfig.projectId,
//   initialized: !!db
// });

// export { app, db, auth };

// Database types... (rest of your file)
// Database types - No changes needed as they are standard TypeScript
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