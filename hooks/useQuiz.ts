import { useEffect, useState, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  limit, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { useAuth } from './useAuth';

// Corrected: Added power_ups_used to QuizSession interface
export interface QuizSession {
  id: string;
  user_id: string;
  questions: string[];
  current_question: number;
  score: number;
  correct_answers: number;
  wrong_answers: number;
  time_remaining: number;
  power_ups_used: {
    hints: number;
    fifty_fifty: number;
    extra_time: number;
  };
  status: 'active' | 'paused' | 'completed';
  started_at: string;
  completed_at: string | null;
}

// Corrected: Updated QuizQuestion properties based on your CSV data
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
  difficulty: string;
  testament: string;
  book_reference: string;
  verse_reference: string;
  created_at: string;
  updated_at: string;
}

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

  const startNewQuiz = useCallback(async (category?: string, difficulty?: string) => {
    if (!user) return { error: 'User not authenticated' };

    setQuizState(prev => ({ ...prev, loading: true }));

    try {
      let questionsQuery = query(collection(db, 'quiz_questions'), limit(10));

      if (category && category !== 'all') {
        questionsQuery = query(questionsQuery, where('category', '==', category));
      }
      if (difficulty && difficulty !== 'all') {
        questionsQuery = query(questionsQuery, where('difficulty', '==', difficulty));
      }

      const questionSnapshot = await getDocs(questionsQuery);
      const questions = questionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as QuizQuestion[];

      if (!questions || questions.length === 0) {
        return { error: 'No questions found for the selected criteria' };
      }

      const shuffledQuestions = questions.sort(() => Math.random() - 0.5);

      const newSession = {
        user_id: user.uid,
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
      };

      const sessionRef = await addDoc(collection(db, 'quiz_sessions'), newSession);
      const sessionDoc = await getDoc(sessionRef);
      const session = { id: sessionDoc.id, ...sessionDoc.data() } as QuizSession;
      
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
  }, [user]);

  const answerQuestion = useCallback(async (selectedAnswer: number) => {
    if (!quizState.session || !quizState.currentQuestion) return;

    const isCorrect = selectedAnswer === quizState.currentQuestion.correct_answer;
    const newScore = isCorrect ? quizState.session.score + 100 : quizState.session.score;
    const newCorrect = isCorrect ? quizState.session.correct_answers + 1 : quizState.session.correct_answers;
    const newWrong = !isCorrect ? quizState.session.wrong_answers + 1 : quizState.session.wrong_answers;
    const nextQuestionIndex = quizState.session.current_question + 1;
    const isLastQuestion = nextQuestionIndex >= quizState.questions.length;

    try {
      await updateDoc(doc(db, 'quiz_sessions', quizState.session.id), {
        current_question: nextQuestionIndex,
        score: newScore,
        correct_answers: newCorrect,
        wrong_answers: newWrong,
        status: isLastQuestion ? 'completed' : 'active',
        completed_at: isLastQuestion ? new Date().toISOString() : null,
      });

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
  }, [quizState]);

  const usePowerUp = useCallback(async (type: 'hints' | 'fifty_fifty' | 'extra_time') => {
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
      await updateDoc(doc(db, 'quiz_sessions', quizState.session.id), {
        power_ups_used: newPowerUpsUsed,
      });

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
  }, [quizState]);

  const pauseQuiz = useCallback(async () => {
    if (!quizState.session) return;

    try {
      await updateDoc(doc(db, 'quiz_sessions', quizState.session.id), {
        status: 'paused',
        time_remaining: quizState.timeLeft,
      });

      setQuizState(prev => ({
        ...prev,
        session: prev.session ? { ...prev.session, status: 'paused' } : null,
      }));

      return { error: null };
    } catch (error) {
      console.error('Error pausing quiz:', error);
      return { error };
    }
  }, [quizState]);

  const resumeQuiz = useCallback(async (sessionId: string) => {
    if (!user) return { error: 'User not authenticated' };

    setQuizState(prev => ({ ...prev, loading: true }));

    try {
      const sessionRef = doc(db, 'quiz_sessions', sessionId);
      const sessionDoc = await getDoc(sessionRef);

      if (!sessionDoc.exists()) {
        return { error: 'Session not found' };
      }
      const session = { id: sessionDoc.id, ...sessionDoc.data() } as QuizSession;

      const questionsQuery = query(collection(db, 'quiz_questions'), where('id', 'in', session.questions));
      const questionsSnapshot = await getDocs(questionsQuery);
      const questions = questionsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })) as QuizQuestion[];

      const orderedQuestions = session.questions.map((id: string) => 
        questions.find(q => q.id === id)
      ).filter(Boolean) as QuizQuestion[];

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
  }, [user]);

  const updateTimer = useCallback((timeLeft: number) => {
    setQuizState(prev => ({ ...prev, timeLeft }));
  }, []);

  const getQuizStats = useCallback(() => {
    if (!quizState.session) return null;

    return {
      score: quizState.session.score,
      correct: quizState.session.correct_answers,
      wrong: quizState.session.wrong_answers,
      total: quizState.questions.length,
      progress: ((quizState.session.current_question) / quizState.questions.length) * 100,
      timeLeft: quizState.timeLeft,
    };
  }, [quizState]);

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