import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Edit3, Trash2, Plus, BookOpen, Tag, Palette, Check } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/DesignTokens';

const { width: screenWidth } = Dimensions.get('window');

interface StudyNote {
  id: string;
  reference: string;
  content: string;
  tags: string[];
  timestamp: number;
  lastModified: number;
  backgroundColor?: string;
  gradientColors?: string[];
}

interface BibleStudyNotesProps {
  notes: StudyNote[];
  onAddNote: (note: Omit<StudyNote, 'id' | 'timestamp' | 'lastModified'>) => void;
  onUpdateNote: (id: string, updates: Partial<StudyNote>) => void;
  onDeleteNote: (id: string) => void;
  onNotePress: (note: StudyNote) => void;
}

// Predefined background options using design tokens
const backgroundOptions = [
  { id: 'default', name: 'Default', type: 'color', value: Colors.glass.card },
  { id: 'spiritual', name: 'Spiritual', type: 'gradient', value: Colors.gradients.spiritual },
  { id: 'sunset', name: 'Sunset', type: 'gradient', value: Colors.gradients.etherealSunset },
  { id: 'ocean', name: 'Ocean', type: 'gradient', value: Colors.gradients.oceanBreeze },
  { id: 'nature', name: 'Nature', type: 'gradient', value: Colors.gradients.sacredGarden },
  { id: 'golden', name: 'Golden', type: 'gradient', value: Colors.gradients.goldenHour },
  { id: 'aurora', name: 'Aurora', type: 'gradient', value: Colors.gradients.aurora },
  { id: 'cosmic', name: 'Cosmic', type: 'gradient', value: Colors.gradients.cosmic },
  { id: 'light', name: 'Light', type: 'gradient', value: Colors.gradients.spiritualLight },
];

export const BibleStudyNotes: React.FC<BibleStudyNotesProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onNotePress,
}) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({
    reference: '',
    content: '',
    tags: [] as string[],
    backgroundColor: Colors.glass.card,
    gradientColors: undefined as string[] | undefined,
  });
  const [editingNote, setEditingNote] = useState<StudyNote | null>(null);

  const handleAddNote = () => {
    if (!newNote.reference.trim() || !newNote.content.trim()) {
      Alert.alert('Missing Information', 'Please fill in both reference and content.');
      return;
    }

    onAddNote(newNote);
    setNewNote({
      reference: '',
      content: '',
      tags: [],
      backgroundColor: Colors.glass.card,
      gradientColors: undefined
    });
    setIsAddingNote(false);
    setShowColorPicker(null);
  };

  const handleStartEdit = (note: StudyNote) => {
    setEditingNoteId(note.id);
    setEditingNote(note);
  };

  const handleSaveEdit = () => {
    if (!editingNote) return;

    onUpdateNote(editingNote.id, {
      content: editingNote.content,
      tags: editingNote.tags,
      lastModified: Date.now(),
    });

    setEditingNoteId(null);
    setEditingNote(null);
  };

  const handleDeleteNote = (id: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDeleteNote(id) },
      ]
    );
  };

  const addTag = (note: StudyNote, tag: string) => {
    if (tag.trim() && !note.tags.includes(tag.trim())) {
      const updatedTags = [...note.tags, tag.trim()];
      onUpdateNote(note.id, { tags: updatedTags, lastModified: Date.now() });
    }
  };

  const removeTag = (note: StudyNote, tagToRemove: string) => {
    const updatedTags = note.tags.filter(tag => tag !== tagToRemove);
    onUpdateNote(note.id, { tags: updatedTags, lastModified: Date.now() });
  };

  const handleBackgroundChange = (noteId: string | null, option: typeof backgroundOptions[0]) => {
    if (noteId) {
      // Updating existing note
      onUpdateNote(noteId, {
        backgroundColor: option.type === 'color' ? option.value as string : undefined,
        gradientColors: option.type === 'gradient' ? [...(option.value as readonly string[])] : undefined,
        lastModified: Date.now(),
      });
    } else {
      // Updating new note
      setNewNote(prev => ({
        ...prev,
        backgroundColor: option.type === 'color' ? option.value as string : Colors.glass.card,
        gradientColors: option.type === 'gradient' ? [...(option.value as readonly string[])] : undefined,
      }));
    }
    setShowColorPicker(null);
  };

  const renderNoteBackground = (note: StudyNote | typeof newNote) => {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📝 Study Notes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddingNote(!isAddingNote)}
        >
          <Plus size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {isAddingNote && (
        <View style={[styles.addNoteForm, { backgroundColor: newNote.backgroundColor, overflow: 'hidden' }]}>
          {renderNoteBackground(newNote)}
          <TextInput
            style={styles.input}
            placeholder="Bible Reference (e.g., John 3:16)"
            value={newNote.reference}
            onChangeText={(text) => setNewNote({ ...newNote, reference: text })}
          />
          <TextInput
            style={[styles.input, styles.contentInput]}
            placeholder="Write your study notes here..."
            value={newNote.content}
            onChangeText={(text) => setNewNote({ ...newNote, content: text })}
            multiline
            numberOfLines={4}
          />
          
          <View style={styles.formActions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: Colors.glass.light, borderRadius: BorderRadius.md, padding: Spacing.sm }]}
              onPress={() => setShowColorPicker(showColorPicker === 'new' ? null : 'new')}
            >
              <Palette size={16} color={Colors.primary[600]} />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setIsAddingNote(false);
                setShowColorPicker(null);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddNote}
            >
              <Text style={styles.saveButtonText}>Save Note</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showColorPicker === 'new' && <ColorPicker noteId={null} />}

      <ScrollView style={styles.notesList} showsVerticalScrollIndicator={false}>
        {notes.length === 0 ? (
          <View style={styles.emptyState}>
            <BookOpen size={48} color={Colors.neutral[400]} />
            <Text style={styles.emptyStateText}>No study notes yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start taking notes on your Bible study journey
            </Text>
          </View>
        ) : (
          notes.map((note) => (
            <View key={note.id}>
              <TouchableOpacity
                style={[
                  styles.noteItem,
                  {
                    backgroundColor: note.backgroundColor || Colors.glass.card,
                    overflow: 'hidden',
                  }
                ]}
                onPress={() => onNotePress(note)}
              >
                {renderNoteBackground(note)}
                <View style={styles.noteHeader}>
                  <Text style={styles.noteReference}>{note.reference}</Text>
                  <View style={styles.noteActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: Colors.glass.light, borderRadius: BorderRadius.sm }]}
                      onPress={() => setShowColorPicker(showColorPicker === note.id ? null : note.id)}
                    >
                      <Palette size={14} color={Colors.primary[600]} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleStartEdit(note)}
                    >
                      <Edit3 size={16} color={Colors.neutral[600]} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 size={16} color={Colors.error[500]} />
                    </TouchableOpacity>
                  </View>
                </View>

              {editingNoteId === note.id && editingNote ? (
                <View style={styles.editForm}>
                  <TextInput
                    style={[styles.input, styles.contentInput]}
                    value={editingNote.content}
                    onChangeText={(text) => setEditingNote({ ...editingNote, content: text })}
                    multiline
                    numberOfLines={4}
                  />
                  <View style={styles.formActions}>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={() => setEditingNoteId(null)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.saveButton}
                      onPress={handleSaveEdit}
                    >
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <>
                  <Text style={styles.noteContent} numberOfLines={3}>
                    {note.content}
                  </Text>
                  
                  {note.tags.length > 0 && (
                    <View style={styles.tagsContainer}>
                      {note.tags.map((tag, index) => (
                        <View key={index} style={styles.tag}>
                          <Tag size={12} color={Colors.primary[600]} />
                          <Text style={styles.tagText}>{tag}</Text>
                          <TouchableOpacity
                            onPress={() => removeTag(note, tag)}
                            style={styles.removeTagButton}
                          >
                            <Text style={styles.removeTagText}>×</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                  
                  <Text style={styles.noteTimestamp}>
                    {new Date(note.lastModified).toLocaleDateString()}
                  </Text>
                </>
              )}
              </TouchableOpacity>
              {showColorPicker === note.id && <ColorPicker noteId={note.id} />}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.xs,
  },
  title: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[800],
    letterSpacing: Typography.letterSpacing.tight,
  },
  addButton: {
    backgroundColor: Colors.primary[600],
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addNoteForm: {
    backgroundColor: Colors.glass.card,
    padding: Spacing.lg,
    borderRadius: BorderRadius['2xl'],
    marginBottom: Spacing.lg,
    ...Shadows.lg,
    borderWidth: 1,
    borderColor: Colors.glass.light,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: Typography.sizes.lg,
    color: Colors.neutral[800],
    marginBottom: Spacing.md,
    backgroundColor: Colors.glass.light,
    ...Shadows.xs,
  },
  contentInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
  cancelButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
  },
  cancelButtonText: {
    color: Colors.neutral[600],
    fontSize: 14,
    fontWeight: Typography.weights.medium,
  },
  saveButton: {
    backgroundColor: Colors.primary[600],
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: Typography.weights.medium,
  },
  notesList: {
    flex: 1,
  },
  noteItem: {
    backgroundColor: Colors.glass.card,
    padding: Spacing.lg,
    borderRadius: BorderRadius['2xl'],
    marginBottom: Spacing.lg,
    ...Shadows.md,
    borderWidth: 1,
    borderColor: Colors.glass.light,
    position: 'relative',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  noteReference: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.primary[600],
    letterSpacing: Typography.letterSpacing.tight,
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
  editForm: {
    marginTop: Spacing.sm,
  },
  noteContent: {
    fontSize: Typography.sizes.lg,
    color: Colors.neutral[700],
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.lg,
    marginBottom: Spacing.md,
    fontWeight: Typography.weights.regular,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[100],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    gap: Spacing.xs,
    ...Shadows.xs,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  tagText: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary[700],
    fontWeight: Typography.weights.semiBold,
  },
  removeTagButton: {
    marginLeft: Spacing.xs,
  },
  removeTagText: {
    color: Colors.error[500],
    fontSize: 14,
    fontWeight: Typography.weights.bold,
  },
  noteTimestamp: {
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[500],
    fontStyle: 'italic',
    textAlign: 'right',
    marginTop: Spacing.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['4xl'],
    backgroundColor: Colors.glass.cardSoft,
    borderRadius: BorderRadius['2xl'],
    margin: Spacing.md,
    ...Shadows.sm,
  },
  emptyStateText: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[800],
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: Typography.sizes.lg,
    color: Colors.neutral[600],
    textAlign: 'center',
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.lg,
    maxWidth: 280,
  },
  // Color picker styles
  colorPickerContainer: {
    backgroundColor: Colors.glass.cardSoft,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  colorPickerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semiBold,
    color: Colors.neutral[800],
    marginBottom: Spacing.sm,
  },
  colorOptionsScroll: {
    paddingVertical: Spacing.xs,
  },
  colorOption: {
    alignItems: 'center',
    marginRight: Spacing.md,
    padding: Spacing.xs,
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
    borderWidth: 2,
    borderColor: Colors.white,
    ...Shadows.xs,
  },
  colorOptionName: {
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[600],
    fontWeight: Typography.weights.medium,
    textAlign: 'center',
  },
});


