import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  secureTextEntry?: boolean;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  iconName,
  secureTextEntry = false,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handlePressContainer = () => {
    inputRef.current?.focus();
  };

  const themeColors = colors.light; // Base theme light

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <Pressable
        onPress={handlePressContainer}
        style={[
          styles.inputContainer,
          {
            borderColor: error
              ? themeColors.danger
              : isFocused
              ? themeColors.primary
              : 'transparent',
            backgroundColor: isFocused ? '#FFFFFF' : '#E9E9EB', // iOS light system grey
          },
          isFocused && styles.focusedShadow,
        ]}
      >
        {iconName && (
          <Ionicons
            name={iconName}
            size={20}
            color={error ? themeColors.danger : isFocused ? themeColors.primary : '#8E8E93'}
            style={styles.icon}
            onPress={handlePressContainer}
          />
        )}
        
        <TextInput
          ref={inputRef}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          placeholderTextColor="#8E8E93"
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            styles.input,
            { color: themeColors.text },
            style,
          ]}
          {...props}
        />

        {secureTextEntry && (
          <Pressable onPress={togglePasswordVisibility} style={styles.eyeButton}>
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#8E8E93"
            />
          </Pressable>
        )}
      </Pressable>

      {error && <Text style={[styles.errorText, { color: themeColors.danger }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.sizes.footnote,
    fontWeight: typography.weights.medium,
    color: '#8E8E93',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingLeft: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    paddingHorizontal: spacing.md,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  focusedShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 0 0 3px rgba(0, 122, 255, 0.15)',
      },
    }),
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.regular,
    padding: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  eyeButton: {
    padding: spacing.xs,
  },
  errorText: {
    fontSize: typography.sizes.caption1,
    marginTop: spacing.xs,
    paddingLeft: spacing.sm,
    fontWeight: typography.weights.medium,
  },
});

export default Input;
