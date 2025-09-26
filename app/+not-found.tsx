import { Link, Stack } from 'expo-router';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { globalStyles } from '@/styles/globalStyles';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Sayfa Bulunamadı' }} />
      <ThemedView style={styles.container}>
        <Image 
          source={require('@/assets/images/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <ThemedText type="title" style={styles.title}>
          404 - Sayfa Bulunamadı
        </ThemedText>
        <ThemedText style={styles.message}>
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </ThemedText>
        <TouchableOpacity style={globalStyles.primaryButton} onPress={() => window.location.href = '/'}>
          <ThemedText style={globalStyles.primaryButtonText}>
            Ana Sayfaya Dön
          </ThemedText>
        </TouchableOpacity>
        <Link href="/blog" style={styles.link}>
          <ThemedText style={styles.linkText}>Blog'a Git</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  logo: {
    width: 200,
    height: 50,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    maxWidth: 400,
  },
  link: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  linkText: {
    fontSize: 16,
    color: '#0053f5',
    fontWeight: '500',
  },
});
