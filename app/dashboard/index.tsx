import { Colors } from '@/constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Image, Modal, Platform, Pressable, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AIAssistant } from '@/components/AIAssistant';
import CategoryModal from '@/components/CategoryModal';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TopBar } from '@/components/TopBar';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';

async function fetchWithAuth<T>(path: string): Promise<T> {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const res = await fetch(path, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if (!res.ok) throw new Error('İstek başarısız');
  return res.json() as Promise<T>;
}

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
		welcome: 'Hoş Geldin',
		dashboard: 'Kontrol Paneli',
		quickAccess: 'Hızlı Erişim',
		myProgress: 'İlerlemem',
		myTeachers: 'Öğretmenlerim',
		myClasses: 'Sınıflarım',
		myProfile: 'Profilim',
		settings: 'Ayarlar',
		notifications: 'Bildirimler',
		logout: 'Çıkış Yap',
		recentActivity: 'Son Aktiviteler',
		upcomingClasses: 'Yaklaşan Dersler',
		achievements: 'Başarılarım',
		studyTime: 'Çalışma Süresi',
		completedLessons: 'Tamamlanan Dersler',
		currentStreak: 'Günlük Seri',
	},
	en: {
		welcome: 'Welcome',
		dashboard: 'Dashboard',
		quickAccess: 'Quick Access',
		myProgress: 'My Progress',
		myTeachers: 'My Teachers',
		myClasses: 'My Classes',
		myProfile: 'My Profile',
		settings: 'Settings',
		notifications: 'Notifications',
		logout: 'Logout',
		recentActivity: 'Recent Activity',
		upcomingClasses: 'Upcoming Classes',
		achievements: 'My Achievements',
		studyTime: 'Study Time',
		completedLessons: 'Completed Lessons',
		currentStreak: 'Current Streak',
	},
} as const;

export default function DashboardScreen() {
	const router = useRouter();
	const scheme = useColorScheme();
	const colors = Colors[scheme ?? 'light'];
	const [lang, setLang] = useState<'tr' | 'en'>('tr');
	const t = (k: keyof typeof STRINGS['tr']) => STRINGS[lang][k];
    const user = useAuthStore((s) => s.user);
    const userProfile = useAuthStore((s) => s.userProfile);
    const firstName = (user?.displayName || userProfile?.displayName || '').split(' ')[0] || '';
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const insets = useSafeAreaInsets();
	const { width: windowWidth } = useWindowDimensions();
	const sideGutter = Platform.OS === 'web' ? Math.max(16, Math.round(windowWidth * 0.15)) : 16;
	const contentWidth = Platform.OS === 'web' ? Math.max(320, windowWidth - sideGutter * 2) : windowWidth;

	// Eğer kullanıcı giriş yapmamışsa ana sayfaya yönlendir
	useEffect(() => {
		if (!isAuthenticated) {
			router.replace('/');
		}
	}, [isAuthenticated, router]);

	const [catsOpen, setCatsOpen] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [cartOpen, setCartOpen] = useState(false);

	// İstatistik animasyonları
	const studyTimeVal = useRef(new Animated.Value(0)).current;
	const completedLessonsVal = useRef(new Animated.Value(0)).current;
	const streakVal = useRef(new Animated.Value(0)).current;
    const [studyTimeCnt, setStudyTimeCnt] = useState(0);
    const [completedLessonsCnt, setCompletedLessonsCnt] = useState(0);
    const [streakCnt, setStreakCnt] = useState(0);
    const [activity, setActivity] = useState<{ id: number; title: string; createdAt: string }[]>([]);

    useEffect(() => {
        const ease = Easing.out(Easing.quad);
        // İlk değerleri 0'dan animasyonlayacağız; gerçek değerler geldikçe hedefi güncelliyoruz
        Animated.timing(studyTimeVal, { toValue: 0, duration: 1, easing: ease, useNativeDriver: false }).start();
        Animated.timing(completedLessonsVal, { toValue: 0, duration: 1, easing: ease, useNativeDriver: false }).start();
        Animated.timing(streakVal, { toValue: 0, duration: 1, easing: ease, useNativeDriver: false }).start();

        const sSub = studyTimeVal.addListener(({ value }) => setStudyTimeCnt(Math.round(value)));
        const cSub = completedLessonsVal.addListener(({ value }) => setCompletedLessonsCnt(Math.round(value)));
        const stSub = streakVal.addListener(({ value }) => setStreakCnt(Math.round(value)));
        return () => {
            studyTimeVal.removeListener(sSub);
            completedLessonsVal.removeListener(cSub);
            streakVal.removeListener(stSub);
        };
    }, [studyTimeVal, completedLessonsVal, streakVal]);

    useEffect(() => {
        // Gerçek verileri çek
        const load = async () => {
            try {
                const stats = await fetchWithAuth<{ success: boolean; totalMinutes: number; completedLessons: number; currentStreak: number }>("/api/user/stats");
                if (stats && (stats as any).success !== false) {
                    const ease = Easing.out(Easing.quad);
                    Animated.timing(studyTimeVal, { toValue: Math.round((stats.totalMinutes || 0) / 60), duration: 1200, easing: ease, useNativeDriver: false }).start();
                    Animated.timing(completedLessonsVal, { toValue: stats.completedLessons || 0, duration: 1200, easing: ease, useNativeDriver: false }).start();
                    Animated.timing(streakVal, { toValue: stats.currentStreak || 0, duration: 1200, easing: ease, useNativeDriver: false }).start();
                }
            } catch {}
            try {
                const act = await fetchWithAuth<{ success: boolean; items: { id: number; title: string; createdAt: string }[] }>("/api/user/activity");
                setActivity(act.items || []);
            } catch {
                setActivity([]);
            }
        };
        if (isAuthenticated) load();
    }, [isAuthenticated, studyTimeVal, completedLessonsVal, streakVal]);

	const handleLogout = () => {
		useAuthStore.getState().logout();
		router.replace('/');
	};

	if (!isAuthenticated) {
		return null; // Loading state
	}

	return (
		<>
			<View style={{ flex: 1 }}>
				<TopBar 
					currentPage="dashboard"
					onCategoriesPress={() => {
						setCatsOpen(!catsOpen);
						if (!catsOpen) {
							setCatsOpen(true);
						}
					}}
					onCartPress={() => setCartOpen(true)}
				/>
				
				<StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
				
				{/* Scrollable Content */}
				<ScrollView 
					style={{ flex: 1, backgroundColor: colors.background }} 
					contentContainerStyle={{ paddingBottom: insets.bottom + 32, paddingHorizontal: sideGutter }} 
					showsVerticalScrollIndicator={true}
				>
					{/* Welcome Section */}
					<View style={styles.welcomeSection}>
						<ThemedText style={styles.welcomeTitle}>
							{t('welcome')}, {firstName}! 👋
						</ThemedText>
						<ThemedText style={styles.welcomeSubtitle}>
							{t('dashboard')}
						</ThemedText>
					</View>

					{/* Stats Section */}
					<ThemedView style={[styles.statsContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.statCard}>
                        <ThemedText style={styles.statNumber}>{studyTimeCnt}</ThemedText>
                        <ThemedText style={styles.statLabel}>{t('studyTime')}</ThemedText>
                    </View>
						<View style={styles.statDivider} />
						<View style={styles.statCard}>
							<ThemedText style={styles.statNumber}>{completedLessonsCnt}</ThemedText>
							<ThemedText style={styles.statLabel}>{t('completedLessons')}</ThemedText>
						</View>
						<View style={styles.statDivider} />
						<View style={styles.statCard}>
							<ThemedText style={styles.statNumber}>{streakCnt}</ThemedText>
							<ThemedText style={styles.statLabel}>{t('currentStreak')}</ThemedText>
						</View>
					</ThemedView>

					{/* Quick Access Section */}
					<ThemedView style={styles.quickAccessContainer}>
						<ThemedText type="subtitle" style={[styles.sectionTitle]}>
							{t('quickAccess')}
						</ThemedText>

						<TouchableOpacity style={[styles.quickAccessBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} activeOpacity={0.85} onPress={() => router.push('/progress')}>
							<View style={styles.quickAccessLeft}>
								<MaterialIcons name="insights" size={24} color={colors.textPrimary} />
								<ThemedText style={styles.quickAccessText}>{t('myProgress')}</ThemedText>
							</View>
							<MaterialIcons name="chevron-right" size={24} color={TEXT} />
						</TouchableOpacity>

						<TouchableOpacity style={[styles.quickAccessBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} activeOpacity={0.85} onPress={() => router.push('/teacher')}>
							<View style={styles.quickAccessLeft}>
								<MaterialIcons name="groups" size={24} color={colors.textPrimary} />
								<ThemedText style={styles.quickAccessText}>{t('myTeachers')}</ThemedText>
							</View>
							<MaterialIcons name="chevron-right" size={24} color={TEXT} />
						</TouchableOpacity>

						<TouchableOpacity style={[styles.quickAccessBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} activeOpacity={0.85} onPress={() => router.push('/video-conference')}>
							<View style={styles.quickAccessLeft}>
								<MaterialIcons name="videocam" size={24} color={colors.textPrimary} />
								<ThemedText style={styles.quickAccessText}>{t('myClasses')}</ThemedText>
							</View>
							<MaterialIcons name="chevron-right" size={24} color={TEXT} />
						</TouchableOpacity>

						<TouchableOpacity style={[styles.quickAccessBtn, { backgroundColor: colors.surface, borderColor: colors.border }]} activeOpacity={0.85} onPress={() => router.push('/student')}>
							<View style={styles.quickAccessLeft}>
								<MaterialIcons name="person" size={24} color={colors.textPrimary} />
								<ThemedText style={styles.quickAccessText}>{t('myProfile')}</ThemedText>
							</View>
							<MaterialIcons name="chevron-right" size={24} color={TEXT} />
						</TouchableOpacity>
					</ThemedView>

					{/* Recent Activity Section */}
                    <ThemedView style={styles.recentActivityContainer}>
						<ThemedText type="subtitle" style={[styles.sectionTitle]}>
							{t('recentActivity')}
						</ThemedText>
                        {activity.length > 0 ? activity.map(item => (
                            <View key={item.id} style={styles.activityItem}>
                                <View style={styles.activityIcon}>
                                    <MaterialIcons name="history" size={20} color="#6b7280" />
                                </View>
                                <View style={styles.activityContent}>
                                    <ThemedText style={styles.activityTitle}>{item.title}</ThemedText>
                                    <ThemedText style={styles.activityTime}>{new Date(item.createdAt).toLocaleString('tr-TR')}</ThemedText>
                                </View>
                            </View>
                        )) : (
                            <ThemedText style={{ color: '#6b7280' }}>Henüz aktivite yok</ThemedText>
                        )}
					</ThemedView>

					{/* Logout Button */}
					<TouchableOpacity style={[styles.logoutButton]} activeOpacity={0.8} onPress={handleLogout}>
						<LinearGradient
							colors={['#ff4444', '#cc0000']}
							style={styles.buttonGradient}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
						>
							<MaterialIcons name="logout" size={20} color="#fff" />
							<ThemedText style={styles.buttonText}>{t('logout')}</ThemedText>
						</LinearGradient>
					</TouchableOpacity>
				</ScrollView>

				{/* Categories Modal */}
				<CategoryModal visible={catsOpen} onClose={() => setCatsOpen(false)} />

				{/* Cart Modal */}
				<Modal visible={cartOpen} transparent animationType="fade" onRequestClose={() => setCartOpen(false)}>
					<View style={[styles.modalOverlay, { paddingTop: insets.top + 8, justifyContent: 'center', alignItems: 'center' }]} pointerEvents="box-none">
						<Pressable style={styles.modalBackdrop} onPress={() => setCartOpen(false)} />
						<View style={[styles.cartModalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
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
			</View>
			
			{/* AI Asistan Maskot */}
			<AIAssistant />
		</>
	);
}

const styles = StyleSheet.create({
	welcomeSection: {
		paddingVertical: 20,
		alignItems: 'center',
	},
	welcomeTitle: {
		fontSize: 28,
		fontWeight: '700',
		color: TEXT,
		marginBottom: 8,
	},
	welcomeSubtitle: {
		fontSize: 18,
		color: '#666',
		fontWeight: '500',
	},
	statsContainer: {
		marginHorizontal: 20,
		marginTop: 6,
		marginBottom: 6,
		borderRadius: RADIUS.md,
		borderWidth: 1,
		borderColor: BORDER,
		backgroundColor: PANEL_BG,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 12,
		paddingHorizontal: 12,
		...NEOMORPHIC_SHADOW,
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
	quickAccessContainer: {
		padding: 20,
		paddingTop: 0,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 16,
		color: TEXT,
	},
	quickAccessBtn: {
		marginTop: 8,
		borderWidth: 1,
		borderColor: BORDER,
		backgroundColor: PANEL_BG,
		borderRadius: 999,
		paddingVertical: 12,
		paddingHorizontal: 16,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 8,
	},
	quickAccessText: {
		color: TEXT,
		fontWeight: '700',
		fontSize: 16,
	},
	quickAccessLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	recentActivityContainer: {
		padding: 20,
		paddingTop: 0,
	},
	activityItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
		paddingHorizontal: 16,
		backgroundColor: PANEL_BG,
		borderRadius: RADIUS.md,
		marginBottom: 8,
		borderWidth: 1,
		borderColor: BORDER,
	},
	activityIcon: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#f0f0f0',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	activityContent: {
		flex: 1,
	},
	activityTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: TEXT,
		marginBottom: 4,
	},
	activityTime: {
		fontSize: 14,
		color: '#666',
	},
	logoutButton: {
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
		gap: 8,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
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
		width: 600,
		height: 150,
		marginBottom: 10,
	},
	cartModalText: {
		fontSize: 27,
		fontWeight: '600',
		textAlign: 'center',
	},
});
