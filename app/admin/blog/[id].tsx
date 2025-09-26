import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { db } from '@/config/firebase';

export default function BlogEdit() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const ref = doc(db, 'blog', String(id));
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const d = snap.data() as any;
          setTitle(d.title || '');
          setContent(d.content || '');
        }
      } catch (e) {
        Alert.alert('Hata', 'Yazı yüklenemedi');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onSave = async () => {
    if (!title.trim()) return Alert.alert('Uyarı', 'Başlık gerekli');
    setSaving(true);
    try {
      const ref = doc(db, 'blog', String(id));
      await updateDoc(ref, { title: title.trim(), content, updatedAt: serverTimestamp() });
      router.back();
    } catch (e) {
      Alert.alert('Hata', 'Kaydedilemedi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Yazıyı Düzenle</ThemedText>
      <TextInput style={styles.input} placeholder="Başlık" value={title} onChangeText={setTitle} />
      <TextInput style={[styles.input, styles.textarea]} placeholder="İçerik" multiline value={content} onChangeText={setContent} />
      <TouchableOpacity style={styles.saveBtn} onPress={onSave} disabled={saving || loading}>
        <ThemedText style={{ color: '#fff', fontWeight: '700' }}>{saving ? 'Kaydediliyor…' : 'Kaydet'}</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10, backgroundColor: '#fff' },
  textarea: { minHeight: 160, textAlignVertical: 'top' },
  saveBtn: { backgroundColor: '#1e3a8a', paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
});


