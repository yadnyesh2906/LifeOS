import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '../../hooks/useAuth';
import { colors, radius, spacing, typography, shadows } from '../../theme';
import haptics from '../../utils/haptics';

interface ProfileCellProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  onPress: () => void;
  showChevron?: boolean;
  isDestructive?: boolean;
}

const ProfileCell: React.FC<ProfileCellProps> = ({
  icon,
  iconColor,
  label,
  onPress,
  showChevron = true,
  isDestructive = false,
}) => (
  <Pressable
    onPress={() => {
      haptics.light();
      onPress();
    }}
    style={({ pressed }) => [
      styles.cell,
      pressed && styles.cellPressed,
    ]}
  >
    <View style={styles.cellLeft}>
      <View style={[styles.cellIconContainer, { backgroundColor: iconColor + '15' }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={[styles.cellLabel, isDestructive && { color: colors.light.danger }]}>{label}</Text>
    </View>
    {showChevron && (
      <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
    )}
  </Pressable>
);

export default function Profile() {
  const { user, logout } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* User Card */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user?.fullName)}</Text>
          </View>
          <Text style={styles.name}>{user?.fullName || 'Productive User'}</Text>
          <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
        </View>

        {/* Settings Group */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Preferences</Text>
          <View style={styles.cellGroup}>
            <ProfileCell
              icon="person-outline"
              iconColor="#007AFF"
              label="Account Details"
              onPress={() => {}}
            />
            <ProfileCell
              icon="notifications-outline"
              iconColor="#FF9500"
              label="Push Notifications"
              onPress={() => {}}
            />
            <ProfileCell
              icon="moon-outline"
              iconColor="#5856D6"
              label="Theme & Appearance"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Support Group */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Support</Text>
          <View style={styles.cellGroup}>
            <ProfileCell
              icon="help-circle-outline"
              iconColor="#34C759"
              label="Help Center"
              onPress={() => {}}
            />
            <ProfileCell
              icon="shield-checkmark-outline"
              iconColor="#AF52DE"
              label="Privacy Policy"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Actions Group */}
        <View style={styles.section}>
          <View style={styles.cellGroup}>
            <ProfileCell
              icon="log-out-outline"
              iconColor={colors.light.danger}
              label="Log Out"
              onPress={logout}
              showChevron={false}
              isDestructive={true}
            />
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  container: {
    flex: 1,
    padding: spacing.md,
  },
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.light.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: typography.weights.bold,
    color: colors.light.primary,
  },
  name: {
    fontSize: typography.sizes.title3,
    fontWeight: typography.weights.bold,
    color: '#000000',
  },
  email: {
    fontSize: typography.sizes.subheadline,
    color: '#8E8E93',
    marginTop: 2,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    fontSize: typography.sizes.caption1,
    fontWeight: typography.weights.semibold,
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
    marginLeft: spacing.sm,
    letterSpacing: 0.5,
  },
  cellGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.sm,
  },
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  cellPressed: {
    backgroundColor: '#E5E5EA',
  },
  cellLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cellLabel: {
    fontSize: typography.sizes.body,
    color: '#000000',
  },
});
