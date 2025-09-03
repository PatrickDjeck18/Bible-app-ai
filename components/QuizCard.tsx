import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  Pressable,
  Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignTokens';
import { QuizQuestion } from '@/constants/QuizQuestions';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  BookOpen,
  Sparkles,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 768;
const isSmallDevice = SCREEN_HEIGHT < 700;

interface QuizCardProps {
  question: QuizQuestion;
  selectedAnswer: number | null;
  onAnswerSelect: (index: number) => void;
  showExplanation: boolean;
  timeRemaining?: number;
  isActive: boolean;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  showExplanation,
  timeRemaining,
  isActive
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const [answerAnimations] = useState(() => 
    question.options.map(() => new Animated.Value(0))
  );

  useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    // Stagger animation for answer options
    const animations = answerAnimations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      })
    );
    Animated.stagger(100, animations).start();
  }, [question.id]);

  useEffect(() => {
    // Timer animation
    if (timeRemaining !== undefined && timeRemaining > 0) {
      Animated.timing(progressAnim, {
        toValue: timeRemaining / 30,
        duration: 1000,
        useNativeDriver: false,
      }).start();

      // Shake animation when time is running out
      if (timeRemaining <= 5) {
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  }, [timeRemaining]);

  const getDifficultyConfig = () => {
    const configs = {
      easy: { 
        color: Colors.success[500], 
        bgColor: Colors.success[50],
        icon: '😊',
        label: 'Easy'
      },
      medium: { 
        color: Colors.warning[500], 
        bgColor: Colors.warning[50],
        icon: '🤔',
        label: 'Medium'
      },
      hard: { 
        color: Colors.error[500], 
        bgColor: Colors.error[50],
        icon: '🔥',
        label: 'Expert'
      }
    };
    return configs[question.difficulty] || configs.medium;
  };

  const getCategoryConfig = () => {
    const icons: Record<string, { emoji: string; color: string }> = {
      characters: { emoji: '👥', color: Colors.primary[500] },
      stories: { emoji: '📖', color: Colors.secondary[500] },
      verses: { emoji: '✨', color: Colors.warning[500] },
      geography: { emoji: '🗺️', color: Colors.success[500] },
      miracles: { emoji: '⚡', color: Colors.primary[600] },
      parables: { emoji: '🌱', color: Colors.success[600] },
      prophecy: { emoji: '🔮', color: Colors.secondary[600] },
      wisdom: { emoji: '🦉', color: Colors.neutral[600] },
      history: { emoji: '⏳', color: Colors.warning[600] },
      general: { emoji: '🎯', color: Colors.primary[500] }
    };
    return icons[question.category] || icons.general;
  };

  const getAnswerStatus = (index: number) => {
    if (!showExplanation) return 'default';
    if (index === question.correctAnswer) return 'correct';
    if (index === selectedAnswer && selectedAnswer !== question.correctAnswer) return 'wrong';
    return 'default';
  };

  const handleAnswerPress = (index: number) => {
    if (!isActive || selectedAnswer !== null) return;
    
    // Haptic feedback
    if (Platform.OS !== 'web') {
      Vibration.vibrate(10);
    }
    
    onAnswerSelect(index);
  };

  const renderAnswerOption = (option: string, index: number) => {
    const status = getAnswerStatus(index);
    const isSelected = selectedAnswer === index;
    const difficultyConfig = getDifficultyConfig();
    
    const getStatusConfig = () => {
      switch (status) {
        case 'correct':
          return {
            borderColor: Colors.success[500],
            backgroundColor: Colors.success[50],
            icon: <CheckCircle size={20} color={Colors.success[600]} />,
            textColor: Colors.success[700]
          };
        case 'wrong':
          return {
            borderColor: Colors.error[500],
            backgroundColor: Colors.error[50],
            icon: <XCircle size={20} color={Colors.error[600]} />,
            textColor: Colors.error[700]
          };
        default:
          return {
            borderColor: isSelected ? Colors.primary[500] : Colors.neutral[200],
            backgroundColor: isSelected ? Colors.primary[50] : 'white',
            icon: null,
            textColor: isSelected ? Colors.primary[700] : Colors.neutral[700]
          };
      }
    };

    const statusConfig = getStatusConfig();

    return (
      <Animated.View
        key={index}
        style={[
          {
            opacity: answerAnimations[index],
            transform: [
              {
                translateX: answerAnimations[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              },
              {
                scale: answerAnimations[index].interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.8, 1.05, 1],
                }),
              },
            ],
          },
        ]}
      >
        <Pressable
          onPress={() => handleAnswerPress(index)}
          disabled={!isActive || selectedAnswer !== null}
          style={({ pressed }) => [
            styles.answerOption,
            {
              borderColor: statusConfig.borderColor,
              backgroundColor: statusConfig.backgroundColor,
              transform: pressed && isActive ? [{ scale: 0.98 }] : [],
            },
          ]}
        >
          <View style={styles.answerContent}>
            <View style={styles.answerLeft}>
              <View style={[
                styles.answerIndex,
                isSelected && styles.answerIndexSelected,
                status === 'correct' && styles.answerIndexCorrect,
                status === 'wrong' && styles.answerIndexWrong,
              ]}>
                <Text style={[
                  styles.answerIndexText,
                  isSelected && styles.answerIndexTextSelected,
                  (status === 'correct' || status === 'wrong') && styles.answerIndexTextHighlight,
                ]}>
                  {String.fromCharCode(65 + index)}
                </Text>
              </View>
              <Text style={[
                styles.answerText,
                { color: statusConfig.textColor }
              ]}>
                {option}
              </Text>
            </View>
            {statusConfig.icon && (
              <Animated.View
                style={{
                  transform: [
                    {
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                    },
                  ],
                }}
              >
                {statusConfig.icon}
              </Animated.View>
            )}
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  const difficultyConfig = getDifficultyConfig();
  const categoryConfig = getCategoryConfig();

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
            { translateX: shakeAnim }
          ]
        }
      ]}
    >
      <View style={styles.card}>
        {/* Glass effect background */}
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.categoryBadge, { backgroundColor: `${categoryConfig.color}15` }]}>
              <Text style={styles.categoryIcon}>{categoryConfig.emoji}</Text>
              <Text style={[styles.categoryText, { color: categoryConfig.color }]}>
                {question.category}
              </Text>
            </View>
          </View>
          
          <View style={styles.headerRight}>
            <View style={[styles.difficultyBadge, { backgroundColor: difficultyConfig.bgColor }]}>
              <Text style={styles.difficultyIcon}>{difficultyConfig.icon}</Text>
              <Text style={[styles.difficultyText, { color: difficultyConfig.color }]}>
                {difficultyConfig.label}
              </Text>
            </View>
          </View>
        </View>

        {/* Timer Bar (if timed mode) */}
        {timeRemaining !== undefined && (
          <View style={styles.timerContainer}>
            <View style={styles.timerBar}>
              <Animated.View
                style={[
                  styles.timerProgress,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                    backgroundColor: timeRemaining <= 10 
                      ? Colors.error[500] 
                      : timeRemaining <= 20 
                      ? Colors.warning[500] 
                      : Colors.success[500],
                  },
                ]}
              />
            </View>
            <View style={styles.timerTextContainer}>
              <Clock size={16} color={timeRemaining <= 10 ? Colors.error[500] : Colors.neutral[600]} />
              <Text style={[
                styles.timerText,
                { color: timeRemaining <= 10 ? Colors.error[500] : Colors.neutral[600] }
              ]}>
                {timeRemaining}s
              </Text>
            </View>
          </View>
        )}

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionNumber}>
            Question {question.id || 1}
          </Text>
          <Text style={styles.questionText}>{question.question}</Text>
          
          {question.verse && (
            <View style={styles.verseContainer}>
              <BookOpen size={16} color={Colors.primary[600]} />
              <Text style={styles.verseText}>{question.verse}</Text>
            </View>
          )}
        </View>

        {/* Answer Options */}
        <View style={styles.answersContainer}>
          {question.options.map((option, index) => renderAnswerOption(option, index))}
        </View>

        {/* Explanation */}
        {showExplanation && question.explanation && (
          <Animated.View
            style={[
              styles.explanationContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={[Colors.primary[50], Colors.primary[100]]}
              style={styles.explanationGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.explanationHeader}>
                <Sparkles size={20} color={Colors.primary[600]} />
                <Text style={styles.explanationTitle}>Explanation</Text>
              </View>
              <Text style={styles.explanationText}>{question.explanation}</Text>
              
              <View style={styles.autoAdvanceContainer}>
                <Text style={styles.autoAdvanceText}>Next question in 3 seconds...</Text>
                <View style={styles.autoAdvanceBar}>
                  <Animated.View
                    style={[
                      styles.autoAdvanceProgress,
                      {
                        width: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['100%', '0%'],
                        }),
                      },
                    ]}
                  />
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH - (isTablet ? 64 : 32),
    alignSelf: 'center',
    marginVertical: Spacing.md,
  },
  card: {
    borderRadius: BorderRadius['3xl'],
    overflow: 'hidden',
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semiBold,
    textTransform: 'capitalize',
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  difficultyIcon: {
    fontSize: 16,
  },
  difficultyText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },
  timerContainer: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  timerBar: {
    height: 4,
    backgroundColor: Colors.neutral[200],
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  timerProgress: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  timerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  timerText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semiBold,
  },
  questionContainer: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  questionNumber: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    color: Colors.neutral[500],
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  questionText: {
    fontSize: isTablet ? Typography.sizes['2xl'] : Typography.sizes.xl,
    fontWeight: Typography.weights.semiBold,
    color: Colors.neutral[800],
    lineHeight: Typography.lineHeights.relaxed * (isTablet ? Typography.sizes['2xl'] : Typography.sizes.xl),
    marginBottom: Spacing.md,
  },
  verseContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.primary[50],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary[500],
    gap: Spacing.sm,
  },
  verseText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.primary[700],
    fontStyle: 'italic',
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.sm,
  },
  answersContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  answerOption: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  answerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  answerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },
  answerIndex: {
    width: isTablet ? 36 : 32,
    height: isTablet ? 36 : 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerIndexSelected: {
    backgroundColor: Colors.primary[500],
  },
  answerIndexCorrect: {
    backgroundColor: Colors.success[500],
  },
  answerIndexWrong: {
    backgroundColor: Colors.error[500],
  },
  answerIndexText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[600],
  },
  answerIndexTextSelected: {
    color: 'white',
  },
  answerIndexTextHighlight: {
    color: 'white',
  },
  answerText: {
    flex: 1,
    fontSize: isTablet ? Typography.sizes.lg : Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    lineHeight: Typography.lineHeights.relaxed * (isTablet ? Typography.sizes.lg : Typography.sizes.base),
  },
  explanationContainer: {
    margin: Spacing.xl,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  explanationGradient: {
    padding: Spacing.lg,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  explanationTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semiBold,
    color: Colors.primary[700],
  },
  explanationText: {
    fontSize: Typography.sizes.base,
    color: Colors.primary[800],
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.base,
    marginBottom: Spacing.md,
  },
  autoAdvanceContainer: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  autoAdvanceText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.primary[600],
    marginBottom: Spacing.sm,
  },
  autoAdvanceBar: {
    width: '100%',
    height: 3,
    backgroundColor: Colors.primary[200],
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  autoAdvanceProgress: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.full,
  },
});