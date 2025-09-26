## Odak Mentor – Dev Continue Guide

### Nerede Kaldık?
- Öğretmen girişi ekranı tamamlandı (e‑posta/şifre, şifremi unuttum, Google/Apple yer tutucu).
- Ana akış çalıştırma: `npx expo start --clear --port 8081`
- `tslib` sürümü sabitlendi (gerekirse: `npm pkg set dependencies.tslib=2.6.2 && npm install`).

### Hızlı Başlangıç
```bash
npm install
npx expo start --clear --port 8081
```

### Firebase ve OAuth
- `config/firebase.ts`: kendi Firebase config bilgilerinizi girin.
- `config/authProviders.ts`: Google client ID’lerini ekleyin.
- Google/Apple girişleri şu an yer tutucu; Firebase credential bağlama adımı yapılacak.

### Sıradaki İşler (Kısa Liste)
- Google/Apple ile Firebase Auth entegrasyonu.
- Öğretmen kayıt akışı (3 adım + onay bekleme durumu).
- Öğrenci onboarding + AI seviye testi (Gemini/OpenAI backend fonksiyonları).
- Ders planlama, görüntülü görüşme (WebRTC/Agora/Twilio entegrasyonu).
- Firestore’dan dinamik veriler (öğretmen listesi, istatistikler).
- `Explore` sayfasını sadeleştirme.

### Git
```bash
git add -A
git commit -m "chore: continue work"
git push origin main
```

### Sorun Giderme
- Port doluysa: `npx expo start --clear --port 8082`
- `tslib` hatası devam ederse:
```bash
npm pkg set dependencies.tslib=2.6.2
npm install
npx expo start --clear --port 8081
```
- Asset yolları: `app.json` `icon/splash` `./assets/images/logo.png` olarak ayarlı.

İyi çalışmalar! Uygulama kökü: `C:\Projects\akilhocasi-app` (klasör adı taşınacaksa önce kopyalayın, sonra çalıştırın).



