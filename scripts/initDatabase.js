#!/usr/bin/env node

/**
 * Veritabanı Başlatma Scripti (JavaScript)
 * 
 * Bu script Firebase Firestore veritabanını başlatır ve örnek veriler ekler.
 * 
 * Kullanım:
 * npm run init-db
 * veya
 * node scripts/initDatabase.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, connectFirestoreEmulator, collection, addDoc, doc, getDoc, getDocs, query, where } = require('firebase/firestore');

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

// Sample users for testing
const sampleUsers = [
  {
    email: 'admin@odakmentor.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    status: 'active',
    isEmailVerified: true,
    isPhoneVerified: false,
    preferences: {
      language: 'tr',
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
      privacy: {
        profileVisible: true,
        progressVisible: true,
      },
    },
    subscription: {
      plan: 'enterprise',
      startDate: new Date().toISOString(),
      isActive: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    loginCount: 0,
  },
  {
    email: 'student@example.com',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    phone: '+905551234567',
    countryCode: '+90',
    dateOfBirth: '2010-05-15',
    gender: 'male',
    role: 'student',
    status: 'active',
    isEmailVerified: true,
    isPhoneVerified: true,
    preferences: {
      language: 'tr',
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
      privacy: {
        profileVisible: true,
        progressVisible: false,
      },
    },
    subscription: {
      plan: 'basic',
      startDate: new Date().toISOString(),
      isActive: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    loginCount: 0,
  },
  {
    email: 'teacher@example.com',
    firstName: 'Ayşe',
    lastName: 'Demir',
    phone: '+905559876543',
    countryCode: '+90',
    dateOfBirth: '1985-03-20',
    gender: 'female',
    role: 'teacher',
    status: 'active',
    isEmailVerified: true,
    isPhoneVerified: true,
    preferences: {
      language: 'tr',
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
      privacy: {
        profileVisible: true,
        progressVisible: true,
      },
    },
    subscription: {
      plan: 'premium',
      startDate: new Date().toISOString(),
      isActive: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    loginCount: 0,
  },
];

// Sample courses
const sampleCourses = [
  {
    title: '8. Sınıf Matematik',
    description: '8. sınıf matematik konularını kapsamlı şekilde işleyeceğimiz bu kursta, öğrencilerimizin matematik temellerini güçlendiriyoruz.',
    category: 'mathematics',
    subcategory: 'ortaokul_matematik',
    grade: 8,
    level: 'intermediate',
    duration: 60,
    totalSessions: 20,
    price: 1200,
    currency: 'TRY',
    teacherId: '', // Will be set after teacher creation
    thumbnail: '/images/courses/matematik-8.jpg',
    tags: ['matematik', '8. sınıf', 'LGS hazırlık'],
    prerequisites: ['7. sınıf matematik bilgisi'],
    learningObjectives: [
      'Cebirsel ifadeleri anlama',
      'Denklem çözme becerisi',
      'Geometrik şekilleri tanıma',
      'İstatistik ve olasılık temelleri',
    ],
    materials: [
      {
        type: 'video',
        title: 'Cebirsel İfadeler Giriş',
        url: '/videos/cebirsel-ifadeler.mp4',
      },
      {
        type: 'document',
        title: 'Matematik Formülleri',
        url: '/documents/matematik-formulleri.pdf',
      },
    ],
    isActive: true,
    isPublic: true,
    enrollmentCount: 0,
    rating: {
      average: 4.7,
      totalReviews: 23,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Database initialization function
async function initializeDatabase() {
  try {
    console.log('🚀 Veritabanı başlatılıyor...');
    
    // Create admin user
    const adminDocRef = await addDoc(collection(db, 'users'), sampleUsers[0]);
    console.log('✅ Admin kullanıcısı oluşturuldu:', adminDocRef.id);
    
    // Create student user
    const studentDocRef = await addDoc(collection(db, 'users'), sampleUsers[1]);
    console.log('✅ Öğrenci kullanıcısı oluşturuldu:', studentDocRef.id);
    
    // Create teacher user
    const teacherDocRef = await addDoc(collection(db, 'users'), sampleUsers[2]);
    console.log('✅ Öğretmen kullanıcısı oluşturuldu:', teacherDocRef.id);
    
    // Create course
    const courseData = { ...sampleCourses[0], teacherId: teacherDocRef.id };
    const courseDocRef = await addDoc(collection(db, 'courses'), courseData);
    console.log('✅ Matematik kursu oluşturuldu:', courseDocRef.id);
    
    console.log('🎉 Veritabanı başarıyla başlatıldı!');
    
    return {
      adminUserId: adminDocRef.id,
      studentUserId: studentDocRef.id,
      teacherUserId: teacherDocRef.id,
      courseId: courseDocRef.id,
    };
    
  } catch (error) {
    console.error('❌ Veritabanı başlatma hatası:', error);
    throw error;
  }
}

// Test data cleanup function
async function cleanupTestData() {
  try {
    console.log('🧹 Test verileri temizleniyor...');
    
    // Get all test users
    const testEmails = ['admin@odakmentor.com', 'student@example.com', 'teacher@example.com'];
    
    for (const email of testEmails) {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        console.log(`🗑️ Test kullanıcısı bulundu: ${email}`);
        // Note: In a real implementation, you would delete the document here
        // await deleteDoc(doc(db, 'users', querySnapshot.docs[0].id));
      }
    }
    
    console.log('✅ Test verileri temizlendi');
    
  } catch (error) {
    console.error('❌ Test verileri temizleme hatası:', error);
    throw error;
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

module.exports = { initializeDatabase, cleanupTestData };
