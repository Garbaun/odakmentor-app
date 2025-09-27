const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

// CORS yapılandırması
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "https://odakmentor.com"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());

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
const PORT = process.env.PORT || 3001;

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
