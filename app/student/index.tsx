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
import { Alert, Dimensions, Image, Platform, Pressable, ScrollView, StyleSheet, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

WebBrowser.maybeCompleteAuthSession();

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

export default function StudentScreen() {
	const colors = Colors['light'];
	const router = useRouter();
	const insets = useSafeAreaInsets();
    const { width: w } = useWindowDimensions();
    const isSmall = w < 768;

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

	// Google Auth
	const [, response, promptAsync] = Google.useAuthRequest(GOOGLE_AUTH_CONFIG);

	const handleGoogleAuth = useCallback(async (authentication: any) => {
		setLoading(true);
		try {
			const result = await AuthService.signInWithGoogle(authentication);
			
			if (result.success) {
				if (result.isNewUser) {
					Alert.alert('Hoş Geldiniz!', 'Hesabınız başarıyla oluşturuldu.');
				} else {
					Alert.alert('Giriş Başarılı', 'Hesabınıza başarıyla giriş yaptınız.');
				}
				router.replace('/');
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

	const handleGoogle = async () => {
		try {
			await promptAsync();
		} catch (e) {
			Alert.alert('Google', 'Google ile giriş sırasında bir sorun oluştu.');
		}
	};

// Apple ile giriş fonksiyonu kaldırıldı

	const onLogin = async () => {
		if (!email || !password) {
			Alert.alert('Uyarı', 'E-posta ve şifre gereklidir.');
			return;
		}
		
		setLoading(true);
		try {
			const result = await AuthService.signInWithEmail(email.trim(), password);
			
			if (result.success) {
				Alert.alert('Giriş Başarılı', 'Hesabınıza başarıyla giriş yaptınız.');
				router.replace('/');
			} else {
				Alert.alert('Hata', result.error || 'Giriş işlemi sırasında bir hata oluştu');
			}
		} catch (error: any) {
			Alert.alert('Hata', error.message || 'Beklenmeyen bir hata oluştu');
		} finally {
			setLoading(false);
		}
	};

	const onForgot = async () => {
		if (!email) {
			Alert.alert('Uyarı', 'Şifre sıfırlamak için lütfen e-posta girin.');
			return;
		}
		
		try {
			const result = await AuthService.resetPassword(email.trim());
			
			if (result.success) {
				Alert.alert('E-posta Gönderildi', 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
			} else {
				Alert.alert('Hata', result.error || 'Şifre sıfırlama işlemi sırasında bir hata oluştu');
			}
		} catch (error: any) {
			Alert.alert('Hata', error.message || 'Beklenmeyen bir hata oluştu');
		}
	};

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
									<ThemedText style={[styles.title, { color: colors.textPrimary }]}>Hoşgeldiniz</ThemedText>
								</View>
								<TouchableOpacity onPress={() => router.back()}>
									<MaterialIcons name="close" size={22} color={TEXT} />
								</TouchableOpacity>
							</View>
							<ThemedText style={[styles.subtitle, { color: colors.textPrimary }]}>Lütfen hesabınıza giriş yapın</ThemedText>

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
									
									{/* Form Alanları */}
									<View style={styles.fieldGroup}>
										<ThemedText style={[styles.label, { color: colors.textPrimary }]}>E-posta Adresi</ThemedText>
										<TextInput
											value={email}
											onChangeText={setEmail}
											placeholder="ornek@eposta.com"
											placeholderTextColor={colors.textMuted}
											keyboardType="email-address"
											autoCapitalize="none"
											style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface }]}
										/>
									</View>

									<View style={styles.fieldGroup}>
										<ThemedText style={[styles.label, { color: colors.textPrimary }]}>Şifre</ThemedText>
										<View style={styles.passwordFieldWrap}>
											<TextInput
												value={password}
												onChangeText={setPassword}
												placeholder="••••••••"
												placeholderTextColor={colors.textMuted}
												secureTextEntry={!showPassword}
												style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface, paddingRight: 42 }]}
											/>
											<TouchableOpacity style={styles.passwordEye} onPress={() => setShowPassword(!showPassword)}>
												<MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={20} color={colors.textMuted} />
											</TouchableOpacity>
										</View>
									</View>

									{/* Beni hatırla / Şifremi unuttum */}
									<View style={styles.inlineRow}>
										<TouchableOpacity style={styles.inlineCheckbox} onPress={() => setRememberMe(!rememberMe)}>
											<View style={[styles.checkbox, { backgroundColor: rememberMe ? colors.primary : 'transparent', borderColor: colors.border }]}>{rememberMe && <MaterialIcons name="check" size={16} color="#fff" />}</View>
											<ThemedText style={{ color: colors.textPrimary }}>Beni Hatırla</ThemedText>
										</TouchableOpacity>
										<TouchableOpacity onPress={onForgot}>
											<ThemedText style={{ color: colors.textSecondary }}>Şifremi unuttum</ThemedText>
										</TouchableOpacity>
									</View>

									{/* Giriş Yap + Google ile Giriş */}
									<View style={styles.actionColumn}>
										<TouchableOpacity disabled={loading} onPress={onLogin} style={[globalStyles.primaryButton, { backgroundColor: loading ? '#2E2E2E' : '#0053f5' }]}>
											<ThemedText style={globalStyles.primaryButtonText}>{loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}</ThemedText>
										</TouchableOpacity>
									<TouchableOpacity onPress={handleGoogle} style={styles.googleButton}>
										<View style={styles.googleButtonContent}>
											<View style={styles.googleIconContainer}>
												<ThemedText style={styles.googleIcon}>G</ThemedText>
											</View>
											<ThemedText style={styles.googleButtonText}>Google ile Giriş Yap</ThemedText>
										</View>
									</TouchableOpacity>
									</View>

									{/* Alt - Kayıt Ol */}
									<View style={[styles.loginRow, { marginTop: 8 }]}>
										<ThemedText style={{ color: colors.textSecondary }}>Hesabın yok mu? </ThemedText>
										<TouchableOpacity onPress={() => router.push('/register')}>
											<ThemedText style={{ color: colors.primary, fontWeight: '600' }}>Kayıt Ol</ThemedText>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						</ThemedView>
					</ScrollView>
				</View>
			</View>
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
	passwordFieldWrap: {
		position: 'relative',
		justifyContent: 'center',
	},
	passwordEye: {
		position: 'absolute',
		right: 10,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
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
	checkbox: {
		width: 20,
		height: 20,
		borderRadius: 4,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 2,
	},
	actionRow: {
		flexDirection: 'row',
		gap: 8,
		marginVertical: 8,
	},
	actionColumn: {
		flexDirection: 'column',
		gap: 12,
		marginVertical: 8,
	},
	actionBtn: {
		width: '100%',
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
	loginRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	// Filigran stilleri - sayfanın yüksekliğine göre arkada
	watermark: {
		position: 'absolute',
		top: -50, // Yukarı kaydırıldı
		bottom: 50,
		left: 0,
		right: 0,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1, // Yazıların arkasında
	},
	watermarkLogo: {
		width: '104%', // %30 büyütülmüş (80% * 1.3 = 104%)
		height: '78%', // %30 büyütülmüş (60% * 1.3 = 78%)
		opacity: 0.08, // Çok silik arkada duracak
	},
	googleButton: {
		backgroundColor: '#ffffff',
		borderWidth: 1,
		borderColor: '#dadce0',
		borderRadius: 8,
		height: 42,
		justifyContent: 'center',
		alignItems: 'center',
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
