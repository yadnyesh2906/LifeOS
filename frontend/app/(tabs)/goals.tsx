import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../../theme';

export default function Goals() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.emptyContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="trophy-outline" size={64} color="#8E8E93" />
          </View>
          <Text style={styles.title}>Set Your Goals</Text>
          <Text style={styles.description}>Break down your long-term ambitions into manageable milestones.</Text>
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
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyContainer: {
    alignItems: 'center',
    maxWidth: 280,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.title3,
    fontWeight: typography.weights.bold,
    color: '#000000',
    textAlign: 'center',
  },
  description: {
    fontSize: typography.sizes.body,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
  },
});
