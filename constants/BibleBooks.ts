// Complete Bible Books in Order - Old Testament and New Testament

export interface BibleBookInfo {
  id: string;
  name: string;
  abbreviation: string;
  chapters: number;
  testament: 'old' | 'new';
  category: string;
  order: number;
}

export const BIBLE_BOOKS: BibleBookInfo[] = [
  // OLD TESTAMENT
  // Law (Torah/Pentateuch)
  { id: 'GEN', name: 'Genesis', abbreviation: 'Gen', chapters: 50, testament: 'old', category: 'Law', order: 1 },
  { id: 'EXO', name: 'Exodus', abbreviation: 'Exo', chapters: 40, testament: 'old', category: 'Law', order: 2 },
  { id: 'LEV', name: 'Leviticus', abbreviation: 'Lev', chapters: 27, testament: 'old', category: 'Law', order: 3 },
  { id: 'NUM', name: 'Numbers', abbreviation: 'Num', chapters: 36, testament: 'old', category: 'Law', order: 4 },
  { id: 'DEU', name: 'Deuteronomy', abbreviation: 'Deu', chapters: 34, testament: 'old', category: 'Law', order: 5 },

  // Historical Books
  { id: 'JOS', name: 'Joshua', abbreviation: 'Jos', chapters: 24, testament: 'old', category: 'History', order: 6 },
  { id: 'JDG', name: 'Judges', abbreviation: 'Jdg', chapters: 21, testament: 'old', category: 'History', order: 7 },
  { id: 'RUT', name: 'Ruth', abbreviation: 'Rut', chapters: 4, testament: 'old', category: 'History', order: 8 },
  { id: '1SA', name: '1 Samuel', abbreviation: '1Sa', chapters: 31, testament: 'old', category: 'History', order: 9 },
  { id: '2SA', name: '2 Samuel', abbreviation: '2Sa', chapters: 24, testament: 'old', category: 'History', order: 10 },
  { id: '1KI', name: '1 Kings', abbreviation: '1Ki', chapters: 22, testament: 'old', category: 'History', order: 11 },
  { id: '2KI', name: '2 Kings', abbreviation: '2Ki', chapters: 25, testament: 'old', category: 'History', order: 12 },
  { id: '1CH', name: '1 Chronicles', abbreviation: '1Ch', chapters: 29, testament: 'old', category: 'History', order: 13 },
  { id: '2CH', name: '2 Chronicles', abbreviation: '2Ch', chapters: 36, testament: 'old', category: 'History', order: 14 },
  { id: 'EZR', name: 'Ezra', abbreviation: 'Ezr', chapters: 10, testament: 'old', category: 'History', order: 15 },
  { id: 'NEH', name: 'Nehemiah', abbreviation: 'Neh', chapters: 13, testament: 'old', category: 'History', order: 16 },
  { id: 'EST', name: 'Esther', abbreviation: 'Est', chapters: 10, testament: 'old', category: 'History', order: 17 },

  // Wisdom/Poetry Books
  { id: 'JOB', name: 'Job', abbreviation: 'Job', chapters: 42, testament: 'old', category: 'Wisdom', order: 18 },
  { id: 'PSA', name: 'Psalms', abbreviation: 'Psa', chapters: 150, testament: 'old', category: 'Wisdom', order: 19 },
  { id: 'PRO', name: 'Proverbs', abbreviation: 'Pro', chapters: 31, testament: 'old', category: 'Wisdom', order: 20 },
  { id: 'ECC', name: 'Ecclesiastes', abbreviation: 'Ecc', chapters: 12, testament: 'old', category: 'Wisdom', order: 21 },
  { id: 'SNG', name: 'Song of Songs', abbreviation: 'Sng', chapters: 8, testament: 'old', category: 'Wisdom', order: 22 },

  // Major Prophets
  { id: 'ISA', name: 'Isaiah', abbreviation: 'Isa', chapters: 66, testament: 'old', category: 'Major Prophets', order: 23 },
  { id: 'JER', name: 'Jeremiah', abbreviation: 'Jer', chapters: 52, testament: 'old', category: 'Major Prophets', order: 24 },
  { id: 'LAM', name: 'Lamentations', abbreviation: 'Lam', chapters: 5, testament: 'old', category: 'Major Prophets', order: 25 },
  { id: 'EZK', name: 'Ezekiel', abbreviation: 'Ezk', chapters: 48, testament: 'old', category: 'Major Prophets', order: 26 },
  { id: 'DAN', name: 'Daniel', abbreviation: 'Dan', chapters: 12, testament: 'old', category: 'Major Prophets', order: 27 },

  // Minor Prophets
  { id: 'HOS', name: 'Hosea', abbreviation: 'Hos', chapters: 14, testament: 'old', category: 'Minor Prophets', order: 28 },
  { id: 'JOL', name: 'Joel', abbreviation: 'Jol', chapters: 3, testament: 'old', category: 'Minor Prophets', order: 29 },
  { id: 'AMO', name: 'Amos', abbreviation: 'Amo', chapters: 9, testament: 'old', category: 'Minor Prophets', order: 30 },
  { id: 'OBA', name: 'Obadiah', abbreviation: 'Oba', chapters: 1, testament: 'old', category: 'Minor Prophets', order: 31 },
  { id: 'JON', name: 'Jonah', abbreviation: 'Jon', chapters: 4, testament: 'old', category: 'Minor Prophets', order: 32 },
  { id: 'MIC', name: 'Micah', abbreviation: 'Mic', chapters: 7, testament: 'old', category: 'Minor Prophets', order: 33 },
  { id: 'NAM', name: 'Nahum', abbreviation: 'Nam', chapters: 3, testament: 'old', category: 'Minor Prophets', order: 34 },
  { id: 'HAB', name: 'Habakkuk', abbreviation: 'Hab', chapters: 3, testament: 'old', category: 'Minor Prophets', order: 35 },
  { id: 'ZEP', name: 'Zephaniah', abbreviation: 'Zep', chapters: 3, testament: 'old', category: 'Minor Prophets', order: 36 },
  { id: 'HAG', name: 'Haggai', abbreviation: 'Hag', chapters: 2, testament: 'old', category: 'Minor Prophets', order: 37 },
  { id: 'ZEC', name: 'Zechariah', abbreviation: 'Zec', chapters: 14, testament: 'old', category: 'Minor Prophets', order: 38 },
  { id: 'MAL', name: 'Malachi', abbreviation: 'Mal', chapters: 4, testament: 'old', category: 'Minor Prophets', order: 39 },

  // NEW TESTAMENT
  // Gospels
  { id: 'MAT', name: 'Matthew', abbreviation: 'Mat', chapters: 28, testament: 'new', category: 'Gospels', order: 40 },
  { id: 'MRK', name: 'Mark', abbreviation: 'Mrk', chapters: 16, testament: 'new', category: 'Gospels', order: 41 },
  { id: 'LUK', name: 'Luke', abbreviation: 'Luk', chapters: 24, testament: 'new', category: 'Gospels', order: 42 },
  { id: 'JHN', name: 'John', abbreviation: 'Jhn', chapters: 21, testament: 'new', category: 'Gospels', order: 43 },

  // Acts
  { id: 'ACT', name: 'Acts', abbreviation: 'Act', chapters: 28, testament: 'new', category: 'History', order: 44 },

  // Paul's Letters
  { id: 'ROM', name: 'Romans', abbreviation: 'Rom', chapters: 16, testament: 'new', category: 'Pauline Epistles', order: 45 },
  { id: '1CO', name: '1 Corinthians', abbreviation: '1Co', chapters: 16, testament: 'new', category: 'Pauline Epistles', order: 46 },
  { id: '2CO', name: '2 Corinthians', abbreviation: '2Co', chapters: 13, testament: 'new', category: 'Pauline Epistles', order: 47 },
  { id: 'GAL', name: 'Galatians', abbreviation: 'Gal', chapters: 6, testament: 'new', category: 'Pauline Epistles', order: 48 },
  { id: 'EPH', name: 'Ephesians', abbreviation: 'Eph', chapters: 6, testament: 'new', category: 'Pauline Epistles', order: 49 },
  { id: 'PHP', name: 'Philippians', abbreviation: 'Php', chapters: 4, testament: 'new', category: 'Pauline Epistles', order: 50 },
  { id: 'COL', name: 'Colossians', abbreviation: 'Col', chapters: 4, testament: 'new', category: 'Pauline Epistles', order: 51 },
  { id: '1TH', name: '1 Thessalonians', abbreviation: '1Th', chapters: 5, testament: 'new', category: 'Pauline Epistles', order: 52 },
  { id: '2TH', name: '2 Thessalonians', abbreviation: '2Th', chapters: 3, testament: 'new', category: 'Pauline Epistles', order: 53 },
  { id: '1TI', name: '1 Timothy', abbreviation: '1Ti', chapters: 6, testament: 'new', category: 'Pastoral Epistles', order: 54 },
  { id: '2TI', name: '2 Timothy', abbreviation: '2Ti', chapters: 4, testament: 'new', category: 'Pastoral Epistles', order: 55 },
  { id: 'TIT', name: 'Titus', abbreviation: 'Tit', chapters: 3, testament: 'new', category: 'Pastoral Epistles', order: 56 },
  { id: 'PHM', name: 'Philemon', abbreviation: 'Phm', chapters: 1, testament: 'new', category: 'Pauline Epistles', order: 57 },

  // General Letters
  { id: 'HEB', name: 'Hebrews', abbreviation: 'Heb', chapters: 13, testament: 'new', category: 'General Epistles', order: 58 },
  { id: 'JAS', name: 'James', abbreviation: 'Jas', chapters: 5, testament: 'new', category: 'General Epistles', order: 59 },
  { id: '1PE', name: '1 Peter', abbreviation: '1Pe', chapters: 5, testament: 'new', category: 'General Epistles', order: 60 },
  { id: '2PE', name: '2 Peter', abbreviation: '2Pe', chapters: 3, testament: 'new', category: 'General Epistles', order: 61 },
  { id: '1JN', name: '1 John', abbreviation: '1Jn', chapters: 5, testament: 'new', category: 'General Epistles', order: 62 },
  { id: '2JN', name: '2 John', abbreviation: '2Jn', chapters: 1, testament: 'new', category: 'General Epistles', order: 63 },
  { id: '3JN', name: '3 John', abbreviation: '3Jn', chapters: 1, testament: 'new', category: 'General Epistles', order: 64 },
  { id: 'JUD', name: 'Jude', abbreviation: 'Jud', chapters: 1, testament: 'new', category: 'General Epistles', order: 65 },

  // Revelation
  { id: 'REV', name: 'Revelation', abbreviation: 'Rev', chapters: 22, testament: 'new', category: 'Prophecy', order: 66 },
];

export const OLD_TESTAMENT_BOOKS = BIBLE_BOOKS.filter(book => book.testament === 'old');
export const NEW_TESTAMENT_BOOKS = BIBLE_BOOKS.filter(book => book.testament === 'new');

export const BOOK_CATEGORIES = {
  'Law': OLD_TESTAMENT_BOOKS.filter(book => book.category === 'Law'),
  'History': BIBLE_BOOKS.filter(book => book.category === 'History'),
  'Wisdom': OLD_TESTAMENT_BOOKS.filter(book => book.category === 'Wisdom'),
  'Major Prophets': OLD_TESTAMENT_BOOKS.filter(book => book.category === 'Major Prophets'),
  'Minor Prophets': OLD_TESTAMENT_BOOKS.filter(book => book.category === 'Minor Prophets'),
  'Gospels': NEW_TESTAMENT_BOOKS.filter(book => book.category === 'Gospels'),
  'Pauline Epistles': NEW_TESTAMENT_BOOKS.filter(book => book.category === 'Pauline Epistles'),
  'Pastoral Epistles': NEW_TESTAMENT_BOOKS.filter(book => book.category === 'Pastoral Epistles'),
  'General Epistles': NEW_TESTAMENT_BOOKS.filter(book => book.category === 'General Epistles'),
  'Prophecy': NEW_TESTAMENT_BOOKS.filter(book => book.category === 'Prophecy'),
};

// Helper functions
export const getBookById = (id: string): BibleBookInfo | undefined => {
  return BIBLE_BOOKS.find(book => book.id === id);
};

export const getBooksByTestament = (testament: 'old' | 'new'): BibleBookInfo[] => {
  return BIBLE_BOOKS.filter(book => book.testament === testament);
};

export const getBooksByCategory = (category: string): BibleBookInfo[] => {
  return BIBLE_BOOKS.filter(book => book.category === category);
};

export const searchBooks = (query: string): BibleBookInfo[] => {
  const lowercaseQuery = query.toLowerCase();
  return BIBLE_BOOKS.filter(book => 
    book.name.toLowerCase().includes(lowercaseQuery) ||
    book.abbreviation.toLowerCase().includes(lowercaseQuery)
  );
};


