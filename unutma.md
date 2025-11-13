# UNUTMA.MD - ODAKMENTOR APP DURUMU

## ✅ PROJE DURUMU (2025-01-20)

**Son Kontrol**: 2025-01-20
**Durum**: Çalışıyor, AI Server port düzeltmesi yapıldı

### 🚀 SERVİSLER DURUMU VE KONTROL SIRASI

**KONTROL SIRASI (Tek Port Sistemi):**

1. **Mail Server** - Ubuntu (mail.odakmentor.com:587) ✅ TAMAMEN AKTİF
2. **PostgreSQL** - Ubuntu (192.168.1.200:5432) ✅ ÇALIŞIYOR
3. **Video Server** - Ubuntu (192.168.1.200:3000) ✅ ÇALIŞIYOR
4. **AI Server** - Ubuntu (192.168.1.200:3002) ❌ PORT YAPILANDIRMA HATASI (3001'de çalışıyor)
5. **Admin Panel** - Windows (localhost:3000/creator-panel) ⚠️ İSİM DEĞİŞTİRİLDİ
6. **Kayıt Ol** - Windows (localhost:3000/register) ✅ ÇALIŞIYOR
7. **Giriş Yap** - Windows (localhost:3000/student) ✅ ÇALIŞIYOR

### 🌐 PORT STRATEJİSİ (TEK PORT SİSTEMİ)

- **Port 3000**: Frontend + Backend (serve docs + API) ✅ ÇALIŞIYOR
- **Port 3001**: Frontend (serve docs) ✅ ÇALIŞIYOR  
- **Port 3002**: AI Server (Ubuntu - 192.168.1.200) ❌ PORT HATASI (3001'de çalışıyor)
- **Port 5432**: PostgreSQL Database (Ubuntu - 192.168.1.200) ✅ ÇALIŞIYOR
- **Port 587**: Mail Server SMTP (mail.odakmentor.com) ✅ TAMAMEN AKTİF

### 📁 DOSYA YAPISI

**WINDOWS (Local Development):**

- **Ana Dizin**: `C:\Projects\odakmentor-app`
- **Server**: `C:\Projects\odakmentor-app\server`
- **Frontend Build**: `C:\Projects\odakmentor-app\docs`
- **Environment**: `.env` dosyası ana dizinde mevcut ✅

**UBUNTU (Production Server):**

- **Kök Dizin**: `kanduras-server` (SABİT - DEĞİŞTİRİLMEZ!)
- **Hostname**: `barbaryan9178@kanduras-server:~$` (SABİT)
- **Alt Dizinler**:
  - `odakmentor-app/` (Ana proje)
  - `kandurasmedya-web/`
  - `evakli-app/`
  - `gayfe-app/`
  - `grafetsy/`
  - `skinn-app/`
- **Mail Server**: `~/odakmentor-app/mail/` (DOĞRU YOL)
- **Mail Server Yolu**: `barbaryan9178@kanduras-server:~/odakmentor-app/mail$`
- **Ubuntu Servisleri**: 192.168.1.200 (Mail, Video, AI)
- **Ubuntu Database**: 192.168.1.200 (PostgreSQL)
- **Ana Sunucu**: 78.186.167.42 (Port yönlendirme)

**⚠️ ÖNEMLİ KURAL:**

- **Kök Dizin**: `kanduras-server` ASLA DEĞİŞTİRİLMEZ!
- **Hostname**: `barbaryan9178@kanduras-server:~$` sabit kalır
- **Alt Dizinler**: Projeler alt dizinlerde organize edilir
- **Tek Port Sistemi**: Her proje kendi alt dizininde çalışır

### 📧 MAIL SERVER BİLGİLERİ (TAMAMEN AKTİF)

**Domain ve DNS:**

- **Domain**: `mail.odakmentor.com`
- **IP Adresi**: `78.186.167.42` (Ana sunucu)
- **Port Yönlendirme**: `78.186.167.42` → `192.168.1.200` (Ubuntu)
- **DNS Kayıtları**: Türkticaret.net'te aktif

**Mail Server Ayarları:**

- **SMTP Server**: `mail.odakmentor.com:587` (TLS)
- **SMTP Server**: `mail.odakmentor.com:25` (Plain)
- **IMAP Server**: `mail.odakmentor.com:143` (STARTTLS)
- **IMAP Server**: `mail.odakmentor.com:993` (SSL)
- **Mail Adresi**: `admin@odakmentor.com`
- **Domain**: `odakmentor.com`

**Port Yönlendirme Kuralları:**

- `78.186.167.42:25` → `192.168.1.200:25`
- `78.186.167.42:587` → `192.168.1.200:587`
- `78.186.167.42:465` → `192.168.1.200:465`
- `78.186.167.42:143` → `192.168.1.200:143`
- `78.186.167.42:993` → `192.168.1.200:993`

**Ubuntu Mail Server Konfigürasyonu:**

- **Hostname**: `mail.odakmentor.com`
- **Postfix**: Aktif ve çalışıyor
- **Dovecot**: Aktif ve çalışıyor
- **Firewall**: Tüm mail portları açık
- **Kurallar**: `/etc/iptables/rules.v4` dosyasında kayıtlı

**Mail Server Test Sonuçları:**

- ✅ **Mail Gönderimi**: Başarılı (<admin@odakmentor.com>)
- ✅ **Mail Alımı**: Başarılı (Maildir format)
- ✅ **Mail Kutuları**: Admin (17 mail), Kerem (6 mail)
- ✅ **Son Test**: 2025-10-10 00:50'de başarılı
- ✅ **Mail Logları**: Postfix ve Dovecot sorunsuz çalışıyor

**PostgreSQL Veri Alışverişi:**

- ✅ **PostgreSQL**: Aktif ve çalışıyor (Port 5432)
- ✅ **Veritabanı**: odakmentor_db mevcut
- ✅ **Tablolar**: 15 tablo aktif (users, courses, video_sessions, vb.)
- ✅ **Test Tablosu**: test_data oluşturuldu
- ✅ **Veri Ekleme**: Test verisi başarıyla eklendi
- ✅ **Veri Çekme**: Test verisi başarıyla çekildi
- ✅ **Son Test**: 2025-10-11 01:14'te başarılı

**SSL Sertifikası Bilgileri:**

- ✅ **Sertifika Türü**: Self-signed SSL sertifikası
- ✅ **Issuer**: OdakMentor, Istanbul, TR
- ✅ **Subject**: mail.odakmentor.com
- ✅ **Validity**: 1 yıl (2025-10-10 - 2026-10-10)
- ✅ **Algorithm**: RSA 2048 bit
- ✅ **Signature**: SHA256
- ✅ **Konum**: `/etc/ssl/mail.odakmentor.com/`
- ✅ **Postfix SSL**: Aktif ve çalışıyor
- ✅ **SSL Test**: 2025-10-11 00:20'de başarılı

### 🔧 ÇALIŞAN SERVİSLER

```powershell
# 1. Backend Server (Port 3000)
cd C:\Projects\odakmentor-app\server
npm start

# 2. Frontend Serve (Port 3000 - TEK PORT)
cd C:\Projects\odakmentor-app
npm run web:serve

# 3. Test komutları
Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method GET
Invoke-WebRequest -Uri "http://localhost:3000" -Method GET
```

### 🌐 PORT STRATEJİSİ (ÖNEMLİ!) - YENİ AYARLAR

- **Port 3000**: Frontend (serve docs) ✅ ÇALIŞIYOR
- **Port 3001**: Backend API (video-conference-server.js) ✅ ÇALIŞIYOR
- **Port 5432**: PostgreSQL Database (Ubuntu - 192.168.1.200) ✅ ÇALIŞIYOR
- **Port 587**: Mail Server SMTP (Ubuntu - 192.168.1.200) ✅ ÇALIŞIYOR
- **Diğer Portlar**: KULLANILMAYACAK

### 🌐 BROWSER TEST

- **Frontend**: `http://localhost:3000` (serve docs) ✅ ÇALIŞIYOR
- **Frontend**: `http://localhost:3001` (serve docs) ✅ ÇALIŞIYOR
- **Backend API**: `http://192.168.1.200:3000/api/health` ✅ ÇALIŞIYOR
- **Register API**: `http://192.168.1.200:3000/api/auth/register` ✅ ÇALIŞIYOR
- **Mail Service**: `admin@odakmentor.com` ✅ TAMAMEN AKTİF
- **Mail Server Test**: `Test-NetConnection -ComputerName mail.odakmentor.com -Port 587` ✅ BAŞARILI

### 📊 TERMINAL KAYITLARI (2025-10-05 19:56)

```
[1] Video Conference Server çalışıyor: http://localhost:3000
[1] WebSocket bağlantıları: ws://localhost:3000
[1] API endpoints: http://localhost:3000/api
[0] Waiting on http://localhost:8081  # ESKİ PORT - ARTIK KULLANILMIYOR

# Serve logs:
INFO  Accepting connections at http://localhost:3000
HTTP  05.10.2025 19:55:56 ::1 GET /api/health
HTTP  05.10.2025 19:55:56 ::1 Returned 404 in 56 ms
HTTP  05.10.2025 19:56:03 ::1 GET /
HTTP  05.10.2025 19:56:03 ::1 Returned 200 in 1 ms
HTTP  05.10.2025 19:56:32 ::1 GET /_expo/static/js/web/entry-f03553a108dc1eab6550d322fa3011cf.js
HTTP  05.10.2025 19:56:32 ::1 Returned 200 in 22 ms
```

### ⚠️ ÇÖZÜLEN SORUNLAR

- ✅ **Beyaz Sayfa Problemi**: Frontend yeniden build edildi ve çözüldü
- ✅ **Port Karışıklığı**: Ayrı port stratejisi uygulandı (3000 frontend, 3001 backend)
- ✅ **Node Process Çakışması**: Tüm process'ler temizlendi
- ✅ **Frontend Hash**: Yeni hash ile güncel versiyon
- ✅ **Backend Health API**: Çalışıyor (200 OK)
- ✅ **.env Dosyası**: Veritabanı ayarları düzeltildi (DB_HOST=192.168.1.100)
- ✅ **PostgreSQL Bağlantısı**: Windows'tan Ubuntu'ya bağlantı kuruldu (192.168.1.100:5432)
- ✅ **Register API**: Veritabanı bağlantısı çözüldü ve çalışıyor
- ✅ **Mail Server**: Ubuntu'da kuruldu ve entegre edildi (192.168.1.200:587)
- ✅ **Mail Server Domain**: mail.odakmentor.com aktif hale getirildi
- ✅ **Port Yönlendirme**: Ana sunucu (78.186.167.42) → Ubuntu (192.168.1.200)
- ✅ **DNS Kayıtları**: Türkticaret.net'te mail.odakmentor.com kayıtlı
- ✅ **Mail Server Test**: Windows'tan mail.odakmentor.com:587 bağlantısı başarılı
- ✅ **iptables Kuralları**: Port yönlendirme kuralları kalıcı olarak kaydedildi

### ✅ YAPILAN DÜZELTMELER (2025-01-20)

- ✅ **AI Server Port**: 3001 → 3002 olarak düzeltildi
- ✅ **Frontend Routing**: Route'lar doğrulandı ve çalışıyor
- ✅ **unutma.md**: Admin Panel → Creator Panel güncellemesi yapıldı
- ✅ **AI Server Yapılandırması**: install-ai-backend.sh ve env-example.txt güncellendi

### ❌ DEVAM EDEN SORUNLAR

- ⏳ **AI Server**: Ubuntu'da yeniden kurulum gerekiyor (3002 portunda)
- ⚠️ **Creator Panel**: localhost:3000/creator-panel/login URL'si ile giriş yapılabilir

### 🔄 YENİDEN BAŞLATMA KOMUTLARI (WINDOWS) - YENİ PORT STRATEJİSİ

```powershell
# 1. Tüm Node process'leri temizle
taskkill /f /im node.exe

# 2. Frontend Build + Serve (Port 3000)
cd C:\Projects\odakmentor-app
npm run web:build
npm run web:serve

# 3. Backend Server başlat (Port 3001)
cd C:\Projects\odakmentor-app\server
$env:PORT=3001; node video-conference-server.js

# 4. Test
Invoke-WebRequest -Uri "http://localhost:3000" -Method GET
Invoke-WebRequest -Uri "http://localhost:3001/api/health" -Method GET
Start-Process "http://localhost:3000"
```

### 📋 BAŞARILAN HEDEFLER

1. ✅ **Yeni Port Stratejisi**: Frontend (3000) ve Backend (3001) ayrı portlarda
2. ✅ **Beyaz Sayfa Problemi**: Çözüldü
3. ✅ **Port Karışıklığı**: Ortadan kalktı (3000 frontend, 3001 backend, 5432 db, 587 mail)
4. ✅ **Frontend Build**: Yeni hash ile güncel versiyon (entry-6c9d216937b2158bdace9062f4c3600d.js)
5. ✅ **Node Process Yönetimi**: Temiz başlatma sistemi
6. ✅ **.env Konfigürasyonu**: Veritabanı ayarları düzeltildi
7. ✅ **Site Çalışması**: localhost:3000'de sorunsuz çalışıyor
8. ✅ **PostgreSQL Bağlantısı**: Windows'tan Ubuntu'ya bağlantı kuruldu
9. ✅ **Register API**: Veritabanı bağlantısı çözüldü ve çalışıyor
10. ✅ **Mail Server**: Ubuntu'da kuruldu ve entegre edildi
11. ✅ **Mail Server Domain**: mail.odakmentor.com tamamen aktif
12. ✅ **Port Yönlendirme**: Ana sunucu → Ubuntu mail server
13. ✅ **DNS Entegrasyonu**: Türkticaret.net DNS kayıtları aktif
14. ✅ **Mail Server Test**: Windows'tan domain üzerinden bağlantı başarılı
15. ✅ **iptables Kuralları**: Port yönlendirme kalıcı olarak kaydedildi
16. ✅ **Tüm Servisler**: Frontend, Backend, Database, Mail Server çalışıyor

### 🎯 SONRAKI ADIMLAR (PLANLANAN)

1. **SSL Sertifikası Kurulumu** ✅ TAMAMLANDI
   - Self-signed SSL sertifikası başarıyla kuruldu
   - Ana sunucuda (78.186.167.42) oluşturuldu
   - Ubuntu'ya (192.168.1.200) kopyalandı
   - Postfix SSL konfigürasyonu aktif

2. **Admin Paneli Düzenleme**
   - Frontend routing sorunları çözülecek
   - Admin panel sayfaları aktif hale getirilecek

3. **Video Konferans Servisi**
   - Video server'ın durumu kontrol edilecek
   - Gerekirse yeniden başlatılacak

4. **PostgreSQL Veri İşlemleri** ✅ TAMAMLANDI
   - Veritabanından veri çekme işlemleri test edildi
   - Veri yükleme işlemleri test edildi
   - Test tablosu oluşturuldu ve veri alışverişi başarılı
   - 15 tablo aktif ve çalışıyor

### 📅 GÜNLÜK COMMIT SİSTEMİ (ÖNEMLİ!)

**Her Gün Yapılacaklar:**

- [ ] `commits/YYYY-MM-DD.md` dosyasını kontrol et
- [ ] Yapılan işleri commits dosyasına kaydet
- [ ] Ertesi gün için plan yap
- [ ] PM2 servislerinin durumunu kontrol et
- [ ] Backend ve Frontend servislerini test et

**PM2 Otomatik Sistem:**

- ✅ **PM2 Kurulumu**: Ubuntu'da otomatik process management aktif
- ✅ **Otomatik Başlatma**: Sistem yeniden başladığında servisler otomatik başlar
- ✅ **Process Monitoring**: PM2 ile tüm servisler izleniyor
- ✅ **Log Management**: PM2 logları otomatik yönetiliyor

**Günlük Kontrol Komutları:**

```bash
# PM2 durumu kontrol et
pm2 status

# PM2 logları kontrol et
pm2 logs

# Servisleri yeniden başlat
pm2 restart all

# Günlük commit dosyasını kontrol et
cat commits/$(date +%Y-%m-%d).md
```

**Tamamlanan Görevler:**

- ✅ **Mail Server**: Ubuntu'da kuruldu ve entegre edildi
- ✅ **Mail Server Domain**: mail.odakmentor.com tamamen aktif
- ✅ **Port Yönlendirme**: Ana sunucu → Ubuntu mail server
- ✅ **DNS Entegrasyonu**: Türkticaret.net DNS kayıtları aktif
- ✅ **Mail Server Test**: Windows'tan domain üzerinden bağlantı başarılı
- ✅ **Mail Gönderimi**: Admin ve Kerem kullanıcılarına test mailleri başarılı
- ✅ **SSL Sertifikası**: Self-signed SSL sertifikası kuruldu ve aktif
- ✅ **Postfix SSL**: SSL/TLS konfigürasyonu tamamlandı
- ✅ **PM2 Sistemi**: Otomatik process management kuruldu
- ✅ **PostgreSQL Veri Alışverişi**: Test edildi ve başarılı
- ✅ **Günlük Commit Sistemi**: Oluşturuldu ve aktif

---
**Son Güncelleme**: 2025-10-11 01:15
**Durum**: MAIL SERVER + SSL + POSTGRESQL TAMAMEN AKTİF ✅
**Platform**: Windows (Local Development) + Ubuntu (Mail Server + Database)
**Frontend**: serve docs (port 3000, 3001) ✅ ÇALIŞIYOR
**Backend**: video-conference-server.js (port 3000) ✅ ÇALIŞIYOR
**Database**: PostgreSQL Ubuntu'da çalışıyor (192.168.1.200:5432) ✅ ÇALIŞIYOR
**Mail Server**: mail.odakmentor.com tamamen aktif ✅ TAMAMEN AKTİF
**SSL Sertifikası**: Self-signed SSL aktif ✅ TAMAMEN AKTİF
**PostgreSQL**: Veri alışverişi test edildi ✅ TAMAMEN AKTİF
**PM2 Sistemi**: Otomatik process management ✅ TAMAMEN AKTİF
**Mail Test**: Admin (17 mail), Kerem (6 mail) - Son test: 00:20 ✅ BAŞARILI
**PostgreSQL Test**: test_data tablosu - Son test: 01:14 ✅ BAŞARILI
**Frontend Hash**: entry-faf28a0fa1f16f3eb4f0fafb52c5e7ff.js
**Port Kullanımı**: 3000 (frontend+backend), 3001 (frontend), 5432 (db), 587 (mail)
**Mail Server**: mail.odakmentor.com:587 (TLS), mail.odakmentor.com:25 (Plain)
**Port Yönlendirme**: 78.186.167.42 → 192.168.1.200 (Ubuntu)
**SSL Durumu**: Self-signed SSL sertifikası aktif ✅ TAMAMEN AKTİF
**Günlük Commit**: commits/2025-10-11.md ✅ TAMAMEN AKTİF
