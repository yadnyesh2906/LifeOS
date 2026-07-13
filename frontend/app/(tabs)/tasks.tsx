import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Modal, ScrollView, KeyboardAvoidingView, Platform, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTask from '../../hooks/useTask';
import { Task } from '../../types/Task';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { colors, radius, spacing, typography, shadows } from '../../theme';
import formatter from '../../utils/formatter';
import haptics from '../../utils/haptics';

export default function Tasks() {
  const { tasks, isLoading, refetch, createTask, updateTask, completeTask, deleteTask } = useTask();
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [titleError, setTitleError] = useState('');

  // Sync data on load
  useEffect(() => {
    refetch();
  }, [activeTab]);

  const filteredTasks = tasks.filter(t => (activeTab === 'completed' ? t.completed : !t.completed));

  const openAddModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    // Default to tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDueDate(tomorrow.toISOString().split('T')[0]);
    setTitleError('');
    setModalVisible(true);
    haptics.light();
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
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
      if (editingTask) {
        await updateTask(editingTask.id, {
          title,
          description,
          dueDate: dueDate ? `${dueDate}T12:00:00` : null,
        });
      } else {
        await createTask(title, description, dueDate ? `${dueDate}T12:00:00` : null);
      }
      setModalVisible(false);
      haptics.success();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save task');
    }
  };

  const handleToggleComplete = async (id: number) => {
    haptics.medium();
    try {
      await completeTask(id);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to toggle task completion');
    }
  };

  const handleDelete = (id: number) => {
    haptics.warning();
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(id);
              haptics.success();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <Pressable
      onPress={() => openEditModal(item)}
      style={({ pressed }) => [
        styles.taskCard,
        pressed && styles.taskCardPressed,
      ]}
    >
      <Pressable
        onPress={() => handleToggleComplete(item.id)}
        style={({ pressed }) => [
          styles.checkButton,
          pressed && { opacity: 0.7 },
        ]}
      >
        <Ionicons
          name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={26}
          color={item.completed ? colors.light.success : '#C7C7CC'}
        />
      </Pressable>

      <View style={styles.taskDetails}>
        <Text style={[styles.taskTitle, item.completed && styles.taskTitleCompleted]}>
          {item.title}
        </Text>
        {item.description ? (
          <Text style={styles.taskDescription} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
        {item.dueDate ? (
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={14} color="#8E8E93" style={styles.dateIcon} />
            <Text style={styles.dateText}>{formatter.formatDate(item.dueDate)}</Text>
          </View>
        ) : null}
      </View>

      <Pressable
        onPress={() => handleDelete(item.id)}
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && { opacity: 0.6 },
        ]}
      >
        <Ionicons name="trash-outline" size={20} color={colors.light.danger} />
      </Pressable>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Segmented Control */}
      <View style={styles.tabContainer}>
        <Pressable
          onPress={() => {
            setActiveTab('pending');
            haptics.light();
          }}
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            Pending
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setActiveTab('completed');
            haptics.light();
          }}
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed
          </Text>
        </Pressable>
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id.toString()}
        renderItem={renderTaskItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name={activeTab === 'completed' ? 'checkmark-done-circle-outline' : 'checkbox-outline'}
              size={64}
              color="#AEAEB2"
            />
            <Text style={styles.emptyTitle}>
              {activeTab === 'completed' ? 'No Completed Tasks' : 'All Tasks Done'}
            </Text>
            <Text style={styles.emptyDescription}>
              {activeTab === 'completed'
                ? 'Tasks you complete will show up here.'
                : 'Enjoy your productivity! Add a new task to plan your day.'}
            </Text>
          </View>
        }
      />

      {/* Add Floating Action Button */}
      <Pressable onPress={openAddModal} style={styles.fab}>
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </Pressable>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={styles.modalSafeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalKeyboard}
          >
            <View style={styles.modalHeader}>
              <Pressable onPress={() => setModalVisible(false)} style={styles.modalHeaderBtn}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Text style={styles.modalTitle}>{editingTask ? 'Edit Task' : 'New Task'}</Text>
              <Pressable onPress={handleSave} style={styles.modalHeaderBtn}>
                <Text style={styles.modalSaveText}>Save</Text>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Input
                label="Title"
                placeholder="Buy groceries, Code project..."
                value={title}
                onChangeText={setTitle}
                error={titleError}
                autoFocus
              />

              <Input
                label="Description"
                placeholder="Additional details..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                style={styles.multilineInput}
              />

              <Input
                label="Due Date (YYYY-MM-DD)"
                placeholder="e.g. 2026-07-25"
                value={dueDate}
                onChangeText={setDueDate}
                maxLength={10}
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
    backgroundColor: '#F8F9FE',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    borderRadius: radius.xl,
    padding: 3,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm - 2,
    alignItems: 'center',
    borderRadius: radius.xl - 2,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    ...shadows.xs,
  },
  tabText: {
    fontSize: typography.sizes.footnote,
    fontWeight: typography.weights.semibold,
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#1C1C1E',
    fontWeight: typography.weights.bold,
  },
  listContainer: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  taskCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EBF0FF',
    ...shadows.sm,
  },
  taskCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  checkButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    color: '#1C1C1E',
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#AEAEB2',
  },
  taskDescription: {
    fontSize: typography.sizes.subheadline,
    color: '#8E8E93',
    marginTop: 2,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs + 2,
  },
  dateIcon: {
    marginRight: 4,
  },
  dateText: {
    fontSize: typography.sizes.caption1,
    color: '#8E8E93',
    fontWeight: typography.weights.medium,
  },
  deleteButton: {
    padding: spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xl,
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
    backgroundColor: colors.light.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#F8F9FE',
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
    borderBottomWidth: 1,
    borderBottomColor: '#EBF0FF',
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
    color: '#1C1C1E',
  },
  modalContent: {
    padding: spacing.md,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },
});
