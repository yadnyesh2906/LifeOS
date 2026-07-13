import React, { useState } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import haptics from '../../utils/haptics';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'text';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const [scaleAnim] = useState(() => new Animated.Value(1));

  const handlePressIn = () => {
    if (disabled || isLoading) return;
    haptics.light();
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || isLoading) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const getStyles = () => {
    // We assume light mode as base for login/signup, but can extend with context if needed.
    const isDark = false; // Force light mode theme for standard Auth screens for consistent look
    const themeColors = isDark ? colors.dark : colors.light;

    let buttonStyle: ViewStyle = {};
    let labelStyle: TextStyle = {};

    switch (variant) {
      case 'secondary':
        buttonStyle = {
          backgroundColor: themeColors.accent,
        };
        labelStyle = {
          color: '#FFFFFF',
        };
        break;
      case 'outline':
        buttonStyle = {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: themeColors.primary,
        };
        labelStyle = {
          color: themeColors.primary,
        };
        break;
      case 'danger':
        buttonStyle = {
          backgroundColor: themeColors.danger,
        };
        labelStyle = {
          color: '#FFFFFF',
        };
        break;
      case 'text':
        buttonStyle = {
          backgroundColor: 'transparent',
          paddingVertical: spacing.sm,
        };
        labelStyle = {
          color: themeColors.primary,
          fontSize: typography.sizes.subheadline,
        };
        break;
      case 'primary':
      default:
        buttonStyle = {
          backgroundColor: themeColors.primary,
        };
        labelStyle = {
          color: '#FFFFFF',
        };
        break;
    }

    if (disabled) {
      buttonStyle.opacity = 0.5;
    }

    return { buttonStyle, labelStyle };
  };

  const { buttonStyle, labelStyle } = getStyles();

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || isLoading}
        style={({ pressed }) => [
          styles.button,
          buttonStyle,
          style,
        ]}
      >
        {isLoading ? (
          <ActivityIndicator color={variant === 'outline' || variant === 'text' ? colors.light.primary : '#FFFFFF'} />
        ) : (
          <Text style={[styles.text, labelStyle, textStyle]}>{title}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: spacing.md,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'opacity 0.2s',
      },
    }),
  },
  text: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
    textAlign: 'center',
  },
});

export default Button;
