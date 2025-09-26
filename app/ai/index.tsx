import { Collapsible } from '@/components/Collapsible';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AIAssistant } from '@/components/AIAssistant';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TEXT = '#1e3a8a';

export default function AIScreen() {
  const scheme = useColorScheme();
  // Force light palette to match the explicit white background
  const colors = Colors['light'];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [formName, setFormName] = useState('');
  const [formGoal, setFormGoal] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ id: string; from: 'user' | 'ai'; text: string }[]>([
    { id: 'm0', from: 'ai', text: 'Merhaba! Hedeflerini paylaşırsan yardımcı öneriler sunabilirim.' },
  ]);

  const onSubmitForm = () => {
    if (!formName.trim() || !formGoal.trim() || !formMessage.trim()) {
      Alert.alert('Eksik bilgi', 'Lütfen tüm alanları doldurun.');
      return;
    }
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 1500);
    setFormName('');
    setFormGoal('');
    setFormMessage('');
  };

  const onSendMessage = () => {
    const text = chatInput.trim();
    if (!text) return;
    const userMsg = { id: String(Date.now()), from: 'user' as const, text };
    const aiMsg = {
      id: String(Date.now() + 1),
      from: 'ai' as const,
      text: 'Not aldım! Yakında gerçek zamanlı yanıtlar burada görünecek.',
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setChatInput('');
  };

  return (
    <View style={[styles.container, { backgroundColor: '#ffffff' }]}> 
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 32 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.headerTopRow, { paddingTop: insets.top + 8, backgroundColor: '#ffffff' }]}>
          <TouchableOpacity style={styles.backRow} activeOpacity={0.7} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={22} color={TEXT} />
            <ThemedText style={{ color: TEXT }}>Geri</ThemedText>
          </TouchableOpacity>
          <View style={{ position: 'absolute', left: 0, right: 0, alignItems: 'center' }}>
            <TouchableOpacity onPress={() => router.push('/')}>
              <Image source={require('@/assets/images/logo.png')} style={{ width: 160, height: 44 }} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: 1, backgroundColor: '#e5e7eb', marginTop: 8, marginBottom: 8 }} />

        <ThemedText type="subtitle" style={{ color: colors.textPrimary, marginBottom: 6 }}>Yapay Zeka Destekli</ThemedText>
        <ThemedText style={{ color: colors.textSecondary, marginBottom: 12 }}>Kişiselleştirilmiş öneriler ve analizler</ThemedText>

        <ThemedView style={[styles.card, { backgroundColor: '#ffffff', borderColor: colors.border }]}> 
          <ThemedText style={{ color: colors.textPrimary, fontWeight: '700' }}>Neler Sunuyor?</ThemedText>
          <ThemedText style={{ color: colors.textSecondary }}>
            - Seviye tespitine göre konu önerileri
          </ThemedText>
          <ThemedText style={{ color: colors.textSecondary }}>
            - Zayıf konular için çalışma planı
          </ThemedText>
          <ThemedText style={{ color: colors.textSecondary }}>
            - Haftalık ilerleme analizi ve bildirimler
          </ThemedText>
        </ThemedView>

        <ThemedView style={[styles.card, { backgroundColor: '#ffffff', borderColor: colors.border }]}> 
          <ThemedText style={{ color: colors.textPrimary, fontWeight: '700' }}>Yakında</ThemedText>
          <ThemedText style={{ color: colors.textSecondary }}>
            Grafikler, hedefler, rozetler ve daha fazlası.
          </ThemedText>
        </ThemedView>

        <ThemedView style={[styles.card, { backgroundColor: '#ffffff', borderColor: colors.border }]}> 
          <ThemedText style={{ color: colors.textPrimary, fontWeight: '700' }}>Hemen Başlayın</ThemedText>
          <ThemedText style={{ color: colors.textSecondary }}>
            Kısa bir seviye tespiti ile kişisel çalışma planınızı oluşturun.
          </ThemedText>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/student')}
            style={{
              marginTop: 8,
              backgroundColor: TEXT,
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 10,
              alignSelf: 'flex-start'
            }}
          >
            <ThemedText style={{ color: '#ffffff', fontWeight: '700' }}>Seviye Tespitine Başla</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Sohbet */}
        <ThemedText type="subtitle" style={{ color: colors.textPrimary, marginTop: 14 }}>Akıllı Sohbet</ThemedText>
        <ThemedView style={[styles.card, { backgroundColor: '#ffffff', borderColor: colors.border }]}> 
          <View style={styles.chatContainer}>
            {messages.map((m) => (
              <View key={m.id} style={[styles.chatBubble, m.from === 'user' ? styles.chatBubbleUser : styles.chatBubbleAi]}> 
                <ThemedText style={{ color: m.from === 'user' ? TEXT : colors.textSecondary }}>{m.text}</ThemedText>
              </View>
            ))}
          </View>
          <View style={styles.chatInputRow}>
            <TextInput
              placeholder="Sorunu yaz..."
              placeholderTextColor={colors.textMuted}
              value={chatInput}
              onChangeText={setChatInput}
              style={[styles.input, { flex: 1, marginTop: 0, color: colors.textPrimary, borderColor: colors.border }]}
              returnKeyType="send"
              onSubmitEditing={onSendMessage}
            />
            <TouchableOpacity style={styles.sendBtn} activeOpacity={0.85} onPress={onSendMessage}>
              <MaterialIcons name="send" color="#ffffff" size={18} />
            </TouchableOpacity>
          </View>
        </ThemedView>

        {/* Kısa Form */}
        <ThemedText type="subtitle" style={{ color: colors.textPrimary, marginTop: 14 }}>Kısa Form</ThemedText>
        <ThemedView style={[styles.card, { backgroundColor: '#ffffff', borderColor: colors.border }]}> 
          <ThemedText style={styles.label}>Ad Soyad</ThemedText>
          <TextInput
            value={formName}
            onChangeText={setFormName}
            placeholder="Örn. Ayşe Yılmaz"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
          />
          <ThemedText style={styles.label}>Hedefin</ThemedText>
          <TextInput
            value={formGoal}
            onChangeText={setFormGoal}
            placeholder="Örn. 2 ayda Matematik netlerini +10 artırmak"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
          />
          <ThemedText style={styles.label}>Mesaj</ThemedText>
          <TextInput
            value={formMessage}
            onChangeText={setFormMessage}
            placeholder="Kısaca seviyeni ve sorun yaşadığın konuları yaz"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, styles.textarea, { borderColor: colors.border, color: colors.textPrimary }]}
            multiline
          />
          <TouchableOpacity onPress={onSubmitForm} activeOpacity={0.85} style={styles.primaryBtn}>
            <ThemedText style={styles.primaryBtnText}>{submitted ? 'Gönderildi' : 'Gönder'}</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* SSS */}
        <ThemedText type="subtitle" style={{ color: colors.textPrimary, marginTop: 14 }}>Sıkça Sorulan Sorular</ThemedText>
        <ThemedView style={[styles.card, { backgroundColor: '#ffffff', borderColor: colors.border }]}> 
          <Collapsible title="Yapay zeka nasıl öneri üretiyor?" iconName="questionmark.circle.fill">
            <ThemedText style={{ color: colors.textSecondary }}>
              Başlangıçta verdiğin hedefler ve seviyene göre konuları önceliklendirir; zamanla etkileşimlerine göre uyum sağlar.
            </ThemedText>
          </Collapsible>
          <View style={{ height: 8 }} />
          <Collapsible title="Verilerim güvende mi?" iconName="lock.fill">
            <ThemedText style={{ color: colors.textSecondary }}>
              Kişisel veriler, uygulama politikalarına uygun şekilde korunur ve paylaşılmaz.
            </ThemedText>
          </Collapsible>
          <View style={{ height: 8 }} />
          <Collapsible title="Gerçek öğretmen desteği alabilir miyim?" iconName="person.fill">
            <ThemedText style={{ color: colors.textSecondary }}>
              Evet, öğretmen başvuruları ve eşleşmeleri yakında bu sayfa üzerinden yönetilebilecek.
            </ThemedText>
          </Collapsible>
        </ThemedView>
      </ScrollView>

      {/* AI Asistan Maskot */}
      <AIAssistant />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTopRow: {
    position: 'relative',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backRow: {
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
  chatContainer: {
    gap: 8,
  },
  chatBubble: {
    maxWidth: '82%',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  chatBubbleUser: {
    backgroundColor: '#e0e7ff',
    borderColor: '#c7d2fe',
    alignSelf: 'flex-end',
  },
  chatBubbleAi: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  sendBtn: {
    backgroundColor: TEXT,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
});


