import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  Animated,
  ViewToken,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignTokens';
import {
  BookOpen,
  Brain,
  Heart,
  ChevronRight,
  MessageCircle,
  Moon,
  Shield,
  Sparkles,
  Book,
  Target,
  Zap,
} from 'lucide-react-native';
import { useOnboarding } from '@/hooks/useOnboarding';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const onboardingSlides = [
  {
    id: 1,
    title: 'Welcome to Daily Bread',
    subtitle: 'Your Personal Bible Study & Growth App',
    description: 'Discover a comprehensive spiritual journey with AI-powered Bible study, dream interpretation, mood tracking, and interactive learning tools designed to deepen your faith.',
    icon: Book,
    color: Colors.primary[600],
    features: ['AI Bible Chat', 'Dream Interpretation', 'Mood Tracking', 'Prayer Journal'],
  },
  {
    id: 2,
    title: 'AI-Powered Bible Study',
    subtitle: 'Chat with Scripture & Get Answers',
    description: 'Ask questions about the Bible, get personalized study guidance, and explore theological topics with our intelligent AI assistant trained on biblical knowledge.',
    icon: MessageCircle,
    color: Colors.secondary[500],
    features: ['Biblical Q&A', 'Study Guidance', 'Theological Discussions', 'Personal Insights'],
  },
  {
    id: 3,
    title: 'Dream Interpretation',
    subtitle: 'Biblical Dream Analysis with AI',
    description: 'Share your dreams and receive spiritual interpretations based on biblical symbolism and Christian perspectives. Understand God\'s messages through your dreams.',
    icon: Moon,
    color: Colors.primary[500],
    features: ['AI Dream Analysis', 'Biblical Symbolism', 'Spiritual Insights', 'Prayer Guidance'],
  },
  {
    id: 4,
    title: 'Interactive Bible Quiz',
    subtitle: 'Test & Grow Your Knowledge',
    description: 'Challenge yourself with engaging Bible quizzes covering Old and New Testament topics. Track your progress and learn through interactive questions.',
    icon: Brain,
    color: Colors.success[500],
    features: ['Old Testament Quiz', 'New Testament Quiz', 'Progress Tracking', 'Learning Paths'],
  },
  {
    id: 5,
    title: 'Mood & Prayer Tracking',
    subtitle: 'Monitor Your Spiritual Well-being',
    description: 'Track your emotional journey, record answered prayers, and reflect on God\'s presence in your daily life. Build a meaningful prayer journal.',
    icon: Heart,
    color: Colors.warning[500],
    features: ['Mood Tracking', 'Prayer Journal', 'Answered Prayers', 'Spiritual Growth'],
  },
  {
    id: 6,
    title: 'Ready to Begin Your Journey?',
    subtitle: 'Start Your Spiritual Growth Today',
    description: 'Join thousands of believers who are deepening their faith through technology. Your spiritual companion is ready to guide you every step of the way.',
    icon: Shield,
    color: Colors.primary[500],
    features: ['Personalized Experience', 'Secure & Private', 'Community Support', '24/7 Access'],
  },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const { completeOnboarding } = useOnboarding();

  const handleGetStarted = async () => {
    await completeOnboarding();
    router.replace('/login');
  };

  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentSlide(viewableItems[0].index ?? 0);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderFeatureTag = (feature: string, index: number) => (
    <Animated.View
      key={feature}
      style={[
        styles.featureTag,
        {
          opacity: scrollX.interpolate({
            inputRange: [
              (currentSlide - 1) * screenWidth,
              currentSlide * screenWidth,
              (currentSlide + 1) * screenWidth,
            ],
            outputRange: [0, 1, 0],
            extrapolate: 'clamp',
          }),
          transform: [
            {
              translateY: scrollX.interpolate({
                inputRange: [
                  (currentSlide - 1) * screenWidth,
                  currentSlide * screenWidth,
                  (currentSlide + 1) * screenWidth,
                ],
                outputRange: [20, 0, 20],
                extrapolate: 'clamp',
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.featureTagText}>{feature}</Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Skip Button */}
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleGetStarted} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 3 }}>
        <Animated.FlatList
          data={onboardingSlides}
          renderItem={({ item, index }) => (
            <View style={[styles.slide]}>
              <View style={styles.slideContent}>
                <View style={styles.iconContainer}>
                  <Animated.View 
                    style={[
                      styles.iconBackground, 
                      { 
                        backgroundColor: item.color + '10',
                        borderColor: item.color + '20',
                        transform: [
                          {
                            scale: scrollX.interpolate({
                              inputRange: [
                                (index - 1) * screenWidth,
                                index * screenWidth,
                                (index + 1) * screenWidth,
                              ],
                              outputRange: [0.8, 1, 0.8],
                              extrapolate: 'clamp',
                            }),
                          },
                        ],
                      }
                    ]}
                  >
                    <item.icon size={60} color={item.color} />
                  </Animated.View>
                </View>
                
                <View style={styles.contentContainer}>
                  <Animated.Text 
                    style={[
                      styles.title,
                      {
                        opacity: scrollX.interpolate({
                          inputRange: [
                            (index - 1) * screenWidth,
                            index * screenWidth,
                            (index + 1) * screenWidth,
                          ],
                          outputRange: [0, 1, 0],
                          extrapolate: 'clamp',
                        }),
                      }
                    ]}
                  >
                    {item.title}
                  </Animated.Text>
                  
                  <Animated.Text 
                    style={[
                      styles.subtitle,
                      {
                        opacity: scrollX.interpolate({
                          inputRange: [
                            (index - 1) * screenWidth,
                            index * screenWidth,
                            (index + 1) * screenWidth,
                          ],
                          outputRange: [0, 1, 0],
                          extrapolate: 'clamp',
                        }),
                      }
                    ]}
                  >
                    {item.subtitle}
                  </Animated.Text>
                  
                  <Animated.Text 
                    style={[
                      styles.description,
                      {
                        opacity: scrollX.interpolate({
                          inputRange: [
                            (index - 1) * screenWidth,
                            index * screenWidth,
                            (index + 1) * screenWidth,
                          ],
                          outputRange: [0, 1, 0],
                          extrapolate: 'clamp',
                        }),
                      }
                    ]}
                  >
                    {item.description}
                  </Animated.Text>

                  {/* Feature Tags */}
                  <View style={styles.featuresContainer}>
                    {item.features.map((feature, featureIndex) => 
                      renderFeatureTag(feature, featureIndex)
                    )}
                  </View>
                </View>
              </View>
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id.toString()}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      <View style={styles.navigationContainer}>
        <View style={styles.dotsContainer}>
          {onboardingSlides.map((_, i) => {
            const inputRange = [(i - 1) * screenWidth, i * screenWidth, (i + 1) * screenWidth];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return <Animated.View style={[styles.dot, { width: dotWidth, opacity }]} key={i.toString()} />;
          })}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleGetStarted}>
          <View style={styles.nextButtonContent}>
            <Text style={styles.nextButtonText}>
              {currentSlide === onboardingSlides.length - 1 ? 'Get Started' : 'Continue'}
            </Text>
            <ChevronRight size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  skipContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: Spacing.xl,
    zIndex: 10,
  },
  skipButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutral[100],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  skipText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: Colors.neutral[700],
  },
  slide: {
    width: screenWidth,
    height: '100%',
  },
  slideContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    backgroundColor: '#FFFFFF',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    ...Shadows.lg,
  },
  contentContainer: {
    alignItems: 'center',
    maxWidth: screenWidth * 0.85,
  },
  title: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[900],
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: Typography.sizes['3xl'] * 1.2,
  },
  subtitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semiBold,
    color: Colors.neutral[700],
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  description: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[600],
    textAlign: 'center',
    lineHeight: Typography.sizes.base * 1.6,
    marginBottom: Spacing.xl,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  featureTag: {
    backgroundColor: Colors.neutral[50],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  featureTagText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.neutral[700],
  },
  navigationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary[500],
    marginHorizontal: 6,
  },
  nextButton: {
    width: '100%',
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.primary[600],
    ...Shadows.lg,
  },
  nextButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  nextButtonText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semiBold,
    color: 'white',
  },
});
