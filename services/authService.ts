// Gerçek AuthService - Backend API ile konuşur ve Zustand durumunu günceller
import { useAuthStore } from '@/store/authStore';

export interface AuthResult {
  success: boolean;
  user?: any;
  token?: string;
  error?: string;
}

const API_BASE = (process.env.EXPO_PUBLIC_API_BASE || '/api').replace(/\/$/, '');

async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    credentials: 'include',
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data && (data.error || data.message)) || `HTTP ${res.status}`);
  }
  return data as T;
}

export class AuthService {
  static async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'student' | 'teacher' | 'admin';
  }): Promise<AuthResult> {
    try {
      const resp = await http<AuthResult>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      if (resp.success && resp.token && resp.user) {
        localStorage.setItem('auth_token', resp.token);
        const displayName = `${resp.user.firstName || ''} ${resp.user.lastName || ''}`.trim();
        useAuthStore.getState().setUser({
          uid: String(resp.user.id),
          email: resp.user.email,
          displayName,
        } as any);
        useAuthStore.getState().setUserProfile({
          uid: String(resp.user.id),
          email: resp.user.email,
          displayName,
          role: resp.user.role,
          createdAt: new Date(),
        } as any);
      }
      return resp;
    } catch (error: any) {
      return { success: false, error: error.message || 'Kayıt sırasında bir hata oluştu' };
    }
  }

  static async signInWithEmail(email: string, password: string): Promise<AuthResult> {
    return this.login(email, password);
  }

  static async login(email: string, password: string): Promise<AuthResult> {
    try {
      const resp = await http<AuthResult>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (resp.success && resp.token && resp.user) {
        localStorage.setItem('auth_token', resp.token);
        const displayName = `${resp.user.firstName || ''} ${resp.user.lastName || ''}`.trim();
        useAuthStore.getState().setUser({
          uid: String(resp.user.id),
          email: resp.user.email,
          displayName,
        } as any);
        useAuthStore.getState().setUserProfile({
          uid: String(resp.user.id),
          email: resp.user.email,
          displayName,
          role: resp.user.role,
          createdAt: new Date(),
        } as any);
      }
      return resp;
    } catch (error: any) {
      return { success: false, error: error.message || 'Giriş sırasında bir hata oluştu' };
    }
  }

  static async verifyToken(token: string): Promise<any> {
    try {
      const resp = await http<{ success: boolean; user?: any }>('/auth/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      return resp.success ? resp.user : null;
    } catch {
      return null;
    }
  }

  static async resetPassword(email: string): Promise<AuthResult> {
    try {
      const resp = await http<AuthResult>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      return resp;
    } catch (error: any) {
      return { success: false, error: error.message || 'Şifre sıfırlama sırasında bir hata oluştu' };
    }
  }

  static async signInWithGoogle(_idToken: any): Promise<AuthResult> {
    // Gelecekte OAuth backend ile entegre edilecek
    return { success: false, error: 'Google girişi henüz aktif değil' };
  }
}