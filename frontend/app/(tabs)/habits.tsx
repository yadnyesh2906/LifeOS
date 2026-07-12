import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useHabit from '../../hooks/useHabit';
import { Habit } from '../../types/Habit';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { colors, radius, spacing, typography, shadows } from '../../theme';
import haptics from '../../utils/haptics';

export default function Habits() {
  const { habits, isLoading, refetch, createHabit, updateHabit, completeHabit, deleteHabit } = useHabit();

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    refetch();
  }, []);

  const openAddModal = () => {
    setEditingHabit(null);
    setTitle('');
    setDescription('');
    setFrequency('Daily');
    setTitleError('');
    setModalVisible(true);
    haptics.light();
  };

  const openEditModal = (habit: Habit) => {
    setEditingHabit(habit);
    setTitle(habit.title);
    setDescription(''); // Backend DTO has description, we retrieve or set it empty
    setFrequency(habit.frequency);
    setTitleError('');
    setModalVisible(true);
    haptics.light();
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setTitleError('Habit name is required');
      haptics.error();
      return;
    }

    try {
      if (editingHabit) {
        await updateHabit(editingHabit.id, {
          title,
          description,
          frequency,
        });
      } else {
        await createHabit(title, description, frequency);
      }
      setModalVisible(false);
      haptics.success();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save habit');
    }
  };

  const handleToggleComplete = async (id: number) => {
    haptics.medium();
    try {
      await completeHabit(id);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to check in habit');
    }
  };

  const handleDelete = (id: number) => {
    haptics.warning();
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteHabit(id);
              haptics.success();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete habit');
            }
          },
        },
      ]
    );
  };

  const renderHabitItem = ({ item }: { item: Habit }) => (
    <View style={styles.habitCard}>
      <Pressable onPress={() => handleToggleComplete(item.id)} style={styles.checkBtn}>
        <Ionicons
          name={item.completedToday ? 'checkmark-circle' : 'ellipse-outline'}
          size={28}
          color={item.completedToday ? colors.light.success : '#C7C7CC'}
        />
      </Pressable>

      <Pressable onPress={() => openEditModal(item)} style={styles.habitDetails}>
        <Text style={[styles.habitTitle, item.completedToday && styles.habitCompletedText]}>
          {item.title}
        </Text>
        <Text style={styles.habitFreq}>{item.frequency}</Text>
      </Pressable>

      <View style={styles.rightSection}>
        {item.streak > 0 ? (
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 {item.streak}</Text>
          </View>
        ) : null}
        <Pressable onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={18} color={colors.light.danger} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={habits}
        keyExtractor={item => item.id.toString()}
        renderItem={renderHabitItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="flame-outline" size={64} color="#8E8E93" />
            <Text style={styles.emptyTitle}>Build New Habits</Text>
            <Text style={styles.emptyDescription}>
              Small daily changes compound into major results. Add a habit to start tracking.
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
              <Text style={styles.modalTitle}>{editingHabit ? 'Edit Habit' : 'New Habit'}</Text>
              <Pressable onPress={handleSave} style={styles.modalHeaderBtn}>
                <Text style={styles.modalSaveText}>Save</Text>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
              <Input
                label="Habit Name"
                placeholder="Morning Meditation, Read Books..."
                value={title}
                onChangeText={setTitle}
                error={titleError}
                autoFocus
              />

              <Input
                label="Description"
                placeholder="Why do you want to build this habit?"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                style={styles.multilineInput}
              />

              <Text style={styles.label}>Frequency</Text>
              <View style={styles.pickerContainer}>
                {['Daily', 'Weekly', 'Monthly'].map(f => (
                  <Pressable
                    key={f}
                    onPress={() => {
                      setFrequency(f);
                      haptics.light();
                    }}
                    style={[styles.pickerItem, frequency === f && styles.activePickerItem]}
                  >
                    <Text style={[styles.pickerItemText, frequency === f && styles.activePickerText]}>
                      {f}
                    </Text>
                  </Pressable>
                ))}
              </View>
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
  habitCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  checkBtn: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  habitDetails: {
    flex: 1,
  },
  habitTitle: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
    color: '#000000',
  },
  habitCompletedText: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  habitFreq: {
    fontSize: typography.sizes.subheadline,
    color: '#8E8E93',
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakBadge: {
    backgroundColor: '#FF9500' + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.lg,
    marginRight: spacing.sm,
  },
  streakText: {
    fontSize: typography.sizes.footnote,
    fontWeight: typography.weights.bold,
    color: '#FF9500',
  },
  deleteBtn: {
    padding: spacing.sm,
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
    height: 80,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },
  label: {
    fontSize: typography.sizes.footnote,
    fontWeight: typography.weights.medium,
    color: '#8E8E93',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingLeft: spacing.xs,
    marginTop: spacing.sm,
  },
  pickerContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    padding: 2,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
  },
  pickerItem: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.lg - 2,
  },
  activePickerItem: {
    backgroundColor: '#FFFFFF',
    ...shadows.sm,
  },
  pickerItemText: {
    fontSize: typography.sizes.footnote,
    fontWeight: typography.weights.medium,
    color: '#8E8E93',
  },
  activePickerText: {
    color: '#000000',
    fontWeight: typography.weights.bold,
  },
});
