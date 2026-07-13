import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import { colors, spacing, typography, radius } from '../../theme';
import haptics from '../../utils/haptics';

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const confirmPasswordRef = useRef<any>(null);

  const validateForm = () => {
    let isValid = true;
    setFullNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setFormError('');

    if (!fullName) {
      setFullNameError('Full name is required');
      isValid = false;
    }

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      haptics.error();
      return;
    }

    setIsLoading(true);
    try {
      await register(fullName, email, password);
      haptics.success();
      Alert.alert(
        'Success',
        'Account created successfully! Please sign in with your credentials.',
        [{ text: 'Sign In Now', onPress: () => router.replace('/(auth)/login') }]
      );
    } catch (error: any) {
      haptics.error();
      const message = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      setFormError(message);
    } finally {
      setIsLoading(false);
    }
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start tracking your habits and boosting your productivity.</Text>
          </View>

          {formError ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={20} color={colors.light.danger} style={styles.errorIcon} />
              <Text style={styles.errorText}>{formError}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="John Doe"
              autoCapitalize="words"
              autoCorrect={false}
              iconName="person-outline"
              value={fullName}
              onChangeText={setFullName}
              error={fullNameError}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              blurOnSubmit={false}
            />

            <Input
              ref={emailRef}
              label="Email"
              placeholder="example@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              iconName="mail-outline"
              value={email}
              onChangeText={setEmail}
              error={emailError}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
            />

            <Input
              ref={passwordRef}
              label="Password"
              placeholder="Min. 6 characters"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              iconName="lock-closed-outline"
              value={password}
              onChangeText={setPassword}
              error={passwordError}
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              blurOnSubmit={false}
            />

            <Input
              ref={confirmPasswordRef}
              label="Confirm Password"
              placeholder="Repeat your password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              iconName="lock-closed-outline"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={confirmPasswordError}
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />
          </View>

          <View style={styles.footer}>
            <Button
              title="Sign Up"
              onPress={handleRegister}
              isLoading={isLoading}
              style={styles.submitBtn}
            />

            <View style={styles.signInContainer}>
              <Text style={styles.signInLabel}>Already have an account? </Text>
              <Pressable onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.signInLink}>Sign In</Text>
              </Pressable>
            </View>
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
    marginBottom: spacing.md,
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
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.danger + '10',
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.light.danger + '30',
  },
  errorIcon: {
    marginRight: spacing.sm,
  },
  errorText: {
    fontSize: typography.sizes.footnote,
    fontWeight: typography.weights.medium,
    color: colors.light.danger,
    flex: 1,
  },
  form: {
    marginBottom: spacing.lg,
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  submitBtn: {
    marginBottom: spacing.md,
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  signInLabel: {
    fontSize: typography.sizes.footnote,
    color: '#8E8E93',
  },
  signInLink: {
    fontSize: typography.sizes.footnote,
    color: colors.light.primary,
    fontWeight: typography.weights.bold,
  },
});
