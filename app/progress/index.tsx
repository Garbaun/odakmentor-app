import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { db } from '@/config/firebase';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

type ProgressEntry = {
  id: string;
  subject: string;
  score: number; // 0-100
  createdAt?: Date;
};

const SUBJECTS = ['Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Türkçe', 'İngilizce', 'Tarih', 'Coğrafya'];

export default function ProgressScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('');
  const [score, setScore] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingScore, setEditingScore] = useState<string>('');

  if (!isAuthenticated) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: colors.surface }]}> 
        <StatusBar barStyle="dark-content" />
        <ThemedView style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          <ThemedText type="title" style={[styles.title, { color: colors.textPrimary }]}>İlerleme</ThemedText>
          <ThemedText style={{ color: colors.textSecondary, marginBottom: 12 }}>İlerlemeyi görmek için lütfen giriş yapın.</ThemedText>
          <TouchableOpacity style={[styles.loginBtn, { backgroundColor: colors.primary }]} onPress={() => router.replace('/student')}>
            <ThemedText style={styles.loginText}>Öğrenci Girişine Git</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    );
  }

  useEffect(() => {
    if (!user?.uid) return;
    setLoading(true);
    const q = query(
      collection(db, 'progress'),
      where('userUid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      const list: ProgressEntry[] = snap.docs.map((d) => {
        const data = d.data() as any;
        return {
          id: d.id,
          subject: data.subject || '',
          score: Number(data.score) || 0,
          createdAt: data.createdAt?.toDate?.() ?? undefined,
        };
      });
      setEntries(list);
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [user?.uid]);

  const summaryBySubject = useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {};
    for (const e of entries) {
      if (!e.subject) continue;
      if (!map[e.subject]) map[e.subject] = { total: 0, count: 0 };
      map[e.subject].total += e.score;
      map[e.subject].count += 1;
    }
    const items = Object.entries(map).map(([s, v]) => ({ subject: s, avg: v.total / v.count }));
    return items.sort((a, b) => a.subject.localeCompare(b.subject));
  }, [entries]);

  const onAddEntry = async () => {
    const s = subject.trim();
    const sc = Number(score);
    if (!s || isNaN(sc) || sc < 0 || sc > 100) {
      Alert.alert('Hata', 'Ders ve 0-100 arası bir puan girin.');
      return;
    }
    if (!user?.uid) return;
    try {
      setLoading(true);
      await addDoc(collection(db, 'progress'), {
        userUid: user.uid,
        subject: s,
        score: sc,
        createdAt: serverTimestamp(),
      });
      setSubject('');
      setScore('');
    } catch (e) {
      Alert.alert('Hata', 'Kayıt eklenemedi, tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const onStartEdit = (entry: ProgressEntry) => {
    setEditingId(entry.id);
    setEditingScore(String(entry.score));
  };

  const onCancelEdit = () => {
    setEditingId(null);
    setEditingScore('');
  };

  const onSaveEdit = async (entry: ProgressEntry) => {
    const sc = Number(editingScore);
    if (isNaN(sc) || sc < 0 || sc > 100) {
      Alert.alert('Hata', '0-100 arası bir puan girin.');
      return;
    }
    try {
      await updateDoc(doc(db, 'progress', entry.id), { score: sc });
      onCancelEdit();
    } catch (e) {
      Alert.alert('Hata', 'Kayıt güncellenemedi.');
    }
  };

  const onDeleteEntry = (entry: ProgressEntry) => {
    Alert.alert('Sil', 'Bu kaydı silmek istediğine emin misin?', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: async () => {
        try {
          await deleteDoc(doc(db, 'progress', entry.id));
        } catch (e) {
          Alert.alert('Hata', 'Kayıt silinemedi.');
        }
      }},
    ]);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.surface }} contentContainerStyle={{ padding: 20 }}>
      <StatusBar barStyle="dark-content" />

      <ThemedView style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <ThemedText type="title" style={[styles.title, { color: colors.textPrimary }]}>İlerleme</ThemedText>
        <ThemedText style={{ color: colors.textSecondary }}>
          Son sonuçlarını gir, ders bazlı ortalamalarını takip et.
        </ThemedText>
      </ThemedView>

      {/* Filtre */}
      <ThemedView style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <ThemedText style={{ color: colors.textPrimary, fontWeight: '700' }}>Filtre</ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingTop: 6 }}>
          <TouchableOpacity onPress={() => setFilterSubject('')} style={[styles.chip, !filterSubject && styles.chipActive, { borderColor: colors.border }]}>
            <ThemedText style={[styles.chipText, !filterSubject && styles.chipTextActive]}>Tümü</ThemedText>
          </TouchableOpacity>
          {SUBJECTS.map((s) => (
            <TouchableOpacity key={s} onPress={() => setFilterSubject(s)} style={[styles.chip, filterSubject === s && styles.chipActive, { borderColor: colors.border }]}>
              <ThemedText style={[styles.chipText, filterSubject === s && styles.chipTextActive]}>{s}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>

      {/* Özet */}
      <ThemedView style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <ThemedText style={{ color: colors.textPrimary, fontWeight: '700' }}>Ders Bazlı Ortalama</ThemedText>
        {summaryBySubject.length === 0 ? (
          <ThemedText style={{ color: colors.textSecondary }}>Henüz kayıt yok.</ThemedText>
        ) : (
          summaryBySubject.map((s) => (
            <View key={s.subject} style={{ marginTop: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <ThemedText style={{ color: colors.textPrimary, fontWeight: '700' }}>{s.subject}</ThemedText>
                <ThemedText style={{ color: colors.textSecondary }}>{Math.round(s.avg)}%</ThemedText>
              </View>
              <View style={{ height: 10, backgroundColor: colors.border, borderRadius: 6, overflow: 'hidden', marginTop: 6 }}>
                <View style={{ width: `${Math.max(0, Math.min(100, s.avg))}%`, backgroundColor: Colors.light.primary, height: 10 }} />
              </View>
            </View>
          ))
        )}
      </ThemedView>

      {/* Yeni Kayıt */}
      <ThemedView style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <ThemedText style={{ color: colors.textPrimary, fontWeight: '700' }}>Yeni Sonuç Ekle</ThemedText>
        <ThemedText style={{ color: colors.textSecondary }}>Ders ve puanını (0-100) gir.</ThemedText>
        <TextInput
          value={subject}
          onChangeText={setSubject}
          placeholder={`Ders (örn. ${SUBJECTS[0]})`}
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
        />
        <TextInput
          value={score}
          onChangeText={setScore}
          placeholder="Puan (0-100)"
          keyboardType="numeric"
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
        />
        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: Colors.light.primary, opacity: loading ? 0.7 : 1 }]} onPress={onAddEntry} disabled={loading}>
          <ThemedText style={styles.saveText}>{loading ? 'Kaydediliyor...' : 'Kaydet'}</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Son Kayıtlar */}
      <ThemedView style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <ThemedText style={{ color: colors.textPrimary, fontWeight: '700' }}>Son Kayıtlar</ThemedText>
        {entries.filter(e => !filterSubject || e.subject === filterSubject).length === 0 ? (
          <ThemedText style={{ color: colors.textSecondary }}>Henüz kayıt yok.</ThemedText>
        ) : (
          entries
            .filter(e => !filterSubject || e.subject === filterSubject)
            .slice(0, 20)
            .map((e) => (
            <View key={e.id} style={styles.rowBetween}>
              <ThemedText style={{ color: colors.textPrimary, fontWeight: '700' }}>{e.subject}</ThemedText>
              {editingId === e.id ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <TextInput
                    value={editingScore}
                    onChangeText={setEditingScore}
                    keyboardType="numeric"
                    style={[styles.inputInline, { borderColor: colors.border, color: colors.textPrimary }]}
                    placeholderTextColor={colors.textMuted}
                  />
                  <TouchableOpacity onPress={() => onSaveEdit(e)} style={[styles.smallBtn, { backgroundColor: Colors.light.primary }]}>
                    <ThemedText style={styles.smallBtnText}>Kaydet</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onCancelEdit} style={[styles.smallBtn, { backgroundColor: '#94a3b8' }]}>
                    <ThemedText style={styles.smallBtnText}>İptal</ThemedText>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <ThemedText style={{ color: colors.textSecondary }}>{e.score}%</ThemedText>
                  <TouchableOpacity onPress={() => onStartEdit(e)}>
                    <ThemedText style={{ color: Colors.light.primary, fontWeight: '700' }}>Düzenle</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onDeleteEntry(e)}>
                    <ThemedText style={{ color: '#ef4444', fontWeight: '700' }}>Sil</ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ThemedView>
    </ScrollView>
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
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    marginTop: 6,
  },
  inputInline: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#ffffff',
    minWidth: 70,
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
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
  saveBtn: {
    marginTop: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
  },
  chipActive: {
    backgroundColor: '#e0e7ff',
    borderColor: '#c7d2fe',
  },
  chipText: {
    color: Colors.light.textPrimary,
  },
  chipTextActive: {
    color: Colors.light.textPrimary,
    fontWeight: '700',
  },
  smallBtn: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  smallBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
});


