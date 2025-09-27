import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { AuthProvider } from '@/contexts/AuthContext';
import { setColorSchemeOverride, useColorScheme } from '@/hooks/useColorScheme';
import { useEffect } from 'react';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Force light theme on native (Android/iOS); keep web unchanged
  useEffect(() => {
    if (Platform.OS !== 'web') {
      setColorSchemeOverride('light');
    }
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="ai/index" options={{ headerShown: false }} />
          <Stack.Screen name="coach/index" options={{ headerShown: false }} />
          <Stack.Screen name="progress/index" options={{ headerShown: false }} />
          <Stack.Screen name="privacy/index" options={{ headerShown: false }} />
          <Stack.Screen name="student/index" options={{ headerShown: false }} />
          <Stack.Screen name="teacher/index" options={{ headerShown: false }} />
          <Stack.Screen name="blog/index" options={{ headerShown: false }} />
          <Stack.Screen name="blog/[slug]" options={{ headerShown: false }} />
          <Stack.Screen name="about/index" options={{ headerShown: false }} />
          <Stack.Screen name="corporate/index" options={{ headerShown: false }} />
          <Stack.Screen name="video-conference/index" options={{ headerShown: false }} />
          <Stack.Screen name="video-conference/[roomId]" options={{ headerShown: false }} />
          <Stack.Screen name="video-conference/test" options={{ headerShown: false }} />
          <Stack.Screen 
            name="register/index" 
            options={{ 
              headerShown: false,
              presentation: 'transparentModal',
              animation: 'fade'
            }} 
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
