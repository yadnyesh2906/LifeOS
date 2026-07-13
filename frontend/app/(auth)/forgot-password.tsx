import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { colors, spacing, typography } from '../../theme';
import haptics from '../../utils/haptics';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    setEmailError('');
    if (!email) {
      haptics.error();
      setEmailError('Email is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      haptics.error();
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    haptics.light();
    // Simulate reset request
    setTimeout(() => {
      setIsLoading(false);
      haptics.success();
      Alert.alert(
        'Email Sent',
        'If an account exists for this email, we have sent instructions to reset your password.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={colors.light.primary} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <View style={styles.header}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>{"Enter your email address and we'll send you instructions to reset your password."}</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="example@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              iconName="mail-outline"
              value={email}
              onChangeText={setEmail}
              error={emailError}
            />
          </View>

          <View style={styles.footer}>
            <Button
              title="Send Instructions"
              onPress={handleResetPassword}
              isLoading={isLoading}
              style={styles.submitBtn}
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginLeft: -spacing.sm,
  },
  backText: {
    fontSize: typography.sizes.body,
    color: colors.light.primary,
  },
  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.sizes.largeTitle,
    fontWeight: typography.weights.bold,
    color: '#000000',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: typography.sizes.subheadline,
    color: '#8E8E93',
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  form: {
    marginBottom: spacing.lg,
  },
  footer: {
    marginTop: spacing.xxl,
    alignItems: 'center',
  },
  submitBtn: {
    marginBottom: spacing.md,
  },
});
