import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '@/services/authService';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher' | 'admin';
  status: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  loginCount: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, firstName: string, lastName: string, role?: 'student' | 'teacher') => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Token kontrolü
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
          const userData = await AuthService.verifyToken(storedToken);
          if (userData) {
            setUser(userData);
            setToken(storedToken);
          } else {
            localStorage.removeItem('auth_token');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await AuthService.login(email, password);
      if (result.success && result.user && result.token) {
        setUser(result.user);
        setToken(result.token);
        localStorage.setItem('auth_token', result.token);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Giriş sırasında bir hata oluştu' };
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, role: 'student' | 'teacher' = 'student') => {
    try {
      const result = await AuthService.register({ email, password, firstName, lastName, role });
      if (result.success && result.user && result.token) {
        setUser(result.user);
        setToken(result.token);
        localStorage.setItem('auth_token', result.token);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Kayıt sırasında bir hata oluştu' };
    }
  };

  const signOut = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  const resetPassword = async (email: string) => {
    try {
      const result = await AuthService.resetPassword(email);
      return { success: result.success, error: result.error };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'Şifre sıfırlama sırasında bir hata oluştu' };
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
