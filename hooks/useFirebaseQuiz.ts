import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';
import { QUIZ_QUESTIONS, QuizQuestion, QuizCategory, getRandomQuestions, getQuestionsForLevel, DIFFICULTY_LEVELS, LevelConfig, getCurrentLevel, getNextLevel, getProgressToNextLevel, LEVEL_SYSTEM } from '@/constants/QuizQuestions';
import { FirestoreService, COLLECTIONS } from '@/lib/firestore';
import { auth } from '@/lib/firebase';

export interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  totalQuestions: number;
  timeRemaining: number;
  isActive: boolean;
  isCompleted: boolean;
  selectedAnswer: number | null;
  showExplanation: boolean;
  streak: number;
  correctAnswers: number;
  wrongAnswers: number;
  gameMode: 'timed' | 'endless' | 'category' | 'mixed' | 'level';
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  category: QuizCategory | 'mixed';
  testament: 'old' | 'new' | 'both';
  currentLevel?: LevelConfig;
  totalScore: number;
}

export interface QuizStats {
  totalGamesPlayed: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  bestStreak: number;
  averageScore: number;
  totalScore: number;
  currentStreak: number;
  longestStreak: number;
  favoriteCategory: string;
  totalTimeSpentSeconds: number;
  currentLevel: LevelConfig;
  categoryStats: Record<string, { played: number; correct: number; accuracy: number }>;
  difficultyStats: {
    easy: { played: number; correct: number; accuracy: number };
    medium: { played: number; correct: number; accuracy: number };
    hard: { played: number; correct: number; accuracy: number };
  };
}

export interface QuizSession {
  id?: string;
  userId: string;
  questionsAnswered: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalScore: number;
  category: string;
  difficulty: string;
  timeTakenSeconds: number;
  completedAt: string;
  createdAt?: string;
}

const INITIAL_QUIZ_STATE: QuizState = {
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  totalQuestions: 20,
  timeRemaining: 30,
  isActive: false,
  isCompleted: false,
  selectedAnswer: null,
  showExplanation: false,
  streak: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  gameMode: 'mixed',
  difficulty: 'mixed',
  category: 'mixed',
  testament: 'both',
  totalScore: 0
};

export const useFirebaseQuiz = () => {
  const { user } = useAuth();
  const [quizState, setQuizState] = useState<QuizState>(INITIAL_QUIZ_STATE);
  const [stats, setStats] = useState<QuizStats>({
    totalGamesPlayed: 0,
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    bestStreak: 0,
    averageScore: 0,
    totalScore: 0,
    currentStreak: 0,
    longestStreak: 0,
    favoriteCategory: 'mixed',
    totalTimeSpentSeconds: 0,
    currentLevel: LEVEL_SYSTEM[0],
    categoryStats: {},
    difficultyStats: {
      easy: { played: 0, correct: 0, accuracy: 0 },
      medium: { played: 0, correct: 0, accuracy: 0 },
      hard: { played: 0, correct: 0, accuracy: 0 }
    }
  });
  const [loading, setLoading] = useState(false);

  // Load user stats from Firestore on mount
  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      if (!user) return;

      const userStats = await FirestoreService.getById(
        COLLECTIONS.USER_QUIZ_STATS,
        user.uid
      );

      if (userStats) {
        const newStats: QuizStats = {
          totalGamesPlayed: userStats.totalSessions || 0,
          totalQuestionsAnswered: userStats.totalQuestionsAnswered || 0,
          totalCorrectAnswers: userStats.totalCorrectAnswers || 0,
          bestStreak: userStats.longestStreak || 0,
          averageScore: userStats.totalQuestionsAnswered > 0 
            ? (userStats.totalCorrectAnswers / userStats.totalQuestionsAnswered) * 100 
            : 0,
          totalScore: userStats.bestScore || 0,
          currentStreak: userStats.currentStreak || 0,
          longestStreak: userStats.longestStreak || 0,
          favoriteCategory: userStats.favoriteCategory || 'mixed',
          totalTimeSpentSeconds: userStats.totalTimeSpentSeconds || 0,
          currentLevel: getCurrentLevel(userStats.bestScore || 0),
          categoryStats: userStats.categoryStats || {},
          difficultyStats: userStats.difficultyStats || {
            easy: { played: 0, correct: 0, accuracy: 0 },
            medium: { played: 0, correct: 0, accuracy: 0 },
            hard: { played: 0, correct: 0, accuracy: 0 }
          }
        };
        setStats(newStats);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  // Start a new quiz
  const startQuiz = useCallback((options: {
    gameMode?: 'timed' | 'endless' | 'category' | 'mixed' | 'level';
    difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
    category?: QuizCategory | 'mixed';
    testament?: 'old' | 'new' | 'both';
    questionCount?: number;
    timePerQuestion?: number;
    level?: LevelConfig;
  } = {}) => {
    const {
      gameMode = 'mixed',
      difficulty = 'mixed',
      category = 'mixed',
      testament = 'both',
      questionCount = 20,
      timePerQuestion = 30,
      level
    } = options;

    let questions: QuizQuestion[];
    let finalQuestionCount = questionCount;
    let finalTimePerQuestion = timePerQuestion;
    let currentLevel = level;

    // If level mode, use level configuration
    if (gameMode === 'level' && level) {
      questions = getQuestionsForLevel(level, { category: category !== 'mixed' ? category : undefined, testament });
      finalQuestionCount = level.questionsCount;
      finalTimePerQuestion = level.timePerQuestion;
      currentLevel = level;
    } else {
      // Generate questions based on filters
      const filters: any = {};
      if (category !== 'mixed') filters.category = category;
      if (difficulty !== 'mixed') filters.difficulty = difficulty;
      if (testament !== 'both') filters.testament = testament;

      questions = getRandomQuestions(
        gameMode === 'endless' ? 50 : finalQuestionCount,
        filters
      );
    }

    console.log(`Starting quiz with ${questions.length} questions`);

    setQuizState({
      ...INITIAL_QUIZ_STATE,
      questions,
      totalQuestions: gameMode === 'endless' ? questions.length : finalQuestionCount,
      timeRemaining: finalTimePerQuestion,
      isActive: true,
      gameMode,
      difficulty,
      category,
      testament,
      currentLevel,
      totalScore: stats.totalScore
    });
  }, [stats.totalScore]);

  // Answer a question
  const answerQuestion = useCallback((answerIndex: number) => {
    if (!quizState.isActive || quizState.selectedAnswer !== null) return;

    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    // Calculate points based on difficulty and time
    let points = 0;
    if (isCorrect) {
      const basePoints = currentQuestion.difficulty === 'easy' ? 100 : 
                        currentQuestion.difficulty === 'medium' ? 150 : 200;
      const timeBonus = quizState.gameMode === 'timed' 
        ? Math.floor((quizState.timeRemaining / 30) * 20) 
        : 0;
      points = basePoints + timeBonus;
    }

    setQuizState(prev => ({
      ...prev,
      selectedAnswer: answerIndex,
      score: prev.score + points,
      streak: isCorrect ? prev.streak + 1 : 0,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      wrongAnswers: prev.wrongAnswers + (isCorrect ? 0 : 1),
      showExplanation: true,
      isActive: false
    }));
  }, [quizState.isActive, quizState.selectedAnswer, quizState.currentQuestionIndex, quizState.questions, quizState.timeRemaining, quizState.gameMode]);

  // Move to next question
  const nextQuestion = useCallback(() => {
    setQuizState(prev => {
      const nextIndex = prev.currentQuestionIndex + 1;
      const isLastQuestion = nextIndex >= prev.questions.length;

      if (isLastQuestion) {
        // Quiz completed
        return {
          ...prev,
          isCompleted: true,
          showExplanation: false
        };
      }

      // Move to next question
      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        selectedAnswer: null,
        showExplanation: false,
        isActive: true,
        timeRemaining: prev.gameMode === 'timed' ? 30 : prev.timeRemaining
      };
    });
  }, []);

  // Reset quiz
  const resetQuiz = useCallback(() => {
    setQuizState(INITIAL_QUIZ_STATE);
  }, []);

  // Complete quiz and save results
  const completeQuiz = useCallback(async (finalScore: number, timeTaken: number) => {
    try {
      if (!user) return;

      const sessionData: QuizSession = {
        userId: user.uid,
        questionsAnswered: quizState.totalQuestions,
        correctAnswers: quizState.correctAnswers,
        wrongAnswers: quizState.wrongAnswers,
        totalScore: finalScore,
        category: quizState.category,
        difficulty: quizState.difficulty,
        timeTakenSeconds: timeTaken,
        completedAt: new Date().toISOString()
      };

      // Save quiz session
      await FirestoreService.create(COLLECTIONS.QUIZ_SESSIONS, sessionData);

      // Get current user stats
      const userStats = await FirestoreService.getById(
        COLLECTIONS.USER_QUIZ_STATS,
        user.uid
      );

      // Update user stats
      const newTotalSessions = stats.totalGamesPlayed + 1;
      const newTotalQuestions = stats.totalQuestionsAnswered + quizState.totalQuestions;
      const newTotalCorrect = stats.totalCorrectAnswers + quizState.correctAnswers;
      const newTotalScore = Math.max(stats.totalScore, finalScore);
      const newCurrentStreak = quizState.streak > stats.currentStreak ? quizState.streak : stats.currentStreak;
      const newLongestStreak = Math.max(stats.longestStreak, quizState.streak);
      const newTotalTime = stats.totalTimeSpentSeconds + timeTaken;

      // Update category stats
      const categoryKey = quizState.category;
      const currentCategoryStats = stats.categoryStats[categoryKey] || { played: 0, correct: 0, accuracy: 0 };
      const newCategoryStats = {
        ...stats.categoryStats,
        [categoryKey]: {
          played: currentCategoryStats.played + 1,
          correct: currentCategoryStats.correct + quizState.correctAnswers,
          accuracy: ((currentCategoryStats.correct + quizState.correctAnswers) / (currentCategoryStats.played + 1)) * 100
        }
      };

      // Update difficulty stats
      const difficultyKey = quizState.difficulty;
      const currentDifficultyStats = stats.difficultyStats[difficultyKey as keyof typeof stats.difficultyStats] || { played: 0, correct: 0, accuracy: 0 };
      const newDifficultyStats = {
        ...stats.difficultyStats,
        [difficultyKey]: {
          played: currentDifficultyStats.played + 1,
          correct: currentDifficultyStats.correct + quizState.correctAnswers,
          accuracy: ((currentDifficultyStats.correct + quizState.correctAnswers) / (currentDifficultyStats.played + 1)) * 100
        }
      };

      const updatedStats = {
        totalSessions: newTotalSessions,
        totalQuestionsAnswered: newTotalQuestions,
        totalCorrectAnswers: newTotalCorrect,
        bestScore: newTotalScore,
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        favoriteCategory: categoryKey,
        totalTimeSpentSeconds: newTotalTime,
        categoryStats: newCategoryStats,
        difficultyStats: newDifficultyStats,
        updatedAt: new Date().toISOString()
      };

      // Save updated stats
      if (userStats) {
        await FirestoreService.update(COLLECTIONS.USER_QUIZ_STATS, user.uid, updatedStats);
      } else {
        await FirestoreService.create(COLLECTIONS.USER_QUIZ_STATS, {
          userId: user.uid,
          ...updatedStats
        });
      }

      // Update local stats
      setStats(prev => ({
        ...prev,
        totalGamesPlayed: newTotalSessions,
        totalQuestionsAnswered: newTotalQuestions,
        totalCorrectAnswers: newTotalCorrect,
        totalScore: newTotalScore,
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        favoriteCategory: categoryKey,
        totalTimeSpentSeconds: newTotalTime,
        categoryStats: newCategoryStats,
        difficultyStats: newDifficultyStats,
        currentLevel: getCurrentLevel(newTotalScore)
      }));

      console.log('Quiz results saved successfully');
    } catch (error) {
      console.error('Error saving quiz results:', error);
    }
  }, [user, quizState, stats]);

  // Get current question
  const getCurrentQuestion = useCallback(() => {
    if (quizState.questions.length === 0 || quizState.currentQuestionIndex >= quizState.questions.length) {
      return null;
    }
    return quizState.questions[quizState.currentQuestionIndex];
  }, [quizState.questions, quizState.currentQuestionIndex]);

  // Get progress
  const getProgress = useCallback(() => {
    const current = quizState.currentQuestionIndex + 1;
    const total = quizState.totalQuestions;
    const percentage = (current / total) * 100;
    
    return {
      current,
      total,
      percentage: Math.min(100, Math.max(0, percentage))
    };
  }, [quizState.currentQuestionIndex, quizState.totalQuestions]);

  return {
    quizState,
    stats,
    loading,
    startQuiz,
    answerQuestion,
    nextQuestion,
    resetQuiz,
    completeQuiz,
    getCurrentQuestion,
    getProgress,
    loadUserStats
  };
};
