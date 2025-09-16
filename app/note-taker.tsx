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
  Modal,
  FlatList,
  StatusBar,
  RefreshControl,
} from 'react-native';
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
} from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignTokens';
import { router } from 'expo-router';
import BackgroundGradient from '@/components/BackgroundGradient';
import { HeaderCard } from '@/components/HeaderCard';
import { useAuth } from '@/hooks/useAuth';
import { useNotes, Note } from '@/hooks/useNotes'; // Import the correct Note type from your hook
import { Timestamp } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');


export default function NoteTakerScreen() {
  const { user } = useAuth();
  const { 
    notes, 
    loading, 
    error, 
    refetch, // Use refetch instead of loadNotes
    createNote, 
    updateNote, 
    deleteNote, 
  } = useNotes();
  
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [savedNote, setSavedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const titleInputRef = useRef<TextInput>(null);
  const contentInputRef = useRef<TextInput>(null);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    if (user?.uid) { // Use uid for consistency with Firebase
      refetch();
    }
  }, [user?.uid, refetch]);


  const saveNote = async (note: Note) => {
    if (!user?.uid) {
      Alert.alert('Error', 'You must be logged in to save notes');
      return false;
    }

    try {
      if (note.id && note.id !== '') {
        const success = await updateNote({
          id: note.id,
          title: note.title,
          content: note.content,
          category: (note.category as 'reflection' | 'prayer' | 'study' | 'journal' | 'insight' | 'gratitude' | 'other') || 'reflection',
          tags: note.tags || [],
          background_color: note.background_color || '#FFFFFF',
          is_favorite: note.is_favorite || false,
          mood_rating: note.mood_rating,
          bible_reference: note.bible_reference,
          is_private: note.is_private !== false
        });
        return success;
      } else {
        const newNote = await createNote({
          title: note.title,
          content: note.content,
          category: (note.category as 'reflection' | 'prayer' | 'study' | 'journal' | 'insight' | 'gratitude' | 'other') || 'reflection',
          tags: note.tags || [],
          background_color: note.background_color || '#FFFFFF',
          is_favorite: note.is_favorite || false,
          mood_rating: note.mood_rating,
          bible_reference: note.bible_reference,
          is_private: note.is_private !== false
        });
        return !!newNote;
      }
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note');
      return false;
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!user?.uid) {
      Alert.alert('Error', 'You must be logged in to delete notes');
      return false;
    }

    try {
      const success = await deleteNote(noteId);
      if (success) {
        console.log('Note deleted successfully');
        if (currentNote?.id === noteId) {
          setCurrentNote(null);
          setShowNoteModal(false);
        }
        Alert.alert('Success', 'Note deleted successfully!');
        return true;
      } else {
        Alert.alert('Error', 'Failed to delete note');
        return false;
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      Alert.alert('Error', 'Failed to delete note');
      return false;
    }
  };

  const createNewNote = () => {
    if (!user?.uid) {
      Alert.alert('Error', 'You must be logged in to create notes');
      return;
    }

    console.log('Creating new note...');
    
    const newNote: Note = {
  id: '',
  title: '',
  content: '',
  created_at: Timestamp.now(), // No need for 'as any'
  updated_at: Timestamp.now(), // No need for 'as any'
  tags: [],
  background_color: '#FFFFFF',
  category: 'reflection',
  is_private: true,
  is_favorite: false,
  user_id: ''
};
    
    console.log('Setting note state:', { newNote, isEditing: true });
    setCurrentNote(newNote);
    setIsEditing(true); 
    setShowNoteModal(true);
  };

  const openNote = (note: Note) => {
    setCurrentNote(note);
    setSavedNote(note);
    setIsEditing(false); // Open in view mode first
    setShowNoteModal(true);
  };

  const editNote = useCallback(() => {
    setIsEditing(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowNoteModal(false);
    setCurrentNote(null);
    setSavedNote(null);
    setIsEditing(false);
    setShowEmojiPicker(false);
    isTransitioningRef.current = false;
  }, []);

  const saveCurrentNote = async () => {
    if (!currentNote || isTransitioningRef.current) return;

    isTransitioningRef.current = true;

    const noteToSave = {
      ...currentNote,
      updated_at: Timestamp.now() as any, // Update timestamp
    };

    const success = await saveNote(noteToSave);
    if (success) {
      setSavedNote(noteToSave);
      setIsEditing(false);
      setTimeout(() => {
        setCurrentNote(noteToSave);
        isTransitioningRef.current = false;
      }, 200);
      refetch();
    } else {
      isTransitioningRef.current = false;
      Alert.alert('Error', 'Failed to save note');
    }
  };

  const updateNoteField = useCallback((field: 'title' | 'content', value: string) => {
    setCurrentNote(prev => {
      if (!prev) return prev;
      if (prev[field] === value) return prev;
      return {
        ...prev,
        [field]: value,
      };
    });
  }, []);

  const formatDate = (date: Timestamp) => {
    try {
      const jsDate = date.toDate();
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - jsDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return 'Today';
      if (diffDays === 2) return 'Yesterday';
      if (diffDays <= 7) return `${diffDays - 1} days ago`;
      return jsDate.toLocaleDateString();
    } catch (error) {
      return 'Unknown';
    }
  };

  const formatTime = (date: Timestamp) => {
    try {
      const jsDate = date.toDate();
      return jsDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return '--:--';
    }
  };

  const insertEmoji = (emoji: string) => {
    if (!currentNote) return;
    
    const newContent = (currentNote.content || '') + emoji;
    setCurrentNote({
      ...currentNote,
      content: newContent,
    });
    setShowEmojiPicker(false);
  };

  const popularEmojis = [
    '😊', '😂', '❤️', '👍', '🎉', '🔥', '✨', '💯', '🙏', '😍',
    '😭', '🤔', '👏', '💪', '🎯', '🚀', '💡', '🌟', '💎', '🏆',
    '📚', '✍️', '🎨', '🎵', '🍕', '☕', '🌺', '🌈', '⭐', '💫'
  ];

  const filteredNotes = notes.filter(note => {
    if (!note || !note.title || !note.content) {
      return false;
    }
    
    const searchLower = searchText.toLowerCase();
    return note.title.toLowerCase().includes(searchLower) ||
           note.content.toLowerCase().includes(searchLower);
  });

  const renderNoteItem = ({ item }: { item: Note }) => {
    if (!item) {
      return null;
    }
    
    return (
      <View>
        <View style={[
          styles.noteCard,
          {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            overflow: 'hidden',
          }
        ]}>
          <View style={styles.noteHeader}>
            <TouchableOpacity
              style={styles.noteContentArea}
              onPress={() => openNote(item)}
              activeOpacity={0.7}
            >
              <View style={styles.noteIcon}>
                <FileText size={20} color={Colors.primary[600]} />
              </View>
              <View style={styles.noteInfo}>
                <Text style={styles.noteTitle} numberOfLines={1}>
                  {item.title || 'Untitled Note'}
                </Text>
                <Text style={styles.notePreview} numberOfLines={2}>
                  {item.content || 'No content'}
                </Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.noteActions}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  console.log('🗑️ DELETE BUTTON PRESSED for note:', item.id, 'Title:', item.title);
                  setNoteToDelete(item);
                  setShowDeleteModal(true);
                }}
                activeOpacity={0.7}
              >
                <Trash2 size={16} color={Colors.neutral[400]} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.noteFooter}>
            <View style={styles.noteMeta}>
              <Calendar size={12} color={Colors.neutral[500]} />
              {item.updated_at instanceof Timestamp && (
                <Text style={styles.noteDate}>{formatDate(item.updated_at)}</Text>
              )}
            </View>
            <View style={styles.noteMeta}>
              <Clock size={12} color={Colors.neutral[500]} />
              {item.updated_at instanceof Timestamp && (
                <Text style={styles.noteTime}>{formatTime(item.updated_at)}</Text>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      
      <BackgroundGradient>
        {/* Header */}
        <HeaderCard
          title="Notes"
          subtitle="Capture your thoughts and insights"
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
          gradientColors={['#fdfcfb', '#e2d1c3', '#c9d6ff']}
        />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={Colors.neutral[500]} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search notes..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor={Colors.neutral[500]}
            />
            {searchText.trim() ? (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <X size={20} color={Colors.neutral[500]} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Notes List */}
        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Loading notes...</Text>
          </View>
        ) : filteredNotes.length === 0 ? (
          <View style={styles.emptyState}>
            <BookOpen size={48} color={Colors.neutral[400]} />
            <Text style={styles.emptyTitle}>
              {searchText ? 'No notes found' : 'No notes yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchText 
                ? 'Try adjusting your search terms'
                : 'Create your first note to get started'
              }
            </Text>
            {!searchText && (
              <TouchableOpacity
                style={styles.createFirstButton}
                onPress={createNewNote}
              >
                <Plus size={20} color="white" />
                <Text style={styles.createFirstButtonText}>Create Note</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredNotes}
            renderItem={renderNoteItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.notesContent}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={refetch} />
            }
          />
        )}

        {/* Note Modal */}
        <Modal
          visible={showNoteModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={closeModal}
          statusBarTranslucent={false}
        >
          <LinearGradient
            colors={['#fdfcfb', '#e2d1c3', '#c9d6ff']}
            style={styles.modalContainer}
          >
            <StatusBar barStyle="dark-content" backgroundColor="transparent" />
            <SafeAreaView style={styles.modalSafeArea}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={closeModal}
                >
                  <ArrowLeft size={24} color={Colors.neutral[700]} />
                </TouchableOpacity>

                <Text style={styles.modalTitle}>
                  {isEditing ? 'Edit Note' : 'View Note'}
                </Text>

                {isEditing ? (
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={saveCurrentNote}
                  >
                    <Save size={20} color="white" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={editNote}
                  >
                    <Edit3 size={20} color={Colors.primary[600]} />
                  </TouchableOpacity>
                )}
              </View>

              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={[styles.modalContent, {
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  overflow: 'hidden',
                }]}
                key={isEditing ? 'editing' : 'viewing'}
              >
                {isEditing ? (
                  <>
                    <TextInput
                      ref={titleInputRef}
                      style={styles.titleInput}
                      placeholder="Note title..."
                      value={currentNote?.title || ''}
                      onChangeText={(text) => updateNoteField('title', text)}
                      placeholderTextColor={Colors.neutral[400]}
                      multiline
                    />
                    <View style={styles.contentSection}>
                      <View style={styles.contentHeader}>
                        <Text style={styles.contentLabel}>Content</Text>
                        <TouchableOpacity
                          style={styles.emojiButton}
                          onPress={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                          <Smile size={20} color={Colors.primary[600]} />
                        </TouchableOpacity>
                      </View>
                      <TextInput
                        ref={contentInputRef}
                        style={styles.contentInput}
                        placeholder="Start writing your note..."
                        value={currentNote?.content || ''}
                        onChangeText={(text) => updateNoteField('content', text)}
                        placeholderTextColor={Colors.neutral[400]}
                        multiline
                        textAlignVertical="top"
                      />
                      {showEmojiPicker && (
                        <View style={styles.emojiPicker}>
                          <Text style={styles.emojiPickerTitle}>Add Emoji</Text>
                          <View style={styles.emojiGrid}>
                            {popularEmojis.map((emoji, index) => (
                              <TouchableOpacity
                                key={index}
                                style={styles.emojiItem}
                                onPress={() => {
                                  const newContent = (currentNote?.content || '') + emoji;
                                  updateNoteField('content', newContent);
                                  setShowEmojiPicker(false);
                                }}
                              >
                                <Text style={styles.emojiText}>{emoji}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      )}
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.noteViewTitle}>
                      {(savedNote || currentNote)?.title || 'Untitled Note'}
                    </Text>
                    <Text style={styles.noteViewContent}>
                      {(savedNote || currentNote)?.content || 'No content'}
                    </Text>
                    <View style={styles.noteViewMeta}>
                      { (savedNote?.created_at instanceof Timestamp || currentNote?.created_at instanceof Timestamp) && (
                        <Text style={styles.noteViewDate}>
                          Created: {savedNote?.created_at ? formatDate(savedNote.created_at) : (currentNote?.created_at ? formatDate(currentNote.created_at) : 'Unknown')}
                        </Text>
                      )}
                      { (savedNote?.updated_at instanceof Timestamp || currentNote?.updated_at instanceof Timestamp) && (
                        <Text style={styles.noteViewDate}>
                          Updated: {savedNote?.updated_at ? formatDate(savedNote.updated_at) : (currentNote?.updated_at ? formatDate(currentNote.updated_at) : 'Unknown')}
                        </Text>
                      )}
                    </View>
                  </>
                )}
              </KeyboardAvoidingView>
            </SafeAreaView>
          </LinearGradient>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          visible={showDeleteModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDeleteModal(false)}
        >
          <View style={styles.deleteModalOverlay}>
            <View style={styles.deleteModalContent}>
              <Text style={styles.deleteModalTitle}>Delete Note</Text>
              <Text style={styles.deleteModalMessage}>
                Are you sure you want to delete "{noteToDelete?.title || 'Untitled Note'}"? This action cannot be undone.
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
                      handleDeleteNote(noteToDelete.id);
                    }
                    setShowDeleteModal(false);
                    setNoteToDelete(null);
                  }}
                >
                  <Text style={styles.deleteModalDeleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </BackgroundGradient>
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
    marginBottom: Spacing.md,
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
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  modalSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  modalTitle: {
    flex: 1,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[900],
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  titleInput: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[900],
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
     contentInput: {
     flex: 1,
     fontSize: Typography.sizes.base,
     color: Colors.neutral[900],
     lineHeight: Typography.sizes.base * 1.6,
     paddingVertical: Spacing.sm,
   },
   contentSection: {
     flex: 1,
   },
   contentHeader: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
     marginBottom: Spacing.sm,
   },
   contentLabel: {
     fontSize: Typography.sizes.base,
     fontWeight: Typography.weights.semiBold,
     color: Colors.neutral[700],
   },
   emojiButton: {
     width: 32,
     height: 32,
     borderRadius: BorderRadius.lg,
     backgroundColor: Colors.primary[50],
     alignItems: 'center',
     justifyContent: 'center',
   },
   emojiPicker: {
     backgroundColor: Colors.neutral[50],
     borderRadius: BorderRadius.lg,
     padding: Spacing.md,
     marginTop: Spacing.sm,
   },
   emojiPickerTitle: {
     fontSize: Typography.sizes.sm,
     fontWeight: Typography.weights.semiBold,
     color: Colors.neutral[700],
     marginBottom: Spacing.sm,
   },
   emojiGrid: {
     flexDirection: 'row',
     flexWrap: 'wrap',
     gap: Spacing.xs,
   },
   emojiItem: {
     width: 36,
     height: 36,
     borderRadius: BorderRadius.md,
     backgroundColor: 'white',
     alignItems: 'center',
     justifyContent: 'center',
     borderWidth: 1,
     borderColor: Colors.neutral[200],
   },
   emojiText: {
     fontSize: 18,
   },
  noteViewTitle: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[900],
    marginBottom: Spacing.lg,
  },
  noteViewContent: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[800],
    lineHeight: Typography.sizes.base * 1.6,
    marginBottom: Spacing.xl,
  },
  noteViewMeta: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    paddingTop: Spacing.lg,
  },
     noteViewDate: {
     fontSize: Typography.sizes.sm,
     color: Colors.neutral[500],
     marginBottom: Spacing.xs,
   },

   // Delete Modal
   deleteModalOverlay: {
     flex: 1,
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

 });