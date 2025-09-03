import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignTokens';
import {
  ArrowLeft,
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Target,
  Award,
  TrendingUp,
} from 'lucide-react-native';
import { useFirebaseQuiz } from '@/hooks/useFirebaseQuiz';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface QuizStats {
  totalQuestions: number;
  correctAnswers: number;
  currentStreak: number;
  score: number;
  timeElapsed: number;
}

export default function BibleQuizScreen() {
  const { 
    quizState, 
    startQuiz, 
    answerQuestion, 
    nextQuestion, 
    completeQuiz, 
    getCurrentQuestion, 
    getProgress,
    stats
  } = useFirebaseQuiz();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;
  
  // State
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [quizStats, setQuizStats] = useState<QuizStats>({
    totalQuestions: 0,
    correctAnswers: 0,
    currentStreak: 0,
    score: 0,
    timeElapsed: 0,
  });
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = getCurrentQuestion();
  const progress = getProgress();

  // Debug logging
  useEffect(() => {
    console.log('Quiz state:', {
      questionsCount: quizState.questions.length,
      currentIndex: quizState.currentQuestionIndex,
      isActive: quizState.isActive,
      currentQuestion: currentQuestion?.question
    });
  }, [quizState.questions.length, quizState.currentQuestionIndex, quizState.isActive, currentQuestion]);

  // Initialize quiz
  useEffect(() => {
    initializeQuiz();
  }, []);

  // Entry animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentQuestion]);

  // Progress animation
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress.percentage / 100,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress.percentage]);

  // Timer effect
  useEffect(() => {
    if (!quizState.isActive || showResult) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [quizState.isActive, showResult, currentQuestion]);

  const initializeQuiz = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setStartTime(Date.now());
      console.log('Initializing quiz...');
      await startQuiz({
        questionCount: 15, // Reduced for better UX
        timePerQuestion: 30
      });
      setTimeRemaining(30);
      setQuizStats({
        totalQuestions: 15,
        correctAnswers: 0,
        currentStreak: 0,
        score: 0,
        timeElapsed: 0,
      });
    } catch (err) {
      console.error('Error initializing quiz:', err);
      setError('Failed to load quiz questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeout = () => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(-1); // -1 indicates timeout
    setShowResult(true);
    
    setTimeout(() => {
      handleNextQuestion();
    }, 2000);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || !quizState.isActive) return;

    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === currentQuestion?.correctAnswer;
    const timeBonus = Math.floor((timeRemaining / 30) * 50);
    const basePoints = isCorrect ? 100 : 0;
    const totalPoints = basePoints + (isCorrect ? timeBonus : 0);

    // Update local stats
    setQuizStats(prev => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      currentStreak: isCorrect ? prev.currentStreak + 1 : 0,
      score: prev.score + totalPoints,
      timeElapsed: Math.floor((Date.now() - startTime) / 1000),
    }));

    // Animate score
    Animated.spring(scoreAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start(() => {
      scoreAnim.setValue(0);
    });

    // Answer question in database
    answerQuestion(answerIndex);

    // Auto proceed after showing result
    setTimeout(() => {
      handleNextQuestion();
    }, 2500);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeRemaining(30);
    
    if (progress.current >= progress.total) {
      handleQuizComplete();
    } else {
      nextQuestion();
      
      // Reset animations for next question
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      scaleAnim.setValue(0.9);
      
      // Restart entry animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleQuizComplete = async () => {
    const finalScore = quizStats.score;
    const accuracy = Math.round((quizStats.correctAnswers / quizStats.totalQuestions) * 100);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    
    await completeQuiz(finalScore, timeTaken);
    
    const getGradeInfo = () => {
      if (accuracy >= 90) return { grade: 'A+', color: '#10B981', emoji: '🏆', message: 'Outstanding!' };
      if (accuracy >= 80) return { grade: 'A', color: '#059669', emoji: '🌟', message: 'Excellent!' };
      if (accuracy >= 70) return { grade: 'B', color: '#0D9488', emoji: '👏', message: 'Great job!' };
      if (accuracy >= 60) return { grade: 'C', color: '#F59E0B', emoji: '👍', message: 'Good work!' };
      return { grade: 'D', color: '#EF4444', emoji: '📚', message: 'Keep studying!' };
    };

    const gradeInfo = getGradeInfo();
    
    Alert.alert(
      `Quiz Complete! ${gradeInfo.emoji}`,
      `Final Score: ${finalScore} points\nCorrect: ${quizStats.correctAnswers}/${quizStats.totalQuestions}\nAccuracy: ${accuracy}%\nGrade: ${gradeInfo.grade}\n\n${gradeInfo.message}`,
      [
        {
          text: 'Play Again',
          onPress: () => {
            initializeQuiz();
          }
        },
        {
          text: 'Back to Menu',
          onPress: () => router.back()
        }
      ]
    );
  };

  const getAnswerStyle = (index: number) => {
    if (!showResult) return styles.optionButton;
    
    if (index === currentQuestion?.correctAnswer) {
      return [styles.optionButton, styles.correctOption];
    }
    
    if (selectedAnswer === index && selectedAnswer !== currentQuestion?.correctAnswer) {
      return [styles.optionButton, styles.incorrectOption];
    }
    
    return [styles.optionButton, styles.disabledOption];
  };

  const getAnswerTextStyle = (index: number) => {
    if (!showResult) return styles.optionText;
    
    if (index === currentQuestion?.correctAnswer) {
      return [styles.optionText, styles.correctText];
    }
    
    if (selectedAnswer === index && selectedAnswer !== currentQuestion?.correctAnswer) {
      return [styles.optionText, styles.incorrectText];
    }
    
    return [styles.optionText, styles.disabledText];
  };

  const renderResultIcon = (index: number) => {
    if (!showResult) return null;
    
    if (index === currentQuestion?.correctAnswer) {
      return <CheckCircle size={24} color="#10B981" />;
    }
    
    if (selectedAnswer === index && selectedAnswer !== currentQuestion?.correctAnswer) {
      return <XCircle size={24} color="#EF4444" />;
    }
    
    return null;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={Colors.gradients.spiritualLight}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading Quiz Questions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={Colors.gradients.spiritualLight}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={initializeQuiz}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={Colors.gradients.spiritualLight}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>No questions available. Please try again.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={initializeQuiz}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={Colors.gradients.spiritualLight}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.hero}>
        <LinearGradient
          colors={Colors.gradients.spiritualLight || ['#fdfcfb', '#e2d1c3', '#c9d6ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={styles.heroContent}>
            <TouchableOpacity 
              style={styles.heroActionButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={20} color={Colors.primary[600]} />
            </TouchableOpacity>
            <View style={styles.heroTextBlock}>
              <Text style={styles.heroTitle}>Bible Quiz</Text>
              <Text style={styles.heroSubtitle}>
                Test your knowledge of God's Word
              </Text>
            </View>
            <View style={styles.heroActions}>
              {/* Space for future actions */}
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.headerStats}>
          <View style={styles.statItem}>
            <Target size={16} color={Colors.primary[600]} />
            <Text style={styles.statText}>{progress.current}/{progress.total}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Trophy size={16} color={Colors.warning[600]} />
            <Text style={styles.statText}>{quizStats.score}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Clock size={16} color={timeRemaining <= 10 ? Colors.error[600] : Colors.success[600]} />
            <Text style={[styles.statText, { color: timeRemaining <= 10 ? Colors.error[600] : Colors.success[600] }]}>
              {timeRemaining}s
            </Text>
          </View>
        </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Question {progress.current} of {progress.total}
        </Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Question Card */}
        <Animated.View
          style={[
            styles.questionCard,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
            style={styles.cardGradient}
          >
            {/* Question */}
            <Text style={styles.questionText}>
              {currentQuestion.question}
            </Text>

            {/* Bible Reference */}
            {currentQuestion.verse && (
              <View style={styles.verseContainer}>
                <Text style={styles.verseText}>
                  {currentQuestion.verse}
                </Text>
              </View>
            )}
          </LinearGradient>
        </Animated.View>

        {/* Answer Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <Animated.View
              key={index}
              style={[
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateX: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                style={getAnswerStyle(index)}
                onPress={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                activeOpacity={0.8}
              >
                <View style={styles.optionContent}>
                  <View style={styles.optionLeft}>
                    <View style={styles.optionLetter}>
                      <Text style={styles.optionLetterText}>
                        {String.fromCharCode(65 + index)}
                      </Text>
                    </View>
                    <Text style={getAnswerTextStyle(index)}>
                      {option}
                    </Text>
                  </View>
                  {renderResultIcon(index)}
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Score Animation */}
        {showResult && selectedAnswer !== null && selectedAnswer !== -1 && (
          <Animated.View
            style={[
              styles.scorePopup,
              {
                opacity: scoreAnim,
                transform: [
                  {
                    scale: scoreAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  },
                  {
                    translateY: scoreAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={selectedAnswer === currentQuestion?.correctAnswer 
                ? [Colors.success[400], Colors.success[600]]
                : [Colors.error[400], Colors.error[600]]
              }
              style={styles.scorePopupGradient}
            >
              <Text style={styles.scorePopupText}>
                {selectedAnswer === currentQuestion?.correctAnswer 
                  ? `+${100 + Math.floor((timeRemaining / 30) * 50)} points!`
                  : 'Try again!'
                }
              </Text>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Current Stats */}
        <View style={styles.currentStats}>
          <View style={styles.statCard}>
            <Star size={20} color={Colors.warning[600]} />
            <Text style={styles.statCardLabel}>Streak</Text>
            <Text style={styles.statCardValue}>{quizStats.currentStreak}</Text>
          </View>
          
          <View style={styles.statCard}>
            <TrendingUp size={20} color={Colors.success[600]} />
            <Text style={styles.statCardLabel}>Accuracy</Text>
            <Text style={styles.statCardValue}>
              {quizStats.totalQuestions > 0 
                ? Math.round((quizStats.correctAnswers / quizStats.totalQuestions) * 100)
                : 0}%
            </Text>
          </View>
          
          <View style={styles.statCard}>
            <Award size={20} color={Colors.primary[600]} />
            <Text style={styles.statCardLabel}>Best Score</Text>
            <Text style={styles.statCardValue}>{stats.totalScore}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[700],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: (Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0) + Spacing.md,
    paddingBottom: Spacing.md,
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semiBold,
    color: Colors.neutral[700],
  },
  progressContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.neutral[200],
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.full,
  },
  progressText: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[500],
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  questionCard: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  cardGradient: {
    padding: Spacing.lg,
  },
  questionText: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[800],
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  verseContainer: {
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  verseText: {
    fontSize: Typography.sizes.base,
    fontStyle: 'italic',
    color: Colors.neutral[600],
  },
  optionsContainer: {
    gap: Spacing.md,
  },
  optionButton: {
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    padding: Spacing.md,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  optionLetterText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.primary[600],
  },
  optionText: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[700],
    flex: 1,
  },
  correctOption: {
    backgroundColor: Colors.success[50],
    borderColor: Colors.success[500],
  },
  correctText: {
    color: Colors.success[800],
    fontWeight: Typography.weights.bold,
  },
  incorrectOption: {
    backgroundColor: Colors.error[50],
    borderColor: Colors.error[500],
  },
  incorrectText: {
    color: Colors.error[800],
    fontWeight: Typography.weights.bold,
  },
  disabledOption: {
    backgroundColor: Colors.neutral[100],
    borderColor: Colors.neutral[200],
    opacity: 0.7,
  },
  disabledText: {
    color: Colors.neutral[500],
  },
  scorePopup: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  scorePopupGradient: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    ...Shadows.lg,
  },
  scorePopupText: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[50],
  },
  currentStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: BorderRadius.lg,
  },
  statCard: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statCardLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[600],
  },
  statCardValue: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[800],
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: Typography.sizes.lg,
    color: Colors.error[700],
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  retryButton: {
    backgroundColor: Colors.primary[600],
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  retryButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[50],
  },
  // Hero Header Styles
  hero: {
    paddingTop: (Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0) + Spacing.md,
    paddingBottom: Spacing.lg,
  },
  heroGradient: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.lg,
    ...Shadows.md,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTextBlock: {
    flex: 1,
  },
  heroTitle: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[800],
    marginBottom: Spacing.xs,
  },
  heroSubtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[600],
    lineHeight: Typography.lineHeights.base,
  },
  heroActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  heroActionButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
});
