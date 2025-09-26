import { 
  GoogleAuthProvider, 
  signInWithCredential, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  User,
  UserCredential
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { UserService, StudentProfileService, TeacherProfileService } from './databaseService';
import { User as UserType, StudentProfile, TeacherProfile } from '@/database/schema';

export interface AuthResult {
  success: boolean;
  user?: UserType;
  error?: string;
  isNewUser?: boolean;
}

export interface GoogleAuthResult {
  success: boolean;
  user?: UserType;
  error?: string;
  isNewUser?: boolean;
}

export class AuthService {
  /**
   * Email ve şifre ile kayıt olma
   */
  static async registerWithEmail(
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string,
    role: 'student' | 'teacher' = 'student'
  ): Promise<AuthResult> {
    try {
      // Firebase Authentication ile kullanıcı oluştur
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Email doğrulama gönder
      await sendEmailVerification(firebaseUser);

      // Veritabanında kullanıcı profili oluştur
      const userData: Omit<UserType, 'id' | 'createdAt' | 'updatedAt' | 'loginCount'> = {
        email: email.toLowerCase(),
        firstName,
        lastName,
        role,
        status: 'active',
        isEmailVerified: false,
        isPhoneVerified: false,
        preferences: {
          language: 'tr',
          notifications: {
            email: true,
            sms: true,
            push: true,
          },
          privacy: {
            profileVisible: true,
            progressVisible: role === 'student' ? false : true,
          },
        },
        subscription: {
          plan: 'free',
          startDate: new Date().toISOString(),
          isActive: true,
        },
      };

      const userId = await UserService.createUser(userData);

      // Role göre detay profil oluştur
      if (role === 'student') {
        const studentProfile: Omit<StudentProfile, 'createdAt' | 'updatedAt'> = {
          userId,
          grade: 0, // Kullanıcıdan alınacak
          parentInfo: {
            name: '',
            phone: '',
            relationship: 'other',
          },
          academicInfo: {
            currentLevel: 'beginner',
            weakSubjects: [],
            strongSubjects: [],
            interests: [],
          },
          learningStyle: {
            visual: 50,
            auditory: 50,
            kinesthetic: 50,
            reading: 50,
          },
          goals: {
            shortTerm: [],
            longTerm: [],
            careerAspirations: [],
          },
        };
        await StudentProfileService.createProfile(studentProfile);
      } else if (role === 'teacher') {
        const teacherProfile: Omit<TeacherProfile, 'createdAt' | 'updatedAt'> = {
          userId,
          specialization: [],
          experience: 0,
          education: [],
          certifications: [],
          languages: [
            {
              language: 'Türkçe',
              level: 'native',
            },
          ],
          availability: {
            timeSlots: [],
            timezone: 'Europe/Istanbul',
          },
          rating: {
            average: 0,
            totalReviews: 0,
            breakdown: {
              teaching: 0,
              communication: 0,
              punctuality: 0,
              knowledge: 0,
            },
          },
          bio: '',
          hourlyRate: 0,
          isAvailable: false,
        };
        await TeacherProfileService.createProfile(teacherProfile);
      }

      // Son giriş zamanını güncelle
      await UserService.updateLastLogin(userId);

      return {
        success: true,
        user: { ...userData, id: userId },
        isNewUser: true,
      };

    } catch (error: any) {
      console.error('Kayıt hatası:', error);
      return {
        success: false,
        error: this.getErrorMessage(error.code),
      };
    }
  }

  /**
   * Email ve şifre ile giriş yapma
   */
  static async signInWithEmail(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Veritabanından kullanıcı bilgilerini al
      const user = await UserService.getUserByEmail(email.toLowerCase());
      if (!user) {
        return {
          success: false,
          error: 'Kullanıcı profili bulunamadı',
        };
      }

      // Son giriş zamanını güncelle
      await UserService.updateLastLogin(user.id);

      return {
        success: true,
        user,
        isNewUser: false,
      };

    } catch (error: any) {
      console.error('Giriş hatası:', error);
      return {
        success: false,
        error: this.getErrorMessage(error.code),
      };
    }
  }

  /**
   * Google ile giriş/kayıt yapma
   */
  static async signInWithGoogle(googleCredential: any): Promise<GoogleAuthResult> {
    try {
      // Firebase Authentication ile Google credential'ı kullan
      const credential = GoogleAuthProvider.credential(googleCredential.idToken);
      const userCredential: UserCredential = await signInWithCredential(auth, credential);
      const firebaseUser = userCredential.user;

      // Kullanıcının daha önce kayıtlı olup olmadığını kontrol et
      const existingUser = await UserService.getUserByEmail(firebaseUser.email?.toLowerCase() || '');
      
      if (existingUser) {
        // Mevcut kullanıcı - giriş yap
        await UserService.updateLastLogin(existingUser.id);
        return {
          success: true,
          user: existingUser,
          isNewUser: false,
        };
      } else {
        // Yeni kullanıcı - kayıt oluştur
        const userData: Omit<UserType, 'id' | 'createdAt' | 'updatedAt' | 'loginCount'> = {
          email: firebaseUser.email?.toLowerCase() || '',
          firstName: firebaseUser.displayName?.split(' ')[0] || 'Kullanıcı',
          lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
          profileImage: firebaseUser.photoURL || undefined,
          role: 'student', // Varsayılan olarak öğrenci
          status: 'active',
          isEmailVerified: firebaseUser.emailVerified,
          isPhoneVerified: false,
          preferences: {
            language: 'tr',
            notifications: {
              email: true,
              sms: true,
              push: true,
            },
            privacy: {
              profileVisible: true,
              progressVisible: false,
            },
          },
          subscription: {
            plan: 'free',
            startDate: new Date().toISOString(),
            isActive: true,
          },
        };

        const userId = await UserService.createUser(userData);

        // Öğrenci profili oluştur
        const studentProfile: Omit<StudentProfile, 'createdAt' | 'updatedAt'> = {
          userId,
          grade: 0, // Kullanıcıdan alınacak
          parentInfo: {
            name: '',
            phone: '',
            relationship: 'other',
          },
          academicInfo: {
            currentLevel: 'beginner',
            weakSubjects: [],
            strongSubjects: [],
            interests: [],
          },
          learningStyle: {
            visual: 50,
            auditory: 50,
            kinesthetic: 50,
            reading: 50,
          },
          goals: {
            shortTerm: [],
            longTerm: [],
            careerAspirations: [],
          },
        };
        await StudentProfileService.createProfile(studentProfile);

        // Son giriş zamanını güncelle
        await UserService.updateLastLogin(userId);

        return {
          success: true,
          user: { ...userData, id: userId },
          isNewUser: true,
        };
      }

    } catch (error: any) {
      console.error('Google giriş hatası:', error);
      return {
        success: false,
        error: this.getErrorMessage(error.code),
      };
    }
  }

  /**
   * Şifre sıfırlama emaili gönderme
   */
  static async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      console.error('Şifre sıfırlama hatası:', error);
      return {
        success: false,
        error: this.getErrorMessage(error.code),
      };
    }
  }

  /**
   * Email doğrulama gönderme
   */
  static async sendEmailVerification(): Promise<{ success: boolean; error?: string }> {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        return { success: true };
      }
      return {
        success: false,
        error: 'Kullanıcı oturum açmamış',
      };
    } catch (error: any) {
      console.error('Email doğrulama hatası:', error);
      return {
        success: false,
        error: this.getErrorMessage(error.code),
      };
    }
  }

  /**
   * Çıkış yapma
   */
  static async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      await auth.signOut();
      return { success: true };
    } catch (error: any) {
      console.error('Çıkış hatası:', error);
      return {
        success: false,
        error: 'Çıkış yapılırken bir hata oluştu',
      };
    }
  }

  /**
   * Mevcut kullanıcıyı getir
   */
  static async getCurrentUser(): Promise<UserType | null> {
    try {
      if (auth.currentUser?.email) {
        return await UserService.getUserByEmail(auth.currentUser.email.toLowerCase());
      }
      return null;
    } catch (error) {
      console.error('Mevcut kullanıcı getirme hatası:', error);
      return null;
    }
  }

  /**
   * Firebase hata kodlarını Türkçe mesajlara çevir
   */
  private static getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'Bu email adresi zaten kullanımda',
      'auth/invalid-email': 'Geçersiz email adresi',
      'auth/operation-not-allowed': 'Bu işlem şu anda izin verilmiyor',
      'auth/weak-password': 'Şifre çok zayıf. En az 6 karakter olmalı',
      'auth/user-disabled': 'Bu hesap devre dışı bırakılmış',
      'auth/user-not-found': 'Bu email adresi ile kayıtlı kullanıcı bulunamadı',
      'auth/wrong-password': 'Yanlış şifre',
      'auth/invalid-credential': 'Geçersiz kimlik bilgileri',
      'auth/too-many-requests': 'Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin',
      'auth/network-request-failed': 'Ağ bağlantısı hatası',
      'auth/requires-recent-login': 'Bu işlem için tekrar giriş yapmanız gerekiyor',
    };

    return errorMessages[errorCode] || 'Beklenmeyen bir hata oluştu';
  }
}
