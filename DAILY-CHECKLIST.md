# 📋 Günlük Kontrol Listesi - OdakMentor App

## 🔧 Servisler ve Portlar Durumu

### ✅ PORT KONTROLÜ
- **Frontend**: `localhost:8082` (serve docs) - ✅ ÇALIŞIYOR
- **Backend**: `localhost:3000` (video-conference-server) - ❓ KONTROL GEREKİR
- **Ubuntu Backend**: `192.168.1.200:3001` - ❓ KONTROL GEREKİR
- **Ubuntu AI Backend**: `192.168.1.200:3002` - ❓ KONTROL GEREKİR

### 📁 DOSYA DURUMU KONTROLİ

#### ✅ MEVCUT DOSYALAR (.ENV ve KONFİGÜRASYON)
- [x] `.env` (root) - PostgreSQL konfigürasyonu mevcut
- [x] `server/video-conference-server.js` - Backend ana dosyası
- [x] `services/authService.ts` - Auth servisi
- [x] `services/databaseService.ts` - Database servisi  
- [x] `services/mockDatabaseService.ts` - Mock database servisi

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
- `GET /api/health` - Backend sağlık kontrolü
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/verify-email` - E-posta doğrulama
- `POST /api/auth/google` - Google OAuth

#### 📧 MAIL SERVİSİ
- **Mail Server**: Ubuntu (192.168.1.200)
- **Protocol**: Postfix, Port 25
- **From**: barbaryan9178@mail.odakmentor.com
- **Status**: ✅ Aktif

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
- [ ] Tarih: _____
- [ ] Hangi servisleri kontrol ettim
- [ ] Hangi sorunları çözdüm  
- [ ] Yeni eklenen dosyalar varsa buraya yazın

---

*Bu liste her gün güncellensin ve gereksiz dosya oluşturma önlenirsin!*
