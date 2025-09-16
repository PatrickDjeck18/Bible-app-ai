// AIBibleChatScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Animated,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useContext } from 'react';
import Purchases from 'react-native-purchases'; // Import Purchases for subscription logic

import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Send, Bot, Book, Heart, Cross, Users, Sparkles, CircleHelp as HelpCircle, MessageCircle, Star, Leaf, User, Info, Clock, ChevronRight, Play, Star as PremiumStar, Zap } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/DesignTokens';
import { useAIBibleChat } from '@/hooks/useAIBibleChat';
import type { ChatMessage, ChatCategory } from '@/hooks/useAIBibleChat';
import { ChatMessage as ChatMessageComponent } from '@/components/ChatMessage';

const { width, height } = Dimensions.get('window');

interface RecentConversation {
  id: string;
  category: string;
  title: string;
  preview: string;
  timeAgo: string;
  icon: React.ReactNode;
  color: string;
}

// ⚠️ MOCK REWARDED AD SERVICE ⚠️
// You must replace this with a real ad library like Google AdMob in a production app.
const RewardedAdService = {
  showAd: async (): Promise<boolean> => {
    return new Promise((resolve) => {
      console.log('🎬 Simulating rewarded ad...');
      setTimeout(() => {
        console.log('✅ Ad watched successfully.');
        Alert.alert('Video Ad Watched!', 'You\'re one step closer to unlocking the chat.', [{ text: 'OK' }]);
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
        {/* CORRECTED: The content is now wrapped inside the LinearGradient container */}
        <LinearGradient
          colors={Colors.gradients.etherealSunset as any}
          style={accessModalStyles.modalGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={accessModalStyles.modalHeader}>
            <Zap size={36} color="white" style={{ marginBottom: 12 }} />
            <Text style={accessModalStyles.modalTitle}>Unlock AI Bible Chat</Text>
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
            disabled={isAdLoading}
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

export default function AIBibleChatScreen() {

  const {
    messages,
    conversations,
    loading,
    isTyping,
    currentCategory,
    currentConversationId,
    chatCategories,
    sendMessage,
    startNewConversation,
    openExistingConversation,
    clearConversation,
    getRecentConversations,
    deleteConversation,
    formatTimeAgo,
  } = useAIBibleChat();
  
  const [inputText, setInputText] = useState('');
  
  // State for ad-based access
  const [adsWatchedCount, setAdsWatchedCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const typingAnim = useRef(new Animated.Value(0)).current;

  // Ref for the scroll view to auto-scroll to the bottom
  const scrollViewRef = useRef<ScrollView>(null);
  


  // Typing animation
  useEffect(() => {
    if (isTyping) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [isTyping]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const categoryDisplayData = [
    {
      id: 'bible-study',
      title: 'Bible Study',
      subtitle: 'Scripture insights & interpretation',
      icon: <Book size={24} color="white" />,
      color: '#F59E0B',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
    },
    {
      id: 'prayer-life',
      title: 'Prayer Life',
      subtitle: 'Prayer guidance & support',
      icon: <Heart size={24} color="white" />,
      color: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    {
      id: 'faith-life',
      title: 'Faith & Life',
      subtitle: 'Living out your faith daily',
      icon: <Sparkles size={24} color="white" />,
      color: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
    },
    {
      id: 'theology',
      title: 'Theology',
      subtitle: 'Deep theological discussions',
      icon: <Cross size={24} color="white" />,
      color: '#8B5CF6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
    },
    {
      id: 'relationships',
      title: 'Relationships',
      subtitle: 'Biblical relationship advice',
      icon: <Users size={24} color="white" />,
      color: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
    {
      id: 'spiritual-growth',
      title: 'Spiritual Growth',
      subtitle: 'Growing in your faith journey',
      icon: <Leaf size={24} color="white" />,
      color: '#06B6D4',
      backgroundColor: 'rgba(6, 182, 212, 0.1)',
    },
    {
      id: 'life-questions',
      title: 'Life Questions',
      subtitle: 'Biblical answers to life\'s questions',
      icon: <HelpCircle size={24} color="white" />,
      color: '#F59E0B',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
    },
    {
      id: 'holy-spirit',
      title: 'Holy Spirit',
      subtitle: 'Understanding spiritual gifts',
      icon: <Sparkles size={24} color="white" />,
      color: '#8B5CF6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
    },
    {
      id: 'service',
      title: 'Service',
      subtitle: 'Serving God & others',
      icon: <Heart size={24} color="white" />,
      color: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    {
      id: 'general-chat',
      title: 'General Chat',
      subtitle: 'Open faith conversations',
      icon: <Star size={24} color="white" />,
      color: '#EC4899',
      backgroundColor: 'rgba(236, 72, 153, 0.1)',
    },
  ];

  const recentConversations = getRecentConversations(5);

  const getCategoryDisplayData = (categoryId: string) => {
    return categoryDisplayData.find(c => c.id === categoryId);
  };

  const getCategoryIcon = (categoryId: string) => {
    const categoryData = getCategoryDisplayData(categoryId);
    return categoryData?.icon || <MessageCircle size={20} color="#6B7280" />;
  };

  const getCategoryColor = (categoryId: string) => {
    const categoryData = getCategoryDisplayData(categoryId);
    return categoryData?.color || '#6B7280';
  };

  const handleCategorySelect = async (categoryData: any) => {
    // Wait for the new conversation to be created and set
    const conversationId = await startNewConversation(categoryData.id);
    if (conversationId) {
      // You may need to handle a specific state for showing chat vs categories
      // but with the paywall logic, this handles it automatically
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const messageText = inputText.trim();
    setInputText('');
    
    if (currentCategory) {
      await sendMessage(messageText, currentCategory);
    }
  };

  const handleBackToCategories = () => {
    // This now simply changes the state to show the categories again
    // The paywall logic will take over if the user isn't subscribed
    setShowPaywall(false);
    clearConversation();
  };
  
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
          Alert.alert('Redirecting to Payment', 'Please complete your purchase to unlock the chat.', [{ text: 'OK' }]);
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
  
  // Conditionally render the paywall or the main screen content


  // Main UI
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={Colors.gradients.etherealSunset as any}
        style={styles.gradient}
      >
        <KeyboardAvoidingView 
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Chat Header */}
          <Animated.View style={[styles.chatHeader, { opacity: fadeAnim }]}>
            <TouchableOpacity
              style={styles.chatBackButton}
              onPress={handleBackToCategories}
            >
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.chatHeaderCenter}>
              <View style={styles.chatAvatarSmall}>
                <Bot size={20} color="white" />
              </View>
              <View style={styles.chatHeaderInfo}>
                <Text style={styles.chatHeaderTitle}>AI Bible Assistant</Text>
                <Text style={styles.chatHeaderSubtitle}>
                  {currentCategory ? chatCategories.find(c => c.id === currentCategory)?.title : 'Online'}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.chatInfoButton}>
              <Info size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>

          {/* Messages */}
          <Animated.ScrollView 
            style={[styles.messagesContainer, { opacity: fadeAnim }]}
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
          >
            {messages.map((message) => (
              <ChatMessageComponent
                key={message.id}
                message={message}
                onCopy={(text) => console.log('Copied:', text)}
                onShare={(text) => console.log('Shared:', text)}
              />
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <Animated.View style={[styles.typingContainer, { opacity: typingAnim }]}>
                <View style={styles.aiMessageAvatar}>
                  <Bot size={16} color="white" />
                </View>
                <View style={styles.typingBubble}>
                  <View style={styles.typingDots}>
                    <View style={styles.typingDot} />
                    <View style={styles.typingDot} />
                    <View style={styles.typingDot} />
                  </View>
                </View>
              </Animated.View>
            )}
          </Animated.ScrollView>

          {/* Input Area */}
          <Animated.View style={[styles.inputContainer, { opacity: fadeAnim }]}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
              style={styles.inputGradient}
            >
              <TextInput
                style={styles.textInput}
                placeholder="Ask me anything about faith, Bible, or spiritual life..."
                placeholderTextColor="#9CA3AF"
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
                onSubmitEditing={handleSendMessage}
                returnKeyType="send"
              />
              <TouchableOpacity
                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                onPress={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
              >
                <LinearGradient
                  colors={inputText.trim() && !isTyping ? ['#8B5CF6', '#7C3AED'] : ['#E5E7EB', '#D1D5DB']}
                  style={styles.sendButtonGradient}
                >
                  <Send size={20} color={inputText.trim() && !isTyping ? 'white' : '#9CA3AF'} />
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 120, // Space for floating tab bar
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
    gap: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  infoButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Main Chat Card
  mainChatCard: {
    marginBottom: 32,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  mainChatGradient: {
    padding: 32,
    alignItems: 'center',
  },
  aiAvatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  aiAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: 'white',
  },
  mainChatTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  mainChatSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Categories Section
  categoriesSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  categoryCardContainer: {
    width: (width - 60) / 2,
  },
  categoryCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  categoryGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 6,
  },
  categorySubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },

  // Recent Section
  recentSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAll: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  recentList: {
    gap: 12,
  },
  recentItem: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recentGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  recentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentContent: {
    flex: 1,
  },
  recentCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 2,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  recentPreview: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  recentRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  recentTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Empty Recent State
  emptyRecentSection: {
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  emptyRecentGradient: {
    padding: 32,
    alignItems: 'center',
  },
  emptyRecentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyRecentSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },

  // Chat Interface Styles
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  chatHeaderCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  chatAvatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  chatHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  chatBackButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chatInfoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Messages
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  aiMessageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  // Typing Indicator
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  typingBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
  },

  // Input Area
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  inputGradient: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    maxHeight: 100,
    lineHeight: 22,
  },
  sendButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomSpacing: {
    height: 40,
  },
});

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