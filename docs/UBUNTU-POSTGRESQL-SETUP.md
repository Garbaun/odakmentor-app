# Ubuntu PostgreSQL Kurulum Rehberi

Bu rehber, Ubuntu cihazınızda PostgreSQL veritabanını kurmak ve Odak Mentor uygulaması için yapılandırmak için gerekli adımları içerir.

## 1. PostgreSQL Kurulumu

### Ubuntu 20.04/22.04 için:

```bash
# Sistem paketlerini güncelle
sudo apt update

# PostgreSQL'i kur
sudo apt install postgresql postgresql-contrib

# PostgreSQL servisini başlat
sudo systemctl start postgresql
sudo systemctl enable postgresql

# PostgreSQL durumunu kontrol et
sudo systemctl status postgresql
```

## 2. Veritabanı ve Kullanıcı Oluşturma

```bash
# PostgreSQL'e postgres kullanıcısı olarak bağlan
sudo -u postgres psql

# Veritabanı oluştur
CREATE DATABASE odakmentor_db;

# Kullanıcı oluştur ve şifre ata
CREATE USER odakmentor WITH PASSWORD 'your_secure_password';

# Kullanıcıya veritabanı yetkilerini ver
GRANT ALL PRIVILEGES ON DATABASE odakmentor_db TO odakmentor;

# PostgreSQL'den çık
\q
```

## 3. PostgreSQL Konfigürasyonu

### pg_hba.conf dosyasını düzenle:

```bash
# Dosyayı bul
sudo find /etc -name "pg_hba.conf" 2>/dev/null

# Dosyayı düzenle (genellikle /etc/postgresql/14/main/pg_hba.conf)
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

Aşağıdaki satırı ekleyin (IPv4 bağlantıları için):
```
# Odak Mentor uygulaması için
host    odakmentor_db    odakmentor    0.0.0.0/0    md5
```

### postgresql.conf dosyasını düzenle:

```bash
# Dosyayı bul
sudo find /etc -name "postgresql.conf" 2>/dev/null

# Dosyayı düzenle
sudo nano /etc/postgresql/14/main/postgresql.conf
```

Aşağıdaki ayarları bulun ve değiştirin:
```
listen_addresses = '*'
port = 5432
max_connections = 100
```

## 4. Firewall Ayarları

```bash
# UFW firewall'u etkinleştir
sudo ufw enable

# PostgreSQL portunu aç
sudo ufw allow 5432/tcp

# Firewall durumunu kontrol et
sudo ufw status
```

## 5. PostgreSQL Servisini Yeniden Başlat

```bash
# Servisi yeniden başlat
sudo systemctl restart postgresql

# Durumu kontrol et
sudo systemctl status postgresql
```

## 6. Bağlantı Testi

### Yerel test:
```bash
# Yerel bağlantı testi
psql -h localhost -U odakmentor -d odakmentor_db
```

### Uzak bağlantı testi (Windows makinenizden):
```bash
# Windows makinenizde PostgreSQL client kurulu olmalı
psql -h 192.168.1.100 -U odakmentor -d odakmentor_db
```

## 7. Şema Oluşturma

Odak Mentor uygulamasından şemayı oluşturmak için:

```bash
# Windows makinenizde
npm run db:init
```

Veya manuel olarak:

```bash
# SQL dosyasını Ubuntu cihazına kopyala
scp database/schema.sql user@192.168.1.100:/tmp/

# Ubuntu cihazında şemayı çalıştır
psql -h localhost -U odakmentor -d odakmentor_db -f /tmp/schema.sql
```

## 8. Güvenlik Ayarları

### Güçlü şifre kullanın:
```bash
# Kullanıcı şifresini değiştir
sudo -u postgres psql
ALTER USER odakmentor WITH PASSWORD 'güçlü_şifre_buraya';
\q
```

### SSL bağlantıları için:
```bash
# SSL sertifikaları oluştur
sudo -u postgres openssl req -new -x509 -days 365 -nodes -text -out /var/lib/postgresql/14/main/server.crt -keyout /var/lib/postgresql/14/main/server.key -subj "/CN=your-server-name"

# Dosya izinlerini ayarla
sudo chmod 600 /var/lib/postgresql/14/main/server.key
sudo chmod 600 /var/lib/postgresql/14/main/server.crt
sudo chown postgres:postgres /var/lib/postgresql/14/main/server.key
sudo chown postgres:postgres /var/lib/postgresql/14/main/server.crt
```

## 9. Yedekleme ve Geri Yükleme

### Yedekleme:
```bash
# Veritabanını yedekle
pg_dump -h localhost -U odakmentor -d odakmentor_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Geri yükleme:
```bash
# Yedekten geri yükle
psql -h localhost -U odakmentor -d odakmentor_db < backup_file.sql
```

## 10. Performans Optimizasyonu

### postgresql.conf ayarları:
```
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
```

## 11. Monitoring ve Logging

### Log ayarları:
```bash
# postgresql.conf'da
log_destination = 'stderr'
logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_rotation_age = 1d
log_rotation_size = 100MB
log_min_duration_statement = 1000
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
```

## 12. Sorun Giderme

### Bağlantı sorunları:
```bash
# PostgreSQL loglarını kontrol et
sudo tail -f /var/log/postgresql/postgresql-14-main.log

# Port dinleme durumunu kontrol et
sudo netstat -tlnp | grep 5432

# Firewall durumunu kontrol et
sudo ufw status verbose
```

### Performans sorunları:
```bash
# Aktif bağlantıları kontrol et
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"

# Veritabanı boyutunu kontrol et
sudo -u postgres psql -c "SELECT pg_size_pretty(pg_database_size('odakmentor_db'));"
```

## 13. Otomatik Başlatma

```bash
# Sistem açılışında otomatik başlat
sudo systemctl enable postgresql

# Servis durumunu kontrol et
sudo systemctl is-enabled postgresql
```

## 14. Güncelleme

```bash
# Sistem paketlerini güncelle
sudo apt update

# PostgreSQL'i güncelle
sudo apt upgrade postgresql postgresql-contrib

# Servisi yeniden başlat
sudo systemctl restart postgresql
```

## 15. Test

Kurulum tamamlandıktan sonra test edin:

```bash
# Windows makinenizde
npm run test:db:postgres
```

Bu rehberi takip ederek Ubuntu cihazınızda PostgreSQL veritabanını başarıyla kurabilir ve Odak Mentor uygulaması ile entegre edebilirsiniz.
