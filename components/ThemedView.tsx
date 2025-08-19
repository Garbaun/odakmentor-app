import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  // Only apply backgroundColor when an explicit light/dark override is provided.
  // Otherwise keep transparent so parent backgrounds show (prevents dark patches).
  const computedStyle = (lightColor || darkColor)
    ? [{ backgroundColor }, style]
    : [style];

  return <View style={computedStyle} {...otherProps} />;
}
