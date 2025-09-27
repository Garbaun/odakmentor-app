#!/usr/bin/env ts-node

/**
 * PostgreSQL Test Scripti
 * 
 * Ubuntu cihazınızdaki PostgreSQL veritabanını test eder
 */

import { CourseService, DatabaseService, PasswordService, StudentProfileService, TeacherProfileService, UserService } from '../services/databaseService';

// Test sonuçları interface'i
interface TestResult {
  testName: string;
  success: boolean;
  duration: number;
  error?: string;
  data?: any;
}

interface TestSuite {
  suiteName: string;
  results: TestResult[];
  totalDuration: number;
  successCount: number;
  failureCount: number;
  successRate: number;
}

class PostgreSQLTestSuite {
  private results: TestResult[] = [];
  private testCounter = 0;

  // Unique email generator
  private generateUniqueEmail(prefix: string): string {
    this.testCounter++;
    return `${prefix}-${Date.now()}-${this.testCounter}@example.com`;
  }

  async runAllTests(): Promise<TestSuite> {
    console.log('🐘 PostgreSQL Test Suite Başlatılıyor...\n');
    
    const startTime = Date.now();

    // Testleri çalıştır
    await this.testConnection();
    await this.testUserOperations();
    await this.testPasswordOperations();
    await this.testProfileOperations();
    await this.testCourseOperations();
    await this.testTransactionOperations();
    await this.testPerformance();
    await this.testDataIntegrity();

    const totalDuration = Date.now() - startTime;
    const successCount = this.results.filter(r => r.success).length;
    const failureCount = this.results.filter(r => !r.success).length;
    const successRate = (successCount / this.results.length) * 100;

    return {
      suiteName: 'PostgreSQL Test Suite',
      results: this.results,
      totalDuration,
      successCount,
      failureCount,
      successRate
    };
  }

  private async testConnection(): Promise<void> {
    console.log('🔌 PostgreSQL Bağlantı Testi...');
    const startTime = Date.now();
    
    try {
      await DatabaseService.testConnection();
      this.addResult('PostgreSQL Bağlantı Testi', true, Date.now() - startTime);
    } catch (error) {
      this.addResult('PostgreSQL Bağlantı Testi', false, Date.now() - startTime, error instanceof Error ? error.message : String(error));
    }
  }

  private async testUserOperations(): Promise<void> {
    console.log('👤 Kullanıcı İşlemleri Testi...');
    const startTime = Date.now();
    
    try {
      // Test kullanıcısı oluştur
      const testUser = await UserService.createUser({
        email: this.generateUniqueEmail('test'),
        firstName: 'Test',
        lastName: 'User',
        role: 'student',
        status: 'active',
        isEmailVerified: true,
        isPhoneVerified: false,
        preferences: { theme: 'light' },
        subscription: { plan: 'free' }
      });

      // Kullanıcıyı email ile bul
      const foundUser = await UserService.getUserByEmail(testUser.email);
      if (!foundUser || foundUser.id !== testUser.id) {
        throw new Error('Kullanıcı bulunamadı');
      }

      // Kullanıcıyı güncelle
      const updatedUser = await UserService.updateUser(testUser.id, {
        firstName: 'Updated Test'
      });
      if (!updatedUser || updatedUser.firstName !== 'Updated Test') {
        throw new Error('Kullanıcı güncellenemedi');
      }

      // Son giriş tarihini güncelle
      await UserService.updateLastLogin(testUser.id);

      this.addResult('Kullanıcı İşlemleri Testi', true, Date.now() - startTime, { userId: testUser.id });
    } catch (error) {
      console.error('Kullanıcı İşlemleri Testi Hatası:', error);
      this.addResult('Kullanıcı İşlemleri Testi', false, Date.now() - startTime, error instanceof Error ? error.message : String(error));
    }
  }

  private async testPasswordOperations(): Promise<void> {
    console.log('🔐 Şifre İşlemleri Testi...');
    const startTime = Date.now();
    
    try {
      // Test kullanıcısı oluştur
      const testUser = await UserService.createUser({
        email: this.generateUniqueEmail('password-test'),
        firstName: 'Password',
        lastName: 'Test',
        role: 'student',
        status: 'active',
        isEmailVerified: true,
        isPhoneVerified: false,
        preferences: {},
        subscription: {}
      });

      // Şifre kaydet
      const passwordHash = 'hashed_password_123';
      await PasswordService.setPassword(testUser.id, passwordHash);

      // Şifre al
      const retrievedHash = await PasswordService.getPasswordHash(testUser.id);
      if (retrievedHash !== passwordHash) {
        throw new Error('Şifre hash eşleşmiyor');
      }

      this.addResult('Şifre İşlemleri Testi', true, Date.now() - startTime, { userId: testUser.id });
    } catch (error) {
      this.addResult('Şifre İşlemleri Testi', false, Date.now() - startTime, error instanceof Error ? error.message : String(error));
    }
  }

  private async testProfileOperations(): Promise<void> {
    console.log('📋 Profil İşlemleri Testi...');
    const startTime = Date.now();
    
    try {
      // Test kullanıcıları oluştur
      const studentUser = await UserService.createUser({
        email: this.generateUniqueEmail('student-profile'),
        firstName: 'Student',
        lastName: 'Profile',
        role: 'student',
        status: 'active',
        isEmailVerified: true,
        isPhoneVerified: false,
        preferences: {},
        subscription: {}
      });

      const teacherUser = await UserService.createUser({
        email: this.generateUniqueEmail('teacher-profile'),
        firstName: 'Teacher',
        lastName: 'Profile',
        role: 'teacher',
        status: 'active',
        isEmailVerified: true,
        isPhoneVerified: false,
        preferences: {},
        subscription: {}
      });

      // Öğrenci profili oluştur
      const studentProfile = await StudentProfileService.createProfile({
        userId: studentUser.id,
        grade: 9,
        school: 'Test School',
        city: 'Istanbul',
        academicInfo: { gpa: 3.5 },
        learningStyle: { visual: true },
        goals: { target: 'university' },
        parentInfo: { name: 'Parent Name' }
      });

      // Öğretmen profili oluştur
      const teacherProfile = await TeacherProfileService.createProfile({
        userId: teacherUser.id,
        specialization: ['mathematics', 'physics'],
        experience: 5,
        education: [{ degree: 'Master', field: 'Mathematics' }],
        certifications: ['Teaching Certificate'],
        languages: ['Turkish', 'English'],
        availability: { weekdays: true },
        rating: { average: 4.5, count: 10 },
        bio: 'Experienced mathematics teacher',
        hourlyRate: 100,
        isAvailable: true
      });

      // Profilleri al
      const retrievedStudentProfile = await StudentProfileService.getProfile(studentUser.id);
      const retrievedTeacherProfile = await TeacherProfileService.getProfile(teacherUser.id);

      if (!retrievedStudentProfile || !retrievedTeacherProfile) {
        throw new Error('Profiller alınamadı');
      }

      this.addResult('Profil İşlemleri Testi', true, Date.now() - startTime, {
        studentProfileId: studentProfile.id,
        teacherProfileId: teacherProfile.id
      });
    } catch (error) {
      console.error('Profil İşlemleri Testi Hatası:', error);
      this.addResult('Profil İşlemleri Testi', false, Date.now() - startTime, error instanceof Error ? error.message : String(error));
    }
  }

  private async testCourseOperations(): Promise<void> {
    console.log('📚 Kurs İşlemleri Testi...');
    const startTime = Date.now();
    
    try {
      // Test öğretmeni oluştur
      const teacherUser = await UserService.createUser({
        email: this.generateUniqueEmail('course-teacher'),
        firstName: 'Course',
        lastName: 'Teacher',
        role: 'teacher',
        status: 'active',
        isEmailVerified: true,
        isPhoneVerified: false,
        preferences: {},
        subscription: {}
      });

      // Kurs oluştur
      const course = await CourseService.createCourse({
        title: 'Test Mathematics Course',
        description: 'A test mathematics course',
        category: 'Mathematics',
        subcategory: 'Algebra',
        grade: 9,
        level: 'Intermediate',
        duration: 60,
        totalSessions: 10,
        price: 299.99,
        currency: 'TRY',
        teacherId: teacherUser.id,
        tags: ['mathematics', 'algebra', 'grade9'],
        prerequisites: ['Basic math'],
        learningObjectives: ['Learn algebra basics'],
        materials: [{ type: 'textbook', name: 'Algebra Book' }],
        isActive: true,
        isPublic: true,
        rating: { average: 0, count: 0 }
      });

      // Kursu al
      const retrievedCourse = await CourseService.getCourse(course.id);
      if (!retrievedCourse || retrievedCourse.id !== course.id) {
        throw new Error('Kurs alınamadı');
      }

      // Öğretmenin kurslarını al
      const teacherCourses = await CourseService.getCoursesByTeacher(teacherUser.id);
      if (teacherCourses.length === 0) {
        throw new Error('Öğretmen kursları alınamadı');
      }

      // Kursu güncelle
      const updatedCourse = await CourseService.updateCourse(course.id, {
        title: 'Updated Test Mathematics Course'
      });
      if (!updatedCourse || updatedCourse.title !== 'Updated Test Mathematics Course') {
        throw new Error('Kurs güncellenemedi');
      }

      this.addResult('Kurs İşlemleri Testi', true, Date.now() - startTime, { courseId: course.id });
    } catch (error) {
      console.error('Kurs İşlemleri Testi Hatası:', error);
      this.addResult('Kurs İşlemleri Testi', false, Date.now() - startTime, error instanceof Error ? error.message : String(error));
    }
  }

  private async testTransactionOperations(): Promise<void> {
    console.log('🔄 Transaction Testi...');
    const startTime = Date.now();
    
    try {
      await DatabaseService.transaction(async (client) => {
        // Transaction içinde kullanıcı oluştur
        const user = await UserService.createUser({
          email: this.generateUniqueEmail('transaction-test'),
          firstName: 'Transaction',
          lastName: 'Test',
          role: 'student',
          status: 'active',
          isEmailVerified: true,
          isPhoneVerified: false,
          preferences: {},
          subscription: {}
        });

        // Şifre kaydet
        await PasswordService.setPassword(user.id, 'transaction_password');

        // Profil oluştur
        await StudentProfileService.createProfile({
          userId: user.id,
          grade: 10,
          academicInfo: {},
          learningStyle: {},
          goals: {},
          parentInfo: {}
        });

        return user;
      });

      this.addResult('Transaction Testi', true, Date.now() - startTime);
    } catch (error) {
      console.error('Transaction Testi Hatası:', error);
      this.addResult('Transaction Testi', false, Date.now() - startTime, error instanceof Error ? error.message : String(error));
    }
  }

  private async testPerformance(): Promise<void> {
    console.log('⚡ Performans Testi...');
    const startTime = Date.now();
    
    try {
      const iterations = 100;
      const promises = [];

      for (let i = 0; i < iterations; i++) {
        promises.push(
          UserService.createUser({
            email: this.generateUniqueEmail(`perf-test-${i}`),
            firstName: `Perf${i}`,
            lastName: 'Test',
            role: 'student',
            status: 'active',
            isEmailVerified: true,
            isPhoneVerified: false,
            preferences: {},
            subscription: {}
          })
        );
      }

      await Promise.all(promises);
      const duration = Date.now() - startTime;
      const opsPerSecond = Math.round((iterations / duration) * 1000);

      this.addResult('Performans Testi', true, duration, { opsPerSecond });
    } catch (error) {
      console.error('Performans Testi Hatası:', error);
      this.addResult('Performans Testi', false, Date.now() - startTime, error instanceof Error ? error.message : String(error));
    }
  }

  private async testDataIntegrity(): Promise<void> {
    console.log('🔍 Veri Bütünlüğü Testi...');
    const startTime = Date.now();
    
    try {
      // Kullanıcı oluştur
      const user = await UserService.createUser({
        email: this.generateUniqueEmail('integrity-test'),
        firstName: 'Integrity',
        lastName: 'Test',
        role: 'student',
        status: 'active',
        isEmailVerified: true,
        isPhoneVerified: false,
        preferences: {},
        subscription: {}
      });

      // Şifre kaydet
      await PasswordService.setPassword(user.id, 'integrity_password');

      // Profil oluştur
      const profile = await StudentProfileService.createProfile({
        userId: user.id,
        grade: 11,
        academicInfo: {},
        learningStyle: {},
        goals: {},
        parentInfo: {}
      });

      // Veri bütünlüğünü kontrol et
      const retrievedUser = await UserService.getUser(user.id);
      const retrievedPassword = await PasswordService.getPasswordHash(user.id);
      const retrievedProfile = await StudentProfileService.getProfile(user.id);

      if (!retrievedUser || !retrievedPassword || !retrievedProfile) {
        throw new Error('Veri bütünlüğü hatası');
      }

      if (retrievedProfile.userId !== user.id) {
        throw new Error('Profil kullanıcı ID eşleşmiyor');
      }

      this.addResult('Veri Bütünlüğü Testi', true, Date.now() - startTime);
    } catch (error) {
      console.error('Veri Bütünlüğü Testi Hatası:', error);
      this.addResult('Veri Bütünlüğü Testi', false, Date.now() - startTime, error instanceof Error ? error.message : String(error));
    }
  }

  private addResult(testName: string, success: boolean, duration: number, data?: any, error?: string): void {
    this.results.push({
      testName,
      success,
      duration,
      data,
      error
    });

    const status = success ? '✅' : '❌';
    const durationText = duration < 1000 ? `${duration}ms` : `${(duration / 1000).toFixed(2)}s`;
    console.log(`${status} ${testName} - ${durationText}`);
  }
}

// Ana test fonksiyonu
async function runPostgreSQLTests() {
  console.log('🚀 PostgreSQL Veri Tabanı Testleri Başlatılıyor...\n');
  
  const allResults: TestSuite[] = [];
  
  try {
    // PostgreSQL testleri
    const postgresTestSuite = new PostgreSQLTestSuite();
    const postgresResults = await postgresTestSuite.runAllTests();
    allResults.push(postgresResults);
    
    // Sonuçları raporla
    generateReport(allResults);
    
  } catch (error) {
    console.error('❌ Test süreci sırasında hata:', error);
  } finally {
    // PostgreSQL bağlantısını kapat
    try {
      await DatabaseService.close();
      console.log('🔌 PostgreSQL bağlantısı kapatıldı');
    } catch (error) {
      console.log('⚠️ PostgreSQL bağlantısı zaten kapatılmış');
    }
  }
}

// Rapor oluşturma fonksiyonu
function generateReport(results: TestSuite[]): void {
  console.log('\n' + '='.repeat(80));
  console.log('📊 POSTGRESQL VERİ TABANI TEST RAPORU');
  console.log('='.repeat(80));

  results.forEach(suite => {
    console.log(`\n🔍 ${suite.suiteName}`);
    console.log('-'.repeat(60));
    console.log(`⏱️  Toplam Süre: ${suite.totalDuration}ms`);
    console.log(`✅ Başarılı: ${suite.successCount}`);
    console.log(`❌ Başarısız: ${suite.failureCount}`);
    console.log(`📈 Başarı Oranı: ${suite.successRate.toFixed(1)}%`);

    console.log('\n📋 Test Detayları:');
    suite.results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      const duration = result.duration < 1000 ? `${result.duration}ms` : `${(result.duration / 1000).toFixed(2)}s`;
      console.log(`  ${status} ${result.testName} - ${duration}`);
      if (result.error) {
        console.log(`     ❌ Hata: ${result.error}`);
      }
    });
  });

  // Genel özet
  const totalTests = results.reduce((sum, suite) => sum + suite.results.length, 0);
  const totalSuccess = results.reduce((sum, suite) => sum + suite.successCount, 0);
  const totalFailure = results.reduce((sum, suite) => sum + suite.failureCount, 0);
  const totalDuration = results.reduce((sum, suite) => sum + suite.totalDuration, 0);
  const overallSuccessRate = (totalSuccess / totalTests) * 100;

  console.log('\n' + '='.repeat(80));
  console.log('📈 GENEL ÖZET');
  console.log('='.repeat(80));
  console.log(`🔢 Toplam Test: ${totalTests}`);
  console.log(`✅ Başarılı: ${totalSuccess}`);
  console.log(`❌ Başarısız: ${totalFailure}`);
  console.log(`📊 Başarı Oranı: ${overallSuccessRate.toFixed(1)}%`);
  console.log(`⏱️  Toplam Süre: ${totalDuration}ms`);
  console.log(`⚡ Ortalama Test Süresi: ${Math.round(totalDuration / totalTests)}ms`);

  console.log('\n🎯 PERFORMANS DEĞERLENDİRMESİ');
  console.log('-'.repeat(60));
  if (overallSuccessRate >= 90) {
    console.log('🟢 Mükemmel: %90+ başarı oranı');
  } else if (overallSuccessRate >= 70) {
    console.log('🟡 İyi: %70+ başarı oranı');
  } else {
    console.log('🔴 Geliştirilmeli: %70 altı başarı oranı');
  }

  if (totalDuration < 1000) {
    console.log('⚡ Hızlı: 1 saniye altı toplam süre');
  } else if (totalDuration < 5000) {
    console.log('🟡 Normal: 5 saniye altı toplam süre');
  } else {
    console.log('🔴 Yavaş: 5 saniye üstü toplam süre');
  }

  console.log('\n' + '='.repeat(80));
  console.log('✨ PostgreSQL test tamamlandı!');
  console.log('='.repeat(80));
}

// Script doğrudan çalıştırılıyorsa testleri başlat
if (require.main === module) {
  runPostgreSQLTests().catch(console.error);
}

export { PostgreSQLTestSuite, runPostgreSQLTests };
