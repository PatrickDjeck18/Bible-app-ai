// src/components/ChatMessage.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Bot, User, Copy, Share } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
// Importing Colors as it's used in the original code, but not directly in the component's logic
import { Colors } from '@/constants/DesignTokens'; 

// Helper function to handle Firestore Timestamp objects and regular Dates
const convertTimestampToDate = (timestamp: Date | { toDate: () => Date }): Date => {
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return timestamp.toDate();
};

interface ChatMessageProps {
  message: {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date | { toDate: () => Date }; // Updated type to handle Firestore Timestamps
  };
  onCopy?: (text: string) => void;
  onShare?: (text: string) => void;
}

export function ChatMessage({ message, onCopy, onShare }: ChatMessageProps) {
  // Convert the timestamp to a Date object at the beginning of the component
  const timestamp = convertTimestampToDate(message.timestamp);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(message.text);
      Alert.alert('Copied', 'Message copied to clipboard');
      onCopy?.(message.text);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy message');
    }
  };

  const handleShare = () => {
    // You'd typically use `Share.share` from `react-native` or `expo-sharing` here.
    // The current implementation is a placeholder.
    Alert.alert('Share', `Sharing message: "${message.text}"`);
    onShare?.(message.text);
  };

  return (
    <View style={[
      styles.messageContainer,
      message.isUser ? styles.userMessageContainer : styles.aiMessageContainer
    ]}>
      {!message.isUser && (
        <View style={styles.aiMessageAvatar}>
          <Bot size={16} color="white" />
        </View>
      )}
      
      <View style={[
        styles.messageBubble,
        message.isUser ? styles.userMessageBubble : styles.aiMessageBubble
      ]}>
        <Text style={[
          styles.messageText,
          message.isUser ? styles.userMessageText : styles.aiMessageText
        ]}>
          {message.text}
        </Text>
        
        <View style={styles.messageFooter}>
          <Text style={[
            styles.messageTime,
            message.isUser ? styles.userMessageTime : styles.aiMessageTime
          ]}>
            {formatTime(timestamp)}
          </Text>
          
          {!message.isUser && (
            <View style={styles.messageActions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
                <Copy size={12} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <Share size={12} color="#6B7280" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      
      {message.isUser && (
        <View style={styles.userMessageAvatar}>
          <User size={16} color="white" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
    paddingHorizontal: 4,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
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
  userMessageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userMessageBubble: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  aiMessageBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },
  userMessageText: {
    color: 'white',
  },
  aiMessageText: {
    color: '#1A1A1A',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageTime: {
    fontSize: 12,
    opacity: 0.7,
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  aiMessageTime: {
    color: '#6B7280',
  },
  messageActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
});