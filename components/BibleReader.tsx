import React, { useState, useEffect } from 'react';
import { useBibleAPI } from '../hooks/useBibleAPI';
import { LinearGradient } from 'expo-linear-gradient';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  Sparkles
} from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignTokens';
import * as Speech from 'expo-speech';
import { VerseStudyAssistant } from './VerseStudyAssistant';

const { width } = Dimensions.get('window');

interface Verse {
  number: number;
  text: string;
}

interface BibleReaderProps {
  bookName: string;
  chapterNumber: number;
  verses: Verse[];
  bibleVersion: string;
  bibleId: string;
  bookId: string;
  onBack: () => void;
  onSearch: () => void;
  onMenu: () => void;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

export const BibleReader: React.FC<BibleReaderProps> = ({
  bookName,
  chapterNumber,
  verses,
  bibleVersion,
  bibleId,
  bookId,
  onBack,
  onSearch,
  onMenu,
  onPrevChapter,
  onNextChapter,
  canGoPrev,
  canGoNext,
}) => {
  console.log('📖 BibleReader rendered with:', { bookName, chapterNumber, canGoPrev, canGoNext });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerse, setCurrentVerse] = useState(0);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [showStudyAssistant, setShowStudyAssistant] = useState(false);

  // Stop speech when component unmounts or chapter changes
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  useEffect(() => {
    // Stop any ongoing speech when chapter changes
    Speech.stop();
    setIsPlaying(false);
    setCurrentVerse(0);
  }, [bookName, chapterNumber]);

  const togglePlayPause = async () => {
    if (isPlaying) {
      Speech.stop();
      setIsPlaying(false);
    } else {
      if (verses.length === 0) return;
      
      setIsPlaying(true);
      setCurrentVerse(0);
      await speakVerse(0);
    }
  };

  const speakVerse = async (verseIndex: number) => {
    if (verseIndex >= verses.length) {
      setIsPlaying(false);
      return;
    }

    const verse = verses[verseIndex];
    const textToSpeak = `${verse.number}. ${verse.text}`;
    
    setCurrentVerse(verseIndex);
    
    await Speech.speak(textToSpeak, {
      language: 'en',
      pitch: 1.0,
      rate: 0.8, // Slightly slower for better comprehension
      onDone: () => {
        if (verseIndex < verses.length - 1) {
          speakVerse(verseIndex + 1);
        } else {
          setIsPlaying(false);
        }
      },
      onError: () => {
        setIsPlaying(false);
      }
    });
  };

  const stopAudio = () => {
    Speech.stop();
    setIsPlaying(false);
  };

  const skipToVerse = (verseIndex: number) => {
    Speech.stop();
    if (verseIndex >= 0 && verseIndex < verses.length) {
      setCurrentVerse(verseIndex);
      speakVerse(verseIndex);
    }
  };

  const handleVerseSelect = (verseIndex: number) => {
    setSelectedVerse(verseIndex === selectedVerse ? null : verseIndex);
  };

  const openStudyAssistant = (verseIndex: number) => {
    setSelectedVerse(verseIndex);
    setShowStudyAssistant(true);
  };

  const closeStudyAssistant = () => {
    setShowStudyAssistant(false);
    setSelectedVerse(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={Colors.gradients.spiritualLight}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Header Card */}
      <View style={styles.hero}>
        <LinearGradient
          colors={Colors.gradients.spiritualLight || ['#fdfcfb', '#e2d1c3', '#c9d6ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={styles.heroContent}>
            <TouchableOpacity style={styles.heroActionButton} onPress={onBack}>
              <ArrowLeft size={20} color={Colors.primary[600]} />
            </TouchableOpacity>
            
            <View style={styles.heroTextBlock}>
              <Text style={styles.heroTitle}>{bookName} {chapterNumber}</Text>
              <Text style={styles.heroSubtitle}></Text>
            </View>
            
            <View style={styles.heroActions}>
              {/* Audio Controls */}
              <TouchableOpacity
                style={[styles.audioButton, !verses.length && styles.audioButtonDisabled]}
                onPress={togglePlayPause}
                disabled={!verses.length}
              >
                {isPlaying ? (
                  <Pause size={20} color={Colors.primary[600]} />
                ) : (
                  <Play size={20} color={Colors.primary[600]} />
                )}
              </TouchableOpacity>
              
              {isPlaying && (
                <TouchableOpacity
                  style={styles.audioButton}
                  onPress={stopAudio}
                >
                  <Volume2 size={20} color={Colors.primary[600]} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Bible Content */}
      <View style={styles.contentWrapper}>
        {/* Navigation Bar - Moved to top */}
        <View style={styles.navigationBar}>
          <TouchableOpacity
            style={[styles.navButton, !canGoPrev && styles.navButtonDisabled]}
            onPress={onPrevChapter}
            disabled={!canGoPrev}
          >
            <ChevronLeft size={20} color={Colors.neutral[900]} />
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>

          <Text style={styles.chapterTitle}>
            {bookName} {chapterNumber}
          </Text>

          <TouchableOpacity
            style={[styles.navButton, !canGoNext && styles.navButtonDisabled]}
            onPress={onNextChapter}
            disabled={!canGoNext}
          >
            <Text style={styles.navButtonText}>Next</Text>
            <ChevronRight size={20} color={Colors.neutral[900]} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {verses.map((verse, index) => (
            <View
              key={verse.number}
              style={[
                styles.verseContainer,
                currentVerse === index && styles.currentVerseContainer,
                selectedVerse === index && styles.selectedVerseContainer,
              ]}
            >
              <TouchableOpacity
                onPress={() => handleVerseSelect(index)}
                delayLongPress={500}
              >
                <Text style={[
                  styles.verseText,
                  currentVerse === index && styles.currentVerseText,
                  selectedVerse === index && styles.selectedVerseText
                ]}>
                  <Text style={[
                    styles.verseNumber,
                    currentVerse === index && styles.currentVerseNumber,
                    selectedVerse === index && styles.selectedVerseNumber
                  ]}>{verse.number}</Text>
                  {' '}{verse.text}
                </Text>
              </TouchableOpacity>

              {/* Study Button - Only shown when this verse is selected */}
              {selectedVerse === index && (
                <TouchableOpacity
                  style={styles.studyButton}
                  onPress={() => openStudyAssistant(index)}
                >
                  <Sparkles size={16} color={Colors.neutral[900]} />
                  <Text style={styles.studyButtonText}>Study</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Verse Study Assistant */}
      <VerseStudyAssistant
        visible={showStudyAssistant}
        onClose={closeStudyAssistant}
        verseData={selectedVerse !== null ? {
          bookName,
          chapterNumber,
          verseNumber: verses[selectedVerse]?.number || 0,
          verseText: verses[selectedVerse]?.text || '',
        } : null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  // Header Card Styles
  hero: {
    paddingTop: (Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0) + Spacing.md,
    paddingBottom: Spacing.lg,
  },
  heroGradient: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.lg,
    ...Shadows.md,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroActionButton: {
    padding: Spacing.sm,
    backgroundColor: Colors.neutral[100],
    borderRadius: BorderRadius.md,
  },
  heroTextBlock: {
    flex: 1,
    marginHorizontal: Spacing.md,
  },
  heroTitle: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[800],
    marginBottom: Spacing.xs,
  },
  heroSubtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[600],
    lineHeight: Typography.lineHeights.normal,
  },
  heroActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  audioButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.neutral[100],
  },
  audioButtonDisabled: {
    opacity: 0.5,
  },
  studyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.secondary[100],
    marginTop: Spacing.xs,
    alignSelf: 'flex-start',
  },
  studyButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.neutral[900],
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentWrapper: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: 100, // Space for navigation bar
  },
  verseContainer: {
    marginBottom: Spacing.md,
  },
  verseText: {
    fontSize: 22,
    lineHeight: 28,
    color: Colors.neutral[900],
    fontWeight: Typography.weights.regular,
    textAlign: 'left',
  },
  verseNumber: {
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[900],
  },
  currentVerseContainer: {
    backgroundColor: Colors.primary[50],
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  currentVerseText: {
    color: Colors.primary[900],
  },
  currentVerseNumber: {
    color: Colors.primary[700],
    fontWeight: Typography.weights.bold,
  },
  selectedVerseContainer: {
    backgroundColor: Colors.secondary[50],
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.secondary[300],
  },
  selectedVerseText: {
    color: Colors.secondary[900],
  },
  selectedVerseNumber: {
    color: Colors.secondary[700],
    fontWeight: Typography.weights.bold,
  },
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    // Positioned at top above content
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.neutral[100],
    minWidth: 100,
    minHeight: 44,
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  navButtonText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.neutral[900],
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  chapterTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: Colors.neutral[900],
  },
});
