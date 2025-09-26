import { AIAssistant } from '@/components/AIAssistant';
import CartModal from '@/components/CartModal';
import CategoryModal from '@/components/CategoryModal';
import { ThemedText } from '@/components/ThemedText';
import { TopBar } from '@/components/TopBar';
import { Colors } from '@/constants/Colors';
import { BLOG_POSTS, getAllTags } from '@/data/blog';
import { globalStyles } from '@/styles/globalStyles';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, Image, Modal, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Not: BLOG_POSTS tipi zaten data katmanında tanımlı; burada ek tipe gerek yok.

const POSTS = BLOG_POSTS;
const CATEGORY_OPTIONS = [
  'Tümü',
  "Odak Mentor'lu Olmak",
  'Kurumsal',
  'Kampanya',
  'Odak Haberleri',
  'Eğitim Rehberliği',
  'Eğitim Haberleri',
  'Bilim ve Kültür',
  'Özel Günler',
];


type DateRange = 'all' | '7' | '30';

export default function BlogIndex() {
  const colors = Colors['light'];
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: winW } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeAuthor, setActiveAuthor] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [showAuthor, setShowAuthor] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  
  // Scroll to top button state
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showScrollToTop, setShowScrollToTop] = useState(true); // Her zaman görünür olsun
  const [catsOpen, setCatsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  
  // Categories modal state
  const [catActive, setCatActive] = useState('Sınıflar');
  
  // Categories data
  const CATS = ['Sınıflar', 'Online Dersler', 'Sınava Hazırlık', 'Yabancı Dil'];
  
  const TEXT = '#1e3a8a';

  // Tüm kategoriler sağ etiket alanında kullanılabilir, sol menü statik iskelet gösterir.
  const tags = useMemo(() => getAllTags(), []);
  const authors = useMemo(() => Array.from(new Set(POSTS.map(p => p.author))), []);

  const filtered = useMemo(() => {
    const now = new Date();
    const passedDays = (d: string) => {
      const diff = now.getTime() - new Date(d).getTime();
      return Math.floor(diff / (1000 * 60 * 60 * 24));
    };
    return POSTS.filter(p => {
      const q = query.trim().toLowerCase();
      const okQ = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q);
      const okC = !activeCat || p.categories.includes(activeCat);
      const okT = !activeTag || p.tags.includes(activeTag);
      const okA = !activeAuthor || p.author === activeAuthor;
      const okD = dateRange === 'all' || passedDays(p.date) <= (dateRange === '7' ? 7 : 30);
      return okQ && okC && okT && okA && okD;
    });
  }, [query, activeCat, activeTag, activeAuthor, dateRange]);

  const isNarrow = Platform.OS === 'web' ? winW < 900 : true;
  const sideGutter = Platform.OS === 'web' ? Math.max(16, Math.round(winW * 0.15)) : 16;
  const contentWidth = Platform.OS === 'web' ? Math.max(320, winW - sideGutter * 2) : winW;
  const contentInnerWidth = Math.max(280, contentWidth - 40);
  const logoW = Math.min(300, Math.max(160, Math.round(contentInnerWidth * 0.25)));
  const logoH = Math.round(logoW * (66 / 270));
  
  // Responsive genişlik hesaplaması - %90 alanı sayfaya ortala
  const mainContentWidth = Platform.OS === 'web' ? Math.min(1200, Math.max(800, winW * 0.9)) : winW;

  // Scroll to top functions
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const scrollToTop = useCallback(() => {
    if (Platform.OS === 'web') {
      // Web için smooth scroll - daha yumuşak
      const scrollElement = scrollViewRef.current?.getScrollableNode?.();
      if (scrollElement) {
        const currentScroll = scrollElement.scrollTop;
        const duration = 800; // 800ms süre
        const startTime = performance.now();
        
        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
        
        const animateScroll = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = easeOutCubic(progress);
          
          const scrollTop = currentScroll * (1 - easedProgress);
          scrollElement.scrollTop = scrollTop;
          
          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          }
        };
        
        requestAnimationFrame(animateScroll);
      }
    } else {
      // Native için animated scroll
      scrollViewRef.current?.scrollTo({ 
        y: 0, 
        animated: true 
      });
    }
  }, []);

  // Calculate opacity based on scroll position - çok erken başlayıp kademeli artış
  const buttonOpacity = scrollY.interpolate({
    inputRange: [0, 100, 200, 300, 500],
    outputRange: [0.1, 0.3, 0.6, 0.8, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ flex: 1 }}>
      {/* Ortak Top Bar */}
      <TopBar 
        currentPage="blog"
        onCategoriesPress={() => setCatsOpen(true)}
        onCartPress={() => setCartOpen(true)}
      />
      
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
      {/* Üst bar: sol logo, sağda filtre butonları */}
      <View style={[styles.topBar, { minHeight: logoH + 16, width: mainContentWidth, alignSelf: 'center' }]}>
        <View style={styles.topBarLinks}>
          <View style={[styles.searchBox, { minWidth: 220 }]}>
            <MaterialIcons name="search" size={18} color={colors.textMuted} />
            <TextInput
              placeholder="Ara: konu, etiket, başlık..."
              placeholderTextColor={colors.textMuted}
              value={query}
              onChangeText={setQuery}
              style={{ flex: 1, color: colors.textPrimary }}
            />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={() => setShowCategories(true)}>
            <ThemedText style={styles.filterButtonText}>Kategoriler</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={() => setShowAuthor(true)}>
            <ThemedText style={styles.filterButtonText}>Yazar</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={() => setShowDate(true)}>
            <ThemedText style={styles.filterButtonText}>Tarih</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={() => setShowTags(true)}>
            <ThemedText style={styles.filterButtonText}>Etiketler</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* %65 blog kartları - %25 bölümler - %10 boşluk */}
      <View style={[styles.columnsRow, { width: mainContentWidth, alignSelf: 'center' }, isNarrow ? { flexDirection: 'column' } : { flexDirection: 'row' }]}>
        {/* %65: İçerik kartları */}
        <View style={[styles.centerCol, isNarrow && { width: '100%' }]}>
          {filtered.map((p) => (
            <TouchableOpacity key={p.slug} style={[styles.card, { borderColor: colors.border }]} activeOpacity={0.85} onPress={() => router.push(`/blog/${p.slug}`)}>
              {!!p.cover && <Image source={p.cover} style={styles.cardImage} resizeMode="cover" />}
              <View style={styles.cardBody}>
                <ThemedText style={[styles.cardTitle, { color: colors.textPrimary }]}>{p.title}</ThemedText>
                <ThemedText style={[styles.cardMeta, { color: colors.textSecondary }]}>
                  {p.author} • {p.date} • {p.readingMinutes ?? 4} dk
                </ThemedText>
                <ThemedText style={[styles.cardExcerpt, { color: colors.textSecondary }]}>{p.excerpt}</ThemedText>
                <TouchableOpacity style={globalStyles.linkButton} onPress={() => router.push(`/blog/${p.slug}`)}>
                  <View style={styles.cardFooter}>
                    <ThemedText style={[globalStyles.linkButtonText, { color: colors.primary }]}>Devamını Oku</ThemedText>
                    <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* %25: Bölüm linkleri */}
        <View style={[styles.rightCol, isNarrow && { width: '100%' }]}>
          <View style={styles.sectionLinks}>
            <ThemedText style={styles.sectionTitle}>Bölümler</ThemedText>
            <TouchableOpacity style={styles.sectionLink}>
              <ThemedText style={styles.sectionLinkText}>Tümü</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sectionLink}>
              <ThemedText style={styles.sectionLinkText}>Odak Mentor'lu Olmak</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sectionLink}>
              <ThemedText style={styles.sectionLinkText}>Kurumsal</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sectionLink}>
              <ThemedText style={styles.sectionLinkText}>Kampanya</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sectionLink}>
              <ThemedText style={styles.sectionLinkText}>Odak Haberleri</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sectionLink}>
              <ThemedText style={styles.sectionLinkText}>Eğitim Rehberliği</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sectionLink}>
              <ThemedText style={styles.sectionLinkText}>Eğitim Haberleri</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sectionLink}>
              <ThemedText style={styles.sectionLinkText}>Bilim ve Kültür</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sectionLink}>
              <ThemedText style={styles.sectionLinkText}>Özel Günler</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* %10: Sağ boşluk */}
        <View style={[styles.rightSpacer, isNarrow && { width: '0%' }]} />
      </View>

      {/* Author Picker */}
      <Modal visible={showAuthor} transparent animationType="fade" onRequestClose={() => setShowAuthor(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ThemedText style={styles.modalTitle}>Yazar seçin</ThemedText>
            <ScrollView style={{ maxHeight: 300 }}>
              <TouchableOpacity style={styles.modalItem} onPress={() => { setActiveAuthor(null); setShowAuthor(false); }}>
                <ThemedText>Tümü</ThemedText>
              </TouchableOpacity>
              {authors.map((a) => (
                <TouchableOpacity key={a} style={styles.modalItem} onPress={() => { setActiveAuthor(a); setShowAuthor(false); }}>
                  <ThemedText>{a}</ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowAuthor(false)}>
              <ThemedText>Kapat</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      <Modal visible={showDate} transparent animationType="fade" onRequestClose={() => setShowDate(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ThemedText style={styles.modalTitle}>Tarih aralığı</ThemedText>
            {(['all','7','30'] as DateRange[]).map((r) => (
              <TouchableOpacity key={r} style={styles.modalItem} onPress={() => { setDateRange(r); setShowDate(false); }}>
                <ThemedText>{r === 'all' ? 'Tümü' : r === '7' ? 'Son 7 gün' : 'Son 30 gün'}</ThemedText>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowDate(false)}>
              <ThemedText>Kapat</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Tags Picker */}
      <Modal visible={showTags} transparent animationType="fade" onRequestClose={() => setShowTags(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ThemedText style={styles.modalTitle}>Etiket seçin</ThemedText>
            <ScrollView style={{ maxHeight: 300 }}>
              <TouchableOpacity style={styles.modalItem} onPress={() => { setActiveTag(null); setShowTags(false); }}>
                <ThemedText>#Tümü</ThemedText>
              </TouchableOpacity>
              {tags.map((t) => (
                <TouchableOpacity key={t} style={styles.modalItem} onPress={() => { setActiveTag(t); setShowTags(false); }}>
                  <ThemedText>#{t}</ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowTags(false)}>
              <ThemedText>Kapat</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Categories Picker - Using unified CategoryModal */}
      <CategoryModal visible={showCategories} onClose={() => setShowCategories(false)} />

      </ScrollView>

      {/* Scroll to Top Button (outside ScrollView) */}
      <Animated.View style={[
        styles.scrollToTopButton,
        Platform.OS === 'web' ? ({ position: 'fixed' } as any) : null,
        { opacity: buttonOpacity }
      ]}>
        <TouchableOpacity 
          style={styles.scrollToTopButtonInner}
          onPress={scrollToTop}
          activeOpacity={0.8}
        >
          <MaterialIcons name="keyboard-arrow-up" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <CategoryModal visible={catsOpen} onClose={() => setCatsOpen(false)} />
      <CartModal visible={cartOpen} onClose={() => setCartOpen(false)} />

      {/* AI Asistan Maskot */}
      <AIAssistant />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 8,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 16,
  },
  topBarLogoContainer: {
    height: '100%',
    justifyContent: 'center',
  },
  topBarLogo: {
    width: 270,
    height: 66,
  },
  topBarLinks: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 16,
  },
  topBarLink: {
    color: '#0053f5',
    fontSize: 22,
    fontWeight: '600',
  },
  columnsRow: {
    flexDirection: Platform.select({ web: 'row', default: 'column' }) as any,
    gap: 30,
    alignItems: 'flex-start',
  },
  centerCol: {
    width: Platform.select({ web: '65%', default: '100%' }) as any,
    gap: 12,
  },
  rightCol: {
    width: Platform.select({ web: '25%', default: '100%' }) as any,
    gap: 8,
  },
  rightSpacer: {
    width: Platform.select({ web: '10%', default: '0%' }) as any,
  },
  sectionLinks: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 42,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  sectionLink: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionLinkText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  filterButton: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  filterButtonText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  leftCatItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  leftCatItemActive: {
    backgroundColor: '#e0e7ff',
  },
  leftCatText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
  },
  leftCatTextActive: {
    color: '#111827',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 999,
    paddingHorizontal: 12,
    height: 40,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  chipActive: {
    backgroundColor: '#e0e7ff',
    borderColor: '#c7d2fe',
  },
  chipText: {
    fontSize: 12,
    color: '#334155',
  },
  chipTextActive: {
    color: '#111827',
    fontWeight: '700',
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  cardImage: {
    width: '100%',
    height: 339, // %10 daha artırıldı (308 * 1.1 = 339)
  },
  cardBody: {
    padding: 12,
    gap: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardMeta: {
    fontSize: 12,
  },
  cardExcerpt: {
    fontSize: 13,
  },
  cardFooter: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: Platform.OS === 'web' ? 420 : '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  scrollToTopButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    zIndex: 1000,
  },
  scrollToTopButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0053f5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});


