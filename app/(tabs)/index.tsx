import { Colors } from '@/constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Image, Linking, Modal, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AIAssistant } from '@/components/AIAssistant';
import CategoryModal from '@/components/CategoryModal';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TopBar } from '@/components/TopBar';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const APP_BG = '#ffffff';
const PANEL_BG = '#f5f5f5';
const BORDER = '#e5e7eb';

// Standart radius değerleri
const RADIUS = {
	xs: 4,
	sm: 8,
	md: 12,
	lg: 16,
	xl: 20,
	xxl: 24,
};

// Neomorfik gölge stilleri
const NEOMORPHIC_SHADOW = {
	shadowColor: '#000',
	shadowOffset: { width: 2, height: 2 },
	shadowOpacity: 0.1,
	shadowRadius: 4,
	elevation: 3,
};
const TEXT = '#1e3a8a';


const STRINGS = {
	tr: {
		subtitle: 'Yapay Zeka Destekli Online Eğitim Platformu',
		quickAccess: 'Hızlı Erişim',
		studentLogin: 'Öğrenci Girişi',
		teacherLogin: 'Öğretmen Girişi',
		tips: 'İpuçları',
		progress: 'İlerleme',
		start: 'Hemen Başlayın',
		statsStudent: 'Kayıtlı Öğrenci',
		statsTeacher: 'Kayıtlı Öğretmen',
		statsClass: 'Sanal Sınıf',
		settings: 'Ayarlar',
		notifications: 'Bildirimler',
		darkTheme: 'Karanlık Tema',
		profile: 'Profil / Öğrenci',
		applyTeacher: 'Öğretmen Başvurusu',
		language: 'Dil',
		openSystemSettings: 'Sistem Ayarlarını Aç',
	},
	en: {
		subtitle: 'AI-Powered Online Learning Platform',
		quickAccess: 'Quick Access',
		studentLogin: 'Student Login',
		teacherLogin: 'Teacher Login',
		tips: 'Tips',
		progress: 'Progress',
		start: 'Get Started',
		statsStudent: 'registered students',
		statsTeacher: 'registered teachers',
		statsClass: 'virtual classes',
		settings: 'Settings',
		notifications: 'Notifications',
		darkTheme: 'Dark Theme',
		profile: 'Profile / Student',
		applyTeacher: 'Apply as Teacher',
		language: 'Language',
		openSystemSettings: 'Open System Settings',
	},
} as const;

const pickRandom = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const randomRating = () => Number((Math.random() * (9.5 - 7.0) + 7.0).toFixed(1)); // 7.0 - 9.5 arası 10 üzerinden
const randomVotes = () => Math.floor(Math.random() * (220 - 30) + 30);

// 10 üzerinden puanı 5 yıldıza çevir
const getStarsFromRating = (rating: number) => {
  const stars = Math.round(rating * 0.5); // 10 üzerinden 5 yıldıza çevir
  const fullStars = Math.floor(stars);
  const hasHalfStar = stars % 1 >= 0.5;
  
  let starString = '★'.repeat(fullStars);
  if (hasHalfStar) {
    starString += '☆';
  }
  // Kalan yıldızları boş yıldızla doldur
  const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  starString += '☆'.repeat(remainingStars);
  
  return starString;
};

const FIRST_NAMES_FEMALE = ['Ayşe','Elif','Selin','Zeynep','Merve','Yasemin','Derya','Seda','İrem','Ayla','Gizem','Cansu','Eda','Esra'];
const FIRST_NAMES_MALE = ['Mehmet','Kemal','Kadir','Emre','Burak','Hakan','Can','Onur','Kaan','Umut','Tuna'];
const LAST_NAMES = ['Yılmaz','Demir','Kara','Kaplan','Aksoy','Ünsal','Arslan','Yolcu','Kaya','Aydın','Çelik','Doğan','Koç','Polat','Şahin','Bulut','Öztürk','Erdoğan','Kurt','Arı'];
const SUBJECTS_ALL: string[] = ['Matematik','Fizik','Kimya','Biyoloji','Türkçe','İngilizce','Coğrafya','Tarih','Bilişim Teknolojileri','Edebiyat','Robotik Kodlama','Bilgisayar'];
const GRADE_RANGES_ALL: string[] = ['4-6. sınıflar','5-8. sınıflar','6-10. sınıflar','9-12. sınıflar'];

const TEACHER_ASSETS = [
  { photo: require('@/assets/images/teachers/ayseyilmaz.png'), gender: 'f' as const },
  { photo: require('@/assets/images/teachers/elifkara.png'), gender: 'f' as const },
  { photo: require('@/assets/images/teachers/aycakabatas.png'), gender: 'f' as const },
  { photo: require('@/assets/images/teachers/mehmetdemir.png'), gender: 'm' as const },
  { photo: require('@/assets/images/teachers/kemalkaplan.png'), gender: 'm' as const },
  { photo: require('@/assets/images/teachers/kadiryolcu.png'), gender: 'm' as const },
];

const generateRandomTeacher = (idx: number) => {
  const name = `${pickRandom([...FIRST_NAMES_FEMALE, ...FIRST_NAMES_MALE])} ${pickRandom(LAST_NAMES)}`;
  return {
    id: `t${idx + 1}`,
    name,
    branch: pickRandom(SUBJECTS_ALL),
    grades: pickRandom(GRADE_RANGES_ALL),
    rating: randomRating(),
    votes: randomVotes(),
    photo: TEACHER_ASSETS[idx % TEACHER_ASSETS.length].photo,
  } as const;
};

const TEACHERS = Array.from({ length: 144 }).map((_, i) => generateRandomTeacher(i));


const SUBJECTS = SUBJECTS_ALL;
const GRADE_RANGES = GRADE_RANGES_ALL;


export default function HomeScreen() {
	const router = useRouter();
	const scheme = useColorScheme();
	const colors = Colors[scheme ?? 'light'];
	const [lang, setLang] = useState<'tr' | 'en'>('tr');
	const t = (k: keyof typeof STRINGS['tr']) => STRINGS[lang][k];
    const user = useAuthStore((s) => s.user);
    const firstName = (user?.displayName || '').split(' ')[0] || '';
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const insets = useSafeAreaInsets();
	const { width: windowWidth } = useWindowDimensions();
	const sideGutter = Platform.OS === 'web' ? Math.max(16, Math.round(windowWidth * 0.15)) : 16;
	const contentWidth = Platform.OS === 'web' ? Math.max(320, windowWidth - sideGutter * 2) : windowWidth;
	// İstatistik kutuları marginHorizontal:20 kullanıyor; banner genişliğini aynı iç genişliğe sabitleyelim
	const contentInnerWidth = Math.max(280, contentWidth - 40);
	const bannerHeight = Math.round(contentInnerWidth / 4); // 4:1 oranı (1000x250 px)

	// Hover effects for category links
	const handleLinkHover = (e: any, isEnter: boolean) => {
		if (isEnter) {
			e.currentTarget.style.backgroundColor = '#0053f5';
			const textElement = e.currentTarget.querySelector('*');
			if (textElement) textElement.style.color = '#ffffff';
		} else {
			e.currentTarget.style.backgroundColor = 'transparent';
			const textElement = e.currentTarget.querySelector('*');
			if (textElement) textElement.style.color = '#0f172a';
		}
	};

	// Banner carousel refs

	const [catsOpen, setCatsOpen] = useState(false);
	const CATS = ['Sınıflar', 'Online Dersler', 'Sınava Hazırlık', 'Yabancı Dil', 'Rehberlik'] as const;
	const [catActive, setCatActive] = useState<typeof CATS[number] | null>(null);

	// Search filter states
	const [kursTuruOpen, setKursTuruOpen] = useState(false);
	const [selectedKursTuru, setSelectedKursTuru] = useState('Ortaokul');
	const [hoveredKurs, setHoveredKurs] = useState<string | null>(null);
	const [sinifOpen, setSinifOpen] = useState(false);
	const [selectedSinif, setSelectedSinif] = useState('5. Sınıf');
	const [hoveredSinif, setHoveredSinif] = useState<string | null>(null);
	const [ihtiyacOpen, setIhtiyacOpen] = useState(false);
	const [selectedIhtiyac, setSelectedIhtiyac] = useState('LGS Hazırlık');
	const [hoveredIhtiyac, setHoveredIhtiyac] = useState<string | null>(null);
	const [scrollY, setScrollY] = useState(0);
	
	// Banner carousel states
	const [currentBanner, setCurrentBanner] = useState(0);
	const bannerScrollRef = useRef<ScrollView>(null);
	
	// Gallery image hover states
	const [hoveredImage, setHoveredImage] = useState<number | null>(null);
	
	// Banner carousel functions
	const nextBanner = useCallback(() => {
		const nextIndex = (currentBanner + 1) % 4;
		setCurrentBanner(nextIndex);
		const scrollX = nextIndex * contentInnerWidth;
		bannerScrollRef.current?.scrollTo({ x: scrollX, animated: true });
	}, [currentBanner, contentInnerWidth]);
	
	const prevBanner = useCallback(() => {
		const prevIndex = currentBanner === 0 ? 3 : currentBanner - 1;
		setCurrentBanner(prevIndex);
		const scrollX = prevIndex * contentInnerWidth;
		bannerScrollRef.current?.scrollTo({ x: scrollX, animated: true });
	}, [currentBanner, contentInnerWidth]);

	// Genişlik değişince aktif banner'a hizala
	useEffect(() => {
		bannerScrollRef.current?.scrollTo({ x: currentBanner * contentInnerWidth, animated: false });
	}, [contentInnerWidth, currentBanner]);
	
	// Transparanlık hesaplama (0-100px scroll'da %20'ye kadar)
	const getHeaderOpacity = () => {
		const maxScroll = 100;
		const minOpacity = 0.8; // %20 transparanlık = %80 opacity
		const currentOpacity = Math.max(minOpacity, 1 - (scrollY / maxScroll) * (1 - minOpacity));
		return currentOpacity;
	};
	
	const KURS_TURLERI = ['İlkokul', 'Ortaokul', 'Lise', 'Yabancı Dil', 'Koçluk', 'Beceri'];
	
	// Dinamik sınıf seçenekleri
	const getSinifOptions = (kursTuru: string) => {
		switch (kursTuru) {
			case 'İlkokul':
				return ['1. Sınıf', '2. Sınıf', '3. Sınıf', '4. Sınıf'];
			case 'Ortaokul':
				return ['5. Sınıf', '6. Sınıf', '7. Sınıf', '8. Sınıf'];
			case 'Lise':
				return ['9. Sınıf', '10. Sınıf', '11. Sınıf', '12. Sınıf'];
			case 'Yabancı Dil':
			case 'Koçluk':
			case 'Beceri':
				return ['1. Sınıf', '2. Sınıf', '3. Sınıf', '4. Sınıf', '5. Sınıf', '6. Sınıf', '7. Sınıf', '8. Sınıf', '9. Sınıf', '10. Sınıf', '11. Sınıf', '12. Sınıf'];
			default:
				return ['1. Sınıf', '2. Sınıf', '3. Sınıf', '4. Sınıf', '5. Sınıf', '6. Sınıf', '7. Sınıf', '8. Sınıf', '9. Sınıf', '10. Sınıf', '11. Sınıf', '12. Sınıf'];
		}
	};
	// Dinamik ihtiyaç seçenekleri
	const getIhtiyacOptions = (kursTuru: string) => {
		switch (kursTuru) {
			case 'İlkokul':
				return ['Okul Takviye', 'Bursluluk Sınavı', 'Kanguru Sınavı'];
			case 'Ortaokul':
				return ['LGS Hazırlık', 'Bursluluk Sınavı', 'Kanguru Sınavı', 'Okula Takviye'];
			case 'Lise':
				return ['YKS Hazırlık', 'IB Sınavı', 'IGCSE Sınavı', 'Kanguru Sınavı', 'Okula Takviye'];
			case 'Yabancı Dil':
				return ['Sınavlara Hazırlık', 'Mesleki Dil', 'Konuşma', 'Okula Takviye'];
			case 'Koçluk':
				return ['Sınavlara Hazırlık', 'Okula Takviye'];
			case 'Beceri':
				return ['Yetenek Sınavı', 'Hobi'];
			default:
				return ['Okul Takviye', 'Bursluluk Sınavı', 'Kanguru Sınavı'];
		}
	};

	const [settingsOpen, setSettingsOpen] = useState(false);
	const [filterOpen, setFilterOpen] = useState(false);
	const [cartOpen, setCartOpen] = useState(false);
	const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
	const [selectedGrades, setSelectedGrades] = useState<string[]>([]);

	const filteredTeachers = useMemo(() => {
		return TEACHERS.filter((t) =>
			(selectedSubjects.length === 0 || selectedSubjects.includes(t.branch)) &&
			(selectedGrades.length === 0 || selectedGrades.includes(t.grades))
		);
	}, [selectedSubjects, selectedGrades]);

	const studentsVal = useRef(new Animated.Value(0)).current;
	const teachersVal = useRef(new Animated.Value(0)).current;
	const classesVal = useRef(new Animated.Value(0)).current;
	const hoursVal = useRef(new Animated.Value(0)).current;
	const [studentsCnt, setStudentsCnt] = useState(0);
	const [teachersCnt, setTeachersCnt] = useState(0);
	const [classesCnt, setClassesCnt] = useState(0);
	const [hoursCnt, setHoursCnt] = useState(0);

	useEffect(() => {
		const ease = Easing.out(Easing.quad);
		Animated.timing(studentsVal, { toValue: 634, duration: 1200, easing: ease, useNativeDriver: false }).start();
		Animated.timing(teachersVal, { toValue: 144, duration: 1200, easing: ease, useNativeDriver: false }).start();
		Animated.timing(classesVal, { toValue: 20, duration: 1200, easing: ease, useNativeDriver: false }).start();
		Animated.timing(hoursVal, { toValue: 10000, duration: 1200, easing: ease, useNativeDriver: false }).start();

		const sSub = studentsVal.addListener(({ value }) => setStudentsCnt(Math.round(value)));
		const tSub = teachersVal.addListener(({ value }) => setTeachersCnt(Math.round(value)));
		const cSub = classesVal.addListener(({ value }) => setClassesCnt(Math.round(value)));
		const hSub = hoursVal.addListener(({ value }) => setHoursCnt(Math.round(value)));
		return () => {
			studentsVal.removeListener(sSub);
			teachersVal.removeListener(tSub);
			classesVal.removeListener(cSub);
			hoursVal.removeListener(hSub);
		};
	}, [studentsVal, teachersVal, classesVal, hoursVal]);

	// Auto-advance banner every 5 seconds
	useEffect(() => {
		const id = setInterval(() => {
			nextBanner();
		}, 5000);
		return () => clearInterval(id);
	}, [nextBanner]);

	return (
		<>
			<View style={{ flex: 1 }}>
			<View style={{ opacity: getHeaderOpacity() }}>
				<TopBar 
					currentPage="home"
					onCategoriesPress={() => {
						setCatsOpen(!catsOpen);
						if (!catsOpen) {
							setCatActive('Sınıflar');
						}
					}}
					onCartPress={() => setCartOpen(true)}
				/>
			</View>
			
			<StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
			
			{/* Scrollable Content */}
			<ScrollView 
				style={{ flex: 1, backgroundColor: colors.background }} 
				contentContainerStyle={{ paddingBottom: insets.bottom + 32, paddingHorizontal: sideGutter }} 
				showsVerticalScrollIndicator={true}
				onScroll={(event) => {
					setScrollY(event.nativeEvent.contentOffset.y);
				}}
				scrollEventThrottle={16}
			>
				{/* Search Filter Container */}
				<View style={styles.searchContainer}>
				<View style={styles.searchFilters}>
					{/* Kurs Türü Dropdown */}
					<View style={styles.filterItem}>
						<ThemedText style={styles.filterLabel}>Kurs Türü</ThemedText>
						<TouchableOpacity 
							style={styles.filterDropdown}
							onPress={() => {
								setKursTuruOpen(!kursTuruOpen);
								// Diğer dropdown'ları kapat
								setSinifOpen(false);
								setIhtiyacOpen(false);
							}}
						>
							<ThemedText style={styles.filterValue}>{selectedKursTuru}</ThemedText>
							<MaterialIcons 
								name={kursTuruOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
								size={20} 
								color="#666" 
							/>
						</TouchableOpacity>
						
						{kursTuruOpen && (
							<View style={styles.dropdownMenu}>
								{KURS_TURLERI.map((kurs) => (
									<TouchableOpacity
										key={kurs}
										style={[
											styles.dropdownItem,
											hoveredKurs === kurs && styles.dropdownItemHovered
										]}
										onPress={() => {
											setSelectedKursTuru(kurs);
											setKursTuruOpen(false);
											setHoveredKurs(null);
											
											// Kurs türü değiştiğinde sınıf ve ihtiyaç seçimini sıfırla
											const yeniSinifOptions = getSinifOptions(kurs);
											if (!yeniSinifOptions.includes(selectedSinif)) {
												setSelectedSinif(yeniSinifOptions[0]);
											}
											
											const yeniIhtiyacOptions = getIhtiyacOptions(kurs);
											if (!yeniIhtiyacOptions.includes(selectedIhtiyac)) {
												setSelectedIhtiyac(yeniIhtiyacOptions[0]);
											}
										}}
										onPressIn={() => setHoveredKurs(kurs)}
										onPressOut={() => setHoveredKurs(null)}
									>
										<ThemedText style={[
											styles.dropdownItemText,
											hoveredKurs === kurs && styles.dropdownItemTextHovered
										]}>
											{kurs}
										</ThemedText>
									</TouchableOpacity>
								))}
							</View>
						)}
					</View>

					{/* Kaçıncı Sınıf Dropdown */}
					<View style={styles.filterItem}>
						<ThemedText style={styles.filterLabel}>Kaçıncı Sınıf?</ThemedText>
						<TouchableOpacity 
							style={styles.filterDropdown}
							onPress={() => {
								setSinifOpen(!sinifOpen);
								// Diğer dropdown'ları kapat
								setKursTuruOpen(false);
								setIhtiyacOpen(false);
							}}
						>
							<ThemedText style={styles.filterValue}>{selectedSinif}</ThemedText>
							<MaterialIcons 
								name={sinifOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
								size={20} 
								color="#666" 
							/>
						</TouchableOpacity>
						
						{sinifOpen && (
							<View style={styles.dropdownMenu}>
								{getSinifOptions(selectedKursTuru).map((sinif) => (
									<TouchableOpacity
										key={sinif}
										style={[
											styles.dropdownItem,
											hoveredSinif === sinif && styles.dropdownItemHovered
										]}
										onPress={() => {
											setSelectedSinif(sinif);
											setSinifOpen(false);
											setHoveredSinif(null);
										}}
										onPressIn={() => setHoveredSinif(sinif)}
										onPressOut={() => setHoveredSinif(null)}
									>
										<ThemedText style={[
											styles.dropdownItemText,
											hoveredSinif === sinif && styles.dropdownItemTextHovered
										]}>
											{sinif}
										</ThemedText>
									</TouchableOpacity>
								))}
							</View>
						)}
					</View>

					{/* İhtiyacınız Dropdown */}
					<View style={styles.filterItem}>
						<ThemedText style={styles.filterLabel}>İhtiyacınız</ThemedText>
						<TouchableOpacity 
							style={styles.filterDropdown}
							onPress={() => {
								setIhtiyacOpen(!ihtiyacOpen);
								// Diğer dropdown'ları kapat
								setKursTuruOpen(false);
								setSinifOpen(false);
							}}
						>
							<ThemedText style={styles.filterValue}>{selectedIhtiyac}</ThemedText>
							<MaterialIcons 
								name={ihtiyacOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
								size={20} 
								color="#666" 
							/>
						</TouchableOpacity>
						
						{ihtiyacOpen && (
							<View style={styles.dropdownMenu}>
								{getIhtiyacOptions(selectedKursTuru).map((ihtiyac) => (
									<TouchableOpacity
										key={ihtiyac}
										style={[
											styles.dropdownItem,
											hoveredIhtiyac === ihtiyac && styles.dropdownItemHovered
										]}
										onPress={() => {
											setSelectedIhtiyac(ihtiyac);
											setIhtiyacOpen(false);
											setHoveredIhtiyac(null);
										}}
										onPressIn={() => setHoveredIhtiyac(ihtiyac)}
										onPressOut={() => setHoveredIhtiyac(null)}
									>
										<ThemedText style={[
											styles.dropdownItemText,
											hoveredIhtiyac === ihtiyac && styles.dropdownItemTextHovered
										]}>
											{ihtiyac}
										</ThemedText>
									</TouchableOpacity>
								))}
							</View>
						)}
					</View>

					{/* Özel Ders Ara Button */}
					<TouchableOpacity style={styles.searchButton}>
						<MaterialIcons name="search" size={20} color="#fff" />
						<ThemedText style={styles.searchButtonText}>Özel Ders Ara</ThemedText>
					</TouchableOpacity>
				</View>
			</View>

				{/* Banner Carousel */}
				<View style={[styles.bannerCarouselContainer, { paddingHorizontal: 0 }]}>
					<View style={[styles.bannerWrapper, { height: bannerHeight, alignSelf: 'center', width: contentInnerWidth, borderRadius: RADIUS.xxl }]}>
						<Animated.ScrollView
							ref={bannerScrollRef}
							horizontal
							pagingEnabled
							showsHorizontalScrollIndicator={false}
							scrollEnabled={false}
							style={styles.bannerScrollView}
						>
							<Image source={require('@/assets/images/hedef_1.png')} style={[styles.bannerImage, { width: contentInnerWidth }]} resizeMode="cover" />
							<Image source={require('@/assets/images/hedef_2.png')} style={[styles.bannerImage, { width: contentInnerWidth }]} resizeMode="cover" />
							<Image source={require('@/assets/images/hedef_3.png')} style={[styles.bannerImage, { width: contentInnerWidth }]} resizeMode="cover" />
							<Image source={require('@/assets/images/hedef_4.png')} style={[styles.bannerImage, { width: contentInnerWidth }]} resizeMode="cover" />
						</Animated.ScrollView>
						
						{/* Banner Controls - Overlay on banner */}
						<View style={styles.bannerControlsOverlay}>
							{(() => {
								const controlSize = Math.min(50, Math.max(35, contentInnerWidth * 0.07));
								const controlRadius = controlSize / 2;
								const controlFont = Math.min(20, Math.max(14, contentInnerWidth * 0.035));
								return (
									<>
										<TouchableOpacity style={[styles.bannerButtonOverlay, { width: controlSize, height: controlSize, borderRadius: controlRadius }]} onPress={prevBanner}>
											<Text style={[styles.bannerButtonTextOverlay, { fontSize: controlFont, lineHeight: controlFont }]}>◀</Text>
										</TouchableOpacity>
										<View style={styles.bannerSpacer} />
										<TouchableOpacity style={[styles.bannerButtonOverlay, { width: controlSize, height: controlSize, borderRadius: controlRadius }]} onPress={nextBanner}>
											<Text style={[styles.bannerButtonTextOverlay, { fontSize: controlFont, lineHeight: controlFont }]}>▶</Text>
										</TouchableOpacity>
									</>
								);
							})()}
						</View>
					</View>
				</View>
				{!!firstName && (
					<ThemedText style={[styles.welcomeText, { marginTop: 0 }]}>Hoş geldin, {firstName}</ThemedText>
				)}


				{/* Stats Section */}
				<ThemedView id="i1" style={[styles.statsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
					<View style={styles.statCard}>
						<ThemedText style={styles.statNumber}>{studentsCnt}</ThemedText>
						<ThemedText style={styles.statLabel}>{t('statsStudent')}</ThemedText>
					</View>
					<View style={styles.statDivider} />
					<View style={styles.statCard}>
						<ThemedText style={styles.statNumber}>{teachersCnt}</ThemedText>
						<ThemedText style={styles.statLabel}>{t('statsTeacher')}</ThemedText>
					</View>
					<View style={styles.statDivider} />
					<View style={styles.statCard}>
						<ThemedText style={styles.statNumber}>{classesCnt}</ThemedText>
						<ThemedText style={styles.statLabel}>{t('statsClass')}</ThemedText>
					</View>
					<View style={styles.statDivider} />
					<View style={styles.statCard}>
						<ThemedText style={styles.statNumber}>{hoursCnt.toLocaleString()}+</ThemedText>
						<ThemedText style={styles.statLabel}>Saat Ders</ThemedText>
					</View>
				</ThemedView>

				{/* Image Gallery Container */}
				<ThemedView id="r1" style={styles.imageGalleryContainer}>
					<View style={styles.imageRow}>
						<TouchableOpacity 
							style={styles.galleryImageContainer}
							onPressIn={() => setHoveredImage(1)}
							onPressOut={() => setHoveredImage(null)}
							onPress={() => {/* Link will be added later */}}
							{...Platform.OS === 'web' && { 
								onMouseEnter: () => setHoveredImage(1),
								onMouseLeave: () => setHoveredImage(null)
							}}
						>
							<Image 
								source={require('@/assets/images/resimli_1.png')} 
								style={[
									styles.galleryImage, 
									hoveredImage === 1 && styles.galleryImageHover
								]} 
								resizeMode="contain"
							/>
						</TouchableOpacity>
						<TouchableOpacity 
							style={styles.galleryImageContainer}
							onPressIn={() => setHoveredImage(2)}
							onPressOut={() => setHoveredImage(null)}
							onPress={() => {/* Link will be added later */}}
							{...Platform.OS === 'web' && { 
								onMouseEnter: () => setHoveredImage(2),
								onMouseLeave: () => setHoveredImage(null)
							}}
						>
							<Image 
								source={require('@/assets/images/resimli_2.png')} 
								style={[
									styles.galleryImage, 
									hoveredImage === 2 && styles.galleryImageHover
								]} 
								resizeMode="contain"
							/>
						</TouchableOpacity>
						<TouchableOpacity 
							style={styles.galleryImageContainer}
							onPressIn={() => setHoveredImage(3)}
							onPressOut={() => setHoveredImage(null)}
							onPress={() => {/* Link will be added later */}}
							{...Platform.OS === 'web' && { 
								onMouseEnter: () => setHoveredImage(3),
								onMouseLeave: () => setHoveredImage(null)
							}}
						>
								<Image 
									source={require('@/assets/images/resimli_3.png')} 
									style={[
										styles.galleryImage, 
										hoveredImage === 3 && styles.galleryImageHover
									]} 
									resizeMode="contain"
								/>
						</TouchableOpacity>
					</View>
					<View style={styles.imageRow}>
						<TouchableOpacity 
							style={styles.galleryImageContainer}
							onPressIn={() => setHoveredImage(4)}
							onPressOut={() => setHoveredImage(null)}
							onPress={() => {/* Link will be added later */}}
							{...Platform.OS === 'web' && { 
								onMouseEnter: () => setHoveredImage(4),
								onMouseLeave: () => setHoveredImage(null)
							}}
						>
								<Image 
									source={require('@/assets/images/resimli_4.png')} 
									style={[
										styles.galleryImage, 
										hoveredImage === 4 && styles.galleryImageHover
									]} 
									resizeMode="contain"
								/>
						</TouchableOpacity>
						<TouchableOpacity 
							style={styles.galleryImageContainer}
							onPressIn={() => setHoveredImage(5)}
							onPressOut={() => setHoveredImage(null)}
							onPress={() => {/* Link will be added later */}}
							{...Platform.OS === 'web' && { 
								onMouseEnter: () => setHoveredImage(5),
								onMouseLeave: () => setHoveredImage(null)
							}}
						>
								<Image 
									source={require('@/assets/images/resimli_5.png')} 
									style={[
										styles.galleryImage, 
										hoveredImage === 5 && styles.galleryImageHover
									]} 
									resizeMode="contain"
								/>
						</TouchableOpacity>
						<TouchableOpacity 
							style={styles.galleryImageContainer}
							onPressIn={() => setHoveredImage(6)}
							onPressOut={() => setHoveredImage(null)}
							onPress={() => {/* Link will be added later */}}
							{...Platform.OS === 'web' && { 
								onMouseEnter: () => setHoveredImage(6),
								onMouseLeave: () => setHoveredImage(null)
							}}
						>
								<Image 
									source={require('@/assets/images/resimli_6.png')} 
									style={[
										styles.galleryImage, 
										hoveredImage === 6 && styles.galleryImageHover
									]} 
									resizeMode="contain"
								/>
						</TouchableOpacity>
					</View>
				</ThemedView>

				{/* Kişiye Özel Section */}
				<Image
					source={require('@/assets/images/kisiye_ozel.png')}
					style={styles.kisiyeOzelImage} 
					resizeMode="contain"
				/>


				{/* Features Section */}
				<ThemedView style={styles.featuresContainer}>
					<ThemedText type="subtitle" style={[styles.sectionTitle]}>
						Özellikler
					</ThemedText>

					<TouchableOpacity style={[styles.teacherExploreBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} activeOpacity={0.85} onPress={() => setFilterOpen(true)}>
						<View style={styles.teacherExploreLeft}>
							<MaterialIcons name="groups" size={20} color={colors.textPrimary} />
							<ThemedText style={styles.teacherExploreText}>Öğretmenlerimizi Keşfet</ThemedText>
						</View>
						<MaterialIcons name="filter-alt" size={18} color={TEXT} />
					</TouchableOpacity>

					<TouchableOpacity style={[styles.teacherExploreBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} activeOpacity={0.85} onPress={() => router.push('/ai')}>
						<View style={styles.teacherExploreLeft}>
							<MaterialIcons name="psychology" size={20} color={colors.textPrimary} />
							<ThemedText style={styles.teacherExploreText}>Yapay Zeka Destekli</ThemedText>
						</View>
						<MaterialIcons name="chevron-right" size={22} color={TEXT} />
					</TouchableOpacity>

					<TouchableOpacity style={[styles.teacherExploreBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} activeOpacity={0.85} onPress={() => router.push('/coach')}>
						<View style={styles.teacherExploreLeft}>
							<MaterialIcons name="person" size={20} color={colors.textPrimary} />
							<ThemedText style={styles.teacherExploreText}>Kişisel Koçluk</ThemedText>
						</View>
						<MaterialIcons name="filter-alt" size={18} color={TEXT} />
					</TouchableOpacity>

					<TouchableOpacity style={[styles.teacherExploreBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} activeOpacity={0.85} onPress={() => router.push(isAuthenticated ? '/progress' : '/student')}>
						<View style={styles.teacherExploreLeft}>
							<MaterialIcons name="insights" size={20} color={colors.textPrimary} />
							<ThemedText style={styles.teacherExploreText}>İlerleme Takibi</ThemedText>
						</View>
						<MaterialIcons name="filter-alt" size={18} color={TEXT} />
					</TouchableOpacity>

					<TouchableOpacity style={[styles.teacherExploreBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} activeOpacity={0.85} onPress={() => router.push('/privacy')}>
						<View style={styles.teacherExploreLeft}>
							<MaterialIcons name="shield" size={20} color={colors.textPrimary} />
							<ThemedText style={styles.teacherExploreText}>Güvenli & Özel</ThemedText>
						</View>
						<MaterialIcons name="filter-alt" size={18} color={TEXT} />
					</TouchableOpacity>
				</ThemedView>

				{/* Get Started Button */}
				<TouchableOpacity style={[styles.getStartedButton]} activeOpacity={0.8} onPress={() => router.push('/student')}>
					<LinearGradient
						colors={[TEXT, TEXT]}
						style={styles.buttonGradient}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
					>
						<ThemedText style={styles.buttonText}>{t('start')}</ThemedText>
					</LinearGradient>
				</TouchableOpacity>

				{/* Footer */}
				<ThemedView style={[styles.footer, { backgroundColor: colors.background }]}>
					<ThemedText style={[styles.footerText]}>
						Odak Mentor ile öğrenme yolculuğunuza başlayın
					</ThemedText>
				</ThemedView>
			</ScrollView>

			{/* Settings Modal */}
			<Modal visible={settingsOpen} transparent animationType="fade" onRequestClose={() => setSettingsOpen(false)}>
				<Pressable style={styles.modalOverlay} onPress={() => setSettingsOpen(false)}>
					<View style={[styles.modalCard, { paddingTop: insets.top + 8 }]}>
						<View style={styles.modalHeader}>
							<ThemedText style={styles.modalTitle}>{t('settings')}</ThemedText>
							<TouchableOpacity onPress={() => setSettingsOpen(false)}>
								<MaterialIcons name="close" size={22} color={TEXT} />
							</TouchableOpacity>
						</View>

						<TouchableOpacity style={styles.modalItem} onPress={() => Linking.openSettings?.()}>
							<MaterialIcons name="settings" size={20} color={TEXT} />
							<ThemedText style={styles.modalItemLabel}>{t('openSystemSettings')}</ThemedText>
						</TouchableOpacity>

						<View style={styles.modalRowBetween}>
							<View style={styles.modalItemLeft}>
								<MaterialIcons name="language" size={20} color={TEXT} />
								<ThemedText style={styles.modalItemLabel}>{t('language')}</ThemedText>
							</View>
							<View style={styles.langRow}>
								<TouchableOpacity style={[styles.langBtn, lang === 'tr' && styles.langBtnActive]} onPress={() => setLang('tr')}>
									<ThemedText style={styles.langBtnText}>TR</ThemedText>
								</TouchableOpacity>
								<TouchableOpacity style={[styles.langBtn, lang === 'en' && styles.langBtnActive]} onPress={() => setLang('en')}>
									<ThemedText style={styles.langBtnText}>EN</ThemedText>
								</TouchableOpacity>
							</View>
						</View>

						<TouchableOpacity style={styles.modalItem} onPress={() => { setSettingsOpen(false); router.push('/student'); }}>
							<MaterialIcons name="account-circle" size={20} color={TEXT} />
							<ThemedText style={styles.modalItemLabel}>{t('profile')}</ThemedText>
						</TouchableOpacity>

						<TouchableOpacity style={styles.modalItem} onPress={() => { setSettingsOpen(false); router.push('/teacher'); }}>
							<MaterialIcons name="work" size={20} color={TEXT} />
							<ThemedText style={styles.modalItemLabel}>{t('applyTeacher')}</ThemedText>
						</TouchableOpacity>
					</View>
				</Pressable>
			</Modal>

			{/* Cart Modal */}
			<Modal visible={cartOpen} transparent animationType="fade" onRequestClose={() => setCartOpen(false)}>
				<View style={[styles.modalOverlay, { paddingTop: insets.top + 8, justifyContent: 'center', alignItems: 'center' }]} pointerEvents="box-none">
					<Pressable style={styles.modalBackdrop} onPress={() => setCartOpen(false)} />
					<View style={[styles.cartModalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
						{/* Filigran - logo1.png */}
						<View style={styles.cartModalWatermark} pointerEvents="none">
							<Image 
								source={require('@/assets/images/logo1.png')} 
								style={styles.cartModalWatermarkLogo} 
								resizeMode="contain" 
							/>
						</View>
						
						<View style={styles.cartModalHeader}>
							<TouchableOpacity onPress={() => setCartOpen(false)}>
								<MaterialIcons name="close" size={24} color={TEXT} />
							</TouchableOpacity>
						</View>
						<View style={styles.cartModalContent}>
							<Image 
								source={require('@/assets/images/logo2.png')} 
								style={styles.cartModalLogo} 
								resizeMode="contain" 
							/>
							<ThemedText style={[styles.cartModalText, { color: colors.textPrimary }]}>
								Çok yakında sizlerle.
							</ThemedText>
						</View>
					</View>
				</View>
			</Modal>

			{/* Categories Modal */}
			<CategoryModal visible={catsOpen} onClose={() => setCatsOpen(false)} />

			{/* Teachers Filter Modal */}
			<Modal visible={filterOpen} transparent animationType="fade" onRequestClose={() => setFilterOpen(false)}>
				<View style={[styles.modalOverlay, { paddingTop: insets.top + 8, justifyContent: 'flex-start', alignItems: 'center' }]} pointerEvents="box-none">
					<Pressable style={styles.modalBackdrop} onPress={() => setFilterOpen(false)} />
					<View style={[styles.modalCard, { maxHeight: '85%' }]}>
						<View style={styles.modalHeaderTopRow}>
							<TouchableOpacity style={styles.modalBackRow} activeOpacity={0.7} onPress={() => setFilterOpen(false)}>
								<MaterialIcons name="arrow-back" size={22} color={TEXT} />
								<ThemedText style={styles.modalBackText}>Geri</ThemedText>
							</TouchableOpacity>
							<View style={{ position: 'absolute', left: 0, right: 0, alignItems: 'center' }} pointerEvents="none">
								<ThemedText style={styles.modalTitle}>Öğretmenlerimiz</ThemedText>
							</View>
							<TouchableOpacity onPress={() => setFilterOpen(false)}>
								<MaterialIcons name="close" size={22} color={TEXT} />
							</TouchableOpacity>
						</View>

						<ScrollView style={{ alignSelf: 'stretch' }} contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator>
							<ThemedText style={styles.modalItemLabel}>Dersler</ThemedText>
							<View style={styles.chipsRow}>
								{SUBJECTS.map((s) => {
									const active = selectedSubjects.includes(s);
									return (
										<TouchableOpacity key={s} style={[styles.chip, active && styles.chipActive]} onPress={() => setSelectedSubjects((prev) => active ? prev.filter(p=>p!==s) : [...prev, s])}>
											<ThemedText style={[styles.chipText, active && styles.chipTextActive]}>{s}</ThemedText>
										</TouchableOpacity>
									);
								})}
							</View>

							<ThemedText style={[styles.modalItemLabel, { marginTop: 6 }]}>Sınıflar</ThemedText>
							<View style={styles.chipsRow}>
								{GRADE_RANGES.map((g) => {
									const active = selectedGrades.includes(g);
									return (
										<TouchableOpacity key={g} style={[styles.chip, active && styles.chipActive]} onPress={() => setSelectedGrades((prev) => active ? prev.filter(p=>p!==g) : [...prev, g])}>
											<ThemedText style={[styles.chipText, active && styles.chipTextActive]}>{g}</ThemedText>
										</TouchableOpacity>
									);
								})}
							</View>

							{/* Filtered teachers list - 2 sütun */}
							<View style={{ marginTop: 8 }}>
								<View style={styles.teachersGrid}>
									{filteredTeachers.map((tch) => (
										<View key={tch.id} style={styles.modalTeacherCard}>
											{/* Sol yarı - Resim */}
											<View style={styles.modalTeacherLeft}>
												<Image source={tch.photo} style={styles.modalTeacherImg} />
											</View>
											
											{/* Sağ yarı - Bilgiler */}
											<View style={styles.modalTeacherRight}>
												<ThemedText style={styles.modalTeacherName}>{tch.name}</ThemedText>
												<ThemedText style={styles.modalTeacherMeta}>{tch.branch}</ThemedText>
												<View style={styles.modalTeacherRatingContainer}>
													<ThemedText style={styles.modalTeacherRating}>{getStarsFromRating(tch.rating)}</ThemedText>
													<ThemedText style={styles.modalTeacherRatingText}>{tch.rating.toFixed(1)}/10.0</ThemedText>
												</View>
												<ThemedText style={styles.modalTeacherCertificates}>
													Sertifikalı Eğitmen • 5+ Yıl Deneyim
												</ThemedText>
												<View style={styles.modalTeacherButtons}>
													<TouchableOpacity style={styles.modalTeacherAppointmentBtn}>
														<ThemedText style={styles.modalTeacherAppointmentText}>Randevu Al</ThemedText>
													</TouchableOpacity>
													<TouchableOpacity style={styles.modalTeacherAction}>
														<ThemedText style={styles.modalTeacherActionText}>Görüntüle</ThemedText>
													</TouchableOpacity>
												</View>
											</View>
										</View>
									))}
								</View>

								{filteredTeachers.length === 0 && (
									<ThemedText style={{ color: TEXT, textAlign: 'center', marginTop: 20 }}>Seçilen filtrelerle eşleşen öğretmen bulunamadı.</ThemedText>
								)}
							</View>

							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
								<TouchableOpacity onPress={() => { setSelectedSubjects([]); setSelectedGrades([]); }}>
									<ThemedText style={{ color: TEXT, fontWeight: '600' }}>Filtreleri Temizle</ThemedText>
								</TouchableOpacity>
								<TouchableOpacity onPress={() => setFilterOpen(false)}>
									<ThemedText style={{ color: TEXT, fontWeight: '600' }}>Kapat</ThemedText>
								</TouchableOpacity>
							</View>
						</ScrollView>
					</View>
				</View>
			</Modal>
			</View>
			
			{/* AI Asistan Maskot */}
			<AIAssistant />
		</>
	);
}

const styles = StyleSheet.create({
	backdrop: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 5,
		backgroundColor: 'transparent',
	},
	catsContainer: {
		position: 'absolute',
		top: 52,
		left: 16,
		backgroundColor: '#ffffff',
		borderRadius: 14,
		flexDirection: 'row',
		paddingVertical: 12,
		paddingHorizontal: 16,
		gap: 16,
		borderWidth: 1,
		borderColor: BORDER,
		shadowColor: '#000',
		shadowOpacity: 0.08,
		shadowRadius: 12,
		shadowOffset: { width: 0, height: 6 },
		elevation: 6,
		zIndex: 100,
	},
	catsLeft: {
		width: 260,
		gap: 8,
	},
	catsItem: {
		paddingVertical: 10,
		paddingHorizontal: 12,
		borderRadius: 10,
		cursor: 'pointer',
	},
	catsItemActive: {
		backgroundColor: '#0053f5',
	},
	catsItemText: {
		color: '#0f172a',
		fontWeight: '600',
	},
	catsItemTextActive: {
		color: '#ffffff',
	},
	catsRight: {
		flex: 1,
		maxHeight: 400,
	},
	catsRightContent: {
		paddingVertical: 6,
		paddingHorizontal: 6,
	},
	// 3 sütunlu kategori düzeni
	catsThreeColumns: {
		flexDirection: 'row',
		gap: 16,
	},
	catsColumn: {
		flex: 1,
		minWidth: 0,
	},
	// Kategoriler modal filigran
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
	catsTitle: {
		marginBottom: 6,
	},
	catsLinkRow: {
		paddingVertical: 6,
		paddingHorizontal: 8,
		borderRadius: 6,
		cursor: 'pointer',
	},
	catsLinkRowHover: {
		backgroundColor: '#0053f5',
	},
	catsLink: {
		color: '#0f172a',
	},
	container: {
		flex: 1,
		backgroundColor: APP_BG,
	},
	headerGradient: {
		paddingTop: 40,
		paddingBottom: 24,
		paddingHorizontal: 20,
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		borderBottomWidth: 1,
		borderColor: BORDER,
	},
	headerContent: {
		alignItems: 'stretch',
		backgroundColor: '#ffffff',
	},
	headerTopRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	welcomeText: {
		fontSize: 16,
		textAlign: 'center',
		marginBottom: 12,
		fontWeight: '700',
		color: TEXT,
	},
	quickActionsContainer: {
		padding: 20,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 16,
		color: TEXT,
	},
	actionGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		gap: 12,
	},
	actionCard: {
		width: (width - 64) / 2,
		borderRadius: 12,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: BORDER,
		backgroundColor: PANEL_BG,
	},
	actionGradient: {
		padding: 16,
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: 96,
	},
	actionTitle: {
		fontSize: 14,
		fontWeight: '600',
		marginTop: 6,
		textAlign: 'center',
		color: TEXT,
	},
	actionSubtitle: {
		fontSize: 12,
		marginTop: 2,
		textAlign: 'center',
		color: TEXT,
	},
	statsContainer: {
		marginHorizontal: 20,
		marginTop: 6,
		marginBottom: 6,
		borderRadius: RADIUS.md, // Standart radius
		borderWidth: 1,
		borderColor: BORDER,
		backgroundColor: PANEL_BG,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 12,
		paddingHorizontal: 12,
		...NEOMORPHIC_SHADOW, // Neomorfik gölge
	},
	statCard: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	statDivider: {
		width: 1,
		height: 32,
		backgroundColor: BORDER,
	},
	statNumber: {
		fontSize: 22,
		fontWeight: '800',
		color: TEXT,
	},
	statLabel: {
		fontSize: 16,
		marginTop: 2,
		color: '#0053f5',
		fontWeight: '600',
	},
	imageGalleryContainer: {
		marginHorizontal: 20,
		marginVertical: 16,
		padding: 16,
		backgroundColor: 'transparent',
		borderRadius: 16,
	},
	imageRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 2, // 4'ten 2'ye düşürüldü (%50 daha dar)
	},
	galleryImageContainer: {
		width: '30%',
		overflow: 'visible', // Resim büyüdüğünde kenarlar kesilmesin
		borderRadius: 12,
		cursor: 'pointer',
	},
	galleryImage: {
		width: '100%',
		height: 400, // Daha kompakt görünüm için düşürüldü
		borderRadius: 12,
	},
	galleryImageHover: {
		transform: [{ scale: 1.1 }], // %10 büyütme efekti
	},
	kisiyeOzelContainer: {
		marginHorizontal: 20,
		marginVertical: 16,
		borderRadius: RADIUS.lg, // Standart radius
		overflow: 'hidden',
		backgroundColor: 'transparent',
		...NEOMORPHIC_SHADOW, // Neomorfik gölge
	},
	kisiyeOzelImage: {
		width: Platform.OS === 'web' ? Math.max(320, width - 40) : width - 40, // Banner ile aynı genişlik
		height: Math.round((Platform.OS === 'web' ? Math.max(320, width - 40) : width - 40) * 0.4), // 10:4 oranı
		alignSelf: 'center', // Ortala
		marginVertical: 16, // Üst ve alt boşluk
	},
	sectionHeaderRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	featuresContainer: {
		padding: 20,
		paddingTop: 0,
	},
	getStartedButton: {
		margin: 20,
		marginTop: 6,
		borderRadius: 999,
		overflow: 'hidden',
	},
	buttonGradient: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 16,
		paddingHorizontal: 24,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
		marginRight: 10,
	},
	footer: {
		padding: 20,
		alignItems: 'center',
		paddingBottom: 32,
	},
	footerText: {
		fontSize: 12,
		textAlign: 'center',
		fontStyle: 'italic',
		color: TEXT,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'transparent',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	modalBackdrop: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(255,255,255,0.6)'
	},
	modalCard: {
		width: Platform.OS === 'web' ? Math.max(320, Math.round(width * 0.7)) : '100%', // H1 ile aynı genişlik
		maxWidth: Platform.OS === 'web' ? Math.max(320, Math.round(width * 0.7)) : 420,
		borderRadius: RADIUS.lg, // Standart radius
		backgroundColor: '#ffffff',
		padding: 16,
		borderWidth: 1,
		borderColor: BORDER,
		...NEOMORPHIC_SHADOW, // Neomorfik gölge
	},
	modalHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 12,
	},
	modalHeaderTopRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 6,
	},
	modalBackRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	modalBackText: {
		color: TEXT,
		fontSize: 14,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: '700',
		color: TEXT,
		textAlign: 'center',
	},
	modalItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 10,
		paddingVertical: 10,
	},
	modalItemLabel: {
		fontSize: 14,
		color: TEXT,
	},
	modalRowBetween: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 8,
	},
	modalItemLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	langRow: {
		flexDirection: 'row',
		gap: 8,
	},
	teacherExploreBtn: {
		marginTop: 8,
		borderWidth: 1,
		borderColor: BORDER,
		backgroundColor: PANEL_BG,
		borderRadius: 999, // pill radius - tamamen yuvarlak
		paddingVertical: 10,
		paddingHorizontal: 12,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 8,
	},
	teacherExploreText: {
		color: TEXT,
		fontWeight: '700',
	},
	teacherExploreLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	chipsRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
		marginTop: 6,
	},
	chip: {
		borderWidth: 1,
		borderColor: BORDER,
		borderRadius: 16,
		paddingVertical: 6,
		paddingHorizontal: 10,
		backgroundColor: PANEL_BG,
	},
	chipActive: {
		backgroundColor: '#e0e7ff',
		borderColor: '#c7d2fe',
	},
	chipText: {
		color: TEXT,
	},
	chipTextActive: {
		color: TEXT,
		fontWeight: '700',
	},
	// 2 sütun grid için yeni stiller
	teachersGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		gap: 12,
	},
	modalTeacherCard: {
		width: '48%', // 2 sütun için yarı genişlik
		backgroundColor: PANEL_BG,
		borderRadius: RADIUS.md,
		padding: 12,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: BORDER,
		flexDirection: 'row', // Yatay düzen
		minHeight: 160, // Resimler büyüdüğü için minimum yükseklik
		...NEOMORPHIC_SHADOW,
	},
	modalTeacherLeft: {
		width: '40%', // Sol yarı - resim için
		alignItems: 'center',
		justifyContent: 'center',
	},
	modalTeacherRight: {
		width: '60%', // Sağ yarı - bilgiler için
		paddingLeft: 12,
		justifyContent: 'space-between',
	},
	modalTeacherImg: {
		width: 140, // %100 büyütüldü (70'den 140'a)
		height: 140, // %100 büyütüldü (70'den 140'a)
		borderRadius: RADIUS.sm,
		backgroundColor: PANEL_BG,
	},
	modalTeacherRatingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 4,
	},
	modalTeacherRating: {
		color: '#ffa500',
		fontSize: 16,
		marginRight: 6,
	},
	modalTeacherRatingText: {
		color: TEXT,
		fontSize: 12,
		fontWeight: '600',
	},
	modalTeacherCertificates: {
		color: TEXT,
		fontSize: 11,
		opacity: 0.7,
		fontStyle: 'italic',
		marginBottom: 8,
	},
	modalTeacherName: {
		color: TEXT,
		fontWeight: '700',
		fontSize: 14,
		marginBottom: 4,
	},
	modalTeacherMeta: {
		color: TEXT,
		opacity: 0.8,
		fontSize: 12,
		marginBottom: 2,
	},
	// Standart buton stilleri
	modalTeacherButtons: {
		flexDirection: 'row',
		gap: 8,
		marginTop: 8,
	},
	modalTeacherAppointmentBtn: {
		backgroundColor: '#0053f5', // Mavi arka plan
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: RADIUS.lg, // Daha belirgin radius
		flex: 1,
		alignItems: 'center',
		...NEOMORPHIC_SHADOW,
	},
	modalTeacherAppointmentText: {
		color: '#ffffff',
		fontWeight: '700',
		fontSize: 12,
	},
	modalTeacherAction: {
		backgroundColor: TEXT, // Koyu arka plan
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: RADIUS.lg, // Daha belirgin radius
		flex: 1,
		alignItems: 'center',
		...NEOMORPHIC_SHADOW,
	},
	modalTeacherActionText: {
		color: '#ffffff',
		fontWeight: '700',
		fontSize: 12,
	},
	searchContainer: {
		backgroundColor: '#e8eaf6',
		borderRadius: 24,
		padding: 20,
		marginHorizontal: 20,
		marginVertical: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
		zIndex: 1000,
		position: 'relative',
	},
	searchFilters: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'space-between',
		gap: 12,
		flexWrap: 'wrap',
	},
	filterItem: {
		flex: 1,
		minWidth: 120,
		position: 'relative',
	},
	filterLabel: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#0053f5',
		marginBottom: 8,
		marginLeft: 10,
	},
	filterDropdown: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#f8fafc',
		borderWidth: 1,
		borderColor: '#e2e8f0',
		borderRadius: 16,
		paddingHorizontal: 12,
		paddingVertical: 10,
		minHeight: 44,
	},
	filterValue: {
		fontSize: 16,
		color: '#334155',
		fontWeight: '500',
	},
	searchButton: {
		backgroundColor: '#0053f5', // Kayıt Ol ile aynı renk
		borderRadius: 999, // pill
		paddingHorizontal: 16, // Kayıt Ol ile aynı padding
		paddingVertical: 8, // Kayıt Ol ile aynı padding
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		minHeight: 44,
		minWidth: 140,
		...NEOMORPHIC_SHADOW, // Neomorfik gölge
	},
	searchButtonText: {
		color: '#ffffff',
		fontSize: 14, // Kayıt Ol ile aynı font boyutu
		fontWeight: '600', // Aynı font ağırlığı
	},
	dropdownMenu: {
		position: 'absolute',
		top: '100%',
		left: 0,
		right: 0,
		backgroundColor: '#ffffff',
		borderWidth: 1,
		borderColor: '#e2e8f0',
		borderRadius: 12,
		marginTop: 4,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 20,
		zIndex: 99999,
	},
	dropdownItem: {
		paddingHorizontal: 12,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#f1f5f9',
		cursor: 'pointer',
	},
	dropdownItemText: {
		fontSize: 16,
		color: '#334155',
		fontWeight: '500',
	},
	dropdownItemHovered: {
		backgroundColor: '#0053f5',
	},
	dropdownItemTextHovered: {
		color: '#ffffff',
	},
	bannerCarouselContainer: {
		width: '100%',
		marginVertical: 16,
		backgroundColor: 'transparent',
		paddingHorizontal: 20,
	},
	bannerWrapper: {
		width: '100%',
		height: Math.min(500, Math.max(200, width * 0.5)), // default, runtime'da override ediliyor
		borderRadius: 24,
		overflow: 'hidden',
		backgroundColor: '#f8f9fa',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
	bannerScrollView: {
		flex: 1,
	},
	bannerImage: {
		width: width,
		height: '100%',
		resizeMode: 'cover',
	},
	bannerControls: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 12,
		paddingHorizontal: 20,
	},
	bannerButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#0053f5',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 3,
	},
	bannerButtonText: {
		color: '#ffffff',
		fontSize: 20,
		fontWeight: 'bold',
	},
	bannerDots: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	bannerDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#d1d5db',
		marginHorizontal: 4,
	},
	bannerDotActive: {
		backgroundColor: '#0053f5',
		width: 24,
	},
	// Banner Overlay Controls
	bannerControlsOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		pointerEvents: 'box-none',
	},
	bannerButtonOverlay: {
		width: Math.min(50, Math.max(35, width * 0.07)), // Daha responsive buton boyutu
		height: Math.min(50, Math.max(35, width * 0.07)),
		borderRadius: Math.min(25, Math.max(17, width * 0.035)),
		backgroundColor: 'rgba(0, 0, 0, 0.34)', // %25 daha transparan (0.45 * 0.75 = 0.34)
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2, // Daha hafif gölge
		shadowRadius: 6,
		elevation: 3,
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.2)', // Hafif beyaz kenarlık
	},
	bannerButtonTextOverlay: {
		color: '#ffffff',
		fontSize: Math.min(20, Math.max(14, width * 0.035)), // Daha responsive yazı boyutu
		fontWeight: 'bold',
		textAlign: 'center',
		lineHeight: Math.min(20, Math.max(14, width * 0.035)),
	},
	bannerSpacer: {
		flex: 1,
	},
	langBtn: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 6,
		backgroundColor: 'transparent',
	},
	langBtnActive: {
		backgroundColor: '#0053f5',
	},
	langBtnText: {
		color: '#666',
		fontSize: 14,
		fontWeight: '500',
	},
	// Cart Modal Styles
	cartModalCard: {
		width: Platform.select({ 
			web: 800, 
			default: 350 
		}),
		maxWidth: '90%',
		height: Platform.select({ 
			web: 400, 
			default: 300 
		}),
		borderRadius: RADIUS.lg,
		borderWidth: 1,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 12,
		elevation: 8,
	},
	cartModalHeader: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingTop: 16,
		paddingBottom: 8,
	},
	cartModalContent: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingBottom: 20,
		gap: 20,
	},
	cartModalLogo: {
		width: 600, // %100 daha büyütüldü (300 * 2 = 600)
		height: 150, // %100 daha büyütüldü (75 * 2 = 150)
		marginBottom: 10,
	},
	cartModalText: {
		fontSize: 27, // %50 büyütüldü (18 * 1.5 = 27)
		fontWeight: '600',
		textAlign: 'center',
	},
	// Cart Modal Filigran Stilleri
	cartModalWatermark: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1, // En altta
	},
	cartModalWatermarkLogo: {
		width: '90%', // Responsive genişlik
		height: '70%', // Responsive yükseklik
		opacity: 0.08, // Transparanlık
	},
});