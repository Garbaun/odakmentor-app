# Odak Mentor

Yapay zeka destekli, öğretmen ve öğrencileri bir araya getiren, web / iOS / Android üzerinde çalışan eğitim platformu.

## Özellikler

### Sayfa Yapısı
- **Ana Sayfa**: Logo, kategoriler, öğretmen galerisi, animasyonlu sayaçlar
- **Blog Sayfası**: Makale listesi, filtreleme ve arama özellikleri
- **Eğitmenler Sayfası**: Eğitmen seçim süreci ve kalite standartları
- **Hakkımızda Sayfası**: Kurumsal bilgiler (içerik eklemeye hazır)
- **Kayıt/Giriş Sayfaları**: Email/şifre ve Google OAuth entegrasyonu

### UI/UX Özellikleri
- **Tutarlı TopBar**: Tüm sayfalarda standardize edilmiş header (kategoriler barı + logo barı)
- **Ortak Modaller**: Kategoriler ve alışveriş sepeti modalları tüm sayfalarda aynı stil
- **Responsive Tasarım**: Web, tablet ve mobil uyumlu
- **Neomorfik Stil**: Modern gölge efektleri ve yumuşak köşeler
- **Animasyonlar**: Sayaç animasyonları, hover efektleri, geçiş animasyonları

### Teknik Özellikler
- **Firebase Auth**: Email/şifre ve Google OAuth 2.0 entegrasyonu
- **Firestore Database**: Kullanıcı profilleri, kurslar, oturumlar için tam şema
- **Zustand State Management**: Kullanıcı durumu yönetimi
- **TypeScript**: Tip güvenli geliştirme
- **Expo Router**: Dosya tabanlı routing sistemi

## Teknoloji Yığını

- **React Native + Expo 54**: Cross-platform uygulama geliştirme
- **TypeScript**: Tip güvenli JavaScript
- **Expo Router**: Dosya tabanlı routing sistemi
- **Firebase**: Authentication, Firestore Database, Storage
- **Zustand**: Lightweight state management
- **React Native Web**: Web platformu desteği

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Platform-specific komutlar
npm run web        # Web geliştirme
npm run android    # Android emulator
npm run ios        # iOS simulator
```

### Web Build ve Deploy

```bash
# Web için build
npm run web:build

# Local serve (test için)
npm run web:serve

# GitHub Pages'e deploy
npm run web:deploy
```

## Proje Yapısı

```
app/
  (tabs)/
    index.tsx          # Ana sayfa - öğretmen galerisi, sayaçlar
    explore.tsx        # Keşfet sayfası
  about/
    index.tsx          # Hakkımızda sayfası
  blog/
    index.tsx          # Blog ana sayfası
    [slug].tsx         # Blog detay sayfası
  teacher/
    index.tsx          # Eğitmenler sayfası
  register/
    index.tsx          # Kayıt sayfası
  student/
    index.tsx          # Öğrenci giriş sayfası

components/
  TopBar.tsx           # Ortak header bileşeni
  CategoryModal.tsx    # Kategoriler modalı (tüm sayfalarda aynı)
  CartModal.tsx        # Alışveriş sepeti modalı
  ThemedText.tsx       # Tema uyumlu metin bileşeni
  ThemedView.tsx       # Tema uyumlu view bileşeni

config/
  firebase.ts          # Firebase yapılandırması
  authProviders.ts     # OAuth sağlayıcı ayarları

services/
  authService.ts       # Kimlik doğrulama servisleri
  databaseService.ts   # Firestore veritabanı servisleri

database/
  schema.ts            # Veritabanı şema tanımları
  seedData.ts          # Örnek veri

styles/
  globalStyles.ts      # Global stil tanımları

store/
  authStore.ts         # Zustand auth state management
```

## Ortam Değişkenleri

Projenin çalışması için aşağıdaki environment variables gereklidir:

```bash
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id

# Google OAuth
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id
```

## Önemli Komutlar

```bash
# Geliştirme
npm run dev              # Geliştirme sunucusu
npm run lint             # ESLint kontrolü

# Database
npm run db:init          # Veritabanını başlat
npm run db:cleanup       # Veritabanını temizle
npm run db:reset         # Veritabanını sıfırla

# Build & Deploy
npm run web:build        # Web için build
npm run web:deploy       # GitHub Pages'e deploy
```

## Geliştirme Notları

### Modal Sistemi
- Tüm sayfalarda `CategoryModal` ve `CartModal` ortak bileşenleri kullanılır
- Tutarlı stil ve davranış için tek yerden kontrol edilir

### TopBar Yapısı
- İki katmanlı: Kategoriler barı (üst) + Logo barı (alt)
- Tüm sayfalarda standardize edilmiş boyutlar ve stiller
- Aktif sayfa vurgulama sistemi

### Stil Sistemi
- `globalStyles.ts`: Tüm sayfalarda ortak stiller
- Neomorfik tasarım dili
- Responsive breakpoint'ler

## Katkı

PR ve issue’lar kabul edilir. Standart Conventional Commits tercih edilir.

## Lisans

MIT

—
Repo: <https://github.com/Garbaun/odakmentor-app>
