/**
 * SQLite Database Service
 * 
 * SQLite ile gerçek veritabanı işlemleri
 * Ubuntu cihazınızda sorunsuz çalışır
 */

import Database from 'better-sqlite3';
import { join } from 'path';

// SQLite veritabanı sınıfı
class SQLiteDatabaseService {
  private db: Database.Database;

  constructor(dbPath: string = './data/odakmentor.db') {
    // Veri klasörünü oluştur
    const fs = require('fs');
    const dataDir = './data';
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    this.db = new Database(dbPath);
    this.initializeTables();
  }

  private initializeTables(): void {
    // Kullanıcılar tablosu
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT,
        country_code TEXT,
        date_of_birth TEXT,
        gender TEXT CHECK(gender IN ('male', 'female', 'other')),
        role TEXT CHECK(role IN ('student', 'teacher', 'admin')) NOT NULL,
        status TEXT CHECK(status IN ('active', 'inactive', 'suspended')) NOT NULL,
        is_email_verified BOOLEAN DEFAULT 0,
        is_phone_verified BOOLEAN DEFAULT 0,
        preferences TEXT, -- JSON
        subscription TEXT, -- JSON
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login_at DATETIME,
        login_count INTEGER DEFAULT 0
      )
    `);

    // Öğrenci profilleri
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS student_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        grade INTEGER NOT NULL,
        school TEXT,
        city TEXT,
        district TEXT,
        academic_info TEXT, -- JSON
        learning_style TEXT, -- JSON
        goals TEXT, -- JSON
        parent_info TEXT, -- JSON
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Öğretmen profilleri
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS teacher_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        specialization TEXT, -- JSON array
        experience INTEGER NOT NULL,
        education TEXT, -- JSON array
        certifications TEXT, -- JSON array
        languages TEXT, -- JSON array
        availability TEXT, -- JSON
        rating TEXT, -- JSON
        bio TEXT,
        hourly_rate REAL NOT NULL,
        is_available BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Kurslar
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        subcategory TEXT NOT NULL,
        grade INTEGER NOT NULL,
        level TEXT NOT NULL,
        duration INTEGER NOT NULL, -- dakika
        total_sessions INTEGER NOT NULL,
        price REAL NOT NULL,
        currency TEXT DEFAULT 'TRY',
        teacher_id INTEGER NOT NULL,
        thumbnail TEXT,
        tags TEXT, -- JSON array
        prerequisites TEXT, -- JSON array
        learning_objectives TEXT, -- JSON array
        materials TEXT, -- JSON array
        is_active BOOLEAN DEFAULT 1,
        is_public BOOLEAN DEFAULT 1,
        enrollment_count INTEGER DEFAULT 0,
        rating TEXT, -- JSON
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_id) REFERENCES users (id)
      )
    `);

    // Sınavlar/Quizler
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        course_id INTEGER NOT NULL,
        time_limit INTEGER NOT NULL, -- dakika
        passing_score INTEGER NOT NULL, -- yüzde
        attempts INTEGER DEFAULT 1,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses (id)
      )
    `);

    // Sorular
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quiz_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        type TEXT CHECK(type IN ('multiple_choice', 'true_false', 'fill_blank', 'essay')) NOT NULL,
        options TEXT, -- JSON array
        correct_answer TEXT NOT NULL,
        points INTEGER DEFAULT 1,
        explanation TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (quiz_id) REFERENCES quizzes (id)
      )
    `);

    // Öğrenci ilerlemesi
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS student_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        lesson_id INTEGER,
        quiz_id INTEGER,
        status TEXT CHECK(status IN ('not_started', 'in_progress', 'completed', 'failed')) NOT NULL,
        score INTEGER,
        time_spent INTEGER DEFAULT 0, -- dakika
        completed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users (id),
        FOREIGN KEY (course_id) REFERENCES courses (id),
        FOREIGN KEY (quiz_id) REFERENCES quizzes (id)
      )
    `);

    // Ödemeler
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        course_id INTEGER,
        amount REAL NOT NULL,
        currency TEXT DEFAULT 'TRY',
        status TEXT CHECK(status IN ('pending', 'completed', 'failed', 'refunded')) NOT NULL,
        payment_method TEXT NOT NULL,
        transaction_id TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (course_id) REFERENCES courses (id)
      )
    `);

    // Bildirimler
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT CHECK(type IN ('info', 'success', 'warning', 'error')) NOT NULL,
        is_read BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Dökümanlar
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        course_id INTEGER,
        file_path TEXT NOT NULL,
        file_type TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        uploaded_by INTEGER NOT NULL,
        is_public BOOLEAN DEFAULT 0,
        download_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses (id),
        FOREIGN KEY (uploaded_by) REFERENCES users (id)
      )
    `);

    // İndeksler
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
      CREATE INDEX IF NOT EXISTS idx_courses_teacher ON courses (teacher_id);
      CREATE INDEX IF NOT EXISTS idx_courses_category ON courses (category);
      CREATE INDEX IF NOT EXISTS idx_quizzes_course ON quizzes (course_id);
      CREATE INDEX IF NOT EXISTS idx_questions_quiz ON questions (quiz_id);
      CREATE INDEX IF NOT EXISTS idx_progress_student ON student_progress (student_id);
      CREATE INDEX IF NOT EXISTS idx_progress_course ON student_progress (course_id);
      CREATE INDEX IF NOT EXISTS idx_payments_user ON payments (user_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id);
      CREATE INDEX IF NOT EXISTS idx_documents_course ON documents (course_id);
    `);
  }

  // Genel sorgu metodu
  query(sql: string, params: any[] = []): any {
    try {
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        const stmt = this.db.prepare(sql);
        return { rows: stmt.all(params) };
      } else {
        const stmt = this.db.prepare(sql);
        const result = stmt.run(params);
        return { 
          rowCount: result.changes,
          lastInsertRowid: result.lastInsertRowid 
        };
      }
    } catch (error) {
      console.error('SQLite sorgu hatası:', error);
      throw error;
    }
  }

  // Transaction metodu
  transaction<T>(callback: (db: SQLiteDatabaseService) => T): T {
    const transaction = this.db.transaction(callback);
    return transaction(this);
  }

  // Bağlantıyı kapat
  close(): void {
    this.db.close();
  }

  // Veritabanı durumu
  getStatus(): any {
    try {
      const result = this.query('SELECT COUNT(*) as table_count FROM sqlite_master WHERE type="table"');
      return {
        connected: true,
        tableCount: result.rows[0].table_count,
        databasePath: this.db.name
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message
      };
    }
  }
}

export default SQLiteDatabaseService;
