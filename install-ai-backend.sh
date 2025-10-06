#!/bin/bash

# Odak Mentor AI Backend - Kurulum Scripti
# Bu script tüm gerekli dosyaları kurar ve yapılandırır

echo "🚀 Odak Mentor AI Backend - Kurulum Başlatılıyor..."
echo "=================================================="

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonksiyonlar
success() { echo -e "${GREEN}✅ $1${NC}"; }
warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
error() { echo -e "${RED}❌ $1${NC}"; }
info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

# 1. Proje dizini oluşturma
echo "📁 Proje dizini oluşturuluyor..."
PROJECT_DIR="/var/www/odakmentor-ai"
sudo mkdir -p $PROJECT_DIR
sudo chown -R $USER:$USER $PROJECT_DIR
cd $PROJECT_DIR
success "Proje dizini oluşturuldu: $PROJECT_DIR"

# 2. Package.json oluşturma
echo "📦 Package.json oluşturuluyor..."
cat > package.json << 'EOF'
{
  "name": "odak-mentor-ai-backend",
  "version": "1.0.0",
  "description": "Odak Mentor AI Assistant Backend API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "lint": "eslint .",
    "build": "echo 'Build completed'",
    "deploy": "pm2 start ecosystem.config.js",
    "setup": "npm install && npm run build",
    "health": "curl http://localhost:3001/api/health"
  },
  "keywords": ["ai", "assistant", "education", "api", "chatbot", "mentor"],
  "author": "Odak Mentor Team",
  "license": "MIT",
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.8.1",
    "winston": "^3.10.0",
    "joi": "^17.9.2",
    "dotenv": "^16.3.1",
    "axios": "^1.5.0",
    "openai": "^4.0.0",
    "node-cache": "^5.1.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.0",
    "eslint": "^8.45.0",
    "supertest": "^6.3.0"
  }
}
EOF
success "Package.json oluşturuldu"

# 3. Server.js oluşturma
echo "🖥️  Server.js oluşturuluyor..."
cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const Joi = require('joi');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data', 'qa-pairs.json');

// Logger konfigürasyonu
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // maksimum 100 istek
  message: {
    error: 'Çok fazla istek gönderildi. Lütfen 15 dakika sonra tekrar deneyin.'
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Utility functions
const ensureDataDir = async () => {
  const dataDir = path.join(__dirname, 'data');
  const logsDir = path.join(__dirname, 'logs');
  
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  
  try {
    await fs.access(logsDir);
  } catch {
    await fs.mkdir(logsDir, { recursive: true });
  }
};

const readData = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    logger.error('Veri dosyası okuma hatası:', error);
    const defaultData = {
      qaPairs: [
        {
          id: '1',
          question: 'Kurslara nasıl kayıt olabilirim?',
          answer: 'Merhaba! Kurslara kayıt olmak çok kolay 😊 Ana sayfadaki kurs galerisinden ilgilendiğiniz kursu seçin, "Kayıt Ol" butonuna tıklayın ve ödeme adımlarını tamamlayın. Herhangi bir sorunuz olursa buradayım!',
          category: 'kurs',
          userTypes: ['student', 'parent'],
          keywords: ['kayıt', 'kurs', 'nasıl', 'başvuru'],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          question: 'Ödeme yöntemleri nelerdir?',
          answer: 'Ödeme konusunda size yardımcı olmaktan mutluluk duyarım! Kredi kartı, banka kartı ve havale ile ödeme yapabilirsiniz. Taksit seçeneklerimiz de mevcut. Detaylı bilgi için ödeme sayfamızı ziyaret edebilirsiniz 💳',
          category: 'odeme',
          userTypes: ['student', 'parent'],
          keywords: ['ödeme', 'para', 'taksit', 'kredi kartı', 'havale'],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          question: 'Öğrenci takibi nasıl yapılır?',
          answer: 'Öğretmen panelinizden öğrencilerinizin tüm aktivitelerini görebilirsiniz! Ders katılımları, ödev durumları ve sınav sonuçları detaylı raporlarla sunuluyor. "Öğrencilerim" bölümünden kolayca takip edebilirsiniz 📊',
          category: 'genel',
          userTypes: ['teacher'],
          keywords: ['takip', 'öğrenci', 'rapor', 'panel', 'öğretmen'],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '4',
          question: 'Derslere nasıl katılırım?',
          answer: 'Derse katılmak için "Derslerim" bölümüne gidin ve ilgili dersin yanındaki "Katıl" butonuna tıklayın. Ders saati geldiğinde otomatik bildirim alacaksınız! 🎓',
          category: 'kurs',
          userTypes: ['student'],
          keywords: ['ders', 'katıl', 'katılım', 'canlı', 'zoom'],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '5',
          question: 'Şifremi unuttum ne yapmalıyım?',
          answer: 'Endişelenmeyin! Giriş sayfasındaki "Şifremi Unuttum" linkine tıklayın. Email adresinize şifre sıfırlama linki göndereceğiz. Link 1 saat geçerlidir 🔒',
          category: 'hesap',
          userTypes: ['student', 'parent', 'teacher'],
          keywords: ['şifre', 'unuttum', 'sıfırla', 'giriş'],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
};

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime()
  });
});

app.get('/api/qa-pairs', async (req, res) => {
  try {
    const data = await readData();
    const activeQAs = data.qaPairs.filter(qa => qa.isActive);
    res.json({ success: true, data: activeQAs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/qa-pairs/user-type/:userType', async (req, res) => {
  try {
    const { userType } = req.params;
    const data = await readData();
    const filteredQAs = data.qaPairs.filter(qa => 
      qa.isActive && qa.userTypes.includes(userType)
    );
    res.json({ success: true, data: filteredQAs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/chat/ask', async (req, res) => {
  try {
    const { question, userType } = req.body;
    const data = await readData();
    
    let filteredQAs = data.qaPairs.filter(qa => 
      qa.isActive && qa.userTypes.includes(userType)
    );
    
    const questionLower = question.toLowerCase();
    const scored = filteredQAs.map(qa => {
      let score = 0;
      
      qa.keywords.forEach(keyword => {
        if (questionLower.includes(keyword.toLowerCase())) {
          score += 3;
        }
      });
      
      const qaWords = qa.question.toLowerCase().split(' ');
      const inputWords = questionLower.split(' ');
      inputWords.forEach(word => {
        if (word.length > 2 && qaWords.includes(word)) {
          score += 2;
        }
      });
      
      if (questionLower === qa.question.toLowerCase()) {
        score += 10;
      }
      
      return { ...qa, score };
    });
    
    scored.sort((a, b) => b.score - a.score);
    const bestMatch = scored[0];
    
    if (bestMatch && bestMatch.score >= 3) {
      res.json({ 
        success: true, 
        answer: bestMatch.answer,
        confidence: Math.min(bestMatch.score / 10, 1),
        matchedQA: bestMatch
      });
    } else {
      res.json({ 
        success: true, 
        answer: 'Üzgünüm, bu konuda size yardımcı olamıyorum 😔 Lütfen sorunuzu farklı bir şekilde sormayı deneyin veya destek ekibimizle iletişime geçin.',
        confidence: 0,
        matchedQA: null
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const data = await readData();
    const activeQAs = data.qaPairs.filter(qa => qa.isActive);
    
    const stats = {
      total: activeQAs.length,
      byCategory: {},
      byUserType: {
        student: 0,
        parent: 0,
        teacher: 0
      }
    };
    
    activeQAs.forEach(qa => {
      stats.byCategory[qa.category] = (stats.byCategory[qa.category] || 0) + 1;
      qa.userTypes.forEach(type => {
        stats.byUserType[type]++;
      });
    });
    
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const startServer = async () => {
  try {
    await ensureDataDir();
    await readData();
    
    app.listen(PORT, () => {
      logger.info(`🚀 Odak Mentor AI Assistant API çalışıyor: http://localhost:${PORT}`);
      logger.info(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    logger.error('Sunucu başlatma hatası:', error);
    process.exit(1);
  }
};

startServer();
EOF
success "Server.js oluşturuldu"

# 4. Environment dosyası oluşturma
echo "🔧 Environment dosyası oluşturuluyor..."
cat > .env << 'EOF'
PORT=3001
NODE_ENV=production
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=http://localhost:8081,http://localhost:3000,http://192.168.1.200:8081
EOF
success "Environment dosyası oluşturuldu"

# 5. PM2 ecosystem dosyası oluşturma
echo "⚙️  PM2 ecosystem dosyası oluşturuluyor..."
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'odak-mentor-ai-backend',
    script: 'server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'development',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000,
    max_memory_restart: '1G'
  }]
};
EOF
success "PM2 ecosystem dosyası oluşturuldu"

# 6. Dependencies kurulumu
echo "📦 Dependencies kuruluyor..."
npm install
success "Dependencies kuruldu"

# 7. PM2 kurulumu
echo "⚙️  PM2 kuruluyor..."
npm install -g pm2
success "PM2 kuruldu"

# 8. Servis başlatma
echo "🚀 Servis başlatılıyor..."
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
success "Servis başlatıldı"

# 9. Kurulum özeti
echo "📊 Kurulum Özeti:"
echo "=================================================="
echo "Proje Dizini: $PROJECT_DIR"
echo "Port: 3001"
echo "PM2 Status:"
pm2 status
echo "Health Check: http://localhost:3001/api/health"
echo "=================================================="

success "Kurulum tamamlandı! 🎉"
info "Sonraki adım: Frontend entegrasyonu"