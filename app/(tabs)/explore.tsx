import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Image, Platform, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Collapsible } from '@/components/Collapsible';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const APP_BG = '#ffffff';
const PANEL_BG = '#f5f5f5';
const BORDER = '#e5e7eb';
const TEXT = '#1e3a8a';

export default function TipsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topOffset = insets.top + 8;
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={APP_BG} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { paddingTop: topOffset }]}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity style={styles.backRow} activeOpacity={0.7} onPress={() => router.push('/') }>
              <MaterialIcons name="arrow-back" size={22} color={TEXT} />
              <ThemedText style={styles.backText}>Geri</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/')}>
              <Image source={require('@/assets/images/logo.png')} style={styles.logoImage} resizeMode="contain" />
            </TouchableOpacity>
          </View>
          <ThemedText type="title" style={styles.headerTitle}>İpuçları</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Kısa öneriler ve öğrenme tüyoları</ThemedText>
        </View>

        <ThemedView style={styles.panel}>
          <Collapsible title="Site Yapısı" iconName="map">
            <ThemedText>
              Ana sayfa, Öğrenci/Öğretmen girişleri, Öğretmenler ve İpuçları bölümlerinden oluşur. Alt bar üzerinden sayfalar arasında hızlıca gezinebilirsiniz.
            </ThemedText>
          </Collapsible>
          <Collapsible title="Eğitimler" iconName="book">
            <ThemedText>
              Matematik, Fen, Dil ve daha fazlası için seviyene uygun içerikler ve koçluk önerileri sunulur.
            </ThemedText>
          </Collapsible>
          <Collapsible title="SSS (Sık Sorulan Sorular)" iconName="questionmark.circle">
            <ThemedText>
              Hesap, güvenlik ve ders planlama gibi konularda sık sorulan soruların yanıtlarını burada bulacaksın.
            </ThemedText>
          </Collapsible>
          <Collapsible title="Sayfa Gezgini (Explorer)" iconName="safari">
            <ThemedText>
              Uygulamadaki ana sayfa ve ipuçları sayfaları arasında gezinmek için alt menüyü kullanın. Ana sayfadaki “İpuçları” kartına dokunarak da buraya ulaşabilirsiniz.
            </ThemedText>
          </Collapsible>

          <Collapsible title="Zaman Yönetimi" iconName="timer">
            <ThemedText>
              Haftalık plan yapın; her ders için 2-3 odak blok belirleyin. Yoğun günlerde kısa ama düzenli tekrarlar daha etkilidir.
            </ThemedText>
            <ThemedText>
              Mola sırasında ekran süresini minimumda tutun; göz ve zihin dinlensin.
            </ThemedText>
            <ThemedText type="link">Devamını oku</ThemedText>
          </Collapsible>

          <Collapsible title="Çalışma Ortamı" iconName="deskview">
            <ThemedText>
              Masanızda yalnızca gerekli kaynaklar bulunsun. Gürültü için kulak tıkacı veya beyaz gürültü deneyebilirsiniz.
            </ThemedText>
            <ThemedText>
              Aydınlatma ve oturduğunuz sandalye uzun çalışma için ergonomik olmalı.
            </ThemedText>
            <ThemedText type="link">Devamını oku</ThemedText>
          </Collapsible>

          <Collapsible title="Sınav Stratejileri" iconName="checkmark.seal">
            <ThemedText>
              Kolay sorulardan başlayın; her soruya tavan süre belirleyin ve takılırsanız işaretleyip geçin.
            </ThemedText>
            <ThemedText>
              Denemeleri gerçek sınav koşullarında çözün ve sonrasında hataları konu başlığına göre etiketleyin.
            </ThemedText>
            <ThemedText type="link">Devamını oku</ThemedText>
          </Collapsible>

          <Collapsible title="Motivasyon" iconName="bolt">
            <ThemedText>
              Büyük hedefleri küçük yapılabilir görevlere bölün. Her tamamlanan görev için küçük ödüller ekleyin.
            </ThemedText>
            <ThemedText>
              İlerlemenizi grafiklerle görmek motivasyonu artırır; haftalık gelişimi not alın.
            </ThemedText>
            <ThemedText type="link">Devamını oku</ThemedText>
          </Collapsible>

          <Collapsible title="Dijital Araçlar" iconName="laptopcomputer">
            <ThemedText>
              Zamanlayıcı (Pomodoro), not alma ve tekrar kartları (flashcards) uygulamalarını düzenli kullanın.
            </ThemedText>
            <ThemedText>
              Kaynaklarınızı bulut üzerinde klasörleyin; cihazlar arası senkronizasyon üretkenliği artırır.
            </ThemedText>
            <ThemedText type="link">Devamını oku</ThemedText>
          </Collapsible>

          <Collapsible title="SSS: Programımı nasıl kişiselleştiririm?" iconName="list.bullet.rectangle.portrait">
            <ThemedText>
              Haftalık hedeflerinizi belirleyin, zayıf konulara ek bloklar ekleyin ve ilerlemeye göre haftalık revizyon yapın.
            </ThemedText>
          </Collapsible>

          <Collapsible title="SSS: Hangi derse ne kadar zaman ayırmalıyım?" iconName="clock">
            <ThemedText>
              Deneme analizinizde en düşük nete sahip derslere öncelik verin; 80/20 kuralı ile en çok fayda sağlayacak konulara odaklanın.
            </ThemedText>
          </Collapsible>

          <Collapsible title="SSS: Günlük tekrar nasıl olmalı?" iconName="arrow.counterclockwise">
            <ThemedText>
              O gün işlenen konudan 10-15 soruluk mini tekrar ve bir önceki haftadan 20-30 soru karışık tekrar önerilir.
            </ThemedText>
          </Collapsible>

          <Collapsible title="Odaklı Çalışma">
            <ThemedText>
              25 dakika çalışma + 5 dakika mola şeklinde döngüler planlayın (Pomodoro).
            </ThemedText>
          </Collapsible>
          <Collapsible title="Akıllı Hedefler">
            <ThemedText>
              Hedeflerinizi ölçülebilir, ulaşılabilir ve zaman sınırlı olacak şekilde tanımlayın.
            </ThemedText>
          </Collapsible>
          <Collapsible title="Tekrar Et">
            <ThemedText>
              Aralıklı tekrar tekniğini kullanarak bilgiyi uzun süreli hafızaya atın.
            </ThemedText>
          </Collapsible>
          <Collapsible title="Kaynak Çeşitliliği">
            <ThemedText>
              Video + okuma + pratik kombinasyonuyle konuları pekiştirin.
            </ThemedText>
          </Collapsible>
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_BG,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: BORDER,
  },
  headerTopRow: {
    position: 'relative',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  backRow: {
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backText: {
    color: TEXT,
    fontSize: 14,
  },
  logoImage: {
    width: 160,
    height: 44,
  },
  headerTitle: {
    color: TEXT,
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' }),
    lineHeight: 40,
  },
  headerSubtitle: {
    color: TEXT,
    opacity: 0.8,
  },
  panel: {
    margin: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: PANEL_BG,
    padding: 16,
    gap: 10,
  },
});
