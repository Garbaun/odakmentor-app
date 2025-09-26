// Firebase Firestore Database Schema
// Odak Mentor Eğitim Platformu Veritabanı Yapısı

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  countryCode?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  profileImage?: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  preferences: {
    language: 'tr' | 'en';
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    privacy: {
      profileVisible: boolean;
      progressVisible: boolean;
    };
  };
  subscription: {
    plan: 'free' | 'basic' | 'premium' | 'enterprise';
    startDate: string;
    endDate?: string;
    isActive: boolean;
  };
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  loginCount: number;
}

export interface StudentProfile {
  userId: string;
  grade: number;
  school?: string;
  city?: string;
  district?: string;
  parentInfo: {
    name: string;
    phone: string;
    email?: string;
    relationship: 'mother' | 'father' | 'guardian' | 'other';
  };
  academicInfo: {
    targetExam?: 'LGS' | 'AYT' | 'TYT' | 'YKS' | 'KPSS' | 'ALES' | 'DGS' | 'MSÜ';
    targetYear?: number;
    currentLevel: 'beginner' | 'intermediate' | 'advanced';
    weakSubjects: string[];
    strongSubjects: string[];
    interests: string[];
  };
  learningStyle: {
    visual: number; // 0-100
    auditory: number; // 0-100
    kinesthetic: number; // 0-100
    reading: number; // 0-100
  };
  goals: {
    shortTerm: string[];
    longTerm: string[];
    careerAspirations: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface TeacherProfile {
  userId: string;
  specialization: string[];
  experience: number; // years
  education: {
    degree: string;
    university: string;
    graduationYear: number;
    gpa?: number;
  }[];
  certifications: {
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
  }[];
  languages: {
    language: string;
    level: 'native' | 'fluent' | 'intermediate' | 'basic';
  }[];
  availability: {
    timeSlots: {
      day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
      startTime: string; // HH:MM format
      endTime: string; // HH:MM format
    }[];
    timezone: string;
  };
  rating: {
    average: number; // 0-5
    totalReviews: number;
    breakdown: {
      teaching: number;
      communication: number;
      punctuality: number;
      knowledge: number;
    };
  };
  bio: string;
  hourlyRate: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'mathematics' | 'science' | 'language' | 'social' | 'exam_prep' | 'foreign_language';
  subcategory: string;
  grade: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes per session
  totalSessions: number;
  price: number;
  currency: 'TRY' | 'USD' | 'EUR';
  teacherId: string;
  thumbnail?: string;
  tags: string[];
  prerequisites: string[];
  learningObjectives: string[];
  materials: {
    type: 'video' | 'document' | 'quiz' | 'assignment' | 'interactive';
    title: string;
    url?: string;
    content?: string;
  }[];
  isActive: boolean;
  isPublic: boolean;
  enrollmentCount: number;
  rating: {
    average: number;
    totalReviews: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  teacherId: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  startDate: string;
  endDate?: string;
  progress: {
    completedSessions: number;
    totalSessions: number;
    lastAccessedAt: string;
    currentSession: number;
  };
  payment: {
    amount: number;
    currency: string;
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    paymentMethod: string;
    transactionId?: string;
    paidAt?: string;
  };
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  courseId: string;
  teacherId: string;
  studentId: string;
  enrollmentId: string;
  sessionNumber: number;
  title: string;
  description: string;
  scheduledAt: string;
  duration: number; // minutes
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
  actualStartTime?: string;
  actualEndTime?: string;
  meetingLink?: string;
  recordingUrl?: string;
  materials: {
    type: 'presentation' | 'document' | 'video' | 'quiz' | 'homework';
    title: string;
    url?: string;
    content?: string;
  }[];
  homework: {
    title: string;
    description: string;
    dueDate: string;
    isCompleted: boolean;
    completedAt?: string;
    grade?: number;
    feedback?: string;
  }[];
  attendance: {
    studentPresent: boolean;
    teacherPresent: boolean;
    studentJoinTime?: string;
    teacherJoinTime?: string;
  };
  feedback: {
    studentRating?: number; // 1-5
    studentComment?: string;
    teacherNotes?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Progress {
  id: string;
  studentId: string;
  courseId: string;
  sessionId: string;
  enrollmentId: string;
  metrics: {
    timeSpent: number; // minutes
    questionsAnswered: number;
    correctAnswers: number;
    wrongAnswers: number;
    conceptsLearned: string[];
    skillsImproved: string[];
  };
  assessments: {
    type: 'quiz' | 'assignment' | 'exam' | 'project';
    title: string;
    score: number;
    maxScore: number;
    completedAt: string;
    feedback?: string;
  }[];
  aiInsights: {
    learningPattern: string;
    recommendedFocus: string[];
    estimatedMastery: number; // 0-100
    nextSteps: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'session_reminder' | 'homework_due' | 'grade_update' | 'system' | 'promotional';
  title: string;
  message: string;
  data?: {
    sessionId?: string;
    courseId?: string;
    enrollmentId?: string;
    [key: string]: any;
  };
  isRead: boolean;
  isImportant: boolean;
  scheduledFor?: string;
  sentAt?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  enrollmentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  paymentMethod: 'credit_card' | 'debit_card' | 'bank_transfer' | 'wallet' | 'installment';
  provider: 'stripe' | 'iyzico' | 'paypal' | 'manual';
  transactionId?: string;
  providerTransactionId?: string;
  metadata?: {
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
}

export interface Analytics {
  id: string;
  userId?: string;
  courseId?: string;
  sessionId?: string;
  event: 'page_view' | 'session_start' | 'session_end' | 'quiz_complete' | 'homework_submit' | 'payment_complete';
  properties: {
    [key: string]: any;
  };
  timestamp: string;
  userAgent?: string;
  ipAddress?: string;
}

// Database Collections Structure
export const COLLECTIONS = {
  USERS: 'users',
  STUDENT_PROFILES: 'studentProfiles',
  TEACHER_PROFILES: 'teacherProfiles',
  COURSES: 'courses',
  ENROLLMENTS: 'enrollments',
  SESSIONS: 'sessions',
  PROGRESS: 'progress',
  NOTIFICATIONS: 'notifications',
  PAYMENTS: 'payments',
  ANALYTICS: 'analytics',
} as const;

// Indexes for better query performance
export const INDEXES = {
  // Users
  USERS_BY_EMAIL: 'email',
  USERS_BY_ROLE: 'role',
  USERS_BY_STATUS: 'status',
  USERS_BY_CREATED_AT: 'createdAt',
  
  // Courses
  COURSES_BY_TEACHER: 'teacherId',
  COURSES_BY_CATEGORY: 'category',
  COURSES_BY_GRADE: 'grade',
  COURSES_BY_ACTIVE: 'isActive',
  
  // Enrollments
  ENROLLMENTS_BY_STUDENT: 'studentId',
  ENROLLMENTS_BY_COURSE: 'courseId',
  ENROLLMENTS_BY_STATUS: 'status',
  
  // Sessions
  SESSIONS_BY_COURSE: 'courseId',
  SESSIONS_BY_STUDENT: 'studentId',
  SESSIONS_BY_TEACHER: 'teacherId',
  SESSIONS_BY_DATE: 'scheduledAt',
  
  // Progress
  PROGRESS_BY_STUDENT: 'studentId',
  PROGRESS_BY_COURSE: 'courseId',
  
  // Notifications
  NOTIFICATIONS_BY_USER: 'userId',
  NOTIFICATIONS_BY_READ: 'isRead',
  NOTIFICATIONS_BY_TYPE: 'type',
} as const;
