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

const { width, height } = Dimensions.get('window');

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  backgroundColor?: string;
  gradientColors?: string[];
}

// Background color options
const backgroundOptions = [
  { id: 'default', name: 'Default', type: 'color', value: '#FFFFFF' },
  { id: 'spiritual', name: 'Spiritual', type: 'gradient', value: Colors.gradients.spiritual },
  { id: 'sunset', name: 'Sunset', type: 'gradient', value: Colors.gradients.etherealSunset },
  { id: 'ocean', name: 'Ocean', type: 'gradient', value: Colors.gradients.oceanBreeze },
  { id: 'nature', name: 'Nature', type: 'gradient', value: Colors.gradients.sacredGarden },
  { id: 'golden', name: 'Golden', type: 'gradient', value: Colors.gradients.goldenHour },
  { id: 'aurora', name: 'Aurora', type: 'gradient', value: Colors.gradients.aurora },
  { id: 'cosmic', name: 'Cosmic', type: 'gradient', value: Colors.gradients.cosmic },
  { id: 'light', name: 'Light', type: 'gradient', value: Colors.gradients.spiritualLight },
];

export default function NoteTakerScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [savedNote, setSavedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
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
      const savedNotes = await AsyncStorage.getItem('daily_bread_notes');
      if (savedNotes) {
                 const parsedNotes = JSON.parse(savedNotes)
           .filter((note: any) => note && typeof note === 'object') // Filter out invalid notes
           .map((note: any) => ({
             ...note,
             createdAt: new Date(note.createdAt || Date.now()),
             updatedAt: new Date(note.updatedAt || Date.now()),
             title: note.title || '',
             content: note.content || '',
             id: note.id || Date.now().toString(),
             backgroundColor: note.backgroundColor || '#FFFFFF',
             gradientColors: note.gradientColors || undefined,
           }));
         console.log('Loaded notes:', parsedNotes.length, 'notes with IDs:', parsedNotes.map((n: Note) => n.id)); // Debug log
         setNotes(parsedNotes);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
      setNotes([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async (note: Note) => {
    try {
      const updatedNotes = [note, ...notes.filter(n => n.id !== note.id)];
      await AsyncStorage.setItem('daily_bread_notes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
      return true;
    } catch (error) {
      console.error('Error saving note:', error);
      return false;
    }
  };

  const deleteNote = async (noteId: string) => {
    console.log('Proceeding with deletion for note ID:', noteId); // Debug log
    
    try {
      console.log('Current notes before deletion:', notes.length); // Debug log
      
      // Filter out the note to delete
      const updatedNotes = notes.filter(n => n && n.id !== noteId);
      console.log('Notes after filtering:', updatedNotes.length); // Debug log
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('daily_bread_notes', JSON.stringify(updatedNotes));
      console.log('Notes saved to AsyncStorage');
      
      // Update state
      setNotes(updatedNotes);
      console.log('State updated with new notes');
      
      // Close modal if the deleted note was being viewed
      if (currentNote?.id === noteId) {
        setCurrentNote(null);
        setShowNoteModal(false);
        console.log('Modal closed because deleted note was being viewed');
      }
      
      console.log('Note deleted successfully'); // Debug log
      Alert.alert('Success', 'Note deleted successfully!');
    } catch (error) {
      console.error('Error deleting note:', error);
      Alert.alert('Error', 'Failed to delete note');
    }
  };

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      backgroundColor: '#FFFFFF',
      gradientColors: undefined,
    };
    setCurrentNote(newNote);
    setIsEditing(true);
    setShowNoteModal(true);
  };

  const openNote = (note: Note) => {
    setCurrentNote(note);
    setSavedNote(note);
    setIsEditing(false);
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
    setShowColorPicker(null);
    isTransitioningRef.current = false;
  }, []);

  // Background color handling functions
  const handleBackgroundChange = (noteId: string | null, option: typeof backgroundOptions[0]) => {
    if (noteId) {
      // Update existing note in the list
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === noteId
            ? {
                ...note,
                backgroundColor: option.type === 'color' ? option.value as string : undefined,
                gradientColors: option.type === 'gradient' ? [...(option.value as readonly string[])] : undefined,
                updatedAt: new Date(),
              }
            : note
        )
      );
      
      // Also update current note if it's the same
      if (currentNote?.id === noteId) {
        setCurrentNote(prev => prev ? {
          ...prev,
          backgroundColor: option.type === 'color' ? option.value as string : undefined,
          gradientColors: option.type === 'gradient' ? [...(option.value as readonly string[])] : undefined,
        } : prev);
      }
    } else {
      // Update new note being created
      setCurrentNote(prev => prev ? {
        ...prev,
        backgroundColor: option.type === 'color' ? option.value as string : '#FFFFFF',
        gradientColors: option.type === 'gradient' ? [...(option.value as readonly string[])] : undefined,
      } : prev);
    }
    setShowColorPicker(null);
  };

  const renderNoteBackground = (note: Note) => {
    if (note.gradientColors && note.gradientColors.length >= 2) {
      const colors = note.gradientColors.length >= 2
        ? [note.gradientColors[0], note.gradientColors[1], ...(note.gradientColors.slice(2))] as const
        : [note.gradientColors[0], note.gradientColors[0]] as const;
      return (
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      );
    }
    return null;
  };

  const ColorPicker = ({ noteId }: { noteId: string | null }) => (
    <View style={styles.colorPickerContainer}>
      <Text style={styles.colorPickerTitle}>Choose Background</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorOptionsScroll}>
        {backgroundOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.colorOption}
            onPress={() => handleBackgroundChange(noteId, option)}
          >
            {option.type === 'gradient' ? (
              <LinearGradient
                colors={option.value as readonly string[] as readonly [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.colorPreview}
              />
            ) : (
              <View style={[styles.colorPreview, { backgroundColor: option.value as string }]} />
            )}
            <Text style={styles.colorOptionName}>{option.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const saveCurrentNote = async () => {
    if (!currentNote || isTransitioningRef.current) return;

    isTransitioningRef.current = true;

    const noteToSave = {
      ...currentNote,
      updatedAt: new Date(),
    };

    const success = await saveNote(noteToSave);
    if (success) {
      // Update the saved note first
      setSavedNote(noteToSave);
      
      // Switch to view mode
      setIsEditing(false);
      
      // Update currentNote after a delay to prevent flashing
      setTimeout(() => {
        setCurrentNote(noteToSave);
        isTransitioningRef.current = false;
      }, 200);
    } else {
      isTransitioningRef.current = false;
      Alert.alert('Error', 'Failed to save note');
    }
  };

  const updateNoteField = useCallback((field: 'title' | 'content', value: string) => {
    setCurrentNote(prev => {
      if (!prev) return prev;
      // Only update if the value actually changed
      if (prev[field] === value) return prev;
      return {
        ...prev,
        [field]: value,
      };
    });
  }, []);

  const formatDate = (date: Date) => {
    try {
      if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return 'Unknown';
      }
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return 'Today';
      if (diffDays === 2) return 'Yesterday';
      if (diffDays <= 7) return `${diffDays - 1} days ago`;
      return date.toLocaleDateString();
    } catch (error) {
      return 'Unknown';
    }
  };

  const formatTime = (date: Date) => {
    try {
      if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return '--:--';
      }
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return '--:--';
    }
  };

  const insertEmoji = (emoji: string) => {
    if (!currentNote) return;
    
    // Insert emoji at cursor position or at the end
    const newContent = currentNote.content + emoji;
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
    // First check if note exists and has required properties
    if (!note || !note.title || !note.content) {
      return false;
    }
    
    // Then check if it matches search text
    const searchLower = searchText.toLowerCase();
    return note.title.toLowerCase().includes(searchLower) ||
           note.content.toLowerCase().includes(searchLower);
  });

    const renderNoteItem = ({ item }: { item: Note }) => {
    // Add null check for item
    if (!item) {
      return null;
    }
    
    return (
      <View>
        <View style={[
          styles.noteCard,
          {
            backgroundColor: item.backgroundColor || '#FFFFFF',
            overflow: 'hidden',
          }
        ]}>
          {renderNoteBackground(item)}
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
                style={[styles.actionButton, { backgroundColor: Colors.glass.light, borderRadius: BorderRadius.sm }]}
                onPress={() => setShowColorPicker(showColorPicker === item.id ? null : item.id)}
              >
                <Palette size={14} color={Colors.primary[600]} />
              </TouchableOpacity>
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
              <Text style={styles.noteDate}>{formatDate(item.updatedAt)}</Text>
            </View>
            <View style={styles.noteMeta}>
              <Clock size={12} color={Colors.neutral[500]} />
              <Text style={styles.noteTime}>{formatTime(item.updatedAt)}</Text>
            </View>
          </View>
        </View>
        {showColorPicker === item.id && <ColorPicker noteId={item.id} />}
      </View>
    );
  };

    return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      
      <BackgroundGradient>
        {/* Header */}
        <View style={styles.hero}>
          <View style={styles.heroGradient}>
           <View style={styles.heroContent}>
             <TouchableOpacity
               style={styles.backButton}
               onPress={() => router.back()}
             >
               <ArrowLeft size={24} color={Colors.neutral[700]} />
             </TouchableOpacity>
             <View style={styles.heroTextBlock}>
               <Text style={styles.heroTitle}>Notes</Text>
               <Text style={styles.heroSubtitle}>Capture your thoughts and insights</Text>
             </View>
             <TouchableOpacity
               style={styles.heroActionButton}
               onPress={createNewNote}
             >
               <Plus size={24} color={Colors.primary[600]} />
             </TouchableOpacity>
           </View>
                   </View>
        </View>

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
      <ScrollView
        style={styles.notesContainer}
        contentContainerStyle={styles.notesContent}
        showsVerticalScrollIndicator={false}
      >
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
           filteredNotes.map((note, index) => {
             // Double-check that note exists before rendering
             if (!note) {
               return null;
             }
             return (
               <View key={note.id || index}>
                 {renderNoteItem({ item: note })}
               </View>
             );
           })
         )}
      </ScrollView>

             {/* Note Modal */}
       <Modal
         visible={showNoteModal}
         animationType="slide"
         presentationStyle="pageSheet"
         onRequestClose={closeModal}
         statusBarTranslucent={true}
       >
        <SafeAreaView style={styles.modalContainer}>
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
              <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: Colors.glass.light, borderRadius: BorderRadius.md, padding: Spacing.sm }]}
                  onPress={() => setShowColorPicker(showColorPicker === 'modal' ? null : 'modal')}
                >
                  <Palette size={16} color={Colors.primary[600]} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={saveCurrentNote}
                >
                  <Save size={20} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.editButton}
                onPress={editNote}
              >
                <Edit3 size={20} color={Colors.primary[600]} />
              </TouchableOpacity>
            )}
          </View>

          {showColorPicker === 'modal' && <ColorPicker noteId={null} />}

                     <KeyboardAvoidingView
             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
             style={[styles.modalContent, {
               backgroundColor: currentNote?.backgroundColor || '#FFFFFF',
               overflow: 'hidden',
             }]}
             key={isEditing ? 'editing' : 'viewing'}
           >
           {currentNote && renderNoteBackground(currentNote)}
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
                         {[
                           '😊', '😂', '❤️', '👍', '🎉', '🔥', '✨', '💯', '🙏', '😍',
                           '😭', '🤔', '👏', '💪', '🎯', '🚀', '💡', '🌟', '💎', '🏆',
                           '📚', '✍️', '🎨', '🎵', '🍕', '☕', '🌺', '🌈', '⭐', '💫'
                         ].map((emoji, index) => (
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
                   <Text style={styles.noteViewDate}>
                     Created: {(savedNote || currentNote)?.createdAt.toLocaleDateString()}
                   </Text>
                   <Text style={styles.noteViewDate}>
                     Updated: {(savedNote || currentNote)?.updatedAt.toLocaleDateString()}
                   </Text>
                 </View>
               </>
             )}
          </KeyboardAvoidingView>
                 </SafeAreaView>
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
                     deleteNote(noteToDelete.id);
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
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
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
    paddingVertical: Spacing.lg,
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

   // Color picker styles
   colorPickerContainer: {
     backgroundColor: Colors.glass.cardDark,
     padding: Spacing.lg,
     borderRadius: BorderRadius['2xl'],
     marginBottom: Spacing.lg,
     ...Shadows.lg,
     borderWidth: 1,
     borderColor: Colors.glass.light,
   },
   colorPickerTitle: {
     fontSize: Typography.sizes.xl,
     fontWeight: Typography.weights.bold,
     color: Colors.neutral[800],
     marginBottom: Spacing.md,
     textAlign: 'center',
   },
   colorOptionsScroll: {
     paddingVertical: Spacing.sm,
     paddingHorizontal: Spacing.xs,
   },
   colorOption: {
     alignItems: 'center',
     marginRight: Spacing.lg,
     padding: Spacing.sm,
     borderRadius: BorderRadius.lg,
   },
   colorPreview: {
     width: 48,
     height: 48,
     borderRadius: BorderRadius.xl,
     marginBottom: Spacing.sm,
     borderWidth: 3,
     borderColor: Colors.white,
     ...Shadows.md,
   },
   colorOptionName: {
     fontSize: Typography.sizes.sm,
     color: Colors.neutral[700],
     fontWeight: Typography.weights.semiBold,
     textAlign: 'center',
     maxWidth: 60,
   },
 });
