import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { QuizQuestion, QuizSession } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface QuizState {
  session: QuizSession | null;
  currentQuestion: QuizQuestion | null;
  questions: QuizQuestion[];
  loading: boolean;
  timeLeft: number;
  powerUps: {
    hints: number;
    fifty_fifty: number;
    extra_time: number;
  };
}

export function useQuiz() {
  const { user } = useAuth();
  const [quizState, setQuizState] = useState<QuizState>({
    session: null,
    currentQuestion: null,
    questions: [],
    loading: false,
    timeLeft: 45,
    powerUps: {
      hints: 2,
      fifty_fifty: 1,
      extra_time: 3,
    },
  });

  const startNewQuiz = async (category?: string, difficulty?: string) => {
    if (!user) return { error: 'User not authenticated' };

    setQuizState(prev => ({ ...prev, loading: true }));

    try {
      // Fetch random questions based on criteria
      let query = supabase
        .from('quiz_questions')
        .select('*')
        .limit(10);

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      if (difficulty && difficulty !== 'all') {
        query = query.eq('difficulty', difficulty);
      }

      const { data: questions, error: questionsError } = await query;

      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
        return { error: questionsError };
      }

      if (!questions || questions.length === 0) {
        return { error: 'No questions found for the selected criteria' };
      }

      // Shuffle questions
      const shuffledQuestions = questions.sort(() => Math.random() - 0.5);

      // Create quiz session
      const { data: session, error: sessionError } = await supabase
        .from('quiz_sessions')
        .insert({
          user_id: user.id,
          questions: shuffledQuestions.map(q => q.id),
          current_question: 0,
          score: 0,
          correct_answers: 0,
          wrong_answers: 0,
          time_remaining: 45,
          power_ups_used: {
            hints: 0,
            fifty_fifty: 0,
            extra_time: 0,
          },
          status: 'active',
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Error creating session:', sessionError);
        return { error: sessionError };
      }

      setQuizState(prev => ({
        ...prev,
        session,
        questions: shuffledQuestions,
        currentQuestion: shuffledQuestions[0],
        timeLeft: 45,
        loading: false,
        powerUps: {
          hints: 2,
          fifty_fifty: 1,
          extra_time: 3,
        },
      }));

      return { data: session, error: null };
    } catch (error) {
      console.error('Error starting quiz:', error);
      setQuizState(prev => ({ ...prev, loading: false }));
      return { error };
    }
  };

  const answerQuestion = async (selectedAnswer: number) => {
    if (!quizState.session || !quizState.currentQuestion) return;

    const isCorrect = selectedAnswer === quizState.currentQuestion.correct_answer;
    const newScore = isCorrect ? quizState.session.score + 100 : quizState.session.score;
    const newCorrect = isCorrect ? quizState.session.correct_answers + 1 : quizState.session.correct_answers;
    const newWrong = !isCorrect ? quizState.session.wrong_answers + 1 : quizState.session.wrong_answers;
    const nextQuestionIndex = quizState.session.current_question + 1;
    const isLastQuestion = nextQuestionIndex >= quizState.questions.length;

    try {
      // Update session
      const { error: updateError } = await supabase
        .from('quiz_sessions')
        .update({
          current_question: nextQuestionIndex,
          score: newScore,
          correct_answers: newCorrect,
          wrong_answers: newWrong,
          status: isLastQuestion ? 'completed' : 'active',
          completed_at: isLastQuestion ? new Date().toISOString() : null,
        })
        .eq('id', quizState.session.id);

      if (updateError) {
        console.error('Error updating session:', updateError);
        return { error: updateError };
      }

      // Update local state
      const updatedSession = {
        ...quizState.session,
        current_question: nextQuestionIndex,
        score: newScore,
        correct_answers: newCorrect,
        wrong_answers: newWrong,
        status: isLastQuestion ? 'completed' as const : 'active' as const,
        completed_at: isLastQuestion ? new Date().toISOString() : null,
      };

      setQuizState(prev => ({
        ...prev,
        session: updatedSession,
        currentQuestion: isLastQuestion ? null : prev.questions[nextQuestionIndex],
      }));

      return { 
        data: { 
          isCorrect, 
          isLastQuestion, 
          score: newScore,
          explanation: quizState.currentQuestion.explanation 
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Error answering question:', error);
      return { error };
    }
  };

  const usePowerUp = async (type: 'hints' | 'fifty_fifty' | 'extra_time') => {
    if (!quizState.session || quizState.powerUps[type] <= 0) return { error: 'Power-up not available' };

    const newPowerUps = {
      ...quizState.powerUps,
      [type]: quizState.powerUps[type] - 1,
    };

    const newPowerUpsUsed = {
      ...quizState.session.power_ups_used,
      [type]: quizState.session.power_ups_used[type] + 1,
    };

    try {
      // Update session in database
      const { error: updateError } = await supabase
        .from('quiz_sessions')
        .update({
          power_ups_used: newPowerUpsUsed,
        })
        .eq('id', quizState.session.id);

      if (updateError) {
        console.error('Error updating power-ups:', updateError);
        return { error: updateError };
      }

      // Update local state
      setQuizState(prev => ({
        ...prev,
        powerUps: newPowerUps,
        session: prev.session ? {
          ...prev.session,
          power_ups_used: newPowerUpsUsed,
        } : null,
        timeLeft: type === 'extra_time' ? prev.timeLeft + 30 : prev.timeLeft,
      }));

      return { data: { type, remaining: newPowerUps[type] }, error: null };
    } catch (error) {
      console.error('Error using power-up:', error);
      return { error };
    }
  };

  const pauseQuiz = async () => {
    if (!quizState.session) return;

    try {
      const { error } = await supabase
        .from('quiz_sessions')
        .update({
          status: 'paused',
          time_remaining: quizState.timeLeft,
        })
        .eq('id', quizState.session.id);

      if (error) {
        console.error('Error pausing quiz:', error);
        return { error };
      }

      setQuizState(prev => ({
        ...prev,
        session: prev.session ? { ...prev.session, status: 'paused' } : null,
      }));

      return { error: null };
    } catch (error) {
      console.error('Error pausing quiz:', error);
      return { error };
    }
  };

  const resumeQuiz = async (sessionId: string) => {
    if (!user) return { error: 'User not authenticated' };

    setQuizState(prev => ({ ...prev, loading: true }));

    try {
      // Fetch session
      const { data: session, error: sessionError } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .single();

      if (sessionError) {
        console.error('Error fetching session:', sessionError);
        return { error: sessionError };
      }

      // Fetch questions
      const { data: questions, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*')
        .in('id', session.questions);

      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
        return { error: questionsError };
      }

      // Order questions according to session
      const orderedQuestions = session.questions.map((id: string) => 
        questions.find(q => q.id === id)
      ).filter(Boolean);

      setQuizState(prev => ({
        ...prev,
        session: { ...session, status: 'active' },
        questions: orderedQuestions,
        currentQuestion: orderedQuestions[session.current_question] || null,
        timeLeft: session.time_remaining,
        loading: false,
        powerUps: {
          hints: 2 - session.power_ups_used.hints,
          fifty_fifty: 1 - session.power_ups_used.fifty_fifty,
          extra_time: 3 - session.power_ups_used.extra_time,
        },
      }));

      return { data: session, error: null };
    } catch (error) {
      console.error('Error resuming quiz:', error);
      setQuizState(prev => ({ ...prev, loading: false }));
      return { error };
    }
  };

  const updateTimer = (timeLeft: number) => {
    setQuizState(prev => ({ ...prev, timeLeft }));
  };

  const getQuizStats = () => {
    if (!quizState.session) return null;

    return {
      score: quizState.session.score,
      correct: quizState.session.correct_answers,
      wrong: quizState.session.wrong_answers,
      total: quizState.questions.length,
      progress: ((quizState.session.current_question) / quizState.questions.length) * 100,
      timeLeft: quizState.timeLeft,
    };
  };

  return {
    quizState,
    startNewQuiz,
    answerQuestion,
    usePowerUp,
    pauseQuiz,
    resumeQuiz,
    updateTimer,
    getQuizStats,
  };
}