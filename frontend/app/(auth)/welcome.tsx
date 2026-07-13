import React from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/common/Button';
import { colors, spacing, typography } from '../../theme';

interface FeatureRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  iconColor: string;
}

const FeatureRow: React.FC<FeatureRowProps> = ({ icon, title, description, iconColor }) => (
  <View style={styles.featureRow}>
    <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
      <Ionicons name={icon} size={24} color={iconColor} />
    </View>
    <View style={styles.featureText}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appName}>LifeOS</Text>
          <Text style={styles.subtitle}>Your personal productivity command center.</Text>
        </View>

        <View style={styles.features}>
          <FeatureRow
            icon="checkbox-outline"
            iconColor="#007AFF" // Blue
            title="Tasks & Goals"
            description="Plan your day, set priorities, and track long-term goals easily."
          />
          <FeatureRow
            icon="flame-outline"
            iconColor="#FF9500" // Orange
            title="Habit Building"
            description="Form healthy daily routines and build streaks to keep yourself motivated."
          />
          <FeatureRow
            icon="journal-outline"
            iconColor="#5856D6" // Purple
            title="Mind & Mood"
            description="Log daily mood states and write reflective journal entries."
          />
        </View>

        <View style={styles.footer}>
          <Button
            title="Get Started"
            variant="primary"
            onPress={() => router.push('/(auth)/register')}
            style={styles.btn}
          />
          <Button
            title="Sign In"
            variant="text"
            onPress={() => router.push('/(auth)/login')}
            style={styles.signInBtn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  welcomeText: {
    fontSize: typography.sizes.title1,
    fontWeight: typography.weights.bold,
    color: '#000000',
    textAlign: 'center',
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.light.primary,
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: typography.sizes.body,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  features: {
    marginVertical: spacing.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: typography.sizes.headline,
    fontWeight: typography.weights.bold,
    color: '#000000',
  },
  featureDescription: {
    fontSize: typography.sizes.subheadline,
    color: '#8E8E93',
    marginTop: 2,
    lineHeight: 18,
  },
  footer: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  btn: {
    marginBottom: spacing.xs,
  },
  signInBtn: {
    marginTop: spacing.xs,
  },
});
