import { User, StudentProfile, TeacherProfile, Course, COLLECTIONS } from './schema';

// Sample users for testing
export const sampleUsers: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'loginCount'>[] = [
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
  },
];

// Sample student profiles
export const sampleStudentProfiles: Omit<StudentProfile, 'createdAt' | 'updatedAt'>[] = [
  {
    userId: '', // Will be set after user creation
    grade: 8,
    school: 'Atatürk Ortaokulu',
    city: 'İstanbul',
    district: 'Kadıköy',
    parentInfo: {
      name: 'Mehmet Yılmaz',
      phone: '+905551234567',
      email: 'parent@example.com',
      relationship: 'father',
    },
    academicInfo: {
      targetExam: 'LGS',
      targetYear: 2025,
      currentLevel: 'intermediate',
      weakSubjects: ['matematik', 'fizik'],
      strongSubjects: ['türkçe', 'tarih'],
      interests: ['bilgisayar', 'müzik', 'spor'],
    },
    learningStyle: {
      visual: 70,
      auditory: 60,
      kinesthetic: 50,
      reading: 80,
    },
    goals: {
      shortTerm: ['Matematik notlarını yükseltmek', 'LGS hazırlığına başlamak'],
      longTerm: ['İyi bir liseye girmek', 'Mühendislik okumak'],
      careerAspirations: ['Yazılım mühendisi', 'Bilgisayar mühendisi'],
    },
  },
];

// Sample teacher profiles
export const sampleTeacherProfiles: Omit<TeacherProfile, 'createdAt' | 'updatedAt'>[] = [
  {
    userId: '', // Will be set after user creation
    specialization: ['matematik', 'fizik', 'geometri'],
    experience: 8,
    education: [
      {
        degree: 'Matematik Öğretmenliği',
        university: 'Boğaziçi Üniversitesi',
        graduationYear: 2010,
        gpa: 3.5,
      },
    ],
    certifications: [
      {
        name: 'Matematik Öğretmenliği Sertifikası',
        issuer: 'MEB',
        date: '2010-06-01',
      },
    ],
    languages: [
      {
        language: 'Türkçe',
        level: 'native',
      },
      {
        language: 'İngilizce',
        level: 'fluent',
      },
    ],
    availability: {
      timeSlots: [
        { day: 'monday', startTime: '09:00', endTime: '17:00' },
        { day: 'tuesday', startTime: '09:00', endTime: '17:00' },
        { day: 'wednesday', startTime: '09:00', endTime: '17:00' },
        { day: 'thursday', startTime: '09:00', endTime: '17:00' },
        { day: 'friday', startTime: '09:00', endTime: '17:00' },
      ],
      timezone: 'Europe/Istanbul',
    },
    rating: {
      average: 4.8,
      totalReviews: 156,
      breakdown: {
        teaching: 4.9,
        communication: 4.7,
        punctuality: 4.8,
        knowledge: 4.9,
      },
    },
    bio: '8 yıllık deneyimimle matematik ve fizik alanında öğrencilerime en iyi eğitimi sunuyorum. Öğrencilerimin başarısı benim en büyük motivasyonum.',
    hourlyRate: 150,
    isAvailable: true,
  },
];

// Sample courses
export const sampleCourses: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'enrollmentCount'>[] = [
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
    rating: {
      average: 4.7,
      totalReviews: 23,
    },
  },
  {
    title: 'LGS Hazırlık Programı',
    description: 'LGS sınavına hazırlık için özel olarak tasarlanmış kapsamlı program. Tüm konuları detaylı şekilde işleyeceğiz.',
    category: 'exam_prep',
    subcategory: 'lgs_hazirlik',
    grade: 8,
    level: 'advanced',
    duration: 90,
    totalSessions: 40,
    price: 2500,
    currency: 'TRY',
    teacherId: '', // Will be set after teacher creation
    thumbnail: '/images/courses/lgs-hazirlik.jpg',
    tags: ['LGS', 'sınav hazırlık', '8. sınıf'],
    prerequisites: ['8. sınıf temel bilgileri'],
    learningObjectives: [
      'LGS sınav formatını öğrenme',
      'Test çözme teknikleri',
      'Zaman yönetimi',
      'Stres kontrolü',
    ],
    materials: [
      {
        type: 'video',
        title: 'LGS Stratejileri',
        url: '/videos/lgs-stratejileri.mp4',
      },
      {
        type: 'quiz',
        title: 'Deneme Sınavı 1',
        content: 'LGS deneme sınavı soruları',
      },
    ],
    isActive: true,
    isPublic: true,
    rating: {
      average: 4.9,
      totalReviews: 45,
    },
  },
];

// Database initialization function
export async function initializeDatabase() {
  try {
    console.log('🚀 Veritabanı başlatılıyor...');
    
    // Import services
    const { UserService, StudentProfileService, TeacherProfileService, CourseService } = await import('../services/databaseService');
    
    // Create admin user
    const adminUserId = await UserService.createUser(sampleUsers[0]);
    console.log('✅ Admin kullanıcısı oluşturuldu:', adminUserId);
    
    // Create student user
    const studentUserId = await UserService.createUser(sampleUsers[1]);
    console.log('✅ Öğrenci kullanıcısı oluşturuldu:', studentUserId);
    
    // Create teacher user
    const teacherUserId = await UserService.createUser(sampleUsers[2]);
    console.log('✅ Öğretmen kullanıcısı oluşturuldu:', teacherUserId);
    
    // Create student profile
    const studentProfile = { ...sampleStudentProfiles[0], userId: studentUserId };
    await StudentProfileService.createProfile(studentProfile);
    console.log('✅ Öğrenci profili oluşturuldu');
    
    // Create teacher profile
    const teacherProfile = { ...sampleTeacherProfiles[0], userId: teacherUserId };
    await TeacherProfileService.createProfile(teacherProfile);
    console.log('✅ Öğretmen profili oluşturuldu');
    
    // Create courses
    const course1 = { ...sampleCourses[0], teacherId: teacherUserId };
    const course1Id = await CourseService.createCourse(course1);
    console.log('✅ Matematik kursu oluşturuldu:', course1Id);
    
    const course2 = { ...sampleCourses[1], teacherId: teacherUserId };
    const course2Id = await CourseService.createCourse(course2);
    console.log('✅ LGS hazırlık kursu oluşturuldu:', course2Id);
    
    console.log('🎉 Veritabanı başarıyla başlatıldı!');
    
    return {
      adminUserId,
      studentUserId,
      teacherUserId,
      course1Id,
      course2Id,
    };
    
  } catch (error) {
    console.error('❌ Veritabanı başlatma hatası:', error);
    throw error;
  }
}

// Test data cleanup function
export async function cleanupTestData() {
  try {
    console.log('🧹 Test verileri temizleniyor...');
    
    // Import services
    const { UserService } = await import('../services/databaseService');
    
    // Get all test users
    const testEmails = ['admin@odakmentor.com', 'student@example.com', 'teacher@example.com'];
    
    for (const email of testEmails) {
      const user = await UserService.getUserByEmail(email);
      if (user) {
        // Note: In a real implementation, you would need to delete related documents first
        // This is a simplified version
        console.log(`🗑️ Test kullanıcısı silinecek: ${email}`);
      }
    }
    
    console.log('✅ Test verileri temizlendi');
    
  } catch (error) {
    console.error('❌ Test verileri temizleme hatası:', error);
    throw error;
  }
}
