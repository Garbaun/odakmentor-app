# Ubuntu PostgreSQL Temiz Kurulum Rehberi

## 🧹 Mevcut PostgreSQL'i Kaldırma (Eğer varsa)

```bash
# PostgreSQL servisini durdur
sudo systemctl stop postgresql

# PostgreSQL'i kaldır
sudo apt remove --purge postgresql postgresql-* -y

# Konfigürasyon dosyalarını kaldır
sudo rm -rf /etc/postgresql/
sudo rm -rf /var/lib/postgresql/
sudo rm -rf /var/log/postgresql/

# Kullanıcıları kaldır
sudo deluser postgres
sudo delgroup postgres

# Cache'i temizle
sudo apt autoremove -y
sudo apt autoclean
```

## 🚀 Temiz PostgreSQL Kurulumu

### 1. Sistem Güncellemesi
```bash
sudo apt update
sudo apt upgrade -y
```

### 2. PostgreSQL Kurulumu
```bash
# PostgreSQL ve ek paketleri kur
sudo apt install postgresql postgresql-contrib postgresql-client -y

# PostgreSQL versiyonunu kontrol et
psql --version
```

### 3. PostgreSQL Servisini Başlat
```bash
# Servisi başlat
sudo systemctl start postgresql

# Servisi etkinleştir (otomatik başlatma)
sudo systemctl enable postgresql

# Servis durumunu kontrol et
sudo systemctl status postgresql
```

### 4. Güvenlik Ayarları
```bash
# PostgreSQL'e postgres kullanıcısı olarak bağlan
sudo -u postgres psql

# postgres kullanıcısına şifre ata
ALTER USER postgres PASSWORD 'your_secure_password';

# PostgreSQL'den çık
\q
```

### 5. Veritabanı ve Kullanıcı Oluşturma
```bash
# PostgreSQL'e tekrar bağlan
sudo -u postgres psql

# Veritabanı oluştur
CREATE DATABASE odakmentor_db;

# Kullanıcı oluştur
CREATE USER odakmentor WITH PASSWORD 'your_secure_password';

# Kullanıcıya yetkileri ver
GRANT ALL PRIVILEGES ON DATABASE odakmentor_db TO odakmentor;

# Kullanıcıyı superuser yap (gerekirse)
ALTER USER odakmentor CREATEDB;

# PostgreSQL'den çık
\q
```

### 6. Uzaktan Bağlantı Ayarları
```bash
# postgresql.conf dosyasını düzenle
sudo nano /etc/postgresql/14/main/postgresql.conf

# Aşağıdaki satırları bulun ve değiştirin:
listen_addresses = '*'
port = 5432
max_connections = 100

# pg_hba.conf dosyasını düzenle
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Dosyanın sonuna ekleyin:
host    odakmentor_db    odakmentor    0.0.0.0/0    md5
host    all             all            0.0.0.0/0    md5

# PostgreSQL'i yeniden başlat
sudo systemctl restart postgresql
```

### 7. Firewall Ayarları
```bash
# UFW firewall'u etkinleştir
sudo ufw enable

# PostgreSQL portunu aç
sudo ufw allow 5432/tcp

# Firewall durumunu kontrol et
sudo ufw status
```

### 8. Bağlantı Testi
```bash
# Yerel bağlantı testi
psql -h localhost -U odakmentor -d odakmentor_db

# Uzaktan bağlantı testi (Windows makinenizden)
psql -h UBUNTU_IP_ADRESI -U odakmentor -d odakmentor_db
```

## 🔧 Windows Makinenizde Konfigürasyon

### .env dosyası oluşturun:
```env
# PostgreSQL Veritabanı Konfigürasyonu
DB_HOST=UBUNTU_IP_ADRESI
DB_PORT=5432
DB_NAME=odakmentor_db
DB_USER=odakmentor
DB_PASSWORD=your_secure_password

# Uygulama Konfigürasyonu
NODE_ENV=development
PORT=3000

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here
```

### Test komutları:
```bash
# Bağlantı testi
npm run test:db:postgres

# Veritabanını başlat
npm run db:init
```

## 🚨 Sorun Giderme

### Bağlantı Sorunları:
```bash
# PostgreSQL loglarını kontrol et
sudo tail -f /var/log/postgresql/postgresql-14-main.log

# Port dinleme durumunu kontrol et
sudo netstat -tlnp | grep 5432

# Firewall durumunu kontrol et
sudo ufw status verbose
```

### Performans Ayarları:
```bash
# postgresql.conf'da ayarlayın:
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
```

## 📊 Veritabanı Yönetimi

### Yedekleme:
```bash
# Veritabanı yedeği
pg_dump -h localhost -U odakmentor odakmentor_db > backup.sql

# Yedekten geri yükleme
psql -h localhost -U odakmentor odakmentor_db < backup.sql
```

### Performans İzleme:
```bash
# Aktif bağlantıları görüntüle
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"

# Veritabanı boyutunu kontrol et
sudo -u postgres psql -c "SELECT pg_size_pretty(pg_database_size('odakmentor_db'));"
```
