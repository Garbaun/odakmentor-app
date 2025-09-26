import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { db } from '@/config/firebase';

export default function BlogNew() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    if (!title.trim()) return Alert.alert('Uyarı', 'Başlık gerekli');
    setSaving(true);
    try {
      await addDoc(collection(db, 'blog'), {
        title: title.trim(),
        content,
        createdAt: serverTimestamp(),
      });
      router.back();
    } catch (e) {
      Alert.alert('Hata', 'Kaydedilemedi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Yeni Yazı</ThemedText>
      <TextInput style={styles.input} placeholder="Başlık" value={title} onChangeText={setTitle} />
      <TextInput style={[styles.input, styles.textarea]} placeholder="İçerik" multiline value={content} onChangeText={setContent} />
      <TouchableOpacity style={styles.saveBtn} onPress={onSave} disabled={saving}>
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


