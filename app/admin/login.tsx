import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuthStore } from '@/store/authStore';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Basit admin kullanıcıları (gerçek projede Firebase'den gelecek)
  const adminUsers = [
    { username: 'admin', password: 'admin123', email: 'admin@odakmentor.com' },
    { username: 'yönetici', password: 'yönetici123', email: 'yonetici@odakmentor.com' },
  ];

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Hata', 'Kullanıcı adı ve şifre gerekli');
      return;
    }

    setLoading(true);

    try {
      // Basit authentication kontrolü
      const adminUser = adminUsers.find(
        user => user.username.toLowerCase() === username.toLowerCase() && user.password === password
      );

      if (adminUser) {
        // AuthStore'u güncelle
        useAuthStore.getState().setUser({
          uid: 'admin-' + Date.now(),
          email: adminUser.email,
          displayName: username,
        } as any);
        
        useAuthStore.getState().setUserProfile({
          uid: 'admin-' + Date.now(),
          email: adminUser.email,
          displayName: username,
          role: 'admin',
          createdAt: new Date(),
        } as any);

        Alert.alert('Başarılı', 'Admin paneline hoş geldiniz!', [
          { text: 'Tamam', onPress: () => router.push('/admin') }
        ]);
      } else {
        Alert.alert('Hata', 'Geçersiz kullanıcı adı veya şifre');
      }
    } catch (error) {
      Alert.alert('Hata', 'Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.loginCard}>
        <ThemedText style={styles.title}>Admin Girişi</ThemedText>
        <ThemedText style={styles.subtitle}>Yönetim paneline erişim</ThemedText>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Kullanıcı Adı</ThemedText>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Kullanıcı adınızı girin"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Şifre</ThemedText>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Şifrenizi girin"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            <ThemedText style={styles.loginButtonText}>
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.info}>
          <ThemedText style={styles.infoTitle}>Test Kullanıcıları:</ThemedText>
          <ThemedText style={styles.infoText}>Kullanıcı: admin | Şifre: admin123</ThemedText>
          <ThemedText style={styles.infoText}>Kullanıcı: yönetici | Şifre: yönetici123</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  loginCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#6b7280',
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  loginButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  info: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  infoText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
});
