# Bible Quiz Setup Guide

## Overview
The Bible Quiz feature has been completely updated to work with Firebase Firestore and includes comprehensive question sets, score tracking, and user statistics.

## Features Implemented

### ✅ Fixed Issues
1. **Quiz Loading**: Now uses local questions from `constants/QuizQuestions.ts` instead of database queries
2. **Question Database**: Added 100+ comprehensive Bible questions across all categories
3. **Score Saving**: Implemented Firebase Firestore integration for saving user scores and statistics
4. **Error Handling**: Added proper loading states and error handling
5. **User Statistics**: Complete tracking of user performance, streaks, and progress

### 📊 Quiz Categories
- **Characters**: Bible figures and personalities (25 questions)
- **Stories**: Famous biblical events and narratives (15 questions)
- **Verses**: Scripture memorization and understanding (10 questions)
- **Miracles**: Divine interventions and wonders (5 questions)
- **Geography**: Biblical places and locations (5 questions)
- **Parables**: Jesus' teaching stories (5 questions)
- **Prophecy**: Prophetic books and messages (5 questions)
- **Wisdom**: Proverbs, Psalms, and wise sayings (5 questions)
- **History**: Historical events and timelines (5 questions)
- **General**: Mixed Bible trivia and facts (15 questions)

### 🎯 Difficulty Levels
- **Easy**: Perfect for new Bible readers
- **Medium**: For regular Bible students
- **Hard**: Challenge for Bible scholars

### 🏆 Scoring System
- **Easy Questions**: 100 points base
- **Medium Questions**: 150 points base
- **Hard Questions**: 200 points base
- **Time Bonus**: Additional points for quick answers
- **Streak Bonus**: Bonus points for consecutive correct answers

## Firebase Collections

The quiz uses the following Firestore collections:

### `quiz_sessions`
Stores individual quiz session results:
```typescript
{
  userId: string;
  questionsAnswered: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalScore: number;
  category: string;
  difficulty: string;
  timeTakenSeconds: number;
  completedAt: string;
}
```

### `user_quiz_stats`
Stores user performance statistics:
```typescript
{
  totalSessions: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  bestScore: number;
  currentStreak: number;
  longestStreak: number;
  favoriteCategory: string;
  totalTimeSpentSeconds: number;
  categoryStats: Record<string, { played: number; correct: number; accuracy: number }>;
  difficultyStats: {
    easy: { played: number; correct: number; accuracy: number };
    medium: { played: number; correct: number; accuracy: number };
    hard: { played: number; correct: number; accuracy: number };
  };
}
```

## Setup Instructions

### 1. Firebase Configuration
Ensure your Firebase configuration is properly set up in `lib/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Your Firebase config here
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
```

### 2. Firestore Security Rules
Set up permissive rules for development (update for production):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Environment Variables
Ensure these environment variables are set:
```bash
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Usage

### Starting a Quiz
```typescript
import { useFirebaseQuiz } from '@/hooks/useFirebaseQuiz';

const { startQuiz } = useFirebaseQuiz();

// Start a mixed quiz
await startQuiz({
  questionCount: 15,
  timePerQuestion: 30
});

// Start a category-specific quiz
await startQuiz({
  category: 'characters',
  difficulty: 'medium',
  questionCount: 10
});
```

### Accessing User Stats
```typescript
const { stats } = useFirebaseQuiz();

console.log('Total games played:', stats.totalGamesPlayed);
console.log('Best score:', stats.totalScore);
console.log('Current streak:', stats.currentStreak);
```

## Troubleshooting

### "No questions found" Error
**Cause**: Questions not loading from local file
**Solution**: 
1. Check that `constants/QuizQuestions.ts` exists and has questions
2. Verify the import path in `useFirebaseQuiz.ts`
3. Check console logs for any import errors

### Firebase Connection Issues
**Cause**: Firebase not properly configured
**Solution**:
1. Verify Firebase config in `lib/firebase.ts`
2. Check environment variables
3. Ensure Firestore is enabled in Firebase Console
4. Verify security rules allow read/write

### Score Not Saving
**Cause**: User not authenticated or Firebase error
**Solution**:
1. Ensure user is logged in
2. Check Firebase console for errors
3. Verify Firestore permissions
4. Check network connectivity

### Quiz Not Starting
**Cause**: Hook not properly initialized
**Solution**:
1. Ensure `useFirebaseQuiz` is imported correctly
2. Check that user authentication is working
3. Verify all required dependencies are installed

## Adding More Questions

To add more questions, edit `constants/QuizQuestions.ts`:

```typescript
{
  id: 'unique_id',
  question: 'Your question here?',
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  correctAnswer: 0, // Index of correct answer (0-3)
  category: 'characters', // or other categories
  difficulty: 'easy', // 'easy', 'medium', or 'hard'
  verse: 'Bible reference',
  explanation: 'Explanation of the answer',
  testament: 'old' // 'old', 'new', or 'both'
}
```

## Performance Tips

1. **Question Loading**: Questions are loaded locally for fast access
2. **Score Calculation**: Points are calculated client-side for immediate feedback
3. **Statistics**: User stats are cached locally and synced with Firebase
4. **Error Recovery**: Automatic retry mechanisms for failed operations

## Future Enhancements

- [ ] Offline mode with local storage
- [ ] Multiplayer quiz competitions
- [ ] Daily quiz challenges
- [ ] Achievement badges
- [ ] Social sharing of scores
- [ ] Custom quiz creation
- [ ] Question difficulty adaptation based on performance

## Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify Firebase configuration
3. Ensure all dependencies are installed
4. Test with a simple quiz first
5. Check network connectivity

The quiz system is now fully functional with Firebase integration and comprehensive question sets!
