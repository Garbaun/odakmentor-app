/**
 * Hybrid Database Service
 * 
 * Mock database ile SQLite'ı birleştiren hibrit çözüm
 * Geliştirme aşamasında mock, production'da SQLite kullanır
 */

import { existsSync } from 'fs';
import SQLiteDatabaseService from './sqliteDatabaseService';
import mockDb from './mockDatabaseService';

// Hibrit veritabanı sınıfı
class HybridDatabaseService {
  private sqliteDb?: SQLiteDatabaseService;
  private useMock: boolean;

  constructor(useMock: boolean = process.env.NODE_ENV === 'development') {
    this.useMock = useMock;
    
    if (!useMock) {
      try {
        this.sqliteDb = new SQLiteDatabaseService();
        console.log('✅ SQLite veritabanı bağlandı');
      } catch (error) {
        console.warn('⚠️ SQLite bağlantısı başarısız, mock database kullanılıyor:', error);
        this.useMock = true;
      }
    }
  }

  // Kullanıcı işlemleri
  async createUser(userData: any): Promise<any> {
    if (this.useMock) {
      return await mockDb.createUser(userData);
    } else {
      const sql = `
        INSERT INTO users (email, first_name, last_name, phone, country_code, date_of_birth, gender, role, status, is_email_verified, is_phone_verified, preferences, subscription)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [
        userData.email,
        userData.firstName,
        userData.lastName,
        userData.phone || null,
        userData.countryCode || null,
        userData.dateOfBirth || null,
        userData.gender || null,
        userData.role,
        userData.status,
        userData.isEmailVerified ? 1 : 0,
        userData.isPhoneVerified ? 1 : 0,
        JSON.stringify(userData.preferences || {}),
        JSON.stringify(userData.subscription || {})
      ];
      
      const result = this.sqliteDb!.query(sql, params);
      return { id: result.lastInsertRowid, ...userData };
    }
  }

  async getUserByEmail(email: string): Promise<any> {
    if (this.useMock) {
      return await mockDb.getUserByEmail(email);
    } else {
      const sql = 'SELECT * FROM users WHERE email = ?';
      const result = this.sqliteDb!.query(sql, [email]);
      return result.rows[0] || null;
    }
  }

  async getUser(id: number): Promise<any> {
    if (this.useMock) {
      return await mockDb.getUser(id);
    } else {
      const sql = 'SELECT * FROM users WHERE id = ?';
      const result = this.sqliteDb!.query(sql, [id]);
      return result.rows[0] || null;
    }
  }

  // Kurs işlemleri
  async createCourse(courseData: any): Promise<any> {
    if (this.useMock) {
      return await mockDb.createCourse(courseData);
    } else {
      const sql = `
        INSERT INTO courses (title, description, category, subcategory, grade, level, duration, total_sessions, price, currency, teacher_id, thumbnail, tags, prerequisites, learning_objectives, materials, is_active, is_public, enrollment_count, rating)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [
        courseData.title,
        courseData.description,
        courseData.category,
        courseData.subcategory,
        courseData.grade,
        courseData.level,
        courseData.duration,
        courseData.totalSessions,
        courseData.price,
        courseData.currency || 'TRY',
        courseData.teacherId,
        courseData.thumbnail || null,
        JSON.stringify(courseData.tags || []),
        JSON.stringify(courseData.prerequisites || []),
        JSON.stringify(courseData.learningObjectives || []),
        JSON.stringify(courseData.materials || []),
        courseData.isActive ? 1 : 0,
        courseData.isPublic ? 1 : 0,
        courseData.enrollmentCount || 0,
        JSON.stringify(courseData.rating || {})
      ];
      
      const result = this.sqliteDb!.query(sql, params);
      return { id: result.lastInsertRowid, ...courseData };
    }
  }

  async getCourse(id: number): Promise<any> {
    if (this.useMock) {
      return await mockDb.getCourse(id);
    } else {
      const sql = 'SELECT * FROM courses WHERE id = ?';
      const result = this.sqliteDb!.query(sql, [id]);
      return result.rows[0] || null;
    }
  }

  async getCoursesByTeacher(teacherId: number): Promise<any[]> {
    if (this.useMock) {
      return await mockDb.getCoursesByTeacher(teacherId);
    } else {
      const sql = 'SELECT * FROM courses WHERE teacher_id = ?';
      const result = this.sqliteDb!.query(sql, [teacherId]);
      return result.rows;
    }
  }

  // Sınav/Quiz işlemleri
  async createQuiz(quizData: any): Promise<any> {
    if (this.useMock) {
      // Mock database'de quiz desteği yok, basit implementasyon
      return { id: Date.now(), ...quizData };
    } else {
      const sql = `
        INSERT INTO quizzes (title, description, course_id, time_limit, passing_score, attempts, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [
        quizData.title,
        quizData.description || '',
        quizData.courseId,
        quizData.timeLimit,
        quizData.passingScore,
        quizData.attempts || 1,
        quizData.isActive ? 1 : 0
      ];
      
      const result = this.sqliteDb!.query(sql, params);
      return { id: result.lastInsertRowid, ...quizData };
    }
  }

  async getQuizzesByCourse(courseId: number): Promise<any[]> {
    if (this.useMock) {
      return []; // Mock database'de quiz desteği yok
    } else {
      const sql = 'SELECT * FROM quizzes WHERE course_id = ? AND is_active = 1';
      const result = this.sqliteDb!.query(sql, [courseId]);
      return result.rows;
    }
  }

  // İlerleme takibi
  async createProgress(progressData: any): Promise<any> {
    if (this.useMock) {
      // Mock database'de progress desteği yok, basit implementasyon
      return { id: Date.now(), ...progressData };
    } else {
      const sql = `
        INSERT INTO student_progress (student_id, course_id, lesson_id, quiz_id, status, score, time_spent, completed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [
        progressData.studentId,
        progressData.courseId,
        progressData.lessonId || null,
        progressData.quizId || null,
        progressData.status,
        progressData.score || null,
        progressData.timeSpent || 0,
        progressData.completedAt || null
      ];
      
      const result = this.sqliteDb!.query(sql, params);
      return { id: result.lastInsertRowid, ...progressData };
    }
  }

  async getStudentProgress(studentId: number, courseId?: number): Promise<any[]> {
    if (this.useMock) {
      return []; // Mock database'de progress desteği yok
    } else {
      let sql = 'SELECT * FROM student_progress WHERE student_id = ?';
      const params = [studentId];
      
      if (courseId) {
        sql += ' AND course_id = ?';
        params.push(courseId);
      }
      
      const result = this.sqliteDb!.query(sql, params);
      return result.rows;
    }
  }

  // Genel sorgu metodu
  async query(sql: string, params: any[] = []): Promise<any> {
    if (this.useMock) {
      return await mockDb.query(sql, params);
    } else {
      return this.sqliteDb!.query(sql, params);
    }
  }

  // Transaction metodu
  async transaction<T>(callback: (db: HybridDatabaseService) => Promise<T>): Promise<T> {
    if (this.useMock) {
      return await mockDb.transaction(callback as any);
    } else {
      return this.sqliteDb!.transaction(callback as any);
    }
  }

  // Veritabanı durumu
  getStatus(): any {
    if (this.useMock) {
      return {
        type: 'mock',
        connected: true,
        stats: mockDb.getStats()
      };
    } else {
      return {
        type: 'sqlite',
        ...this.sqliteDb!.getStatus()
      };
    }
  }

  // Bağlantıyı kapat
  close(): void {
    if (!this.useMock && this.sqliteDb) {
      this.sqliteDb.close();
    }
  }
}

export default HybridDatabaseService;
