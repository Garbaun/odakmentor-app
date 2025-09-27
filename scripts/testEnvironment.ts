/**
 * Test Environment Manager
 * 
 * Mock veritabanı ile test ortamını yönetir.
 * 
 * Kullanım:
 * npx ts-node scripts/testEnvironment.ts
 */

import { existsSync, mkdirSync, writeFileSync } from 'fs';

// Test ortamı konfigürasyonu - Mock Database
const TEST_CONFIG = {
  mockDatabase: {
    enabled: true,
    clearOnStart: true
  },
  testData: {
    outputDir: './test-data',
    sampleSize: 100
  }
};

class TestEnvironment {
  private processes: any[] = [];

  async setup(): Promise<void> {
    console.log('🚀 Test ortamı kuruluyor...\n');
    
    try {
      // Test klasörlerini oluştur
      await this.createDirectories();
      
      // Test veritabanı konfigürasyonunu oluştur
      await this.createTestConfig();
      
      // Mock Database'i hazırla
      await this.setupMockDatabase();
      
      // Test verilerini oluştur
      await this.generateTestData();
      
      console.log('\n✅ Test ortamı başarıyla kuruldu!');
      console.log('📁 Test verileri: ./test-data/');
      console.log('🧪 Mock Database: Hazır');
      
    } catch (error) {
      console.error('❌ Test ortamı kurulum hatası:', error);
      throw error;
    }
  }

  private async createDirectories(): Promise<void> {
    console.log('📁 Test klasörleri oluşturuluyor...');
    
    const directories = [
      TEST_CONFIG.testData.outputDir,
      `${TEST_CONFIG.testData.outputDir}/mock`,
      `${TEST_CONFIG.testData.outputDir}/performance`
    ];
    
    for (const dir of directories) {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
        console.log(`  ✅ ${dir} oluşturuldu`);
      } else {
        console.log(`  ℹ️  ${dir} zaten mevcut`);
      }
    }
  }

  private async createTestConfig(): Promise<void> {
    console.log('⚙️  Test konfigürasyonu oluşturuluyor...');
    
    // Mock Database konfigürasyonu
    const mockConfig = {
      enabled: TEST_CONFIG.mockDatabase.enabled,
      clearOnStart: TEST_CONFIG.mockDatabase.clearOnStart,
      type: 'mock'
    };
    
    writeFileSync(
      './test-data/mock/config.json',
      JSON.stringify(mockConfig, null, 2)
    );
    
    // Test ortamı değişkenleri
    const envVars = {
      NODE_ENV: 'test',
      MOCK_DATABASE: 'true',
      TEST_MODE: 'true'
    };
    
    const envContent = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    writeFileSync('./test-data/.env', envContent);
    
    console.log('  ✅ Test konfigürasyonu oluşturuldu');
  }

  private async setupMockDatabase(): Promise<void> {
    console.log('🧪 Mock veritabanı hazırlanıyor...');
    
    try {
      // Mock database'i test et
      const { testConnection } = await import('../services/mockDatabaseService');
      await testConnection();
      console.log('  ✅ Mock veritabanı hazır');
    } catch (error) {
      console.log('  ⚠️  Mock veritabanı hazırlanamadı:', error);
    }
  }

  private async generateTestData(): Promise<void> {
    console.log('📊 Test verileri oluşturuluyor...');
    
    try {
      // Sample data oluştur
      const sampleData = {
        users: [
          {
            id: 1,
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'student',
            status: 'active'
          }
        ],
        courses: [
          {
            id: 1,
            title: 'Test Course',
            description: 'Test course description',
            teacherId: 1
          }
        ]
      };
      
      writeFileSync(
        './test-data/sample-data.json',
        JSON.stringify(sampleData, null, 2)
      );
      
      // Performance test data
      const performanceData = {
        testRuns: [],
        metrics: {
          averageResponseTime: 0,
          totalTests: 0,
          passedTests: 0,
          failedTests: 0
        }
      };
      
      writeFileSync(
        './test-data/performance/performance-data.json',
        JSON.stringify(performanceData, null, 2)
      );
      
      console.log('  ✅ Test verileri oluşturuldu');
      
    } catch (error) {
      console.log('  ⚠️  Test verileri oluşturulamadı:', error);
    }
  }

  async status(): Promise<void> {
    console.log('📊 Test Ortamı Durumu\n');
    
    // Mock Database durumu
    try {
      const { testConnection } = await import('../services/mockDatabaseService');
      await testConnection();
      console.log('🧪 Mock Database: ✅ Bağlı');
    } catch (error) {
      console.log('🧪 Mock Database: ❌ Bağlantı yok');
    }
    
    // Test verileri durumu
    const testDataExists = existsSync('./test-data/sample-data.json');
    const perfDataExists = existsSync('./test-data/performance/performance-data.json');
    
    console.log(`📁 Test Verileri: ${testDataExists ? '✅' : '❌'}`);
    console.log(`📈 Performans Verileri: ${perfDataExists ? '✅' : '❌'}`);
    
    // Test klasörü boyutu
    try {
      const { readdirSync, statSync } = await import('fs');
      const testDir = './test-data';
      if (existsSync(testDir)) {
        const files = readdirSync(testDir, { recursive: true });
        const totalSize = files.reduce((size, file) => {
          try {
            return size + statSync(`${testDir}/${file}`).size;
          } catch {
            return size;
          }
        }, 0);
        console.log(`💾 Toplam Boyut: ${(totalSize / 1024).toFixed(2)} KB`);
      }
    } catch (error) {
      console.log('💾 Boyut hesaplanamadı');
    }
  }

  async cleanup(): Promise<void> {
    console.log('🧹 Test ortamı temizleniyor...\n');
    
    try {
      // Mock database'i temizle
      const { clearDatabase } = await import('../services/mockDatabaseService');
      await clearDatabase();
      console.log('✅ Mock veritabanı temizlendi');
      
      // Test verilerini temizle
      const { rmSync } = await import('fs');
      if (existsSync('./test-data')) {
        rmSync('./test-data', { recursive: true, force: true });
        console.log('✅ Test verileri temizlendi');
      }
      
      console.log('\n🎉 Test ortamı başarıyla temizlendi!');
      
    } catch (error) {
      console.error('❌ Temizleme hatası:', error);
      throw error;
    }
  }
}

// CLI interface
async function main() {
  const command = process.argv[2];
  const testEnv = new TestEnvironment();
  
  switch (command) {
    case 'setup':
      await testEnv.setup();
      break;
    case 'status':
      await testEnv.status();
      break;
    case 'cleanup':
      await testEnv.cleanup();
      break;
    default:
      console.log('🔧 Test Environment Manager');
      console.log('');
      console.log('Kullanım:');
      console.log('  npx ts-node scripts/testEnvironment.ts setup   - Test ortamını kur');
      console.log('  npx ts-node scripts/testEnvironment.ts status  - Durumu kontrol et');
      console.log('  npx ts-node scripts/testEnvironment.ts cleanup - Temizle');
      console.log('');
      console.log('Örnek:');
      console.log('  npm run test:env:setup');
      console.log('  npm run test:env:status');
      console.log('  npm run test:env:cleanup');
  }
}

// Script doğrudan çalıştırılıyorsa main fonksiyonunu çalıştır
if (require.main === module) {
  main().catch(console.error);
}

export { TestEnvironment };
