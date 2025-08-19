/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    // Welcome page colors
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#ff9a9e',
    success: '#a8edea',
    warning: '#ffecd2',
    info: '#d299c2',
    surface: '#f8f9fa',
    card: '#ffffff',
    textPrimary: '#2d3748',
    textSecondary: '#4a5568',
    textMuted: '#718096',
    border: '#e2e8f0',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    // Welcome page colors
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#ff9a9e',
    success: '#a8edea',
    warning: '#ffecd2',
    info: '#d299c2',
    surface: '#1a202c',
    card: '#2d3748',
    textPrimary: '#f7fafc',
    textSecondary: '#e2e8f0',
    textMuted: '#a0aec0',
    border: '#4a5568',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
};
