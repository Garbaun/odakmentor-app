import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function MentorAIHomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleStudentLogin = () => {
    // Öğrenci giriş sayfasına yönlendir
    console.log('Öğrenci girişi');
  };

  const handleTeacherLogin = () => {
    // Öğretmen giriş sayfasına yönlendir
    console.log('Öğretmen girişi');
  };

  const handleStudentRegister = () => {
    // Öğrenci kayıt sayfasına yönlendir
    console.log('Öğrenci kaydı');
  };

  const handleTeacherRegister = () => {
    // Öğretmen kayıt sayfasına yönlendir
    console.log('Öğretmen kaydı');
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.surface }]} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.heroGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <ThemedView style={styles.heroContent}>
            <ThemedView style={styles.logoContainer}>
              <IconSymbol name="brain.head.profile" size={64} color="#fff" />
            </ThemedView>
            <ThemedText type="title" style={styles.mainTitle}>
              Mentor AI
            </ThemedText>
            <ThemedText style={styles.heroSubtitle}>
              Yapay Zeka Destekli Online Eğitim Platformu
            </ThemedText>
            <ThemedText style={styles.heroDescription}>
              Öğrenciler ve öğretmenleri buluşturan, kişiselleştirilmiş öğrenme deneyimi sunan akıllı platform
            </ThemedText>
          </ThemedView>
        </LinearGradient>

        {/* Role Selection */}
        <ThemedView style={styles.roleSelectionContainer}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            🎯 Hangi Rolde Giriş Yapmak İstiyorsunuz?
          </ThemedText>
          
          <ThemedView style={styles.roleCards}>
            {/* Student Card */}
            <TouchableOpacity 
              style={[styles.roleCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={handleStudentLogin}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.success, '#a8edea']}
                style={styles.roleCardHeader}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <IconSymbol name="graduationcap.fill" size={40} color="#fff" />
              </LinearGradient>
              <ThemedView style={styles.roleCardContent}>
                <ThemedText style={[styles.roleCardTitle, { color: colors.textPrimary }]}>
                  Öğrenci
                </ThemedText>
                <ThemedText style={[styles.roleCardDescription, { color: colors.textSecondary }]}>
                  AI destekli seviye tespiti, kişisel ders planları ve uzman öğretmenlerle öğrenin
                </ThemedText>
                <TouchableOpacity 
                  style={[styles.roleButton, { backgroundColor: colors.success }]}
                  onPress={handleStudentLogin}
                >
                  <ThemedText style={styles.roleButtonText}>Giriş Yap</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleStudentRegister}>
                  <ThemedText style={[styles.roleLink, { color: colors.primary }]}>
                    Hesap Oluştur
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </TouchableOpacity>

            {/* Teacher Card */}
            <TouchableOpacity 
              style={[styles.roleCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={handleTeacherLogin}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.secondary, '#764ba2']}
                style={styles.roleCardHeader}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <IconSymbol name="person.2.fill" size={40} color="#fff" />
              </LinearGradient>
              <ThemedView style={styles.roleCardContent}>
                <ThemedText style={[styles.roleCardTitle, { color: colors.textPrimary }]}>
                  Öğretmen
                </ThemedText>
                <ThemedText style={[styles.roleCardDescription, { color: colors.textSecondary }]}>
                  Öğrencilerle buluşun, AI asistanından faydalanın ve kariyerinizi geliştirin
                </ThemedText>
                <TouchableOpacity 
                  style={[styles.roleButton, { backgroundColor: colors.secondary }]}
                  onPress={handleTeacherLogin}
                >
                  <ThemedText style={styles.roleButtonText}>Giriş Yap</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleTeacherRegister}>
                  <ThemedText style={[styles.roleLink, { color: colors.primary }]}>
                    Başvuru Yap
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        {/* Features Section */}
        <ThemedView style={styles.featuresContainer}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            ✨ Mentor AI'ın Özellikleri
          </ThemedText>
          
          <ThemedView style={styles.featuresGrid}>
            <ThemedView style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <IconSymbol name="brain.head.profile" size={32} color={colors.primary} />
              <ThemedText style={[styles.featureCardTitle, { color: colors.textPrimary }]}>
                AI Seviye Tespiti
              </ThemedText>
              <ThemedText style={[styles.featureCardDescription, { color: colors.textSecondary }]}>
                Kişiselleştirilmiş testlerle bilgi seviyenizi belirleyin
              </ThemedText>
            </ThemedView>

            <ThemedView style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <IconSymbol name="chart.line.uptrend.xyaxis" size={32} color={colors.success} />
              <ThemedText style={[styles.featureCardTitle, { color: colors.textPrimary }]}>
                Gelişim Takibi
              </ThemedText>
              <ThemedText style={[styles.featureCardDescription, { color: colors.textSecondary }]}>
                AI destekli ilerleme raporları ve analizler
              </ThemedText>
            </ThemedView>

            <ThemedView style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <IconSymbol name="video.fill" size={32} color={colors.accent} />
              <ThemedText style={[styles.featureCardTitle, { color: colors.textPrimary }]}>
                Görüntülü Görüşme
              </ThemedText>
              <ThemedText style={[styles.featureCardDescription, { color: colors.textSecondary }]}>
                Uygulama içi canlı ders deneyimi
              </ThemedText>
            </ThemedView>

            <ThemedView style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <IconSymbol name="person.2.fill" size={32} color={colors.secondary} />
              <ThemedText style={[styles.featureCardTitle, { color: colors.textPrimary }]}>
                Uzman Öğretmenler
              </ThemedText>
              <ThemedText style={[styles.featureCardDescription, { color: colors.textSecondary }]}>
                Deneyimli eğitmenlerle öğrenin
              </ThemedText>
            </ThemedView>

            <ThemedView style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <IconSymbol name="calendar" size={32} color={colors.info} />
              <ThemedText style={[styles.featureCardTitle, { color: colors.textPrimary }]}>
                Esnek Planlama
              </ThemedText>
              <ThemedText style={[styles.featureCardDescription, { color: colors.textSecondary }]}>
                Size uygun zamanda ders alın
              </ThemedText>
            </ThemedView>

            <ThemedView style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <IconSymbol name="shield.fill" size={32} color={colors.warning} />
              <ThemedText style={[styles.featureCardTitle, { color: colors.textPrimary }]}>
                Güvenli Platform
              </ThemedText>
              <ThemedText style={[styles.featureCardDescription, { color: colors.textSecondary }]}>
                Verileriniz güvende, gizliliğiniz korunur
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* CTA Section */}
        <ThemedView style={styles.ctaContainer}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.ctaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <ThemedText style={styles.ctaTitle}>
              Eğitim Yolculuğunuza Başlayın
            </ThemedText>
            <ThemedText style={styles.ctaSubtitle}>
              Mentor AI ile öğrenme deneyiminizi kişiselleştirin
            </ThemedText>
            <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
              <ThemedText style={styles.ctaButtonText}>Hemen Başlayın</ThemedText>
              <IconSymbol name="arrow.right" size={20} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  heroGradient: {
    paddingTop: 80,
    paddingBottom: 50,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  heroContent: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
    opacity: 0.9,
    fontWeight: '600',
  },
  heroDescription: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 22,
    maxWidth: 300,
  },
  roleSelectionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 25,
  },
  roleCards: {
    gap: 20,
  },
  roleCard: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderWidth: 1,
  },
  roleCardHeader: {
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleCardContent: {
    padding: 25,
    alignItems: 'center',
  },
  roleCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  roleCardDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  roleButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
  },
  roleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  roleLink: {
    fontSize: 14,
    fontWeight: '500',
  },
  featuresContainer: {
    padding: 20,
    paddingTop: 0,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  featureCard: {
    width: (width - 70) / 2,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  featureCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  featureCardDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  ctaContainer: {
    margin: 20,
    marginTop: 10,
  },
  ctaGradient: {
    padding: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
});
