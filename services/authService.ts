// Geçici Mock AuthService - Veritabanı bağlantısı olmadan test için
export interface AuthResult {
  success: boolean;
  user?: any;
  token?: string;
  error?: string;
}

export class AuthService {
  // Mock kullanıcı kaydı
  static async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'student' | 'teacher';
  }): Promise<AuthResult> {
    try {
      console.log('Mock register:', userData);
      
      // Geçici mock kullanıcı
      const mockUser = {
        id: 1,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'student',
        status: 'active',
        isEmailVerified: false,
        isPhoneVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: null,
        loginCount: 0
      };

      // Mock token
      const mockToken = 'mock-token-' + Date.now();

      return { success: true, user: mockUser, token: mockToken };
    } catch (error) {
      console.error('Mock register error:', error);
      return { success: false, error: 'Kayıt sırasında bir hata oluştu' };
    }
  }

  // Mock kullanıcı girişi
  static async login(email: string, password: string): Promise<AuthResult> {
    try {
      console.log('Mock login:', email);
      
      // Geçici mock kullanıcı
      const mockUser = {
        id: 1,
        email: email,
        firstName: 'Test',
        lastName: 'User',
        role: 'student',
        status: 'active',
        isEmailVerified: true,
        isPhoneVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        loginCount: 1
      };

      // Mock token
      const mockToken = 'mock-token-' + Date.now();

      return { success: true, user: mockUser, token: mockToken };
    } catch (error) {
      console.error('Mock login error:', error);
      return { success: false, error: 'Giriş sırasında bir hata oluştu' };
    }
  }

  // Mock token doğrulama
  static async verifyToken(token: string): Promise<any> {
    try {
      console.log('Mock verify token:', token);
      
      // Geçici mock kullanıcı
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'student',
        status: 'active',
        isEmailVerified: true,
        isPhoneVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        loginCount: 1
      };

      return mockUser;
    } catch (error) {
      console.error('Mock verify token error:', error);
      return null;
    }
  }

  // Mock şifre sıfırlama
  static async resetPassword(email: string): Promise<AuthResult> {
    try {
      console.log('Mock reset password:', email);
      return { success: true };
    } catch (error) {
      console.error('Mock reset password error:', error);
      return { success: false, error: 'Şifre sıfırlama sırasında bir hata oluştu' };
    }
  }
}