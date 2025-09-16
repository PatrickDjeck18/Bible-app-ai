import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Local storage keys
const STORAGE_KEYS = {
  CACHED_PASSAGES: 'bible_cached_passages',
  BOOKMARKS: 'bible_bookmarks',
  READING_PROGRESS: 'bible_reading_progress',
  RECENT_CHAPTERS: 'bible_recent_chapters',
};

// Local storage helper functions using AsyncStorage
const getFromStorage = async (key: string) => {
  try {
    console.log(`📖 Reading from storage ${key}`);
    const item = await AsyncStorage.getItem(key);
    const result = item ? JSON.parse(item) : null;
    console.log(`📖 Retrieved from storage ${key}:`, result ? result.length + ' items' : 'null');
    return result;
  } catch (error) {
    console.error('❌ Error reading from storage:', error);
    return null;
  }
};

const setToStorage = async (key: string, value: any) => {
  try {
    console.log(`💾 Writing to storage ${key}:`, value.length || 'data');
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log(`✅ Successfully wrote to storage ${key}`);
  } catch (error) {
    console.error('❌ Error writing to storage:', error);
  }
};

const API_BASE_URL = 'https://api.scripture.api.bible/v1';
const API_KEY = '1f8f911243f0c1333ccb4ffffea4efb8';

// Rate limiting configuration
const RATE_LIMIT = {
  requestsPerMinute: 100,
  requestsPerHour: 1000,
  cooldownMs: 1000, // 1 second between requests
};

interface Bible {
  id: string;
  name: string;
  englishName: string;
  shortName: string;
  website: string;
  licenseUrl: string;
  language: string;
  languageName: string;
  languageEnglishName: string;
  textDirection: 'ltr' | 'rtl';
  availableFormats: ('json' | 'usfm')[];
  numberOfBooks: number;
  totalNumberOfChapters: number;
  totalNumberOfVerses: number;
  numberOfApocryphalBooks?: number;
  totalNumberOfApocryphalChapters?: number;
  totalNumberOfApocryphalVerses?: number;
}

interface Book {
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

interface Verse {
  id: string;
  orgId: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  verse: string;
  text: string;
}

interface Passage {
  id: string;
  translationId: string;
  bookId: string;
  chapterNumber: number;
  content: string;
  reference: string;
  verseCount: number;
}

interface SearchResult {
  id: string;
  translationId: string;
  bookId: string;
  chapterNumber: number;
  verseNumber: number;
  text: string;
  reference: string;
}

interface APIError {
  code: string;
  message: string;
  details?: string;
}

export function useBibleAPI() {
  const [bibles, setBibles] = useState<Bible[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<APIChapter[]>([]);
  const [currentPassage, setCurrentPassage] = useState<Passage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [processingBookId, setProcessingBookId] = useState<string | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState({
    remaining: RATE_LIMIT.requestsPerMinute,
    resetTime: Date.now() + 60000,
  });
  
  // New state for enhanced features
  const [bookmarks, setBookmarks] = useState<Array<{
    id: string;
    reference: string;
    content: string;
    timestamp: number;
    bibleId: string;
  }>>([]);
  const [readingProgress, setReadingProgress] = useState<{
    [bookId: string]: {
      lastChapter: number;
      lastVerse: number;
      timestamp: number;
    };
  }>({});
  const [cachedPassages, setCachedPassages] = useState<{
    [passageId: string]: {
      content: string;
      timestamp: number;
      bibleId: string;
    };
  }>({});
  const [recentChapters, setRecentChapters] = useState<Array<{
    bookId: string;
    chapterNumber: number;
    bookName: string;
    timestamp: number;
    bibleId: string;
  }>>([]);

  // Load data from storage on mount
  useEffect(() => {
    const loadStoredData = async () => {
      const storedBookmarks = await getFromStorage(STORAGE_KEYS.BOOKMARKS);
      const storedProgress = await getFromStorage(STORAGE_KEYS.READING_PROGRESS);
      const storedCache = await getFromStorage(STORAGE_KEYS.CACHED_PASSAGES);
      const storedRecent = await getFromStorage(STORAGE_KEYS.RECENT_CHAPTERS);
      if (storedBookmarks) setBookmarks(storedBookmarks);
      if (storedProgress) setReadingProgress(storedProgress);
      if (storedCache) setCachedPassages(storedCache);
      if (storedRecent) setRecentChapters(storedRecent);
    };
    
    loadStoredData();
  }, []);

  // Save data to storage when it changes
  useEffect(() => {
    setToStorage(STORAGE_KEYS.BOOKMARKS, bookmarks);
  }, [bookmarks]);
  
  useEffect(() => {
    setToStorage(STORAGE_KEYS.READING_PROGRESS, readingProgress);
  }, [readingProgress]);
  
  useEffect(() => {
    setToStorage(STORAGE_KEYS.CACHED_PASSAGES, cachedPassages);
  }, [cachedPassages]);
  
  useEffect(() => {
    setToStorage(STORAGE_KEYS.RECENT_CHAPTERS, recentChapters);
  }, [recentChapters]);


  // Clean up old cache periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      clearOldCache();
    }, 24 * 60 * 60 * 1000); // Clean up every 24 hours
    
    return () => clearInterval(cleanupInterval);
  }, []);

  // Monitor chapters state changes
  useEffect(() => {
    console.log('🔄 useBibleAPI: chapters state changed to:', chapters.length, 'chapters');
    if (chapters.length > 0) {
      console.log('📖 First few chapters in state:', chapters.slice(0, 3).map(ch => ({
        id: ch.id,
        chapterNumber: ch.chapterNumber,
        bookId: ch.bookId
      })));
    }
  }, [chapters]);

  // Check online status
  useEffect(() => {
    const checkOnlineStatus = async () => {
      const netInfo = await NetInfo.fetch();
      setIsOnline(netInfo.isConnected || false);
    };

    checkOnlineStatus();
    const unsubscribe = NetInfo.addEventListener((netInfo: any) => {
      setIsOnline(netInfo.isConnected || false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Rate limiting helper
  const checkRateLimit = (): boolean => {
    const now = Date.now();
    if (now > rateLimitInfo.resetTime) {
      setRateLimitInfo({
        remaining: RATE_LIMIT.requestsPerMinute,
        resetTime: now + 60000,
      });
      return true;
    }
    
    if (rateLimitInfo.remaining <= 0) {
      return false;
    }
    
    setRateLimitInfo(prev => ({
      ...prev,
      remaining: prev.remaining - 1,
    }));
    
    return true;
  };

  // Enhanced error handling
  const handleAPIError = (error: any, context: string): APIError => {
    console.error(`API Error in ${context}:`, error);
    
    if (error.status === 429) {
      return {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Rate limit exceeded. Please wait a moment before trying again.',
        details: 'You\'ve made too many requests. Please slow down.'
      };
    }
    
    if (error.status === 401) {
      return {
        code: 'UNAUTHORIZED',
        message: 'API key is invalid or expired.',
        details: 'Please check your API key configuration.'
      };
    }
    
    if (error.status === 403) {
      return {
        code: 'FORBIDDEN',
        message: 'Access denied. Check your API permissions.',
        details: 'Your API key may not have access to this resource.'
      };
    }
    
    if (error.status >= 500) {
      return {
        code: 'SERVER_ERROR',
        message: 'Bible API service is temporarily unavailable.',
        details: 'Please try again later.'
      };
    }
    
    if (!isOnline) {
      return {
        code: 'OFFLINE',
        message: 'You\'re currently offline.',
        details: 'Please check your internet connection and try again.'
      };
    }
    
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred.',
      details: error.message || 'Please try again later.'
    };
  };

  const makeAPIRequest = async (endpoint: string) => {
    try {
      // Check rate limiting
      if (!checkRateLimit()) {
        throw new Error('Rate limit exceeded. Please wait before making another request.');
      }

      // Check online status
      if (!isOnline) {
        throw new Error('You are currently offline. Please check your internet connection.');
      }

      // Add delay to respect rate limiting
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT.cooldownMs));

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'api-key': API_KEY,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorDataResponse = await response.json().catch(() => ({}));
        const apiError = {
          status: response.status,
          statusText: response.statusText,
          ...errorDataResponse,
        };
        throw apiError;
      }
      
            const data = await response.json();
            return data;
          } catch (error) {
      const apiError = handleAPIError(error, endpoint);
      setError(apiError.message);
      throw apiError;
    }
  };

  const fetchBibles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await makeAPIRequest('/bibles');
      setBibles(data.data || []);
    } catch (error) {
      const apiError = error as APIError;
      setError(apiError.message);
      console.error('Error fetching bibles:', apiError);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async (bibleId: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('📚 Fetching books for Bible:', bibleId);
      
      const data = await makeAPIRequest(`/bibles/${bibleId}/books`);
      
      if (data.data && Array.isArray(data.data)) {
        // Merge API books with static list to ensure all canonical books are present
        const { BIBLE_BOOKS } = require('@/constants/BibleBooks');

        // Normalize and exclude apocryphal books when explicitly marked
        const apiBooks: Book[] = (data.data as Book[])
          .filter((book: Book) => book.isApocryphal !== true);

        console.log(`📖 Fetched ${apiBooks.length} non-apocryphal books from API`);

        const apiBooksById = new Map<string, Book>();
        for (const b of apiBooks) {
          apiBooksById.set(b.id, b);
        }

        // Build merged list in canonical order as defined by BIBLE_BOOKS
        const mergedBooks: Book[] = BIBLE_BOOKS.map((staticBook: any, index: number) => {
          const apiBook = apiBooksById.get(staticBook.id);
          if (apiBook) {
            return {
              ...apiBook,
              translationId: bibleId,
              // Ensure order falls back to canonical ordering if missing
              order: typeof apiBook.order === 'number' ? apiBook.order : staticBook.order ?? index + 1,
              // Ensure numberOfChapters populated
              numberOfChapters: apiBook.numberOfChapters || staticBook.chapters,
              isApocryphal: false,
            } as Book;
          }
          // Fallback for any book missing from API
          return {
            id: staticBook.id,
            translationId: bibleId,
            name: staticBook.name,
            commonName: staticBook.name,
            title: staticBook.name,
            order: staticBook.order ?? index + 1,
            numberOfChapters: staticBook.chapters,
            firstChapterApiLink: '',
            lastChapterApiLink: '',
            totalNumberOfVerses: 0,
            isApocryphal: false,
          } as Book;
        });

        // Final sort by canonical order to be safe
        mergedBooks.sort((a, b) => (a.order || 0) - (b.order || 0));

        setBooks(mergedBooks);
        console.log(`✅ Set ${mergedBooks.length} merged books in state`);
      } else {
        console.warn('⚠️ No books data received from API');
        setBooks([]);
      }
    } catch (error) {
      const apiError = error as APIError;
      setError(apiError.message);
      console.error('❌ Error fetching books:', apiError);
      
      // Fallback to static book list if API fails
      console.log('📚 Using fallback static book list');
      const fallbackBooks = createStaticBookList(bibleId);
      setBooks(fallbackBooks);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to create a static book list as fallback
  const createStaticBookList = (bibleId: string): Book[] => {
    // Import the static book list from constants
    const { BIBLE_BOOKS } = require('@/constants/BibleBooks');
    
    return BIBLE_BOOKS.map((book: any, index: number) => ({
      id: book.id,
      translationId: bibleId,
      name: book.name,
      commonName: book.name,
      title: book.name,
      order: index + 1,
      numberOfChapters: book.chapters,
      firstChapterApiLink: '',
      lastChapterApiLink: '',
      totalNumberOfVerses: 0,
      isApocryphal: false
    }));
  };

  const fetchChapters = async (bibleId: string, bookId: string) => {
    // Prevent duplicate calls for the same book
    if (processingBookId === bookId) {
      console.log('🔄 Already processing chapters for book:', bookId, 'skipping duplicate call');
      return;
    }
    
    try {
      console.log('🔍 fetchChapters called with:', { bibleId, bookId });
      setProcessingBookId(bookId);
      setLoading(true);
      setError(null);
      
      // Clear existing chapters to prevent duplication
      setChapters([]);
      
      // First try to get chapters from the API
      try {
        const chaptersData = await makeAPIRequest(`/bibles/${bibleId}/books/${bookId}/chapters`);
        if (chaptersData.data && chaptersData.data.length > 0) {
          console.log('📚 API chapters found:', chaptersData.data.length);
          console.log('📚 First API chapter structure:', chaptersData.data[0]);
          
          // Map API chapters to ensure they have the correct structure
          const mappedChapters: APIChapter[] = chaptersData.data.map((chapter: any, index: number) => {
            // Extract chapter number from various possible sources
            let chapterNumber = chapter.chapterNumber;
            
            // If chapterNumber is not available, try to extract it from the id or other fields
            if (!chapterNumber || isNaN(chapterNumber)) {
              // Try to extract from id (e.g., "GEN.1" -> 1)
              if (chapter.id && typeof chapter.id === 'string') {
                const match = chapter.id.match(/\.(\d+)$/);
                if (match) {
                  chapterNumber = parseInt(match[1]);
                }
              }
              
              // If still no chapter number, use the index + 1 as fallback
              if (!chapterNumber || isNaN(chapterNumber)) {
                chapterNumber = index + 1;
                console.warn('⚠️ Using index as fallback for chapter number:', { index, chapterNumber, chapterId: chapter.id });
              }
            }
            
            return {
              id: chapter.id || `${bookId}-${chapterNumber}`,
              translationId: bibleId,
              bookId: bookId,
              chapterNumber: chapterNumber,
              numberOfVerses: chapter.numberOfVerses || 0,
              verses: chapter.verses || []
            };
          });
          
          // Validate that all chapters have valid chapter numbers
          const validChapters = mappedChapters.filter(chapter => 
            chapter.chapterNumber && typeof chapter.chapterNumber === 'number' && !isNaN(chapter.chapterNumber)
          );
          
          // Remove duplicate chapters by chapter number
          const uniqueChapters = validChapters.filter((chapter, index, self) => 
            index === self.findIndex(c => c.chapterNumber === chapter.chapterNumber)
          );
          
          console.log('📚 API chapters found:', chaptersData.data.length);
          console.log('📚 Valid chapters:', validChapters.length);
          console.log('📚 Unique chapters after deduplication:', uniqueChapters.length);
          
          if (uniqueChapters.length > 0) {
            console.log('📚 All API chapters have valid chapter numbers');
            console.log('📚 Mapped API chapters:', uniqueChapters.slice(0, 3));
            setChapters(uniqueChapters);
            return;
          } else {
            console.warn('⚠️ No valid unique chapters found, falling back to static data');
          }
        }
      } catch (apiError) {
        console.log('⚠️ API chapters not available, falling back to static data');
      }
      
      // Fallback: Get the book to find out how many chapters it has
      const bookData = await makeAPIRequest(`/bibles/${bibleId}/books`);
      const book = bookData.data?.find((b: Book) => b.id === bookId);
      
      if (!book) {
        throw new Error('Book not found');
      }
      
      console.log('📖 Found book:', book.name, 'with', book.numberOfChapters, 'chapters');
      

      
      // Create chapter objects for all chapters in the book
      const chapterList: APIChapter[] = [];
      for (let i = 1; i <= book.numberOfChapters; i++) {
        chapterList.push({
          id: `${bookId}-${i}`,
          translationId: bibleId,
          bookId: bookId,
          chapterNumber: i,
          numberOfVerses: 0, // Will be updated when fetching actual chapter
          verses: []
        });
      }
      
      // Ensure no duplicates (shouldn't happen with this loop, but just to be safe)
      const uniqueChapterList = chapterList.filter((chapter, index, self) => 
        index === self.findIndex(c => c.chapterNumber === chapter.chapterNumber)
      );
      
      console.log('📚 Created', chapterList.length, 'chapter objects');
      console.log('📚 Unique chapters after deduplication:', uniqueChapterList.length);
      console.log('📚 First few chapters:', uniqueChapterList.slice(0, 3));
      
      setChapters(uniqueChapterList);
      console.log('✅ setChapters called with', uniqueChapterList.length, 'chapters');
    } catch (error) {
      const apiError = error as APIError;
      setError(apiError.message);
      console.error('Error fetching chapters:', apiError);
    } finally {
      setLoading(false);
      setProcessingBookId(null);
    }
  };

  // New function to create static chapters from BibleBooks data
  const createStaticChapters = (bookId: string, bibleId: string) => {
    try {
      // Import BibleBooks dynamically to avoid circular dependencies
      const { BIBLE_BOOKS } = require('../constants/BibleBooks');
      const staticBook = BIBLE_BOOKS.find((b: any) => b.id === bookId);
      
      if (!staticBook) {
        console.error('❌ Static book not found:', bookId);
        return;
      }
      
      console.log('📖 Creating static chapters for', staticBook.name, 'with', staticBook.chapters, 'chapters');
      
      const chapterList: APIChapter[] = [];
      for (let i = 1; i <= staticBook.chapters; i++) {
        chapterList.push({
          id: `${bookId}-${i}`,
          translationId: bibleId,
          bookId: bookId,
          chapterNumber: i,
          numberOfVerses: 0,
          verses: []
        });
      }
      
      console.log('📚 Created', chapterList.length, 'static chapter objects');
      console.log('📚 First few static chapters:', chapterList.slice(0, 3));
      
      setChapters(chapterList);
      console.log('✅ setChapters called with', chapterList.length, 'static chapters');
    } catch (error) {
      console.error('Error creating static chapters:', error);
    }
  };

  const fetchPassage = async (bibleId: string, passageId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 fetchPassage called with:', { bibleId, passageId });
      
      // Parse passageId to get book, chapter info
      const [bookId, chapterNumber] = passageId.split('-');
      console.log('📖 Parsed passageId:', { bookId, chapterNumber, original: passageId });
      
      if (!bookId || !chapterNumber) {
        throw new Error('Invalid passage ID format');
      }
      
      // Validate chapter number
      const chapterNum = parseInt(chapterNumber);
      if (isNaN(chapterNum) || chapterNum <= 0) {
        console.error('❌ Invalid chapter number:', { chapterNumber, parsed: chapterNum, isNaN: isNaN(chapterNum) });
        throw new Error(`Invalid chapter number: ${chapterNumber}`);
      }
      
      console.log('✅ Validated chapter number:', chapterNum);
      
      // Check cache first
      const cacheKey = `${bibleId}-${passageId}`;
      const cachedPassage = cachedPassages[cacheKey];
      const now = Date.now();
      
      // Use cached passage if it's less than 24 hours old
      if (cachedPassage && (now - cachedPassage.timestamp) < 24 * 60 * 60 * 1000) {
        console.log('📖 Using cached passage:', passageId);
        const passage: Passage = {
          id: passageId,
          translationId: bibleId,
          bookId: bookId,
          chapterNumber: chapterNum,
          content: cachedPassage.content,
          reference: `${bookId} ${chapterNum}`,
          verseCount: 0
        };
        setCurrentPassage(passage);
        
        // Update reading progress
        updateReadingProgress(bookId, chapterNum, 1);
        
        // Add to recent chapters
        addToRecentChapters(bookId, chapterNum, bookId, bibleId);
        
        return;
      }
      
      // Fetch from API
      console.log('🌐 Making API request for:', `${bookId}.${chapterNum}`);
      const data = await makeAPIRequest(`/bibles/${bibleId}/passages/${bookId}.${chapterNum}`);
      
      // Transform the data to match our Passage interface
      const passage: Passage = {
        id: passageId,
        translationId: bibleId,
        bookId: bookId,
        chapterNumber: chapterNum,
        content: data.data?.content || '',
        reference: data.data?.reference || `${bookId} ${chapterNum}`,
        verseCount: data.data?.verseCount || 0
      };
      
      setCurrentPassage(passage);
      
      // Cache the passage
      const newCache = {
        ...cachedPassages,
        [cacheKey]: {
          content: passage.content,
          timestamp: now,
          bibleId: bibleId
        }
      };
      setCachedPassages(newCache);
      
      // Update reading progress
      updateReadingProgress(bookId, chapterNum, 1);
      
      // Add to recent chapters
      addToRecentChapters(bookId, chapterNum, bookId, bibleId);
      
    } catch (error) {
      const apiError = error as APIError;
      setError(apiError.message);
      console.error('Error fetching passage:', apiError);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to update reading progress
  const updateReadingProgress = (bookId: string, chapter: number, verse: number) => {
    setReadingProgress(prev => ({
      ...prev,
      [bookId]: {
        lastChapter: chapter,
        lastVerse: verse,
        timestamp: Date.now()
      }
    }));
  };

  // Helper function to add to recent chapters
  const addToRecentChapters = (bookId: string, chapterNumber: number, bookName: string, bibleId: string) => {
    const newRecent = [
      {
        bookId,
        chapterNumber,
        bookName,
        timestamp: Date.now(),
        bibleId
      },
      ...recentChapters.filter(rc => 
        !(rc.bookId === bookId && rc.chapterNumber === chapterNumber)
      )
    ].slice(0, 10); // Keep only last 10 chapters
    
    setRecentChapters(newRecent);
  };

  // Bookmark management functions
  const addBookmark = (reference: string, content: string, bibleId: string) => {
    const newBookmark = {
      id: `${reference}-${Date.now()}`,
      reference,
      content: content.substring(0, 200) + (content.length > 200 ? '...' : ''), // Truncate long content
      timestamp: Date.now(),
      bibleId
    };
    
    setBookmarks(prev => [newBookmark, ...prev]);
    return newBookmark;
  };

  const removeBookmark = (bookmarkId: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
  };

  const isBookmarked = (reference: string) => {
    return bookmarks.some(b => b.reference === reference);
  };

  const toggleBookmark = (reference: string, content: string, bibleId: string) => {
    if (isBookmarked(reference)) {
      removeBookmark(bookmarks.find(b => b.reference === reference)?.id || '');
    } else {
      addBookmark(reference, content, bibleId);
    }
  };


  // Get reading progress for a specific book
  const getReadingProgress = (bookId: string) => {
    return readingProgress[bookId] || null;
  };

  // Get overall reading progress across all books
  const getOverallReadingProgress = () => {
    const bookIds = Object.keys(readingProgress);
    if (bookIds.length === 0) {
      return {
        completedChapters: 0,
        totalChapters: 0,
        percentage: 0
      };
    }

    let totalCompletedChapters = 0;
    let totalChapters = 0;

    // Calculate total chapters from all books (using static Bible data)
    const { BIBLE_BOOKS } = require('../constants/BibleBooks');
    
    bookIds.forEach(bookId => {
      const book = BIBLE_BOOKS.find((b: any) => b.id === bookId);
      if (book) {
        totalChapters += book.chapters;
        const progress = readingProgress[bookId];
        if (progress) {
          totalCompletedChapters += progress.lastChapter;
        }
      }
    });

    return {
      completedChapters: totalCompletedChapters,
      totalChapters: totalChapters,
      percentage: totalChapters > 0 ? Math.round((totalCompletedChapters / totalChapters) * 100) : 0
    };
  };

  // Get recent chapters for quick access
  const getRecentChapters = () => {
    return recentChapters.sort((a, b) => b.timestamp - a.timestamp);
  };

  // Clear cache for old passages (older than 7 days)
  const clearOldCache = async () => {
    const now = Date.now();
    const sevenDaysAgo = 7 * 24 * 60 * 60 * 1000;
    
    const newCache = Object.fromEntries(
      Object.entries(cachedPassages).filter(([_, passage]) => 
        (now - passage.timestamp) < sevenDaysAgo
      )
    );
    
    setCachedPassages(newCache);
  };

  const searchVerses = async (bibleId: string, query: string, limit: number = 20, filters?: {
    bookIds?: string[];
    chapterRange?: { start: number; end: number };
    verseRange?: { start: number; end: number };
  }): Promise<SearchResult[]> => {
    try {
      setLoading(true);
      setError(null);
      
      // Build search query with filters
      let searchEndpoint = `/bibles/${bibleId}/search?query=${encodeURIComponent(query)}&limit=${limit}`;
      
      if (filters?.bookIds && filters.bookIds.length > 0) {
        searchEndpoint += `&bookIds=${filters.bookIds.join(',')}`;
      }
      
      // Use API.Bible search endpoint
      const searchData = await makeAPIRequest(searchEndpoint);
      const results: SearchResult[] = [];
      
      if (searchData.data && searchData.data.verses) {
        for (const verse of searchData.data.verses) {
          // Apply additional filters if specified
          if (filters?.chapterRange) {
            const chapterNum = parseInt(verse.reference.split(' ')[1].split(':')[0]);
            if (chapterNum < filters.chapterRange.start || chapterNum > filters.chapterRange.end) {
              continue;
            }
          }
          
          if (filters?.verseRange) {
            const verseNum = parseInt(verse.reference.split(' ')[1].split(':')[1]);
            if (verseNum < filters.verseRange.start || verseNum > filters.verseRange.end) {
              continue;
            }
          }
          
          results.push({
            id: verse.id,
            translationId: bibleId,
            bookId: verse.reference.split(' ')[0],
            chapterNumber: parseInt(verse.reference.split(' ')[1].split(':')[0]),
            verseNumber: parseInt(verse.reference.split(' ')[1].split(':')[1]),
            text: verse.text,
            reference: verse.reference
          });
        }
      }
      
      return results;
    } catch (error) {
      const apiError = error as APIError;
      setError(apiError.message);
      console.error('Error searching verses:', apiError);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchVerse = async (bibleId: string, verseId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Parse verseId to get book, chapter, verse info
      const [bookId, chapterNumber, verseNumber] = verseId.split('-');
      if (!bookId || !chapterNumber || !verseNumber) {
        throw new Error('Invalid verse ID format');
      }
      
      const data = await makeAPIRequest(`/bibles/${bibleId}/verses/${bookId}.${chapterNumber}.${verseNumber}`);
      
      if (!data.data) {
        throw new Error('Verse not found');
      }
      
      return {
        id: verseId,
        translationId: bibleId,
        bookId: bookId,
        chapterNumber: parseInt(chapterNumber),
        verseNumber: parseInt(verseNumber),
        text: data.data.text
      };
    } catch (error) {
      const apiError = error as APIError;
      setError(apiError.message);
      console.error('Error fetching verse:', apiError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchVerseOfTheDay = async (): Promise<{reference: string, text: string}> => {
    try {
      // Get today's date to ensure verse changes daily
      const today = new Date();
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      
      console.log('📅 Verse of the day calculation:', {
        today: today.toISOString().split('T')[0],
        dayOfYear,
        year: today.getFullYear()
      });
      
      // Fallback verses for each book if API fails
      const fallbackVerses = [
        { reference: 'Genesis 1:1', text: 'In the beginning God created the heavens and the earth.' },
        { reference: 'Psalm 23:1', text: 'The Lord is my shepherd, I shall not want.' },
        { reference: 'Matthew 5:3', text: 'Blessed are the poor in spirit, for theirs is the kingdom of heaven.' },
        { reference: 'John 3:16', text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' },
        { reference: 'Romans 8:28', text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.' },
        { reference: 'Philippians 4:13', text: 'I can do all things through Christ who strengthens me.' },
        { reference: 'James 1:5', text: 'If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.' },
        { reference: '1 Peter 3:15', text: 'But in your hearts revere Christ as Lord. Always be prepared to give an answer to everyone who asks you to give the reason for the hope that you have.' },
        { reference: '1 John 4:19', text: 'We love because he first loved us.' },
        { reference: 'Revelation 21:4', text: 'He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain, for the old order of things has passed away.' },
        { reference: 'Isaiah 40:31', text: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.' },
        { reference: 'Jeremiah 29:11', text: 'For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future.' },
        { reference: 'Proverbs 3:5', text: 'Trust in the Lord with all your heart and lean not on your own understanding.' },
        { reference: 'Joshua 1:9', text: 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.' },
        { reference: 'Psalm 46:10', text: 'Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.' },
        { reference: 'Matthew 11:28', text: 'Come to me, all you who are weary and burdened, and I will give you rest.' },
        { reference: 'Romans 12:2', text: 'Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God\'s will is—his good, pleasing and perfect will.' },
        { reference: 'Ephesians 2:8', text: 'For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God.' },
        { reference: '2 Timothy 1:7', text: 'For God has not given us a spirit of fear, but of power and of love and of a sound mind.' },
        { reference: 'Hebrews 11:1', text: 'Now faith is confidence in what we hope for and assurance about what we do not see.' },
        { reference: '1 Corinthians 13:4', text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.' },
        { reference: 'Galatians 5:22', text: 'But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness.' },
        { reference: 'Colossians 3:23', text: 'Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.' },
        { reference: '1 Thessalonians 5:16', text: 'Rejoice always, pray continually, give thanks in all circumstances; for this is God\'s will for you in Christ Jesus.' },
        { reference: 'Deuteronomy 6:5', text: 'Love the Lord your God with all your heart and with all your soul and with all your strength.' },
        { reference: 'Psalm 119:105', text: 'Your word is a lamp for my feet, a light on my path.' },
        { reference: 'Matthew 6:33', text: 'But seek first his kingdom and his righteousness, and all these things will be given to you as well.' },
        { reference: 'John 14:6', text: 'Jesus answered, "I am the way and the truth and the life. No one comes to the Father except through me."' },
        { reference: 'Acts 1:8', text: 'But you will receive power when the Holy Spirit comes on you; and you will be my witnesses in Jerusalem, and in all Judea and Samaria, and to the ends of the earth.' },
        { reference: '2 Corinthians 5:17', text: 'Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!' }
      ];
      
      // Use day of year to select a different verse each day
      const verseIndex = dayOfYear % fallbackVerses.length;
      const selectedVerse = fallbackVerses[verseIndex];
      
      console.log('📖 Selected verse for day', dayOfYear, ':', selectedVerse);
      return selectedVerse;
      
      /*
      // This section is commented out to avoid API errors
      // Fallback verses for each book if API fails
      const fallbackVersesByBook = {
        'GEN': { reference: 'Genesis 1:1', text: 'In the beginning God created the heavens and the earth.' },
        'PSA': { reference: 'Psalm 23:1', text: 'The Lord is my shepherd, I shall not want.' },
        'MAT': { reference: 'Matthew 5:3', text: 'Blessed are the poor in spirit, for theirs is the kingdom of heaven.' },
        'JOH': { reference: 'John 3:16', text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' },
        'ROM': { reference: 'Romans 8:28', text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.' },
        'PHI': { reference: 'Philippians 4:13', text: 'I can do all things through Christ who strengthens me.' },
        'JAM': { reference: 'James 1:5', text: 'If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.' },
        '1PE': { reference: '1 Peter 3:15', text: 'But in your hearts revere Christ as Lord. Always be prepared to give an answer to everyone who asks you to give the reason for the hope that you have.' },
        '1JO': { reference: '1 John 4:19', text: 'We love because he first loved us.' },
        'REV': { reference: 'Revelation 21:4', text: 'He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain, for the old order of things has passed away.' },
        'ISA': { reference: 'Isaiah 40:31', text: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.' },
        'JER': { reference: 'Jeremiah 29:11', text: 'For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future.' },
        'EZE': { reference: 'Ezekiel 37:5', text: 'This is what the Sovereign Lord says to these bones: I will make breath enter you, and you will come to life.' },
        'DAN': { reference: 'Daniel 12:3', text: 'Those who are wise will shine like the brightness of the heavens, and those who lead many to righteousness, like the stars for ever and ever.' },
        'HOS': { reference: 'Hosea 6:6', text: 'For I desire mercy, not sacrifice, and acknowledgment of God rather than burnt offerings.' },
        'MIC': { reference: 'Micah 6:8', text: 'He has shown you, O mortal, what is good. And what does the Lord require of you? To act justly and to love mercy and to walk humbly with your God.' },
        'ZEC': { reference: 'Zechariah 4:6', text: 'So he said to me, "This is the word of the Lord to Zerubbabel: Not by might nor by power, but by my Spirit," says the Lord Almighty.' },
        'MAL': { reference: 'Malachi 3:10', text: 'Bring the whole tithe into the storehouse, that there may be food in my house. Test me in this," says the Lord Almighty, "and see if I will not throw open the floodgates of heaven and pour out so much blessing that there will not be room enough to store it.' },
        '2TI': { reference: '2 Timothy 1:7', text: 'For God has not given us a spirit of fear, but of power and of love and of a sound mind.' },
        'HEB': { reference: 'Hebrews 11:1', text: 'Now faith is confidence in what we hope for and assurance about what we do not see.' },
        'TIT': { reference: 'Titus 2:11', text: 'For the grace of God has appeared that offers salvation to all people.' },
        '1TH': { reference: '1 Thessalonians 5:16', text: 'Rejoice always, pray continually, give thanks in all circumstances; for this is God\'s will for you in Christ Jesus.' },
        '2TH': { reference: '2 Thessalonians 3:3', text: 'But the Lord is faithful, and he will strengthen you and protect you from the evil one.' },
        '1CO': { reference: '1 Corinthians 13:4', text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.' },
        '2CO': { reference: '2 Corinthians 4:18', text: 'So we fix our eyes not on what is seen, but on what is unseen, since what is seen is temporary, but what is unseen is eternal.' },
        'GAL': { reference: 'Galatians 5:22', text: 'But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness.' },
        'EPH': { reference: 'Ephesians 6:10', text: 'Finally, be strong in the Lord and in his mighty power.' },
        'COL': { reference: 'Colossians 3:23', text: 'Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.' },
        '1TI': { reference: '1 Timothy 6:12', text: 'Fight the good fight of the faith. Take hold of the eternal life to which you were called when you made your good confession in the presence of many witnesses.' },
        '2PE': { reference: '2 Peter 1:3', text: 'His divine power has given us everything we need for a godly life through our knowledge of him who called us by his own glory and goodness.' },
        '2JO': { reference: '2 John 1:6', text: 'And this is love: that we walk in obedience to his commands. As you have heard from the beginning, his command is that you walk in love.' },
        '3JO': { reference: '3 John 1:4', text: 'I have no greater joy than to hear that my children are walking in the truth.' },
        'JUD': { reference: 'Jude 1:24', text: 'To him who is able to keep you from stumbling and to present you before his glorious presence without fault and with great joy.' },
        'EXO': { reference: 'Exodus 20:3', text: 'You shall have no other gods before me.' },
        'LEV': { reference: 'Leviticus 19:18', text: 'Do not seek revenge or bear a grudge against anyone among your people, but love your neighbor as yourself. I am the Lord.' },
        'NUM': { reference: 'Numbers 6:24', text: 'The Lord bless you and keep you.' },
        'DEU': { reference: 'Deuteronomy 6:5', text: 'Love the Lord your God with all your heart and with all your soul and with all your strength.' },
        'JOS': { reference: 'Joshua 1:9', text: 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.' },
        'RUT': { reference: 'Ruth 1:16', text: 'But Ruth replied, "Don\'t urge me to leave you or to turn back from you. Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God.' },
        '1SA': { reference: '1 Samuel 16:7', text: 'But the Lord said to Samuel, "Do not consider his appearance or his height, for I have rejected him. The Lord does not look at the things people look at. People look at the outward appearance, but the Lord looks at the heart.' },
        '2SA': { reference: '2 Samuel 22:2', text: 'He said: "The Lord is my rock, my fortress and my deliverer.' },
        '1KI': { reference: '1 Kings 8:27', text: 'But will God really dwell on earth? The heavens, even the highest heaven, cannot contain you. How much less this temple I have built!' },
        '2KI': { reference: '2 Kings 6:16', text: 'Don\'t be afraid," the prophet answered. "Those who are with us are more than those who are with them.' },
        '1CH': { reference: '1 Chronicles 16:8', text: 'Give praise to the Lord, proclaim his name; make known among the nations what he has done.' },
        '2CH': { reference: '2 Chronicles 7:14', text: 'If my people, who are called by my name, will humble themselves and pray and seek my face and turn from their wicked ways, then I will hear from heaven, and I will forgive their sin and will heal their land.' },
        'EZR': { reference: 'Ezra 3:11', text: 'With praise and thanksgiving they sang to the Lord: "He is good; his love toward Israel endures forever."' },
        'NEH': { reference: 'Nehemiah 8:10', text: 'Nehemiah said, "Go and enjoy choice food and sweet drinks, and send some to those who have nothing prepared. This day is holy to our Lord. Do not grieve, for the joy of the Lord is your strength.' },
        'EST': { reference: 'Esther 4:14', text: 'For if you remain silent at this time, relief and deliverance for the Jews will arise from another place, but you and your father\'s family will perish. And who knows but that you have come to your royal position for such a time as this?' },
        'JOB': { reference: 'Job 1:21', text: 'Naked I came from my mother\'s womb, and naked I will depart. The Lord gave and the Lord has taken away; may the name of the Lord be praised.' },
        'PRO': { reference: 'Proverbs 3:5', text: 'Trust in the Lord with all your heart and lean not on your own understanding.' },
        'ECC': { reference: 'Ecclesiastes 3:1', text: 'There is a time for everything, and a season for every activity under the heavens.' },
        'SON': { reference: 'Song of Songs 2:4', text: 'He has taken me to the banquet hall, and his banner over me is love.' },
        'LAM': { reference: 'Lamentations 3:23', text: 'Great is his faithfulness; his mercies begin afresh each morning.' },
        'NAH': { reference: 'Nahum 1:7', text: 'The Lord is good, a refuge in times of trouble. He cares for those who trust in him.' },
        'HAB': { reference: 'Habakkuk 2:4', text: 'See, the enemy is puffed up; his desires are not upright—but the righteous person will live by his faithfulness.' },
        'ZEP': { reference: 'Zephaniah 3:17', text: 'The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing.' },
        'HAG': { reference: 'Hagai 2:9', text: 'The glory of this present house will be greater than the glory of the former house," says the Lord Almighty. "And in this place I will grant peace," declares the Lord Almighty.' },
        'MAR': { reference: 'Mark 10:27', text: 'Jesus looked at them and said, "With man this is impossible, but not with God; all things are possible with God.' },
        'LUK': { reference: 'Luke 6:31', text: 'Do to others as you would have them do to you.' },
        'ACT': { reference: 'Acts 1:8', text: 'But you will receive power when the Holy Spirit comes on you; and you will be my witnesses in Jerusalem, and in all Judea and Samaria, and to the ends of the earth.' },
        'GAL': { reference: 'Galatians 6:9', text: 'Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.' },
        'EPH': { reference: 'Ephesians 1:3', text: 'Praise be to the God and Father of our Lord Jesus Christ, who has blessed us in the heavenly realms with every spiritual blessing in Christ.' },
        'PHI': { reference: 'Philippians 1:6', text: 'Being confident of this, that he who began a good work in you will carry it on to completion until the day of Christ Jesus.' },
        'COL': { reference: 'Colossians 1:15', text: 'The Son is the image of the invisible God, the firstborn over all creation.' },
        '1TH': { reference: '1 Thessalonians 1:3', text: 'We remember before our God and Father your work produced by faith, your labor prompted by love, and your endurance inspired by hope in our Lord Jesus Christ.' },
        '2TI': { reference: '2 Timothy 2:15', text: 'Do your best to present yourself to God as one approved, a worker who does not need to be ashamed and who correctly handles the word of truth.' },
        'TIT': { reference: 'Titus 1:2', text: 'In the hope of eternal life, which God, who does not lie, promised before the beginning of time.' },
        'PHM': { reference: 'Philemon 1:6', text: 'I pray that your partnership with us in the faith may be effective in deepening your understanding of every good thing we share for the sake of Christ.' },
        'HEB': { reference: 'Hebrews 1:1', text: 'In the past God spoke to our ancestors through the prophets at many times and in various ways.' },
        'JAM': { reference: 'James 1:2', text: 'Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds.' },
        '1PE': { reference: '1 Peter 1:3', text: 'Praise be to the God and Father of our Lord Jesus Christ! In his great mercy he has given us new birth into a living hope through the resurrection of Jesus Christ from the dead.' },
        '2PE': { reference: '2 Peter 2:9', text: 'If this is so, then the Lord knows how to rescue the godly from trials and to hold the unrighteous for punishment on the day of judgment.' },
        '1JO': { reference: '1 John 1:9', text: 'If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.' }
      };
      */
    } catch (error) {
      console.error('❌ Error in fetchVerseOfTheDay:', error);
      const errorFallback = {
        reference: 'Psalm 23:1',
        text: 'The Lord is my shepherd, I shall not want.'
      };
      console.log('🔄 Using error fallback verse:', errorFallback);
      return errorFallback;
    }
  };

  // New function: Compare passages across multiple translations
  const comparePassages = async (passageReference: string, bibleIds: string[]): Promise<{
    reference: string;
    translations: { bibleId: string; bibleName: string; content: string }[];
  }> => {
    try {
      setLoading(true);
      setError(null);
      
      const results = await Promise.all(
        bibleIds.map(async (bibleId) => {
          try {
            const data = await makeAPIRequest(`/bibles/${bibleId}/passages/${passageReference}`);
            const bible = bibles.find(b => b.id === bibleId);
            return {
              bibleId,
              bibleName: bible?.name || 'Unknown Translation',
              content: data.data?.content || 'Content not available'
            };
          } catch (error) {
            return {
              bibleId,
              bibleName: 'Unknown Translation',
              content: 'Failed to load content'
            };
          }
        })
      );
      
      return {
        reference: passageReference,
        translations: results
      };
    } catch (error) {
      const apiError = error as APIError;
      setError(apiError.message);
      console.error('Error comparing passages:', apiError);
      return { reference: passageReference, translations: [] };
    } finally {
      setLoading(false);
    }
  };

  // New function: Get Bible statistics
  const getBibleStats = async (bibleId: string) => {
    try {
      const data = await makeAPIRequest(`/bibles/${bibleId}`);
      return {
        totalBooks: data.data?.numberOfBooks || 0,
        totalChapters: data.data?.totalNumberOfChapters || 0,
        totalVerses: data.data?.totalNumberOfVerses || 0,
        language: data.data?.languageName || 'Unknown',
        textDirection: data.data?.textDirection || 'ltr'
      };
    } catch (error) {
      const apiError = error as APIError;
      setError(apiError.message);
      return null;
    }
  };

  return {
    bibles,
    books,
    chapters,
    currentPassage,
    loading,
    error,
    isOnline,
    rateLimitInfo,
    fetchBibles,
    fetchBooks,
    fetchChapters,
    fetchPassage,
    searchVerses,
    fetchVerse,
    fetchVerseOfTheDay,
    comparePassages,
    getBibleStats,
    clearError: () => setError(null),
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark,
    getReadingProgress,
    getOverallReadingProgress,
    getRecentChapters,
    clearOldCache
  };
}