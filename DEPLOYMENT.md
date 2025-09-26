# Ubuntu Linux Deployment Rehberi

Bu rehber, Odak Mentor uygulamasını Ubuntu Linux makinesine yüklemek ve yayınlamak için gerekli adımları içerir.

## 🚀 Hızlı Başlangıç

### 1. Sistem Gereksinimleri
- Ubuntu 20.04 LTS veya üzeri
- Node.js 18.x veya üzeri
- npm veya yarn
- Git
- Nginx (web server için)

### 2. Sistem Güncellemesi
```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Node.js Kurulumu
```bash
# NodeSource repository ekle
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Node.js kur
sudo apt-get install -y nodejs

# Versiyon kontrolü
node --version
npm --version
```

### 4. Git Kurulumu
```bash
sudo apt install git -y
```

### 5. Proje Klonlama
```bash
# Projeyi klonla
git clone https://github.com/Garbaun/odakmentor-app.git
cd odakmentor-app

# Bağımlılıkları yükle
npm install
```

## 🏗️ Build ve Deploy

### 1. Production Build
```bash
# Web için build oluştur
npm run web:build

# Build dosyaları docs/ klasöründe oluşur
ls -la docs/
```

### 2. Nginx Kurulumu ve Konfigürasyonu
```bash
# Nginx kur
sudo apt install nginx -y

# Nginx'i başlat
sudo systemctl start nginx
sudo systemctl enable nginx

# Firewall ayarları
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable
```

### 3. Nginx Konfigürasyonu
```bash
# Yeni site konfigürasyonu oluştur
sudo nano /etc/nginx/sites-available/odakmentor
```

Nginx konfigürasyon dosyası içeriği:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Domain adınızı buraya yazın
    
    root /path/to/odakmentor-app/docs;  # Proje yolunu buraya yazın
    index index.html;
    
    # Gzip sıkıştırma
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Cache ayarları
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA routing için
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

### 4. Site Aktifleştirme
```bash
# Site linkini aktifleştir
sudo ln -s /etc/nginx/sites-available/odakmentor /etc/nginx/sites-enabled/

# Default site'ı kaldır (opsiyonel)
sudo rm /etc/nginx/sites-enabled/default

# Nginx konfigürasyonunu test et
sudo nginx -t

# Nginx'i yeniden başlat
sudo systemctl reload nginx
```

## 🔄 Otomatik Deployment Script

### 1. Deployment Script Oluştur
```bash
nano deploy.sh
```

Script içeriği:
```bash
#!/bin/bash

# Proje dizinine git
cd /path/to/odakmentor-app

# Git'ten son değişiklikleri çek
git pull origin main

# Bağımlılıkları güncelle
npm install

# Production build oluştur
npm run web:build

# Nginx'i yeniden başlat
sudo systemctl reload nginx

echo "Deployment tamamlandı!"
```

### 2. Script'i Çalıştırılabilir Yap
```bash
chmod +x deploy.sh
```

### 3. Cron Job ile Otomatik Güncelleme (Opsiyonel)
```bash
# Crontab'ı düzenle
crontab -e

# Her gün saat 02:00'da otomatik güncelleme
0 2 * * * /path/to/odakmentor-app/deploy.sh
```

## 🔒 SSL Sertifikası (Let's Encrypt)

### 1. Certbot Kurulumu
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 2. SSL Sertifikası Alma
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 3. Otomatik Yenileme
```bash
sudo certbot renew --dry-run
```

## 📊 Monitoring ve Logs

### 1. Nginx Logları
```bash
# Access logları
sudo tail -f /var/log/nginx/access.log

# Error logları
sudo tail -f /var/log/nginx/error.log
```

### 2. Sistem Monitoring
```bash
# Disk kullanımı
df -h

# Memory kullanımı
free -h

# CPU kullanımı
htop
```

## 🚨 Troubleshooting

### 1. Nginx Çalışmıyor
```bash
sudo systemctl status nginx
sudo nginx -t
```

### 2. Port 80 Kullanımda
```bash
sudo netstat -tlnp | grep :80
sudo lsof -i :80
```

### 3. Build Hataları
```bash
# Node modules'ü temizle
rm -rf node_modules package-lock.json
npm install

# Cache'i temizle
npm run web:build -- --clear
```

## 🔧 Gelişmiş Konfigürasyon

### 1. PM2 ile Process Management
```bash
# PM2 kur
npm install -g pm2

# PM2 ile serve
pm2 start "npx serve docs -p 3000" --name "odakmentor"
pm2 startup
pm2 save
```

### 2. Docker ile Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run web:build

FROM nginx:alpine
COPY --from=0 /app/docs /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Environment Variables
```bash
# .env dosyası oluştur
nano .env

# Firebase konfigürasyonu
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

## 📝 Önemli Notlar

1. **Firebase Konfigürasyonu**: `config/firebase.ts` dosyasındaki Firebase ayarlarını kontrol edin
2. **Domain Ayarları**: Nginx konfigürasyonunda domain adınızı doğru yazın
3. **SSL Sertifikası**: Production için mutlaka SSL kullanın
4. **Backup**: Düzenli olarak backup alın
5. **Monitoring**: Logları düzenli olarak kontrol edin

## 🆘 Yardım

Sorun yaşarsanız:
1. Log dosyalarını kontrol edin
2. Nginx konfigürasyonunu test edin
3. Port ve firewall ayarlarını kontrol edin
4. Domain DNS ayarlarını kontrol edin
