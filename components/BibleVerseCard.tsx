import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Share, Heart, Copy, BookOpen } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/DesignTokens';

interface BibleVerseCardProps {
  reference: string;
  content: string;
  translation: string;
  isBookmarked: boolean;
  onBookmark: () => void;
  onShare: () => void;
  onCopy: () => void;
  onView: () => void;
}

export const BibleVerseCard: React.FC<BibleVerseCardProps> = ({
  reference,
  content,
  translation,
  isBookmarked,
  onBookmark,
  onShare,
  onCopy,
  onView,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.reference}>{reference}</Text>
        <Text style={styles.translation}>{translation}</Text>
      </View>
      
      <Text style={styles.content}>{content}</Text>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, isBookmarked && styles.bookmarkedButton]} 
          onPress={onBookmark}
        >
          <Heart 
            size={18} 
            color={isBookmarked ? Colors.error[500] : Colors.neutral[600]} 
            fill={isBookmarked ? Colors.error[500] : 'none'} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onShare}>
          <Share size={18} color={Colors.neutral[600]} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onCopy}>
          <Copy size={18} color={Colors.neutral[600]} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onView}>
          <BookOpen size={18} color={Colors.neutral[600]} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.glass.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  reference: {
    fontSize: 16,
    fontWeight: Typography.weights.bold,
    color: Colors.primary[600],
  },
  translation: {
    fontSize: 12,
    color: Colors.neutral[500],
    fontStyle: 'italic',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.neutral[700],
    marginBottom: Spacing.md,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    paddingTop: Spacing.sm,
  },
  actionButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.neutral[100],
  },
  bookmarkedButton: {
    backgroundColor: Colors.error[100],
  },
});


