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
import { useQuizDatabase } from '@/hooks/useQuizDatabase';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface QuizStats {
  totalQuestions: number;
  correctAnswers: number;
  currentStreak: number;
  score: number;
  timeElapsed: number;
}

export default function ModernBibleQuizScreen() {
  const { 
    quizState, 
    startQuiz, 
    answerQuestion, 
    nextQuestion, 
    completeQuiz, 
    getCurrentQuestion, 
    getProgress,
    stats
  } = useQuizDatabase();
  
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

  const currentQuestion = getCurrentQuestion();
  const progress = getProgress();

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
    setStartTime(Date.now());
    await startQuiz({
      questionCount: 15, // Reduced for better UX
      timePerQuestion: 30
    });
    setTimeRemaining(30);
    setQuizStats({
      totalQuestions: 0,
      correctAnswers: 0,
      currentStreak: 0,
      score: 0,
      timeElapsed: 0,
    });
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
    
    const isCorrect = answerIndex === currentQuestion?.correct_answer;
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
    
    await completeQuiz(finalScore);
    
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
    
    if (index === currentQuestion?.correct_answer) {
      return [styles.optionButton, styles.correctOption];
    }
    
    if (selectedAnswer === index && selectedAnswer !== currentQuestion?.correct_answer) {
      return [styles.optionButton, styles.incorrectOption];
    }
    
    return [styles.optionButton, styles.disabledOption];
  };

  const getAnswerTextStyle = (index: number) => {
    if (!showResult) return styles.optionText;
    
    if (index === currentQuestion?.correct_answer) {
      return [styles.optionText, styles.correctText];
    }
    
    if (selectedAnswer === index && selectedAnswer !== currentQuestion?.correct_answer) {
      return [styles.optionText, styles.incorrectText];
    }
    
    return [styles.optionText, styles.disabledText];
  };

  const renderResultIcon = (index: number) => {
    if (!showResult) return null;
    
    if (index === currentQuestion?.correct_answer) {
      return <CheckCircle size={24} color="#10B981" />;
    }
    
    if (selectedAnswer === index && selectedAnswer !== currentQuestion?.correct_answer) {
      return <XCircle size={24} color="#EF4444" />;
    }
    
    return null;
  };

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={Colors.gradients.spiritualLight}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading Quiz...</Text>
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.neutral[700]} />
        </TouchableOpacity>

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
            {/* Category Badge */}
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {currentQuestion.category?.toUpperCase() || 'GENERAL'}
              </Text>
              <View style={[
                styles.difficultyDot,
                {
                  backgroundColor: 
                    currentQuestion.difficulty === 'easy' ? Colors.success[500] :
                    currentQuestion.difficulty === 'medium' ? Colors.warning[500] :
                    Colors.error[500]
                }
              ]} />
            </View>

            {/* Question */}
            <Text style={styles.questionText}>
              {currentQuestion.question}
            </Text>

            {/* Bible Reference */}
            {currentQuestion.verse_reference && (
              <View style={styles.verseContainer}>
                <Text style={styles.verseText}>
                  {currentQuestion.verse_reference}
                </Text>
              </View>
            )}
          </LinearGradient>
        </Animated.View>

        {/* Answer Options */}
        <View style={styles.optionsContainer}>
          {[
            currentQuestion.option_a,
            currentQuestion.option_b,
            currentQuestion.option_c,
            currentQuestion.option_d
          ].map((option, index) => (
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
              colors={selectedAnswer === currentQuestion?.correct_answer 
                ? [Colors.success[400], Colors.success[600]]
                : [Colors.error[400], Colors.error[600]]
              }
              style={styles.scorePopupGradient}
            >
              <Text style={styles.scorePopupText}>
                {selectedAnswer === currentQuestion?.correct_answer 
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.medium,
    color: Colors.neutral[600],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? Spacing.md : Spacing.xl,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    ...Shadows.sm,
  },
  statText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semiBold,
    color: Colors.neutral[700],
  },
  progressContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.full,
  },
  progressText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.neutral[600],
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing['2xl'],
  },
  questionCard: {
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    ...Shadows.lg,
  },
  cardGradient: {
    padding: Spacing.xl,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary[50],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  categoryText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primary[700],
    letterSpacing: 1,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  questionText: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semiBold,
    color: Colors.neutral[800],
    lineHeight: Typography.sizes.xl * 1.4,
    marginBottom: Spacing.lg,
  },
  verseContainer: {
    backgroundColor: Colors.primary[50],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary[500],
  },
  verseText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.primary[700],
    fontStyle: 'italic',
  },
  optionsContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.sm,
  },
  correctOption: {
    borderColor: Colors.success[500],
    backgroundColor: Colors.success[50],
  },
  incorrectOption: {
    borderColor: Colors.error[500],
    backgroundColor: Colors.error[50],
  },
  disabledOption: {
    opacity: 0.6,
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
    gap: Spacing.md,
  },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetterText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: 'white',
  },
  optionText: {
    flex: 1,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: Colors.neutral[700],
    lineHeight: Typography.sizes.base * 1.4,
  },
  correctText: {
    color: Colors.success[700],
  },
  incorrectText: {
    color: Colors.error[700],
  },
  disabledText: {
    color: Colors.neutral[500],
  },
  scorePopup: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -75 }, { translateY: -25 }],
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.xl,
  },
  scorePopupGradient: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  scorePopupText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: 'white',
    textAlign: 'center',
  },
  currentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
    ...Shadows.sm,
  },
  statCardLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    color: Colors.neutral[600],
    textAlign: 'center',
  },
  statCardValue: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[800],
  },
});
