import { ExternalLink } from '@/components/ExternalLink';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TEXT = '#1e3a8a';

export default function PrivacyScreen() {
  const colors = Colors['light'];
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: '#ffffff' }]}> 
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 32 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.headerTopRow, { paddingTop: insets.top + 8, backgroundColor: '#ffffff' }]}>
          <TouchableOpacity style={styles.backRowAbsolute} activeOpacity={0.7} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={22} color={TEXT} />
            <ThemedText style={{ color: TEXT }}>Geri</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Image source={require('@/assets/images/logo.png')} style={{ width: 160, height: 34 }} resizeMode="contain" />
          </TouchableOpacity>
        </View>
        <View style={{ height: 1, backgroundColor: '#e5e7eb', marginTop: 8, marginBottom: 8 }} />

        <ThemedText type="subtitle" style={{ color: colors.textPrimary, marginBottom: 6 }}>Güvenli & Özel</ThemedText>
        <ThemedText style={{ color: colors.textSecondary, marginBottom: 12 }}>Veri güvenliği ve gizlilik politikamızın özeti.</ThemedText>

        <ThemedView style={[styles.card, { backgroundColor: '#ffffff', borderColor: colors.border }]}> 
          <ThemedText style={{ color: colors.textPrimary, fontWeight: '700' }}>Veri Kullanımı</ThemedText>
          <ThemedText style={{ color: colors.textSecondary }}>
            Hizmet sunumu için gerekli asgari veriler toplanır. Kişisel veriler üçüncü taraflarla paylaşılmaz.
          </ThemedText>
        </ThemedView>

        <ThemedView style={[styles.card, { backgroundColor: '#ffffff', borderColor: colors.border }]}> 
          <ThemedText style={{ color: colors.textPrimary, fontWeight: '700' }}>Güvenlik</ThemedText>
          <ThemedText style={{ color: colors.textSecondary }}>
            Uygulama, güvenli iletişim ve erişim politikaları ile korunur. Şifreler saklanırken hashlenir.
          </ThemedText>
        </ThemedView>

        <ThemedView style={[styles.card, { backgroundColor: '#ffffff', borderColor: colors.border }]}> 
          <ThemedText style={{ color: colors.textPrimary, fontWeight: '700' }}>Haklarınız</ThemedText>
          <ThemedText style={{ color: colors.textSecondary }}>
            Verilerinize erişim, düzeltme ve silme talebinde bulunabilirsiniz.
          </ThemedText>
        </ThemedView>

        <ThemedView style={[styles.card, { backgroundColor: '#ffffff', borderColor: colors.border }]}> 
          <ThemedText style={{ color: colors.textPrimary, fontWeight: '700' }}>KVKK ve GDPR</ThemedText>
          <ThemedText style={{ color: colors.textSecondary }}>
            Kişisel verilerin korunması ve işlenmesi, ilgili mevzuata (KVKK/GDPR) uygun şekilde yürütülür.
          </ThemedText>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <ExternalLink href="https://www.kvkk.gov.tr/">
              <ThemedText type="link">KVKK Resmi Sitesi</ThemedText>
            </ExternalLink>
            <ExternalLink href="https://gdpr.eu/">
              <ThemedText type="link">GDPR Bilgi</ThemedText>
            </ExternalLink>
          </View>
        </ThemedView>

        <ThemedView style={[styles.card, { backgroundColor: '#ffffff', borderColor: colors.border }]}> 
          <ThemedText style={{ color: colors.textPrimary, fontWeight: '700' }}>Gizlilik Politikası</ThemedText>
          <ThemedText style={{ color: colors.textSecondary }}>
            Detaylı politikamıza aşağıdaki bağlantılardan ulaşabilirsiniz.
          </ThemedText>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <ExternalLink href="https://example.com/gizlilik-politikasi.pdf">
              <ThemedText type="link">PDF</ThemedText>
            </ExternalLink>
            <ExternalLink href="https://example.com/gizlilik-politikasi">
              <ThemedText type="link">Web Sayfası</ThemedText>
            </ExternalLink>
          </View>
        </ThemedView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTopRow: {
    position: 'relative',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backRowAbsolute: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 8,
    marginTop: 12,
  },
});


