import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '../../hooks/useAuth';
import dashboardService from '../../services/dashboardService';
import { DashboardDTO } from '../../types/Dashboard';
import { colors, radius, spacing, typography, shadows } from '../../theme';
import haptics from '../../utils/haptics';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, iconColor }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={[styles.cardIconContainer, { backgroundColor: iconColor + '15' }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
    </View>
    <Text style={styles.cardValue}>{value}</Text>
    {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
  </View>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.light.primary} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()},</Text>
          <Text style={styles.name}>{user?.fullName || 'Productive User'}</Text>
        </View>

        {/* Mood Section */}
        <View style={styles.moodCard}>
          <View style={styles.moodHeader}>
            <View>
              <Text style={styles.moodTitle}>{"Today's Mood"}</Text>
              <Text style={styles.moodSubtitle}>
                {stats.todayMood ? `You are feeling ${stats.todayMood.toLowerCase()} today.` : 'How are you feeling today?'}
              </Text>
            </View>
            <View style={styles.moodEmojiContainer}>
              <Text style={styles.moodEmoji}>{stats.todayMood === 'HAPPY' ? '😊' : stats.todayMood === 'SAD' ? '😢' : stats.todayMood === 'PRODUCTIVE' ? '⚡' : '😐'}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Summary</Text>

        <View style={styles.grid}>
          <View style={styles.row}>
            <View style={styles.gridItem}>
              <StatCard
                title="Tasks"
                value={`${stats.completedTasks}/${stats.totalTasks}`}
                subtitle={`${stats.pendingTasks} pending`}
                icon="checkbox-outline"
                iconColor="#007AFF"
              />
            </View>
            <View style={styles.gridItem}>
              <StatCard
                title="Goals"
                value={`${stats.completedGoals}/${stats.totalGoals}`}
                subtitle="target milestones"
                icon="trophy-outline"
                iconColor="#FF9500"
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
              />
            </View>
            <View style={styles.gridItem}>
              <StatCard
                title="Reminders"
                value={stats.totalReminders}
                subtitle="upcoming alerts"
                icon="alarm-outline"
                iconColor="#34C759"
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
              />
            </View>
            <View style={styles.gridItem}>
              <StatCard
                title="Journals"
                value={stats.totalJournals}
                subtitle="daily reflections"
                icon="book-outline"
                iconColor="#AF52DE"
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
    backgroundColor: '#F2F2F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  container: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  greeting: {
    fontSize: typography.sizes.body,
    color: '#8E8E93',
  },
  name: {
    fontSize: typography.sizes.title1,
    fontWeight: typography.weights.bold,
    color: '#000000',
    letterSpacing: -0.5,
  },
  moodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.lg,
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
    color: '#000000',
  },
  moodSubtitle: {
    fontSize: typography.sizes.footnote,
    color: '#8E8E93',
    marginTop: 2,
  },
  moodEmojiContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: typography.sizes.title3,
    fontWeight: typography.weights.bold,
    color: '#000000',
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
    minHeight: 110,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  cardTitle: {
    fontSize: typography.sizes.footnote,
    fontWeight: typography.weights.semibold,
    color: '#8E8E93',
    textTransform: 'uppercase',
  },
  cardIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardValue: {
    fontSize: typography.sizes.title1,
    fontWeight: typography.weights.bold,
    color: '#000000',
    letterSpacing: -0.5,
  },
  cardSubtitle: {
    fontSize: typography.sizes.caption1,
    color: '#8E8E93',
    marginTop: 2,
  },
});
