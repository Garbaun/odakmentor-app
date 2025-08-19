import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import { Animated, Dimensions, Easing, Image, Linking, Modal, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { setColorSchemeOverride, useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

const { width } = Dimensions.get('window');

const APP_BG = '#ffffff';
const PANEL_BG = '#f5f5f5';
const BORDER = '#e5e7eb';
const TEXT = '#1e3a8a';

const TEACHER_CARD_WIDTH = Math.round(width * 0.82);

const STRINGS = {
	tr: {
		subtitle: 'Yapay Zeka Destekli Online Eğitim Platformu',
		quickAccess: 'Hızlı Erişim',
		studentLogin: 'Öğrenci Girişi',
		teacherLogin: 'Öğretmen Girişi',
		tips: 'İpuçları',
		progress: 'İlerleme',
		start: 'Hemen Başlayın',
		statsStudent: 'kayıtlı öğrenci',
		statsTeacher: 'kayıtlı öğretmen',
		statsClass: 'sanal sınıf',
		teachers: 'Öğretmenlerimiz',
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
		teachers: 'Our Teachers',
		settings: 'Settings',
		notifications: 'Notifications',
		darkTheme: 'Dark Theme',
		profile: 'Profile / Student',
		applyTeacher: 'Apply as Teacher',
		language: 'Language',
		openSystemSettings: 'Open System Settings',
	},
} as const;

const TEACHERS = [
	{
		id: 't1',
		name: 'Ayşe Yılmaz',
		branch: 'Matematik',
		grades: '5-8. sınıflar',
		rating: 9.4,
		votes: 72,
		photo: 'https://images.unsplash.com/photo-1596495578065-8a5c4b34f3a5?q=80&w=1200&auto=format&fit=crop',
	},
	{
		id: 't2',
		name: 'Mehmet Demir',
		branch: 'Fizik',
		grades: '9-12. sınıflar',
		rating: 9.1,
		votes: 54,
		photo: 'https://images.unsplash.com/photo-1554755229-ca4470e07232?q=80&w=1200&auto=format&fit=crop',
	},
	{
		id: 't3',
		name: 'Elif Kara',
		branch: 'İngilizce',
		grades: '4-12. sınıflar',
		rating: 9.6,
		votes: 103,
		photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1200&auto=format&fit=crop',
	},
];

export default function HomeScreen() {
	const router = useRouter();
	const scheme = useColorScheme();
	const [themeIsDark, setThemeIsDark] = useState(scheme === 'dark');
	const [lang, setLang] = useState<'tr' | 'en'>('tr');
	const t = (k: keyof typeof STRINGS['tr']) => STRINGS[lang][k];

	// Settings modal state
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [notifEnabled, setNotifEnabled] = useState(true);

	useEffect(() => {
		setThemeIsDark(scheme === 'dark');
	}, [scheme]);

	const toggleTheme = () => {
		const next = themeIsDark ? 'light' : 'dark';
		setThemeIsDark(!themeIsDark);
		setColorSchemeOverride(next);
	};

	const ensureNotificationPermission = async () => {
		try {
			const settings = await Notifications.getPermissionsAsync();
			if (!settings.granted) {
				const req = await Notifications.requestPermissionsAsync();
				if (Platform.OS === 'android') {
					await Notifications.setNotificationChannelAsync('default', {
						name: 'default',
						importance: Notifications.AndroidImportance.DEFAULT,
					});
				}
				return req.granted;
			}
			return true;
		} catch {}
		return false;
	};

	const onToggleNotifications = async (value: boolean) => {
		setNotifEnabled(value);
		if (value) {
			const ok = await ensureNotificationPermission();
			if (!ok) {
				// Open system settings if permission denied
				Linking.openSettings?.();
			}
		}
	};

	// Animated counters
	const studentsVal = useRef(new Animated.Value(0)).current;
	const teachersVal = useRef(new Animated.Value(0)).current;
	const classesVal = useRef(new Animated.Value(0)).current;
	const [studentsCnt, setStudentsCnt] = useState(0);
	const [teachersCnt, setTeachersCnt] = useState(0);
	const [classesCnt, setClassesCnt] = useState(0);

	useEffect(() => {
		const ease = Easing.out(Easing.quad);
		Animated.timing(studentsVal, { toValue: 634, duration: 1200, easing: ease, useNativeDriver: false }).start();
		Animated.timing(teachersVal, { toValue: 144, duration: 1200, easing: ease, useNativeDriver: false }).start();
		Animated.timing(classesVal, { toValue: 20, duration: 1200, easing: ease, useNativeDriver: false }).start();

		const sSub = studentsVal.addListener(({ value }) => setStudentsCnt(Math.round(value)));
		const tSub = teachersVal.addListener(({ value }) => setTeachersCnt(Math.round(value)));
		const cSub = classesVal.addListener(({ value }) => setClassesCnt(Math.round(value)));
		return () => {
			studentsVal.removeListener(sSub);
			teachersVal.removeListener(tSub);
			classesVal.removeListener(cSub);
		};
	}, [studentsVal, teachersVal, classesVal]);

	return (
		<>
			<StatusBar barStyle="dark-content" backgroundColor={APP_BG} />
			<ScrollView style={[styles.container]} showsVerticalScrollIndicator={false}>
				{/* Header Section */}
				<LinearGradient
					colors={[APP_BG, APP_BG]}
					style={styles.headerGradient}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
				>
					<ThemedView style={styles.headerContent}>
						<View style={styles.headerTopRow}>
							<Image source={require('@/assets/images/logo.png')} style={styles.logoImage} resizeMode="contain" />
							<TouchableOpacity style={styles.settingsBtn} activeOpacity={0.7} onPress={() => setSettingsOpen(true)}>
								<MaterialIcons name="settings" size={24} color={TEXT} />
							</TouchableOpacity>
						</View>
						<ThemedText style={[styles.subtitle]}>
							{t('subtitle')}
						</ThemedText>
						{/* Removed HelloWave animation */}
					</ThemedView>
				</LinearGradient>

				{/* Quick Actions */}
				<ThemedView style={styles.quickActionsContainer}>
					<ThemedText type="subtitle" style={[styles.sectionTitle]}>
						{t('quickAccess')}
					</ThemedText>
					
					<ThemedView style={styles.actionGrid}>
						<TouchableOpacity style={styles.actionCard} activeOpacity={0.8} onPress={() => router.push('/student')}>
							<LinearGradient
								colors={[PANEL_BG, PANEL_BG]}
								style={styles.actionGradient}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
							>
								<ThemedText style={[styles.actionTitle]}>{t('studentLogin')}</ThemedText>
								<ThemedText style={[styles.actionSubtitle]}>Hemen başlayın</ThemedText>
							</LinearGradient>
						</TouchableOpacity>

						<TouchableOpacity style={styles.actionCard} activeOpacity={0.8} onPress={() => router.push('/teacher')}>
							<LinearGradient
								colors={[PANEL_BG, PANEL_BG]}
								style={styles.actionGradient}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
							>
								<ThemedText style={[styles.actionTitle]}>{t('teacherLogin')}</ThemedText>
								<ThemedText style={[styles.actionSubtitle]}>Başvuru yapın</ThemedText>
							</LinearGradient>
						</TouchableOpacity>

						<TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
							<LinearGradient
								colors={[PANEL_BG, PANEL_BG]}
								style={styles.actionGradient}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
							>
								<ThemedText style={[styles.actionTitle]}>{t('tips')}</ThemedText>
								<ThemedText style={[styles.actionSubtitle]}>Günlük öneriler</ThemedText>
							</LinearGradient>
						</TouchableOpacity>

						<TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
							<LinearGradient
								colors={[PANEL_BG, PANEL_BG]}
								style={styles.actionGradient}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
							>
								<ThemedText style={[styles.actionTitle]}>{t('progress')}</ThemedText>
								<ThemedText style={[styles.actionSubtitle]}>Takip sistemi</ThemedText>
							</LinearGradient>
						</TouchableOpacity>
					</ThemedView>
				</ThemedView>

				{/* Stats Section */}
				<ThemedView style={styles.statsContainer}>
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
				</ThemedView>

				{/* Teachers Carousel */}
				<ThemedView style={styles.teachersContainer}>
					<ThemedText type="subtitle" style={[styles.sectionTitle]}>
						{t('teachers')}
					</ThemedText>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.teachersRow}
					>
						{TEACHERS.map((tch) => (
							<View key={tch.id} style={[styles.teacherCardRow]}> 
								<Image source={{ uri: tch.photo }} style={styles.teacherImageThumb} />
								<View style={styles.teacherInfo}>
									<ThemedText style={styles.teacherName}>{tch.name}</ThemedText>
									<ThemedText style={styles.teacherMeta}>{tch.branch} • {tch.grades}</ThemedText>
									<ThemedText style={styles.teacherRating}>★ {tch.rating.toFixed(1)} ({tch.votes} oylama)</ThemedText>
								</View>
							</View>
						))}
					</ScrollView>
				</ThemedView>

				{/* Features Section */}
				<ThemedView style={styles.featuresContainer}>
					<ThemedText type="subtitle" style={[styles.sectionTitle]}>
						Özellikler
					</ThemedText>
					
					<ThemedView style={[styles.featureItem, { 
						backgroundColor: PANEL_BG,
						borderColor: BORDER
					}]}> 
						<ThemedView style={[styles.featureIcon]}> 
							<Image source={require('@/assets/images/logo.png')} style={{ width: 24, height: 24 }} resizeMode="contain" />
						</ThemedView>
						<ThemedView style={styles.featureText}>
							<ThemedText style={[styles.featureTitle]}>Yapay Zeka Destekli</ThemedText>
							<ThemedText style={[styles.featureDescription]}>
								Kişiselleştirilmiş öneriler ve analizler
							</ThemedText>
						</ThemedView>
					</ThemedView>

					<ThemedView style={[styles.featureItem, { 
						backgroundColor: PANEL_BG,
						borderColor: BORDER
					}]}> 
						<ThemedView style={[styles.featureIcon]}> 
							<Image source={require('@/assets/images/logo.png')} style={{ width: 24, height: 24 }} resizeMode="contain" />
						</ThemedView>
						<ThemedView style={styles.featureText}>
							<ThemedText style={[styles.featureTitle]}>Kişisel Koçluk</ThemedText>
							<ThemedText style={[styles.featureDescription]}>
								Hedeflerinize özel stratejiler
							</ThemedText>
						</ThemedView>
					</ThemedView>

					<ThemedView style={[styles.featureItem, { 
						backgroundColor: PANEL_BG,
						borderColor: BORDER
					}]}> 
						<ThemedView style={[styles.featureIcon]}> 
							<Image source={require('@/assets/images/logo.png')} style={{ width: 24, height: 24 }} resizeMode="contain" />
						</ThemedView>
						<ThemedView style={styles.featureText}>
							<ThemedText style={[styles.featureTitle]}>İlerleme Takibi</ThemedText>
							<ThemedText style={[styles.featureDescription]}>
								Gelişiminizi görsel olarak takip edin
							</ThemedText>
						</ThemedView>
					</ThemedView>

					<ThemedView style={[styles.featureItem, { 
						backgroundColor: PANEL_BG,
						borderColor: BORDER
					}]}> 
						<ThemedView style={[styles.featureIcon]}> 
							<Image source={require('@/assets/images/logo.png')} style={{ width: 24, height: 24 }} resizeMode="contain" />
						</ThemedView>
						<ThemedView style={styles.featureText}>
							<ThemedText style={[styles.featureTitle]}>Güvenli & Özel</ThemedText>
							<ThemedText style={[styles.featureDescription]}>
								Verileriniz güvende, gizliliğiniz korunur
							</ThemedText>
						</ThemedView>
					</ThemedView>
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
				<ThemedView style={styles.footer}>
					<ThemedText style={[styles.footerText]}>
						Odak Mentor ile öğrenme yolculuğunuza başlayın
					</ThemedText>
				</ThemedView>
			</ScrollView>

			{/* Settings Modal */}
			<Modal visible={settingsOpen} transparent animationType="fade" onRequestClose={() => setSettingsOpen(false)}>
				<Pressable style={styles.modalOverlay} onPress={() => setSettingsOpen(false)}>
					<View style={styles.modalCard}>
						<View style={styles.modalHeader}>
							<ThemedText style={styles.modalTitle}>{t('settings')}</ThemedText>
							<TouchableOpacity onPress={() => setSettingsOpen(false)}>
								<MaterialIcons name="close" size={22} color={TEXT} />
							</TouchableOpacity>
						</View>

						<View style={styles.modalRowBetween}>
							<View style={styles.modalItemLeft}>
								<MaterialIcons name="dark-mode" size={20} color={TEXT} />
								<ThemedText style={styles.modalItemLabel}>{t('darkTheme')}</ThemedText>
							</View>
							<Switch value={themeIsDark} onValueChange={toggleTheme} />
						</View>

						<View style={styles.modalRowBetween}>
							<View style={styles.modalItemLeft}>
								<MaterialIcons name="notifications" size={20} color={TEXT} />
								<ThemedText style={styles.modalItemLabel}>{t('notifications')}</ThemedText>
							</View>
							<Switch value={notifEnabled} onValueChange={onToggleNotifications} />
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
		</>
	);
}

const styles = StyleSheet.create({
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
	},
	headerTopRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	logoImage: {
		width: 160,
		height: 60,
		marginBottom: 8,
	},
	settingsBtn: {
		padding: 6,
		borderRadius: 8,
	},
	subtitle: {
		fontSize: 14,
		textAlign: 'center',
		marginBottom: 12,
		opacity: 0.9,
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
		borderRadius: 12,
		borderWidth: 1,
		borderColor: BORDER,
		backgroundColor: PANEL_BG,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 12,
		paddingHorizontal: 12,
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
		fontSize: 12,
		marginTop: 2,
		color: TEXT,
	},
	teachersContainer: {
		paddingHorizontal: 20,
		paddingTop: 6,
		paddingBottom: 10,
	},
	teachersRow: {
		gap: 14,
	},
	teacherCard: {
		width: TEACHER_CARD_WIDTH,
		borderRadius: 16,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: BORDER,
		backgroundColor: '#fff',
	},
	teacherImage: {
		width: '100%',
		height: 180,
	},
	teacherOverlay: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: '#ffffffee',
		paddingVertical: 10,
		paddingHorizontal: 12,
		borderTopWidth: 1,
		borderTopColor: BORDER,
	},
	teacherCardRow: {
		width: TEACHER_CARD_WIDTH,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: BORDER,
		backgroundColor: '#fff',
		padding: 12,
	},
	teacherImageThumb: {
		width: 84,
		height: 84,
		borderRadius: 12,
		backgroundColor: PANEL_BG,
	},
	teacherInfo: {
		flex: 1,
	},
	teacherName: {
		fontSize: 16,
		fontWeight: '700',
		color: TEXT,
	},
	teacherMeta: {
		fontSize: 12,
		marginTop: 2,
		color: TEXT,
	},
	teacherRating: {
		fontSize: 12,
		marginTop: 2,
		color: TEXT,
	},
	featuresContainer: {
		padding: 20,
		paddingTop: 0,
	},
	featureItem: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 14,
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: BORDER,
		backgroundColor: PANEL_BG,
	},
	featureIcon: {
		width: 42,
		height: 42,
		borderRadius: 21,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: PANEL_BG,
	},
	featureText: {
		flex: 1,
		marginLeft: 12,
	},
	featureTitle: {
		fontSize: 14,
		fontWeight: '600',
		marginBottom: 4,
		color: TEXT,
	},
	featureDescription: {
		fontSize: 12,
		lineHeight: 18,
		color: TEXT,
	},
	getStartedButton: {
		margin: 20,
		marginTop: 6,
		borderRadius: 12,
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
		backgroundColor: 'rgba(0,0,0,0.25)',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
	},
	modalCard: {
		width: '100%',
		maxWidth: 420,
		borderRadius: 16,
		backgroundColor: '#ffffff',
		padding: 16,
		borderWidth: 1,
		borderColor: BORDER,
	},
	modalHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 12,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: '700',
		color: TEXT,
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
	langBtn: {
		borderWidth: 1,
		borderColor: BORDER,
		borderRadius: 8,
		paddingVertical: 6,
		paddingHorizontal: 10,
		backgroundColor: PANEL_BG,
	},
	langBtnActive: {
		backgroundColor: '#e0e7ff',
		borderColor: '#c7d2fe',
	},
	langBtnText: {
		fontSize: 12,
		color: TEXT,
		fontWeight: '600',
	},
});
