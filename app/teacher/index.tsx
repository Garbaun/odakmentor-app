import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { GOOGLE_ANDROID_CLIENT_ID, GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from '@/config/authProviders';
import { auth } from '@/config/firebase';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function TeacherScreen() {
	const colorScheme = useColorScheme();
	const colors = Colors[colorScheme ?? 'light'];
	const router = useRouter();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const [request, response, promptAsync] = Google.useAuthRequest({
		webClientId: GOOGLE_WEB_CLIENT_ID,
		iosClientId: GOOGLE_IOS_CLIENT_ID,
		androidClientId: GOOGLE_ANDROID_CLIENT_ID,
		expoClientId: GOOGLE_WEB_CLIENT_ID,
	});

	const handleGoogle = async () => {
		try {
			const res = await promptAsync();
			if (res?.type === 'success' && res.authentication?.accessToken) {
				Alert.alert('Google', 'Google ile giriş başarılı (örnek).');
				router.replace('/');
			}
		} catch (e) {
			Alert.alert('Google', 'Google ile giriş sırasında bir sorun oluştu.');
		}
	};

	const handleApple = async () => {
		try {
			const available = await AppleAuthentication.isAvailableAsync();
			if (!available) {
				Alert.alert('Apple', 'Apple ile giriş bu cihazda desteklenmiyor.');
				return;
			}
			const credential = await AppleAuthentication.signInAsync({
				requestedScopes: [
					AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
					AppleAuthentication.AppleAuthenticationScope.EMAIL,
				],
			});
			if (credential?.user) {
				Alert.alert('Apple', 'Apple ile giriş başarılı (örnek).');
				router.replace('/');
			}
		} catch (e: any) {
			if (e?.code === 'ERR_REQUEST_CANCELED') return;
			Alert.alert('Apple', 'Apple ile giriş sırasında bir sorun oluştu.');
		}
	};

	const onLogin = async () => {
		if (!email || !password) {
			Alert.alert('Uyarı', 'E-posta ve şifre gereklidir.');
			return;
		}
		try {
			setLoading(true);
			await signInWithEmailAndPassword(auth, email.trim(), password);
			router.replace('/');
		} catch (e: any) {
			const code: string = e?.code ?? '';
			let message = 'Giriş sırasında bir sorun oluştu.';
			if (code === 'auth/invalid-email') message = 'Geçersiz e-posta adresi.';
			else if (code === 'auth/user-not-found' || code === 'auth/wrong-password') message = 'E-posta veya şifre hatalı.';
			else if (code === 'auth/too-many-requests') message = 'Çok fazla deneme! Lütfen daha sonra tekrar deneyin.';
			Alert.alert('Hata', message);
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
			await sendPasswordResetEmail(auth, email.trim());
			Alert.alert('E-posta Gönderildi', 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
		} catch (e: any) {
			const code: string = e?.code ?? '';
			let message = 'Şifre sıfırlama sırasında bir sorun oluştu.';
			if (code === 'auth/invalid-email') message = 'Geçersiz e-posta adresi.';
			else if (code === 'auth/user-not-found') message = 'Bu e-posta ile kayıtlı kullanıcı bulunamadı.';
			Alert.alert('Hata', message);
		}
	};

	return (
		<KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.surface }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
			<ThemedView style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
				<ThemedText type="title" style={[styles.title, { color: colors.textPrimary }]}>Öğretmen Girişi</ThemedText>
				<ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>Öğretmen hesabınla giriş yap.</ThemedText>

				<View style={styles.fieldGroup}>
					<ThemedText style={[styles.label, { color: colors.textPrimary }]}>E-posta</ThemedText>
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
					<TextInput
						value={password}
						onChangeText={setPassword}
						placeholder="••••••••"
						placeholderTextColor={colors.textMuted}
						secureTextEntry
						style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface }]}
					/>
				</View>

				<TouchableOpacity style={styles.forgotBtn} onPress={onForgot}>
					<ThemedText style={[styles.forgotText, { color: colors.primary }]}>Şifremi unuttum</ThemedText>
				</TouchableOpacity>

				<TouchableOpacity disabled={loading} onPress={onLogin} style={[styles.loginBtn, { backgroundColor: colors.primary }]}>
					<ThemedText style={styles.loginText}>{loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}</ThemedText>
				</TouchableOpacity>

				<View style={styles.dividerRow}>
					<View style={[styles.divider, { backgroundColor: colors.border }]} />
					<ThemedText style={[styles.dividerText, { color: colors.textMuted }]}>veya</ThemedText>
					<View style={[styles.divider, { backgroundColor: colors.border }]} />
				</View>

				<View style={styles.socialRow}>
					<TouchableOpacity style={[styles.socialBtn, { borderColor: colors.border, backgroundColor: colors.surface }]} onPress={handleGoogle}>
						<ThemedText style={[styles.socialText, { color: colors.textPrimary }]}>Google ile giriş</ThemedText>
					</TouchableOpacity>
					{Platform.OS === 'ios' && (
						<TouchableOpacity style={[styles.socialBtn, { borderColor: colors.border, backgroundColor: colors.surface }]} onPress={handleApple}>
							<ThemedText style={[styles.socialText, { color: colors.textPrimary }]}>Apple ile giriş</ThemedText>
						</TouchableOpacity>
					)}
				</View>

				<View style={styles.registerRow}>
					<ThemedText style={{ color: colors.textSecondary }}>Hesabın yok mu? </ThemedText>
					<TouchableOpacity onPress={() => Alert.alert('Öğretmen Kaydı', 'Öğretmen kayıt ekranı eklenecek.') }>
						<ThemedText style={{ color: colors.primary, fontWeight: '600' }}>Öğretmen olarak kayıt ol</ThemedText>
					</TouchableOpacity>
				</View>
			</ThemedView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: 'center',
	},
	card: {
		borderRadius: 16,
		borderWidth: 1,
		padding: 20,
		gap: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.06,
		shadowRadius: 8,
		elevation: 2,
	},
	title: {
		textAlign: 'center',
	},
	subtitle: {
		textAlign: 'center',
		fontSize: 14,
		marginBottom: 4,
	},
	fieldGroup: {
		marginTop: 8,
		gap: 6,
	},
	label: {
		fontSize: 14,
		fontWeight: '600',
	},
	input: {
		height: 48,
		borderWidth: 1,
		borderRadius: 10,
		paddingHorizontal: 12,
		fontSize: 16,
	},
	forgotBtn: {
		alignSelf: 'flex-end',
		marginTop: 6,
	},
	forgotText: {
		fontSize: 13,
		fontWeight: '600',
	},
	loginBtn: {
		marginTop: 8,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
		height: 50,
	},
	loginText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '700',
	},
	dividerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		marginVertical: 10,
	},
	divider: {
		flex: 1,
		height: 1,
	},
	dividerText: {
		fontSize: 12,
	},
	socialRow: {
		flexDirection: 'row',
		gap: 10,
	},
	socialBtn: {
		flex: 1,
		borderWidth: 1,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
		height: 44,
	},
	socialText: {
		fontSize: 14,
		fontWeight: '600',
	},
	registerRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 8,
		gap: 6,
	},
});
