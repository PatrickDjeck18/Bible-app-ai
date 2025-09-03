import { useState, useEffect } from 'react';

export interface StudyNote {
  id: string;
  reference: string;
  content: string;
  tags: string[];
  timestamp: number;
  lastModified: number;
}

const STORAGE_KEY = 'bible_study_notes';

// Local storage helper functions
const getFromStorage = (key: string) => {
  try {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  } catch (error) {
    console.error('Error reading from storage:', error);
    return null;
  }
};

const setToStorage = (key: string, value: any) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error('Error writing to storage:', error);
  }
};

export function useBibleStudyNotes() {
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [loading, setLoading] = useState(true);

  // Load notes from storage on mount
  useEffect(() => {
    const loadNotes = () => {
      try {
        const storedNotes = getFromStorage(STORAGE_KEY);
        if (storedNotes) {
          setNotes(storedNotes);
        }
      } catch (error) {
        console.error('Error loading notes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, []);

  // Save notes to storage whenever they change
  useEffect(() => {
    setToStorage(STORAGE_KEY, notes);
  }, [notes]);

  const addNote = (noteData: Omit<StudyNote, 'id' | 'timestamp' | 'lastModified'>) => {
    const newNote: StudyNote = {
      ...noteData,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      lastModified: Date.now(),
    };

    setNotes(prevNotes => [newNote, ...prevNotes]);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<StudyNote>) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id
          ? { ...note, ...updates, lastModified: Date.now() }
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  };

  const getNotesByReference = (reference: string) => {
    return notes.filter(note =>
      note.reference.toLowerCase().includes(reference.toLowerCase())
    );
  };

  const getNotesByTag = (tag: string) => {
    return notes.filter(note =>
      note.tags.some(noteTag => 
        noteTag.toLowerCase().includes(tag.toLowerCase())
      )
    );
  };

  const getAllTags = () => {
    const allTags = notes.flatMap(note => note.tags);
    return [...new Set(allTags)].sort();
  };

  const searchNotes = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return notes.filter(note =>
      note.reference.toLowerCase().includes(lowerQuery) ||
      note.content.toLowerCase().includes(lowerQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  };

  const getNotesByDateRange = (startDate: Date, endDate: Date) => {
    return notes.filter(note => {
      const noteDate = new Date(note.lastModified);
      return noteDate >= startDate && noteDate <= endDate;
    });
  };

  const getRecentNotes = (limit: number = 10) => {
    return notes
      .sort((a, b) => b.lastModified - a.lastModified)
      .slice(0, limit);
  };

  const exportNotes = () => {
    const dataStr = JSON.stringify(notes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    if (typeof window !== 'undefined') {
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bible-study-notes-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const importNotes = (jsonData: string) => {
    try {
      const importedNotes = JSON.parse(jsonData);
      if (Array.isArray(importedNotes)) {
        // Validate the imported data structure
        const validNotes = importedNotes.filter(note => 
          note.reference && note.content && note.tags && Array.isArray(note.tags)
        );
        
        if (validNotes.length > 0) {
          // Add imported notes with new IDs and timestamps
          const newNotes = validNotes.map(note => ({
            ...note,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            lastModified: Date.now(),
          }));
          
          setNotes(prevNotes => [...newNotes, ...prevNotes]);
          return { success: true, count: validNotes.length };
        }
      }
      return { success: false, error: 'Invalid data format' };
    } catch (error) {
      return { success: false, error: 'Failed to parse JSON data' };
    }
  };

  const clearAllNotes = () => {
    setNotes([]);
  };

  return {
    notes,
    loading,
    addNote,
    updateNote,
    deleteNote,
    getNotesByReference,
    getNotesByTag,
    getAllTags,
    searchNotes,
    getNotesByDateRange,
    getRecentNotes,
    exportNotes,
    importNotes,
    clearAllNotes,
  };
}


