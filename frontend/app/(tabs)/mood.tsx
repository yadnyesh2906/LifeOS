import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useMood from '../../hooks/useMood';
import { Mood } from '../../types/Mood';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { colors, radius, spacing, typography, shadows } from '../../theme';
import formatter from '../../utils/formatter';
import haptics from '../../utils/haptics';

const MOODS_CONFIG = [
  { state: 'HAPPY', emoji: '😊', label: 'Happy', color: '#34C759' },
  { state: 'PRODUCTIVE', emoji: '⚡', label: 'Focus', color: '#007AFF' },
  { state: 'NEUTRAL', emoji: '😐', label: 'Neutral', color: '#8E8E93' },
  { state: 'SAD', emoji: '😢', label: 'Sad', color: '#FF3B30' },
];

export default function MoodScreen() {
  const { moods, isLoading, refetch, createMood, deleteMood } = useMood();
  const [selectedMood, setSelectedMood] = useState<string>('HAPPY');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    refetch();
  }, []);

  const handleLogMood = async () => {
    setIsSubmitting(true);
    haptics.medium();
    try {
      await createMood(selectedMood, note.trim() || null);
      setNote('');
      haptics.success();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to log mood');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: number) => {
    haptics.warning();
    Alert.alert(
      'Delete Log',
      'Are you sure you want to delete this mood entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMood(id);
              haptics.success();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete entry');
            }
          },
        },
      ]
    );
  };

  const getMoodConfig = (state: string) => {
    return MOODS_CONFIG.find(m => m.state === state) || MOODS_CONFIG[2];
  };

  const renderHeader = () => (
    <View style={styles.headerCard}>
      <Text style={styles.cardTitle}>How are you feeling today?</Text>
      
      <View style={styles.emojiRow}>
        {MOODS_CONFIG.map(m => (
          <Pressable
            key={m.state}
            onPress={() => {
              setSelectedMood(m.state);
              haptics.light();
            }}
            style={[
              styles.emojiBtn,
              selectedMood === m.state && { backgroundColor: m.color + '15', borderColor: m.color },
            ]}
          >
            <Text style={styles.emojiText}>{m.emoji}</Text>
            <Text style={[styles.emojiLabel, selectedMood === m.state && { color: m.color, fontWeight: '700' }]}>
              {m.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Input
        placeholder="Add an optional reflection note..."
        value={note}
        onChangeText={setNote}
        containerStyle={styles.noteInput}
      />

      <Button
        title="Log Mood"
        onPress={handleLogMood}
        isLoading={isSubmitting}
        style={styles.submitBtn}
      />
    </View>
  );

  const renderMoodItem = ({ item }: { item: Mood }) => {
    const config = getMoodConfig(item.moodState);
    return (
      <View style={styles.moodItem}>
        <View style={[styles.avatar, { backgroundColor: config.color + '15' }]}>
          <Text style={styles.avatarEmoji}>{config.emoji}</Text>
        </View>
        <View style={styles.moodDetails}>
          <Text style={styles.moodName}>{config.label}</Text>
          {item.note ? <Text style={styles.moodNote}>{item.note}</Text> : null}
          <Text style={styles.moodTime}>{formatter.formatDate(item.createdAt)}</Text>
        </View>
        <Pressable onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={16} color={colors.light.danger} />
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={moods}
        keyExtractor={item => item.id.toString()}
        renderItem={renderMoodItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Entries Logged</Text>
            <Text style={styles.emptyDescription}>
              Logging your daily mood helps track focus and productivity correlations.
            </Text>
          </View>
        }
      />
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
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  cardTitle: {
    fontSize: typography.sizes.headline,
    fontWeight: typography.weights.bold,
    color: '#000000',
    marginBottom: spacing.md,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.md,
  },
  emojiBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: 'transparent',
    marginHorizontal: 4,
  },
  emojiText: {
    fontSize: 28,
  },
  emojiLabel: {
    fontSize: typography.sizes.caption1,
    color: '#8E8E93',
    marginTop: 4,
    fontWeight: typography.weights.medium,
  },
  noteInput: {
    marginBottom: spacing.sm,
  },
  submitBtn: {
    height: 44,
  },
  moodItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarEmoji: {
    fontSize: 22,
  },
  moodDetails: {
    flex: 1,
  },
  moodName: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    color: '#000000',
  },
  moodNote: {
    fontSize: typography.sizes.subheadline,
    color: '#8E8E93',
    marginTop: 2,
  },
  moodTime: {
    fontSize: typography.sizes.caption1,
    color: '#AEAEB2',
    marginTop: 4,
  },
  deleteBtn: {
    padding: spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.sizes.title3,
    fontWeight: typography.weights.bold,
    color: '#8E8E93',
  },
  emptyDescription: {
    fontSize: typography.sizes.body,
    color: '#AEAEB2',
    textAlign: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xl,
  },
});
