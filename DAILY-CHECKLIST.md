# 📋 Günlük Kontrol Listesi - OdakMentor App

## 🔧 Servisler ve Portlar Durumu

### ✅ PORT KONTROLÜ

- **Frontend**: `localhost:8082` (serve docs) - ❌ ÇALIŞMIYOR (Yerel docs opsiyonel; prod: odakmentor.com)
- **Backend**: `localhost:3000` (video-conference-server) - ❌ ÇALIŞMIYOR (Son kontrol: 2025-01-11)
- **Ubuntu Backend**: `192.168.1.200:3001` - ✅ ÇALIŞIYOR (SSH ile doğrulandı)
- **Ubuntu AI Backend**: `192.168.1.200:3002` - ✅ ÇALIŞIYOR (SSH ile doğrulandı)

### 📁 DOSYA DURUMU KONTROLİ

#### ✅ MEVCUT DOSYALAR (.ENV ve KONFİGÜRASYON)

- [x] `.env` (root) - ✅ Mevcut
- [x] `server/video-conference-server.js` - ✅ Backend ana dosyası mevcut
- [x] `services/authService.ts` - ✅ Auth servisi mevcut
- [x] `services/databaseService.ts` - ✅ Database servisi mevcut
- [x] `services/mockDatabaseService.ts` - ✅ Mock database servisi mevcut
- [x] `server/mailService.js` - ✅ Mail servisi mevcut

#### ❌ YENİDEN OLUŞTURULMAMASI GEREKENLER

- `.env` dosyası zaten var - PostgreSQL ayarları mevcut
- Database servisleri hazır - ek oluşturma gereksiz
- Backend dosyaları mevcut

### 🗃️ DATABASE DURUMU

- **PostgreSQL**: ✅ Kurulu (Ubuntu: 192.168.1.200)
- **Database**: `odakmentor_db` ✅ Mevcut
- **User**: `odakmentor` ✅ Mevcut
- **Port**: `5432` ✅ Mevcut

### 🌐 API ENDPOINTLERI

#### ✅ ÇALIŞAN ENDPOINTLER

- `GET /api/health` - ✅ Backend sağlık kontrolü (video-conference-server.js:793)
- `POST /api/auth/register` - ✅ Kullanıcı kaydı (video-conference-server.js:238)
- `POST /api/auth/login` - ✅ Kullanıcı girişi (video-conference-server.js:288)
- `GET /api/auth/me` - ✅ Kullanıcı bilgisi (video-conference-server.js:318)
- `POST /api/auth/reset-password` - ✅ Şifre sıfırlama (video-conference-server.js:337)

#### ❌ EKSİK ENDPOINTLER

- `POST /api/auth/verify-email` - ❌ E-posta doğrulama endpoint'i YOK (Frontend'de kullanılıyor ama backend'de yok)
- `POST /api/auth/google` - ❌ Google OAuth endpoint'i YOK (Frontend config mevcut ama backend endpoint yok)

#### 📧 MAIL SERVİSİ

- **Mail Server**: Ubuntu (192.168.1.200)
- **Protocol**: Postfix, Port 25
- **From**: <barbaryan9178@mail.odakmentor.com>
- **Status**: ❌ Entegre Edilmemiş / ⚠️ Kısmen Hazır
- **Dosya Durumu**:
  - ✅ `server/mailService.js` - Mail servisi dosyası mevcut ve çalışır durumda
  - ✅ `server/testMail.js` - Test dosyası mevcut
  - ❌ `nodemailer` paketi eksik (package.json'da yok)
  - ❌ Backend'de kullanılmıyor (video-conference-server.js'de require edilmemiş)
  - ❌ Register endpoint'inde mail gönderimi yok
  - ❌ Verify-email endpoint'i yok (mail servisi kullanılamıyor)

### 🔄 BU KONTROLÜ YAPMADAN ÖNCE

- ❌ Yeni `.env` dosyası oluşturma
- ❌ Yeni database connection dosyası oluşturma  
- ❌ Mevcut servisleri tekrar kurma
- ✅ Sadece mevcut servislerin çalışıp çalışmadığını kontrol et

---

## 📍 HIZLI KONTROL KOMUTLARI

```bash
# Frontend durumu
curl -I http://localhost:8082

# Backend durumu  
curl http://localhost:3000/api/health

# Ubuntu Backend durumu
curl http://192.168.1.200:3001/api/health

# Ubuntu AI Backend durumu
curl http://192.168.1.200:3002/api/health

# PostgreSQL bağlantısı (Ubuntu)
psql -h 192.168.1.200 -U odakmentor -d odakmentor_db
```

---

## 🚨 SIKÇA KARŞILAŞILAN SORUNLAR

### 1. Port Çakışması

- **Çözüm**: `taskkill /f /im node.exe` sonra servisleri yeniden başlat

### 2. Backend Bağlantı Hatası

- **Check**: `.env` dosyasındaki DB_HOST=192.168.1.200
- **Check**: PostgreSQL servisinin Ubuntu'da çalışıp çalışmadığı

### 3. Frontend Beyaz Sayfa

- **Çözüm**: `npx expo export --platform web` sonra `Copy-Item -Recurse -Force dist\* docs\`

---

## 📝 NOT GÜNLÜK OLARAK UPDATE EDİN

- [x] Tarih: 2025-01-11
- [x] Hangi servisleri kontrol ettim:
  - ✅ Frontend build durumu kontrol edildi ve yeniden build edildi
  - ✅ `docs` klasörü build dosyaları ile güncellendi
  - ✅ Backend servisi kontrol edildi (port 3000 - şu anda çalışmıyor)
  - ✅ Build dosyaları doğrulandı (index.html, assets, vb.)
- [x] Hangi sorunları çözdüm:
  - ✅ Frontend production build'i başarıyla oluşturuldu (`npm run web:build`)
  - ✅ Build dosyaları `docs/` klasörüne export edildi
  - ✅ `patch-web-index.js` script'i çalıştırıldı (base path, .nojekyll, 404.html)
  - ⚠️ Backend servisi (port 3000) şu anda çalışmıyor - başlatılması gerekiyor
- [x] Yayına alma durumu:
  - ✅ Frontend build hazır (`docs/` klasörü)
  - ⚠️ Backend servisi başlatılmalı (`cd server && npm start` veya `npm run video-server`)
  - 📝 Production deployment için `docs/` klasörü Nginx'e kopyalanmalı

- [x] Tarih: 2025-11-10
- [x] Hangi servisleri kontrol ettim:
  - ✅ Dosya yapısı kontrol edildi
  - ✅ Backend endpoint'leri kontrol edildi
  - ✅ Port durumları kontrol edildi (3000 çalışıyor, 8082 opsiyonel)
  - ✅ Ubuntu servisleri SSH üzerinden doğrulandı (3001 ve 3002 çalışıyor)
- [x] Hangi sorunları çözdüm:
  - ✅ `.env` dosyası mevcut olarak doğrulandı
  - ✅ Production site yayında: odakmentor.com
- [ ] Yeni eklenen dosyalar varsa buraya yazın

- [x] Tarih: 2025-11-01
- [x] Hangi servisleri kontrol ettim:
  - ✅ Dosya yapısı kontrol edildi
  - ✅ Backend endpoint'leri kontrol edildi
  - ✅ Port durumları kontrol edildi (8082 ve 3000 çalışmıyor)
  - ❌ Ubuntu servisleri yerel ağdan test edilemedi
- [x] Hangi sorunları çözdüm:
  - ❌ `.env` dosyası bulunamadı (oluşturulması gerekiyor)
  - ❌ Frontend (port 8082) çalışmıyor
  - ❌ Backend (port 3000) çalışmıyor
  - ❌ `/api/auth/verify-email` endpoint'i eksik
  - ❌ `/api/auth/google` endpoint'i eksik
  - ❌ Mail servisi backend'e entegre edilmemiş
- [ ] Yeni eklenen dosyalar varsa buraya yazın

### 🔍 TESPİT EDİLEN SORUNLAR

1. **`.env` Dosyası Eksik**: Root dizinde `.env` dosyası bulunamadı. `env-example.txt` dosyası var, bu dosyadan `.env` oluşturulmalı.
2. **Servisler Çalışmıyor**: Port 8082 (Frontend) ve 3000 (Backend) dinlenmiyor.
3. **Eksik Endpoint'ler**:
   - `POST /api/auth/verify-email` endpoint'i backend'de yok, ancak frontend'de kullanılıyor.
   - `POST /api/auth/google` endpoint'i backend'de yok, ancak config dosyası mevcut.
4. **AuthService Eksiklikleri**: `authService.ts` içinde `verifyEmail` metodu yok, ancak `app/verify-email/index.tsx` bu metodu çağırıyor.

5. **Mail Servisi Sorunları**:
   - ❌ `nodemailer` paketi `server/package.json`'da eksik (npm install gerekiyor)
   - ❌ `mailService.js` backend'de kullanılmıyor (`video-conference-server.js`'de require edilmemiş)
   - ❌ Register endpoint'inde email verification maili gönderilmiyor
   - ❌ `/api/auth/verify-email` endpoint'i olmadığı için mail servisi kullanılamıyor
   - ⚠️ Mail servisi dosyası (`server/mailService.js`) hazır ve çalışır durumda, sadece entegre edilmesi gerekiyor
   - 📧 Mail servisi Ubuntu Postfix (192.168.1.200:25) için yapılandırılmış ama `.env` dosyası eksik olduğu için çalışmıyor

---

*Bu liste her gün güncellensin ve gereksiz dosya oluşturma önlenirsin!*
