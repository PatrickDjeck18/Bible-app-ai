import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { useAuth } from './useAuth';

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: 'reflection' | 'prayer' | 'study' | 'journal' | 'insight' | 'gratitude' | 'other';
  tags: string[];
  is_private: boolean;
  is_favorite: boolean;
  mood_rating?: number;
  bible_reference?: string;
  related_prayer_id?: string;
  background_color?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  
}

export interface CreateNoteData {
  title: string;
  content: string;
  category?: Note['category'];
  tags?: string[];
  is_private?: boolean;
  is_favorite?: boolean;
  mood_rating?: number;
  bible_reference?: string;
  related_prayer_id?: string;
  background_color?: string;
}

export interface UpdateNoteData extends Partial<CreateNoteData> {
  id: string;
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Real-time listener for notes
  useEffect(() => {
    if (!user?.uid) {
      setNotes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const notesQuery = query(
      collection(db, 'notes'),
      where('user_id', '==', user.uid),
      orderBy('updated_at', 'desc')
    );

    const unsubscribe = onSnapshot(notesQuery, (snapshot) => {
      const fetchedNotes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Note[];
      setNotes(fetchedNotes);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching notes:', err);
      setError(err.message || 'Failed to load notes');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Create a new note
  const createNote = useCallback(async (noteData: CreateNoteData): Promise<Note | null> => {
    if (!user?.uid) {
      setError('User not authenticated');
      return null;
    }

    try {
      setError(null);
      const now = Timestamp.now();

      const newNoteRef = await addDoc(collection(db, 'notes'), {
        user_id: user.uid,
        title: noteData.title,
        content: noteData.content,
        category: noteData.category || 'reflection',
        tags: noteData.tags || [],
        is_private: noteData.is_private ?? true,
        is_favorite: noteData.is_favorite ?? false,
        mood_rating: noteData.mood_rating || null,
        bible_reference: noteData.bible_reference || null,
        related_prayer_id: noteData.related_prayer_id || null,
        background_color: noteData.background_color || '#ffffff',
        created_at: now,
        updated_at: now,
      });

      return {
        id: newNoteRef.id,
        user_id: user.uid,
        title: noteData.title,
        content: noteData.content,
        category: noteData.category || 'reflection',
        tags: noteData.tags || [],
        is_private: noteData.is_private ?? true,
        is_favorite: noteData.is_favorite ?? false,
        mood_rating: noteData.mood_rating ?? undefined,
bible_reference: noteData.bible_reference ?? undefined,
related_prayer_id: noteData.related_prayer_id ?? undefined,
        background_color: noteData.background_color || '#ffffff',
        created_at: now,
        updated_at: now,
      };
    } catch (err: any) {
      console.error('Error creating note:', err);
      setError(err.message || 'Failed to create note');
      return null;
    }
  }, [user?.uid]);

  // Update an existing note
  const updateNote = useCallback(async (noteData: UpdateNoteData): Promise<Note | null> => {
    if (!user?.uid) {
      setError('User not authenticated');
      return null;
    }

    try {
      setError(null);
      const noteDocRef = doc(db, 'notes', noteData.id);
      const now = Timestamp.now();
      
      await updateDoc(noteDocRef, {
        ...noteData,
        updated_at: now,
      });

      const updatedNote = notes.find(n => n.id === noteData.id);
      
      // Merge original note data with updated data and new timestamp
      if (updatedNote) {
        return {
          ...updatedNote,
          ...noteData,
          updated_at: now,
          category: noteData.category || updatedNote.category,
        };
      }
      return null;
    } catch (err: any) {
      console.error('Error updating note:', err);
      setError(err.message || 'Failed to update note');
      return null;
    }
  }, [user?.uid, notes]);

  // Delete a note
  const deleteNote = useCallback(async (noteId: string): Promise<boolean> => {
    if (!user?.uid) {
      setError('User not authenticated');
      return false;
    }

    try {
      setError(null);
      const noteDocRef = doc(db, 'notes', noteId);
      await deleteDoc(noteDocRef);

      return true;
    } catch (err: any) {
      console.error('Error deleting note:', err);
      setError(err.message || 'Failed to delete note');
      return false;
    }
  }, [user?.uid]);

  // Client-side filtering functions
  const searchNotes = useCallback((
    searchTerm: string,
    category?: string,
    favoriteOnly: boolean = false
  ): Note[] => {
    let filteredNotes = notes;

    if (category) {
      filteredNotes = filteredNotes.filter(note => note.category === category);
    }
    
    if (favoriteOnly) {
      filteredNotes = filteredNotes.filter(note => note.is_favorite);
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredNotes = filteredNotes.filter(note =>
        note.title.toLowerCase().includes(lowerSearchTerm) ||
        note.content.toLowerCase().includes(lowerSearchTerm) ||
        note.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
      );
    }

    return filteredNotes;
  }, [notes]);

  const getNotesByCategory = useCallback((category: Note['category']): Note[] => {
    return notes.filter(note => note.category === category);
  }, [notes]);

  const getFavoriteNotes = useCallback((): Note[] => {
    return notes.filter(note => note.is_favorite);
  }, [notes]);

  const getNotesStats = useMemo(() => {
    if (notes.length === 0) return null;

    const totalNotes = notes.length;
    const favoriteCount = notes.filter(note => note.is_favorite).length;
    const categoryCounts = notes.reduce((acc, note) => {
      acc[note.category] = (acc[note.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { totalNotes, favoriteCount, categoryCounts };
  }, [notes]);

  const toggleFavorite = useCallback(async (noteId: string): Promise<boolean> => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return false;

    const updated = await updateNote({
      id: noteId,
      is_favorite: !note.is_favorite,
    });

    return updated !== null;
  }, [notes, updateNote]);

  const refetch = useCallback(() => {
    setLoading(true);
  }, []);

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    getNotesByCategory,
    getFavoriteNotes,
    getNotesStats,
    toggleFavorite,
    refetch,
  };
}