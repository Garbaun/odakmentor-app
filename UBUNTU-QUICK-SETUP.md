# 🚀 Ubuntu Hızlı Kurulum Rehberi

## 📋 Ön Gereksinimler
- Ubuntu 20.04 LTS veya üzeri
- Root erişimi (sudo)
- İnternet bağlantısı

## ⚡ Hızlı Kurulum (5 Dakika)

### 1. Sistemi Güncelle
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Node.js Kur
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs git nginx
```

### 3. Projeyi Klonla
```bash
git clone https://github.com/Garbaun/odakmentor-app.git
cd odakmentor-app
npm install
```

### 4. Build Oluştur
```bash
npm run web:build
```

### 5. Nginx Konfigürasyonu
```bash
# Domain adınızı buraya yazın
DOMAIN="your-domain.com"

# Nginx konfigürasyonu oluştur
sudo tee /etc/nginx/sites-available/odakmentor > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    root $(pwd)/docs;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Site aktifleştir
sudo ln -s /etc/nginx/sites-available/odakmentor /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Firewall Ayarları
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw --force enable
```

## 🔄 Otomatik Güncelleme Script'i

```bash
# deploy.sh oluştur
cat > deploy.sh << 'EOF'
#!/bin/bash
cd /path/to/odakmentor-app
git pull origin main
npm install
npm run web:build
sudo systemctl reload nginx
echo "Deployment tamamlandı: $(date)"
EOF

chmod +x deploy.sh
```

## 🔒 SSL Sertifikası (Opsiyonel)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 📊 Monitoring

```bash
# Nginx durumu
sudo systemctl status nginx

# Logları izle
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Disk kullanımı
df -h

# Memory kullanımı
free -h
```

## 🆘 Sorun Giderme

### Nginx Çalışmıyor
```bash
sudo systemctl status nginx
sudo nginx -t
sudo journalctl -u nginx -f
```

### Port 80 Kullanımda
```bash
sudo netstat -tlnp | grep :80
sudo lsof -i :80
```

### Build Hataları
```bash
rm -rf node_modules package-lock.json
npm install
npm run web:build -- --clear
```

## 📝 Önemli Notlar

1. **Domain DNS**: Domain'inizi sunucunun IP adresine yönlendirin
2. **Firebase**: `config/firebase.ts` dosyasındaki ayarları kontrol edin
3. **SSL**: Production için mutlaka SSL kullanın
4. **Backup**: Düzenli backup alın
5. **Monitoring**: Logları düzenli kontrol edin

## 🎯 Sonuç

Kurulum tamamlandıktan sonra:
- Site: `http://your-domain.com`
- Admin Panel: `http://your-domain.com/admin`
- Blog: `http://your-domain.com/blog`

## 📞 Destek

Sorun yaşarsanız:
1. Log dosyalarını kontrol edin
2. Nginx konfigürasyonunu test edin
3. Domain DNS ayarlarını kontrol edin
4. Firewall ayarlarını kontrol edin
