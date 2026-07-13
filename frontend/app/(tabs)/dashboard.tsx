import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '../../hooks/useAuth';
import dashboardService from '../../services/dashboardService';
import moodService from '../../services/moodService';
import { DashboardDTO } from '../../types/Dashboard';
import { colors, radius, spacing, typography, shadows } from '../../theme';
import haptics from '../../utils/haptics';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  progress?: number;
  showFire?: boolean;
  onPress: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconColor,
  progress,
  showFire,
  onPress,
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.card,
      pressed && styles.cardPressed,
    ]}
  >
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={[styles.cardIconContainer, { backgroundColor: iconColor + '15' }]}>
        <Ionicons name={icon} size={16} color={iconColor} />
      </View>
    </View>
    
    <View style={styles.cardContent}>
      <Text style={styles.cardValue}>{value}</Text>
      {showFire && (
        <View style={styles.fireBadge}>
          <Ionicons name="flame" size={12} color="#FF3B30" />
          <Text style={styles.fireBadgeText}>Streak</Text>
        </View>
      )}
    </View>

    {progress !== undefined && (
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { backgroundColor: iconColor, width: `${Math.min(1, Math.max(0, progress)) * 100}%` }]} />
        </View>
      </View>
    )}

    {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
  </Pressable>
);

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const moodOptions = [
    { emoji: '😢', state: 'SAD', label: 'Sad' },
    { emoji: '😐', state: 'NEUTRAL', label: 'Neutral' },
    { emoji: '😊', state: 'HAPPY', label: 'Happy' },
    { emoji: '⚡', state: 'PRODUCTIVE', label: 'Active' },
  ];

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardService.getDashboardData();
      if (response.success && response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    haptics.light();
    fetchDashboardData();
  }, []);

  const logMoodState = async (moodType: string) => {
    haptics.success();
    try {
      await moodService.createMood({ moodState: moodType, notes: 'Logged from Dashboard Quick Action' });
      await fetchDashboardData();
    } catch (error) {
      console.error('Error logging mood from dashboard:', error);
    }
  };

  const handleMoodPress = () => {
    haptics.light();
    router.push('/mood');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getGreetingMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Rise and shine! Ready to capture the day? ☀️';
    if (hour < 17) return 'Keep up the momentum! You are doing great. ⚡';
    return 'Reflect on your achievements and wind down. 🌙';
  };

  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.light.primary} />
      </View>
    );
  }

  // Fallback default data in case connection is offline or API fails
  const stats = data || {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalHabits: 0,
    totalGoals: 0,
    completedGoals: 0,
    totalNotes: 0,
    totalJournals: 0,
    totalReminders: 0,
    todayMood: null,
  };

  const taskProgress = stats.totalTasks > 0 ? stats.completedTasks / stats.totalTasks : 0;
  const goalProgress = stats.totalGoals > 0 ? stats.completedGoals / stats.totalGoals : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.light.primary} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.name}>{user?.fullName || 'Productive User'}</Text>
          </View>
          <View style={styles.dateBadge}>
            <Ionicons name="calendar-outline" size={14} color={colors.light.primary} />
            <Text style={styles.dateText}>{getFormattedDate()}</Text>
          </View>
        </View>

        {/* Dynamic Motivation Card */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationText}>{getGreetingMessage()}</Text>
        </View>

        {/* Mood Section */}
        <View style={styles.moodCard}>
          <Pressable onPress={handleMoodPress} style={styles.moodHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.moodTitle}>{"Today's Mood"}</Text>
              <Text style={styles.moodSubtitle}>
                {stats.todayMood ? `You are feeling ${stats.todayMood.toLowerCase()} today.` : 'How are you feeling today?'}
              </Text>
            </View>
            <View style={styles.moodEmojiContainer}>
              <Text style={styles.moodEmoji}>
                {stats.todayMood === 'HAPPY' ? '😊' : stats.todayMood === 'SAD' ? '😢' : stats.todayMood === 'PRODUCTIVE' ? '⚡' : '😐'}
              </Text>
            </View>
          </Pressable>

          {!stats.todayMood ? (
            <View style={styles.moodSelectorRow}>
              {moodOptions.map((opt) => (
                <Pressable
                  key={opt.state}
                  onPress={() => logMoodState(opt.state)}
                  style={({ pressed }) => [
                    styles.moodOptionButton,
                    pressed && styles.moodOptionButtonPressed,
                  ]}
                >
                  <Text style={styles.moodOptionEmoji}>{opt.emoji}</Text>
                  <Text style={styles.moodOptionLabel}>{opt.label}</Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.loggedMoodRow}>
              <Text style={styles.loggedMoodText}>
                Energy registered: <Text style={styles.boldText}>{stats.todayMood}</Text>
              </Text>
              <Pressable onPress={handleMoodPress} style={styles.editMoodBtn}>
                <Text style={styles.editMoodBtnText}>Update</Text>
              </Pressable>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Summary Metrics</Text>

        <View style={styles.grid}>
          <View style={styles.row}>
            <View style={styles.gridItem}>
              <StatCard
                title="Tasks"
                value={`${stats.completedTasks}/${stats.totalTasks}`}
                subtitle={`${stats.pendingTasks} pending`}
                icon="checkbox-outline"
                iconColor="#007AFF"
                progress={taskProgress}
                onPress={() => {
                  haptics.light();
                  router.push('/tasks');
                }}
              />
            </View>
            <View style={styles.gridItem}>
              <StatCard
                title="Goals"
                value={`${stats.completedGoals}/${stats.totalGoals}`}
                subtitle={`${stats.totalGoals - stats.completedGoals} in progress`}
                icon="trophy-outline"
                iconColor="#FF9500"
                progress={goalProgress}
                onPress={() => {
                  haptics.light();
                  router.push('/goals');
                }}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.gridItem}>
              <StatCard
                title="Active Habits"
                value={stats.totalHabits}
                subtitle="daily routines"
                icon="flame-outline"
                iconColor="#FF3B30"
                showFire={stats.totalHabits > 0}
                onPress={() => {
                  haptics.light();
                  router.push('/habits');
                }}
              />
            </View>
            <View style={styles.gridItem}>
              <StatCard
                title="Reminders"
                value={stats.totalReminders}
                subtitle="upcoming alerts"
                icon="alarm-outline"
                iconColor="#34C759"
                onPress={() => {
                  haptics.light();
                  router.push('/reminder');
                }}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.gridItem}>
              <StatCard
                title="Notes"
                value={stats.totalNotes}
                subtitle="saved ideas"
                icon="document-text-outline"
                iconColor="#5856D6"
                onPress={() => {
                  haptics.light();
                  router.push('/notes');
                }}
              />
            </View>
            <View style={styles.gridItem}>
              <StatCard
                title="Journals"
                value={stats.totalJournals}
                subtitle="reflections"
                icon="book-outline"
                iconColor="#AF52DE"
                onPress={() => {
                  haptics.light();
                  router.push('/journal');
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FE',
  },
  container: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
    color: '#8E8E93',
  },
  name: {
    fontSize: typography.sizes.title1,
    fontWeight: typography.weights.bold,
    color: '#1C1C1E',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#EBF0FF',
    ...shadows.xs,
  },
  dateText: {
    fontSize: typography.sizes.footnote,
    fontWeight: typography.weights.semibold,
    color: colors.light.primary,
    marginLeft: 4,
  },
  motivationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#EBF0FF',
    ...shadows.sm,
  },
  motivationText: {
    fontSize: typography.sizes.subheadline,
    color: '#3A3A3C',
    lineHeight: 20,
    fontWeight: typography.weights.medium,
  },
  moodCard: {
    backgroundColor: '#F4F3FF',
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E0FF',
    ...shadows.sm,
  },
  moodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodTitle: {
    fontSize: typography.sizes.headline,
    fontWeight: typography.weights.bold,
    color: '#1C1C1E',
  },
  moodSubtitle: {
    fontSize: typography.sizes.footnote,
    color: '#636366',
    marginTop: 2,
    lineHeight: 18,
  },
  moodEmojiContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E0FF',
  },
  moodEmoji: {
    fontSize: 26,
  },
  moodSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(94, 92, 230, 0.1)',
  },
  moodOptionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  moodOptionButtonPressed: {
    backgroundColor: 'transparent',
    transform: [{ scale: 0.9 }],
  },
  moodOptionEmoji: {
    fontSize: 26,
    marginBottom: 4,
  },
  moodOptionLabel: {
    fontSize: 10,
    color: '#636366',
    fontWeight: typography.weights.semibold,
    textTransform: 'uppercase',
  },
  loggedMoodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(94, 92, 230, 0.08)',
  },
  loggedMoodText: {
    fontSize: typography.sizes.footnote,
    color: '#3A3A3C',
  },
  boldText: {
    fontWeight: typography.weights.bold,
    color: colors.light.accent,
  },
  editMoodBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.sm,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0FF',
  },
  editMoodBtnText: {
    fontSize: typography.sizes.caption1,
    color: colors.light.accent,
    fontWeight: typography.weights.semibold,
  },
  sectionTitle: {
    fontSize: typography.sizes.title3,
    fontWeight: typography.weights.bold,
    color: '#1C1C1E',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  grid: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  gridItem: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.md,
    minHeight: 125,
    borderWidth: 1,
    borderColor: '#EBF0FF',
    justifyContent: 'space-between',
    ...shadows.sm,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  cardValue: {
    fontSize: 26,
    fontWeight: typography.weights.bold,
    color: '#1C1C1E',
    letterSpacing: -0.5,
  },
  fireBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B3010',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: radius.sm,
  },
  fireBadgeText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: '#FF3B30',
    marginLeft: 2,
  },
  progressContainer: {
    marginTop: spacing.sm,
    width: '100%',
  },
  progressBarBg: {
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#F2F2F7',
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2.5,
  },
  cardSubtitle: {
    fontSize: typography.sizes.caption1,
    color: '#8E8E93',
    marginTop: spacing.xs,
  },
});
