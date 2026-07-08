/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0A0A0A', // Text Primary
    background: '#FAFAFA', // Background
    backgroundElement: '#FFFFFF', // Surface
    backgroundSelected: '#E8E8EC', // Border/Selected accent
    textSecondary: '#6B6B6B',
    primary: '#6366F1',
    primaryHover: '#4F46E5',
    secondary: '#20970B',
    neutral: '#9C9C9C',
    border: '#E8E8EC',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  dark: {
    text: '#FAFAFA', // Light text
    background: '#0B0B0C', // Dark near-black
    backgroundElement: '#18181A', // Dark surface
    backgroundSelected: '#2A2A2E',
    textSecondary: '#9C9C9C',
    primary: '#6366F1',
    primaryHover: '#4F46E5',
    secondary: '#20970B',
    neutral: '#9C9C9C',
    border: '#2E2E33',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
