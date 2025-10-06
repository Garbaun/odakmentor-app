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

// Validation schemas
const qaSchema = Joi.object({
  question: Joi.string().min(5).max(500).required(),
  answer: Joi.string().min(10).max(2000).required(),
  category: Joi.string().valid('kurs', 'odeme', 'genel', 'hesap', 'teknik').required(),
  userTypes: Joi.array().items(Joi.string().valid('student', 'parent', 'teacher')).required(),
  keywords: Joi.array().items(Joi.string()).required()
});

const chatSchema = Joi.object({
  question: Joi.string().min(3).max(500).required(),
  userType: Joi.string().valid('student', 'parent', 'teacher').required(),
  context: Joi.string().max(1000).optional()
});

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

const writeData = async (data) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
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
    logger.info('QA pairs listelendi');
    res.json({ success: true, data: activeQAs });
  } catch (error) {
    logger.error('QA pairs listeleme hatası:', error);
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
    logger.info(`${userType} için QA pairs listelendi`);
    res.json({ success: true, data: filteredQAs });
  } catch (error) {
    logger.error('QA pairs filtreleme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/qa-pairs', async (req, res) => {
  try {
    const { error, value } = qaSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation hatası', 
        details: error.details 
      });
    }

    const data = await readData();
    const newQA = {
      id: Date.now().toString(),
      ...value,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.qaPairs.push(newQA);
    await writeData(data);
    
    logger.info('Yeni QA pair eklendi:', newQA.id);
    res.status(201).json({ success: true, data: newQA });
  } catch (error) {
    logger.error('QA pair ekleme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/qa-pairs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = qaSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation hatası', 
        details: error.details 
      });
    }

    const data = await readData();
    const index = data.qaPairs.findIndex(qa => qa.id === id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'QA pair bulunamadı' });
    }
    
    data.qaPairs[index] = {
      ...data.qaPairs[index],
      ...value,
      id,
      updatedAt: new Date().toISOString()
    };
    
    await writeData(data);
    logger.info('QA pair güncellendi:', id);
    res.json({ success: true, data: data.qaPairs[index] });
  } catch (error) {
    logger.error('QA pair güncelleme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/qa-pairs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readData();
    const index = data.qaPairs.findIndex(qa => qa.id === id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'QA pair bulunamadı' });
    }
    
    data.qaPairs[index].isActive = false;
    data.qaPairs[index].updatedAt = new Date().toISOString();
    
    await writeData(data);
    logger.info('QA pair silindi:', id);
    res.json({ success: true, message: 'QA pair başarıyla silindi' });
  } catch (error) {
    logger.error('QA pair silme hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/chat/ask', async (req, res) => {
  try {
    const { error, value } = chatSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation hatası', 
        details: error.details 
      });
    }

    const { question, userType, context } = value;
    const data = await readData();
    
    let filteredQAs = data.qaPairs.filter(qa => 
      qa.isActive && qa.userTypes.includes(userType)
    );
    
    const questionLower = question.toLowerCase();
    const scored = filteredQAs.map(qa => {
      let score = 0;
      
      // Keyword matching
      qa.keywords.forEach(keyword => {
        if (questionLower.includes(keyword.toLowerCase())) {
          score += 3;
        }
      });
      
      // Word matching
      const qaWords = qa.question.toLowerCase().split(' ');
      const inputWords = questionLower.split(' ');
      inputWords.forEach(word => {
        if (word.length > 2 && qaWords.includes(word)) {
          score += 2;
        }
      });
      
      // Exact match
      if (questionLower === qa.question.toLowerCase()) {
        score += 10;
      }
      
      return { ...qa, score };
    });
    
    scored.sort((a, b) => b.score - a.score);
    const bestMatch = scored[0];
    
    if (bestMatch && bestMatch.score >= 3) {
      logger.info('Soru yanıtlandı:', { question, userType, score: bestMatch.score });
      res.json({ 
        success: true, 
        answer: bestMatch.answer,
        confidence: Math.min(bestMatch.score / 10, 1),
        matchedQA: bestMatch
      });
    } else {
      logger.info('Soru yanıtlanamadı:', { question, userType });
      res.json({ 
        success: true, 
        answer: 'Üzgünüm, bu konuda size yardımcı olamıyorum 😔 Lütfen sorunuzu farklı bir şekilde sormayı deneyin veya destek ekibimizle iletişime geçin.',
        confidence: 0,
        matchedQA: null
      });
    }
  } catch (error) {
    logger.error('Chat hatası:', error);
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
    
    logger.info('İstatistikler listelendi');
    res.json({ success: true, data: stats });
  } catch (error) {
    logger.error('İstatistik hatası:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Sunucu hatası' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint bulunamadı' 
  });
});

const startServer = async () => {
  try {
    await ensureDataDir();
    await readData();
    
    app.listen(PORT, () => {
      logger.info(`🚀 Odak Mentor AI Assistant API çalışıyor: http://localhost:${PORT}`);
      logger.info(`📊 Health check: http://localhost:${PORT}/api/health`);
      logger.info(`📁 Veri dosyası: ${DATA_FILE}`);
    });
  } catch (error) {
    logger.error('Sunucu başlatma hatası:', error);
    process.exit(1);
  }
};

startServer();

process.on('SIGINT', () => {
  logger.info('🛑 Sunucu kapatılıyor...');
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
