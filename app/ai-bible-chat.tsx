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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Send, Bot, Book, Heart, Cross, Users, Sparkles, CircleHelp as HelpCircle, MessageCircle, Star, Leaf, User, Info, Clock, ChevronRight } from 'lucide-react-native';
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

export default function AIBibleChatScreen() {
  const {
    messages,
    conversations,
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
  const [showCategories, setShowCategories] = useState(true);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const typingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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

  const handleCategorySelect = (categoryData: any) => {
    const conversationId = startNewConversation(categoryData.id);
    setShowCategories(false);
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
    setShowCategories(true);
    clearConversation();
  };


  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (showCategories) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={Colors.gradients.etherealSunset as any}
          style={styles.gradient}
        >
          <Animated.ScrollView 
            style={[styles.scrollView, { opacity: fadeAnim }]} 
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <Animated.View style={[styles.header, { transform: [{ translateY: slideAnim }] }]}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <ArrowLeft size={24} color="white" />
              </TouchableOpacity>
              <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>AI Bible Chat</Text>
                <Text style={styles.headerSubtitle}>Ask questions about faith, scripture, and spiritual growth</Text>
              </View>
              <TouchableOpacity style={styles.infoButton}>
                <Info size={24} color="white" />
              </TouchableOpacity>
            </Animated.View>

            {/* Main Chat Card */}
            <Animated.View style={[styles.mainChatCard, { transform: [{ scale: scaleAnim }] }]}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
                style={styles.mainChatGradient}
              >
                <View style={styles.aiAvatarContainer}>
                  <LinearGradient
                    colors={['#8B5CF6', '#7C3AED']}
                    style={styles.aiAvatar}
                  >
                    <Bot size={32} color="white" />
                  </LinearGradient>
                  <View style={styles.onlineIndicator} />
                </View>
                
                <Text style={styles.mainChatTitle}>Chat with AI Assistant</Text>
                <Text style={styles.mainChatSubtitle}>
                  Choose a topic below to start a meaningful conversation about faith, scripture, and spiritual growth.
                </Text>
              </LinearGradient>
            </Animated.View>

            {/* Categories Grid */}
            <Animated.View style={[styles.categoriesSection, { transform: [{ scale: scaleAnim }] }]}>
              <Text style={styles.sectionTitle}>AI Chat Categories</Text>
              <View style={styles.categoriesGrid}>
                {categoryDisplayData.map((category, index) => (
                  <Animated.View
                    key={category.id}
                    style={[
                      styles.categoryCardContainer,
                      {
                        opacity: fadeAnim,
                        transform: [{
                          translateY: slideAnim.interpolate({
                            inputRange: [0, 50],
                            outputRange: [0, 50 + (index * 10)],
                          })
                        }]
                      }
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.categoryCard}
                      onPress={() => handleCategorySelect(category)}
                    >
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
                        style={styles.categoryGradient}
                      >
                        <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                          {category.icon}
                        </View>
                        <Text style={styles.categoryTitle}>{category.title}</Text>
                        <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>

            {/* Recent Conversations */}
            {recentConversations.length > 0 && (
              <Animated.View style={[styles.recentSection, { transform: [{ scale: scaleAnim }] }]}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent Conversations</Text>
                </View>
                
                <View style={styles.recentList}>
                  {recentConversations.map((conversation) => (
                    <TouchableOpacity
                      key={conversation.id}
                      style={styles.recentItem}
                      onPress={() => openExistingConversation(conversation.id)}
                      onLongPress={() => {
                        Alert.alert(
                          'Delete Conversation',
                          'Are you sure you want to delete this conversation?',
                          [
                            { text: 'Cancel', style: 'cancel' },
                            { 
                              text: 'Delete', 
                              style: 'destructive',
                              onPress: () => deleteConversation(conversation.id)
                            }
                          ]
                        );
                      }}
                    >
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
                        style={styles.recentGradient}
                      >
                        <View style={styles.recentLeft}>
                          <View style={[styles.recentIcon, { backgroundColor: getCategoryColor(conversation.category) }]}>
                            {getCategoryIcon(conversation.category)}
                          </View>
                          <View style={styles.recentContent}>
                            <Text style={styles.recentCategory}>
                              {chatCategories.find(c => c.id === conversation.category)?.title || conversation.category}
                            </Text>
                            <Text style={styles.recentTitle} numberOfLines={1}>
                              {conversation.title}
                            </Text>
                            <Text style={styles.recentPreview} numberOfLines={1}>
                              {conversation.preview}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.recentRight}>
                          <Text style={styles.recentTime}>{formatTimeAgo(conversation.lastMessageTime)}</Text>
                          <ChevronRight size={16} color="#9CA3AF" />
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
              </Animated.View>
            )}

            {/* Empty State for Recent Conversations */}
            {recentConversations.length === 0 && (
              <Animated.View style={[styles.emptyRecentSection, { transform: [{ scale: scaleAnim }] }]}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
                  style={styles.emptyRecentGradient}
                >
                  <MessageCircle size={48} color="#9CA3AF" />
                  <Text style={styles.emptyRecentTitle}>No Recent Conversations</Text>
                  <Text style={styles.emptyRecentSubtitle}>
                    Start a conversation by selecting a category above
                          </Text>
                </LinearGradient>
              </Animated.View>
            )}

            {/* Bottom spacing */}
            <View style={styles.bottomSpacing} />
          </Animated.ScrollView>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Chat Interface
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
              onPress={() => router.back()}
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
            ref={(ref) => {
              // Auto-scroll to bottom when new messages arrive
              if (ref && messages.length > 0) {
                setTimeout(() => {
                  if ('scrollToEnd' in ref) {
                    ref.scrollToEnd({ animated: true });
                  }
                }, 100);
              }
            }}
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