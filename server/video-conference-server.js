const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
// Ensure env vars are loaded from a valid .env (prefer server/.env)
const fs = require('fs');
const mainDir = path.dirname((require.main && require.main.filename) || process.cwd());
const envPaths = [
  path.join(mainDir, '.env'),
  path.join(process.cwd(), '.env')
];
const foundEnv = envPaths.find((p) => fs.existsSync(p));
require('dotenv').config(foundEnv ? { path: foundEnv } : undefined);
const USE_MOCK = process.env.MOCK_DB === '1';

// CORS yapılandırması
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "https://odakmentor.com"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://odakmentor.com'
  ],
  credentials: true
}));
app.use(express.json());

// Static dosyaları serve et (docs klasörü)
app.use(express.static(path.join(__dirname, '../docs')));

// Oda yönetimi
const rooms = new Map();

// Socket.IO bağlantı yönetimi
io.on('connection', (socket) => {
  console.log('Yeni kullanıcı bağlandı:', socket.id);

  // Odaya katılma
  socket.on('join-room', (data) => {
    const { roomId, userId, userName, userRole } = data;
    
    console.log(`Kullanıcı ${userName} (${userRole}) odaya katıldı: ${roomId}`);
    
    // Socket'i odaya ekle
    socket.join(roomId);
    socket.roomId = roomId;
    socket.userId = userId;
    socket.userName = userName;
    socket.userRole = userRole;

    // Oda bilgilerini güncelle
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        participants: new Map(),
        createdAt: new Date(),
      });
    }

    const room = rooms.get(roomId);
    room.participants.set(userId, {
      id: userId,
      name: userName,
      role: userRole,
      socketId: socket.id,
      isVideoEnabled: true,
      isAudioEnabled: true,
      isScreenSharing: false,
      joinedAt: new Date(),
    });

    // Diğer kullanıcılara bildir
    socket.to(roomId).emit('user-joined', {
      userId,
      userName,
      userRole,
    });

    // Katılımcı listesini güncelle
    updateParticipantsList(roomId);
  });

  // WebRTC offer
  socket.on('offer', (data) => {
    const { to, offer } = data;
    socket.to(to).emit('offer', {
      from: socket.userId,
      offer: offer,
    });
  });

  // WebRTC answer
  socket.on('answer', (data) => {
    const { to, answer } = data;
    socket.to(to).emit('answer', {
      from: socket.userId,
      answer: answer,
    });
  });

  // ICE candidate
  socket.on('ice-candidate', (data) => {
    const { to, candidate } = data;
    socket.to(to).emit('ice-candidate', {
      from: socket.userId,
      candidate: candidate,
    });
  });

  // Mesaj gönderme
  socket.on('message', (data) => {
    const { roomId, text, timestamp } = data;
    
    const message = {
      from: socket.userName || 'Bilinmeyen',
      text: text,
      timestamp: timestamp || Date.now(),
    };

    // Oda içindeki tüm kullanıcılara mesajı gönder
    io.to(roomId).emit('message', message);
    
    console.log(`Mesaj gönderildi (${roomId}): ${socket.userName}: ${text}`);
  });

  // Video/Audio durumu güncelleme
  socket.on('update-media-state', (data) => {
    const { isVideoEnabled, isAudioEnabled, isScreenSharing } = data;
    
    if (socket.roomId && socket.userId) {
      const room = rooms.get(socket.roomId);
      if (room && room.participants.has(socket.userId)) {
        const participant = room.participants.get(socket.userId);
        participant.isVideoEnabled = isVideoEnabled;
        participant.isAudioEnabled = isAudioEnabled;
        participant.isScreenSharing = isScreenSharing;
        
        // Diğer kullanıcılara bildir
        socket.to(socket.roomId).emit('participant-media-updated', {
          userId: socket.userId,
          isVideoEnabled,
          isAudioEnabled,
          isScreenSharing,
        });
      }
    }
  });

  // Bağlantı kesilme
  socket.on('disconnect', () => {
    console.log('Kullanıcı ayrıldı:', socket.id);
    
    if (socket.roomId && socket.userId) {
      const room = rooms.get(socket.roomId);
      if (room && room.participants.has(socket.userId)) {
        room.participants.delete(socket.userId);
        
        // Diğer kullanıcılara bildir
        socket.to(socket.roomId).emit('user-left', {
          userId: socket.userId,
        });

        // Katılımcı listesini güncelle
        updateParticipantsList(socket.roomId);

        // Boş odaları temizle
        if (room.participants.size === 0) {
          rooms.delete(socket.roomId);
          console.log(`Oda silindi: ${socket.roomId}`);
        }
      }
    }
  });

  // Hata yönetimi
  socket.on('error', (error) => {
    console.error('Socket hatası:', error);
  });
});

// Katılımcı listesini güncelleme fonksiyonu
function updateParticipantsList(roomId) {
  const room = rooms.get(roomId);
  if (room) {
    const participants = Array.from(room.participants.values()).map(p => ({
      id: p.id,
      name: p.name,
      role: p.role,
      isVideoEnabled: p.isVideoEnabled,
      isAudioEnabled: p.isAudioEnabled,
      isScreenSharing: p.isScreenSharing,
    }));

    io.to(roomId).emit('participants-update', participants);
  }
}

// API endpoints
// --- AUTH API (login/register/me/reset-password) ---
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = new Pool({
  host: process.env.DB_HOST || '192.168.1.200',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'odakmentor_db',
  user: process.env.DB_USER || 'odakmentor',
  password: process.env.DB_PASSWORD || 'OdakMentor2024!DB',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://odakmentor.com';

// Mail servisi
let mailService = null;
try {
  mailService = require('./mailService');
} catch (e) {
  console.warn('Mail servisi yüklenemedi, e-posta gönderimi devre dışı:', e?.message || e);
}

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

async function findUserByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0] || null;
}

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role = 'student' } = req.body || {};
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ success: false, error: 'Eksik alanlar' });
    }
    if (USE_MOCK) {
      const mockUser = {
        id: 1,
        email,
        first_name: firstName,
        last_name: lastName,
        role,
      };
      const token = signToken({ sub: mockUser.id, role: mockUser.role });
      return res.json({ success: true, user: mockUser, token });
    }
    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ success: false, error: 'E-posta zaten kayıtlı' });

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const ures = await client.query(
        `INSERT INTO users (email, first_name, last_name, role, status, is_email_verified, is_phone_verified, preferences, subscription)
         VALUES ($1,$2,$3,$4,'pending',false,false,'{}','{}') RETURNING *`,
        [email, firstName, lastName, role]
      );
      const user = ures.rows[0];
      const hash = await bcrypt.hash(password, 10);
      await client.query(
        `INSERT INTO passwords (user_id, password_hash) VALUES ($1,$2)
         ON CONFLICT (user_id) DO UPDATE SET password_hash=$2, updated_at=NOW()`,
        [user.id, hash]
      );
      await client.query('COMMIT');

      // E-posta doğrulama token'ı üret
      const emailVerifyToken = jwt.sign({ sub: user.id, type: 'verify-email' }, JWT_SECRET, { expiresIn: '24h' });

      // Mail gönderimi (opsiyonel başarısız olabilir, kullanıcıya bilgi ver)
      if (mailService && mailService.sendEmailVerification) {
        mailService.sendEmailVerification(email, emailVerifyToken, firstName).catch((e) => {
          console.warn('Email verification send failed:', e?.message || e);
        });
      }

      const token = signToken({ sub: user.id, role: user.role });
      res.json({
        success: true,
        user: { ...user, is_email_verified: false, status: 'pending' },
        token,
        verifyEmail: {
          sent: !!(mailService && mailService.sendEmailVerification),
          link: `${FRONTEND_URL}/verify-email?token=${emailVerifyToken}`
        }
      });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('register error', error);
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ success: false, error: 'Eksik alanlar' });
    if (USE_MOCK) {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@odakmentor.com';
      const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
      if (email === adminEmail && password === adminPass) {
        const mockUser = { id: 1, email: adminEmail, first_name: 'Admin', last_name: 'User', role: 'admin' };
        const token = signToken({ sub: mockUser.id, role: mockUser.role });
        return res.json({ success: true, user: mockUser, token });
      }
      return res.status(401).json({ success: false, error: 'Geçersiz bilgiler' });
    }
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ success: false, error: 'Geçersiz bilgiler' });
    const ph = await pool.query('SELECT password_hash FROM passwords WHERE user_id = $1', [user.id]);
    const hash = ph.rows[0]?.password_hash;
    if (!hash) return res.status(401).json({ success: false, error: 'Şifre bulunamadı' });
    const ok = await bcrypt.compare(password, hash);
    if (!ok) return res.status(401).json({ success: false, error: 'Geçersiz bilgiler' });
    await pool.query('UPDATE users SET last_login_at = NOW(), login_count = login_count + 1 WHERE id=$1', [user.id]);
    const token = signToken({ sub: user.id, role: user.role });
    res.json({ success: true, user, token });
  } catch (error) {
    console.error('login error', error);
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, error: 'Token yok' });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (USE_MOCK) {
      // Minimal mock user derived from token
      return res.json({ success: true, user: { id: decoded.sub || 1, email: 'admin@odakmentor.com', first_name: 'Admin', last_name: 'User', role: decoded.role || 'admin' } });
    }
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.sub]);
    const user = rows[0];
    if (!user) return res.status(404).json({ success: false, error: 'Kullanıcı bulunamadı' });
    res.json({ success: true, user });
  } catch (_e) {
    res.status(401).json({ success: false, error: 'Yetkisiz' });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  // Gelecekte email ile reset akışı
  res.json({ success: true });
});

// E-posta doğrulama endpoint'i
app.post('/api/auth/verify-email', async (req, res) => {
  try {
    const token = req.body?.token || req.query?.token;
    if (!token) return res.status(400).json({ success: false, error: 'Token gerekli' });
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (_e) {
      return res.status(400).json({ success: false, error: 'Geçersiz veya süresi dolmuş token' });
    }
    if (!decoded || decoded.type !== 'verify-email' || !decoded.sub) {
      return res.status(400).json({ success: false, error: 'Geçersiz token' });
    }
    if (USE_MOCK) {
      return res.json({ success: true });
    }
    const { rowCount } = await pool.query(
      `UPDATE users SET is_email_verified = true, status = CASE WHEN status='pending' THEN 'active' ELSE status END, updated_at = NOW() WHERE id = $1`,
      [decoded.sub]
    );
    if (rowCount === 0) return res.status(404).json({ success: false, error: 'Kullanıcı bulunamadı' });
    res.json({ success: true });
  } catch (e) {
    console.error('verify-email error', e);
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

// ---- ADMIN GUARD & ADMIN ENDPOINTS ----
function requireAdmin(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, error: 'Yetkisiz' });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Erişim yasak' });
    }
    req.user = decoded;
    next();
  } catch (_e) {
    return res.status(401).json({ success: false, error: 'Yetkisiz' });
  }
}

function mapUserRow(row) {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    role: row.role,
    status: row.status,
    createdAt: row.created_at,
    lastLoginAt: row.last_login_at,
  };
}

app.get('/api/admin/users', requireAdmin, async (req, res) => {
  try {
    if (USE_MOCK) {
      return res.json([]);
    }
    const { rows } = await pool.query(
      `SELECT id,email,first_name,last_name,role,status,created_at,last_login_at FROM users ORDER BY created_at DESC`
    );
    res.json(rows.map(mapUserRow));
  } catch (_e) {
    console.error('admin/users error', _e);
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    if (USE_MOCK) {
      return res.json({
        users: { totalStudents: 0, totalTeachers: 0, pendingStudents: 0, pendingTeachers: 0 },
        courses: { total: 0, active: 0 },
      });
    }
    const totals = await pool.query(
      `SELECT 
         SUM(CASE WHEN role='student' THEN 1 ELSE 0 END)::int as total_students,
         SUM(CASE WHEN role='teacher' THEN 1 ELSE 0 END)::int as total_teachers,
         SUM(CASE WHEN role='student' AND status<>'active' THEN 1 ELSE 0 END)::int as pending_students,
         SUM(CASE WHEN role='teacher' AND status<>'active' THEN 1 ELSE 0 END)::int as pending_teachers
       FROM users`
    );

    // Kurs ve kayıtlar opsiyonel; tablo yoksa 0 kabul ediyoruz
    let totalCourses = 0, activeCourses = 0;
    try {
      const crs = await pool.query(`SELECT COUNT(*)::int as c, SUM(CASE WHEN is_active THEN 1 ELSE 0 END)::int as a FROM courses`);
      totalCourses = crs.rows[0]?.c || 0;
      activeCourses = crs.rows[0]?.a || 0;
    } catch {}

    res.json({
      users: {
        totalStudents: totals.rows[0]?.total_students || 0,
        totalTeachers: totals.rows[0]?.total_teachers || 0,
        pendingStudents: totals.rows[0]?.pending_students || 0,
        pendingTeachers: totals.rows[0]?.pending_teachers || 0,
      },
      courses: { total: totalCourses, active: activeCourses },
    });
  } catch (e) {
    console.error('admin/stats error', e);
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

app.get('/api/blogs', requireAdmin, async (req, res) => {
  try {
    if (USE_MOCK) {
      return res.json([]);
    }
    const { rows } = await pool.query(`SELECT * FROM blog_posts ORDER BY created_at DESC`);
    res.json(rows);
  } catch (_e) {
    res.json([]);
  }
});

app.patch('/api/admin/users/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ success: false, error: 'Geçersiz id' });
    const { status, role } = req.body || {};
    if (USE_MOCK) {
      return res.json({ success: true, user: { id, status: status || 'active', role: role || 'student' } });
    }
    const fields = [];
    const values = [];
    let p = 1;
    if (status) { fields.push(`status = $${p++}`); values.push(status); }
    if (role) { fields.push(`role = $${p++}`); values.push(role); }
    if (fields.length === 0) return res.status(400).json({ success: false, error: 'Güncellenecek alan yok' });
    values.push(id);
    const q = `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${p} RETURNING id,email,first_name,last_name,role,status,created_at,last_login_at`;
    const { rows } = await pool.query(q, values);
    if (!rows[0]) return res.status(404).json({ success: false, error: 'Kullanıcı bulunamadı' });
    res.json({ success: true, user: mapUserRow(rows[0]) });
  } catch (e) {
    console.error('admin/users PATCH error', e);
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

// ---- AUTH MIDDLEWARE (GENEL) ----
function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, error: 'Yetkisiz' });
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) return res.status(401).json({ success: false, error: 'Yetkisiz' });
    req.user = decoded; // { sub, role }
    next();
  } catch (_e) {
    return res.status(401).json({ success: false, error: 'Yetkisiz' });
  }
}

// ---- USER DASHBOARD ENDPOINTS ----
app.get('/api/user/stats', requireAuth, async (req, res) => {
  try {
    const userId = req.user.sub;

    // Toplam çalışma süresi ve tamamlanan dersler
    let totalMinutes = 0;
    let completedLessons = 0;
    try {
      const agg = await pool.query(
        `SELECT COALESCE(SUM(time_spent),0)::int as total_minutes,
                SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END)::int as completed
         FROM student_progress WHERE student_id = $1`,
        [userId]
      );
      totalMinutes = agg.rows[0]?.total_minutes || 0;
      completedLessons = agg.rows[0]?.completed || 0;
    } catch {}

    // Streak hesapla (son 30 günde ardışık günler)
    let currentStreak = 0;
    try {
      const datesRes = await pool.query(
        `SELECT DISTINCT DATE(created_at) as d
         FROM student_progress
         WHERE student_id = $1
         ORDER BY d DESC
         LIMIT 30`,
        [userId]
      );
      const dates = datesRes.rows.map(r => new Date(r.d));
      const today = new Date(); today.setHours(0,0,0,0);
      let day = new Date(today);
      let streak = 0;
      for (let i = 0; i < 30; i++) {
        const match = dates.find(dt => dt.getTime() === day.getTime());
        if (match) {
          streak += 1;
          day.setDate(day.getDate() - 1);
        } else {
          // Eğer bugün yoksa ama geçmişte var, yarıda kes
          if (i === 0) {
            // bugün yoksa, dünlerden ardışık yakalamaya çalış
            day.setDate(today.getDate() - 1);
            const yesterdayMatch = dates.find(dt => dt.getTime() === day.getTime());
            if (!yesterdayMatch) break;
            // dünden itibaren say
            streak = 1;
            day.setDate(day.getDate() - 1);
            // devamını dış döngüde devam ettiremeyiz; basit hesap yeterli
          }
          break;
        }
      }
      currentStreak = streak;
    } catch {}

    res.json({
      success: true,
      totalMinutes,
      completedLessons,
      currentStreak,
    });
  } catch (_e) {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

app.get('/api/user/activity', requireAuth, async (req, res) => {
  try {
    const userId = req.user.sub;
    try {
      const { rows } = await pool.query(
        `SELECT sp.id, sp.status, sp.score, sp.time_spent, sp.created_at,
                c.title as course_title
         FROM student_progress sp
         LEFT JOIN courses c ON c.id = sp.course_id
         WHERE sp.student_id = $1
         ORDER BY sp.created_at DESC
         LIMIT 10`,
        [userId]
      );
      const items = rows.map(r => ({
        id: r.id,
        title: r.course_title || 'İlerleme kaydı',
        status: r.status,
        timeSpent: r.time_spent,
        createdAt: r.created_at,
      }));
      res.json({ success: true, items });
    } catch {
      res.json({ success: true, items: [] });
    }
  } catch (_e) {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});

// ---- TEACHER DASHBOARD ----
app.get('/api/teacher/stats', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Erişim yasak' });
    }
    const teacherId = req.user.sub;
    let totalCourses = 0, activeCourses = 0, totalEnrollments = 0, activeEnrollments = 0;
    try {
      const crs = await pool.query(`SELECT COUNT(*)::int as total, SUM(CASE WHEN is_active THEN 1 ELSE 0 END)::int as active FROM courses WHERE teacher_id = $1`, [teacherId]);
      totalCourses = crs.rows[0]?.total || 0;
      activeCourses = crs.rows[0]?.active || 0;
    } catch {}
    try {
      const enr = await pool.query(
        `SELECT COUNT(*)::int as total,
                SUM(CASE WHEN status='active' THEN 1 ELSE 0 END)::int as active
         FROM enrollments e JOIN courses c ON c.id=e.course_id
         WHERE c.teacher_id=$1`, [teacherId]
      );
      totalEnrollments = enr.rows[0]?.total || 0;
      activeEnrollments = enr.rows[0]?.active || 0;
    } catch {}
    res.json({ success: true, totalCourses, activeCourses, totalEnrollments, activeEnrollments });
  } catch (_e) {
    res.status(500).json({ success: false, error: 'Sunucu hatası' });
  }
});
app.get('/api/rooms', (req, res) => {
  const roomsList = Array.from(rooms.entries()).map(([id, room]) => ({
    id,
    participantCount: room.participants.size,
    createdAt: room.createdAt,
  }));
  
  res.json(roomsList);
});

app.get('/api/rooms/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = rooms.get(roomId);
  
  if (!room) {
    return res.status(404).json({ error: 'Oda bulunamadı' });
  }

  const participants = Array.from(room.participants.values()).map(p => ({
    id: p.id,
    name: p.name,
    role: p.role,
    isVideoEnabled: p.isVideoEnabled,
    isAudioEnabled: p.isAudioEnabled,
    isScreenSharing: p.isScreenSharing,
    joinedAt: p.joinedAt,
  }));

  res.json({
    id: roomId,
    participants,
    participantCount: room.participants.size,
    createdAt: room.createdAt,
  });
});

// Creator Panel API Endpoints
app.post('/api/auth/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Mock admin kullanıcı kontrolü
    if (email === 'admin@odakmentor.com' && password === 'admin123') {
      res.json({
        success: true,
        message: 'Giriş başarılı',
        user: {
          id: 1,
          email: 'admin@odakmentor.com',
          name: 'Admin User',
          role: 'admin'
        }
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Geçersiz e-posta veya şifre'
      });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      error: 'Sunucu hatası'
    });
  }
});

app.get('/api/admin/statistics', async (req, res) => {
  try {
    // Mock istatistikler
    const statistics = {
      totalUsers: 150,
      totalStudents: 120,
      totalTeachers: 25,
      totalBlogs: 45,
      activeVideoRooms: rooms.size,
      totalVideoSessions: 300
    };
    
    res.json({
      success: true,
      statistics
    });
  } catch (error) {
    console.error('Statistics error:', error);
    res.status(500).json({
      success: false,
      error: 'Sunucu hatası'
    });
  }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    // Mock kullanıcı listesi
    const users = [
      {
        id: 1,
        email: 'student1@example.com',
        name: 'Ahmet Yılmaz',
        role: 'student',
        status: 'active',
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        email: 'teacher1@example.com',
        name: 'Ayşe Demir',
        role: 'teacher',
        status: 'active',
        createdAt: '2024-01-10'
      },
      {
        id: 3,
        email: 'student2@example.com',
        name: 'Mehmet Kaya',
        role: 'student',
        status: 'pending',
        createdAt: '2024-01-20'
      }
    ];
    
    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Users error:', error);
    res.status(500).json({
      success: false,
      error: 'Sunucu hatası'
    });
  }
});

app.post('/api/admin/users/:userId/activate', async (req, res) => {
  try {
    const { userId } = req.params;
    
    res.json({
      success: true,
      message: 'Kullanıcı aktifleştirildi'
    });
  } catch (error) {
    console.error('Activate user error:', error);
    res.status(500).json({
      success: false,
      error: 'Sunucu hatası'
    });
  }
});

app.post('/api/admin/users/:userId/deactivate', async (req, res) => {
  try {
    const { userId } = req.params;
    
    res.json({
      success: true,
      message: 'Kullanıcı pasifleştirildi'
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({
      success: false,
      error: 'Sunucu hatası'
    });
  }
});

app.post('/api/admin/users/:userId/delete', async (req, res) => {
  try {
    const { userId } = req.params;
    
    res.json({
      success: true,
      message: 'Kullanıcı silindi'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Sunucu hatası'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    activeRooms: rooms.size,
    totalConnections: io.engine.clientsCount,
  });
});

// Port ve başlatma
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Video Conference Server çalışıyor: http://localhost:${PORT}`);
  console.log(`WebSocket bağlantıları: ws://localhost:${PORT}`);
  console.log(`API endpoints: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM alındı, sunucu kapatılıyor...');
  server.close(() => {
    console.log('Sunucu kapatıldı');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT alındı, sunucu kapatılıyor...');
  server.close(() => {
    console.log('Sunucu kapatıldı');
    process.exit(0);
  });
});

// ---- OPTIONAL: ADMIN BOOTSTRAP ON START ----
(async function ensureAdminUser() {
  try {
    if (process.env.ADMIN_BOOTSTRAP !== '1') return;
    const email = process.env.ADMIN_EMAIL || 'admin@odakmentor.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const firstName = process.env.ADMIN_FIRST || 'Admin';
    const lastName = process.env.ADMIN_LAST || 'User';

    const existing = await findUserByEmail(email);
    if (existing) {
      console.log(`Admin bootstrap: kullanıcı zaten var (${email})`);
      return;
    }
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const ures = await client.query(
        `INSERT INTO users (email, first_name, last_name, role, status, is_email_verified, is_phone_verified, preferences, subscription)
         VALUES ($1,$2,$3,'admin','active',true,false,'{}','{}') RETURNING *`,
        [email, firstName, lastName]
      );
      const user = ures.rows[0];
      const hash = await bcrypt.hash(password, 10);
      await client.query(
        `INSERT INTO passwords (user_id, password_hash) VALUES ($1,$2)
         ON CONFLICT (user_id) DO UPDATE SET password_hash=$2, updated_at=NOW()`,
        [user.id, hash]
      );
      await client.query('COMMIT');
      console.log(`Admin bootstrap: oluşturuldu (${email})`);
    } catch (e) {
      await client.query('ROLLBACK');
      console.error('Admin bootstrap hatası', e);
    } finally {
      client.release();
    }
  } catch (e) {
    console.error('Admin bootstrap başlatılamadı', e);
  }
})();
