import { useEffect, useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SettingsService } from '@/services/databaseService';

type FooterSettings = {
  copyright?: string;
  links?: { label: string; url: string }[];
};

export default function FooterSettingsPage() {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const setting = await SettingsService.getSetting('footer');
        if (setting) {
          const data = JSON.parse(setting.value);
          setText(data.copyright || '© Odak Mentor');
        } else {
          setText('© Odak Mentor');
        }
      } catch (e) {
        setText('© Odak Mentor');
      }
    })();
  }, []);

  const onSave = async () => {
    setSaving(true);
    try {
      await SettingsService.setSetting('footer', { copyright: text });
      Alert.alert('Başarılı', 'Kayıt edildi');
    } catch (e) {
      Alert.alert('Hata', 'Kaydedilemedi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Footer Ayarları</ThemedText>
      <TextInput style={styles.input} value={text} onChangeText={setText} placeholder="© metni" />
      <TouchableOpacity style={styles.saveBtn} onPress={onSave} disabled={saving}>
        <ThemedText style={{ color: '#fff', fontWeight: '700' }}>{saving ? 'Kaydediliyor…' : 'Kaydet'}</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10, backgroundColor: '#fff' },
  saveBtn: { backgroundColor: '#1e3a8a', paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
});


