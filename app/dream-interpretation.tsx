
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Animated,
  Modal,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar as RNStatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import {
  ChevronLeft,
  Trash2,
  Sparkles,
  Moon,
  BookOpen,
  Star,
  Calendar,
  Clock,
  Zap,
  Play,
  Star as PremiumStar,
} from 'lucide-react-native';
import { DreamService } from '../lib/services/dreamService';
import { DreamEntry } from '../lib/types/dreams';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/DesignTokens';
import { useAuth } from '../hooks/useAuth';
import BackgroundGradient from '@/components/BackgroundGradient';
import { HeaderCard } from '@/components/HeaderCard';
import { useSubscription } from '@/hooks/subsHook'; // Import subscription hook
import Purchases from 'react-native-purchases'; // Import RevenueCat

const { width: screenWidth } = Dimensions.get('window');

type MoodOption = 'peaceful' | 'anxious' | 'joyful' | 'confused' | 'hopeful';

// ⚠️ MOCK REWARDED AD SERVICE ⚠️
// Replace this with a real ad library like Google AdMob in a production app.
const RewardedAdService = {
  showAd: async (): Promise<boolean> => {
    return new Promise((resolve) => {
      console.log('🎬 Simulating rewarded ad...');
      setTimeout(() => {
        console.log('✅ Ad watched successfully.');
        Alert.alert('Video Ad Watched!', 'You\'re one step closer to unlocking the analysis.', [{ text: 'OK' }]);
        resolve(true);
      }, 3000); // Simulate a 3-second ad
    });
  }
};

// =================================================================================
// Access Modal Component - The Paywall
// =================================================================================
const AccessModal = ({
  visible,
  onClose,
  adsWatchedCount,
  onWatchAd,
  onUpgrade,
  isAdLoading,
}: {
  visible: boolean;
  onClose: () => void;
  adsWatchedCount: number;
  onWatchAd: () => void;
  onUpgrade: () => void;
  isAdLoading: boolean;
}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={accessModalStyles.overlay}>
      <View style={accessModalStyles.modalContainer}>
        <LinearGradient
          colors={Colors.gradients.etherealSunset as any}
          style={accessModalStyles.modalGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={accessModalStyles.modalHeader}>
            <Zap size={36} color="white" style={{ marginBottom: 12 }} />
            <Text style={accessModalStyles.modalTitle}>Unlock AI Dream Analysis</Text>
            <Text style={accessModalStyles.modalSubtitle}>
              Watch a few short video ads or upgrade to an ad-free subscription for unlimited access.
            </Text>
          </View>
          
          <View style={accessModalStyles.counterContainer}>
            <Text style={accessModalStyles.counterText}>
              Ads Watched: <Text style={accessModalStyles.counterNumber}>{adsWatchedCount}</Text> / 2
            </Text>
          </View>

          <TouchableOpacity
            style={accessModalStyles.watchAdButton}
            onPress={onWatchAd}
            disabled={isAdLoading || adsWatchedCount >= 2}
          >
            {isAdLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <View style={accessModalStyles.buttonContent}>
                <Play size={20} color="white" />
                <Text style={accessModalStyles.watchAdButtonText}>
                  Watch Video Ad ({2 - adsWatchedCount} left)
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={accessModalStyles.divider} />

          <TouchableOpacity
            style={accessModalStyles.upgradeButton}
            onPress={onUpgrade}
          >
            <View style={accessModalStyles.buttonContent}>
              <PremiumStar size={20} color="#3B82F6" />
              <Text style={accessModalStyles.upgradeButtonText}>Upgrade to Subscription</Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  </Modal>
);

export default function DreamInterpretationScreen() {
  const { user } = useAuth();
  const { isSubscribed } = useSubscription(); // Use the real subscription status

  // State for dreams and selected dream
  const [dreams, setDreams] = useState<DreamEntry[]>([]);
  const [selectedDream, setSelectedDream] = useState<DreamEntry | null>(null);

  // Dream form state
  const [dreamTitle, setDreamTitle] = useState('');
  const [dreamDescription, setDreamDescription] = useState('');
  const [dreamMood, setDreamMood] = useState<MoodOption>('peaceful');

  // Loading and analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingDreams, setLoadingDreams] = useState(true);

  // State for ad-based access
  const [adsWatchedCount, setAdsWatchedCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const moods = [
    { id: 'peaceful', label: 'Peaceful', emoji: '😌', color: '#10B981', gradient: ['#10B981', '#34D399'] },
    { id: 'anxious', label: 'Anxious', emoji: '😰', color: '#F59E0B', gradient: ['#F59E0B', '#FBBF24'] },
    { id: 'joyful', label: 'Joyful', emoji: '😊', color: '#3B82F6', gradient: ['#3B82F6', '#60A5FA'] },
    { id: 'confused', label: 'Confused', emoji: '😕', color: '#6B7280', gradient: ['#6B7280', '#9CA3AF'] },
    { id: 'hopeful', label: 'Hopeful', emoji: '🙏', color: '#8B5CF6', gradient: ['#8B5CF6', '#A855F7'] },
  ];

  // Run initial entrance and pulse animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 120, friction: 8, useNativeDriver: true }),
    ]).start();

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.03, duration: 2500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2500, useNativeDriver: true }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [fadeAnim, slideAnim, scaleAnim, pulseAnim]);

  // Use useCallback to memoize functions and prevent unnecessary re-renders
  const loadDreams = useCallback(async (forceRefresh: boolean = false) => {
    try {
      setLoadingDreams(true);
      if (!user?.uid) {
        console.log('No authenticated user, skipping dreams load');
        setDreams([]);
        return;
      }
      const dreamsList = await DreamService.getDreams(user.uid, forceRefresh);
      setDreams(dreamsList);
    } catch (error) {
      console.error('Error loading dreams:', error);
      Alert.alert(
        'Loading Error',
        'Unable to load your dreams. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoadingDreams(false);
    }
  }, [user]);

  // Load dreams on initial mount and check access
  useEffect(() => {
    if (user?.uid) {
      loadDreams();
    } else {
      setLoadingDreams(false);
    }

    if (!isSubscribed) {
      if (adsWatchedCount < 2) {
        setShowPaywall(true);
      } else {
        setShowPaywall(false);
      }
    } else {
      setShowPaywall(false);
    }

  }, [user, loadDreams, isSubscribed, adsWatchedCount]);

  const handleWatchAd = async () => {
    if (adsWatchedCount < 2) {
      setIsAdLoading(true);
      const adSuccess = await RewardedAdService.showAd();
      setIsAdLoading(false);
      if (adSuccess) {
        setAdsWatchedCount(prev => prev + 1);
      }
    }
  };

  const handleUpgradeSubscription = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current) {
        const packageToPurchase = offerings.current.monthly || offerings.current.weekly;
        if (packageToPurchase) {
          Alert.alert('Redirecting to Payment', 'Please complete your purchase to unlock dream analysis.', [{ text: 'OK' }]);
          await Purchases.purchasePackage(packageToPurchase);
        } else {
          Alert.alert('Error', 'No subscription package found. Please try again later.');
        }
      } else {
        Alert.alert('Error', 'Could not fetch subscription offerings.');
      }
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert('Purchase Failed', e.message || 'An error occurred during the purchase.');
        console.error('❌ Purchase error:', e);
      }
    }
  };

  const handleAddDream = useCallback(async () => {
    if (!dreamTitle.trim() || !dreamDescription.trim()) {
      Alert.alert('Missing Information', 'Please fill in both title and description.');
      return;
    }

    if (!user?.uid) {
      Alert.alert('Authentication Error', 'Please log in to add dreams.');
      return;
    }

    // Check for subscription before allowing AI analysis
    if (!isSubscribed && adsWatchedCount < 2) {
      setShowPaywall(true);
      return;
    }

    setIsAnalyzing(true);
    Alert.alert(
      'Analyzing Dream...',
      'Your dream is being analyzed with AI. This may take a few moments.',
      [{ text: 'OK' }]
    );

    try {
      const analyzedDream = await DreamService.addAndInterpretDream({
        dreamTitle: dreamTitle.trim(),
        dreamDescription: dreamDescription.trim(),
        mood: dreamMood
      }, user.uid);

      setDreams(prev => [analyzedDream, ...prev]);
      resetForm();

      Alert.alert(
        'Dream Analyzed! ✨',
        'Your dream has been analyzed with biblical insights and spiritual guidance.',
        [
          { text: 'Continue', style: 'cancel' },
          { text: 'View Analysis', onPress: () => setSelectedDream(analyzedDream) }
        ]
      );
    } catch (error) {
      console.error('❌ Error adding dream:', error);
      Alert.alert(
        'Analysis Error',
        'Failed to analyze your dream. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsAnalyzing(false);
    }
  }, [dreamTitle, dreamDescription, dreamMood, user, isSubscribed, adsWatchedCount]);

  const handleDeleteDream = useCallback(async (dreamId: string) => {
    try {
      if (!user?.uid) {
        Alert.alert('Authentication Error', 'Please log in to delete dreams.');
        return;
      }
      await DreamService.deleteDream(dreamId, user.uid);
      setDreams(prev => prev.filter(d => d.id !== dreamId));
      setSelectedDream(null);
      Alert.alert('Success', 'Dream deleted successfully.');
    } catch (error) {
      console.error('Error deleting dream:', error);
      Alert.alert('Error', 'Failed to delete dream.');
    }
  }, [user]);

  const resetForm = () => {
    setDreamTitle('');
    setDreamDescription('');
    setDreamMood('peaceful');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const getMoodEmoji = (mood: string) => {
    const moodData = moods.find(m => m.id === mood);
    return moodData?.emoji || '😐';
  };

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const renderDreamCard = (dream: DreamEntry, index: number) => (
    <Animated.View
      key={dream.id}
      style={[
        styles.modernDreamCard,
        {
          opacity: fadeAnim,
          transform: [{
            translateY: slideAnim.interpolate({
              inputRange: [0, 50],
              outputRange: [0, 50 + (index * 5)],
            })
          }, {
            scale: scaleAnim
          }]
        }
      ]}
    >
      <Pressable
        onPress={() => setSelectedDream(dream)}
        style={({ pressed }) => [
          styles.dreamCardPressable,
          pressed && styles.dreamCardPressed
        ]}
      >
        <LinearGradient
          colors={Colors.glass.card ? [Colors.glass.card, Colors.glass.cardSoft] : ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
          style={styles.modernDreamCardGradient}
        >
          <View style={styles.dreamCardHeader}>
            <View style={styles.dreamCardLeft}>
              <LinearGradient
                colors={dream.is_analyzed ? ['#10B981', '#34D399'] : ['#F59E0B', '#FBBF24']}
                style={styles.modernDreamStatusIcon}
              >
                {dream.is_analyzed ? <Sparkles size={16} color="white" /> : <Clock size={16} color="white" />}
              </LinearGradient>
              <View style={styles.dreamCardInfo}>
                <Text style={styles.modernDreamTitle}>{dream.title}</Text>
                <View style={styles.dreamMetaRow}>
                  <View style={styles.dreamMetaItem}>
                    <Calendar size={12} color={Colors.neutral[500]} />
                    <Text style={styles.dreamMetaText}>{formatDate(dream.date)}</Text>
                  </View>
                  <View style={styles.dreamMetaItem}>
                    <Text style={styles.moodEmoji}>{getMoodEmoji(dream.mood)}</Text>
                    <Text style={styles.dreamMetaText}>{dream.mood}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.dreamCardActions}>
              {dream.significance && (
                <LinearGradient
                  colors={dream.significance === 'high' ? ['#EF4444', '#F87171'] :
                         dream.significance === 'medium' ? ['#F59E0B', '#FBBF24'] :
                         ['#6B7280', '#9CA3AF']}
                  style={styles.modernSignificanceBadge}
                >
                  <Text style={styles.significanceText}>
                    {dream.significance.toUpperCase()}
                  </Text>
                </LinearGradient>
              )}
            </View>
          </View>
          
          <Text style={styles.modernDreamDescription} numberOfLines={3}>
            {dream.description}
          </Text>
          
          {dream.is_analyzed && dream.interpretation && (
            <View style={styles.modernInterpretationPreview}>
              <LinearGradient
                colors={['#ECFDF5', '#D1FAE5']}
                style={styles.modernInterpretationBanner}
              >
                <View style={styles.interpretationIcon}>
                  <Zap size={14} color="#059669" />
                </View>
                <Text style={styles.modernInterpretationText} numberOfLines={2}>
                  {dream.interpretation}
                </Text>
              </LinearGradient>
            </View>
          )}
          
          {!dream.is_analyzed && (
            <View style={styles.modernAnalysisPending}>
              <LinearGradient
                colors={['#FFFBEB', '#FEF3C7']}
                style={styles.modernAnalysisBanner}
              >
                <ActivityIndicator size="small" color="#D97706" />
                <Text style={styles.modernAnalysisText}>
                  AI analysis in progress...
                </Text>
              </LinearGradient>
            </View>
          )}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );

  const DreamDetailModal = () => (
    <Modal
      visible={selectedDream !== null}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setSelectedDream(null)}
    >
      {selectedDream && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <LinearGradient
            colors={Colors.gradients.etherealSunset as any}
            style={styles.modalGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedDream(null)}>
                <ChevronLeft size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{selectedDream.title}</Text>
              <TouchableOpacity onPress={() => handleDeleteDream(selectedDream.id)}>
                <Trash2 size={24} color="white" />
              </TouchableOpacity>
            </View>
            <ScrollView 
              style={styles.modalContent}
              contentContainerStyle={styles.modalContentContainer}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}
              bounces={true}
            >
              <View style={styles.dreamDetailContent}>
                <View style={styles.dreamDetailSection}>
                  <Text style={styles.dreamDetailLabel}>Dream Description</Text>
                  <Text style={styles.dreamDetailText}>{selectedDream.description}</Text>
                </View>
                
                <View style={styles.dreamDetailSection}>
                  <Text style={styles.dreamDetailLabel}>Mood</Text>
                  <View style={styles.dreamDetailMood}>
                    <Text style={styles.dreamDetailMoodEmoji}>
                      {getMoodEmoji(selectedDream.mood)}
                    </Text>
                    <Text style={styles.dreamDetailMoodText}>
                      {selectedDream.mood.charAt(0).toUpperCase() + selectedDream.mood.slice(1)}
                    </Text>
                  </View>
                </View>
                
                {selectedDream.is_analyzed && selectedDream.interpretation && (
                  <View style={styles.dreamDetailSection}>
                    <Text style={styles.dreamDetailLabel}>AI Interpretation</Text>
                    <LinearGradient
                      colors={['#D1FAE5', '#A7F3D0']}
                      style={styles.interpretationCard}
                    >
                      <View style={styles.interpretationHeader}>
                        <Sparkles size={20} color="#065F46" />
                        <Text style={styles.interpretationTitle}>Biblical Analysis</Text>
                      </View>
                      <Text style={styles.interpretationContent}>
                        {selectedDream.interpretation}
                      </Text>
                    </LinearGradient>
                  </View>
                )}
                
                {selectedDream.spiritual_meaning && (
                  <View style={styles.dreamDetailSection}>
                    <Text style={styles.dreamDetailLabel}>Spiritual Meaning</Text>
                    <LinearGradient
                      colors={['#FEF3C7', '#FDE68A']}
                      style={styles.spiritualMeaningCard}
                    >
                      <View style={styles.spiritualMeaningHeader}>
                        <Star size={20} color="#D97706" />
                        <Text style={styles.spiritualMeaningTitle}>Spiritual Insights</Text>
                      </View>
                      <Text style={styles.spiritualMeaningContent}>
                        {selectedDream.spiritual_meaning}
                      </Text>
                    </LinearGradient>
                  </View>
                )}
                
                {selectedDream.biblical_insights && selectedDream.biblical_insights.length > 0 && (
                  <View style={styles.dreamDetailSection}>
                    <Text style={styles.dreamDetailLabel}>Biblical Insights</Text>
                    <View style={styles.biblicalInsightsContainer}>
                      {selectedDream.biblical_insights.map((insight, index) => (
                        <View key={index} style={styles.biblicalInsightCard}>
                          <View style={styles.biblicalInsightIcon}>
                            <BookOpen size={16} color="#7C3AED" />
                          </View>
                          <Text style={styles.biblicalInsightText}>{insight}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
                
                {selectedDream.symbols && selectedDream.symbols.length > 0 && (
                  <View style={styles.dreamDetailSection}>
                    <Text style={styles.dreamDetailLabel}>Dream Symbols</Text>
                    <View style={styles.symbolsContainer}>
                      {selectedDream.symbols.map((symbol, index) => (
                        <View key={index} style={styles.symbolCard}>
                          <View style={styles.symbolHeader}>
                            <Text style={styles.symbolName}>{symbol.symbol}</Text>
                          </View>
                          <Text style={styles.symbolMeaning}>{symbol.meaning}</Text>
                          {symbol.bibleVerse && (
                            <Text style={styles.symbolVerse}>"{symbol.bibleVerse}"</Text>
                          )}
                        </View>
                      ))}
                    </View>
                  </View>
                )}
                
                {selectedDream.prayer && (
                  <View style={styles.dreamDetailSection}>
                    <Text style={styles.dreamDetailLabel}>Prayer Guidance</Text>
                    <LinearGradient
                      colors={['#DBEAFE', '#BFDBFE']}
                      style={styles.prayerCard}
                    >
                      <View style={styles.prayerHeader}>
                        <Text style={styles.prayerIcon}>🙏</Text>
                        <Text style={styles.prayerTitle}>Prayer for This Dream</Text>
                      </View>
                      <Text style={styles.prayerContent}>
                        {selectedDream.prayer}
                      </Text>
                    </LinearGradient>
                  </View>
                )}
                
                {selectedDream.significance && (
                  <View style={styles.dreamDetailSection}>
                    <Text style={styles.dreamDetailLabel}>Spiritual Significance</Text>
                    <View style={[
                      styles.significanceCard,
                      { backgroundColor: getSignificanceColor(selectedDream.significance) }
                    ]}>
                      <Text style={styles.significanceCardText}>
                        {selectedDream.significance.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                )}
                
                {/* Additional spacing to ensure content is visible */}
                <View style={styles.bottomSpacing} />
              </View>
            </ScrollView>
          </LinearGradient>
        </KeyboardAvoidingView>
      )}
    </Modal>
  );

  if (!isSubscribed && adsWatchedCount < 2) {
    return (
      <AccessModal
        visible={showPaywall}
        onClose={() => {}}
        adsWatchedCount={adsWatchedCount}
        onWatchAd={handleWatchAd}
        onUpgrade={handleUpgradeSubscription}
        isAdLoading={isAdLoading}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <RNStatusBar style="dark" />
      <BackgroundGradient>
        {/* Fixed Hero Header */}
        <HeaderCard
          title="Dream Interpretation"
          subtitle={`${dreams.length} dreams recorded • AI-powered insights`}
          showBackButton={true}
          onBackPress={() => router.back()}
          gradientColors={Colors.gradients.spiritualLight}
        />
        
        <Animated.ScrollView
          style={[styles.scrollView, { opacity: fadeAnim }]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Overview Card */}
          <Animated.View style={[styles.overviewCard, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.overviewGradient}>
              <View style={styles.overviewHeader}>
                <View style={styles.overviewLeft}>
                  <LinearGradient
                    colors={['#8B5CF6', '#7C3AED']}
                    style={styles.overviewIcon}
                  >
                    <Moon size={24} color="white" />
                  </LinearGradient>
                  <View>
                    <Text style={styles.overviewTitle}>Dream Journal</Text>
                    <Text style={styles.overviewSubtitle}>Track your spiritual dreams</Text>
                  </View>
                </View>
                <Animated.View style={[styles.activeIndicator, { transform: [{ scale: pulseAnim }] }]}>
                  <View style={styles.activeDot} />
                  <Text style={styles.activeText}>Active</Text>
                </Animated.View>
              </View>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{dreams.length}</Text>
                  <Text style={styles.statLabel}>Total Dreams</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{dreams.filter(d => d.is_analyzed).length}</Text>
                  <Text style={styles.statLabel}>Analyzed</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{dreams.filter(d => d.significance === 'high').length}</Text>
                  <Text style={styles.statLabel}>Significant</Text>
                </View>
              </View>
            </View>
          </Animated.View>
          
          {/* Record New Dream Form */}
          <Animated.View style={[styles.dreamFormCard, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.dreamFormGradient}>
              <View style={styles.dreamFormHeader}>
                <Text style={styles.dreamFormTitle}>Record New Dream</Text>
                <Text style={styles.dreamFormSubtitle}>Share your dream for spiritual insights</Text>
              </View>
              
              <View style={styles.dreamForm}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Dream Title *</Text>
                  <TextInput
                    style={[styles.input, dreamTitle.length > 0 && styles.inputFocused]}
                    placeholder="Give your dream a memorable title..."
                    placeholderTextColor="rgba(0, 0, 0, 0.6)"
                    value={dreamTitle}
                    onChangeText={setDreamTitle}
                    maxLength={100}
                    autoCorrect={false}
                    autoCapitalize="words"
                    blurOnSubmit={true}
                  />
                  <Text style={styles.charCount}>{dreamTitle.length}/100</Text>
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Dream Description *</Text>
                  <TextInput
                    style={[styles.input, styles.textArea, dreamDescription.length > 0 && styles.inputFocused]}
                    placeholder="Describe your dream in detail. Include people, places, emotions, and any significant events..."
                    placeholderTextColor="rgba(0, 0, 0, 0.6)"
                    value={dreamDescription}
                    onChangeText={setDreamDescription}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    maxLength={1000}
                    autoCorrect={false}
                    autoCapitalize="sentences"
                    blurOnSubmit={true}
                    scrollEnabled={true}
                  />
                  <Text style={styles.charCount}>{dreamDescription.length}/1000</Text>
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Dream Mood</Text>
                  <View style={styles.moodSelector}>
                    {moods.map((mood) => (
                      <TouchableOpacity
                        key={mood.id}
                        style={[
                          styles.moodOption,
                          dreamMood === mood.id && [styles.selectedMoodOption, { backgroundColor: mood.color }],
                        ]}
                        onPress={() => setDreamMood(mood.id as MoodOption)}
                      >
                        <Text style={styles.moodOptionEmoji}>{mood.emoji}</Text>
                        <Text style={[
                          styles.moodOptionText,
                          dreamMood === mood.id && styles.selectedMoodOptionText
                        ]}>
                          {mood.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {isAnalyzing && (
                  <View style={styles.analyzingProgress}>
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
                      style={styles.analyzingProgressCard}
                    >
                      <Animated.View style={[styles.analyzingIcon, { transform: [{ scale: pulseAnim }] }]}>
                        <Sparkles size={24} color="white" />
                      </Animated.View>
                      <Text style={styles.analyzingTitle}>Analyzing Your Dream</Text>
                      <Text style={styles.analyzingSubtitle}>
                        Our AI is examining biblical symbols and spiritual meanings...
                      </Text>
                      <ActivityIndicator size="small" color="white" style={{ marginTop: 16 }} />
                    </LinearGradient>
                  </View>
                )}

                <TouchableOpacity 
                  style={[
                    styles.saveButton,
                    (!dreamTitle.trim() || !dreamDescription.trim()) && styles.saveButtonDisabled,
                    isAnalyzing && styles.saveButtonAnalyzing,
                    (!dreamTitle.trim() || !dreamDescription.trim() || (!isSubscribed && adsWatchedCount < 2)) ? null : styles.saveButtonGlow
                  ]} 
                  onPress={handleAddDream}
                  disabled={isAnalyzing || (!dreamTitle.trim() || !dreamDescription.trim())}
                >
                  <LinearGradient
                    colors={isAnalyzing 
                      ? ['#F59E0B', '#D97706'] 
                      : (!dreamTitle.trim() || !dreamDescription.trim() || (!isSubscribed && adsWatchedCount < 2)) 
                        ? ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']
                        : ['#667eea', '#764ba2']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.saveButtonGradient}
                  >
                    <View style={styles.saveButtonContent}>
                      {isAnalyzing ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Sparkles size={20} color={(!dreamTitle.trim() || !dreamDescription.trim() || (!isSubscribed && adsWatchedCount < 2)) ? 'rgba(255, 255, 255, 0.5)' : 'white'} />
                      )}
                      <Text style={[
                        styles.saveButtonText,
                        (!dreamTitle.trim() || !dreamDescription.trim()) && styles.saveButtonTextDisabled,
                        (!isSubscribed && adsWatchedCount < 2) && styles.saveButtonTextDisabled,
                      ]}>
                        {isAnalyzing ? 'AI Analysis in Progress...' : 
                          (isSubscribed || adsWatchedCount >= 2) ? 'Analyze with AI' : 'Unlock AI Analysis'
                        }
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
          
          {/* Dreams List */}
          <View style={styles.dreamsSection}>
            <View style={styles.dreamsSectionHeader}>
              <Text style={styles.sectionTitle}>Your Dreams</Text>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={() => loadDreams(true)}
                disabled={loadingDreams}
                activeOpacity={0.7}
              >
                <Text style={styles.refreshButtonText}>
                  {loadingDreams ? 'Loading...' : 'Refresh'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {loadingDreams ? (
              <Animated.View style={[styles.loadingState, { opacity: fadeAnim }]}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                  style={styles.loadingStateCard}
                >
                  <ActivityIndicator size="large" color="white" />
                  <Text style={styles.loadingTitle}>Loading Dreams...</Text>
                </LinearGradient>
              </Animated.View>
            ) : dreams.length === 0 ? (
              <Animated.View style={[styles.emptyState, { opacity: fadeAnim }]}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                  style={styles.emptyStateCard}
                >
                  <View style={styles.emptyIcon}>
                    <Moon size={48} color="rgba(255, 255, 255, 0.6)" />
                  </View>
                  <Text style={styles.emptyTitle}>No Dreams Yet</Text>
                  <Text style={styles.emptySubtitle}>
                    Start recording your dreams to unlock spiritual insights and biblical interpretations
                  </Text>
                </LinearGradient>
              </Animated.View>
            ) : (
              <View style={styles.dreamsList}>
                {dreams.map((dream, index) => renderDreamCard(dream, index))}
              </View>
            )}
          </View>
          
          {/* Bottom spacing */}
          <View style={styles.bottomSpacing} />
        </Animated.ScrollView>
        
        {/* Modals */}
        <DreamDetailModal />
      </BackgroundGradient>
    </KeyboardAvoidingView>
  );
}

const accessModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  modalGradient: {
    padding: 32,
    alignItems: 'center',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  counterContainer: {
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  counterText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  counterNumber: {
    fontWeight: '800',
  },
  watchAdButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  watchAdButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 20,
  },
  upgradeButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 100, // Add padding at the bottom to prevent content from being cut off
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
    gap: 16,
  },

  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'black',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'black',
    lineHeight: 20,
  },
  
  // Hero Header (Bible Style)
  hero: {
    paddingTop: Platform.OS === 'ios' ? 60 : RNStatusBar.currentHeight! + 12,
  },
  heroGradient: {
    borderBottomLeftRadius: BorderRadius['3xl'],
    borderBottomRightRadius: BorderRadius['3xl'],
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  heroContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing['2xl'],
    paddingTop: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroTextBlock: {
    flex: 1,
  },
  heroTitle: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[900],
  },
  heroSubtitle: {
    marginTop: Spacing.xs,
    fontSize: Typography.sizes.base,
    color: Colors.neutral[600],
  },
  heroActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  heroActionButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  heroSpacer: {
    width: 40, // Same width as back button for balance
  },

  // Overview Card
  overviewCard: {
    borderRadius: BorderRadius['3xl'],
    marginBottom: Spacing.lg,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  overviewGradient: {
    backgroundColor: 'white',
    borderRadius: BorderRadius['3xl'],
    padding: Spacing.lg,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  overviewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  overviewIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[800],
    marginBottom: Spacing.xs,
  },
  overviewSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[500],
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success[500],
  },
  activeText: {
    fontSize: Typography.sizes.sm,
    color: Colors.success[600],
    fontWeight: Typography.weights.medium,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.primary[600],
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[500],
  },

  // Dreams Section
  dreamsSection: {
    marginTop: Spacing.lg,
  },
  dreamsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  refreshButton: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  refreshButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.primary[600],
  },
  sectionTitle: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[800],
    marginBottom: Spacing.sm,
  },
  addDreamButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ scale: 1 }],
  },
  addDreamButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  addDreamButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['2xl'],
  },
  emptyStateCard: {
    backgroundColor: 'white',
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyIcon: {
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: '700',
    color: 'black',
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.sizes.base,
    color: 'black',
    textAlign: 'center',
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.base,
  },
  
  // Loading State
  loadingState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['2xl'],
  },
  loadingStateCard: {
    backgroundColor: 'white',
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loadingTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '600',
    color: 'white',
    marginTop: Spacing.md,
  },

  // Dream Cards
  dreamsList: {
    gap: Spacing.md,
  },
  dreamCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dreamCardGradient: {
    backgroundColor: 'white',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  dreamCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  dreamCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.md,
  },
  dreamStatusIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dreamStatusEmoji: {
    fontSize: Typography.sizes.lg,
  },
  dreamCardInfo: {
    flex: 1,
  },
  dreamTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semiBold,
    color: Colors.neutral[800],
    marginBottom: Spacing.xs,
  },
  dreamMeta: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[500],
  },
  significanceBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  significanceText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: 'white',
  },
  dreamDescription: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[600],
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.base,
    marginBottom: Spacing.md,
  },
  interpretationPreview: {
    marginTop: Spacing.sm,
  },
  interpretationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  interpretationPreviewText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.success[700],
    fontWeight: Typography.weights.medium,
  },
  analysisPending: {
    marginTop: Spacing.sm,
  },
  analysisPendingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    backgroundColor: Colors.warning[50],
    borderWidth: 1,
    borderColor: Colors.warning[200],
  },
  analysisPendingText: {
    fontSize: Typography.sizes.sm,
    color: Colors.warning[700],
    fontWeight: Typography.weights.medium,
  },
  
  // Modal Styles (for DreamDetailModal only)
  modalContainer: {
    flex: 1,
  },
  modalGradient: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  modalContentContainer: {
    paddingBottom: 100, // Add padding at the bottom to prevent content from being cut off
  },

  // Form Styles
  dreamForm: {
    gap: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semiBold,
    color: Colors.neutral[700],
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.neutral[50],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.sizes.base,
    color: Colors.neutral[800],
    minHeight: 48,
  },
  inputFocused: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[50],
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[400],
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
  moodSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  moodOption: {
    flex: 1,
    minWidth: 80,
    backgroundColor: Colors.neutral[100],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  selectedMoodOption: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[50],
  },
  moodOptionEmoji: {
    fontSize: Typography.sizes.lg,
  },
  moodOptionText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.neutral[600],
  },
  selectedMoodOptionText: {
    color: Colors.primary[700],
    fontWeight: Typography.weights.semiBold,
  },

  // Dream Detail Modal
  dreamDetailContent: {
    gap: 24,
  },
  dreamDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dreamDetailMeta: {
    gap: 8,
  },
  dreamDetailDate: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  dreamDetailMood: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dreamDetailMoodEmoji: {
    fontSize: 18,
  },
  dreamDetailMoodText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  dreamDetailSignificance: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dreamDetailSignificanceText: {
    fontSize: 12,
    color: 'black',
    fontWeight: '700',
  },
  dreamDetailDescription: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
  },
  dreamDetailDescriptionText: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
  },

  // Interpretation Sections
  interpretationSection: {
    gap: 12,
  },
  interpretationCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  interpretationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  interpretationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#065F46',
  },
  interpretationContent: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
    fontWeight: '500',
  },
  spiritualMeaningSection: {
    gap: 12,
  },
  spiritualMeaningCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  spiritualMeaningText: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
  },
  biblicalInsightsSection: {
    gap: 12,
  },
  biblicalInsightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  biblicalInsightText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    fontWeight: '500',
  },
  symbolsSection: {
    gap: 12,
  },
  symbolCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  symbolContent: {
    flex: 1,
  },
  symbolName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  symbolMeaning: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  symbolVerse: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  prayerSection: {
    gap: 12,
  },
  prayerCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  prayerText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  pendingAnalysis: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  pendingAnalysisCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
  },
  pendingAnalysisTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  pendingAnalysisText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
  pendingAnalysisBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderRadius: 16,
  },
  pendingAnalysisIcon: {
    fontSize: 24,
    color: 'white',
  },


  pendingAnalysisSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },

  bottomSpacing: {
    height: 100,
  },

  // Dream Form Card
  dreamFormCard: {
    borderRadius: BorderRadius['3xl'],
    marginBottom: Spacing.lg,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dreamFormGradient: {
    backgroundColor: 'white',
    borderRadius: BorderRadius['3xl'],
    padding: Spacing.lg,
  },
  dreamFormHeader: {
    marginBottom: Spacing.lg,
  },
  dreamFormTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[800],
    marginBottom: Spacing.xs,
  },
  dreamFormSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[500],
  },
  saveButton: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    marginTop: Spacing.md,
  },
  saveButtonAnalyzing: {
    shadowColor: Colors.warning[500],
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  saveButtonGlow: {
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  saveButtonPressed: {
    transform: [{ scale: 0.95 }],
    shadowOpacity: 0.1,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonGradient: {
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  saveButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  saveButtonText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semiBold,
    color: 'white',
  },
  saveButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  saveButtonShine: {
    position: 'absolute',
    top: -30,
    left: -60,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    opacity: 0.4,
    transform: [{ rotate: '45deg' }],
  },

  // Analyzing Progress Indicator
  analyzingProgress: {
    marginTop: Spacing.lg,
  },
  analyzingProgressCard: {
    backgroundColor: Colors.primary[50],
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  analyzingIcon: {
    marginBottom: Spacing.md,
  },
  analyzingTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semiBold,
    color: Colors.primary[700],
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  analyzingSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary[600],
    textAlign: 'center',
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.sm,
  },

  // Dream Detail Modal (New)
  dreamDetailSection: {
    marginBottom: 24,
    paddingVertical: 8,
  },
  dreamDetailLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dreamDetailText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
  },
  significanceCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  significanceCardText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '800',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  spiritualMeaningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  spiritualMeaningTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#D97706',
  },
  spiritualMeaningContent: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
    fontWeight: '500',
  },
  biblicalInsightsContainer: {
    gap: 12,
  },

  biblicalInsightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  symbolsContainer: {
    gap: 12,
  },

  symbolHeader: {
    backgroundColor: 'rgba(55, 65, 81, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },




  prayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  prayerIcon: {
    fontSize: 24,
  },
  prayerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
  },
  prayerContent: {
    fontSize: 16,
    color: '#1F2937',
    lineHeight: 24,
    fontStyle: 'italic',
  },

  // Modern Dream Card Styles
  modernDreamCard: {
    borderRadius: BorderRadius['2xl'],
    marginBottom: Spacing.lg,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  dreamCardPressable: {
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
  },
  dreamCardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  modernDreamCardGradient: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modernDreamStatusIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modernDreamTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[800],
    marginBottom: Spacing.xs,
    lineHeight: Typography.lineHeights.tight * Typography.sizes.lg,
  },
  dreamMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  dreamMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dreamMetaText: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[600],
    fontWeight: Typography.weights.medium,
  },
  moodEmoji: {
    fontSize: Typography.sizes.base,
  },
  dreamCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  modernSignificanceBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  modernDreamDescription: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[700],
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.base,
    marginVertical: Spacing.md,
  },
  modernInterpretationPreview: {
    marginTop: Spacing.md,
  },
  modernInterpretationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  interpretationIcon: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modernInterpretationText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.success[700],
    fontWeight: Typography.weights.medium,
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.sm,
  },
  modernAnalysisPending: {
    marginTop: Spacing.md,
  },
  modernAnalysisBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  modernAnalysisText: {
    fontSize: Typography.sizes.sm,
    color: Colors.warning[700],
    fontWeight: Typography.weights.medium,
    marginLeft: Spacing.sm,
  },


  // Enhanced Mood Selector
  modernMoodSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  modernMoodOption: {
    flex: 1,
    minWidth: 80,
    backgroundColor: Colors.neutral[50],
    borderWidth: 2,
    borderColor: Colors.neutral[200],
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    gap: Spacing.xs,
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  modernMoodOptionSelected: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[50],
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    transform: [{ scale: 1.02 }],
  },
  modernMoodOptionEmoji: {
    fontSize: Typography.sizes.xl,
  },
  modernMoodOptionText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.neutral[600],
  },
  modernMoodOptionTextSelected: {
    color: Colors.primary[700],
    fontWeight: Typography.weights.semiBold,
  },

});

  // const NewDreamModal = () => ( // This component is removed
  //   <Modal
  //     visible={showNewDreamModal}
  //     animationType="slide"
  //     presentationStyle="pageSheet"
  //     onRequestClose={handleModalClose}
  //     transparent={false}
  //     statusBarTranslucent={true}
  //   >
  //     <KeyboardAvoidingView
  //       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  //       style={styles.modalContainer}
  //       keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
  //     >
  //       <LinearGradient
  //         colors={Colors.gradients.etherealSunset as any}
  //         style={styles.modalGradient}
  //         start={{ x: 0, y: 0 }}
  //         end={{ x: 1, y: 1 }}
  //       >
  //         <View style={styles.modalHeader}>
  //           <TouchableOpacity onPress={handleModalClose}>
  //             <ChevronLeft size={24} color="white" />
  //           </TouchableOpacity>
  //           <Text style={styles.modalTitle}>Record New Dream</Text>
  //           <View style={{ width: 24 }} />
  //         </View>
          
  //         <ScrollView 
  //           style={styles.modalContent}
  //           showsVerticalScrollIndicator={false}
  //           keyboardShouldPersistTaps="handled"
  //           nestedScrollEnabled={true}
  //           bounces={false}
  //         >
  //           <View style={styles.dreamForm}>
  //             <View style={styles.inputGroup}>
  //               <Text style={styles.inputLabel}>Dream Title *</Text>
  //               <TextInput
  //                 style={[styles.input, dreamTitle.length > 0 && styles.inputFocused]}
  //                 placeholder="Give your dream a memorable title..."
  //                 placeholderTextColor="rgba(255, 255, 255, 0.6)"
  //                 value={dreamTitle}
  //                 onChangeText={setDreamTitle}
  //                 maxLength={100}
  //                 autoCorrect={false}
  //                 autoCapitalize="words"
  //                 blurOnSubmit={true}
  //                 textContentType="none"
  //               />
  //               <Text style={styles.charCount}>{dreamTitle.length}/100</Text>
  //             </View>

  //             <View style={styles.inputGroup}>
  //               <Text style={styles.inputLabel}>Dream Description *</Text>
  //               <TextInput
  //                 style={[styles.input, styles.textArea, dreamDescription.length > 0 && styles.inputFocused]}
  //                 placeholder="Describe your dream in detail. Include people, places, emotions, and any significant events..."
  //                 placeholderTextColor="rgba(255, 255, 255, 0.6)"
  //                 value={dreamDescription}
  //                 onChangeText={setDreamDescription}
  //                 multiline
  //                 numberOfLines={6}
  //                 textAlignVertical="top"
  //                 maxLength={1000}
  //                 autoCorrect={false}
  //                 autoCapitalize="sentences"
  //                 blurOnSubmit={true}
  //                 textContentType="none"
  //                 scrollEnabled={true}
  //               />
  //               <Text style={styles.charCount}>{dreamDescription.length}/1000</Text>
  //             </View>

  //             <View style={styles.inputGroup}>
  //               <Text style={styles.inputLabel}>Dream Mood</Text>
  //               <View style={styles.moodSelector}>
  //                 {moods.map((mood) => (
  //                   <TouchableOpacity
  //                     key={mood.id}
  //                     style={[
  //                       styles.moodOption,
  //                       dreamMood === mood.id && [styles.selectedMoodOption, { backgroundColor: mood.color }]
  //                     ]}
  //                     onPress={() => setDreamMood(mood.id as any)}
  //                   >
  //                     <Text style={styles.moodOptionEmoji}>{mood.emoji}</Text>
  //                     <Text style={[
  //                       styles.moodOptionText,
  //                       dreamMood === mood.id && styles.selectedMoodOptionText
  //                     ]}>
  //                       {mood.label}
  //                     </Text>
  //                   </TouchableOpacity>
  //                 ))}
  //               </View>
  //             </View>

  //             {isAnalyzing && (
  //               <View style={styles.analyzingProgress}>
  //                 <LinearGradient
  //                   colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
  //                   style={styles.analyzingProgressCard}
  //                 >
  //                   <Animated.View style={[styles.analyzingIcon, { transform: [{ scale: pulseAnim }] }]}>
  //                     <Sparkles size={24} color="white" />
  //                   </Animated.View>
  //                   <Text style={styles.analyzingTitle}>Analyzing Your Dream</Text>
  //                   <Text style={styles.analyzingSubtitle}>
  //                     Our AI is examining biblical symbols and spiritual meanings...
  //                   </Text>
  //                   <ActivityIndicator size="small" color="white" style={{ marginTop: 16 }} />
  //                 </LinearGradient>
  //               </View>
  //             )}

  //             <TouchableOpacity 
  //               style={[
  //                 styles.saveButton,
  //                 (!dreamTitle.trim() || !dreamDescription.trim()) && styles.saveButtonDisabled,
  //                 isAnalyzing && styles.saveButtonAnalyzing,
  //                 (!dreamTitle.trim() || !dreamDescription.trim()) ? null : styles.saveButtonGlow
  //               ]} 
  //               onPress={handleAddDream}
  //               disabled={!dreamTitle.trim() || !dreamDescription.trim() || isAnalyzing}
  //             >
  //               <LinearGradient
  //                 colors={isAnalyzing 
  //                   ? ['#F59E0B', '#D97706'] 
  //                   : (!dreamTitle.trim() || !dreamDescription.trim()) 
  //                     ? ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']
  //                     : ['#667eea', '#764ba2']
  //               }
  //               start={{ x: 0, y: 0 }}
  //               end={{ x: 1, y: 1 }}
  //               style={styles.saveButtonGradient}
  //             >
  //               <View style={styles.saveButtonContent}>
  //                 {isAnalyzing ? (
  //                   <ActivityIndicator size="small" color="white" />
  //                 ) : (
  //                   <Sparkles size={20} color={(!dreamTitle.trim() || !dreamDescription.trim()) ? 'rgba(255, 255, 255, 0.5)' : 'white'} />
  //                 )}
  //                 <Text style={[
  //                   styles.saveButtonText,
  //                   (!dreamTitle.trim() || !dreamDescription.trim()) && styles.saveButtonTextDisabled
  //                 ]}>
  //                   {isAnalyzing ? 'AI Analysis in Progress...' : 
  //                     (!dreamTitle.trim() || !dreamDescription.trim()) ? 'Fill Required Fields' : 'Analyze with AI'
  //                   }
  //                 </Text>
  //               </View>
  //             </LinearGradient>
  //           </View>
  //         </ScrollView>
  //       </LinearGradient>
  //     </KeyboardAvoidingView>
  //   </Modal>
  // );