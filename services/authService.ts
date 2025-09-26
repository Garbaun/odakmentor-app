import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserService, PasswordService } from './databaseService';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export interface AuthResult {
  success: boolean;
  user?: any;
  token?: string;
  error?: string;
}

export class AuthService {
  // Kullanıcı kaydı
  static async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'student' | 'teacher';
  }): Promise<AuthResult> {
    try {
      // Email kontrolü
      const existingUser = await UserService.getUserByEmail(userData.email);
      if (existingUser) {
        return { success: false, error: 'Bu email adresi zaten kullanılıyor' };
      }

      // Kullanıcı oluştur
      const user = await UserService.createUser({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'student'
      });

      // Şifre hash'le ve kaydet
      const passwordHash = await bcrypt.hash(userData.password, 12);
      await PasswordService.setPassword(user.id, passwordHash);

      // Token oluştur
      const token = this.generateToken(user.id, user.email, user.role);

      return { success: true, user, token };
    } catch (error) {
      console.error('Kayıt hatası:', error);
      return { success: false, error: 'Kayıt sırasında bir hata oluştu' };
    }
  }

  // Kullanıcı girişi
  static async login(email: string, password: string): Promise<AuthResult> {
    try {
      // Kullanıcıyı bul
      const user = await UserService.getUserByEmail(email);
      if (!user) {
        return { success: false, error: 'Geçersiz email veya şifre' };
      }

      // Şifre kontrolü
      const passwordHash = await PasswordService.getPasswordHash(user.id);
      if (!passwordHash) {
        return { success: false, error: 'Şifre bulunamadı' };
      }

      const isValidPassword = await bcrypt.compare(password, passwordHash);
      if (!isValidPassword) {
        return { success: false, error: 'Geçersiz email veya şifre' };
      }

      // Son giriş tarihini güncelle
      await UserService.updateLastLogin(user.id);

      // Token oluştur
      const token = this.generateToken(user.id, user.email, user.role);

      return { success: true, user, token };
    } catch (error) {
      console.error('Giriş hatası:', error);
      return { success: false, error: 'Giriş sırasında bir hata oluştu' };
    }
  }

  // Token doğrulama
  static async verifyToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = await UserService.getUser(decoded.userId);
      return user;
    } catch (error) {
      console.error('Token doğrulama hatası:', error);
      return null;
    }
  }

  // Token oluşturma
  private static generateToken(userId: number, email: string, role: string): string {
    return jwt.sign(
      { userId, email, role, iat: Math.floor(Date.now() / 1000) },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  // Şifre sıfırlama
  static async resetPassword(email: string): Promise<AuthResult> {
    try {
      const user = await UserService.getUserByEmail(email);
      if (!user) {
        return { success: false, error: 'Bu email adresi bulunamadı' };
      }

      // TODO: Email gönderme işlemi burada yapılacak
      console.log(`Şifre sıfırlama linki gönderildi: ${email}`);

      return { success: true };
    } catch (error) {
      console.error('Şifre sıfırlama hatası:', error);
      return { success: false, error: 'Şifre sıfırlama sırasında bir hata oluştu' };
    }
  }
}