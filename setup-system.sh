#!/bin/bash

# Odak Mentor AI Backend - Sistem Hazırlığı ve Versiyon Kontrolü
# Bu script sistem gereksinimlerini kontrol eder ve eksikleri yükler

echo "🚀 Odak Mentor AI Backend - Sistem Hazırlığı Başlatılıyor..."
echo "=================================================="

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonksiyon: Başarı mesajı
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Fonksiyon: Uyarı mesajı
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Fonksiyon: Hata mesajı
error() {
    echo -e "${RED}❌ $1${NC}"
}

# Fonksiyon: Bilgi mesajı
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# 1. Sistem güncellemeleri
echo "📦 Sistem güncellemeleri kontrol ediliyor..."
sudo apt update && sudo apt upgrade -y
success "Sistem güncellemeleri tamamlandı"

# 2. Temel paketlerin kurulumu
echo "🔧 Temel paketler kuruluyor..."
sudo apt install -y curl wget git build-essential
success "Temel paketler kuruldu"

# 3. Node.js versiyon kontrolü
echo "🔍 Node.js versiyonu kontrol ediliyor..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    info "Mevcut Node.js versiyonu: $NODE_VERSION"
    
    # Versiyon numarasını çıkar
    NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    
    if [ "$NODE_MAJOR_VERSION" -lt 16 ]; then
        warning "Node.js versiyonu 16'dan eski. NVM ile güncelleniyor..."
        
        # NVM kurulumu
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        source ~/.bashrc
        
        # Node.js 18 kurulumu
        nvm install 18
        nvm use 18
        nvm alias default 18
        
        success "Node.js 18 kuruldu ve aktif edildi"
    else
        success "Node.js versiyonu uygun ($NODE_VERSION)"
    fi
else
    warning "Node.js bulunamadı. Kuruluyor..."
    
    # NVM kurulumu
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    source ~/.bashrc
    
    # Node.js 18 kurulumu
    nvm install 18
    nvm use 18
    nvm alias default 18
    
    success "Node.js 18 kuruldu"
fi

# 4. NPM versiyon kontrolü
echo "🔍 NPM versiyonu kontrol ediliyor..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    info "Mevcut NPM versiyonu: $NPM_VERSION"
    
    # NPM güncelleme
    npm install -g npm@latest
    success "NPM güncellendi"
else
    error "NPM bulunamadı!"
    exit 1
fi

# 5. NVM durumu kontrolü
echo "🔍 NVM durumu kontrol ediliyor..."
if command -v nvm &> /dev/null; then
    NVM_VERSION=$(nvm --version)
    info "NVM versiyonu: $NVM_VERSION"
    
    # Aktif Node.js versiyonu
    ACTIVE_NODE=$(nvm current)
    info "Aktif Node.js versiyonu: $ACTIVE_NODE"
    
    # Kurulu versiyonlar
    info "Kurulu Node.js versiyonları:"
    nvm list
    
    success "NVM durumu kontrol edildi"
else
    warning "NVM bulunamadı, yeniden kuruluyor..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    source ~/.bashrc
    success "NVM kuruldu"
fi

# 6. Proje dizini hazırlığı
echo "📁 Proje dizini hazırlanıyor..."
PROJECT_DIR="/var/www/odakmentor-ai"
sudo mkdir -p $PROJECT_DIR
sudo chown -R $USER:$USER $PROJECT_DIR
cd $PROJECT_DIR
success "Proje dizini hazırlandı: $PROJECT_DIR"

# 7. Sistem gereksinimleri özeti
echo "📊 Sistem Gereksinimleri Özeti:"
echo "=================================================="
echo "Node.js: $(node --version)"
echo "NPM: $(npm --version)"
echo "NVM: $(nvm --version)"
echo "Aktif Node.js: $(nvm current)"
echo "Proje Dizini: $PROJECT_DIR"
echo "=================================================="

success "Sistem hazırlığı tamamlandı! 🎉"
info "Sonraki adım: Package.json ve dependencies kurulumu"
