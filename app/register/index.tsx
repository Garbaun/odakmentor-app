import { AIAssistant } from '@/components/AIAssistant';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GOOGLE_AUTH_CONFIG } from '@/config/authProviders';
import { Colors } from '@/constants/Colors';
import { AuthService } from '@/services/authService';
import { globalStyles } from '@/styles/globalStyles';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useState } from 'react';
import { Alert, Dimensions, Image, Modal, Platform, Pressable, ScrollView, StyleSheet, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

WebBrowser.maybeCompleteAuthSession();

// Ülke kodları listesi
const COUNTRIES = [
	{ code: 'TR', name: 'Türkiye', dialCode: '+90', flag: '🇹🇷' },
	{ code: 'US', name: 'Amerika', dialCode: '+1', flag: '🇺🇸' },
	{ code: 'DE', name: 'Almanya', dialCode: '+49', flag: '🇩🇪' },
	{ code: 'FR', name: 'Fransa', dialCode: '+33', flag: '🇫🇷' },
	{ code: 'GB', name: 'İngiltere', dialCode: '+44', flag: '🇬🇧' },
	{ code: 'IT', name: 'İtalya', dialCode: '+39', flag: '🇮🇹' },
	{ code: 'ES', name: 'İspanya', dialCode: '+34', flag: '🇪🇸' },
	{ code: 'NL', name: 'Hollanda', dialCode: '+31', flag: '🇳🇱' },
	{ code: 'BE', name: 'Belçika', dialCode: '+32', flag: '🇧🇪' },
	{ code: 'CH', name: 'İsviçre', dialCode: '+41', flag: '🇨🇭' },
];

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

export default function RegisterScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const colors = Colors.light;
	const { width: w } = useWindowDimensions();
	const isSmall = w < 768;

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
		phone: '',
		userType: 'student' as 'student'
	});
	const [loading, setLoading] = useState(false);
	const [kvkkAccepted, setKvkkAccepted] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]); // Türkiye varsayılan
	const [showCountryPicker, setShowCountryPicker] = useState(false);

	// Google Auth
	const [, response, promptAsync] = Google.useAuthRequest(GOOGLE_AUTH_CONFIG);

	const updateFormData = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	// Google ile giriş/kayıt işlemi
	const handleGoogleAuth = useCallback(async (authentication: any) => {
		setLoading(true);
		try {
			const result = await AuthService.signInWithGoogle(authentication);
			
			if (result.success) {
				if (result.isNewUser) {
					Alert.alert('Hoş Geldiniz!', 'Hesabınız başarıyla oluşturuldu. Eğitim yolculuğunuza başlayabilirsiniz.');
				} else {
					Alert.alert('Giriş Başarılı', 'Hesabınıza başarıyla giriş yaptınız.');
				}
				router.back();
			} else {
				Alert.alert('Hata', result.error || 'Google ile giriş yapılırken bir hata oluştu');
			}
		} catch (error: any) {
			Alert.alert('Hata', error.message || 'Beklenmeyen bir hata oluştu');
		} finally {
			setLoading(false);
		}
	}, [router]);

	React.useEffect(() => {
		if (response?.type === 'success') {
			const { authentication } = response;
			if (authentication?.idToken) {
				handleGoogleAuth(authentication);
			}
		}
	}, [response, handleGoogleAuth]);

	const onRegister = async () => {
		// Form validasyonu
		if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.password.trim() || !formData.phone.trim()) {
			Alert.alert('Bilgilerinizi Kontrol Edin', 'Lütfen tüm alanları doldurun ve tekrar deneyin.');
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			Alert.alert('Şifre Hatası', 'Şifreler eşleşmiyor. Lütfen kontrol edip tekrar deneyin.');
			return;
		}

		if (!kvkkAccepted) {
			Alert.alert('KVKK Onayı', 'Lütfen kişisel verilerinin işlenmesine yönelik onay kutusunu işaretleyin.');
			return;
		}

		// Şifre güvenlik kontrolü
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,32}$/;
		if (!passwordRegex.test(formData.password)) {
			Alert.alert('Uyarı', 'Şifre büyük harf, küçük harf ve rakam içermeli, 8-32 karakter arası olmalıdır.');
			return;
		}

		if (!kvkkAccepted) {
			Alert.alert('Uyarı', 'KVKK metnini kabul etmelisiniz.');
			return;
		}

		setLoading(true);
		try {
			const result = await AuthService.registerWithEmail(
				formData.email,
				formData.password,
				formData.firstName,
				formData.lastName,
				'student' // Varsayılan olarak öğrenci
			);
			
			if (result.success) {
				Alert.alert('Başarılı', 'Hesabınız oluşturuldu! E-posta adresinizi kontrol edin.');
				router.back();
			} else {
				Alert.alert('Hata', result.error || 'Kayıt işlemi sırasında bir hata oluştu');
			}
		} catch (error: any) {
			Alert.alert('Hata', error.message || 'Beklenmeyen bir hata oluştu');
		} finally {
			setLoading(false);
		}
	};

	// Buton aktivasyonu: tüm alanlar dolu, şifreler eşleşiyor ve KVKK onaylı olmalı
	const isFilled = (
		formData.firstName.trim().length > 0 &&
		formData.lastName.trim().length > 0 &&
		formData.email.trim().length > 0 &&
		formData.phone.trim().length > 0 &&
		formData.password.trim().length > 0 &&
		formData.confirmPassword.trim().length > 0
	);
	const passwordsMatch = formData.password === formData.confirmPassword;
	const canSubmit = kvkkAccepted && isFilled && passwordsMatch && !loading;

	return (
		<>
			<View style={[styles.modalOverlay, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 8 }]}>
				<Pressable style={styles.modalBackdrop} onPress={() => router.back()} />
				<View style={[
					styles.modalCard,
					{ maxHeight: '95%' },
					Platform.OS === 'web' ? { width: Math.max(320, Math.round(w * 0.7)), maxWidth: Math.max(320, Math.round(w * 0.7)) } : null
				]}>
					
					<ScrollView style={{ alignSelf: 'stretch' }} contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
						<ThemedView style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
							<View style={styles.cardHeaderRow}>
								<View style={{ position: 'absolute', left: 0, right: 0, alignItems: 'center' }} pointerEvents="none">
									<ThemedText style={[styles.title, { color: colors.textPrimary }]}>Ücretsiz Hesap Oluştur</ThemedText>
								</View>
								<TouchableOpacity onPress={() => router.back()}>
									<MaterialIcons name="close" size={22} color={TEXT} />
								</TouchableOpacity>
							</View>
							<ThemedText style={[styles.subtitle, { color: colors.textPrimary }]}>Eğitim yolculuğuna başlamak için hesabını oluştur.</ThemedText>

							{/* İki Sütun: Sol %60 görsel, Sağ %40 form */}
							<View style={[styles.splitRow, isSmall && { flexDirection: 'column' }]}>
								<View style={styles.leftPane}>
									<Image source={require('@/assets/images/sagmodal.png')} resizeMode="contain" style={[
										styles.rightImage,
										isSmall ? { height: Math.round(w * 0.35) } : { height: Math.min(760, Math.round(w * 0.45)) },
										{ marginTop: 5 }
									]} />
								</View>
								<View style={[styles.rightPane, { position: 'relative' }]}>
									{/* Filigran - logo1.png yazıların arkasında */}
									<View style={styles.watermark} pointerEvents="none">
										<Image 
											source={require('@/assets/images/logo1.png')} 
											style={styles.watermarkLogo} 
											resizeMode="contain" 
										/>
									</View>
							{/* Kullanıcı Tipi Seçimi kaldırıldı: varsayılan Öğrenci */}

									{/* Form Alanları */}
									<View style={styles.fieldGroup}>
										<ThemedText style={[styles.label, { color: colors.textPrimary }]}>Ad</ThemedText>
										<TextInput value={formData.firstName} onChangeText={(v) => updateFormData('firstName', v)} placeholder="Adınız" placeholderTextColor={colors.textMuted} style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface }]} />
									</View>
									<View style={styles.fieldGroup}>
										<ThemedText style={[styles.label, { color: colors.textPrimary }]}>Soyad</ThemedText>
										<TextInput value={formData.lastName} onChangeText={(v) => updateFormData('lastName', v)} placeholder="Soyadınız" placeholderTextColor={colors.textMuted} style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface }]} />
									</View>
									<View style={styles.fieldGroup}>
										<ThemedText style={[styles.label, { color: colors.textPrimary }]}>E-posta Adresi</ThemedText>
										<TextInput value={formData.email} onChangeText={(v) => updateFormData('email', v)} placeholder="ornek@email.com" placeholderTextColor={colors.textMuted} keyboardType="email-address" autoCapitalize="none" style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface }]} />
									</View>
									<View style={styles.fieldGroup}>
										<ThemedText style={[styles.label, { color: colors.textPrimary }]}>Şifre</ThemedText>
										<TextInput value={formData.password} onChangeText={(v) => updateFormData('password', v)} placeholder="••••••••" placeholderTextColor={colors.textMuted} secureTextEntry style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface }]} />
										<ThemedText style={[styles.passwordRules, { color: colors.textPrimary }]}>• Büyük harf, küçük harf ve rakam içermeli{'\n'}• En az 8, en fazla 32 karakter{'\n'}• Özel karakterler kullanabilirsiniz (@$!%*?&)</ThemedText>
									</View>
									<View style={styles.fieldGroup}>
										<ThemedText style={[styles.label, { color: colors.textPrimary }]}>Şifre Tekrar</ThemedText>
										<TextInput value={formData.confirmPassword} onChangeText={(v) => updateFormData('confirmPassword', v)} placeholder="••••••••" placeholderTextColor={colors.textMuted} secureTextEntry style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface }]} />
									</View>

									{/* Beni hatırla / Şifremi unuttum */}
									<View style={styles.inlineRow}>
										<TouchableOpacity style={styles.inlineCheckbox} onPress={() => setRememberMe(!rememberMe)}>
											<View style={[styles.checkbox, { backgroundColor: rememberMe ? colors.primary : 'transparent', borderColor: colors.border }]}>{rememberMe && <MaterialIcons name="check" size={16} color="#fff" />}</View>
											<ThemedText style={{ color: colors.textPrimary }}>Beni Hatırla</ThemedText>
										</TouchableOpacity>
										<TouchableOpacity onPress={() => Alert.alert('Şifre', 'Şifre sıfırlama akışı açılacak')}>
											<ThemedText style={{ color: colors.textSecondary }}>Şifreni mi unuttun?</ThemedText>
										</TouchableOpacity>
									</View>

									{/* KVKK Onayı */}
									<View style={styles.kvkkContainer}>
										<TouchableOpacity style={styles.kvkkCheckbox} onPress={() => setKvkkAccepted(!kvkkAccepted)} activeOpacity={0.7}>
											<View style={[styles.checkbox, { backgroundColor: kvkkAccepted ? colors.primary : 'transparent', borderColor: colors.border }]}>{kvkkAccepted && <MaterialIcons name="check" size={16} color="#fff" />}</View>
											<ThemedText style={[styles.kvkkText, { color: colors.textPrimary }]}>Kişisel verilerimin işlenmesine yönelik şunu{'\n'}okudum ve kabul ediyorum. <ThemedText style={[styles.kvkkLink, { color: colors.primary }]}>Açık Rıza Beyanı</ThemedText></ThemedText>
										</TouchableOpacity>
									</View>


									{/* Kayıt Ol + Google ile Giriş */}
									<View style={styles.actionRow}>
										<TouchableOpacity disabled={!canSubmit} onPress={onRegister} style={[globalStyles.primaryButton, { width: '100%', backgroundColor: canSubmit ? '#0053f5' : '#9ca3af' }]}>
											<ThemedText style={[globalStyles.primaryButtonText, { color: canSubmit ? '#ffffff' : '#ffffff' }]}>{loading ? 'Kayıt oluşturuluyor...' : 'Kayıt Ol'}</ThemedText>
										</TouchableOpacity>
										<TouchableOpacity onPress={() => promptAsync()} style={[globalStyles.secondaryButton, { width: '100%', borderColor: colors.border }]}>
											<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
												<MaterialCommunityIcons name="google" size={20} color="#4285F4" />
												<ThemedText style={[globalStyles.secondaryButtonText, { color: colors.textPrimary }]}>Google ile Giriş</ThemedText>
											</View>
										</TouchableOpacity>
									</View>

									{/* Alt - Giriş Yap */}
									<View style={[styles.loginRow, { marginTop: 8 }]}>
										<ThemedText style={{ color: colors.textSecondary }}>Zaten hesabın var mı? </ThemedText>
										<TouchableOpacity onPress={() => router.push('/student')}>
											<ThemedText style={{ color: colors.primary, fontWeight: '600' }}>Giriş Yap</ThemedText>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						</ThemedView>
					</ScrollView>
				</View>
			</View>

			<Modal visible={showCountryPicker} transparent animationType="slide" onRequestClose={() => setShowCountryPicker(false)}>
				<View style={styles.countryModalOverlay}>
					<Pressable style={styles.countryModalBackdrop} onPress={() => setShowCountryPicker(false)} />
					<View style={[styles.countryModalCard, { backgroundColor: colors.surface }]}>
						<View style={styles.countryModalHeader}>
							<ThemedText style={[styles.countryModalTitle, { color: colors.textPrimary }]}>Ülke Seçin</ThemedText>
							<TouchableOpacity onPress={() => setShowCountryPicker(false)}>
								<MaterialIcons name="close" size={24} color={colors.textMuted} />
							</TouchableOpacity>
						</View>
						<ScrollView style={styles.countryList}>
							{COUNTRIES.map((country) => (
								<TouchableOpacity
									key={country.code}
									style={[
										styles.countryItem,
										{
											backgroundColor: selectedCountry.code === country.code ? colors.primary + '20' : 'transparent',
											borderBottomColor: colors.border
										}
									]}
									onPress={() => {
										setSelectedCountry(country);
										setShowCountryPicker(false);
									}}
								>
									<ThemedText style={styles.countryItemFlag}>{country.flag}</ThemedText>
									<ThemedText style={[styles.countryItemName, { color: colors.textPrimary }]}>{country.name}</ThemedText>
									<ThemedText style={[styles.countryItemCode, { color: colors.textMuted }]}>{country.dialCode}</ThemedText>
								</TouchableOpacity>
							))}
						</ScrollView>
					</View>
				</View>
			</Modal>

			{/* AI Asistan Maskot */}
			<AIAssistant />
		</>
	);
}

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalBackdrop: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
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
	modalHeaderTopRow: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		marginBottom: 16,
		paddingBottom: 12,
		borderBottomWidth: 1,
		borderBottomColor: BORDER,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: '700',
		color: TEXT,
		textAlign: 'center',
	},
	card: {
		padding: 16,
		borderRadius: RADIUS.lg,
		borderWidth: 1,
		...NEOMORPHIC_SHADOW,
	},
	title: {
		fontSize: 24,
		fontWeight: '700',
		textAlign: 'center',
		marginBottom: 4,
	},
	subtitle: {
		fontSize: 15,
		textAlign: 'center',
		marginBottom: 16,
	},
	splitRow: {
		flexDirection: 'row-reverse',
		gap: 16,
	},
	leftPane: {
		flex: 3, // %60 (image container)
		alignItems: 'center',
		justifyContent: 'center',
	},
	rightPane: {
		flex: 2, // %40 (form container)
	},
	rightImage: {
		width: '100%',
		height: 760,
		marginTop: 5,
	},
	cardHeaderRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		marginBottom: 4,
	},
	userTypeContainer: {
		marginBottom: 20,
	},
	userTypeRow: {
		flexDirection: 'row',
		gap: 12,
		marginTop: 8,
	},
	userTypeBtn: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 999,
		borderWidth: 1,
		gap: 8,
		...NEOMORPHIC_SHADOW,
	},
	userTypeText: {
		fontSize: 15,
		fontWeight: '600',
	},
	nameRow: {
		flexDirection: 'row',
		marginBottom: 16,
	},
	fieldGroup: {
		marginBottom: 16,
	},
	label: {
		fontSize: 15,
		lineHeight: 20,
		fontWeight: '600',
		marginBottom: 6,
	},
	input: {
		height: 40,
		borderWidth: 1,
		borderRadius: RADIUS.sm,
		paddingHorizontal: 10,
		fontSize: 15,
	},
	passwordRules: {
		fontSize: 15,
		lineHeight: 20,
		marginTop: 6,
	},
	phoneContainer: {
		flexDirection: 'row',
		gap: 8,
	},
	countrySelector: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderWidth: 1,
		borderRadius: RADIUS.sm,
		minWidth: 100,
		gap: 6,
	},
	countryFlag: {
		fontSize: 16,
	},
	countryCode: {
		fontSize: 14,
		fontWeight: '600',
	},
	phoneInput: {
		flex: 1,
		height: 40,
		borderWidth: 1,
		borderRadius: RADIUS.sm,
		paddingHorizontal: 10,
		fontSize: 15,
	},
	countryModalOverlay: {
		flex: 1,
		justifyContent: 'flex-end',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	countryModalBackdrop: {
		flex: 1,
	},
	countryModalCard: {
		borderTopLeftRadius: RADIUS.lg,
		borderTopRightRadius: RADIUS.lg,
		maxHeight: '70%',
		paddingBottom: 20,
	},
	countryModalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5E5',
	},
	countryModalTitle: {
		fontSize: 18,
		fontWeight: '700',
	},
	countryList: {
		maxHeight: 400,
	},
	countryItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderBottomWidth: 1,
		gap: 12,
	},
	countryItemFlag: {
		fontSize: 20,
		width: 24,
		textAlign: 'center',
	},
	countryItemName: {
		flex: 1,
		fontSize: 16,
		fontWeight: '500',
	},
	countryItemCode: {
		fontSize: 14,
		fontWeight: '600',
	},
	registerBtn: {
		borderRadius: 999,
		alignItems: 'center',
		justifyContent: 'center',
		height: 42,
		marginBottom: 16,
		...NEOMORPHIC_SHADOW,
	},
	registerText: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '700',
	},
	socialBtn: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 999,
		borderWidth: 1,
		marginBottom: 16,
		gap: 8,
		...NEOMORPHIC_SHADOW,
	},
	socialText: {
		fontSize: 15,
		fontWeight: '600',
	},
	loginRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	kvkkContainer: {
		marginBottom: 20,
	},
	kvkkCheckbox: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: 8,
	},
	checkbox: {
		width: 20,
		height: 20,
		borderRadius: 4,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 2,
	},
	kvkkText: {
		fontSize: 15,
		lineHeight: 20,
		flex: 1,
	},
	kvkkLink: {
		fontSize: 15,
		textDecorationLine: 'underline',
	},
	inlineRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	inlineCheckbox: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	actionRow: {
		flexDirection: 'column',
		gap: 8,
		marginVertical: 8,
	},
	actionBtn: {
		flex: 1,
		height: 42,
		borderRadius: 999,
		alignItems: 'center',
		justifyContent: 'center',
		...NEOMORPHIC_SHADOW,
	},
	actionBtnText: {
		color: '#ffffff',
		fontSize: 14,
		fontWeight: '600',
	},
	googleBtn: {
		backgroundColor: '#ffffff',
		borderWidth: 1,
	},
	googleBtnText: {
		color: '#1a1a1a',
	},
	// Filigran stilleri - sayfanın yüksekliğine göre arkada
	watermark: {
		position: 'absolute',
		top: -50, // Yukarı kaydırdım
		bottom: 50,
		left: 0,
		right: 0,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1, // Yazıların arkasında
	},
	watermarkLogo: {
		width: '104%', // %30 büyüttüm (80% * 1.3 = 104%)
		height: '78%', // %30 büyüttüm (60% * 1.3 = 78%)
		opacity: 0.08, // Çok silik arkada duracak
	},
});