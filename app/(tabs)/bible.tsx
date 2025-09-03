
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  FlatList,
  Animated,
  Dimensions,
  StatusBar,
  Alert,
  Modal,
  Platform,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows, Breakpoints } from '@/constants/DesignTokens';
import {
  Search,
  ChevronDown,
  Book,
  Star,
  Clock,
  Bookmark,
  Share,
  Heart,
  Filter,
  ArrowLeft,
  BookOpen,
  X,
  Menu,
  MoreHorizontal,
  Headphones,
  SkipForward,
  SkipBack,
  Type, ChevronLeft, ChevronRight
} from 'lucide-react-native';
import { BIBLE_BOOKS, OLD_TESTAMENT_BOOKS, NEW_TESTAMENT_BOOKS } from '@/constants/BibleBooks';
import { useBibleAPI } from '../../hooks/useBibleAPI';
import { useDailyActivity } from '@/hooks/useDailyActivity';
import { useFocusEffect } from 'expo-router';
import { BibleReader } from '@/components/BibleReader';


interface APIBook {
  id: string;
  translationId: string;
  name: string;
  commonName: string;
  title: string | null;
  order: number;
  numberOfChapters: number;
  firstChapterApiLink: string;
  lastChapterApiLink: string;
  totalNumberOfVerses: number;
  isApocryphal?: boolean;
}

interface APIChapter {
  id: string;
  translationId: string;
  bookId: string;
  chapterNumber: number;
  numberOfVerses: number;
  verses: any[];
}

export default function BibleScreen() {
  const {
    bibles,
    books,
    chapters: apiChapters,
    currentPassage,
    loading,
    error,
    fetchBibles,
    fetchBooks,
    fetchChapters,
    fetchPassage,
    searchVerses,
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark,
  } = useBibleAPI();
  const { todayActivity, updateBibleReading } = useDailyActivity();

  // Dimensions hook - moved inside component
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const { width, height } = dimensions;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  // Get responsive styles based on current screen width
  const { isSmallScreen, isLargeScreen, modernStyles, styles } = getResponsiveStyles(width);

  // State Management
  const [selectedBible, setSelectedBible] = useState('de4e12af7f28f599-02'); // KJV
  const [selectedBook, setSelectedBook] = useState<APIBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'books' | 'chapters' | 'read' | 'search' | 'bookmarks'>('books');

  const [selectedTestament, setSelectedTestament] = useState<'all' | 'old' | 'new'>('all');
  const [showChapterSelector, setShowChapterSelector] = useState(false);
  const [fontSize, setFontSize] = useState(18); // Default font size for verse text

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Reading timer refs
  const isScreenFocusedRef = useRef(false);
  const readingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionStartTimestampRef = useRef<number | null>(null);
  const startingMinutesRef = useRef<number>(0);
  const lastCommittedSessionMinutesRef = useRef<number>(0);

  useEffect(() => {
    // Initialize animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Initialize data
    initializeBibleData();
  }, []);

  const initializeBibleData = async () => {
    try {
      await fetchBibles();
    } catch (error) {
      console.error('Failed to initialize Bible data:', error);
    }
  };

  useEffect(() => {
    if (bibles.length > 0) {
      const preferredBible = bibles.find(bible => bible.id === selectedBible) || bibles[0];
      if (preferredBible) {
        setSelectedBible(preferredBible.id);
        fetchBooks(preferredBible.id);
      }
    }
  }, [bibles]);

  useEffect(() => {
    if (books.length > 0 && selectedBible) {
      const firstBook = books[0];
      if (firstBook) {
        setSelectedBook(firstBook);
        fetchChapters(selectedBible, firstBook.id);
      }
    }
  }, [books, selectedBible]);

  // Debug logging
  useEffect(() => {
    console.log('🔍 Debug - View mode:', viewMode);
    console.log('🔍 Debug - Current passage:', !!currentPassage);
    console.log('🔍 Debug - Selected book:', !!selectedBook);
    console.log('🔍 Debug - Should show BibleReader:', viewMode === 'read' && !!currentPassage && !!selectedBook);
  }, [viewMode, currentPassage, selectedBook]);

  // Filter books based on testament
  const filteredBooks = books.filter(book => {
    if (selectedTestament === 'all') return true;
    const staticBook = BIBLE_BOOKS.find(b => b.name === book.name || b.id === book.id);
    if (!staticBook) return true;
    return staticBook.testament === selectedTestament;
  });

  // Handle book selection
  const handleBookSelect = async (book: APIBook) => {
    setSelectedBook(book);
    setViewMode('chapters');
    try {
      await fetchChapters(selectedBible, book.id);
    } catch (error) {
      console.error('Failed to fetch chapters:', error);
    }
  };

  // Handle chapter selection
  const handleChapterSelect = async (chapter: APIChapter) => {
    setSelectedChapter(chapter.chapterNumber);
    setViewMode('read');
    try {
      // Use the correct format expected by the API: bookId-chapterNumber
      const passageId = `${selectedBook?.id}-${chapter.chapterNumber}`;
      await fetchPassage(selectedBible, passageId);
    } catch (error) {
      console.error('Failed to fetch passage:', error);
    }
  };

    // Handle search
    const handleSearch = async () => {
      if (!searchText.trim()) return;

      setViewMode('search');
      try {
        const results = await searchVerses(selectedBible, searchText);
        setSearchResults(results);
      } catch (error) {
        console.error('Search failed:', error);
        Alert.alert('Search Error', 'Failed to search verses. Please try again.');
      }
    };

  // Handle back navigation
  const handleBack = () => {
    if (viewMode === 'read') {
      setViewMode('chapters');
    } else if (viewMode === 'chapters') {
      setViewMode('books');
    } else if (viewMode === 'search') {
      setViewMode('books');
      setSearchText('');
      setSearchResults([]);
    } else if (viewMode === 'bookmarks') {
      setViewMode('books');
    }
  };

  // Enhanced navigation functions with cross-book support
  const handleNextChapter = async () => {
    if (!selectedBook || !apiChapters.length) return;

    const currentIndex = apiChapters.findIndex(ch => ch.chapterNumber === selectedChapter);

    // If there's a next chapter in current book
    if (currentIndex < apiChapters.length - 1) {
      const nextChapter = apiChapters[currentIndex + 1];
      await handleChapterSelect(nextChapter);
    } else {
      // Go to next book's first chapter
      const currentBookIndex = books.findIndex(book => book.id === selectedBook.id);
      if (currentBookIndex < books.length - 1) {
        const nextBook = books[currentBookIndex + 1];
        setSelectedBook(nextBook);
        setViewMode('read');
        try {
          await fetchChapters(selectedBible, nextBook.id);
          // Wait a bit for chapters to load, then select first chapter
          setTimeout(async () => {
            // Re-fetch chapters to ensure we have the latest data
            await fetchChapters(selectedBible, nextBook.id);
            setTimeout(async () => {
              if (apiChapters.length > 0) {
                const firstChapter = apiChapters[0];
                const passageId = `${nextBook.id}-${firstChapter.chapterNumber}`;
                setSelectedChapter(firstChapter.chapterNumber);
                await fetchPassage(selectedBible, passageId);
              }
            }, 300);
          }, 200);
        } catch (error) {
          console.error('Failed to navigate to next book:', error);
        }
      }
    }
  };

  const handlePrevChapter = async () => {
    if (!selectedBook || !apiChapters.length) return;

    const currentIndex = apiChapters.findIndex(ch => ch.chapterNumber === selectedChapter);

    // If there's a previous chapter in current book
    if (currentIndex > 0) {
      const prevChapter = apiChapters[currentIndex - 1];
      await handleChapterSelect(prevChapter);
    } else {
      // Go to previous book's last chapter
      const currentBookIndex = books.findIndex(book => book.id === selectedBook.id);
      if (currentBookIndex > 0) {
        const prevBook = books[currentBookIndex - 1];
        setSelectedBook(prevBook);
        setViewMode('read');
        try {
          await fetchChapters(selectedBible, prevBook.id);
          // Wait a bit for chapters to load, then select last chapter
          setTimeout(async () => {
            // Re-fetch chapters to ensure we have the latest data
            await fetchChapters(selectedBible, prevBook.id);
            setTimeout(async () => {
              if (apiChapters.length > 0) {
                const lastChapter = apiChapters[apiChapters.length - 1];
                const passageId = `${prevBook.id}-${lastChapter.chapterNumber}`;
                setSelectedChapter(lastChapter.chapterNumber);
                await fetchPassage(selectedBible, passageId);
              }
            }, 300);
          }, 200);
        } catch (error) {
          console.error('Failed to navigate to previous book:', error);
        }
      }
    }
  };

  // Helper function to check if we can navigate to previous chapter/book
  const canNavigatePrev = () => {
    if (!selectedBook || !apiChapters.length) return false;

    const currentChapterIndex = apiChapters.findIndex(ch => ch.chapterNumber === selectedChapter);
    const currentBookIndex = books.findIndex(book => book.id === selectedBook.id);

    // Can go prev if there's a previous chapter in current book OR a previous book
    return currentChapterIndex > 0 || currentBookIndex > 0;
  };

  // Helper function to check if we can navigate to next chapter/book
  const canNavigateNext = () => {
    if (!selectedBook || !apiChapters.length) return false;

    const currentChapterIndex = apiChapters.findIndex(ch => ch.chapterNumber === selectedChapter);
    const currentBookIndex = books.findIndex(book => book.id === selectedBook.id);

    // Can go next if there's a next chapter in current book OR a next book
    return currentChapterIndex < apiChapters.length - 1 || currentBookIndex < books.length - 1;
  };

  // Enhanced verse formatting with modern typography
  const formatVerseText = (content: string) => {
    if (!content) return '';

    // 1) Normalize common HTML verse markers to explicit tokens before stripping tags
    let normalized = content
      // sup-based verse numbers
      .replace(/<sup[^>]*?>\s*(\d{1,3})\s*<\/sup>/gi, '||VERSE:$1||')
      // potential span-based numbers
      .replace(/<span[^>]*?verse[^>]*?>\s*(\d{1,3})\s*<\/span>/gi, '||VERSE:$1||')
      // paragraph markers
      .replace(/<p[^>]*?>/gi, '\n\n')
      .replace(/<br\s*\/?\s*>/gi, '\n');

    // 2) Strip remaining HTML
    normalized = normalized.replace(/<[^>]*>/g, '');

    // 3) Handle pilcrow paragraph markers as paragraph breaks
    normalized = normalized.replace(/\u00B6/g, '\n\n'); // ¶

    // 4) Fix cases like "1In" => "1 In"
    normalized = normalized.replace(/(^|\s)(\d{1,3})(?=[A-Za-z(\[])/g, '$1$2 ');

    // 5) Collapse excessive whitespace
    normalized = normalized.replace(/[\t ]+/g, ' ').replace(/\s*\n\s*/g, '\n').trim();

    // If explicit tokens present, use them for reliable splitting
    if (normalized.includes('||VERSE:')) {
      const chunks = normalized.split('||VERSE:').filter(Boolean);
      const verses: { number: number; text: string }[] = [];
      for (const chunk of chunks) {
        const match = chunk.match(/^(\d{1,3})\|\|(.*)$/s);
        if (match) {
          const number = parseInt(match[1]);
          const text = chunk[2].replace(/\s*\n\s*/g, '\n').trim();
          if (!isNaN(number) && text) {
            verses.push({ number, text });
          }
        } else {
          // Handle edge case where token not followed by number
          const maybeNum = chunk.match(/^(\d{1,3})\s+(.*)$/s);
          if (maybeNum) {
            const number = parseInt(maybeNum[1]);
            const text = maybeNum[2].trim();
            if (!isNaN(number) && text) {
              verses.push({ number, text });
            }
          }
        }
      }
      return verses.length ? verses : normalized;
    }

    // Fallback: parse by verse-number pattern (heuristic)
    const verses: { number: number; text: string }[] = [];
    const regex = /(\b\d{1,3})\s+([^]+?)(?=(?:\b\d{1,3}\s+)|$)/g; // number + text until next number
    let m: RegExpExecArray | null;
    while ((m = regex.exec(normalized)) !== null) {
      const number = parseInt(m[1]);
      const text = m[2].trim();
      if (!isNaN(number) && text) {
        verses.push({ number, text });
      }
    }

    if (verses.length) return verses;

    // Final fallback: return readable paragraph text
    return normalized;
  };

  // Modern verse component with enhanced styling
  const renderVerse = (verse: { number: number; text: string }, index: number) => (
    <TouchableOpacity
      key={`verse-${verse.number}`}
      style={[
        modernStyles.modernVerseContainer,
        {
          transform: [{
            translateY: slideAnim.interpolate({
              inputRange: [0, 30],
              outputRange: [0, 20 + (index * 5)],
            })
          }],
          opacity: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          })
        }
      ]}
      activeOpacity={0.95}
      onPress={() => {
        // Optional: Add verse highlighting or note-taking functionality
        console.log(`Verse ${verse.number} selected`);
      }}
    >
      <View style={modernStyles.verseNumberBadge}>
        <Text style={modernStyles.verseNumberText}>{verse.number}</Text>
      </View>
      <View style={modernStyles.verseContentWrapper}>
        <Text style={[modernStyles.modernVerseText, { fontSize: fontSize }]}>
          {verse.text}
        </Text>
        <View style={modernStyles.verseDivider} />
      </View>
    </TouchableOpacity>
  );

  // Render header
  const renderHeader = () => (
    <View style={styles.hero}>
      <LinearGradient
        colors={Colors.gradients.spiritualLight || ['#fdfcfb', '#e2d1c3', '#c9d6ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroGradient}
      >
        <View style={styles.heroContent}>
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroTitle}>
              {viewMode === 'books' ? 'Holy Bible' :
               viewMode === 'chapters' ? selectedBook?.name :
               viewMode === 'read' ? `${selectedBook?.name} ${selectedChapter}` :
               viewMode === 'search' ? 'Search Results' : 'Bookmarks'}
            </Text>
            <Text style={styles.heroSubtitle}>
              {viewMode === 'books' ? `${filteredBooks.length} Books Available` :
               viewMode === 'chapters' ? 'Select a chapter to read' :
               viewMode === 'read' ? 'Reading God\'s Word' :
               viewMode === 'search' ? 'Find verses and passages' : 'Your saved verses'}
            </Text>
          </View>
          <View style={styles.heroActions}>
            <TouchableOpacity
              style={styles.heroActionButton}
              onPress={() => setViewMode('bookmarks')}
            >
              <Bookmark size={20} color={Colors.primary[600]} />
              {bookmarks.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{bookmarks.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  // Render search bar
  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Search size={20} color={Colors.neutral[500]} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search verses, books, or topics..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={Colors.neutral[500]}
          onSubmitEditing={handleSearch}
        />
        {searchText.trim() ? (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <X size={20} color={Colors.neutral[500]} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );

  // Render testament selector
  const renderTestamentSelector = () => {
    if (viewMode !== 'books') return null;

    return (
      <View style={styles.testamentContainer}>
        {['all', 'old', 'new'].map((testament) => (
          <TouchableOpacity
            key={testament}
            style={[
              styles.testamentButton,
              selectedTestament === testament && styles.activeTestamentButton
            ]}
            onPress={() => setSelectedTestament(testament as 'all' | 'old' | 'new')}
          >
            <Text style={[
              styles.testamentText,
              selectedTestament === testament && styles.activeTestamentText
            ]}>
              {testament === 'all' ? 'All Books' :
               testament === 'old' ? 'Old Testament' : 'New Testament'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderBookItem = ({ item: book }: { item: APIBook }) => {
    const testament = BIBLE_BOOKS.find(b => b.id === book.id)?.testament || 'new';

    return (
      <TouchableOpacity
        style={styles.bookItem}
        onPress={() => handleBookSelect(book)}
        activeOpacity={0.7}
      >
        <View style={styles.bookCard}>
          <View style={[
            styles.bookIcon,
            { backgroundColor: testament === 'old' ? Colors.primary[100] : Colors.secondary[100] }
          ]}>
            <Book size={24} color={testament === 'old' ? Colors.primary[600] : Colors.secondary[600]} />
          </View>
          <View style={styles.bookInfo}>
            <Text style={styles.bookName}>{book.name}</Text>
            <Text style={styles.bookDetails}>
              {book.numberOfChapters} chapters • {testament === 'old' ? 'Old Testament' : 'New Testament'}
            </Text>
          </View>
          <ChevronRight size={20} color={Colors.neutral[400]} />
        </View>
      </TouchableOpacity>
    );
  };

  // Render chapter item
  const renderChapterItem = ({ item: chapter }: { item: APIChapter }) => (
    <TouchableOpacity
      style={styles.chapterItem}
      onPress={() => handleChapterSelect(chapter)}
      activeOpacity={0.7}
    >
      <View style={[
        styles.chapterCard,
        selectedChapter === chapter.chapterNumber && styles.selectedChapterCard
      ]}>
        <Text style={[
          styles.chapterNumber,
          selectedChapter === chapter.chapterNumber && styles.selectedChapterNumber
        ]}>
          {chapter.chapterNumber}
        </Text>
        {chapter.numberOfVerses > 0 && (
          <Text style={styles.chapterVerses}>
            {chapter.numberOfVerses} verses
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  // Render verse content
  const renderVerseContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary[500]} />
          <Text style={styles.loadingText}>Loading passage...</Text>
        </View>
      );
    }

    if (!currentPassage) {
      return (
        <View style={styles.emptyContainer}>
          <BookOpen size={48} color={Colors.neutral[400]} />
          <Text style={styles.emptyTitle}>Select a Chapter</Text>
          <Text style={styles.emptySubtitle}>Choose a chapter to start reading</Text>
        </View>
      );
    }

    const verses = formatVerseText(currentPassage.content);

    return (
      <ScrollView style={styles.verseContainer} showsVerticalScrollIndicator={false}>
        {Array.isArray(verses) ? (
          <View style={styles.versesWrapper}>
            <View style={styles.chapterHeader}>
              <LinearGradient
                colors={Colors.gradients.spiritualLight || ['#fdfcfb', '#e2d1c3', '#c9d6ff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.chapterHeaderGradient}
              >
                <Text style={styles.chapterTitle}>
                  {selectedBook?.name} {selectedChapter}
                </Text>
                <Text style={styles.chapterSubtitle}>
                  {verses.length} verses • {selectedBook?.name}
                </Text>
              </LinearGradient>
            </View>
            {verses.map((verse, index) => renderVerse(verse, index))}
          </View>
        ) : (
          <View style={styles.fallbackTextContainer}>
            <Text style={[modernStyles.modernFallbackText, { fontSize }]}>
              {verses}
            </Text>
          </View>
        )}
      </ScrollView>
    );
  };

  // Main render
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {viewMode !== 'read' && renderHeader()}
        {viewMode !== 'read' && renderSearchBar()}
        {viewMode !== 'read' && renderTestamentSelector()}

        <Animated.View style={[styles.mainContent, { transform: [{ translateY: slideAnim }] }]}>
          {viewMode === 'books' && (
            <FlatList
              data={filteredBooks}
              renderItem={renderBookItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          )}

          {viewMode === 'chapters' && (
            <FlatList
              data={apiChapters}
              renderItem={renderChapterItem}
              keyExtractor={(item) => item.id}
              numColumns={isSmallScreen ? 3 : isLargeScreen ? 5 : 4}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.chaptersGrid}
            />
          )}

          {viewMode === 'read' && currentPassage && selectedBook && (
            <BibleReader
              bookName={selectedBook.name || ''}
              chapterNumber={selectedChapter}
              verses={formatVerseText(currentPassage.content) as { number: number; text: string }[]}
              bibleVersion="GNBUK"
              onBack={handleBack}
              onSearch={() => setViewMode('search')}
              onMenu={() => {
                // Add menu functionality here
                console.log('Menu pressed');
              }}
              onPrevChapter={handlePrevChapter}
              onNextChapter={handleNextChapter}
              canGoPrev={apiChapters.length > 0 && apiChapters.findIndex(ch => ch.chapterNumber === selectedChapter) > 0}
              canGoNext={apiChapters.length > 0 && apiChapters.findIndex(ch => ch.chapterNumber === selectedChapter) < apiChapters.length - 1}
            />
          )}

          {viewMode === 'search' && (
            <FlatList
              data={searchResults}
              renderItem={({ item }) => (
                <View style={styles.searchResultItem}>
                  <Text style={styles.searchResultText}>{item.text}</Text>
                  <Text style={styles.searchResultReference}>{item.reference}</Text>
                </View>
              )}
              keyExtractor={(item, index) => `search-${index}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          )}

          {viewMode === 'bookmarks' && (
            <FlatList
              data={bookmarks}
              renderItem={({ item }) => (
                <View style={styles.searchResultItem}>
                  <Text style={styles.searchResultText}>{item.content || 'Bookmarked passage'}</Text>
                  <Text style={styles.searchResultReference}>{item.reference}</Text>
                </View>
              )}
              keyExtractor={(item, index) => `bookmark-${index}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}

// Helper function to get responsive styles based on screen width
const getResponsiveStyles = (screenWidth: number) => {
  const isSmallScreen = screenWidth < Breakpoints.tablet;
  const isLargeScreen = screenWidth >= Breakpoints.desktop;

  return {
    isSmallScreen,
    isLargeScreen,
    modernStyles: StyleSheet.create({
      modernVerseContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: Spacing.lg,
        padding: Spacing.md,
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.md,
        ...Shadows.sm,
      },
      verseNumberBadge: {
        width: 32,
        height: 32,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.primary[100],
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
        marginTop: Spacing.xs,
      },
      verseNumberText: {
        fontSize: Typography.sizes.sm,
        fontWeight: Typography.weights.bold,
        color: Colors.primary[600],
      },
      verseContentWrapper: {
        flex: 1,
      },
      modernVerseText: {
        fontSize: isSmallScreen ? 16 : 18,
        lineHeight: isSmallScreen ? 22 : 24,
        color: Colors.neutral[800],
        fontWeight: Typography.weights.regular,
      },
      verseDivider: {
        height: 1,
        backgroundColor: Colors.neutral[200],
        marginTop: Spacing.md,
      },
      modernFallbackText: {
        fontSize: isSmallScreen ? 16 : 18,
        lineHeight: isSmallScreen ? 22 : 24,
        color: Colors.neutral[800],
        fontWeight: Typography.weights.regular,
      },
    }),
    styles: StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
      },
      content: {
        flex: 1,
        backgroundColor: '#FFFFFF',
      },
      hero: {
        paddingBottom: Spacing.md,
      },
      heroGradient: {
        paddingHorizontal: isSmallScreen ? Spacing.md : Spacing.lg,
        paddingVertical: isSmallScreen ? Spacing.lg : Spacing.xl,
      },
      heroContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      heroTextBlock: {
        flex: 1,
      },
      heroTitle: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: Colors.neutral[900],
      },
      heroSubtitle: {
        fontSize: Typography.sizes.base,
        color: Colors.neutral[500],
      },
      heroActions: {
        flexDirection: 'row',
        gap: Spacing.md,
      },
      heroActionButton: {
        padding: Spacing.sm,
        backgroundColor: Colors.neutral[100],
        borderRadius: BorderRadius.md,
      },
      badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: Colors.error[500],
        borderRadius: 10,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
      },
      badgeText: {
        fontSize: 10,
        color: '#FFFFFF',
        fontWeight: 'bold',
      },
      searchContainer: {
        paddingHorizontal: isSmallScreen ? Spacing.md : Spacing.lg,
        paddingVertical: Spacing.md,
        backgroundColor: '#FFFFFF',
      },
      searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.neutral[100],
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.md,
      },
      searchInput: {
        flex: 1,
        fontSize: Typography.sizes.base,
        paddingVertical: Spacing.sm,
        color: Colors.neutral[700],
      },
      testamentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        backgroundColor: '#FFFFFF',
      },
      testamentButton: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.md,
      },
      activeTestamentButton: {
        backgroundColor: Colors.primary[100],
      },
      testamentText: {
        fontSize: Typography.sizes.base,
        color: Colors.neutral[700],
      },
      activeTestamentText: {
        color: Colors.primary[900],
        fontWeight: Typography.weights.medium,
      },
      bookItem: {
        width: isSmallScreen ? '100%' : isLargeScreen ? '33.33%' : '50%',
        paddingHorizontal: Spacing.sm,
        paddingVertical: isSmallScreen ? Spacing.sm : Spacing.xs,
      },
      bookCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.neutral[50],
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        gap: Spacing.sm,
      },
      bookIcon: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
      },
      bookInfo: {
        flex: 1,
      },
      bookName: {
        fontSize: Typography.sizes.base,
        fontWeight: Typography.weights.medium,
        color: Colors.neutral[900],
      },
      bookDetails: {
        fontSize: Typography.sizes.sm,
        color: Colors.neutral[500],
      },
      chapterItem: {
        width: isSmallScreen ? '33.33%' : isLargeScreen ? '20%' : '25%',
        paddingHorizontal: Spacing.sm,
        paddingVertical: isSmallScreen ? Spacing.sm : Spacing.xs,
      },
      chapterCard: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.neutral[50],
        borderRadius: BorderRadius.md,
        paddingVertical: Spacing.md,
      },
      selectedChapterCard: {
        backgroundColor: Colors.primary[100],
      },
      chapterNumber: {
        fontSize: Typography.sizes.base,
        fontWeight: Typography.weights.medium,
        color: Colors.neutral[700],
      },
      selectedChapterNumber: {
        color: Colors.primary[900],
      },
      chapterVerses: {
        fontSize: Typography.sizes.sm,
        color: Colors.neutral[500],
      },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: Spacing.xl,
      },
      loadingText: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.medium,
        color: Colors.neutral[500],
        marginTop: Spacing.md,
      },
      emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: Spacing.xl,
      },
      emptyTitle: {
        fontSize: Typography.sizes.xl,
        fontWeight: Typography.weights.bold,
        color: Colors.neutral[700],
        marginTop: Spacing.md,
      },
      emptySubtitle: {
        fontSize: Typography.sizes.base,
        color: Colors.neutral[500],
        marginTop: Spacing.sm,
        textAlign: 'center',
        paddingHorizontal: Spacing.xl,
      },
      verseContainer: {
        flex: 1,
      },
      versesWrapper: {
        paddingHorizontal: isSmallScreen ? Spacing.md : Spacing.lg,
        paddingVertical: Spacing.md,
      },
      chapterHeader: {
        marginBottom: Spacing.md,
      },
      chapterHeaderGradient: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
      },
      chapterTitle: {
        fontSize: Typography.sizes.lg,
        fontWeight: Typography.weights.bold,
        color: Colors.neutral[900],
      },
      chapterSubtitle: {
        fontSize: Typography.sizes.sm,
        color: Colors.neutral[500],
      },
      mainContent: {
        flex: 1,
      },
      listContainer: {
        padding: Spacing.md,
      },
      chaptersGrid: {
        padding: Spacing.md,
      },
      fallbackTextContainer: {
        padding: Spacing.lg,
      },
      searchResultItem: {
        padding: Spacing.md,
        backgroundColor: Colors.neutral[50],
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.sm,
      },
      searchResultText: {
        fontSize: Typography.sizes.base,
        color: Colors.neutral[800],
        marginBottom: Spacing.xs,
      },
      searchResultReference: {
        fontSize: Typography.sizes.sm,
        color: Colors.neutral[500],
        fontWeight: Typography.weights.medium,
      },
    })
  };
};
