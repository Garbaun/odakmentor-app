/**
 * Mock Database Service
 * 
 * Bu servis gerçek veritabanı olmadan tüm veritabanı işlemlerini simüle eder.
 * Production'da gerçek veritabanı ile değiştirilebilir.
 */

// Veri tipleri
export interface User {
  id: number;
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
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  loginCount: number;
}

export interface StudentProfile {
  id: number;
  userId: number;
  grade: number;
  school?: string;
  city?: string;
  district?: string;
  academicInfo: any;
  learningStyle: any;
  goals: any;
  parentInfo: any;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherProfile {
  id: number;
  userId: number;
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
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: number;
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
  teacherId: number;
  thumbnail?: string;
  tags: string[];
  prerequisites: string[];
  learningObjectives: string[];
  materials: any[];
  isActive: boolean;
  isPublic: boolean;
  enrollmentCount: number;
  rating: any;
  createdAt: string;
  updatedAt: string;
}

// Mock Database sınıfı
class MockDatabase {
  private users: User[] = [];
  private passwords: { userId: number; passwordHash: string }[] = [];
  private studentProfiles: StudentProfile[] = [];
  private teacherProfiles: TeacherProfile[] = [];
  private courses: Course[] = [];
  private nextId = 1;

  // Kullanıcı işlemleri
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'loginCount'>): Promise<User> {
    const user: User = {
      id: this.nextId++,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      loginCount: 0
    };
    this.users.push(user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async getUser(id: number): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return this.users[userIndex];
  }

  async updateLastLogin(id: number): Promise<void> {
    const user = this.users.find(u => u.id === id);
    if (user) {
      user.lastLoginAt = new Date().toISOString();
      user.loginCount = (user.loginCount || 0) + 1;
      user.updatedAt = new Date().toISOString();
    }
  }

  // Şifre işlemleri
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

  // Profil işlemleri
  async createStudentProfile(profileData: Omit<StudentProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<StudentProfile> {
    const profile: StudentProfile = {
      id: this.nextId++,
      ...profileData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.studentProfiles.push(profile);
    return profile;
  }

  async getStudentProfile(userId: number): Promise<StudentProfile | null> {
    return this.studentProfiles.find(profile => profile.userId === userId) || null;
  }

  async createTeacherProfile(profileData: Omit<TeacherProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<TeacherProfile> {
    const profile: TeacherProfile = {
      id: this.nextId++,
      ...profileData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.teacherProfiles.push(profile);
    return profile;
  }

  async getTeacherProfile(userId: number): Promise<TeacherProfile | null> {
    return this.teacherProfiles.find(profile => profile.userId === userId) || null;
  }

  // Kurs işlemleri
  async createCourse(courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'enrollmentCount'>): Promise<Course> {
    const course: Course = {
      id: this.nextId++,
      ...courseData,
      enrollmentCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.courses.push(course);
    return course;
  }

  async getCourse(id: number): Promise<Course | null> {
    return this.courses.find(course => course.id === id) || null;
  }

  async getCoursesByTeacher(teacherId: number): Promise<Course[]> {
    return this.courses.filter(course => course.teacherId === teacherId);
  }

  async updateCourse(id: number, updates: Partial<Course>): Promise<Course | null> {
    const courseIndex = this.courses.findIndex(course => course.id === id);
    if (courseIndex === -1) return null;
    
    this.courses[courseIndex] = {
      ...this.courses[courseIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return this.courses[courseIndex];
  }

  // Genel sorgu işlemleri
  async query(sql: string, params?: any[]): Promise<any> {
    // Mock query implementation
    if (sql.includes('SELECT * FROM users')) {
      return { rows: this.users };
    }
    if (sql.includes('DELETE FROM users')) {
      const email = params?.[0];
      const initialLength = this.users.length;
      this.users = this.users.filter(u => u.email !== email);
      return { rowCount: initialLength - this.users.length };
    }
    if (sql.includes('DELETE FROM users WHERE email LIKE')) {
      const pattern = params?.[0];
      const initialLength = this.users.length;
      this.users = this.users.filter(u => !u.email.includes(pattern.replace('%', '')));
      return { rowCount: initialLength - this.users.length };
    }
    return { rows: [], rowCount: 0 };
  }

  // Transaction işlemleri
  async transaction<T>(callback: (client: MockDatabase) => Promise<T>): Promise<T> {
    // Mock transaction implementation - gerçek transaction mantığı yok
    return await callback(this);
  }

  // Test verilerini temizle
  clear(): void {
    this.users = [];
    this.passwords = [];
    this.studentProfiles = [];
    this.teacherProfiles = [];
    this.courses = [];
    this.nextId = 1;
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

  // Tüm verileri getir
  getAllData(): any {
    return {
      users: this.users,
      studentProfiles: this.studentProfiles,
      teacherProfiles: this.teacherProfiles,
      courses: this.courses
    };
  }
}

// Singleton instance
const mockDb = new MockDatabase();

// Servis sınıfları
export class UserService {
  static async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'loginCount'>): Promise<User> {
    return await mockDb.createUser(userData);
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    return await mockDb.getUserByEmail(email);
  }

  static async getUser(id: number): Promise<User | null> {
    return await mockDb.getUser(id);
  }

  static async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    return await mockDb.updateUser(id, updates);
  }

  static async updateLastLogin(id: number): Promise<void> {
    return await mockDb.updateLastLogin(id);
  }
}

export class PasswordService {
  static async setPassword(userId: number, passwordHash: string): Promise<void> {
    return await mockDb.setPassword(userId, passwordHash);
  }

  static async getPasswordHash(userId: number): Promise<string | null> {
    return await mockDb.getPasswordHash(userId);
  }
}

export class StudentProfileService {
  static async createProfile(profileData: Omit<StudentProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<StudentProfile> {
    return await mockDb.createStudentProfile(profileData);
  }

  static async getProfile(userId: number): Promise<StudentProfile | null> {
    return await mockDb.getStudentProfile(userId);
  }
}

export class TeacherProfileService {
  static async createProfile(profileData: Omit<TeacherProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<TeacherProfile> {
    return await mockDb.createTeacherProfile(profileData);
  }

  static async getProfile(userId: number): Promise<TeacherProfile | null> {
    return await mockDb.getTeacherProfile(userId);
  }
}

export class CourseService {
  static async createCourse(courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'enrollmentCount'>): Promise<Course> {
    return await mockDb.createCourse(courseData);
  }

  static async getCourse(courseId: number): Promise<Course | null> {
    return await mockDb.getCourse(courseId);
  }

  static async getCoursesByTeacher(teacherId: number): Promise<Course[]> {
    return await mockDb.getCoursesByTeacher(teacherId);
  }

  static async updateCourse(courseId: number, updates: Partial<Course>): Promise<Course | null> {
    return await mockDb.updateCourse(courseId, updates);
  }
}

export class DatabaseService {
  static async query(text: string, params?: any[]): Promise<any> {
    return await mockDb.query(text, params);
  }

  static async transaction<T>(callback: (client: MockDatabase) => Promise<T>): Promise<T> {
    return await mockDb.transaction(callback);
  }
}

// Bağlantı testi
export async function testConnection(): Promise<void> {
  const stats = mockDb.getStats();
  console.log('✅ Mock veritabanı bağlantısı başarılı!');
  console.log(`📊 Veri sayıları:`, stats);
}

// Veritabanını temizle
export async function clearDatabase(): Promise<void> {
  mockDb.clear();
  console.log('🧹 Mock veritabanı temizlendi');
}

// Veritabanı istatistikleri
export function getDatabaseStats(): any {
  return mockDb.getStats();
}

// Tüm verileri getir
export function getAllData(): any {
  return mockDb.getAllData();
}

export default mockDb;
