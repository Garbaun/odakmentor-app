/**
 * PostgreSQL Database Service
 * 
 * Ubuntu cihazınızdaki PostgreSQL veritabanı ile çalışır
 */

import { config } from 'dotenv';
import { Pool, PoolClient } from 'pg';
config();

// Veritabanı konfigürasyonu
const dbConfig = {
  host: process.env.DB_HOST || '192.168.1.200',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'odakmentor_db',
  user: process.env.DB_USER || 'odakmentor',
  password: process.env.DB_PASSWORD || 'OdakMentor2024!DB',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Pool oluştur
const pool = new Pool(dbConfig);

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

export interface Quiz {
  id: number;
  title: string;
  description: string;
  courseId: number;
  timeLimit: number;
  passingScore: number;
  attempts: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: number;
  quizId: number;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'essay';
  options: string[];
  correctAnswer: string | number;
  points: number;
  explanation?: string;
  createdAt: string;
}

export interface StudentProgress {
  id: number;
  studentId: number;
  courseId: number;
  lessonId?: number;
  quizId?: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  score?: number;
  timeSpent: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: number;
  userId: number;
  courseId?: number;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface Document {
  id: number;
  title: string;
  description: string;
  courseId?: number;
  filePath: string;
  fileType: string;
  fileSize: number;
  uploadedBy: number;
  isPublic: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

// Genel Database Service
export class DatabaseService {
  static async query(text: string, params?: any[]): Promise<any> {
    const client = await pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  static async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async testConnection(): Promise<void> {
    try {
      const result = await this.query('SELECT NOW() as current_time');
      console.log('✅ PostgreSQL bağlantısı başarılı!');
      console.log('🕐 Sunucu saati:', result.rows[0].current_time);
    } catch (error) {
      console.error('❌ PostgreSQL bağlantı hatası:', error);
      throw error;
    }
  }

  static async close(): Promise<void> {
    await pool.end();
  }
}

// Kullanıcı Servisi
export class UserService {
  static async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'loginCount'>): Promise<User> {
    const query = `
      INSERT INTO users (email, first_name, last_name, phone, country_code, date_of_birth, gender, role, status, is_email_verified, is_phone_verified, preferences, subscription)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
    
    const values = [
      userData.email,
      userData.firstName,
      userData.lastName,
      userData.phone,
      userData.countryCode,
      userData.dateOfBirth,
      userData.gender,
      userData.role,
      userData.status,
      userData.isEmailVerified,
      userData.isPhoneVerified,
      JSON.stringify(userData.preferences),
      JSON.stringify(userData.subscription)
    ];

    const result = await DatabaseService.query(query, values);
    return this.mapUserFromDb(result.rows[0]);
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await DatabaseService.query(query, [email]);
    return result.rows.length > 0 ? this.mapUserFromDb(result.rows[0]) : null;
  }

  static async getUser(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await DatabaseService.query(query, [id]);
    return result.rows.length > 0 ? this.mapUserFromDb(result.rows[0]) : null;
  }

  static async updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && value !== undefined) {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(typeof value === 'object' ? JSON.stringify(value) : value);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await DatabaseService.query(query, values);
    return result.rows.length > 0 ? this.mapUserFromDb(result.rows[0]) : null;
  }

  static async updateLastLogin(id: number): Promise<void> {
    const query = `
      UPDATE users 
      SET last_login_at = NOW(), login_count = login_count + 1, updated_at = NOW()
      WHERE id = $1
    `;
    await DatabaseService.query(query, [id]);
  }

  private static mapUserFromDb(row: any): User {
    return {
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      phone: row.phone,
      countryCode: row.country_code,
      dateOfBirth: row.date_of_birth,
      gender: row.gender,
      role: row.role,
      status: row.status,
      isEmailVerified: row.is_email_verified,
      isPhoneVerified: row.is_phone_verified,
      preferences: row.preferences || {},
      subscription: row.subscription || {},
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lastLoginAt: row.last_login_at,
      loginCount: row.login_count
    };
  }
}

// Şifre Servisi
export class PasswordService {
  static async setPassword(userId: number, passwordHash: string): Promise<void> {
    const query = `
      INSERT INTO passwords (user_id, password_hash) 
      VALUES ($1, $2) 
      ON CONFLICT (user_id) 
      DO UPDATE SET password_hash = $2, updated_at = NOW()
    `;
    await DatabaseService.query(query, [userId, passwordHash]);
  }

  static async getPasswordHash(userId: number): Promise<string | null> {
    const query = 'SELECT password_hash FROM passwords WHERE user_id = $1';
    const result = await DatabaseService.query(query, [userId]);
    return result.rows.length > 0 ? result.rows[0].password_hash : null;
  }
}

// Öğrenci Profil Servisi
export class StudentProfileService {
  static async createProfile(profileData: Omit<StudentProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<StudentProfile> {
    const query = `
      INSERT INTO student_profiles (user_id, grade, school, city, district, academic_info, learning_style, goals, parent_info)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const values = [
      profileData.userId,
      profileData.grade,
      profileData.school,
      profileData.city,
      profileData.district,
      JSON.stringify(profileData.academicInfo),
      JSON.stringify(profileData.learningStyle),
      JSON.stringify(profileData.goals),
      JSON.stringify(profileData.parentInfo)
    ];

    const result = await DatabaseService.query(query, values);
    return this.mapProfileFromDb(result.rows[0]);
  }

  static async getProfile(userId: number): Promise<StudentProfile | null> {
    const query = 'SELECT * FROM student_profiles WHERE user_id = $1';
    const result = await DatabaseService.query(query, [userId]);
    return result.rows.length > 0 ? this.mapProfileFromDb(result.rows[0]) : null;
  }

  private static mapProfileFromDb(row: any): StudentProfile {
    return {
      id: row.id,
      userId: row.user_id,
      grade: row.grade,
      school: row.school,
      city: row.city,
      district: row.district,
      academicInfo: row.academic_info || {},
      learningStyle: row.learning_style || {},
      goals: row.goals || {},
      parentInfo: row.parent_info || {},
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

// Öğretmen Profil Servisi
export class TeacherProfileService {
  static async createProfile(profileData: Omit<TeacherProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<TeacherProfile> {
    const query = `
      INSERT INTO teacher_profiles (user_id, specialization, experience, education, certifications, languages, availability, rating, bio, hourly_rate, is_available)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    
    const values = [
      profileData.userId,
      JSON.stringify(profileData.specialization),
      profileData.experience,
      JSON.stringify(profileData.education),
      JSON.stringify(profileData.certifications),
      JSON.stringify(profileData.languages),
      JSON.stringify(profileData.availability),
      JSON.stringify(profileData.rating),
      profileData.bio,
      profileData.hourlyRate,
      profileData.isAvailable
    ];

    const result = await DatabaseService.query(query, values);
    return this.mapProfileFromDb(result.rows[0]);
  }

  static async getProfile(userId: number): Promise<TeacherProfile | null> {
    const query = 'SELECT * FROM teacher_profiles WHERE user_id = $1';
    const result = await DatabaseService.query(query, [userId]);
    return result.rows.length > 0 ? this.mapProfileFromDb(result.rows[0]) : null;
  }

  private static mapProfileFromDb(row: any): TeacherProfile {
    return {
      id: row.id,
      userId: row.user_id,
      specialization: row.specialization || [],
      experience: row.experience,
      education: row.education || [],
      certifications: row.certifications || [],
      languages: row.languages || [],
      availability: row.availability || {},
      rating: row.rating || {},
      bio: row.bio,
      hourlyRate: row.hourly_rate,
      isAvailable: row.is_available,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

// Kurs Servisi
export class CourseService {
  static async createCourse(courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'enrollmentCount'>): Promise<Course> {
    const query = `
      INSERT INTO courses (title, description, category, subcategory, grade, level, duration, total_sessions, price, currency, teacher_id, thumbnail, tags, prerequisites, learning_objectives, materials, is_active, is_public, rating)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *
    `;
    
    const values = [
      courseData.title,
      courseData.description,
      courseData.category,
      courseData.subcategory,
      courseData.grade,
      courseData.level,
      courseData.duration,
      courseData.totalSessions,
      courseData.price,
      courseData.currency,
      courseData.teacherId,
      courseData.thumbnail,
      JSON.stringify(courseData.tags),
      JSON.stringify(courseData.prerequisites),
      JSON.stringify(courseData.learningObjectives),
      JSON.stringify(courseData.materials),
      courseData.isActive,
      courseData.isPublic,
      JSON.stringify(courseData.rating)
    ];

    const result = await DatabaseService.query(query, values);
    return this.mapCourseFromDb(result.rows[0]);
  }

  static async getCourse(courseId: number): Promise<Course | null> {
    const query = 'SELECT * FROM courses WHERE id = $1';
    const result = await DatabaseService.query(query, [courseId]);
    return result.rows.length > 0 ? this.mapCourseFromDb(result.rows[0]) : null;
  }

  static async getCoursesByTeacher(teacherId: number): Promise<Course[]> {
    const query = 'SELECT * FROM courses WHERE teacher_id = $1 ORDER BY created_at DESC';
    const result = await DatabaseService.query(query, [teacherId]);
    return result.rows.map((row: any) => this.mapCourseFromDb(row));
  }

  static async updateCourse(courseId: number, updates: Partial<Course>): Promise<Course | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && value !== undefined) {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(typeof value === 'object' ? JSON.stringify(value) : value);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    fields.push(`updated_at = NOW()`);
    values.push(courseId);

    const query = `UPDATE courses SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await DatabaseService.query(query, values);
    return result.rows.length > 0 ? this.mapCourseFromDb(result.rows[0]) : null;
  }

  private static mapCourseFromDb(row: any): Course {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      subcategory: row.subcategory,
      grade: row.grade,
      level: row.level,
      duration: row.duration,
      totalSessions: row.total_sessions,
      price: row.price,
      currency: row.currency,
      teacherId: row.teacher_id,
      thumbnail: row.thumbnail,
      tags: row.tags || [],
      prerequisites: row.prerequisites || [],
      learningObjectives: row.learning_objectives || [],
      materials: row.materials || [],
      isActive: row.is_active,
      isPublic: row.is_public,
      enrollmentCount: row.enrollment_count,
      rating: row.rating || {},
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

// Blog Service
export class BlogService {
  static async getBlogPost(id: number): Promise<any> {
    const query = 'SELECT * FROM blog_posts WHERE id = $1';
    const result = await DatabaseService.query(query, [id]);
    return result.rows[0];
  }

  static async updateBlogPost(id: number, data: any): Promise<any> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id') {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `UPDATE blog_posts SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await DatabaseService.query(query, values);
    return result.rows[0];
  }

  static async createBlogPost(data: any): Promise<any> {
    const query = `
      INSERT INTO blog_posts (title, content, author_id, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *
    `;
    const values = [data.title, data.content, data.authorId || 1, data.status || 'draft'];
    const result = await DatabaseService.query(query, values);
    return result.rows[0];
  }

  static async getAllBlogPosts(): Promise<any[]> {
    const query = 'SELECT * FROM blog_posts ORDER BY created_at DESC';
    const result = await DatabaseService.query(query);
    return result.rows;
  }

  static async deleteBlogPost(id: number): Promise<boolean> {
    const query = 'DELETE FROM blog_posts WHERE id = $1';
    const result = await DatabaseService.query(query, [id]);
    return result.rowCount > 0;
  }

  static async togglePublishStatus(id: number, published: boolean): Promise<any> {
    const query = 'UPDATE blog_posts SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *';
    const status = published ? 'published' : 'draft';
    const result = await DatabaseService.query(query, [status, id]);
    return result.rows[0];
  }
}

// Settings Service
export class SettingsService {
  static async getSetting(key: string): Promise<any> {
    const query = 'SELECT * FROM settings WHERE key = $1';
    const result = await DatabaseService.query(query, [key]);
    return result.rows[0];
  }

  static async setSetting(key: string, value: any): Promise<any> {
    const query = `
      INSERT INTO settings (key, value, updated_at) 
      VALUES ($1, $2, NOW()) 
      ON CONFLICT (key) 
      DO UPDATE SET value = $2, updated_at = NOW() 
      RETURNING *
    `;
    const result = await DatabaseService.query(query, [key, JSON.stringify(value)]);
    return result.rows[0];
  }

  static async getAllSettings(): Promise<any[]> {
    const query = 'SELECT * FROM settings ORDER BY key';
    const result = await DatabaseService.query(query);
    return result.rows;
  }
}

export default DatabaseService;
