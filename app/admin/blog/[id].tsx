import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { BlogService } from '@/services/databaseService';

export default function BlogEdit() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const blogPost = await BlogService.getBlogPost(parseInt(id));
        if (blogPost) {
          setTitle(blogPost.title || '');
          setContent(blogPost.content || '');
          setStatus((blogPost.status as any) || 'draft');
          setExcerpt((blogPost.excerpt as any) || '');
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
      await BlogService.updateBlogPost(parseInt(id), { 
        title: title.trim(), 
        content,
        status,
        // excerpt şema yoksa backend ignore eder
      } as any);
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
      <TextInput style={styles.input} placeholder="Özet (opsiyonel)" value={excerpt} onChangeText={setExcerpt} />
      <View style={styles.row}>
        <TouchableOpacity 
          style={[styles.statusBtn, status === 'draft' ? styles.statusActiveDraft : null]}
          onPress={() => setStatus('draft')}
        >
          <ThemedText style={styles.statusText}>Taslak</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.statusBtn, status === 'published' ? styles.statusActivePub : null]}
          onPress={() => setStatus('published')}
        >
          <ThemedText style={styles.statusText}>Yayınla</ThemedText>
        </TouchableOpacity>
      </View>
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
  row: { flexDirection: 'row', gap: 8 },
  statusBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#f3f4f6' },
  statusActiveDraft: { backgroundColor: '#f59e0b' },
  statusActivePub: { backgroundColor: '#10b981' },
  statusText: { color: '#111827', fontWeight: '600' },
  saveBtn: { backgroundColor: '#1e3a8a', paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
});


