import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AIAssistant } from '@/components/AIAssistant';
import CartModal from '@/components/CartModal';
import CategoryModal from '@/components/CategoryModal';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TopBar } from '@/components/TopBar';
import { Colors } from '@/constants/Colors';
import { globalStyles } from '@/styles/globalStyles';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const colors = Colors.light;
  const [catsOpen, setCatsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const isSmall = width < 768;

  return (
    <View style={globalStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Ortak Top Bar */}
      <TopBar 
        currentPage="about"
        onCategoriesPress={() => setCatsOpen(true)}
        onCartPress={() => setCartOpen(true)}
      />
      
      {/* Sabit Filigran */}
      <View style={styles.watermarkContainer}>
        <Image 
          source={require('@/assets/images/logo1.png')} 
          style={[
            styles.watermarkImage,
            {
              width: isSmall ? width * 0.3 : width * 0.4,
              height: isSmall ? width * 0.3 : width * 0.4,
            }
          ]}
          resizeMode="contain"
        />
      </View>
      
      <ScrollView 
        contentContainerStyle={[globalStyles.scrollContent, { paddingTop: 20 }]} 
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <ThemedView style={styles.heroSection}>
          <View style={[styles.heroContent, isSmall && styles.heroContentSmall]}>
            <Image 
              source={require('@/assets/images/logo3.png')} 
              style={styles.heroLogo}
              resizeMode="contain"
            />
            <ThemedText style={[styles.heroTitle, { color: colors.textPrimary }]}>
              Potansiyelini Keşfet, Hedefine Odaklan
            </ThemedText>
            <ThemedText style={[styles.heroDescription, { color: colors.textMuted }]}>
              Eğitim, her bireyin kendine özgü potansiyelini ortaya çıkaran kişisel bir yolculuk olmalıdır. 
              Ancak günümüzün standartlaşmış eğitim modelleri, çoğu zaman her öğrencinin farklı parmak izi gibi olan eşsiz yeteneklerini ve öğrenme stillerini göz ardı eder. 
              Biz, bu tek tip yaklaşıma bir alternatif sunmak için yola çıktık.
            </ThemedText>
            <ThemedText style={[styles.heroDescription, { color: colors.textMuted }]}>
              <ThemedText style={{ fontWeight: '600', color: colors.primary }}>Odak Mentor</ThemedText>, her öğrencinin benzersiz olduğuna olan inancımızla kurulmuş, yapay zeka destekli yeni nesil bir eğitim platformudur. 
              Biz bir online dershaneden çok daha fazlasıyız; biz, her öğrencinin hedeflerine giden yolda ona özel bir harita çizen, teknoloji ile insan dokunuşunu birleştiren birer yol arkadaşıyız.
            </ThemedText>
          </View>
        </ThemedView>

        {/* Vizyonumuz */}
        <ThemedView style={styles.section}>
          <View style={[styles.sectionContent, isSmall && styles.sectionContentSmall]}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="visibility" size={32} color={colors.primary} />
              <ThemedText style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Vizyonumuz
              </ThemedText>
            </View>
            <ThemedText style={[styles.sectionText, { color: colors.textSecondary }]}>
              Eğitimin coğrafi ve ekonomik sınırları aştığı, her öğrencinin en iyi eğitmene ve en doğru öğrenme metoduna ulaşabildiği bir gelecek hayal ediyoruz. 
              Vizyonumuz, teknolojiyi eğitimin merkezine yerleştirerek, öğrenmeyi bir zorunluluktan çıkarıp kişisel bir keşif ve başarı serüvenine dönüştürmektir.
            </ThemedText>
          </View>
        </ThemedView>

        {/* Misyonumuz */}
        <ThemedView style={styles.section}>
          <View style={[styles.sectionContent, isSmall && styles.sectionContentSmall]}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="school" size={32} color={colors.primary} />
              <ThemedText style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Misyonumuz
              </ThemedText>
            </View>
            <ThemedText style={[styles.sectionText, { color: colors.textSecondary }]}>
              Misyonumuz, yapay zekanın analitik gücünü, alanında uzman eğitmenlerin tecrübesiyle birleştirerek her öğrenci için en verimli ve en motive edici öğrenme ortamını yaratmaktır. 
              Bu doğrultuda:
            </ThemedText>
            
            <View style={styles.missionSteps}>
              <View style={styles.missionStep}>
                <View style={styles.stepIcon}>
                  <MaterialIcons name="analytics" size={20} color={colors.primary} />
                </View>
                <View style={styles.stepContent}>
                  <ThemedText style={[styles.stepTitle, { color: colors.textPrimary }]}>
                    Analiz Ediyoruz
                  </ThemedText>
                  <ThemedText style={[styles.stepText, { color: colors.textSecondary }]}>
                    Gelişmiş akıllı anketlerimizle her öğrencinin ilgi alanlarını, güçlü yönlerini ve gelişim alanlarını derinlemesine analiz ediyoruz.
                  </ThemedText>
                </View>
              </View>

              <View style={styles.missionStep}>
                <View style={styles.stepIcon}>
                  <MaterialIcons name="people" size={20} color={colors.primary} />
                </View>
                <View style={styles.stepContent}>
                  <ThemedText style={[styles.stepTitle, { color: colors.textPrimary }]}>
                    Eşleştiriyoruz
                  </ThemedText>
                  <ThemedText style={[styles.stepText, { color: colors.textSecondary }]}>
                    Öğrencinin kişisel profiline ve hedeflerine en uygun eğitmeni bularak, başarıyı garantileyen o mükemmel uyumu yakalıyoruz.
                  </ThemedText>
                </View>
              </View>

              <View style={styles.missionStep}>
                <View style={styles.stepIcon}>
                  <MaterialIcons name="schedule" size={20} color={colors.primary} />
                </View>
                <View style={styles.stepContent}>
                  <ThemedText style={[styles.stepTitle, { color: colors.textPrimary }]}>
                    Planlıyoruz
                  </ThemedText>
                  <ThemedText style={[styles.stepText, { color: colors.textSecondary }]}>
                    Kişiye özel ders programları, hedef odaklı çalışma planları ve hafıza geliştirme teknikleri ile öğrenme sürecini en verimli hale getiriyoruz.
                  </ThemedText>
                </View>
              </View>

              <View style={styles.missionStep}>
                <View style={styles.stepIcon}>
                  <MaterialIcons name="trending-up" size={20} color={colors.primary} />
                </View>
                <View style={styles.stepContent}>
                  <ThemedText style={[styles.stepTitle, { color: colors.textPrimary }]}>
                    Güçlendiriyoruz
                  </ThemedText>
                  <ThemedText style={[styles.stepText, { color: colors.textSecondary }]}>
                    Öğrencilere sadece ders anlatmakla kalmıyor, onlara yeni ufuklar açacak fikirler sunarak ve gizli kalmış yeteneklerini keşfetmelerine yardımcı olarak onları geleceğe hazırlıyoruz.
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>
        </ThemedView>

        {/* Bizi Farklı Kılan Nedir? */}
        <ThemedView style={styles.section}>
          <View style={[styles.sectionContent, isSmall && styles.sectionContentSmall]}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="star" size={32} color={colors.primary} />
              <ThemedText style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Bizi Farklı Kılan Nedir?
              </ThemedText>
            </View>
            
            <View style={styles.differenceGrid}>
              <View style={styles.differenceItem}>
                <View style={styles.differenceIcon}>
                  <MaterialIcons name="psychology" size={24} color={colors.primary} />
                </View>
                <ThemedText style={[styles.differenceTitle, { color: colors.textPrimary }]}>
                  Yapay Zeka Destekli Mentorluk
                </ThemedText>
                <ThemedText style={[styles.differenceText, { color: colors.textSecondary }]}>
                  Platformumuzun kalbinde yer alan yapay zeka, sadece bir araç değil, aynı zamanda akıllı bir mentor yardımcısıdır. 
                  Öğrencinin gelişimini sürekli takip eder, eksiklerini tespit eder ve bir sonraki adımı planlayarak hem öğrenciye hem de eğitmene yol gösterir.
                </ThemedText>
              </View>

              <View style={styles.differenceItem}>
                <View style={styles.differenceIcon}>
                  <MaterialIcons name="self-improvement" size={24} color={colors.primary} />
                </View>
                <ThemedText style={[styles.differenceTitle, { color: colors.textPrimary }]}>
                  Bütünsel Gelişim
                </ThemedText>
                <ThemedText style={[styles.differenceText, { color: colors.textSecondary }]}>
                  Bizim için başarı sadece sınav notlarından ibaret değildir. Öğrencilerimizin sosyal hayatlarına zaman ayırabilmelerini, 
                  yeni yetenekler keşfetmelerini ve öğrenmeyi bir yaşam biçimi haline getirmelerini önemsiyoruz.
                </ThemedText>
              </View>

              <View style={styles.differenceItem}>
                <View style={styles.differenceIcon}>
                  <MaterialIcons name="analytics" size={24} color={colors.primary} />
                </View>
                <ThemedText style={[styles.differenceTitle, { color: colors.textPrimary }]}>
                  Veriye Dayalı Başarı
                </ThemedText>
                <ThemedText style={[styles.differenceText, { color: colors.textSecondary }]}>
                  Her adımda elde ettiğimiz verileri kullanarak öğrenme sürecini sürekli optimize ediyor, 
                  en doğru yöntemlerle hedeflere en kısa sürede ulaşılmasını sağlıyoruz.
                </ThemedText>
              </View>
            </View>
          </View>
        </ThemedView>

        {/* Bize Katılın */}
        <ThemedView style={styles.joinSection}>
          <View style={[styles.joinContent, isSmall && styles.joinContentSmall]}>
            <ThemedText style={[styles.joinTitle, { color: colors.textPrimary }]}>
              Bize Katılın
            </ThemedText>
            <ThemedText style={[styles.joinText, { color: colors.textSecondary }]}>
              Eğer siz de eğitimin kişiye özel olması gerektiğine inanıyor, potansiyelinizi veya çocuğunuzun potansiyelini en üst seviyeye çıkarmak istiyorsanız, doğru yerdesiniz.
            </ThemedText>
            <ThemedText style={[styles.joinCallToAction, { color: colors.primary }]}>
              Geleceği beklemeyin, onu Odak Mentor ile birlikte şekillendirelim.
            </ThemedText>
          </View>
        </ThemedView>

        {/* İstatistikler */}
        <ThemedView style={styles.statsSection}>
          <View style={[styles.statsContent, isSmall && styles.statsContentSmall]}>
            <ThemedText style={[styles.statsTitle, { color: colors.textPrimary }]}>
              Rakamlarla OdakMentor
            </ThemedText>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <ThemedText style={[styles.statNumber, { color: colors.primary }]}>
                  2000+
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Öğrenci
                </ThemedText>
              </View>
              
              <View style={styles.statItem}>
                <ThemedText style={[styles.statNumber, { color: colors.primary }]}>
                  247
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Öğretmen
                </ThemedText>
              </View>
              
              <View style={styles.statItem}>
                <ThemedText style={[styles.statNumber, { color: colors.primary }]}>
                  20
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Sanal Sınıf
                </ThemedText>
              </View>
              
              <View style={styles.statItem}>
                <ThemedText style={[styles.statNumber, { color: colors.primary }]}>
                  10.000+
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Saat Ders
                </ThemedText>
              </View>
            </View>
          </View>
        </ThemedView>

        {/* İletişim */}
        <ThemedView style={styles.contactSection}>
          <View style={[styles.contactContent, isSmall && styles.contactContentSmall]}>
            <ThemedText style={[styles.contactTitle, { color: colors.textPrimary }]}>
              Bizimle İletişime Geçin
            </ThemedText>
            <ThemedText style={[styles.contactText, { color: colors.textSecondary }]}>
              Sorularınız için bize ulaşabilir, önerilerinizi paylaşabilirsiniz.
            </ThemedText>
            
            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <MaterialIcons name="email" size={20} color={colors.primary} />
                <ThemedText style={[styles.contactDetail, { color: colors.textSecondary }]}>
                  bilgi@odakmentor.com
                </ThemedText>
              </View>
              
              <View style={styles.contactItem}>
                <MaterialIcons name="phone" size={20} color={colors.primary} />
                <ThemedText style={[styles.contactDetail, { color: colors.textSecondary }]}>
                  +90 (538) 587 3984
                </ThemedText>
              </View>
              
              <View style={styles.contactItem}>
                <MaterialIcons name="location-on" size={20} color={colors.primary} />
                <ThemedText style={[styles.contactDetail, { color: colors.textSecondary }]}>
                  Altıntepe Mh. İstasyon Yolu Sk. No:3/1 Maltepe / İstanbul
                </ThemedText>
              </View>
          </View>
        </View>
        </ThemedView>
      </ScrollView>

      {/* Ortak Modaller */}
      <CategoryModal visible={catsOpen} onClose={() => setCatsOpen(false)} />
      <CartModal visible={cartOpen} onClose={() => setCartOpen(false)} />

      {/* AI Asistan Maskot */}
      <AIAssistant />
    </View>
  );
}

const styles = StyleSheet.create({
  // Sabit Filigran
  watermarkContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    pointerEvents: 'none',
  },
  watermarkImage: {
    opacity: 0.08,
  },

  // Hero Section
  heroSection: {
    backgroundColor: '#f8fafc',
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: 800,
  },
  heroContentSmall: {
    paddingHorizontal: 10,
  },
  heroLogo: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 600,
  },

  // Sections
  section: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  sectionContent: {
    maxWidth: 800,
    alignSelf: 'center',
  },
  sectionContentSmall: {
    paddingHorizontal: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginLeft: 12,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
  },

  // Mission Steps
  missionSteps: {
    marginTop: 20,
  },
  missionStep: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 15,
    lineHeight: 22,
  },

  // Difference Grid
  differenceGrid: {
    marginTop: 20,
  },
  differenceItem: {
    backgroundColor: '#f8fafc',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  differenceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  differenceTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  differenceText: {
    fontSize: 15,
    lineHeight: 22,
  },

  // Join Section
  joinSection: {
    backgroundColor: '#f0f9ff',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  joinContent: {
    maxWidth: 800,
    alignSelf: 'center',
    alignItems: 'center',
  },
  joinContentSmall: {
    paddingHorizontal: 10,
  },
  joinTitle: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  joinText: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 24,
  },
  joinCallToAction: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Stats Section
  statsSection: {
    backgroundColor: '#f8fafc',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  statsContent: {
    maxWidth: 800,
    alignSelf: 'center',
  },
  statsContentSmall: {
    paddingHorizontal: 10,
  },
  statsTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 30,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    textAlign: 'center',
  },

  // Contact Section
  contactSection: {
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  contactContent: {
    maxWidth: 600,
    alignSelf: 'center',
  },
  contactContentSmall: {
    paddingHorizontal: 10,
  },
  contactTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  contactText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  contactInfo: {
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactDetail: {
    fontSize: 16,
    marginLeft: 12,
  },
});
