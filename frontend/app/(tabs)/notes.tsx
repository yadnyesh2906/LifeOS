import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Modal, ScrollView, KeyboardAvoidingView, Platform, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useNote from '../../hooks/useNote';
import { Note } from '../../types/Note';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { colors, radius, spacing, typography, shadows } from '../../theme';
import formatter from '../../utils/formatter';
import haptics from '../../utils/haptics';

export default function NotesScreen() {
  const { notes, isLoading, refetch, createNote, updateNote, deleteNote } = useNote();

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    refetch();
  }, []);

  const openAddModal = () => {
    setEditingNote(null);
    setTitle('');
    setContent('');
    setTitleError('');
    setModalVisible(true);
    haptics.light();
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setTitleError('');
    setModalVisible(true);
    haptics.light();
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setTitleError('Title is required');
      haptics.error();
      return;
    }

    try {
      if (editingNote) {
        await updateNote(editingNote.id, { title, content });
      } else {
        await createNote(title, content);
      }
      setModalVisible(false);
      haptics.success();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save note');
    }
  };

  const handleDelete = (id: number) => {
    haptics.warning();
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(id);
              setModalVisible(false);
              haptics.success();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete note');
            }
          },
        },
      ]
    );
  };

  const renderNoteItem = ({ item }: { item: Note }) => (
    <Pressable onPress={() => openEditModal(item)} style={styles.noteCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.noteTitle} numberOfLines={1}>{item.title}</Text>
        <Pressable
          onPress={() => handleDelete(item.id)}
          style={styles.deleteBtn}
        >
          <Ionicons name="trash-outline" size={16} color={colors.light.danger} />
        </Pressable>
      </View>
      <Text style={styles.noteSnippet} numberOfLines={4}>
        {item.content || 'Empty note'}
      </Text>
      <Text style={styles.noteDate}>{formatter.formatDate(item.createdAt)}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={notes}
        keyExtractor={item => item.id.toString()}
        renderItem={renderNoteItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#8E8E93" />
            <Text style={styles.emptyTitle}>Capture Ideas</Text>
            <Text style={styles.emptyDescription}>
              Never let an idea slip away. Jot down lists, drafts, or reminders quickly.
            </Text>
          </View>
        }
      />

      {/* Floating Add Button */}
      <Pressable onPress={openAddModal} style={styles.fab}>
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </Pressable>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={styles.modalSafeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalKeyboard}
          >
            <View style={styles.modalHeader}>
              <Pressable onPress={() => setModalVisible(false)} style={styles.modalHeaderBtn}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Text style={styles.modalTitle}>{editingNote ? 'Edit Note' : 'New Note'}</Text>
              <Pressable onPress={handleSave} style={styles.modalHeaderBtn}>
                <Text style={styles.modalSaveText}>Save</Text>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
              <Input
                label="Note Title"
                placeholder="Meeting Notes, Groceries list..."
                value={title}
                onChangeText={setTitle}
                error={titleError}
                autoFocus
              />

              <Input
                label="Content"
                placeholder="Start typing..."
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={12}
                style={styles.multilineInput}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  listContainer: {
    padding: spacing.sm,
    paddingBottom: 80,
  },
  row: {
    justifyContent: 'space-between',
  },
  noteCard: {
    flex: 0.485,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    minHeight: 140,
    justifyContent: 'space-between',
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  noteTitle: {
    fontSize: typography.sizes.headline,
    fontWeight: typography.weights.bold,
    color: '#000000',
    flex: 1,
  },
  deleteBtn: {
    padding: 2,
    marginLeft: 4,
  },
  noteSnippet: {
    fontSize: typography.sizes.subheadline,
    color: '#8E8E93',
    lineHeight: 18,
    flex: 1,
  },
  noteDate: {
    fontSize: typography.sizes.caption2,
    color: '#AEAEB2',
    marginTop: spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    width: '200%', // Take full width across 2 columns
    left: '-50%',
  },
  emptyTitle: {
    fontSize: typography.sizes.title3,
    fontWeight: typography.weights.bold,
    color: '#8E8E93',
    marginTop: spacing.md,
  },
  emptyDescription: {
    fontSize: typography.sizes.body,
    color: '#AEAEB2',
    textAlign: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xl,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  modalKeyboard: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#C6C6C8',
  },
  modalHeaderBtn: {
    padding: spacing.xs,
  },
  modalCancelText: {
    fontSize: typography.sizes.body,
    color: colors.light.primary,
  },
  modalSaveText: {
    fontSize: typography.sizes.body,
    color: colors.light.primary,
    fontWeight: typography.weights.bold,
  },
  modalTitle: {
    fontSize: typography.sizes.headline,
    fontWeight: typography.weights.bold,
    color: '#000000',
  },
  modalContent: {
    padding: spacing.md,
  },
  multilineInput: {
    height: 250,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },
});
