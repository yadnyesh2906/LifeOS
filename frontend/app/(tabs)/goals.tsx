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
import useGoal from '../../hooks/useGoal';
import { Goal } from '../../types/Goal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { colors, radius, spacing, typography, shadows } from '../../theme';
import formatter from '../../utils/formatter';
import haptics from '../../utils/haptics';

export default function Goals() {
  const { goals, isLoading, refetch, createGoal, updateGoal, completeGoal, deleteGoal } = useGoal();

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [status, setStatus] = useState<'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'>('NOT_STARTED');
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    refetch();
  }, []);

  const openAddModal = () => {
    setEditingGoal(null);
    setTitle('');
    setDescription('');
    // Default target date to end of year
    const endOfYear = new Date(new Date().getFullYear(), 11, 31);
    setTargetDate(endOfYear.toISOString().split('T')[0]);
    setStatus('NOT_STARTED');
    setTitleError('');
    setModalVisible(true);
    haptics.light();
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setDescription(goal.description || '');
    setTargetDate(goal.targetDate ? goal.targetDate.split('T')[0] : '');
    setStatus(goal.status);
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
      if (editingGoal) {
        await updateGoal(editingGoal.id, {
          title,
          description,
          targetDate: targetDate ? `${targetDate}T23:59:59` : null,
          status,
        });
      } else {
        await createGoal(
          title,
          description,
          targetDate ? `${targetDate}T23:59:59` : null,
          status
        );
      }
      setModalVisible(false);
      haptics.success();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save goal');
    }
  };

  const handleToggleComplete = async (goal: Goal) => {
    haptics.medium();
    try {
      if (goal.status === 'COMPLETED') {
        // Toggle back to IN_PROGRESS
        await updateGoal(goal.id, { status: 'IN_PROGRESS' });
      } else {
        await completeGoal(goal.id);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to complete goal');
    }
  };

  const handleDelete = (id: number) => {
    haptics.warning();
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGoal(id);
              haptics.success();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete goal');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (goalStatus: string) => {
    switch (goalStatus) {
      case 'COMPLETED':
        return colors.light.success;
      case 'IN_PROGRESS':
        return colors.light.primary;
      case 'NOT_STARTED':
      default:
        return '#8E8E93';
    }
  };

  const renderGoalItem = ({ item }: { item: Goal }) => (
    <View style={styles.goalCard}>
      <View style={styles.goalHeader}>
        <View style={styles.titleContainer}>
          <Text style={[styles.goalTitle, item.status === 'COMPLETED' && styles.goalTitleCompleted]}>
            {item.title}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.replace('_', ' ')}
            </Text>
          </View>
        </View>
        <Pressable onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={18} color={colors.light.danger} />
        </Pressable>
      </View>

      {item.description ? (
        <Text style={styles.goalDescription} numberOfLines={2}>
          {item.description}
        </Text>
      ) : null}

      <View style={styles.goalFooter}>
        {item.targetDate ? (
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={14} color="#8E8E93" style={styles.dateIcon} />
            <Text style={styles.dateText}>Target: {formatter.formatDate(item.targetDate)}</Text>
          </View>
        ) : (
          <View />
        )}

        <View style={styles.actionRow}>
          <Pressable onPress={() => openEditModal(item)} style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit</Text>
          </Pressable>
          <Pressable
            onPress={() => handleToggleComplete(item)}
            style={[
              styles.completeBtn,
              { backgroundColor: item.status === 'COMPLETED' ? '#E5E5EA' : colors.light.primary },
            ]}
          >
            <Text style={[styles.completeBtnText, item.status === 'COMPLETED' && { color: '#8E8E93' }]}>
              {item.status === 'COMPLETED' ? 'Reopen' : 'Complete'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={goals}
        keyExtractor={item => item.id.toString()}
        renderItem={renderGoalItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={64} color="#8E8E93" />
            <Text style={styles.emptyTitle}>No Goals Found</Text>
            <Text style={styles.emptyDescription}>
              Dream big! Create your first milestone and track your long-term progress.
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
              <Text style={styles.modalTitle}>{editingGoal ? 'Edit Goal' : 'New Goal'}</Text>
              <Pressable onPress={handleSave} style={styles.modalHeaderBtn}>
                <Text style={styles.modalSaveText}>Save</Text>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
              <Input
                label="Goal Title"
                placeholder="Secure Internship, Save money..."
                value={title}
                onChangeText={setTitle}
                error={titleError}
                autoFocus
              />

              <Input
                label="Description"
                placeholder="Specific roadmap details..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                style={styles.multilineInput}
              />

              <Input
                label="Target Date (YYYY-MM-DD)"
                placeholder="e.g. 2026-12-31"
                value={targetDate}
                onChangeText={setTargetDate}
                maxLength={10}
              />

              <Text style={styles.label}>Status</Text>
              <View style={styles.pickerContainer}>
                {(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'] as const).map(s => (
                  <Pressable
                    key={s}
                    onPress={() => {
                      setStatus(s);
                      haptics.light();
                    }}
                    style={[
                      styles.pickerItem,
                      status === s && {
                        backgroundColor:
                          s === 'COMPLETED'
                            ? colors.light.success
                            : s === 'IN_PROGRESS'
                            ? colors.light.primary
                            : '#8E8E93',
                      },
                    ]}
                  >
                    <Text style={[styles.pickerItemText, status === s && { color: '#FFFFFF' }]}>
                      {s.replace('_', ' ')}
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
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalTitle: {
    fontSize: typography.sizes.headline,
    fontWeight: typography.weights.bold,
    color: '#000000',
    marginRight: spacing.sm,
  },
  goalTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  statusText: {
    fontSize: typography.sizes.caption2,
    fontWeight: typography.weights.bold,
  },
  deleteBtn: {
    padding: spacing.xs,
  },
  goalDescription: {
    fontSize: typography.sizes.subheadline,
    color: '#8E8E93',
    marginBottom: spacing.md,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 4,
  },
  dateText: {
    fontSize: typography.sizes.caption1,
    color: '#8E8E93',
    fontWeight: typography.weights.medium,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editBtn: {
    marginRight: spacing.md,
    padding: spacing.xs,
  },
  editBtnText: {
    fontSize: typography.sizes.footnote,
    color: colors.light.primary,
    fontWeight: typography.weights.semibold,
  },
  completeBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - 2,
    borderRadius: radius.lg,
  },
  completeBtnText: {
    fontSize: typography.sizes.footnote,
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
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
  pickerItemText: {
    fontSize: typography.sizes.footnote,
    fontWeight: typography.weights.semibold,
    color: '#8E8E93',
  },
});
