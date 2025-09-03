import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cleanAIResponse } from '@/utils/textFormatting';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  category?: string;
}

export interface ChatCategory {
  id: string;
  title: string;
  subtitle: string;
  systemPrompt: string;
}

export interface Conversation {
  id: string;
  category: string;
  title: string;
  preview: string;
  lastMessageTime: Date;
  messages: ChatMessage[];
}

const CONVERSATIONS_STORAGE_KEY = 'ai_bible_conversations';

export function useAIBibleChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // Load conversations from storage on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Save conversations when they change
  useEffect(() => {
    saveConversations();
  }, [conversations]);

  const loadConversations = async () => {
    try {
      const stored = await AsyncStorage.getItem(CONVERSATIONS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const conversationsWithDates = parsed.map((conv: any) => ({
          ...conv,
          lastMessageTime: new Date(conv.lastMessageTime),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setConversations(conversationsWithDates);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const saveConversations = async () => {
    try {
      await AsyncStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error('Error saving conversations:', error);
    }
  };

  const chatCategories: ChatCategory[] = [
    {
      id: 'bible-study',
      title: 'Bible Study',
      subtitle: 'Scripture insights & interpretation',
      systemPrompt: 'You are a knowledgeable Bible study assistant. Help users understand Scripture, provide context, explain difficult passages, and offer practical applications. Always reference specific Bible verses and provide accurate biblical interpretation based on sound hermeneutics.'
    },
    {
      id: 'prayer-life',
      title: 'Prayer Life',
      subtitle: 'Prayer guidance & support',
      systemPrompt: 'You are a prayer mentor and spiritual guide. Help users develop their prayer life, understand different types of prayer, overcome prayer challenges, and deepen their relationship with God through prayer. Provide biblical examples and practical guidance.'
    },
    {
      id: 'faith-life',
      title: 'Faith & Life',
      subtitle: 'Living out your faith daily',
      systemPrompt: 'You are a Christian life coach helping believers apply their faith to daily life. Provide biblical wisdom for life decisions, relationships, work, and personal growth. Help users see how their faith intersects with practical living.'
    },
    {
      id: 'theology',
      title: 'Theology',
      subtitle: 'Deep theological discussions',
      systemPrompt: 'You are a theological scholar with deep knowledge of Christian doctrine, church history, and biblical theology. Help users understand complex theological concepts, answer doctrinal questions, and explore the depths of Christian faith with biblical accuracy.'
    },
    {
      id: 'relationships',
      title: 'Relationships',
      subtitle: 'Biblical relationship advice',
      systemPrompt: 'You are a Christian counselor specializing in relationships. Provide biblical guidance for marriage, family, friendships, and community relationships. Help users navigate relationship challenges with wisdom from Scripture.'
    },
    {
      id: 'spiritual-growth',
      title: 'Spiritual Growth',
      subtitle: 'Growing in your faith journey',
      systemPrompt: 'You are a spiritual mentor focused on helping believers grow in their faith. Provide guidance on spiritual disciplines, overcoming spiritual obstacles, developing Christian character, and maturing in faith.'
    },
    {
      id: 'life-questions',
      title: 'Life Questions',
      subtitle: 'Biblical answers to life\'s questions',
      systemPrompt: 'You are a wise biblical counselor who helps people find biblical answers to life\'s big questions. Address topics like purpose, suffering, decision-making, and finding God\'s will with compassion and biblical truth.'
    },
    {
      id: 'holy-spirit',
      title: 'Holy Spirit',
      subtitle: 'Understanding spiritual gifts',
      systemPrompt: 'You are an expert on the Holy Spirit and spiritual gifts. Help users understand the role of the Holy Spirit, discover and develop their spiritual gifts, and learn to be led by the Spirit in their daily lives.'
    },
    {
      id: 'service',
      title: 'Service',
      subtitle: 'Serving God & others',
      systemPrompt: 'You are a ministry leader who helps believers discover their calling and serve effectively. Provide guidance on finding your ministry, serving in the church, missions, and making a difference in your community for Christ.'
    },
    {
      id: 'general-chat',
      title: 'General Chat',
      subtitle: 'Open faith conversations',
      systemPrompt: 'You are a friendly Christian companion for open conversations about faith, life, and spiritual matters. Be encouraging, biblically sound, and ready to discuss any topic from a Christian perspective.'
    }
  ];

  const createNewConversation = (categoryId: string): Conversation => {
    const category = chatCategories.find(c => c.id === categoryId);
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      text: `Hello! I'm here to help you with ${category?.title.toLowerCase()}. ${category?.subtitle} What would you like to discuss today?`,
      isUser: false,
      timestamp: new Date(),
      category: categoryId,
    };

    return {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      category: categoryId,
      title: `${category?.title} Chat`,
      preview: welcomeMessage.text,
      lastMessageTime: new Date(),
      messages: [welcomeMessage],
    };
  };

  const updateConversation = (conversationId: string, newMessages: ChatMessage[]) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const lastMessage = newMessages[newMessages.length - 1];
        const firstUserMessage = newMessages.find(m => m.isUser);
        return {
          ...conv,
          messages: newMessages,
          preview: lastMessage.text.substring(0, 100) + (lastMessage.text.length > 100 ? '...' : ''),
          lastMessageTime: lastMessage.timestamp,
          title: firstUserMessage ? 
            (firstUserMessage.text.substring(0, 50) + (firstUserMessage.text.length > 50 ? '...' : '')) : 
            conv.title
        };
      }
      return conv;
    }));
  };

  const sendMessage = async (userMessage: string, categoryId: string): Promise<void> => {
    if (!userMessage.trim()) return;

    // Add user message
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      text: userMessage.trim(),
      isUser: true,
      timestamp: new Date(),
      category: categoryId,
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    
    // Update conversation
    if (currentConversationId) {
      updateConversation(currentConversationId, updatedMessages);
    }
    
    setIsTyping(true);

    try {
      // Try Edge Function first, fallback to direct API
      let aiResponse: string;
      
      try {
        aiResponse = await getEdgeFunctionResponse(userMessage, categoryId);
      } catch (edgeError) {
        console.log('Edge function failed, trying direct API:', edgeError);
        aiResponse = await getDeepSeekResponse(userMessage, categoryId);
      }
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: cleanAIResponse(aiResponse),
        isUser: false,
        timestamp: new Date(),
        category: categoryId,
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      
      // Update conversation with AI response
      if (currentConversationId) {
        updateConversation(currentConversationId, finalMessages);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fallback response
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble connecting to the AI service right now. Please try again in a moment. In the meantime, I encourage you to pray about your question and seek wisdom from God's Word.",
        isUser: false,
        timestamp: new Date(),
        category: categoryId,
      };

      const finalMessages = [...updatedMessages, fallbackMessage];
      setMessages(finalMessages);
      
      // Update conversation with fallback message
      if (currentConversationId) {
        updateConversation(currentConversationId, finalMessages);
      }
      
      Alert.alert(
        'Connection Issue',
        'Unable to connect to the AI service. Please check your internet connection and try again.'
      );
    } finally {
      setIsTyping(false);
    }
  };

  const getEdgeFunctionResponse = async (userMessage: string, categoryId: string): Promise<string> => {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    const conversationHistory = messages
      .filter(m => m.category === categoryId)
      .slice(-10)
      .map(m => ({
        role: m.isUser ? 'user' : 'assistant',
        content: m.text
      }));

    const response = await fetch(`${supabaseUrl}/functions/v1/ai-bible-chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        category: categoryId,
        conversationHistory,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Edge function error:', errorText);
      throw new Error(`Edge function request failed: ${response.status}`);
    }

    const responseData = await response.json();
    return cleanAIResponse(responseData.response);
  };

  const getDeepSeekResponse = async (userMessage: string, categoryId: string): Promise<string> => {
    const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
    const API_KEY = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY || 'sk-a65800223d43491a818e11c4f6d27dbb';

    const category = chatCategories.find(c => c.id === categoryId);
    const systemPrompt = category?.systemPrompt || 'You are a helpful Christian AI assistant.';

    const conversationHistory = messages
      .filter(m => m.category === categoryId)
      .slice(-10) // Keep last 10 messages for context
      .map(m => ({
        role: m.isUser ? 'user' : 'assistant',
        content: m.text
      }));

    const requestBody = {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `${systemPrompt}

Guidelines:
- Always provide biblically accurate information
- Reference specific Bible verses when relevant
- Be encouraging and supportive
- Keep responses conversational and helpful
- If you're unsure about something, acknowledge it and suggest prayer or consulting Scripture
- Maintain a warm, pastoral tone
- Limit responses to 2-3 paragraphs for mobile readability`
        },
        ...conversationHistory,
        {
          role: 'user',
          content: userMessage
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
      top_p: 0.9,
    };

    console.log('🔍 Calling DeepSeek API for Bible chat...');

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ DeepSeek API error:', errorText);
      throw new Error(`DeepSeek API request failed: ${response.status}`);
    }

    
        const responseData = await response.json();
        const content = responseData.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from DeepSeek API');
    }

    console.log('✅ DeepSeek response received for Bible chat');
    return cleanAIResponse(content);
  };

  const startNewConversation = (categoryId: string): string => {
    const newConversation = createNewConversation(categoryId);
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentCategory(categoryId);
    setCurrentConversationId(newConversation.id);
    setMessages(newConversation.messages);
    
    return newConversation.id;
  };

  const openExistingConversation = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentCategory(conversation.category);
      setCurrentConversationId(conversationId);
      setMessages(conversation.messages);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setCurrentCategory(null);
    setCurrentConversationId(null);
  };

  const getConversationHistory = (categoryId: string) => {
    return messages.filter(m => m.category === categoryId);
  };

  const getRecentConversations = (limit: number = 10): Conversation[] => {
    return conversations
      .sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime())
      .slice(0, limit);
  };

  const deleteConversation = async (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    
    // If we're currently viewing this conversation, clear it
    if (currentConversationId === conversationId) {
      clearConversation();
    }
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return {
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
    getConversationHistory,
    getRecentConversations,
    deleteConversation,
    formatTimeAgo,
  };
}