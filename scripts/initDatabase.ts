#!/usr/bin/env ts-node

/**
 * Veritabanı Başlatma Scripti (TypeScript)
 * 
 * Bu script Mock veritabanını başlatır ve örnek veriler ekler.
 * 
 * Kullanım:
 * npm run init-db
 * veya
 * npx ts-node scripts/initDatabase.ts
 */

import { cleanupTestData, initializeDatabase } from '../database/seedData';

async function main() {
  const command = process.argv[2];
  
  try {
    switch (command) {
      case 'init':
        console.log('🚀 Mock veritabanı başlatılıyor...');
        await initializeDatabase();
        console.log('✅ Mock veritabanı başarıyla başlatıldı!');
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
        console.log('🔧 Mock Veritabanı Yöneticisi');
        console.log('');
        console.log('Kullanım:');
        console.log('  npx ts-node scripts/initDatabase.ts init     - Veritabanını başlat');
        console.log('  npx ts-node scripts/initDatabase.ts cleanup  - Test verilerini temizle');
        console.log('  npx ts-node scripts/initDatabase.ts reset    - Veritabanını sıfırla');
        console.log('');
        console.log('Örnek:');
        console.log('  npm run db:init');
        console.log('  npm run db:cleanup');
        console.log('  npm run db:reset');
    }
  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

// Script doğrudan çalıştırılıyorsa main fonksiyonunu çalıştır
if (require.main === module) {
  main();
}

export { main };
