import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  Timestamp,
  writeBatch,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { 
  User, 
  StudentProfile, 
  TeacherProfile, 
  Course, 
  Enrollment, 
  Session, 
  Progress, 
  Notification, 
  Payment, 
  Analytics,
  COLLECTIONS 
} from '@/database/schema';

// Utility function to convert Firestore timestamps
const convertTimestamp = (timestamp: any): string => {
  if (timestamp?.toDate) {
    return timestamp.toDate().toISOString();
  }
  return timestamp;
};

// User Service
export class UserService {
  static async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'loginCount'>): Promise<string> {
    const now = new Date().toISOString();
    const userWithTimestamps = {
      ...userData,
      createdAt: now,
      updatedAt: now,
      loginCount: 0,
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.USERS), userWithTimestamps);
    return docRef.id;
  }

  static async getUser(userId: string): Promise<User | null> {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        lastLoginAt: data.lastLoginAt ? convertTimestamp(data.lastLoginAt) : undefined,
      } as User;
    }
    return null;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const q = query(collection(db, COLLECTIONS.USERS), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        lastLoginAt: data.lastLoginAt ? convertTimestamp(data.lastLoginAt) : undefined,
      } as User;
    }
    return null;
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }

  static async updateLastLogin(userId: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(docRef, {
      lastLoginAt: new Date().toISOString(),
      loginCount: await this.incrementLoginCount(userId),
    });
  }

  private static async incrementLoginCount(userId: string): Promise<number> {
    const user = await this.getUser(userId);
    return user ? user.loginCount + 1 : 1;
  }

  static async getUsersByRole(role: 'student' | 'teacher' | 'admin'): Promise<User[]> {
    const q = query(collection(db, COLLECTIONS.USERS), where('role', '==', role));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        lastLoginAt: data.lastLoginAt ? convertTimestamp(data.lastLoginAt) : undefined,
      } as User;
    });
  }
}

// Student Profile Service
export class StudentProfileService {
  static async createProfile(profileData: Omit<StudentProfile, 'createdAt' | 'updatedAt'>): Promise<void> {
    const now = new Date().toISOString();
    const profileWithTimestamps = {
      ...profileData,
      createdAt: now,
      updatedAt: now,
    };
    
    await addDoc(collection(db, COLLECTIONS.STUDENT_PROFILES), profileWithTimestamps);
  }

  static async getProfile(userId: string): Promise<StudentProfile | null> {
    const q = query(collection(db, COLLECTIONS.STUDENT_PROFILES), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      } as StudentProfile;
    }
    return null;
  }

  static async updateProfile(userId: string, updates: Partial<StudentProfile>): Promise<void> {
    const q = query(collection(db, COLLECTIONS.STUDENT_PROFILES), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docRef = doc(db, COLLECTIONS.STUDENT_PROFILES, querySnapshot.docs[0].id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    }
  }
}

// Course Service
export class CourseService {
  static async createCourse(courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'enrollmentCount'>): Promise<string> {
    const now = new Date().toISOString();
    const courseWithTimestamps = {
      ...courseData,
      createdAt: now,
      updatedAt: now,
      enrollmentCount: 0,
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.COURSES), courseWithTimestamps);
    return docRef.id;
  }

  static async getCourse(courseId: string): Promise<Course | null> {
    const docRef = doc(db, COLLECTIONS.COURSES, courseId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      } as Course;
    }
    return null;
  }

  static async getCoursesByTeacher(teacherId: string): Promise<Course[]> {
    const q = query(collection(db, COLLECTIONS.COURSES), where('teacherId', '==', teacherId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      } as Course;
    });
  }

  static async getActiveCourses(): Promise<Course[]> {
    const q = query(
      collection(db, COLLECTIONS.COURSES), 
      where('isActive', '==', true),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      } as Course;
    });
  }
}

// Enrollment Service
export class EnrollmentService {
  static async createEnrollment(enrollmentData: Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date().toISOString();
    const enrollmentWithTimestamps = {
      ...enrollmentData,
      createdAt: now,
      updatedAt: now,
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.ENROLLMENTS), enrollmentWithTimestamps);
    return docRef.id;
  }

  static async getEnrollmentsByStudent(studentId: string): Promise<Enrollment[]> {
    const q = query(collection(db, COLLECTIONS.ENROLLMENTS), where('studentId', '==', studentId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        startDate: convertTimestamp(data.startDate),
        endDate: data.endDate ? convertTimestamp(data.endDate) : undefined,
      } as Enrollment;
    });
  }

  static async getEnrollmentsByCourse(courseId: string): Promise<Enrollment[]> {
    const q = query(collection(db, COLLECTIONS.ENROLLMENTS), where('courseId', '==', courseId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        startDate: convertTimestamp(data.startDate),
        endDate: data.endDate ? convertTimestamp(data.endDate) : undefined,
      } as Enrollment;
    });
  }

  static async updateEnrollmentProgress(enrollmentId: string, progress: Partial<Enrollment['progress']>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.ENROLLMENTS, enrollmentId);
    await updateDoc(docRef, {
      progress: progress,
      updatedAt: new Date().toISOString(),
    });
  }
}

// Session Service
export class SessionService {
  static async createSession(sessionData: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date().toISOString();
    const sessionWithTimestamps = {
      ...sessionData,
      createdAt: now,
      updatedAt: now,
      scheduledAt: convertTimestamp(sessionData.scheduledAt),
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.SESSIONS), sessionWithTimestamps);
    return docRef.id;
  }

  static async getSessionsByStudent(studentId: string): Promise<Session[]> {
    const q = query(
      collection(db, COLLECTIONS.SESSIONS), 
      where('studentId', '==', studentId),
      orderBy('scheduledAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        scheduledAt: convertTimestamp(data.scheduledAt),
        actualStartTime: data.actualStartTime ? convertTimestamp(data.actualStartTime) : undefined,
        actualEndTime: data.actualEndTime ? convertTimestamp(data.actualEndTime) : undefined,
      } as Session;
    });
  }

  static async getUpcomingSessions(studentId: string): Promise<Session[]> {
    const now = new Date().toISOString();
    const q = query(
      collection(db, COLLECTIONS.SESSIONS), 
      where('studentId', '==', studentId),
      where('scheduledAt', '>=', now),
      where('status', '==', 'scheduled'),
      orderBy('scheduledAt', 'asc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        scheduledAt: convertTimestamp(data.scheduledAt),
        actualStartTime: data.actualStartTime ? convertTimestamp(data.actualStartTime) : undefined,
        actualEndTime: data.actualEndTime ? convertTimestamp(data.actualEndTime) : undefined,
      } as Session;
    });
  }
}

// Progress Service
export class ProgressService {
  static async createProgress(progressData: Omit<Progress, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date().toISOString();
    const progressWithTimestamps = {
      ...progressData,
      createdAt: now,
      updatedAt: now,
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.PROGRESS), progressWithTimestamps);
    return docRef.id;
  }

  static async getProgressByStudent(studentId: string): Promise<Progress[]> {
    const q = query(
      collection(db, COLLECTIONS.PROGRESS), 
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      } as Progress;
    });
  }

  static async getProgressByCourse(courseId: string): Promise<Progress[]> {
    const q = query(
      collection(db, COLLECTIONS.PROGRESS), 
      where('courseId', '==', courseId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      } as Progress;
    });
  }
}

// Notification Service
export class NotificationService {
  static async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt'>): Promise<string> {
    const now = new Date().toISOString();
    const notificationWithTimestamp = {
      ...notificationData,
      createdAt: now,
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), notificationWithTimestamp);
    return docRef.id;
  }

  static async getNotificationsByUser(userId: string): Promise<Notification[]> {
    const q = query(
      collection(db, COLLECTIONS.NOTIFICATIONS), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data.createdAt),
        sentAt: data.sentAt ? convertTimestamp(data.sentAt) : undefined,
        scheduledFor: data.scheduledFor ? convertTimestamp(data.scheduledFor) : undefined,
      } as Notification;
    });
  }

  static async markAsRead(notificationId: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.NOTIFICATIONS, notificationId);
    await updateDoc(docRef, { isRead: true });
  }

  static async markAllAsRead(userId: string): Promise<void> {
    const q = query(
      collection(db, COLLECTIONS.NOTIFICATIONS), 
      where('userId', '==', userId),
      where('isRead', '==', false)
    );
    const querySnapshot = await getDocs(q);
    
    const batch = writeBatch(db);
    querySnapshot.docs.forEach(doc => {
      batch.update(doc.ref, { isRead: true });
    });
    
    await batch.commit();
  }
}

// Analytics Service
export class AnalyticsService {
  static async trackEvent(eventData: Omit<Analytics, 'id' | 'timestamp'>): Promise<string> {
    const now = new Date().toISOString();
    const analyticsWithTimestamp = {
      ...eventData,
      timestamp: now,
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.ANALYTICS), analyticsWithTimestamp);
    return docRef.id;
  }

  static async getAnalyticsByUser(userId: string, limitCount: number = 100): Promise<Analytics[]> {
    const q = query(
      collection(db, COLLECTIONS.ANALYTICS), 
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: convertTimestamp(data.timestamp),
      } as Analytics;
    });
  }
}

// Real-time listeners
export class RealtimeService {
  static subscribeToUserNotifications(
    userId: string, 
    callback: (notifications: Notification[]) => void
  ): Unsubscribe {
    const q = query(
      collection(db, COLLECTIONS.NOTIFICATIONS), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const notifications = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: convertTimestamp(data.createdAt),
          sentAt: data.sentAt ? convertTimestamp(data.sentAt) : undefined,
          scheduledFor: data.scheduledFor ? convertTimestamp(data.scheduledFor) : undefined,
        } as Notification;
      });
      callback(notifications);
    });
  }

  static subscribeToStudentProgress(
    studentId: string, 
    callback: (progress: Progress[]) => void
  ): Unsubscribe {
    const q = query(
      collection(db, COLLECTIONS.PROGRESS), 
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const progress = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: convertTimestamp(data.createdAt),
          updatedAt: convertTimestamp(data.updatedAt),
        } as Progress;
      });
      callback(progress);
    });
  }
}
