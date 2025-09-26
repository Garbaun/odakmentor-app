// import { Text } from '@/components/Text';
// import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TeacherScreen() {
	const colors = Colors['light'];
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

	return (
		<View style={[styles.container, { backgroundColor: colors.background }]}>
			<StatusBar barStyle="dark-content" backgroundColor={colors.background} />
			<ScrollView 
				contentContainerStyle={styles.scrollContent} 
				showsVerticalScrollIndicator={false}
			>
				{/* Ana Sayfadaki Üst Bar Yapısı */}
				<View style={styles.topRegion}>
					{/* Kategori Barı */}
					<View style={[styles.topStrip, { paddingHorizontal: Platform.OS === 'web' ? Math.max(16, Math.round(windowWidth * 0.15)) : 16 }]}>
						<TouchableOpacity style={styles.kategorilerContainer} onPress={() => setCatsOpen(true)}>
							<Image source={require('@/assets/images/kategoriler.png')} style={styles.topStripImg} resizeMode="contain" />
						</TouchableOpacity>
						
						{/* Sağa yaslanmış butonlar */}
						<View style={styles.topStripRightButtons}>
							<TouchableOpacity style={styles.topStripButton} onPress={() => router.push('/blog')}>
								<Text style={styles.topStripButtonText}>Blog</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.topStripButton}>
								<Text style={styles.topStripButtonText}>Kurumsal</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.topStripButton} onPress={() => router.push('/teacher')}>
								<Text style={styles.topStripButtonText}>Eğitmenler</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.topStripButton}>
								<Text style={styles.topStripButtonText}>Hakkımızda</Text>
							</TouchableOpacity>
						</View>
					</View>

					{/* Logo Barı (H1) */}
					<View style={[styles.topBar, { paddingTop: insets.top + 3, height: insets.top + 119, paddingHorizontal: Platform.OS === 'web' ? Math.max(16, Math.round(windowWidth * 0.15)) : 16 }]}>
						<View style={styles.topBarRow}>
							<TouchableOpacity onPress={() => router.push('/')}>
								<Image source={require('@/assets/images/logo.png')} style={styles.topBarLogo} resizeMode="contain" />
							</TouchableOpacity>
							<View style={styles.topBarActions}>
								{/* Dil Seçici */}
								<View style={styles.languageSelector}>
									<View style={styles.languageIcon}>
										<View style={styles.languageIconLeft}>
											<Text style={styles.languageIconText}>TR</Text>
										</View>
										<View style={styles.languageIconRight}>
											<Text style={styles.languageIconText}>EN</Text>
										</View>
									</View>
									<Text style={styles.languageText}>TR</Text>
								</View>

								{/* Özel Ders Al */}
								<TouchableOpacity style={styles.actionLink}>
									<Text style={styles.actionLinkText}>Özel Ders Al</Text>
								</TouchableOpacity>
								
								{/* Separator */}
								<View style={styles.separator} />
								
								{/* Sepet */}
								<TouchableOpacity style={styles.actionLink} onPress={() => setCartOpen(true)}>
									<MaterialIcons name="shopping-cart" size={20} color="#0053f5" />
								</TouchableOpacity>
								
								{/* Oturum Aç */}
								<TouchableOpacity style={styles.actionLink} onPress={() => router.push('/student')}>
									<Text style={styles.actionLinkText}>Oturum Aç</Text>
								</TouchableOpacity>
								
								{/* Kayıt Ol */}
								<TouchableOpacity style={styles.registerButton} onPress={() => router.push('/register')}>
									<Text style={styles.registerButtonText}>Kayıt Ol</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>

				{/* Ana İçerik */}
				<View style={[styles.mainContent, { width: mainContentWidth, alignSelf: 'center' }]}>
					{/* Başlık */}
					<View style={styles.headerSection}>
						<Text style={[styles.mainTitle, { color: colors.textPrimary }]}>
							Eğitmenlerimizi Nasıl Seçiyoruz?
						</Text>
						<Text style={[styles.mainSubtitle, { color: '#555555' }]}>
							Çocuğunuzun eğitimi için en doğru eğitmeni bulma sürecimizi keşfedin
						</Text>
					</View>

					{/* Asimetrik Eğitmen Bölümleri */}
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
							Odak Mentor ailesi olarak, eğitimde mükemmelliği hedefliyor ve her öğrencimizin potansiyelini en üst seviyeye çıkarmak için çalışıyoruz.
						</Text>
					</View>
				</View>
			</ScrollView>

			{/* Categories Modal */}
			<Modal visible={catsOpen} transparent animationType="fade" onRequestClose={() => setCatsOpen(false)}>
				<View style={[styles.modalOverlay, { paddingTop: insets.top + 8, justifyContent: 'flex-start', alignItems: 'center' }]} pointerEvents="box-none">
					<Pressable style={styles.modalBackdrop} onPress={() => setCatsOpen(false)} />
					<View style={[styles.modalCard, { maxHeight: '100%', backgroundColor: colors.card, borderColor: colors.border }]}> 
						<View style={styles.modalHeaderTopRow}>
							<TouchableOpacity style={styles.modalBackRow} activeOpacity={0.7} onPress={() => setCatsOpen(false)}>
								<MaterialIcons name="arrow-back" size={22} color={colors.textPrimary} />
								<Text style={[styles.modalBackText, { color: colors.textPrimary }]}>Geri</Text>
							</TouchableOpacity>
							<View style={{ position: 'absolute', left: 0, right: 0, alignItems: 'center' }} pointerEvents="none">
								<Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Kategoriler</Text>
							</View>
							<TouchableOpacity onPress={() => setCatsOpen(false)}>
								<MaterialIcons name="close" size={22} color={colors.textPrimary} />
							</TouchableOpacity>
						</View>

						<View style={{ flexDirection: 'row', gap: 16 }}>
							<View style={styles.catsLeft}>
								{CATS.map((c) => {
									const active = catActive === c;
									return (
										<TouchableOpacity 
											key={c} 
											style={[styles.catsItem, active && styles.catsItemActive]}
											onPress={() => setCatActive(c)}
										>
											<Text style={[styles.catsItemText, active && styles.catsItemTextActive, { color: active ? '#fff' : colors.textPrimary }]}>{c}</Text>
										</TouchableOpacity>
									);
								})}
							</View>
							<View style={styles.catsRight}>
								<Text style={[styles.catsRightTitle, { color: colors.textPrimary }]}>
									{catActive ? `${catActive} Kategorisi` : 'Bir kategori seçin'}
								</Text>
								{catActive && (
									<Text style={[styles.catsRightDesc, { color: colors.textSecondary }]}>
										{catActive} kategorisindeki eğitmenler ve dersler burada listelenecek.
									</Text>
								)}
							</View>
						</View>
					</View>
				</View>
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
								<MaterialIcons name="close" size={24} color={colors.textPrimary} />
							</TouchableOpacity>
						</View>
						<View style={styles.cartModalContent}>
							<Image 
								source={require('@/assets/images/logo2.png')} 
								style={styles.cartModalLogo}
								resizeMode="contain"
							/>
							<Text style={styles.cartModalText}>
								Çok yakında sizlerle.
							</Text>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: 40,
	},
	testText: {
		fontSize: 24,
		fontWeight: 'bold',
		marginTop: 50,
		textAlign: 'center',
		color: '#333333',
		padding: 20,
	},
	// Ana Sayfa Üst Bar Stilleri
	topRegion: {
		position: 'relative',
		zIndex: 999,
		backgroundColor: '#ffffff',
	},
	topStrip: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 8,
		backgroundColor: '#0f104f',
		borderBottomWidth: 1,
		borderBottomColor: '#e5e7eb',
	},
	topStripImg: {
		width: 260,
		height: 36,
	},
	kategorilerContainer: {
		cursor: 'pointer',
	},
	topStripRightButtons: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 24,
	},
	topStripButton: {
		paddingVertical: 8,
		paddingHorizontal: 12,
		cursor: 'pointer',
	},
	topStripButtonText: {
		fontSize: 14,
		fontWeight: '500',
		color: '#ffffff',
	},
	topBar: {
		paddingVertical: 8,
		backgroundColor: '#ffffff',
		borderBottomWidth: 1,
		borderBottomColor: '#e5e7eb',
	},
	topBarRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		flex: 1,
	},
	topBarLogo: {
		width: 160,
		height: 40,
	},
	topBarActions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 16,
	},
	languageSelector: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	languageIcon: {
		flexDirection: 'row',
		borderRadius: 12,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: '#d1d5db',
	},
	languageIconLeft: {
		backgroundColor: '#0053f5',
		paddingHorizontal: 6,
		paddingVertical: 2,
	},
	languageIconRight: {
		backgroundColor: '#f3f4f6',
		paddingHorizontal: 6,
		paddingVertical: 2,
	},
	languageIconText: {
		fontSize: 10,
		fontWeight: '600',
		color: '#ffffff',
	},
	languageText: {
		fontSize: 14,
		fontWeight: '500',
		color: '#374151',
	},
	actionLink: {
		paddingVertical: 8,
		paddingHorizontal: 12,
		cursor: 'pointer',
	},
	actionLinkText: {
		fontSize: 14,
		fontWeight: '500',
		color: '#374151',
	},
	separator: {
		width: 1,
		height: 20,
		backgroundColor: '#d1d5db',
	},
	registerButton: {
		backgroundColor: '#0053f5',
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 6,
		cursor: 'pointer',
	},
	registerButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#ffffff',
	},
	// Ana İçerik Stilleri
	mainContent: {
		paddingHorizontal: 16,
		paddingVertical: 32,
	},
	headerSection: {
		alignItems: 'center',
		marginBottom: 40,
		paddingHorizontal: 20,
	},
	mainTitle: {
		fontSize: Platform.select({ web: 36, default: 28 }),
		fontWeight: '800',
		textAlign: 'center',
		marginBottom: 16,
	},
	mainSubtitle: {
		fontSize: Platform.select({ web: 18, default: 16 }),
		textAlign: 'center',
		lineHeight: Platform.select({ web: 28, default: 24 }),
		maxWidth: 700,
	},
	// Eğitmen Bölümleri Stilleri
	section: {
		flexDirection: Platform.select({ web: 'row', default: 'column' }) as any,
		alignItems: 'center',
		marginBottom: 60,
		gap: 20,
	},
	sectionRight: {
		// Web'de resim sağda, mobilde üstte
	},
	sectionLeft: {
		flexDirection: Platform.select({ web: 'row-reverse', default: 'column' }) as any,
	},
	sectionMobile: {
		flexDirection: 'column',
	},
	imageContainer: {
		flex: Platform.select({ web: 1, default: 0 }),
		width: Platform.select({ web: 'auto', default: '100%' }),
		maxWidth: Platform.select({ web: 400, default: '100%' }),
		aspectRatio: Platform.select({ web: 1.2, default: 16/9 }),
		borderRadius: 12,
		overflow: 'hidden',
		backgroundColor: '#f3f4f6',
	},
	teacherImage: {
		width: '100%',
		height: '100%',
	},
	contentContainer: {
		flex: Platform.select({ web: 1.2, default: 0 }),
		paddingHorizontal: Platform.select({ web: 20, default: 0 }),
		paddingVertical: Platform.select({ web: 0, default: 20 }),
	},
	sectionTitle: {
		fontSize: Platform.select({ web: 28, default: 24 }),
		fontWeight: '700',
		marginBottom: 16,
		lineHeight: Platform.select({ web: 36, default: 30 }),
	},
	sectionText: {
		fontSize: Platform.select({ web: 18, default: 16 }),
		lineHeight: Platform.select({ web: 28, default: 24 }),
	},
	finalSection: {
		alignItems: 'center',
		marginTop: 40,
		paddingHorizontal: 20,
	},
	finalText: {
		fontSize: Platform.select({ web: 18, default: 16 }),
		textAlign: 'center',
		lineHeight: Platform.select({ web: 28, default: 24 }),
		maxWidth: 700,
	},
	// Modal Stilleri
	modalOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 5,
		backgroundColor: 'transparent',
	},
	modalBackdrop: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalCard: {
		width: Platform.OS === 'web' ? '70%' : '100%',
		maxWidth: Platform.OS === 'web' ? 800 : 420,
		borderRadius: 12,
		backgroundColor: '#ffffff',
		padding: 16,
		borderWidth: 1,
		borderColor: '#e5e7eb',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 8,
	},
	modalHeaderTopRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 16,
	},
	modalBackRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	modalBackText: {
		fontSize: 14,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: '700',
		textAlign: 'center',
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
		fontWeight: '600',
	},
	catsItemTextActive: {
		color: '#ffffff',
	},
	catsRight: {
		flex: 1,
		maxHeight: 400,
	},
	catsRightTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 8,
	},
	catsRightDesc: {
		fontSize: 14,
		lineHeight: 20,
	},
	// Cart Modal Stilleri
	cartModalCard: {
		width: 800,
		height: 400,
		maxWidth: '90%',
		maxHeight: '80%',
		borderRadius: 12,
		backgroundColor: '#ffffff',
		padding: 20,
		borderWidth: 1,
		borderColor: '#e5e7eb',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.15,
		shadowRadius: 20,
		elevation: 12,
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
		width: '90%',
		height: '70%',
		opacity: 0.08,
	},
	cartModalHeader: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginBottom: 20,
		zIndex: 2,
	},
	cartModalContent: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 2,
	},
	cartModalLogo: {
		width: 240,
		height: 60,
		marginBottom: 20,
	},
	cartModalText: {
		fontSize: 24,
		fontWeight: '600',
		color: '#333333',
		textAlign: 'center',
	},
});