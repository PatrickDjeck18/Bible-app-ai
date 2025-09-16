import React, { useState } from 'react';
import { VerseStudyService } from '@/lib/services/verseStudyService';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { X, BookOpen, Clock, Link, Sparkles } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/DesignTokens';

interface VerseStudyAssistantProps {
  visible: boolean;
  onClose: () => void;
  verseData: {
    bookName: string;
    chapterNumber: number;
    verseNumber: number;
    verseText: string;
  } | null;
}

interface StudyContent {
  explanation: string;
  historicalContext: string;
  theologicalInterpretation: string;
  relatedScriptures: string[];
  loading: boolean;
}

export const VerseStudyAssistant: React.FC<VerseStudyAssistantProps> = ({
  visible,
  onClose,
  verseData,
}) => {
  const [studyContent, setStudyContent] = useState<StudyContent>({
    explanation: '',
    historicalContext: '',
    theologicalInterpretation: '',
    relatedScriptures: [],
    loading: false,
  });

  const fetchStudyContent = async () => {
    if (!verseData) return;
    
    setStudyContent(prev => ({ ...prev, loading: true }));
    
    try {
      const studyData = await VerseStudyService.analyzeVerse({
        bookName: verseData.bookName,
        chapterNumber: verseData.chapterNumber,
        verseNumber: verseData.verseNumber,
        verseText: verseData.verseText,
        bibleVersion: 'NIV', // You can make this dynamic based on user preference
      });
      
      setStudyContent({
        explanation: studyData.explanation,
        historicalContext: studyData.historicalContext,
        theologicalInterpretation: studyData.theologicalInterpretation,
        relatedScriptures: studyData.relatedScriptures,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching study content:', error);
      // Fallback to basic content if API fails
      setStudyContent({
        explanation: `This verse from ${verseData.bookName} ${verseData.chapterNumber}:${verseData.verseNumber} speaks about God's faithfulness and promises. The language used emphasizes the enduring nature of divine commitment.`,
        historicalContext: `Written during a period of ${verseData.bookName === 'Psalms' ? 'worship and reflection' : 'prophetic ministry'}, this verse reflects the historical circumstances of the time.`,
        theologicalInterpretation: `Theologically, this verse underscores important doctrines of God's character and His relationship with humanity.`,
        relatedScriptures: [
          'Hebrews 13:8',
          'Numbers 23:19',
          'Malachi 3:6',
          '2 Timothy 2:13'
        ],
        loading: false,
      });
    }
  };

  React.useEffect(() => {
    if (visible && verseData) {
      fetchStudyContent();
    }
  }, [visible, verseData]);

  if (!visible || !verseData) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Sparkles size={24} color={Colors.primary[600]} />
          <Text style={styles.headerTitle}>Verse Study Assistant</Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={24} color={Colors.neutral[600]} />
        </TouchableOpacity>
      </View>

      {/* Verse Reference */}
      <View style={styles.verseReference}>
        <Text style={styles.verseReferenceText}>
          {verseData.bookName} {verseData.chapterNumber}:{verseData.verseNumber}
        </Text>
        <Text style={styles.verseText}>"{verseData.verseText}"</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {studyContent.loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary[600]} />
          </View>
        ) : (
          <>
            {/* Explanation */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <BookOpen size={20} color={Colors.primary[600]} />
                <Text style={styles.sectionTitle}>Explanation</Text>
              </View>
              <Text style={styles.sectionContent}>{studyContent.explanation}</Text>
            </View>

            {/* Historical Context */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Clock size={20} color={Colors.primary[600]} />
                <Text style={styles.sectionTitle}>Historical Context</Text>
              </View>
              <Text style={styles.sectionContent}>{studyContent.historicalContext}</Text>
            </View>

            {/* Theological Interpretation */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Sparkles size={20} color={Colors.primary[600]} />
                <Text style={styles.sectionTitle}>Theological Interpretation</Text>
              </View>
              <Text style={styles.sectionContent}>{studyContent.theologicalInterpretation}</Text>
            </View>

            {/* Related Scriptures */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Link size={20} color={Colors.primary[600]} />
                <Text style={styles.sectionTitle}>Related Scriptures</Text>
              </View>
              {studyContent.relatedScriptures.map((scripture, index) => (
                <Text key={index} style={styles.relatedScripture}>
                  • {scripture}
                </Text>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.neutral[50],
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    backgroundColor: Colors.neutral[100],
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[900],
  },
  closeButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  verseReference: {
    padding: Spacing.lg,
    backgroundColor: Colors.neutral[100],
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  verseReferenceText: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.primary[700],
    marginBottom: Spacing.xs,
  },
  verseText: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[700],
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.sizes.base,
    color: Colors.neutral[600],
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[900],
  },
  sectionContent: {
    fontSize: Typography.sizes.base,
    lineHeight: 24,
    color: Colors.neutral[700],
  },
  relatedScripture: {
    fontSize: Typography.sizes.base,
    color: Colors.primary[600],
    marginBottom: Spacing.xs,
    fontWeight: Typography.weights.medium,
  },
});