import { AIAssistant } from '@/components/AIAssistant';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GOOGLE_AUTH_CONFIG } from '@/config/authProviders';
import { Colors } from '@/constants/Colors';
import { AuthService } from '@/services/authService';
import { globalStyles } from '@/styles/globalStyles';
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
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);

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
		if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.password.trim()) {
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
		if (passwordStrength.score < 3) {
			Alert.alert('Şifre Güvenliği', 'Lütfen daha güçlü bir şifre seçin. Şifreniz büyük harf, küçük harf ve rakam içermelidir.');
			return;
		}

		setLoading(true);
		try {
			const result = await AuthService.register({
				email: formData.email,
				password: formData.password,
				firstName: formData.firstName,
				lastName: formData.lastName,
				role: formData.userType
			});
			
			if (result.success) {
				setShowSuccessModal(true);
			} else {
				Alert.alert('Hata', result.error || 'Kayıt işlemi başarısız oldu.');
			}
		} catch (error: any) {
			console.error('Kayıt hatası:', error);
			Alert.alert('Hata', error.message || 'Kayıt işlemi sırasında bir hata oluştu');
		} finally {
			setLoading(false);
		}
	};

	// Buton aktivasyonu: tüm alanlar dolu, şifreler eşleşiyor ve KVKK onaylı olmalı
	const isFilled = (
		formData.firstName.trim().length > 0 &&
		formData.lastName.trim().length > 0 &&
		formData.email.trim().length > 0 &&
		// formData.phone.trim().length > 0 && // Geçici olarak telefon zorunlu değil
		formData.password.trim().length > 0 &&
		formData.confirmPassword.trim().length > 0
	);
	// Şifre güvenlik kontrolü
	const getPasswordStrength = (password: string) => {
		let score = 0;
		let feedback = [];

		if (password.length >= 8) score += 1;
		else feedback.push('En az 8 karakter');

		if (/[a-z]/.test(password)) score += 1;
		else feedback.push('Küçük harf');

		if (/[A-Z]/.test(password)) score += 1;
		else feedback.push('Büyük harf');

		if (/[0-9]/.test(password)) score += 1;
		else feedback.push('Rakam');

		if (/[^A-Za-z0-9]/.test(password)) score += 1;
		else feedback.push('Özel karakter');

		if (score <= 2) return { strength: 'Zayıf', color: '#ef4444', score };
		if (score <= 3) return { strength: 'Orta', color: '#f59e0b', score };
		return { strength: 'Güçlü', color: '#10b981', score };
	};

	const passwordStrength = getPasswordStrength(formData.password);
	const passwordsMatch = formData.password === formData.confirmPassword;
	const canSubmit = kvkkAccepted && isFilled && passwordsMatch && !loading;
	
	const handleClose = () => {
		setShowSuccessModal(false);
		router.push('/student');
	};

	return (
		<>
			<View style={[styles.modalOverlay, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 8 }]}>
				<Pressable style={styles.modalBackdrop} onPress={handleClose} />
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
								<TouchableOpacity onPress={handleClose}>
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
										<View style={styles.passwordContainer}>
											<TextInput 
												value={formData.password} 
												onChangeText={(v) => updateFormData('password', v)} 
												placeholder="••••••••" 
												placeholderTextColor={colors.textMuted} 
												secureTextEntry={!showPassword}
												style={[styles.passwordInput, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface }]} 
											/>
											<TouchableOpacity 
												style={styles.passwordToggle}
												onPress={() => setShowPassword(!showPassword)}
											>
												<MaterialIcons 
													name={showPassword ? "visibility-off" : "visibility"} 
													size={20} 
													color={colors.textMuted} 
												/>
											</TouchableOpacity>
										</View>
										
										{/* Şifre Güvenlik Göstergesi */}
										{formData.password.length > 0 && (
											<View style={styles.passwordStrengthContainer}>
												<View style={styles.passwordStrengthBar}>
													<View 
														style={[
															styles.passwordStrengthFill, 
															{ 
																width: `${(passwordStrength.score / 5) * 100}%`,
																backgroundColor: passwordStrength.color 
															}
														]} 
													/>
												</View>
												<ThemedText style={[styles.passwordStrengthText, { color: passwordStrength.color }]}>
													Şifre Güvenliği: {passwordStrength.strength}
												</ThemedText>
											</View>
										)}
										
										<ThemedText style={[styles.passwordRules, { color: colors.textPrimary }]}>• Büyük harf, küçük harf ve rakam içermeli{'\n'}• En az 8, en fazla 32 karakter{'\n'}• Özel karakterler kullanabilirsiniz (@$!%*?&)</ThemedText>
									</View>
									<View style={styles.fieldGroup}>
										<ThemedText style={[styles.label, { color: colors.textPrimary }]}>Şifre Tekrar</ThemedText>
										<View style={styles.passwordContainer}>
											<TextInput 
												value={formData.confirmPassword} 
												onChangeText={(v) => updateFormData('confirmPassword', v)} 
												placeholder="••••••••" 
												placeholderTextColor={colors.textMuted} 
												secureTextEntry={!showConfirmPassword}
												style={[styles.passwordInput, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface }]} 
											/>
											<TouchableOpacity 
												style={styles.passwordToggle}
												onPress={() => setShowConfirmPassword(!showConfirmPassword)}
											>
												<MaterialIcons 
													name={showConfirmPassword ? "visibility-off" : "visibility"} 
													size={20} 
													color={colors.textMuted} 
												/>
											</TouchableOpacity>
										</View>
										
										{/* Şifre Eşleşme Kontrolü */}
										{formData.confirmPassword.length > 0 && (
											<ThemedText style={[
												styles.passwordMatchText, 
												{ color: passwordsMatch ? '#10b981' : '#ef4444' }
											]}>
												{passwordsMatch ? '✓ Şifreler eşleşiyor' : '✗ Şifreler eşleşmiyor'}
											</ThemedText>
										)}
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
										<TouchableOpacity onPress={() => promptAsync()} style={styles.googleButton}>
											<View style={styles.googleButtonContent}>
												<View style={styles.googleIconContainer}>
													<ThemedText style={styles.googleIcon}>G</ThemedText>
												</View>
												<ThemedText style={styles.googleButtonText}>Google ile Kayıt Ol</ThemedText>
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

			{/* Başarı Modal'ı */}
			{showSuccessModal && (
				<Modal
					visible={showSuccessModal}
					transparent={true}
					animationType="fade"
					onRequestClose={handleClose}
				>
					<View style={styles.successModalOverlay}>
						<View style={styles.successModalCard}>
							<View style={styles.successModalHeader}>
								<MaterialIcons name="check-circle" size={48} color="#10b981" />
								<ThemedText style={styles.successModalTitle}>
									Kayıt olduğunuz için teşekkür ederiz!
								</ThemedText>
							</View>
							
							<ThemedText style={styles.successModalMessage}>
								Kaydınız tamamlandı. Mailinizi kontrol edip size gönderilen linki lütfen onaylayın.
							</ThemedText>
							
							<TouchableOpacity style={styles.successModalButton} onPress={handleClose}>
								<ThemedText style={styles.successModalButtonText}>Onay</ThemedText>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			)}
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
	passwordContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		position: 'relative',
	},
	passwordInput: {
		flex: 1,
		height: 40,
		borderWidth: 1,
		borderRadius: RADIUS.sm,
		paddingHorizontal: 10,
		paddingRight: 45,
		fontSize: 15,
	},
	passwordToggle: {
		position: 'absolute',
		right: 12,
		padding: 4,
	},
	passwordStrengthContainer: {
		marginTop: 8,
	},
	passwordStrengthBar: {
		height: 4,
		backgroundColor: '#e5e7eb',
		borderRadius: 2,
		overflow: 'hidden',
		marginBottom: 4,
	},
	passwordStrengthFill: {
		height: '100%',
		borderRadius: 2,
	},
	passwordStrengthText: {
		fontSize: 12,
		fontWeight: '600',
	},
	passwordMatchText: {
		fontSize: 12,
		fontWeight: '600',
		marginTop: 4,
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
	// Başarı Modal'ı stilleri
	successModalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
	},
	successModalCard: {
		backgroundColor: '#ffffff',
		borderRadius: 16,
		padding: 24,
		width: '100%',
		maxWidth: 400,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 8,
	},
	successModalHeader: {
		alignItems: 'center',
		marginBottom: 16,
	},
	successModalTitle: {
		fontSize: 20,
		fontWeight: '700',
		color: '#1a1a1a',
		textAlign: 'center',
		marginTop: 12,
	},
	successModalMessage: {
		fontSize: 16,
		color: '#666666',
		textAlign: 'center',
		lineHeight: 24,
		marginBottom: 24,
	},
	successModalButton: {
		backgroundColor: '#0053f5',
		paddingHorizontal: 32,
		paddingVertical: 12,
		borderRadius: 8,
		width: '100%',
		alignItems: 'center',
	},
	successModalButtonText: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '600',
	},
	googleButton: {
		backgroundColor: '#ffffff',
		borderWidth: 1,
		borderColor: '#dadce0',
		borderRadius: 8,
		height: 42,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	googleButtonContent: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	googleIconContainer: {
		width: 20,
		height: 20,
		borderRadius: 2,
		backgroundColor: '#4285f4',
		justifyContent: 'center',
		alignItems: 'center',
	},
	googleIcon: {
		color: '#ffffff',
		fontSize: 14,
		fontWeight: '600',
		fontFamily: 'Arial, sans-serif',
	},
	googleButtonText: {
		color: '#3c4043',
		fontSize: 14,
		fontWeight: '500',
		fontFamily: 'Nunito, sans-serif',
	},
});