import { useState, useCallback, useEffect } from 'react';
import {
  QuizQuestion,
  QuizCategory,
  getRandomQuestions,
  getQuestionsForLevel,
  DIFFICULTY_LEVELS,
  LevelConfig,
  getCurrentLevel,
  getNextLevel,
  getProgressToNextLevel,
  LEVEL_SYSTEM
} from '@/constants/QuizQuestions';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

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
  currentLevel: LevelConfig;
  categoryStats: Record<QuizCategory, {
    played: number;
    correct: number;
    accuracy: number;
  }>;
  difficultyStats: Record<'easy' | 'medium' | 'hard', {
    played: number;
    correct: number;
    accuracy: number;
  }>;
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

export const useBibleQuiz = () => {
  const { user } = useAuth();
  const [quizState, setQuizState] = useState<QuizState>(INITIAL_QUIZ_STATE);
  const [stats, setStats] = useState<QuizStats>({
    totalGamesPlayed: 0,
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    bestStreak: 0,
    averageScore: 0,
    totalScore: 0,
    currentLevel: LEVEL_SYSTEM[0],
    categoryStats: {} as any,
    difficultyStats: {
      easy: { played: 0, correct: 0, accuracy: 0 },
      medium: { played: 0, correct: 0, accuracy: 0 },
      hard: { played: 0, correct: 0, accuracy: 0 }
    }
  });

  // Load user stats from Supabase on mount
  useEffect(() => {
    const loadUserStats = async () => {
      try {
        if (user) {
          const { data: userStats } = await supabase
            .from('user_quiz_stats')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (userStats) {
            setStats(prev => ({
              ...prev,
              totalGamesPlayed: userStats.total_sessions,
              totalQuestionsAnswered: userStats.total_questions_answered,
              totalCorrectAnswers: userStats.total_correct_answers,
              bestStreak: userStats.longest_streak,
              averageScore: userStats.total_questions_answered > 0 
                ? (userStats.total_correct_answers / userStats.total_questions_answered) * 100 
                : 0,
              totalScore: userStats.best_score,
              currentLevel: getCurrentLevel(userStats.best_score)
            }));
          }
        }
      } catch (error) {
        console.error('Error loading user stats:', error);
      }
    };

    loadUserStats();
  }, []);

  // Timer effect for timed mode
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (quizState.isActive && quizState.timeRemaining > 0 && quizState.gameMode === 'timed') {
      interval = setInterval(() => {
        setQuizState(prev => {
          if (prev.timeRemaining <= 1) {
            // Time's up - auto submit current question
            return {
              ...prev,
              timeRemaining: 0,
              isActive: false,
              selectedAnswer: -1 // Indicates timeout
            };
          }
          return {
            ...prev,
            timeRemaining: prev.timeRemaining - 1
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [quizState.isActive, quizState.timeRemaining, quizState.gameMode]);

  // Auto-advance timer after answering a question
  useEffect(() => {
    let autoAdvanceTimer: ReturnType<typeof setTimeout>;
    
    if (quizState.showExplanation && quizState.selectedAnswer !== null) {
      autoAdvanceTimer = setTimeout(() => {
        // Auto advance to next question after 3 seconds
        const nextIndex = quizState.currentQuestionIndex + 1;
        const isLastQuestion = nextIndex >= quizState.questions.length;

        if (isLastQuestion) {
          // Quiz completed
          setQuizState(prev => ({
            ...prev,
            isCompleted: true,
            showExplanation: false
          }));
        } else {
          // Move to next question
          setQuizState(prev => ({
            ...prev,
            currentQuestionIndex: nextIndex,
            selectedAnswer: null,
            showExplanation: false,
            isActive: true,
            timeRemaining: prev.gameMode === 'timed' ? 30 : prev.timeRemaining
          }));
        }
      }, 3000); // 3 seconds delay
    }

    return () => {
      if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
    };
  }, [quizState.showExplanation, quizState.selectedAnswer, quizState.currentQuestionIndex, quizState.questions.length, quizState.gameMode]);

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
    
    // Calculate points based on difficulty and time (for timed mode)
    let points = 0;
    if (isCorrect) {
      const basePoints = DIFFICULTY_LEVELS[currentQuestion.difficulty].points;
      const timeBonus = quizState.gameMode === 'timed' 
        ? Math.floor((quizState.timeRemaining / 30) * 10) 
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

    // Update stats
    updateStats(currentQuestion, isCorrect);
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

  // Skip question (for endless mode)
  const skipQuestion = useCallback(() => {
    if (quizState.gameMode !== 'endless') return;
    
    setQuizState(prev => ({
      ...prev,
      selectedAnswer: -2, // Indicates skipped
      showExplanation: true,
      isActive: false
    }));
  }, [quizState.gameMode]);

  // Update statistics
  const updateStats = useCallback((question: QuizQuestion, isCorrect: boolean) => {
    setStats(prev => {
      const newStats = { ...prev };
      
      // Update overall stats
      newStats.totalQuestionsAnswered += 1;
      if (isCorrect) newStats.totalCorrectAnswers += 1;
      newStats.bestStreak = Math.max(newStats.bestStreak, quizState.streak + (isCorrect ? 1 : 0));
      newStats.averageScore = (newStats.totalCorrectAnswers / newStats.totalQuestionsAnswered) * 100;

      // Update category stats
      if (!newStats.categoryStats[question.category]) {
        newStats.categoryStats[question.category] = { played: 0, correct: 0, accuracy: 0 };
      }
      newStats.categoryStats[question.category].played += 1;
      if (isCorrect) newStats.categoryStats[question.category].correct += 1;
      newStats.categoryStats[question.category].accuracy = 
        (newStats.categoryStats[question.category].correct / newStats.categoryStats[question.category].played) * 100;

      // Update difficulty stats
      newStats.difficultyStats[question.difficulty].played += 1;
      if (isCorrect) newStats.difficultyStats[question.difficulty].correct += 1;
      newStats.difficultyStats[question.difficulty].accuracy = 
        (newStats.difficultyStats[question.difficulty].correct / newStats.difficultyStats[question.difficulty].played) * 100;

      return newStats;
    });
  }, [quizState.streak]);

  // Complete quiz and update final stats
  const completeQuiz = useCallback(async (finalScore: number) => {
    try {
      // Save quiz results to Supabase
      if (user) {
        // Save quiz session
        const { error: sessionError } = await supabase
          .from('quiz_sessions')
          .insert({
            user_id: user.id,
            questions_answered: quizState.questions.length,
            correct_answers: quizState.correctAnswers,
            wrong_answers: quizState.wrongAnswers,
            total_score: finalScore,
            category: quizState.category,
            difficulty: quizState.difficulty,
            time_taken_seconds: 600, // Approximate time
            completed_at: new Date().toISOString()
          });

        if (sessionError) {
          console.error('Error saving quiz session:', sessionError);
        }

        // Update user stats
        const { data: existingStats } = await supabase
          .from('user_quiz_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (existingStats) {
          // Update existing stats
          const { error: updateError } = await supabase
            .from('user_quiz_stats')
            .update({
              total_sessions: existingStats.total_sessions + 1,
              total_questions_answered: existingStats.total_questions_answered + quizState.questions.length,
              total_correct_answers: existingStats.total_correct_answers + quizState.correctAnswers,
              best_score: Math.max(existingStats.best_score, finalScore),
              current_streak: quizState.streak > existingStats.current_streak ? quizState.streak : existingStats.current_streak,
              longest_streak: Math.max(existingStats.longest_streak, quizState.streak),
              total_time_spent_seconds: existingStats.total_time_spent_seconds + 600,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id);

          if (updateError) {
            console.error('Error updating user stats:', updateError);
          }
        } else {
          // Create new stats
          const { error: insertError } = await supabase
            .from('user_quiz_stats')
            .insert({
              user_id: user.id,
              total_sessions: 1,
              total_questions_answered: quizState.questions.length,
              total_correct_answers: quizState.correctAnswers,
              best_score: finalScore,
              current_streak: quizState.streak,
              longest_streak: quizState.streak,
              favorite_category: quizState.category,
              total_time_spent_seconds: 600
            });

          if (insertError) {
            console.error('Error creating user stats:', insertError);
          }
        }
      }
    } catch (error) {
      console.error('Error completing quiz:', error);
    }

    setStats(prev => ({
      ...prev,
      totalGamesPlayed: prev.totalGamesPlayed + 1,
      totalScore: prev.totalScore + finalScore
    }));
  }, [quizState]);

  // Get current question
  const getCurrentQuestion = useCallback((): QuizQuestion | null => {
    if (quizState.questions.length === 0 || quizState.currentQuestionIndex >= quizState.questions.length) {
      return null;
    }
    return quizState.questions[quizState.currentQuestionIndex];
  }, [quizState.questions, quizState.currentQuestionIndex]);

  // Get quiz progress
  const getProgress = useCallback(() => {
    return {
      current: quizState.currentQuestionIndex + 1,
      total: quizState.questions.length,
      percentage: quizState.questions.length > 0 
        ? ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100 
        : 0
    };
  }, [quizState.currentQuestionIndex, quizState.questions.length]);

  // Get accuracy percentage
  const getAccuracy = useCallback(() => {
    const totalAnswered = quizState.correctAnswers + quizState.wrongAnswers;
    return totalAnswered > 0 ? (quizState.correctAnswers / totalAnswered) * 100 : 0;
  }, [quizState.correctAnswers, quizState.wrongAnswers]);

  // Get grade based on score
  const getGrade = useCallback(() => {
    const accuracy = getAccuracy();
    if (accuracy >= 90) return { grade: 'A+', color: '#10B981', message: 'Excellent!' };
    if (accuracy >= 80) return { grade: 'A', color: '#059669', message: 'Great job!' };
    if (accuracy >= 70) return { grade: 'B', color: '#0D9488', message: 'Good work!' };
    if (accuracy >= 60) return { grade: 'C', color: '#F59E0B', message: 'Keep studying!' };
    return { grade: 'D', color: '#EF4444', message: 'Need more practice!' };
  }, [getAccuracy]);

  return {
    // State
    quizState,
    stats,
    
    // Actions
    startQuiz,
    answerQuestion,
    nextQuestion,
    resetQuiz,
    skipQuestion,
    completeQuiz,
    
    // Getters
    getCurrentQuestion,
    getProgress,
    getAccuracy,
    getGrade,
    
    // Computed values
    isQuizActive: quizState.isActive,
    isQuizCompleted: quizState.isCompleted,
    currentQuestion: getCurrentQuestion(),
    progress: getProgress(),
    accuracy: getAccuracy(),
    grade: getGrade()
  };
};