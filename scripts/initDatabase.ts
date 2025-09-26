#!/usr/bin/env ts-node

/**
 * Veritabanı Başlatma Scripti
 * 
 * Bu script Firebase Firestore veritabanını başlatır ve örnek veriler ekler.
 * 
 * Kullanım:
 * npm run init-db
 * veya
 * npx ts-node scripts/initDatabase.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { initializeDatabase, cleanupTestData } from '../database/seedData';

// Firebase konfigürasyonu
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "mentor-ai-platform.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "mentor-ai-platform",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "mentor-ai-platform.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "your-app-id"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Development modunda emulator kullan
if (process.env.NODE_ENV === 'development') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('🔧 Firestore emulator bağlandı');
  } catch (error) {
    console.log('⚠️ Emulator zaten bağlı veya çalışmıyor');
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'init':
        console.log('🚀 Veritabanı başlatılıyor...');
        await initializeDatabase();
        console.log('✅ Veritabanı başarıyla başlatıldı!');
        break;
        
      case 'cleanup':
        console.log('🧹 Test verileri temizleniyor...');
        await cleanupTestData();
        console.log('✅ Test verileri temizlendi!');
        break;
        
      case 'reset':
        console.log('🔄 Veritabanı sıfırlanıyor...');
        await cleanupTestData();
        await initializeDatabase();
        console.log('✅ Veritabanı sıfırlandı!');
        break;
        
      default:
        console.log(`
📚 Odak Mentor Veritabanı Yönetimi

Kullanım:
  npm run init-db init      - Veritabanını başlat ve örnek veriler ekle
  npm run init-db cleanup   - Test verilerini temizle
  npm run init-db reset     - Veritabanını sıfırla

Örnekler:
  npm run init-db init
  npm run init-db cleanup
  npm run init-db reset
        `);
        break;
    }
  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

// Script'i çalıştır
if (require.main === module) {
  main();
}

export { main as initDatabase };
