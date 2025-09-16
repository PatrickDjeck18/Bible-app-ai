import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Plus,
  Edit3,
  Trash2,
  Search,
  Calendar,
  Clock,
  BookOpen,
  Save,
  X,
  FileText,
  Smile,
  Palette,
} from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignTokens';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundGradient from '@/components/BackgroundGradient';
// Removed modal import - using inline editing instead
import { HeaderCard } from '@/components/HeaderCard';

const { width, height } = Dimensions.get('window');

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  backgroundColor?: string;
  gradientColors?: readonly [string, string, ...string[]]
  category?: string;
  moodRating?: number;
  bibleReference?: string;
}

// Background color options
const backgroundOptions = [
  { id: 'default', name: 'Default', type: 'color', value: '#FFFFFF' },
  { id: 'warm', name: 'Warm', type: 'color', value: '#FFF8E1' },
  { id: 'cool', name: 'Cool', type: 'color', value: '#E3F2FD' },
  { id: 'nature', name: 'Nature', type: 'color', value: '#E8F5E8' },
  { id: 'sunset', name: 'Sunset', type: 'gradient', value: ['#FF6B6B', '#FFE66D'] },
  { id: 'ocean', name: 'Ocean', type: 'gradient', value: ['#4ECDC4', '#44A08D'] },
  { id: 'spiritual', name: 'Spiritual', type: 'gradient', value: ['#667eea', '#764ba2'] },
];

export default function NoteTakerScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingContent, setEditingContent] = useState('');
  const [editingTags, setEditingTags] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const titleInputRef = useRef<TextInput>(null);
  const contentInputRef = useRef<TextInput>(null);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }));
        setNotes(parsedNotes);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveNotes = async (updatedNotes: Note[]) => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const createNewNote = () => {
    setEditingNoteId(null);
    setEditingTitle('');
    setEditingContent('');
    setEditingTags([]);
  };

  const openNote = (note: Note) => {
    startInlineEdit(note);
  };


  const cancelInlineEdit = () => {
    setEditingNoteId(null);
    setEditingTitle('');
    setEditingContent('');
    setEditingTags([]);
  };

  const startInlineEdit = (note: Note) => {
    setEditingNoteId(note.id);
    setEditingTitle(note.title);
    setEditingContent(note.content);
    setEditingTags(note.tags || []);
  };

  const saveInlineNote = async () => {
    if (!editingTitle.trim() || !editingContent.trim()) {
      Alert.alert('Missing Information', 'Please fill in both title and content.');
      return;
    }

    try {
      const updatedNote: Note = {
        id: editingNoteId || Date.now().toString(),
        title: editingTitle.trim(),
        content: editingContent.trim(),
        tags: editingTags,
        createdAt: editingNoteId ? notes.find(n => n.id === editingNoteId)?.createdAt || new Date() : new Date(),
        updatedAt: new Date(),
      };

      const existingIndex = notes.findIndex(note => note.id === editingNoteId);
      let updatedNotes: Note[];

      if (existingIndex >= 0) {
        // Update existing note
        updatedNotes = [...notes];
        updatedNotes[existingIndex] = updatedNote;
      } else {
        // Add new note
        updatedNotes = [updatedNote, ...notes];
      }

      await saveNotes(updatedNotes);
      cancelInlineEdit();
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note. Please try again.');
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const updatedNotes = notes.filter(note => note.id !== noteId);
      await saveNotes(updatedNotes);
      setShowDeleteModal(false);
      setNoteToDelete(null);
      
      if (editingNoteId === noteId) {
        cancelInlineEdit();
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      Alert.alert('Error', 'Failed to delete note. Please try again.');
    }
  };


  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchText.toLowerCase()) ||
    note.content.toLowerCase().includes(searchText.toLowerCase()) ||
    (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase())))
  );

  const renderNoteBackground = (note: Note) => {
    if (note.gradientColors && note.gradientColors.length > 1) {
      return (
        <LinearGradient
          colors={note.gradientColors}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      );
    }
    return null;
  };

  const renderNoteCard = ({ item: note, index }: { item: Note; index: number }) => (
    <TouchableOpacity
      style={styles.noteCard}
      onPress={() => openNote(note)}
      activeOpacity={0.7}
    >
      <View style={styles.noteHeader}>
        <View style={styles.noteContentArea}>
          <View style={styles.noteIcon}>
            <FileText size={20} color={Colors.primary[600]} />
          </View>
          <View style={styles.noteInfo}>
            <Text style={styles.noteTitle} numberOfLines={1}>
              {note.title || 'Untitled Note'}
            </Text>
            <Text style={styles.notePreview} numberOfLines={2}>
              {note.content || 'No content'}
            </Text>
          </View>
        </View>
        <View style={styles.noteActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => openNote(note)}
          >
            <Edit3 size={16} color={Colors.neutral[600]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              setNoteToDelete(note);
              setShowDeleteModal(true);
            }}
          >
            <Trash2 size={16} color={Colors.error[500]} />
          </TouchableOpacity>
        </View>
      </View>
      
      {note.tags && note.tags.length > 0 && (
        <View style={styles.noteTags}>
          {note.tags.slice(0, 3).map((tag, tagIndex) => (
            <View key={tagIndex} style={styles.noteTag}>
              <Text style={styles.noteTagText}>{tag}</Text>
            </View>
          ))}
          {note.tags.length > 3 && (
            <Text style={styles.noteTagMore}>+{note.tags.length - 3}</Text>
          )}
        </View>
      )}

      <View style={styles.noteFooter}>
        <View style={styles.noteMeta}>
          <Calendar size={12} color={Colors.neutral[400]} />
          <Text style={styles.noteDate}>
            {note.createdAt.toLocaleDateString()}
          </Text>
          <Clock size={12} color={Colors.neutral[400]} />
          <Text style={styles.noteTime}>
            {note.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        {note.category && (
          <View style={styles.noteCategory}>
            <Text style={styles.noteCategoryText}>{note.category}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <BackgroundGradient />
      
      {/* Hero Header */}
      <HeaderCard
        title="Notes"
        subtitle="Capture your thoughts and reflections"
        showBackButton={true}
        onBackPress={() => router.back()}
        rightActions={
          <TouchableOpacity
            style={styles.heroActionButton}
            onPress={createNewNote}
          >
            <Plus size={20} color={Colors.primary[600]} />
          </TouchableOpacity>
        }
        gradientColors={Colors.gradients.spiritualLight} // Same as Bible Quiz
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.neutral[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes..."
            placeholderTextColor={Colors.neutral[400]}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Notes List */}
      <View style={styles.notesContainer}>
        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Loading notes...</Text>
          </View>
        ) : filteredNotes.length === 0 ? (
          <View style={styles.emptyState}>
            <FileText size={64} color={Colors.neutral[300]} />
            <Text style={styles.emptyTitle}>
              {searchText ? 'No notes found' : 'No notes yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchText 
                ? 'Try adjusting your search terms'
                : 'Start capturing your thoughts and reflections'
              }
            </Text>
            {!searchText && (
              <TouchableOpacity
                style={styles.createFirstButton}
                onPress={createNewNote}
              >
                <Plus size={20} color="white" />
                <Text style={styles.createFirstButtonText}>Create First Note</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredNotes}
            renderItem={renderNoteCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.notesContent}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
          />
        )}
      </View>

      {/* Inline Note Editor */}
      {editingNoteId !== null && (
        <View style={styles.inlineEditor}>
          <View style={styles.editorHeader}>
            <Text style={styles.editorTitle}>
              {editingNoteId ? 'Edit Note' : 'New Note'}
            </Text>
            <View style={styles.editorActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelInlineEdit}
              >
                <X size={20} color={Colors.neutral[600]} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveInlineNote}
              >
                <Save size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          
          <ScrollView style={styles.editorContent}>
            <TextInput
              style={styles.editorTitleInput}
              placeholder="Note title..."
              placeholderTextColor={Colors.neutral[400]}
              value={editingTitle}
              onChangeText={setEditingTitle}
              multiline
              maxLength={100}
            />
            
            <TextInput
              style={styles.editorContentInput}
              placeholder="Start writing your note..."
              placeholderTextColor={Colors.neutral[400]}
              value={editingContent}
              onChangeText={setEditingContent}
              multiline
              textAlignVertical="top"
              maxLength={2000}
            />
          </ScrollView>
        </View>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalTitle}>Delete Note</Text>
            <Text style={styles.deleteModalMessage}>
              Are you sure you want to delete "{noteToDelete?.title || 'Untitled Note'}"? 
              This action cannot be undone.
            </Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={styles.deleteModalCancelButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.deleteModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteModalDeleteButton}
                onPress={() => {
                  if (noteToDelete) {
                    deleteNote(noteToDelete.id);
                  }
                }}
              >
                <Text style={styles.deleteModalDeleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // Hero Header
  hero: {
    paddingTop: Platform.OS === 'ios' ? 60 : 24,
  },
  heroGradient: {
    borderBottomLeftRadius: BorderRadius['3xl'],
    borderBottomRightRadius: BorderRadius['3xl'],
    overflow: 'hidden',
  },
  heroContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing['2xl'],
    paddingTop: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    ...Shadows.sm,
  },
  heroTextBlock: {
    flex: 1,
  },
  heroTitle: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[900],
  },
  heroSubtitle: {
    marginTop: Spacing.xs,
    fontSize: Typography.sizes.base,
    color: Colors.neutral[600],
  },
  heroActionButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },

  // Search
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.sizes.base,
    color: Colors.neutral[900],
  },

  // Notes List
  notesContainer: {
    flex: 1,
  },
  notesContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  noteCard: {
    backgroundColor: 'white',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  noteContentArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noteIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  noteInfo: {
    flex: 1,
  },
  noteTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semiBold,
    color: Colors.neutral[900],
    marginBottom: Spacing.xs,
  },
  notePreview: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[600],
    lineHeight: Typography.sizes.sm * 1.4,
  },
  noteActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  actionButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: 'transparent',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  noteTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  noteTag: {
    backgroundColor: Colors.primary[50],
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  noteTagText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary[700],
  },
  noteTagMore: {
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[500],
    alignSelf: 'center',
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  noteDate: {
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[500],
  },
  noteTime: {
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[500],
  },
  noteCategory: {
    backgroundColor: Colors.secondary[50],
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  noteCategoryText: {
    fontSize: Typography.sizes.xs,
    color: Colors.secondary[700],
    textTransform: 'capitalize',
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['4xl'],
  },
  emptyText: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[600],
  },
  emptyTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semiBold,
    color: Colors.neutral[700],
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[500],
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  createFirstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[600],
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  createFirstButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semiBold,
    color: 'white',
  },

  // Delete Modal
  deleteModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  deleteModalContent: {
    backgroundColor: 'white',
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 320,
    ...Shadows.lg,
  },
  deleteModalTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[900],
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  deleteModalMessage: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[600],
    lineHeight: Typography.sizes.base * 1.5,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  deleteModalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  deleteModalCancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteModalCancelText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semiBold,
    color: Colors.neutral[700],
  },
  deleteModalDeleteButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.error[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteModalDeleteText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semiBold,
    color: 'white',
  },

  // Inline Editor Styles
  inlineEditor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    zIndex: 1000,
  },
  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
    backgroundColor: 'white',
  },
  editorTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[900],
  },
  editorActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cancelButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  editorContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  editorTitleInput: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[900],
    paddingVertical: Spacing.md,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  editorContentInput: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[900],
    lineHeight: Typography.sizes.base * 1.6,
    paddingVertical: Spacing.sm,
    minHeight: 200,
    textAlignVertical: 'top',
  },
});
