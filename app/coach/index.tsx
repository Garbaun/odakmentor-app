import { Collapsible } from '@/components/Collapsible';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { db } from '@/config/firebase';
import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/authStore';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TEXT = '#1e3a8a';

export default function CoachScreen() {
  const colors = Colors['light'];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!name.trim() || !goal.trim()) {
      Alert.alert('Eksik bilgi', 'Ad Soyad ve Hedef alanlarını doldurun.');
      return;
    }
    try {
      setSubmitting(true);
      await addDoc(collection(db, 'coachApplications'), {
        name: name.trim(),
        goal: goal.trim(),
        note: note.trim(),
        createdAt: serverTimestamp(),
        userUid: user?.uid ?? null,
        userEmail: user?.email ?? null,
        userDisplayName: user?.displayName ?? null,
        source: 'app',
      });
      Alert.alert('Başvuru alındı', 'Koçluk talebiniz kaydedildi.');
      setName('');
      setGoal('');
      setNote('');
    } catch (e) {
      Alert.alert('Hata', 'Başvurunuz kaydedilirken bir sorun oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

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

        <ThemedText type="subtitle" style={{ color: colors.textPrimary, marginBottom: 6 }}>Kişisel Koçluk</ThemedText>
        <ThemedText style={{ color: colors.textSecondary, marginBottom: 12 }}>Birebir koçluk ile hedeflerine daha hızlı ulaş.</ThemedText>

        <ThemedView style={[styles.card, { backgroundColor: '#ffffff', borderColor: colors.border }]}> 
          <ThemedText style={{ color: colors.textPrimary, fontWeight: '700' }}>Koçluk Başvurusu</ThemedText>
          <ThemedText style={styles.label}>Ad Soyad</ThemedText>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Örn. Ayşe Yılmaz"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
          />
          <ThemedText style={styles.label}>Hedef</ThemedText>
          <TextInput
            value={goal}
            onChangeText={setGoal}
            placeholder="Örn. LGS Matematik netlerini +15 artırmak"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
          />
          <ThemedText style={styles.label}>Not</ThemedText>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Kısa bir açıklama"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, styles.textarea, { borderColor: colors.border, color: colors.textPrimary }]}
            multiline
          />
          <TouchableOpacity onPress={onSubmit} activeOpacity={0.85} style={styles.primaryBtn} disabled={submitting}>
            <ThemedText style={styles.primaryBtnText}>{submitting ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={[styles.card, { backgroundColor: '#ffffff', borderColor: colors.border }]}> 
          <ThemedText style={{ color: colors.textPrimary, fontWeight: '700' }}>SSS</ThemedText>
          <Collapsible title="Koçluk süreci nasıl işler?" iconName="person.fill">
            <ThemedText style={{ color: colors.textSecondary }}>
              Hedef belirleme, planlama ve haftalık kontrol adımlarından oluşur.
            </ThemedText>
          </Collapsible>
          <View style={{ height: 8 }} />
          <Collapsible title="Ne kadar sürer?" iconName="clock.fill">
            <ThemedText style={{ color: colors.textSecondary }}>
              İhtiyacına göre 4-12 hafta arasında değişir.
            </ThemedText>
          </Collapsible>
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
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  label: {
    fontWeight: '700',
    color: '#2d3748',
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    marginTop: 6,
  },
  textarea: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  primaryBtn: {
    marginTop: 8,
    backgroundColor: TEXT,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  primaryBtnText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});


