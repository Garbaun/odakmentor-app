import { Pool, PoolClient } from 'pg';

// Veritabanı konfigürasyonu
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'odakmentor_db',
  user: process.env.DB_USER || 'odakmentor',
  password: process.env.DB_PASSWORD || 'your_secure_password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Connection pool oluştur
const pool = new Pool(dbConfig);

// Veritabanı bağlantısını test et
export async function testConnection(): Promise<void> {
  try {
    const client = await pool.connect();
    console.log('✅ Veritabanı bağlantısı başarılı!');
    console.log(`📊 Veritabanı: ${dbConfig.database}`);
    console.log(`🏠 Host: ${dbConfig.host}:${dbConfig.port}`);
    client.release();
  } catch (error) {
    console.error('❌ Veritabanı bağlantı hatası:', error);
    throw error;
  }
}

// Genel veritabanı işlemleri
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
}

// Kullanıcı servisi
export class UserService {
  static async createUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    role?: 'student' | 'teacher' | 'admin';
  }): Promise<any> {
    const query = `
      INSERT INTO users (email, first_name, last_name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await DatabaseService.query(query, [
      userData.email.toLowerCase(),
      userData.firstName,
      userData.lastName,
      userData.role || 'student'
    ]);
    return result.rows[0];
  }

  static async getUserByEmail(email: string): Promise<any> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await DatabaseService.query(query, [email.toLowerCase()]);
    return result.rows[0];
  }

  static async getUser(id: number): Promise<any> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await DatabaseService.query(query, [id]);
    return result.rows[0];
  }

  static async updateLastLogin(id: number): Promise<void> {
    const query = `
      UPDATE users 
      SET last_login_at = CURRENT_TIMESTAMP, login_count = login_count + 1
      WHERE id = $1
    `;
    await DatabaseService.query(query, [id]);
  }
}

// Şifre servisi
export class PasswordService {
  static async setPassword(userId: number, passwordHash: string): Promise<void> {
    const query = `
      INSERT INTO user_passwords (user_id, password_hash)
      VALUES ($1, $2)
      ON CONFLICT (user_id)
      DO UPDATE SET password_hash = $2, updated_at = CURRENT_TIMESTAMP
    `;
    await DatabaseService.query(query, [userId, passwordHash]);
  }

  static async getPasswordHash(userId: number): Promise<string | null> {
    const query = 'SELECT password_hash FROM user_passwords WHERE user_id = $1';
    const result = await DatabaseService.query(query, [userId]);
    return result.rows[0]?.password_hash || null;
  }
}

// Pool'u kapatma fonksiyonu
export async function closePool(): Promise<void> {
  await pool.end();
}
