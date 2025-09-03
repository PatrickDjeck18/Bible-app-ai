import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Send, 
  BookOpen, 
  MessageCircle, 
  Sparkles, 
  ArrowLeft,
  Copy,
  Share,
  RefreshCw,
  Lightbulb,
  Search,
  History,
  Book,
  Clock,
  Trash2,
  Calendar,
} from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignTokens';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
}

interface BibleStudySession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastMessage?: string;
  messageCount: number;
}

export default function BibleStudyAIScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<BibleStudySession[]>([]);
  const [currentSession, setCurrentSession] = useState<BibleStudySession | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Sample conversation starters
  const conversationStarters = [
    {
      title: "Explain John 3:16",
      description: "Understand the most famous Bible verse",
      icon: "💝"
    },
    {
      title: "What is the meaning of the Trinity?",
      description: "Explore this fundamental Christian doctrine",
      icon: "☘️"
    },
    {
      title: "Tell me about the Fruit of the Spirit",
      description: "Learn about Galatians 5:22-23",
      icon: "🍎"
    },
    {
      title: "Explain the Beatitudes",
      description: "Study Jesus' teachings in Matthew 5",
      icon: "🙏"
    },
    {
      title: "What is the significance of baptism?",
      description: "Understand this important sacrament",
      icon: "💧"
    },
    {
      title: "Tell me about the Armor of God",
      description: "Study Ephesians 6:10-18",
      icon: "🛡️"
    }
  ];

  useEffect(() => {
    loadSessions();
    initializeNewSession();
  }, []);

  const initializeNewSession = () => {
    // Initialize with a welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      text: "Welcome to Bible Study with AI! I'm here to help you explore Scripture, answer your questions, and deepen your understanding of God's Word. What would you like to study today?",
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  const loadSessions = async () => {
    try {
      setHistoryLoading(true);
      const savedSessions = await AsyncStorage.getItem('bible_study_sessions');
      if (savedSessions) {
        const parsedSessions = JSON.parse(savedSessions).map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setSessions(parsedSessions);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const saveSession = async (session: BibleStudySession) => {
    try {
      const updatedSessions = [session, ...sessions.filter(s => s.id !== session.id)];
      await AsyncStorage.setItem('bible_study_sessions', JSON.stringify(updatedSessions));
      setSessions(updatedSessions);
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const deleteSession = async (sessionId: string) => {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this Bible study session? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedSessions = sessions.filter(s => s.id !== sessionId);
              await AsyncStorage.setItem('bible_study_sessions', JSON.stringify(updatedSessions));
              setSessions(updatedSessions);
              
              // If we're deleting the current session, start a new one
              if (currentSession?.id === sessionId) {
                startNewSession();
              }
            } catch (error) {
              console.error('Error deleting session:', error);
              Alert.alert('Error', 'Failed to delete session');
            }
          }
        }
      ]
    );
  };

  const loadSession = (session: BibleStudySession) => {
    setCurrentSession(session);
    setMessages(session.messages);
    setShowHistory(false);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: '',
      isUser: false,
      timestamp: new Date(),
      isLoading: true,
    };

    const updatedMessages = [...messages, userMessage, loadingMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await callDeepseekAPI(inputText.trim());
      
      // Remove loading message and add AI response
      const finalMessages = updatedMessages.filter(msg => !msg.isLoading);
      const aiMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      const finalUpdatedMessages = [...finalMessages, aiMessage];
      setMessages(finalUpdatedMessages);

      // Save session
      const sessionToSave: BibleStudySession = {
        id: currentSession?.id || Date.now().toString(),
        title: currentSession?.title || `Bible Study - ${new Date().toLocaleDateString()}`,
        messages: finalUpdatedMessages,
        createdAt: currentSession?.createdAt || new Date(),
        lastMessage: userMessage.text,
        messageCount: finalUpdatedMessages.length - 1, // Exclude welcome message
      };
      setCurrentSession(sessionToSave);
      await saveSession(sessionToSave);

    } catch (error) {
      console.error('Error calling Deepseek API:', error);
      
      // Remove loading message and add error response
      const finalMessages = updatedMessages.filter(msg => !msg.isLoading);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: "I apologize, but I'm having trouble connecting right now. Please check your internet connection and try again.",
        isUser: false,
        timestamp: new Date(),
      };
      const finalUpdatedMessages = [...finalMessages, errorMessage];
      setMessages(finalUpdatedMessages);

      // Save session even with error
      const sessionToSave: BibleStudySession = {
        id: currentSession?.id || Date.now().toString(),
        title: currentSession?.title || `Bible Study - ${new Date().toLocaleDateString()}`,
        messages: finalUpdatedMessages,
        createdAt: currentSession?.createdAt || new Date(),
        lastMessage: userMessage.text,
        messageCount: finalUpdatedMessages.length - 1,
      };
      setCurrentSession(sessionToSave);
      await saveSession(sessionToSave);
    } finally {
      setIsLoading(false);
    }
  };

  const callDeepseekAPI = async (question: string): Promise<string> => {
    const apiKey = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      throw new Error('Deepseek API key not configured');
    }

    const prompt = `You are a knowledgeable Bible scholar and Christian teacher. Please provide a thoughtful, accurate, and helpful response to this Bible-related question: "${question}"

Please:
1. Provide a clear and accurate answer
2. Reference relevant Bible verses when appropriate
3. Explain theological concepts in an accessible way
4. Be encouraging and spiritually uplifting
5. Keep responses concise but comprehensive (2-4 paragraphs)
6. If the question is not Bible-related, politely redirect to Bible topics

Question: ${question}`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a knowledgeable Bible scholar and Christian teacher. Provide thoughtful, accurate, and helpful responses to Bible-related questions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response at this time.';
  };

  const handleConversationStarter = (starter: any) => {
    setInputText(starter.title);
  };

  const copyMessage = (text: string) => {
    // In a real app, you'd use a clipboard library
    Alert.alert('Copied!', 'Message copied to clipboard');
  };

  const shareMessage = (text: string) => {
    Alert.alert('Share', 'Sharing functionality would be implemented here');
  };

  const startNewSession = () => {
    const newSession: BibleStudySession = {
      id: Date.now().toString(),
      title: `Bible Study - ${new Date().toLocaleDateString()}`,
      messages: [],
      createdAt: new Date(),
      messageCount: 0,
    };
    setCurrentSession(newSession);
    initializeNewSession();
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const renderHistoryItem = ({ item }: { item: BibleStudySession }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => loadSession(item)}
      activeOpacity={0.7}
    >
      <View style={styles.historyItemHeader}>
        <View style={styles.historyItemTitle}>
          <BookOpen size={16} color={Colors.primary[600]} />
          <Text style={styles.historyItemTitleText}>{item.title}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteSession(item.id)}
        >
          <Trash2 size={16} color={Colors.neutral[400]} />
        </TouchableOpacity>
      </View>
      
      {item.lastMessage && (
        <Text style={styles.historyItemLastMessage} numberOfLines={2}>
          {item.lastMessage}
        </Text>
      )}
      
      <View style={styles.historyItemFooter}>
        <View style={styles.historyItemMeta}>
          <Clock size={12} color={Colors.neutral[500]} />
          <Text style={styles.historyItemDate}>{formatDate(item.createdAt)}</Text>
        </View>
        <View style={styles.historyItemMeta}>
          <MessageCircle size={12} color={Colors.neutral[500]} />
          <Text style={styles.historyItemCount}>{item.messageCount} messages</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <View style={styles.messageHeader}>
        <View style={styles.messageIcon}>
          {message.isUser ? (
            <MessageCircle size={16} color={Colors.primary[600]} />
          ) : (
            <BookOpen size={16} color={Colors.secondary[600]} />
          )}
        </View>
        <Text style={styles.messageTime}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      
      {message.isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.primary[600]} />
          <Text style={styles.loadingText}>AI is thinking...</Text>
        </View>
      ) : (
        <>
          <Text style={[
            styles.messageText,
            message.isUser ? styles.userMessageText : styles.aiMessageText,
          ]}>
            {message.text}
          </Text>
          
          {!message.isUser && (
            <View style={styles.messageActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => copyMessage(message.text)}
              >
                <Copy size={14} color={Colors.neutral[600]} />
                <Text style={styles.actionText}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => shareMessage(message.text)}
              >
                <Share size={14} color={Colors.neutral[600]} />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
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
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={Colors.primary[600]} />
            </TouchableOpacity>
            
            <View style={styles.heroTextBlock}>
              <Text style={styles.heroTitle}>Bible Study with AI</Text>
              <Text style={styles.heroSubtitle}>Ask questions about Scripture</Text>
            </View>
            
            <View style={styles.heroActions}>
              <TouchableOpacity
                style={styles.heroActionButton}
                onPress={() => setShowHistory(true)}
              >
                <History size={20} color={Colors.primary[600]} />
                {sessions.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{sessions.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.heroActionButton}
                onPress={startNewSession}
              >
                <RefreshCw size={20} color={Colors.primary[600]} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
        
        {/* Conversation Starters */}
        {messages.length === 1 && (
          <View style={styles.startersContainer}>
            <Text style={styles.startersTitle}>💡 Conversation Starters</Text>
            <Text style={styles.startersSubtitle}>
              Tap on any topic to begin your Bible study
            </Text>
            
            <View style={styles.startersGrid}>
              {conversationStarters.map((starter, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.starterCard}
                  onPress={() => handleConversationStarter(starter)}
                >
                  <Text style={styles.starterIcon}>{starter.icon}</Text>
                  <Text style={styles.starterTitle}>{starter.title}</Text>
                  <Text style={styles.starterDescription}>{starter.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Section */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask a Bible question..."
            placeholderTextColor={Colors.neutral[400]}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size={20} color="white" />
            ) : (
              <Send size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
        
        <Text style={styles.inputHint}>
          Ask about Bible verses, theological concepts, or spiritual guidance
        </Text>
      </KeyboardAvoidingView>

      {/* History Modal */}
      <Modal
        visible={showHistory}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowHistory(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowHistory(false)}
            >
              <ArrowLeft size={24} color={Colors.neutral[700]} />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Chat History</Text>
            
            <TouchableOpacity
              style={styles.newChatButton}
              onPress={() => {
                setShowHistory(false);
                startNewSession();
              }}
            >
              <Text style={styles.newChatButtonText}>New Chat</Text>
            </TouchableOpacity>
          </View>

          {historyLoading ? (
            <View style={styles.historyLoading}>
              <ActivityIndicator size="large" color={Colors.primary[600]} />
              <Text style={styles.historyLoadingText}>Loading your conversations...</Text>
            </View>
          ) : sessions.length === 0 ? (
            <View style={styles.emptyHistory}>
              <History size={48} color={Colors.neutral[400]} />
              <Text style={styles.emptyHistoryTitle}>No conversations yet</Text>
              <Text style={styles.emptyHistorySubtitle}>
                Start your first Bible study conversation to see it here
              </Text>
            </View>
          ) : (
            <FlatList
              data={sessions}
              renderItem={renderHistoryItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.historyList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // Hero Header (Bible Style)
  hero: {
    paddingTop: Platform.OS === 'ios' ? 60 : 24,
  },
  heroGradient: {
    borderBottomLeftRadius: BorderRadius['3xl'],
    borderBottomRightRadius: BorderRadius['3xl'],
    overflow: 'hidden',
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
    gap: Spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  heroActionButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Shadows.sm,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.full,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: 'white',
  },
  
  // Messages
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  messageContainer: {
    marginBottom: Spacing.lg,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  messageIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.xs,
  },
  messageTime: {
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[500],
  },
  messageText: {
    fontSize: Typography.sizes.base,
    lineHeight: Typography.sizes.base * 1.5,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  userMessageText: {
    color: 'white',
    backgroundColor: Colors.primary[600],
  },
  aiMessageText: {
    color: Colors.neutral[800],
    backgroundColor: Colors.neutral[50],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  loadingText: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[600],
    marginLeft: Spacing.sm,
  },
  messageActions: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.neutral[100],
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
  },
  actionText: {
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[600],
  },
  
  // Conversation Starters
  startersContainer: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  startersTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[900],
    marginBottom: Spacing.xs,
  },
  startersSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[600],
    marginBottom: Spacing.lg,
  },
  startersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  starterCard: {
    width: (width - Spacing.lg * 3) / 2,
    padding: Spacing.md,
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    alignItems: 'center',
  },
  starterIcon: {
    fontSize: 24,
    marginBottom: Spacing.sm,
  },
  starterTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semiBold,
    color: Colors.neutral[900],
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  starterDescription: {
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[600],
    textAlign: 'center',
    lineHeight: Typography.sizes.xs * 1.4,
  },
  
  // Input
  inputContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[100],
    backgroundColor: '#FFFFFF',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  textInput: {
    flex: 1,
    fontSize: Typography.sizes.base,
    color: Colors.neutral[900],
    maxHeight: 100,
    paddingVertical: Spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.neutral[300],
  },
  inputHint: {
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[500],
    marginTop: Spacing.sm,
    textAlign: 'center',
  },

  // History Modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  modalTitle: {
    flex: 1,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[900],
  },
  newChatButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary[600],
    borderRadius: BorderRadius.md,
  },
  newChatButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semiBold,
    color: 'white',
  },
  historyLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyLoadingText: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[600],
    marginTop: Spacing.md,
  },
  emptyHistory: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyHistoryTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[900],
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyHistorySubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[600],
    textAlign: 'center',
    lineHeight: Typography.sizes.sm * 1.4,
  },
  historyList: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  historyItem: {
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  historyItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  historyItemTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.sm,
  },
  historyItemTitleText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semiBold,
    color: Colors.neutral[900],
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyItemLastMessage: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[700],
    marginBottom: Spacing.sm,
    lineHeight: Typography.sizes.sm * 1.4,
  },
  historyItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  historyItemDate: {
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[500],
  },
  historyItemCount: {
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[500],
  },
});
