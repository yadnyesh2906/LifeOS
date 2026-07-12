import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import { colors, spacing, typography } from '../../theme';
import haptics from '../../utils/haptics';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setFormError('');

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

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      haptics.error();
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      haptics.success();
    } catch (error: any) {
      haptics.error();
      // Parse error response
      const message = error.response?.data?.message || error.message || 'Failed to sign in. Please check your credentials.';
      setFormError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={colors.light.primary} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue tracking your productivity.</Text>
          </View>

          {formError ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={20} color={colors.light.danger} style={styles.errorIcon} />
              <Text style={styles.errorText}>{formError}</Text>
            </View>
          ) : null}

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

            <Input
              label="Password"
              placeholder="Min. 6 characters"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              iconName="lock-closed-outline"
              value={password}
              onChangeText={setPassword}
              error={passwordError}
            />

            <Pressable
              onPress={() => router.push('/(auth)/forgot-password')}
              style={styles.forgotPasswordContainer}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Button
              title="Sign In"
              onPress={handleLogin}
              isLoading={isLoading}
              style={styles.submitBtn}
            />

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpLabel}>Don't have an account? </Text>
              <Pressable onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.signUpLink}>Sign Up</Text>
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: -spacing.xs,
    padding: spacing.xs,
  },
  forgotPasswordText: {
    fontSize: typography.sizes.footnote,
    color: colors.light.primary,
    fontWeight: typography.weights.medium,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  submitBtn: {
    marginBottom: spacing.md,
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  signUpLabel: {
    fontSize: typography.sizes.footnote,
    color: '#8E8E93',
  },
  signUpLink: {
    fontSize: typography.sizes.footnote,
    color: colors.light.primary,
    fontWeight: typography.weights.bold,
  },
});
