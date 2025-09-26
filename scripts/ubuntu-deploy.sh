#!/bin/bash

# Ubuntu Deployment Script for Odak Mentor App
# Bu script Ubuntu Linux makinesine projeyi deploy etmek için kullanılır

set -e  # Hata durumunda script'i durdur

# Renkli output için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Log fonksiyonu
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Sistem kontrolü
check_system() {
    log "Sistem kontrolü yapılıyor..."
    
    # Ubuntu kontrolü
    if ! grep -q "Ubuntu" /etc/os-release; then
        error "Bu script sadece Ubuntu için tasarlanmıştır"
    fi
    
    # Root kontrolü
    if [[ $EUID -eq 0 ]]; then
        error "Bu script root olarak çalıştırılmamalıdır"
    fi
    
    log "Sistem kontrolü tamamlandı ✓"
}

# Gerekli paketleri kontrol et ve kur
install_dependencies() {
    log "Gerekli paketler kontrol ediliyor..."
    
    # Node.js kontrolü
    if ! command -v node &> /dev/null; then
        log "Node.js kuruluyor..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    else
        info "Node.js zaten kurulu: $(node --version)"
    fi
    
    # npm kontrolü
    if ! command -v npm &> /dev/null; then
        error "npm bulunamadı. Node.js kurulumunu kontrol edin."
    else
        info "npm zaten kurulu: $(npm --version)"
    fi
    
    # Git kontrolü
    if ! command -v git &> /dev/null; then
        log "Git kuruluyor..."
        sudo apt install git -y
    else
        info "Git zaten kurulu: $(git --version)"
    fi
    
    # Nginx kontrolü
    if ! command -v nginx &> /dev/null; then
        log "Nginx kuruluyor..."
        sudo apt install nginx -y
        sudo systemctl start nginx
        sudo systemctl enable nginx
    else
        info "Nginx zaten kurulu"
    fi
    
    log "Bağımlılık kontrolü tamamlandı ✓"
}

# Proje kurulumu
setup_project() {
    log "Proje kurulumu yapılıyor..."
    
    # Proje dizini kontrolü
    if [ ! -d "odakmentor-app" ]; then
        log "Proje klonlanıyor..."
        git clone https://github.com/Garbaun/odakmentor-app.git
    else
        log "Proje zaten mevcut, güncelleniyor..."
        cd odakmentor-app
        git pull origin main
        cd ..
    fi
    
    cd odakmentor-app
    
    # Bağımlılıkları yükle
    log "NPM bağımlılıkları yükleniyor..."
    npm install
    
    # Build oluştur
    log "Production build oluşturuluyor..."
    npm run web:build
    
    log "Proje kurulumu tamamlandı ✓"
}

# Nginx konfigürasyonu
configure_nginx() {
    log "Nginx konfigürasyonu yapılıyor..."
    
    # Domain adını al
    read -p "Domain adınızı girin (örn: example.com): " DOMAIN
    
    if [ -z "$DOMAIN" ]; then
        error "Domain adı boş olamaz"
    fi
    
    # Nginx konfigürasyon dosyası oluştur
    NGINX_CONFIG="/etc/nginx/sites-available/odakmentor"
    PROJECT_PATH="$(pwd)/docs"
    
    sudo tee $NGINX_CONFIG > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    root $PROJECT_PATH;
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
        try_files \$uri \$uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOF
    
    # Site linkini aktifleştir
    sudo ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/
    
    # Default site'ı kaldır
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Nginx konfigürasyonunu test et
    if sudo nginx -t; then
        log "Nginx konfigürasyonu geçerli ✓"
    else
        error "Nginx konfigürasyonu geçersiz"
    fi
    
    # Nginx'i yeniden başlat
    sudo systemctl reload nginx
    
    log "Nginx konfigürasyonu tamamlandı ✓"
}

# Firewall ayarları
configure_firewall() {
    log "Firewall ayarları yapılıyor..."
    
    # UFW kontrolü
    if command -v ufw &> /dev/null; then
        sudo ufw allow 'Nginx Full'
        sudo ufw allow ssh
        sudo ufw --force enable
        log "Firewall ayarları tamamlandı ✓"
    else
        warning "UFW bulunamadı, firewall ayarları atlanıyor"
    fi
}

# SSL sertifikası kurulumu
install_ssl() {
    log "SSL sertifikası kurulumu..."
    
    read -p "SSL sertifikası kurmak istiyor musunuz? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Certbot kurulumu
        if ! command -v certbot &> /dev/null; then
            log "Certbot kuruluyor..."
            sudo apt install certbot python3-certbot-nginx -y
        fi
        
        # SSL sertifikası alma
        log "SSL sertifikası alınıyor..."
        sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
        
        log "SSL sertifikası kurulumu tamamlandı ✓"
    else
        info "SSL sertifikası kurulumu atlandı"
    fi
}

# Deployment script oluştur
create_deploy_script() {
    log "Deployment script oluşturuluyor..."
    
    DEPLOY_SCRIPT="deploy.sh"
    cat > $DEPLOY_SCRIPT <<EOF
#!/bin/bash
# Otomatik deployment script

cd $(pwd)

# Git'ten son değişiklikleri çek
git pull origin main

# Bağımlılıkları güncelle
npm install

# Production build oluştur
npm run web:build

# Nginx'i yeniden başlat
sudo systemctl reload nginx

echo "Deployment tamamlandı: \$(date)"
EOF
    
    chmod +x $DEPLOY_SCRIPT
    log "Deployment script oluşturuldu: $DEPLOY_SCRIPT ✓"
}

# Ana fonksiyon
main() {
    log "Ubuntu Deployment Script başlatılıyor..."
    
    check_system
    install_dependencies
    setup_project
    configure_nginx
    configure_firewall
    install_ssl
    create_deploy_script
    
    log "Deployment tamamlandı! 🎉"
    info "Site adresi: http://$DOMAIN"
    info "Deployment script: ./deploy.sh"
    info "Nginx logları: sudo tail -f /var/log/nginx/access.log"
    info "Nginx error logları: sudo tail -f /var/log/nginx/error.log"
}

# Script'i çalıştır
main "$@"
