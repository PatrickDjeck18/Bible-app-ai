import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface DatabaseQuizQuestion {
  id: number;
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
  book_reference: string;
  verse_reference: string;
  created_at: string;
  updated_at: string;
}

export interface QuizSession {
  id?: number;
  user_id: string;
  questions_answered: number;
  correct_answers: number;
  wrong_answers: number;
  total_score: number;
  category: string;
  difficulty: string;
  time_taken_seconds: number;
  completed_at: string;
  created_at?: string;
}

export interface UserQuizStats {
  id?: number;
  user_id: string;
  total_sessions: number;
  total_questions_answered: number;
  total_correct_answers: number;
  best_score: number;
  current_streak: number;
  longest_streak: number;
  favorite_category: string;
  total_time_spent_seconds: number;
  created_at?: string;
  updated_at?: string;
}

export interface QuizState {
  questions: DatabaseQuizQuestion[];
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
  gameMode: 'timed' | 'mixed' | 'easy';
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  category: string | 'mixed';
  testament: 'old' | 'new' | 'both';
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
}

const INITIAL_QUIZ_STATE: QuizState = {
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  totalQuestions: 200,
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

export const useQuizDatabase = () => {
  const [quizState, setQuizState] = useState<QuizState>(INITIAL_QUIZ_STATE);
  const { user } = useAuth();
  const [stats, setStats] = useState<QuizStats>({
    totalGamesPlayed: 0,
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    bestStreak: 0,
    averageScore: 0,
    totalScore: 0,
    currentStreak: 0,
    longestStreak: 0
  });
  const [loading, setLoading] = useState(false);

  // Load user stats from database on mount
  useEffect(() => {
    loadUserStats();
  }, []);

  // Manual refresh function for debugging
  const refreshStats = useCallback(async () => {
    console.log('Manually refreshing stats...');
    await loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      console.log('Loading user stats for user:', user?.id);
      
      if (user) {
        const { data: userStats, error } = await supabase
          .from('user_quiz_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();

        console.log('User stats query result:', { userStats, error });

        if (userStats) {
          const newStats = {
            totalGamesPlayed: userStats.total_sessions || 0,
            totalQuestionsAnswered: userStats.total_questions_answered || 0,
            totalCorrectAnswers: userStats.total_correct_answers || 0,
            bestStreak: userStats.longest_streak || 0,
            averageScore: userStats.total_questions_answered > 0 
              ? (userStats.total_correct_answers / userStats.total_questions_answered) * 100 
              : 0,
            totalScore: userStats.best_score || 0,
            currentStreak: userStats.current_streak || 0,
            longestStreak: userStats.longest_streak || 0
          };
          
          console.log('Setting stats:', newStats);
          setStats(newStats);
        } else {
          console.log('No user stats found, setting default values');
          setStats({
            totalGamesPlayed: 0,
            totalQuestionsAnswered: 0,
            totalCorrectAnswers: 0,
            bestStreak: 0,
            averageScore: 0,
            totalScore: 0,
            currentStreak: 0,
            longestStreak: 0
          });
        }
      } else {
        console.log('No authenticated user found');
        setStats({
          totalGamesPlayed: 0,
          totalQuestionsAnswered: 0,
          totalCorrectAnswers: 0,
          bestStreak: 0,
          averageScore: 0,
          totalScore: 0,
          currentStreak: 0,
          longestStreak: 0
        });
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
      setStats({
        totalGamesPlayed: 0,
        totalQuestionsAnswered: 0,
        totalCorrectAnswers: 0,
        bestStreak: 0,
        averageScore: 0,
        totalScore: 0,
        currentStreak: 0,
        longestStreak: 0
      });
    }
  };

  // Fetch questions from database
  const fetchQuestions = async (options: {
    limit?: number;
  } = {}) => {
    setLoading(true);
    try {
      // Get all available questions
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*');

      if (error) {
        console.error('Error fetching questions:', error);
        return [];
      }

      if (!data || data.length === 0) {
        console.log('No questions found');
        return [];
      }

      // Remove duplicates based on question text
      const uniqueQuestions = data.filter((question, index, self) => 
        index === self.findIndex(q => q.question === question.question)
      );

      console.log(`Found ${uniqueQuestions.length} unique questions`);

      // Shuffle the questions for better randomization
      const shuffledQuestions = [...uniqueQuestions].sort(() => Math.random() - 0.5);

      // Return the requested number of questions, or all if we have fewer
      const requestedLimit = options.limit || 15;
      const finalQuestions = shuffledQuestions.slice(0, Math.min(requestedLimit, shuffledQuestions.length));

      console.log(`Returning ${finalQuestions.length} questions out of ${uniqueQuestions.length} available`);

      return finalQuestions;
    } catch (error) {
      console.error('Error fetching questions:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Start a new quiz
  const startQuiz = useCallback(async (options: {
    questionCount?: number;
    timePerQuestion?: number;
  } = {}) => {
    const {
      questionCount = 200,
      timePerQuestion = 30
    } = options;

    // Fetch questions from database
    const questions = await fetchQuestions({
      limit: questionCount
    });

    if (questions.length === 0) {
      console.error('No questions found');
      return;
    }

    setQuizState({
      ...INITIAL_QUIZ_STATE,
      questions,
      totalQuestions: questions.length,
      timeRemaining: timePerQuestion,
      isActive: true,
      gameMode: 'mixed',
      difficulty: 'mixed',
      category: 'mixed',
      testament: 'both',
      totalScore: stats.totalScore
    });
  }, [stats.totalScore]);

  // Answer a question
  const answerQuestion = useCallback((answerIndex: number) => {
    if (!quizState.isActive || quizState.selectedAnswer !== null) return;

    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correct_answer;
    
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
  const completeQuiz = useCallback(async (finalScore: number) => {
    try {
      if (user) {
        console.log('Saving quiz results for user:', user.id);
        console.log('Quiz state:', {
          questions: quizState.questions.length,
          correct: quizState.correctAnswers,
          wrong: quizState.wrongAnswers,
          score: finalScore,
          category: quizState.category,
          difficulty: quizState.difficulty
        });

        const { data: existingStats } = await supabase
          .from('user_quiz_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (existingStats) {
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
        }

        // Reload stats
        console.log('Reloading user stats after quiz completion...');
        await loadUserStats();
      }
    } catch (error) {
      console.error('Error completing quiz:', error);
    }

    setStats(prev => ({
      ...prev,
      totalGamesPlayed: prev.totalGamesPlayed + 1,
      totalScore: Math.max(prev.totalScore, finalScore)
    }));
  }, [quizState]);

  // Get current question
  const getCurrentQuestion = useCallback((): DatabaseQuizQuestion | null => {
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
    loading,
    
    // Actions
    startQuiz,
    answerQuestion,
    nextQuestion,
    resetQuiz,
    completeQuiz,
    refreshStats,
    
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
