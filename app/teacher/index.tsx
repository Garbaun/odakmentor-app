import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AIAssistant } from '@/components/AIAssistant';
import CartModal from '@/components/CartModal';
import CategoryModal from '@/components/CategoryModal';
import { TopBar } from '@/components/TopBar';
import { AuthService } from '@/services/authService';
import { borderRadius, colors, globalStyles, spacing, typography } from '@/styles/globalStyles';

export default function TeacherScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  
  // Responsive değerler
  const isNarrow = windowWidth < 768;
  const mainContentWidth = Math.min(1200, windowWidth * 0.9);

  // State'ler
  const [cartOpen, setCartOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  
  // Kategoriler
  const CATS = ['Sınıflar', 'Online Dersler', 'Sınava Hazırlık', 'Yabancı Dil', 'Rehberlik'] as const;
  const [catActive, setCatActive] = useState<typeof CATS[number] | null>(null);

  // Eğitmenimiz Olun butonu fonksiyonu
  const handleBecomeTeacher = async () => {
    try {
      // Mevcut kullanıcıyı kontrol et
      const currentUser = await AuthService.getCurrentUser();
      
      if (currentUser) {
        // Kullanıcı giriş yapmış - giriş sayfasına yönlendir
        router.push('/student');
      } else {
        // Kullanıcı giriş yapmamış - kayıt sayfasına yönlendir
        router.push('/register');
      }
    } catch (error) {
      // Hata durumunda kayıt sayfasına yönlendir
      router.push('/register');
    }
  };

  return (
    <View style={globalStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Ortak Top Bar */}
      <TopBar 
        currentPage="teacher"
        onCategoriesPress={() => setCatsOpen(true)}
        onCartPress={() => setCartOpen(true)}
      />
      
      <ScrollView contentContainerStyle={globalStyles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Ana İçerik */}
        <View style={[globalStyles.mainContent, { width: mainContentWidth, alignSelf: 'center' }]}>
          {/* Başlık */}
          <View style={globalStyles.headerSection}>
            <Text style={globalStyles.mainTitle}>
              Eğitmenlerimizi Nasıl Seçiyoruz?
            </Text>
            <Text style={globalStyles.mainSubtitle}>
              Çocuğunuzun eğitimi için en doğru eğitmeni bulma sürecimizi keşfedin
            </Text>
          </View>

          {/* Eğitmen Bölümleri */}
          {/* Bölüm 1 - Sağ (egitmen1.png) */}
          <View style={[styles.section, styles.sectionRight, isNarrow && styles.sectionMobile]}>
            <View style={styles.imageContainer}>
              <Image 
                source={require('@/assets/images/egitmenler/egitmen1.png')} 
                style={styles.teacherImage} 
                resizeMode="cover" 
              />
            </View>
            <View style={styles.contentContainer}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Odak Mentor Eğitmen Kadrosu: Başarıyı Şansa Bırakmıyoruz
              </Text>
              <Text style={[styles.sectionText, { color: '#555555' }]}>
                Bir öğrencinin eğitim yolculuğundaki en değerli pusula, şüphesiz ki ona rehberlik eden eğitmendir. Odak Mentor olarak biz, bir öğretmenden daha fazlasını, öğrencinin potansiyelini ortaya çıkaran gerçek bir "mentor" arayışındayız. Bu nedenle eğitmen kadromuzu, son derece seçici ve çok aşamalı bir kabul süreciyle titizlikle oluşturuyoruz.
              </Text>
            </View>
          </View>

          {/* Bölüm 2 - Sağ (egitmen2.png) */}
          <View style={[styles.section, styles.sectionRight, isNarrow && styles.sectionMobile]}>
            <View style={styles.imageContainer}>
              <Image 
                source={require('@/assets/images/egitmenler/egitmen2.png')} 
                style={styles.teacherImage} 
                resizeMode="cover" 
              />
            </View>
            <View style={styles.contentContainer}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Akademik Mükemmellik ve Kanıtlanmış Başarı
              </Text>
              <Text style={[styles.sectionText, { color: '#555555' }]}>
                Platformumuzda yer alan her bir eğitmen, yalnızca akademik geçmişiyle değil, aynı zamanda yarattığı başarı hikayeleriyle de öne çıkar. Türkiye'nin ve dünyanın en saygın üniversitelerinden mezun, alanında uzmanlaşmış ve yılların deneyimiyle pedagojik yetkinliğini kanıtlamış profesyonellerle çalışıyoruz. Bizim için bir eğitmenin en önemli referansı, başarıya ulaştırdığı öğrenci portföyüdür. Öğrencilerinin hedeflerine ulaşmalarını sağlayan ve somut sonuçlar elde eden eğitimcileri ailemize dahil ediyoruz. Her bir Odak Mentor, kendi alanında adeta bir başarı mimarıdır.
              </Text>
					</View>
				</View>

          {/* Bölüm 3 - Sol (egitmen3.png) */}
          <View style={[styles.section, styles.sectionLeft, isNarrow && styles.sectionMobile]}>
            <View style={styles.contentContainer}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Bir Mentorda Aradığımız Bütünsel Yetkinlikler
              </Text>
              <Text style={[styles.sectionText, { color: '#555555' }]}>
                Akademik bilgi tek başına yeterli değildir. Bir mentorun ilham veren bir iletişimci, motive eden bir lider ve teknolojiyi etkin kullanan bir rehber olması gerektiğine inanıyoruz. Bu yüzden eğitmenlerimizin;{'\n\n'}Etkili İletişim: Diksiyonu düzgün, hitabeti güçlü ve empati kurabilen,{'\n\n'}Eğitim Koçluğu: Öğrenciye yol haritası çizebilen, motivasyonunu yüksek tutan,{'\n\n'}Dijital Pedagoji: En yeni eğitim teknolojilerini derslerine entegre edebilen,{'\n'}gibi bütünsel yetkinliklere sahip olmasını önemsiyoruz.
              </Text>
            </View>
            <View style={styles.imageContainer}>
              <Image 
                source={require('@/assets/images/egitmenler/egitmen3.png')} 
                style={styles.teacherImage} 
                resizeMode="cover" 
              />
            </View>
				</View>

          {/* Bölüm 4 - Sol (egitmen4.png) */}
          <View style={[styles.section, styles.sectionLeft, isNarrow && styles.sectionMobile]}>
            <View style={styles.contentContainer}>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                Odak Mentor Eğitmeni Olmak Bir Ayrıcalıktır
              </Text>
              <Text style={[styles.sectionText, { color: '#555555' }]}>
                Kısacası, Odak Mentor eğitmeni olmak bir ayrıcalıktır. Bu titiz seçim sürecimiz, öğrencilerimize sadece en iyi eğitimi değil, aynı zamanda geleceklerini şekillendirecek doğru rol modellerini sunma garantimizdir.
              </Text>
            </View>
            <View style={styles.imageContainer}>
              <Image 
                source={require('@/assets/images/egitmenler/egitmen4.png')} 
                style={styles.teacherImage} 
                resizeMode="cover" 
              />
            </View>
				</View>

          {/* Son Mesaj */}
          <View style={styles.finalSection}>
            <Text style={[styles.finalText, { color: '#555555' }]}>
              Odak Mentor ailesi olarak, eğitimde mükemmelliği hedefliyor ve her öğrencimizin potansiyelini en üst seviyeye çıkarmak için çalışıyoruz.{'\n\n'}Sen de bu yolculukta bizimle beraber yürümek istersen, bize katıl.
            </Text>
            
            {/* Eğitmenimiz Olun Butonu */}
            <TouchableOpacity 
              style={[globalStyles.primaryButton, { marginTop: 20 }]} 
              onPress={handleBecomeTeacher}
            >
              <Text style={globalStyles.primaryButtonText}>Eğitmenimiz Olun</Text>
			</TouchableOpacity>
          </View>

				</View>
      </ScrollView>

      <CategoryModal visible={catsOpen} onClose={() => setCatsOpen(false)} />

      <CartModal visible={cartOpen} onClose={() => setCartOpen(false)} />

      {/* AI Asistan Maskot */}
      <AIAssistant />

      {/* duplicate categories modal removed; shared CategoryModal above */}
				</View>
	);
}

// Sadece sayfa özel stilleri
const styles = StyleSheet.create({
  // Eğitmen bölümleri
  section: {
		flexDirection: 'row',
		alignItems: 'center',
    marginBottom: spacing.xxl,
    gap: spacing.lg,
  },
  sectionRight: {
    // Web'de resim sağda
  },
  sectionLeft: {
    flexDirection: 'row-reverse',
  },
  sectionMobile: {
    flexDirection: 'column',
  },
  imageContainer: {
    flex: 1,
    maxWidth: 400,
    aspectRatio: 1.2,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.borderLight,
  },
  teacherImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1.2,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    marginBottom: spacing.md,
  },
  sectionText: {
    ...typography.body,
  },
  
  // Son mesaj bölümü
  finalSection: {
		alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  finalText: {
    fontSize: typography.body.fontSize,
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 700,
  },
  
  
  // Sepet modal (özel boyut)
  cartModalCard: {
    width: 800,
    height: 400,
    maxWidth: '90%',
    maxHeight: '80%',
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
		borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
	},
  cartModalWatermark: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  cartModalWatermarkLogo: {
    width: '80%',
    height: '60%',
    opacity: 0.08,
  },
  cartModalHeader: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 2,
  },
  cartModalContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    zIndex: 2,
  },
  cartModalLogo: {
    width: 200,
    height: 50,
    marginBottom: 20,
  },
  cartModalText: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.textPrimary,
  },
  // Categories modal styles
  modalHeaderTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  modalBackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalBackText: {
    fontSize: 16,
    color: '#1e3a8a',
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e3a8a',
  },
  catsLeft: {
    width: 120,
    paddingRight: 8,
  },
  catsRight: {
    flex: 1,
    maxHeight: 400,
  },
  catsRightContent: {
    paddingBottom: 20,
  },
  catsItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  catsItemActive: {
    backgroundColor: '#e0f2fe',
  },
  catsItemText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  catsItemTextActive: {
    color: '#0369a1',
    fontWeight: '600',
  },
  catsThreeColumns: {
    flexDirection: 'row',
    gap: 16,
  },
  catsColumn: {
    flex: 1,
    minWidth: 0,
  },
  catsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  catsLinkRow: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 2,
  },
  catsLink: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  categoriesModalWatermark: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  categoriesModalWatermarkLogo: {
    width: '90%',
    height: '70%',
    opacity: 0.08,
  },
});
