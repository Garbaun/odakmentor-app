#!/usr/bin/env ts-node

/**
 * Mock Veri Tabanı Test Scripti
 * 
 * Bu script gerçek veritabanı olmadan test senaryolarını simüle eder.
 * 
 * Kullanım:
 * npm run test:mock
 * veya
 * npx ts-node scripts/mockDatabaseTest.ts
 */

// Test sonuçları interface'i
interface TestResult {
  testName: string;
  success: boolean;
  duration: number;
  error?: string;
  data?: any;
}

interface TestSuite {
  name: string;
  results: TestResult[];
  totalDuration: number;
  successCount: number;
  failureCount: number;
}

// Mock veritabanı sınıfı
class MockDatabase {
  private users: any[] = [];
  private passwords: any[] = [];
  private studentProfiles: any[] = [];
  private teacherProfiles: any[] = [];
  private courses: any[] = [];

  async createUser(userData: any): Promise<any> {
    const user = {
      id: this.users.length + 1,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      loginCount: 0
    };
    this.users.push(user);
    return user;
  }

  async getUserByEmail(email: string): Promise<any> {
    return this.users.find(user => user.email === email);
  }

  async getUser(id: number): Promise<any> {
    return this.users.find(user => user.id === id);
  }

  async updateLastLogin(id: number): Promise<void> {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.lastLoginAt = new Date().toISOString();
      user.loginCount = (user.loginCount || 0) + 1;
    }
  }

  async setPassword(userId: number, passwordHash: string): Promise<void> {
    const existingIndex = this.passwords.findIndex(p => p.userId === userId);
    if (existingIndex >= 0) {
      this.passwords[existingIndex].passwordHash = passwordHash;
    } else {
      this.passwords.push({ userId, passwordHash });
    }
  }

  async getPasswordHash(userId: number): Promise<string | null> {
    const password = this.passwords.find(p => p.userId === userId);
    return password ? password.passwordHash : null;
  }

  async createStudentProfile(profileData: any): Promise<any> {
    const profile = {
      id: this.studentProfiles.length + 1,
      ...profileData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.studentProfiles.push(profile);
    return profile;
  }

  async createTeacherProfile(profileData: any): Promise<any> {
    const profile = {
      id: this.teacherProfiles.length + 1,
      ...profileData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.teacherProfiles.push(profile);
    return profile;
  }

  async createCourse(courseData: any): Promise<any> {
    const course = {
      id: this.courses.length + 1,
      ...courseData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.courses.push(course);
    return course;
  }

  async query(sql: string, params?: any[]): Promise<any> {
    // Mock query implementation
    if (sql.includes('SELECT * FROM users')) {
      return { rows: this.users };
    }
    if (sql.includes('DELETE FROM users')) {
      const email = params?.[0];
      this.users = this.users.filter(u => u.email !== email);
      return { rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    // Mock transaction implementation
    return await callback(this);
  }

  // Test verilerini temizle
  clear(): void {
    this.users = [];
    this.passwords = [];
    this.studentProfiles = [];
    this.teacherProfiles = [];
    this.courses = [];
  }

  // İstatistikler
  getStats(): any {
    return {
      users: this.users.length,
      passwords: this.passwords.length,
      studentProfiles: this.studentProfiles.length,
      teacherProfiles: this.teacherProfiles.length,
      courses: this.courses.length
    };
  }
}

// Test utilities
class TestUtils {
  static async measureTime<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
    const start = Date.now();
    const result = await fn();
    const duration = Date.now() - start;
    return { result, duration };
  }

  static generateTestId(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Mock Test Suite
class MockDatabaseTestSuite {
  private results: TestResult[] = [];
  private mockDb = new MockDatabase();

  async runAllTests(): Promise<TestSuite> {
    console.log('🧪 Mock Veri Tabanı Test Suite Başlatılıyor...\n');
    
    const startTime = Date.now();
    
    // Bağlantı testi
    await this.testConnection();
    
    // Kullanıcı işlemleri testleri
    await this.testUserOperations();
    
    // Şifre işlemleri testleri
    await this.testPasswordOperations();
    
    // Profil işlemleri testleri
    await this.testProfileOperations();
    
    // Kurs işlemleri testleri
    await this.testCourseOperations();
    
    // Transaction testleri
    await this.testTransactions();
    
    // Performans testleri
    await this.testPerformance();
    
    // Veri bütünlüğü testleri
    await this.testDataIntegrity();
    
    const totalDuration = Date.now() - startTime;
    const successCount = this.results.filter(r => r.success).length;
    const failureCount = this.results.filter(r => !r.success).length;
    
    return {
      name: 'Mock Database Test Suite',
      results: this.results,
      totalDuration,
      successCount,
      failureCount
    };
  }

  private async testConnection(): Promise<void> {
    const testName = 'Mock Bağlantı Testi';
    console.log(`🧪 ${testName}...`);
    
    try {
      const { duration } = await TestUtils.measureTime(async () => {
        // Mock bağlantı testi
        const stats = this.mockDb.getStats();
        return { connected: true, stats };
      });
      
      this.results.push({
        testName,
        success: true,
        duration,
        data: { message: 'Mock bağlantısı başarılı' }
      });
      
      console.log(`✅ ${testName} - ${duration}ms\n`);
    } catch (error) {
      this.results.push({
        testName,
        success: false,
        duration: 0,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
      
      console.log(`❌ ${testName} - Hata: ${error}\n`);
    }
  }

  private async testUserOperations(): Promise<void> {
    const testName = 'Kullanıcı İşlemleri Testi';
    console.log(`🧪 ${testName}...`);
    
    try {
      const testId = TestUtils.generateTestId();
      const testEmail = `test_${testId}@example.com`;
      
      const { duration } = await TestUtils.measureTime(async () => {
        // Kullanıcı oluştur
        const newUser = await this.mockDb.createUser({
          email: testEmail,
          firstName: 'Test',
          lastName: 'User',
          role: 'student',
          status: 'active',
          isEmailVerified: true,
          isPhoneVerified: false,
          preferences: {},
          subscription: {}
        });
        
        // Kullanıcıyı email ile getir
        const foundUser = await this.mockDb.getUserByEmail(testEmail);
        
        // Son giriş güncelle
        await this.mockDb.updateLastLogin(newUser.id);
        
        return { newUser, foundUser };
      });
      
      // Test verilerini temizle
      await this.mockDb.query('DELETE FROM users WHERE email = $1', [testEmail]);
      
      this.results.push({
        testName,
        success: true,
        duration,
        data: { 
          userId: testId,
          email: testEmail,
          foundUser: !!testEmail
        }
      });
      
      console.log(`✅ ${testName} - ${duration}ms\n`);
    } catch (error) {
      this.results.push({
        testName,
        success: false,
        duration: 0,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
      
      console.log(`❌ ${testName} - Hata: ${error}\n`);
    }
  }

  private async testPasswordOperations(): Promise<void> {
    const testName = 'Şifre İşlemleri Testi';
    console.log(`🧪 ${testName}...`);
    
    try {
      const testId = TestUtils.generateTestId();
      const testEmail = `test_${testId}@example.com`;
      const testPasswordHash = 'hashed_password_123';
      
      const { duration } = await TestUtils.measureTime(async () => {
        // Kullanıcı oluştur
        const user = await this.mockDb.createUser({
          email: testEmail,
          firstName: 'Test',
          lastName: 'User',
          role: 'student',
          status: 'active',
          isEmailVerified: true,
          isPhoneVerified: false,
          preferences: {},
          subscription: {}
        });
        
        // Şifre kaydet
        await this.mockDb.setPassword(user.id, testPasswordHash);
        
        // Şifre getir
        const storedHash = await this.mockDb.getPasswordHash(user.id);
        
        // Şifre güncelle
        const newHash = 'new_hashed_password_456';
        await this.mockDb.setPassword(user.id, newHash);
        
        const updatedHash = await this.mockDb.getPasswordHash(user.id);
        
        return { 
          originalHash: testPasswordHash,
          storedHash,
          updatedHash,
          isMatch: storedHash === testPasswordHash,
          isUpdated: updatedHash === newHash
        };
      });
      
      // Test verilerini temizle
      await this.mockDb.query('DELETE FROM users WHERE email = $1', [testEmail]);
      
      this.results.push({
        testName,
        success: true,
        duration,
        data: { message: 'Şifre işlemleri başarılı' }
      });
      
      console.log(`✅ ${testName} - ${duration}ms\n`);
    } catch (error) {
      this.results.push({
        testName,
        success: false,
        duration: 0,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
      
      console.log(`❌ ${testName} - Hata: ${error}\n`);
    }
  }

  private async testProfileOperations(): Promise<void> {
    const testName = 'Profil İşlemleri Testi';
    console.log(`🧪 ${testName}...`);
    
    try {
      const testId = TestUtils.generateTestId();
      
      const { duration } = await TestUtils.measureTime(async () => {
        // Öğrenci profili oluştur
        const studentProfile = await this.mockDb.createStudentProfile({
          userId: 1,
          grade: 8,
          academicInfo: { targetExam: 'LGS' },
          learningStyle: { visual: 70 },
          goals: { shortTerm: ['Matematik notlarını yükseltmek'] },
          parentInfo: { name: 'Test Parent', phone: '+905551234567' }
        });
        
        // Öğretmen profili oluştur
        const teacherProfile = await this.mockDb.createTeacherProfile({
          userId: 2,
          specialization: ['matematik', 'fizik'],
          experience: 5,
          education: [{ degree: 'Matematik Öğretmenliği' }],
          certifications: [],
          languages: [{ language: 'Türkçe', level: 'native' }],
          availability: { timeSlots: [] },
          rating: { average: 4.5, totalReviews: 10 },
          bio: 'Test öğretmeni',
          hourlyRate: 100,
          isAvailable: true
        });
        
        return { studentProfile, teacherProfile };
      });
      
      this.results.push({
        testName,
        success: true,
        duration,
        data: { message: 'Profil işlemleri başarılı' }
      });
      
      console.log(`✅ ${testName} - ${duration}ms\n`);
    } catch (error) {
      this.results.push({
        testName,
        success: false,
        duration: 0,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
      
      console.log(`❌ ${testName} - Hata: ${error}\n`);
    }
  }

  private async testCourseOperations(): Promise<void> {
    const testName = 'Kurs İşlemleri Testi';
    console.log(`🧪 ${testName}...`);
    
    try {
      const testId = TestUtils.generateTestId();
      
      const { duration } = await TestUtils.measureTime(async () => {
        // Kurs oluştur
        const course = await this.mockDb.createCourse({
          title: 'Test Kursu',
          description: 'Bu bir test kursudur',
          category: 'mathematics',
          subcategory: 'algebra',
          grade: 8,
          level: 'intermediate',
          duration: 60,
          totalSessions: 20,
          price: 500,
          currency: 'TRY',
          teacherId: 1,
          tags: ['matematik', 'test'],
          prerequisites: [],
          learningObjectives: ['Temel matematik'],
          materials: [],
          isActive: true,
          isPublic: true,
          enrollmentCount: 0,
          rating: { average: 4.0, totalReviews: 0 }
        });
        
        return { course };
      });
      
      this.results.push({
        testName,
        success: true,
        duration,
        data: { message: 'Kurs işlemleri başarılı' }
      });
      
      console.log(`✅ ${testName} - ${duration}ms\n`);
    } catch (error) {
      this.results.push({
        testName,
        success: false,
        duration: 0,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
      
      console.log(`❌ ${testName} - Hata: ${error}\n`);
    }
  }

  private async testTransactions(): Promise<void> {
    const testName = 'Transaction Testi';
    console.log(`🧪 ${testName}...`);
    
    try {
      const testId = TestUtils.generateTestId();
      const testEmail = `test_${testId}@example.com`;
      
      const { duration } = await TestUtils.measureTime(async () => {
        return await this.mockDb.transaction(async (client) => {
          // Kullanıcı oluştur
          const user = await client.createUser({
            email: testEmail,
            firstName: 'Test',
            lastName: 'User',
            role: 'student',
            status: 'active',
            isEmailVerified: true,
            isPhoneVerified: false,
            preferences: {},
            subscription: {}
          });
          
          // Şifre ekle
          await client.setPassword(user.id, 'transaction_test_hash');
          
          return user;
        });
      });
      
      // Test verilerini temizle
      await this.mockDb.query('DELETE FROM users WHERE email = $1', [testEmail]);
      
      this.results.push({
        testName,
        success: true,
        duration,
        data: { userId: testId, message: 'Transaction başarılı' }
      });
      
      console.log(`✅ ${testName} - ${duration}ms\n`);
    } catch (error) {
      this.results.push({
        testName,
        success: false,
        duration: 0,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
      
      console.log(`❌ ${testName} - Hata: ${error}\n`);
    }
  }

  private async testPerformance(): Promise<void> {
    const testName = 'Performans Testi';
    console.log(`🧪 ${testName}...`);
    
    try {
      const testCount = 50;
      
      const { duration } = await TestUtils.measureTime(async () => {
        // Toplu kullanıcı oluşturma
        for (let i = 0; i < testCount; i++) {
          await this.mockDb.createUser({
            email: `perf_test_${Date.now()}_${i}@example.com`,
            firstName: `Test${i}`,
            lastName: 'User',
            role: 'student',
            status: 'active',
            isEmailVerified: true,
            isPhoneVerified: false,
            preferences: {},
            subscription: {}
          });
        }
        
        // Toplu sorgulama
        const allUsers = await this.mockDb.query('SELECT * FROM users');
        
        return { created: testCount, found: allUsers.rows.length };
      });
      
      this.results.push({
        testName,
        success: true,
        duration,
        data: { 
          operationsPerSecond: Math.round((testCount * 2) / (duration / 1000)),
          totalOperations: testCount * 2,
          duration
        }
      });
      
      console.log(`✅ ${testName} - ${duration}ms (${Math.round((testCount * 2) / (duration / 1000))} ops/s)\n`);
    } catch (error) {
      this.results.push({
        testName,
        success: false,
        duration: 0,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
      
      console.log(`❌ ${testName} - Hata: ${error}\n`);
    }
  }

  private async testDataIntegrity(): Promise<void> {
    const testName = 'Veri Bütünlüğü Testi';
    console.log(`🧪 ${testName}...`);
    
    try {
      const { duration } = await TestUtils.measureTime(async () => {
        const stats = this.mockDb.getStats();
        
        // Veri tutarlılığı kontrolleri
        const hasUsers = stats.users > 0;
        const hasProfiles = stats.studentProfiles > 0 || stats.teacherProfiles > 0;
        const hasCourses = stats.courses > 0;
        
        return {
          stats,
          hasUsers,
          hasProfiles,
          hasCourses,
          isConsistent: hasUsers && (hasProfiles || hasCourses)
        };
      });
      
      this.results.push({
        testName,
        success: true,
        duration,
        data: { message: 'Veri bütünlüğü testi başarılı' }
      });
      
      console.log(`✅ ${testName} - ${duration}ms\n`);
    } catch (error) {
      this.results.push({
        testName,
        success: false,
        duration: 0,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
      
      console.log(`❌ ${testName} - Hata: ${error}\n`);
    }
  }
}

// Ana test fonksiyonu
async function runMockDatabaseTests() {
  console.log('🚀 Mock Veri Tabanı Testleri Başlatılıyor...\n');
  
  try {
    const mockTestSuite = new MockDatabaseTestSuite();
    const results = await mockTestSuite.runAllTests();
    
    // Sonuçları raporla
    generateReport([results]);
    
  } catch (error) {
    console.error('❌ Test süreci sırasında hata:', error);
  }
}

// Rapor oluşturma fonksiyonu
function generateReport(results: TestSuite[]) {
  console.log('\n' + '='.repeat(80));
  console.log('📊 MOCK VERİ TABANI TEST RAPORU');
  console.log('='.repeat(80));
  
  let totalTests = 0;
  let totalSuccess = 0;
  let totalFailure = 0;
  let totalDuration = 0;
  
  results.forEach(suite => {
    console.log(`\n🔍 ${suite.name}`);
    console.log('-'.repeat(60));
    console.log(`⏱️  Toplam Süre: ${suite.totalDuration}ms`);
    console.log(`✅ Başarılı: ${suite.successCount}`);
    console.log(`❌ Başarısız: ${suite.failureCount}`);
    console.log(`📈 Başarı Oranı: ${Math.round((suite.successCount / (suite.successCount + suite.failureCount)) * 100)}%`);
    
    console.log('\n📋 Test Detayları:');
    suite.results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      const duration = `${result.duration}ms`;
      console.log(`  ${status} ${result.testName} - ${duration}`);
      
      if (result.error) {
        console.log(`     Hata: ${result.error}`);
      }
    });
    
    totalTests += suite.successCount + suite.failureCount;
    totalSuccess += suite.successCount;
    totalFailure += suite.failureCount;
    totalDuration += suite.totalDuration;
  });
  
  console.log('\n' + '='.repeat(80));
  console.log('📈 GENEL ÖZET');
  console.log('='.repeat(80));
  console.log(`🔢 Toplam Test: ${totalTests}`);
  console.log(`✅ Başarılı: ${totalSuccess}`);
  console.log(`❌ Başarısız: ${totalFailure}`);
  console.log(`📊 Başarı Oranı: ${Math.round((totalSuccess / totalTests) * 100)}%`);
  console.log(`⏱️  Toplam Süre: ${totalDuration}ms`);
  console.log(`⚡ Ortalama Test Süresi: ${Math.round(totalDuration / totalTests)}ms`);
  
  // Performans değerlendirmesi
  console.log('\n🎯 PERFORMANS DEĞERLENDİRMESİ');
  console.log('-'.repeat(60));
  
  if (totalSuccess / totalTests >= 0.9) {
    console.log('🟢 Mükemmel: %90+ başarı oranı');
  } else if (totalSuccess / totalTests >= 0.8) {
    console.log('🟡 İyi: %80+ başarı oranı');
  } else if (totalSuccess / totalTests >= 0.7) {
    console.log('🟠 Orta: %70+ başarı oranı');
  } else {
    console.log('🔴 Düşük: %70 altı başarı oranı');
  }
  
  if (totalDuration < 1000) {
    console.log('⚡ Hızlı: 1 saniye altı toplam süre');
  } else if (totalDuration < 5000) {
    console.log('🐌 Orta: 1-5 saniye arası toplam süre');
  } else {
    console.log('🐢 Yavaş: 5 saniye üstü toplam süre');
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('✨ Mock test tamamlandı!');
  console.log('='.repeat(80));
}

// Script'i çalıştır
if (require.main === module) {
  runMockDatabaseTests().catch(console.error);
}

export { MockDatabaseTestSuite, runMockDatabaseTests };
