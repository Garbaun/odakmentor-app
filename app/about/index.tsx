import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, ScrollView, StatusBar, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
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
  
  // Banner animasyonu için
  const bannerImageRotation = useRef(new Animated.Value(0)).current;
  const bannerImageOpacity = useRef(new Animated.Value(0)).current;
  const banner2ImageRotation = useRef(new Animated.Value(0)).current;
  const banner2ImageOpacity = useRef(new Animated.Value(0)).current;
  const banner3ImageRotation = useRef(new Animated.Value(0)).current;
  const banner3ImageOpacity = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const [bannerVisible, setBannerVisible] = useState(false);
  const [banner2Visible, setBanner2Visible] = useState(false);
  const [banner3Visible, setBanner3Visible] = useState(false);

  // Banner animasyonunu başlat
  useEffect(() => {
    if (bannerVisible) {
      const startAnimation = () => {
        // Başlangıçta 10 derece sağa yatık ve görünmez
        bannerImageRotation.setValue(10);
        bannerImageOpacity.setValue(0);
        
        // Animasyonu başlat
        Animated.parallel([
          Animated.timing(bannerImageRotation, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(bannerImageOpacity, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]).start();
      };

      // Banner görünür olduğunda animasyonu başlat
      startAnimation();
    }
  }, [bannerVisible]);

  // Banner2 animasyonunu başlat
  useEffect(() => {
    if (banner2Visible) {
      const startAnimation2 = () => {
        // Başlangıçta 10 derece sağa yatık ve görünmez (saat ters istikametinde)
        banner2ImageRotation.setValue(10);
        banner2ImageOpacity.setValue(0);
        
        // Animasyonu başlat
        Animated.parallel([
          Animated.timing(banner2ImageRotation, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(banner2ImageOpacity, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]).start();
      };

      // Banner görünür olduğunda animasyonu başlat
      startAnimation2();
    }
  }, [banner2Visible]);

  // Banner3 animasyonunu başlat
  useEffect(() => {
    if (banner3Visible) {
      const startAnimation3 = () => {
        // Başlangıçta 20 derece sola yatık ve görünmez (soldan sağa dönüş)
        banner3ImageRotation.setValue(-20);
        banner3ImageOpacity.setValue(0);
        
        // Animasyonu başlat
        Animated.parallel([
          Animated.timing(banner3ImageRotation, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(banner3ImageOpacity, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]).start();
      };

      // Banner görünür olduğunda animasyonu başlat
      startAnimation3();
    }
  }, [banner3Visible]);

  // Scroll pozisyonunu takip et ve banner görünür olduğunda animasyonu başlat
  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      // Banner yaklaşık 400px scroll sonrası görünür olur
      if (value > 400 && !bannerVisible) {
        setBannerVisible(true);
      }
      // Banner2 yaklaşık 800px scroll sonrası görünür olur
      if (value > 800 && !banner2Visible) {
        setBanner2Visible(true);
      }
      // Banner3 yaklaşık 1000px scroll sonrası görünür olur
      if (value > 1000 && !banner3Visible) {
        setBanner3Visible(true);
      }
    });

    return () => {
      scrollY.removeListener(listener);
    };
  }, [bannerVisible, banner2Visible, banner3Visible]);

  return (
    <View style={globalStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Ortak Top Bar */}
      <TopBar 
        currentPage="about"
        onCategoriesPress={() => setCatsOpen(true)}
        onCartPress={() => setCartOpen(true)}
      />
      
      {/* Sabit Logo Arka Plan */}
      <Image 
        source={require('@/assets/images/logo1.png')} 
        style={styles.fixedBackgroundLogo}
        resizeMode="contain"
        pointerEvents="none"
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[globalStyles.scrollContent, { paddingTop: 20 }]} 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <ThemedView style={styles.heroSection}>
          <View style={[styles.heroContent, isSmall && styles.heroContentSmall]}>
            <Text style={[styles.heroTitle, { color: '#383838' }]}>
              Potansiyelini Keşfet
            </Text>
            <ThemedText style={[styles.heroDescription, { color: colors.textMuted }]}>
              Eğitim, her bireyin kendine özgü potansiyelini ortaya çıkaran kişisel bir yolculuk olmalıdır. 
              Ancak günümüzün standartlaşmış eğitim modelleri, çoğu zaman her öğrencinin farklı parmak izi gibi olan eşsiz yeteneklerini ve öğrenme stillerini göz ardı eder. 
              Biz, bu tek tip yaklaşıma bir alternatif sunmak için yola çıktık.
            </ThemedText>
            <ThemedText style={[styles.heroDescription, { color: colors.textMuted }]}>
              <ThemedText style={{ fontWeight: '600', color: '#3b82f6', fontSize: 28, lineHeight: 43 }}>"Odak Mentor"</ThemedText>, her öğrencinin benzersiz olduğuna olan inancımızla kurulmuş, yapay zeka destekli yeni nesil bir eğitim platformudur. 
              Biz bir online dershaneden çok daha fazlasıyız; biz, her öğrencinin hedeflerine giden yolda ona özel bir harita çizen, teknoloji ile insan dokunuşunu birleştiren birer yol arkadaşıyız.
            </ThemedText>
            
          </View>
        </ThemedView>

        {/* Banner Section */}
        <View style={styles.bannerSection}>
          <View style={styles.bannerContent}>
            {/* Banner Image */}
            <View style={styles.bannerImageContainer}>
              <Animated.Image 
                source={require('@/assets/images/about/about1.png')} 
                style={[
                  styles.bannerImage,
                  {
                    transform: [
                      {
                        rotate: bannerImageRotation.interpolate({
                          inputRange: [0, 10],
                          outputRange: ['0deg', '-10deg'], // Saat istikametinde dönüş için negatif
                        }),
                      },
                    ],
                    opacity: bannerImageOpacity,
                  },
                ]}
                resizeMode="contain"
              />
            </View>
            
            {/* Banner Text */}
            <View style={styles.bannerTextContainer}>
              <ThemedText style={styles.bannerMainTitle}>
                Doğru Yola
              </ThemedText>
              <ThemedText style={styles.bannerSubTitle}>
                Odaklan
              </ThemedText>
              <ThemedText style={styles.bannerDescription}>
                Geniş bir müfredatta kaybolmak yerine, yapay zeka destekli yetenek analizimizle sana en uygun alanı keşfediyor ve o yolda derinleşmeni sağlıyoruz.
              </ThemedText>
            </View>
          </View>
        </View>

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

        {/* Banner Section 2 */}
        <View style={styles.bannerSection2}>
          <View style={styles.bannerContent2}>
            {/* Banner Text */}
            <View style={styles.bannerTextContainer2}>
              <ThemedText style={styles.bannerMainTitle2}>
                Potansiyelini
              </ThemedText>
              <ThemedText style={styles.bannerSubTitle2}>
                Keşfet
              </ThemedText>
              <ThemedText style={styles.bannerDescription2}>
                Gerçek gelişim, paylaştıkça büyür. Sanal sınıflarımızda, senin gibi aynı alana tutku duyan yetenekleri buluşturuyoruz. Bu dinamik ortamlarda takım olarak çalışarak fikirlerinizi projelere dönüştürmenizi ve birbirinizin gelişimine ivme kazandırmanızı sağlıyoruz.
              </ThemedText>
            </View>
            {/* Banner Image */}
            <View style={styles.bannerImageContainer2}>
              <Animated.Image 
                source={require('@/assets/images/about/about2.png')} 
                style={[
                  styles.bannerImage2,
                  {
                    transform: [
                      {
                        rotate: banner2ImageRotation.interpolate({
                          inputRange: [10, 0],
                          outputRange: ['10deg', '0deg'], // Saat ters istikametinde dönüş (sağdan sola)
                        }),
                      },
                    ],
                    opacity: banner2ImageOpacity,
                  },
                ]}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

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
            
          </View>
        </ThemedView>

        {/* Banner Section 3 */}
        <View style={styles.bannerSection3}>
          <View style={styles.bannerContent3}>
            {/* Banner Image */}
            <View style={styles.bannerImageContainer3}>
              <Animated.Image 
                source={require('@/assets/images/about/about3.png')} 
                style={[
                  styles.bannerImage3,
                  {
                    transform: [
                      {
                        rotate: banner3ImageRotation.interpolate({
                          inputRange: [-20, 0],
                          outputRange: ['-20deg', '0deg'], // Soldan sağa dönüş
                        }),
                      },
                    ],
                    opacity: banner3ImageOpacity,
                  },
                ]}
                resizeMode="contain"
              />
            </View>
            {/* Banner Text */}
            <View style={styles.bannerTextContainer3}>
              <ThemedText style={styles.bannerMainTitle3}>
                Zamandan
              </ThemedText>
              <ThemedText style={styles.bannerSubTitle3}>
                Tasarruf
              </ThemedText>
              <ThemedText style={styles.bannerDescription3}>
                Boşa geçen saatlere ve gereksiz tekrarlara son! Akıllı eğitim planlamamız sayesinde, derslerine en verimli şekilde çalışırken sosyalleşmek, spor yapmak veya yeni bir hobi edinmek için de bolca vaktin kalır.
              </ThemedText>
            </View>
          </View>
        </View>
        
        <ThemedView style={styles.section}>
          <View style={[styles.sectionContent, isSmall && styles.sectionContentSmall]}>
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
              "Geleceği beklemeyin, onu Odak Mentor ile birlikte şekillendirelim."
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
  // ScrollView
  scrollView: {
    flex: 1,
  },
  
  // Banner Section
  bannerSection: {
    backgroundColor: '#e2a9f1',
    height: 500,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 60, // Bannerlar arası mesafe %20 artırıldı
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1200,
    width: '100%',
  },
  bannerImageContainer: {
    flex: 0.4, // Sağ %40
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 20,
    height: '100%', // Banner yüksekliğinin tamamını kullan
  },
  bannerImage: {
    width: 600, // Sabit genişlik
    height: 400, // Sabit yükseklik
    maxWidth: 1600,
    maxHeight: 1600,
  },
  bannerTextContainer: {
    flex: 0.6, // Sol %60
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  bannerMainTitle: {
    fontSize: 77, // 48 * 1.6 = 77px (%60 büyütüldü)
    fontWeight: '800',
    color: '#2d2d2d',
    marginBottom: 47, // 36px * 1.3 = 47px (%30 daha artırıldı)
    textAlign: 'left',
  },
  bannerSubTitle: {
    fontSize: 77, // 48 * 1.6 = 77px (%60 büyütüldü)
    fontWeight: '800',
    color: '#2d2d2d',
    marginBottom: 20,
    textAlign: 'left',
  },
  bannerDescription: {
    fontSize: 27, // 18 * 1.5 = 27px (%50 büyütüldü)
    lineHeight: 42, // 28 * 1.5 = 42px (%50 büyütüldü)
    color: '#2d2d2d',
    textAlign: 'left',
    opacity: 0.95,
  },

  // Banner Section 2
  bannerSection2: {
    backgroundColor: '#c0ffa2',
    height: 500,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 60, // Bannerlar arası mesafe %20 artırıldı
  },
  bannerContent2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1200,
    width: '100%',
  },
  bannerImageContainer2: {
    flex: 0.4, // Sağ %40
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 20,
    height: '100%', // Banner yüksekliğinin tamamını kullan
  },
  bannerImage2: {
    width: 600, // Sabit genişlik
    height: 400, // Sabit yükseklik
    maxWidth: 1600,
    maxHeight: 1600,
  },
  bannerTextContainer2: {
    flex: 0.6, // Sol %60
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  bannerMainTitle2: {
    fontSize: 77, // 48 * 1.6 = 77px (%60 büyütüldü)
    fontWeight: '800',
    color: '#2d2d2d',
    marginBottom: 47, // 36px * 1.3 = 47px (%30 daha artırıldı)
    textAlign: 'left',
  },
  bannerSubTitle2: {
    fontSize: 77, // 48 * 1.6 = 77px (%60 büyütüldü)
    fontWeight: '800',
    color: '#2d2d2d',
    marginBottom: 24, // 20'den 24'e çıkarıldı (%20 artırıldı)
    textAlign: 'left',
  },
  bannerDescription2: {
    fontSize: 27, // 18 * 1.5 = 27px (%50 büyütüldü)
    lineHeight: 42, // 28 * 1.5 = 42px (%50 büyütüldü)
    color: '#2d2d2d',
    textAlign: 'left',
    opacity: 0.95,
  },

  // Banner Section 3
  bannerSection3: {
    backgroundColor: '#d9d9d9',
    height: 500,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 60, // Bannerlar arası mesafe %20 artırıldı
  },
  bannerContent3: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1200,
    width: '100%',
  },
  bannerImageContainer3: {
    flex: 0.4, // Sol %40
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 20,
    height: '100%', // Banner yüksekliğinin tamamını kullan
  },
  bannerImage3: {
    width: 600, // Sabit genişlik
    height: 400, // Sabit yükseklik
    maxWidth: 1600,
    maxHeight: 1600,
  },
  bannerTextContainer3: {
    flex: 0.6, // Sağ %60
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingRight: 20,
  },
  bannerMainTitle3: {
    fontSize: 77, // 48 * 1.6 = 77px (%60 büyütüldü)
    fontWeight: '800',
    color: '#2d2d2d',
    marginBottom: 47, // 36px * 1.3 = 47px (%30 daha artırıldı)
    textAlign: 'left',
  },
  bannerSubTitle3: {
    fontSize: 77, // 48 * 1.6 = 77px (%60 büyütüldü)
    fontWeight: '800',
    color: '#2d2d2d',
    marginBottom: 24, // 20'den 24'e çıkarıldı (%20 artırıldı)
    textAlign: 'left',
  },
  bannerDescription3: {
    fontSize: 27, // 18 * 1.5 = 27px (%50 büyütüldü)
    lineHeight: 42, // 28 * 1.5 = 42px (%50 büyütüldü)
    color: '#2d2d2d',
    textAlign: 'left',
    opacity: 0.95,
  },

  // Hero Section
  heroSection: {
    backgroundColor: '#f8fafc',
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  fixedBackgroundLogo: {
    position: 'absolute',
    top: 150, // %10 aşağı (100 + 50)
    left: '50%',
    marginLeft: -200, // Logo genişliğinin yarısı kadar sola kaydır
    width: 400,
    height: 500, // Sadece hero section yüksekliği
    opacity: 0.08,
    zIndex: 1,
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: 1200, // 800'den 1200'e çıkarıldı (%50 artırıldı)
  },
  heroContentSmall: {
    paddingHorizontal: 10,
  },
  heroTitle: {
    fontSize: 61, // 47 * 1.3 = 61px (%30 büyütüldü)
    fontWeight: '700',
    marginBottom: 24, // 8'den 24'e çıkarıldı (1 satır boşluk için)
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 28, // 23 * 1.2 = 28px (%20 büyütüldü)
    lineHeight: 43, // 36 * 1.2 = 43px (%20 büyütüldü)
    textAlign: 'center',
    maxWidth: 900, // 600'den 900'e çıkarıldı (%50 artırıldı)
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
    fontSize: 31, // 24 * 1.3 = 31px (%30 büyütüldü)
    fontWeight: '700',
    marginLeft: 12,
  },
  sectionText: {
    fontSize: 23, // 18 * 1.3 = 23px (%30 büyütüldü)
    lineHeight: 36, // 28 * 1.3 = 36px (%30 büyütüldü)
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
    fontSize: 35, // 23 * 1.5 = 35px (%50 büyütüldü)
    fontWeight: '600',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 33, // 22 * 1.5 = 33px (%50 büyütüldü)
    lineHeight: 51, // 34 * 1.5 = 51px (%50 büyütüldü)
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
    fontSize: 32, // 20 * 1.6 = 32px (%60 büyütüldü)
    fontWeight: '600',
    marginBottom: 12,
  },
  differenceText: {
    fontSize: 27, // 17 * 1.6 = 27px (%60 büyütüldü)
    lineHeight: 42, // 26 * 1.6 = 42px (%60 büyütüldü)
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
    fontSize: 48, // 32 * 1.5 = 48px (%50 büyütüldü)
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  joinText: {
    fontSize: 27, // 18 * 1.5 = 27px (%50 büyütüldü)
    textAlign: 'center',
    lineHeight: 42, // 28 * 1.5 = 42px (%50 büyütüldü)
    marginBottom: 24,
  },
  joinCallToAction: {
    fontSize: 30, // 20 * 1.5 = 30px (%50 büyütüldü)
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
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
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
