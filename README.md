# Odak Mentor

Yapay zeka destekli, öğretmen ve öğrencileri bir araya getiren, web / iOS / Android üzerinde çalışan eğitim platformu.

## Özellikler
- Öğrenci/Öğretmen giriş akışları (yer tutucu sayfalar)
- Beyaz zemin, açık gri paneller ve koyu mavi tipografi ile sade UI
- Header: sol tarafta logo, sağ tarafta Ayarlar (modal)
- Ayarlar modalı:
  - Karanlık tema anahtarı (anlık tema geçişi)
  - Bildirim izni isteme ve sistem ayarlarına yönlendirme (Android/iOS)
  - Dil seçimi: TR / EN (başlıklar ve butonlar canlı değişir)
  - Kısayollar: Profil/Öğrenci, Öğretmen Başvurusu
- Yatay kaydırmalı "Öğretmenlerimiz" galerisi (ad, branş, sınıf aralığı, puan)
- Animasyonlu sayaçlar: kayıtlı öğrenci / öğretmen / sanal sınıf
- Alt tab bar: beyaz zemin

## Teknoloji Yığını
- React Native + Expo (router, managed workflow)
- TypeScript
- Zustand (hazırda `store/` dizini)
- Firebase (hazırda `config/firebase.ts` örneği; env ile doldurun)

## Kurulum
```bash
npm install
npx expo start
```
Web için:
```bash
npx expo start --web
```

Bildirimler için (gerekirse):
```bash
npm i expo-notifications
```
Android’de kanal tanımı otomatik yapılır; izin reddedilirse modalden “Sistem Ayarlarını Aç” ile yönlendirilebilir.

## Proje Yapısı (özet)
```
app/
  (tabs)/
    _layout.tsx        # Tab bar ayarları (beyaz zemin)
    index.tsx          # Ana sayfa (logo, ayarlar, sayaçlar, öğretmenler)
    explore.tsx        # Örnek sayfa
  _layout.tsx          # Router stack
components/
  ThemedText.tsx, ThemedView.tsx, ui/*
config/firebase.ts      # Firebase örnek konfig (env ile doldurun)
constants/Colors.ts     # Renk paleti (light/dark + UI tonları)
hooks/
  useColorScheme.ts     # Tema override + setter
assets/images/          # logo.png ve diğer görseller
```

## Ortam Değişkenleri
`config/firebase.ts` içindeki değerleri kendi projenizin bilgileriyle güncelleyin. Production için env yönetimi önerilir.

## Komutlar
- `npm start` – Expo başlatır
- `npm run android` / `npm run ios` / `npm run web`
- `npm run lint`

## Sık Karşılaşılanlar
- "Unable to resolve asset ./assets/icon.png": `app.json` içindeki yolların `assets/images/*` ile eşleştiğinden emin olun.
- "expo-notifications bulunamadı": `npm i expo-notifications` ile ekleyin, ardından `npx expo start --clear`.
- iOS simülator/web için ikon/splash uyarıları: `app.json` yolları ve dosyaların mevcut olduğundan emin olun.

## Katkı
PR ve issue’lar kabul edilir. Standart Conventional Commits tercih edilir.

## Lisans
MIT

—
Repo: https://github.com/Garbaun/odakmentor-app
