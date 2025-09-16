// src/hooks/useAIBibleChat.js

import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  orderBy,
  deleteDoc,
  serverTimestamp,
  limit,
} from 'firebase/firestore';
import { useAuth } from './useAuth'; // ⬅️ Assumes a useAuth hook exists
import { cleanAIResponse } from '@/utils/textFormatting';

// Re-defining interfaces for clarity
export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date | { toDate: () => Date }; // Handles Firestore Timestamp
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
  userId: string;
  category: string;
  title: string;
  preview: string;
  lastMessageTime: Date;
  messages: ChatMessage[];
}

export function useAIBibleChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const chatCategories: ChatCategory[] = useRef([
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
  ]).current;

  // Load conversations from Firestore on mount and when user changes
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) {
        setConversations([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const q = query(
          collection(db, 'ai_conversations'),
          where('userId', '==', user.uid),
          orderBy('lastMessageTime', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const fetchedConversations = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          lastMessageTime: doc.data().lastMessageTime.toDate(),
          messages: doc.data().messages.map((msg: any) => ({
            ...msg,
            timestamp: msg.timestamp.toDate(),
          })),
        })) as Conversation[];
        setConversations(fetchedConversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [user]);

  const createNewConversation = async (categoryId: string): Promise<string> => {
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const category = chatCategories.find(c => c.id === categoryId);
    const welcomeMessage: ChatMessage = {
      id: `${Date.now()}`,
      text: `Hello! I'm here to help you with ${category?.title.toLowerCase()}. ${category?.subtitle} What would you like to discuss today?`,
      isUser: false,
      timestamp: new Date(),
      category: categoryId,
    };
  
    const conversationData = {
      userId: user.uid,
      category: categoryId,
      title: `${category?.title} Chat`,
      preview: welcomeMessage.text,
      lastMessageTime: serverTimestamp(),
      messages: [{ 
        ...welcomeMessage, 
        timestamp: serverTimestamp() 
      }],
    };
  
    try {
      const docRef = await addDoc(collection(db, 'ai_conversations'), conversationData);
      
      const newConversation: Conversation = {
        id: docRef.id,
        ...conversationData,
        lastMessageTime: new Date(),
        messages: [{ ...welcomeMessage }],
      } as Conversation;
  
      setConversations(prev => [newConversation, ...prev]);
      setCurrentCategory(categoryId);
      setCurrentConversationId(docRef.id);
      setMessages(newConversation.messages);
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating new conversation:', error);
      throw error;
    }
  };

  const updateConversation = async (conversationId: string, newMessages: ChatMessage[]): Promise<void> => {
    if (!user) return;
    try {
      const docRef = doc(db, 'ai_conversations', conversationId);
      const lastMessage = newMessages[newMessages.length - 1];
      const firstUserMessage = newMessages.find(m => m.isUser);
      
      await updateDoc(docRef, {
        messages: newMessages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp as any) // Convert Date object back to Firestore Timestamp
        })),
        preview: lastMessage.text.substring(0, 100) + (lastMessage.text.length > 100 ? '...' : ''),
        lastMessageTime: new Date(lastMessage.timestamp as any),
        title: firstUserMessage ? 
          (firstUserMessage.text.substring(0, 50) + (firstUserMessage.text.length > 50 ? '...' : '')) : 
          'New Chat',
      });
      
      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: newMessages,
            preview: lastMessage.text.substring(0, 100) + (lastMessage.text.length > 100 ? '...' : ''),
            lastMessageTime: lastMessage.timestamp as Date,
            title: firstUserMessage ? 
              (firstUserMessage.text.substring(0, 50) + (firstUserMessage.text.length > 50 ? '...' : '')) : 
              conv.title,
          };
        }
        return conv;
      }));
    } catch (error) {
      console.error('Error updating conversation:', error);
    }
  };

  const sendMessage = async (userMessage: string, categoryId: string): Promise<void> => {
    if (!userMessage.trim() || !user || !currentConversationId) {
      return;
    }

    setIsTyping(true);

    const userMsg: ChatMessage = {
      id: `${Date.now()}`,
      text: userMessage.trim(),
      isUser: true,
      timestamp: new Date(),
      category: categoryId,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    try {
      const aiResponse = await _fetchAIResponse(userMessage, categoryId, updatedMessages);

      const aiMessage: ChatMessage = {
        id: `${Date.now() + 1}`,
        text: cleanAIResponse(aiResponse),
        isUser: false,
        timestamp: new Date(),
        category: categoryId,
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      await updateConversation(currentConversationId, finalMessages);

    } catch (error) {
      console.error('Error getting AI response:', error);
      const fallbackMessage: ChatMessage = {
        id: `${Date.now() + 1}`,
        text: "I apologize, but I'm having trouble connecting to the AI service right now. Please try again in a moment. In the meantime, I encourage you to pray about your question and seek wisdom from God's Word.",
        isUser: false,
        timestamp: new Date(),
        category: categoryId,
      };
      const finalMessages = [...updatedMessages, fallbackMessage];
      setMessages(finalMessages);
      await updateConversation(currentConversationId, finalMessages);

      Alert.alert('Connection Issue', 'Unable to connect to the AI service. Please check your internet connection and try again.');
    } finally {
      setIsTyping(false);
    }
  };

  // ➡️ Helper function to handle AI API calls
  const _fetchAIResponse = async (userMessage: string, categoryId: string, history: ChatMessage[]): Promise<string> => {
    // This function remains the same as it interacts with the DeepSeek API, not Firebase.
    // The only change is that it's a helper function and now part of this file.
    // ... (rest of the API call logic)
    const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
    const API_KEY = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY; // Removed hardcoded fallback for security

    if (!API_KEY) {
      throw new Error('DeepSeek API key is not configured.');
    }

    const category = chatCategories.find(c => c.id === categoryId);
    const systemPrompt = category?.systemPrompt || 'You are a helpful Christian AI assistant.';

    const conversationHistory = history
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

    try {
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
      return cleanAIResponse(content);
    } catch (error) {
      console.error('Error fetching from DeepSeek:', error);
      throw error;
    }
  };

const startNewConversation = async (categoryId: string): Promise<string> => {
  try {
    const conversationId = await createNewConversation(categoryId);
    return conversationId;
  } catch (error) {
    console.error('Failed to start new conversation:', error);
    // You might want to throw the error or return a specific value
    // to indicate failure, e.g., an empty string or null.
    throw error;
  }
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

  const deleteConversation = async (conversationId: string) => {
    try {
      await deleteDoc(doc(db, 'ai_conversations', conversationId));
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      if (currentConversationId === conversationId) {
        clearConversation();
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };
  
  const getRecentConversations = (limit: number = 10): Conversation[] => {
    return [...conversations].sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime()).slice(0, limit);
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
  };
}