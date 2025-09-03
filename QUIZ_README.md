# Bible Quiz Feature

## Overview
The Bible Quiz feature is a comprehensive quiz system that tests users' knowledge of the Bible using questions stored in a SQL database. The system includes persistent user scores, statistics tracking, and multiple quiz modes.

## Features

### Quiz Modes
- **Mixed Quiz**: Random questions from all categories and difficulties
- **Old Testament**: Questions focused on the Old Testament
- **New Testament**: Questions focused on the New Testament
- **Easy Mode**: Simple questions for beginners
- **Hard Mode**: Challenging questions for advanced users
- **Timed Challenge**: Questions with time limits

### Question Categories
- Old Testament
- New Testament
- Gospels
- Epistles
- Prophets
- Wisdom Literature
- Psalms
- History

### Difficulty Levels
- **Easy**: Basic Bible knowledge questions
- **Medium**: Intermediate level questions
- **Hard**: Advanced theological questions

## Database Structure

### Tables

#### `quiz_questions`
Stores all quiz questions with the following fields:
- `id`: Unique identifier
- `question`: The quiz question text
- `option_a`, `option_b`, `option_c`, `option_d`: Multiple choice options
- `correct_answer`: Index of the correct answer (0-3)
- `explanation`: Explanation of the correct answer
- `category`: Question category
- `difficulty`: Question difficulty level
- `testament`: Old/New Testament classification
- `book_reference`: Biblical book reference
- `verse_reference`: Specific verse reference

#### `user_quiz_stats`
Tracks user performance and statistics:
- `user_id`: User identifier
- `total_sessions`: Total number of quiz sessions completed
- `total_questions_answered`: Total questions answered
- `total_correct_answers`: Total correct answers
- `best_score`: Highest score achieved
- `current_streak`: Current winning streak
- `longest_streak`: Longest winning streak achieved
- `favorite_category`: Most played category
- `total_time_spent_seconds`: Total time spent on quizzes

### Database Functions

#### `get_random_quiz_questions(p_limit, p_difficulty, p_category)`
Returns random quiz questions based on specified criteria.

#### `update_user_quiz_stats(p_user_id, p_questions_answered, p_correct_answers, p_total_score, p_time_taken_seconds)`
Updates user statistics after completing a quiz.

## Implementation

### Files Structure
```
app/
├── (tabs)/
│   └── quiz.tsx              # Quiz tab screen
├── bible-quiz.tsx            # Quiz game screen
hooks/
├── useQuizDatabase.ts        # Quiz database hook
constants/
└── QuizQuestions.ts          # Local quiz questions (fallback)
```

### Key Components

#### `useQuizDatabase` Hook
Manages quiz state and database interactions:
- Fetches questions from database
- Tracks quiz progress
- Saves quiz results
- Manages user statistics

#### Quiz Screen (`bible-quiz.tsx`)
Main quiz interface with:
- Question display
- Answer selection
- Timer functionality
- Score tracking
- Progress indicators

#### Quiz Tab (`quiz.tsx`)
Quiz selection interface with:
- Different quiz modes
- User statistics display
- Quick start options

## Usage

### Starting a Quiz
1. Navigate to the Quiz tab
2. Select a quiz mode (Mixed, Old Testament, New Testament, etc.)
3. Answer questions within the time limit
4. View results and statistics

### Scoring System
- **Base Points**: 100 points for easy, 150 for medium, 200 for hard questions
- **Time Bonus**: Additional points based on remaining time (timed mode)
- **Streak Bonus**: Bonus points for consecutive correct answers

### Statistics Tracking
The system automatically tracks:
- Total games played
- Questions answered
- Correct answers
- Best scores
- Current and longest streaks
- Time spent on quizzes

## Technical Details

### Question Fetching
Questions are fetched from the database using:
1. Database function `get_random_quiz_questions()` for optimal performance
2. Fallback to manual queries with client-side shuffling
3. Filtering by difficulty, category, and testament

### Score Persistence
Scores are saved using:
1. Database function `update_user_quiz_stats()` for atomic updates
2. Fallback to manual INSERT/UPDATE operations
3. Automatic statistics recalculation

### Error Handling
- Graceful fallbacks for database connection issues
- Local state management for offline functionality
- Comprehensive error logging

## Testing

### Database Testing
Run the `test_quiz_questions.sql` script in your Supabase SQL editor to verify:
- Question data integrity
- Database functions functionality
- Table structure correctness

### App Testing
1. Start the development server: `npm start`
2. Navigate to the Quiz tab
3. Test different quiz modes
4. Verify score persistence
5. Check statistics updates

## Future Enhancements

### Planned Features
- Leaderboards
- Achievement badges
- Social sharing
- Custom quiz creation
- Offline mode
- Audio questions
- Image-based questions

### Performance Optimizations
- Question caching
- Progressive loading
- Background sync
- Optimized database queries

## Troubleshooting

### Common Issues

#### Questions Not Loading
- Check database connection
- Verify quiz_questions table exists
- Run test_quiz_questions.sql to verify data

#### Scores Not Saving
- Check user authentication
- Verify user_quiz_stats table permissions
- Check database function availability

#### Statistics Not Updating
- Refresh the quiz tab
- Check network connectivity
- Verify database triggers are active

### Debug Information
Enable console logging to see:
- Question fetching details
- Score calculation
- Database operation results
- Error messages

## Support

For issues or questions about the Bible Quiz feature:
1. Check the troubleshooting section
2. Review database logs
3. Test with the provided SQL scripts
4. Contact the development team
