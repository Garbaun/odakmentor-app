// PostgreSQL için veri tipleri
interface User {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  countryCode?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  preferences: any;
  subscription: any;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
  loginCount?: number;
}

interface StudentProfile {
  userId: string | number;
  grade: number;
  school?: string;
  city?: string;
  district?: string;
  academicInfo: any;
  learningStyle: any;
  goals: any;
  parentInfo: any;
  createdAt?: string;
  updatedAt?: string;
}

interface TeacherProfile {
  userId: string | number;
  specialization: string[];
  experience: number;
  education: any[];
  certifications: any[];
  languages: any[];
  availability: any;
  rating: any;
  bio: string;
  hourlyRate: number;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Course {
  id?: number;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  grade: number;
  level: string;
  duration: number;
  totalSessions: number;
  price: number;
  currency: string;
  teacherId: string | number;
  thumbnail?: string;
  tags: string[];
  prerequisites: string[];
  learningObjectives: string[];
  materials: any[];
  isActive: boolean;
  isPublic: boolean;
  enrollmentCount?: number;
  rating: any;
  createdAt?: string;
  updatedAt?: string;
}

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
    console.log('🚀 PostgreSQL veritabanı başlatılıyor...');
    
    // Import services
    const { UserService, StudentProfileService, TeacherProfileService, CourseService } = await import('../services/databaseService');
    
    // Create admin user
    const adminUser = await UserService.createUser(sampleUsers[0]);
    console.log('✅ Admin kullanıcısı oluşturuldu:', adminUser.id);
    
    // Create student user
    const studentUser = await UserService.createUser(sampleUsers[1]);
    console.log('✅ Öğrenci kullanıcısı oluşturuldu:', studentUser.id);
    
    // Create teacher user
    const teacherUser = await UserService.createUser(sampleUsers[2]);
    console.log('✅ Öğretmen kullanıcısı oluşturuldu:', teacherUser.id);
    
    // Create student profile
    const studentProfile = { ...sampleStudentProfiles[0], userId: studentUser.id };
    await StudentProfileService.createProfile(studentProfile);
    console.log('✅ Öğrenci profili oluşturuldu');
    
    // Create teacher profile
    const teacherProfile = { ...sampleTeacherProfiles[0], userId: teacherUser.id };
    await TeacherProfileService.createProfile(teacherProfile);
    console.log('✅ Öğretmen profili oluşturuldu');
    
    // Create courses
    const course1 = { ...sampleCourses[0], teacherId: teacherUser.id };
    const course1Result = await CourseService.createCourse(course1);
    console.log('✅ Matematik kursu oluşturuldu:', course1Result.id);
    
    const course2 = { ...sampleCourses[1], teacherId: teacherUser.id };
    const course2Result = await CourseService.createCourse(course2);
    console.log('✅ LGS hazırlık kursu oluşturuldu:', course2Result.id);
    
    console.log('🎉 PostgreSQL veritabanı başarıyla başlatıldı!');
    
    return {
      adminUserId: adminUser.id,
      studentUserId: studentUser.id,
      teacherUserId: teacherUser.id,
      course1Id: course1Result.id,
      course2Id: course2Result.id,
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
    const { DatabaseService } = await import('../services/databaseService');
    
    // Clear all data from PostgreSQL
    await DatabaseService.query('DELETE FROM student_profiles');
    await DatabaseService.query('DELETE FROM teacher_profiles');
    await DatabaseService.query('DELETE FROM courses');
    await DatabaseService.query('DELETE FROM passwords');
    await DatabaseService.query('DELETE FROM users');
    
    console.log('✅ Test verileri temizlendi');
    
  } catch (error) {
    console.error('❌ Test verileri temizleme hatası:', error);
    throw error;
  }
}
