import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Modal, ScrollView, KeyboardAvoidingView, Platform, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useJournal from '../../hooks/useJournal';
import { Journal } from '../../types/Journal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { colors, radius, spacing, typography, shadows } from '../../theme';
import formatter from '../../utils/formatter';
import haptics from '../../utils/haptics';

export default function JournalScreen() {
  const { journals, isLoading, refetch, createJournal, updateJournal, deleteJournal } = useJournal();

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');

  useEffect(() => {
    refetch();
  }, []);

  const openAddModal = () => {
    setSelectedJournal(null);
    setTitle('');
    setContent('');
    setTitleError('');
    setContentError('');
    setModalVisible(true);
    haptics.light();
  };

  const openViewModal = (journal: Journal) => {
    setSelectedJournal(journal);
    setViewModalVisible(true);
    haptics.light();
  };

  const openEditFromView = () => {
    if (!selectedJournal) return;
    setTitle(selectedJournal.title);
    setContent(selectedJournal.content);
    setTitleError('');
    setContentError('');
    setViewModalVisible(false);
    setModalVisible(true);
    haptics.light();
  };

  const handleSave = async () => {
    let isValid = true;
    setTitleError('');
    setContentError('');

    if (!title.trim()) {
      setTitleError('Title is required');
      isValid = false;
    }
    if (!content.trim()) {
      setContentError('Content cannot be empty');
      isValid = false;
    }

    if (!isValid) {
      haptics.error();
      return;
    }

    try {
      if (selectedJournal) {
        // Edit mode
        await updateJournal(selectedJournal.id, { title, content });
      } else {
        // Add mode
        await createJournal(title, content);
      }
      setModalVisible(false);
      haptics.success();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save journal');
    }
  };

  const handleDelete = (id: number) => {
    haptics.warning();
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteJournal(id);
              setViewModalVisible(false);
              haptics.success();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete entry');
            }
          },
        },
      ]
    );
  };

  const renderJournalItem = ({ item }: { item: Journal }) => (
    <Pressable onPress={() => openViewModal(item)} style={styles.journalCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.journalTitle}>{item.title}</Text>
        <Text style={styles.journalDate}>{formatter.formatDate(item.createdAt)}</Text>
      </View>
      <Text style={styles.journalSnippet} numberOfLines={3}>
        {item.content}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={journals}
        keyExtractor={item => item.id.toString()}
        renderItem={renderJournalItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={64} color="#8E8E93" />
            <Text style={styles.emptyTitle}>Your Mindful Space</Text>
            <Text style={styles.emptyDescription}>
              Reflection is the key to clarity. Log your first journal entry to store your thoughts.
            </Text>
          </View>
        }
      />

      {/* Floating Add Button */}
      <Pressable onPress={openAddModal} style={styles.fab}>
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </Pressable>

      {/* View Modal */}
      <Modal visible={viewModalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setViewModalVisible(false)}>
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setViewModalVisible(false)} style={styles.modalHeaderBtn}>
              <Text style={styles.modalCancelText}>Close</Text>
            </Pressable>
            <Text style={styles.modalTitle}>Reflections</Text>
            <Pressable onPress={openEditFromView} style={styles.modalHeaderBtn}>
              <Text style={styles.modalSaveText}>Edit</Text>
            </Pressable>
          </View>

          {selectedJournal && (
            <ScrollView contentContainerStyle={styles.viewContent}>
              <Text style={styles.viewTitle}>{selectedJournal.title}</Text>
              <Text style={styles.viewDate}>{formatter.formatDate(selectedJournal.createdAt)}</Text>
              <Text style={styles.viewBody}>{selectedJournal.content}</Text>

              <Button
                title="Delete Entry"
                variant="danger"
                onPress={() => handleDelete(selectedJournal.id)}
                style={styles.deleteBtn}
              />
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>

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
              <Text style={styles.modalTitle}>{selectedJournal ? 'Edit Entry' : 'Write Reflections'}</Text>
              <Pressable onPress={handleSave} style={styles.modalHeaderBtn}>
                <Text style={styles.modalSaveText}>Save</Text>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
              <Input
                label="Entry Title"
                placeholder="Morning Thoughts, Today's Wins..."
                value={title}
                onChangeText={setTitle}
                error={titleError}
                autoFocus
              />

              <Input
                label="What's on your mind?"
                placeholder="Start writing..."
                value={content}
                onChangeText={setContent}
                error={contentError}
                multiline
                numberOfLines={10}
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
    padding: spacing.md,
    paddingBottom: 80,
  },
  journalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  journalTitle: {
    fontSize: typography.sizes.headline,
    fontWeight: typography.weights.bold,
    color: '#000000',
    flex: 1,
    marginRight: spacing.sm,
  },
  journalDate: {
    fontSize: typography.sizes.caption1,
    color: '#8E8E93',
  },
  journalSnippet: {
    fontSize: typography.sizes.subheadline,
    color: '#8E8E93',
    lineHeight: 18,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
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
    paddingHorizontal: spacing.md,
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
    height: 220,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },
  viewContent: {
    padding: spacing.xl,
  },
  viewTitle: {
    fontSize: typography.sizes.title1,
    fontWeight: typography.weights.bold,
    color: '#000000',
    letterSpacing: -0.5,
  },
  viewDate: {
    fontSize: typography.sizes.subheadline,
    color: '#8E8E93',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  viewBody: {
    fontSize: typography.sizes.body,
    color: '#333333',
    lineHeight: 24,
    marginBottom: spacing.xxl,
  },
  deleteBtn: {
    marginTop: spacing.xl,
  },
});
