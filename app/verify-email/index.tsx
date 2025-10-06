import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { AuthService } from '@/services/authService';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Standart radius değerleri
const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

// Neomorfik gölge
const NEOMORPHIC_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 2, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
};

const { width } = Dimensions.get('window');
const TEXT = '#1a1a1a';
const BORDER = '#E5E5E5';

export default function VerifyEmailScreen() {
  const colors = Colors['light'];
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: w } = useWindowDimensions();
  const isSmall = w < 768;
  const { token } = useLocalSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      verifyEmail(token as string);
    } else {
      setError('Doğrulama token\'ı bulunamadı');
    }
  }, [token]);

  const verifyEmail = async (emailToken: string) => {
    setLoading(true);
    try {
      const result = await AuthService.verifyEmail(emailToken);
      
      if (result.success) {
        setVerified(true);
        // Token'ı localStorage'a kaydet
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('auth_token', result.token || '');
        }
      } else {
        setError(result.error || 'E-posta doğrulama başarısız');
      }
    } catch (error: any) {
      setError(error.message || 'Doğrulama sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (verified) {
      router.replace('/student');
    } else {
      router.replace('/register');
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 8 }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={[
          styles.modalCard,
          { maxHeight: '95%' },
          Platform.OS === 'web' ? { width: Math.max(320, Math.round(w * 0.7)), maxWidth: Math.max(320, Math.round(w * 0.7)) } : null
        ]}>
          
          <View style={styles.card}>
            <View style={styles.header}>
              <Image 
                source={require('@/assets/images/logo1.png')} 
                style={styles.logo} 
                resizeMode="contain" 
              />
              <ThemedText style={[styles.title, { color: colors.textPrimary }]}>
                E-posta Doğrulama
              </ThemedText>
            </View>

            {loading && (
              <View style={styles.loadingContainer}>
                <MaterialIcons name="hourglass-empty" size={48} color="#667eea" />
                <ThemedText style={[styles.loadingText, { color: colors.textPrimary }]}>
                  E-posta doğrulanıyor...
                </ThemedText>
              </View>
            )}

            {verified && !loading && (
              <View style={styles.successContainer}>
                <MaterialIcons name="check-circle" size={64} color="#10b981" />
                <ThemedText style={[styles.successTitle, { color: colors.textPrimary }]}>
                  Tebrikler!
                </ThemedText>
                <ThemedText style={[styles.successMessage, { color: colors.textSecondary }]}>
                  E-posta adresiniz başarıyla doğrulandı.{'\n'}
                  Hesabınız aktifleştirildi ve artık giriş yapabilirsiniz.
                </ThemedText>
                
                <TouchableOpacity 
                  style={[styles.continueButton, { backgroundColor: colors.primary }]}
                  onPress={handleContinue}
                >
                  <ThemedText style={styles.continueButtonText}>
                    Giriş Yap
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}

            {error && !loading && (
              <View style={styles.errorContainer}>
                <MaterialIcons name="error" size={64} color="#ef4444" />
                <ThemedText style={[styles.errorTitle, { color: colors.textPrimary }]}>
                  Doğrulama Hatası
                </ThemedText>
                <ThemedText style={[styles.errorMessage, { color: colors.textSecondary }]}>
                  {error}
                </ThemedText>
                
                <TouchableOpacity 
                  style={[styles.retryButton, { backgroundColor: colors.primary }]}
                  onPress={() => router.replace('/register')}
                >
                  <ThemedText style={styles.retryButtonText}>
                    Tekrar Dene
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: Platform.OS === 'web' ? Math.max(320, Math.round(width * 0.7)) : '100%',
    maxWidth: Platform.OS === 'web' ? Math.max(320, Math.round(width * 0.7)) : 420,
    borderRadius: RADIUS.lg,
    backgroundColor: '#ffffff',
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    ...NEOMORPHIC_SHADOW,
  },
  card: {
    padding: 24,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  continueButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
