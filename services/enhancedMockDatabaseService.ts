/**
 * Enhanced Mock Database Service
 * 
 * Gelişmiş mock database servisi - daha fazla özellik ve veri kalıcılığı
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Genişletilmiş veri tipleri
export interface Quiz {
  id: number;
  title: string;
  description: string;
  courseId: number;
  questions: Question[];
  timeLimit: number; // dakika
  passingScore: number; // yüzde
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
}

export interface StudentProgress {
  id: number;
  studentId: number;
  courseId: number;
  lessonId?: number;
  quizId?: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  score?: number;
  timeSpent: number; // dakika
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

// Enhanced Mock Database
class EnhancedMockDatabase {
  private data: {
    users: any[];
    studentProfiles: any[];
    teacherProfiles: any[];
    courses: any[];
    quizzes: Quiz[];
    questions: Question[];
    studentProgress: StudentProgress[];
    payments: Payment[];
    notifications: Notification[];
    documents: Document[];
  } = {
    users: [],
    studentProfiles: [],
    teacherProfiles: [],
    courses: [],
    quizzes: [],
    questions: [],
    studentProgress: [],
    payments: [],
    notifications: [],
    documents: []
  };
  
  private nextId = 1;
  private dataFile = './data/mock-database.json';

  constructor() {
    this.loadData();
  }

  // Veri kalıcılığı
  private saveData(): void {
    try {
      const dataDir = './data';
      if (!existsSync(dataDir)) {
        require('fs').mkdirSync(dataDir, { recursive: true });
      }
      writeFileSync(this.dataFile, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.warn('Veri kaydetme hatası:', error);
    }
  }

  private loadData(): void {
    try {
      if (existsSync(this.dataFile)) {
        const fileContent = readFileSync(this.dataFile, 'utf8');
        this.data = JSON.parse(fileContent);
        this.nextId = Math.max(
          ...Object.values(this.data).flat().map((item: any) => item.id || 0)
        ) + 1;
      }
    } catch (error) {
      console.warn('Veri yükleme hatası:', error);
    }
  }

  // Quiz işlemleri
  async createQuiz(quizData: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<Quiz> {
    const quiz: Quiz = {
      id: this.nextId++,
      ...quizData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.quizzes.push(quiz);
    this.saveData();
    return quiz;
  }

  async getQuiz(id: number): Promise<Quiz | null> {
    return this.data.quizzes.find(q => q.id === id) || null;
  }

  async getQuizzesByCourse(courseId: number): Promise<Quiz[]> {
    return this.data.quizzes.filter(q => q.courseId === courseId);
  }

  // Soru işlemleri
  async createQuestion(questionData: Omit<Question, 'id'>): Promise<Question> {
    const question: Question = {
      id: this.nextId++,
      ...questionData
    };
    this.data.questions.push(question);
    this.saveData();
    return question;
  }

  async getQuestionsByQuiz(quizId: number): Promise<Question[]> {
    return this.data.questions.filter(q => q.quizId === quizId);
  }

  // İlerleme takibi
  async createProgress(progressData: Omit<StudentProgress, 'id' | 'createdAt' | 'updatedAt'>): Promise<StudentProgress> {
    const progress: StudentProgress = {
      id: this.nextId++,
      ...progressData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.studentProgress.push(progress);
    this.saveData();
    return progress;
  }

  async getStudentProgress(studentId: number, courseId?: number): Promise<StudentProgress[]> {
    let progress = this.data.studentProgress.filter(p => p.studentId === studentId);
    if (courseId) {
      progress = progress.filter(p => p.courseId === courseId);
    }
    return progress;
  }

  async updateProgress(id: number, updates: Partial<StudentProgress>): Promise<StudentProgress | null> {
    const index = this.data.studentProgress.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    this.data.studentProgress[index] = {
      ...this.data.studentProgress[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData();
    return this.data.studentProgress[index];
  }

  // Ödeme işlemleri
  async createPayment(paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    const payment: Payment = {
      id: this.nextId++,
      ...paymentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.payments.push(payment);
    this.saveData();
    return payment;
  }

  async getPaymentsByUser(userId: number): Promise<Payment[]> {
    return this.data.payments.filter(p => p.userId === userId);
  }

  // Bildirim işlemleri
  async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const notification: Notification = {
      id: this.nextId++,
      ...notificationData,
      createdAt: new Date().toISOString()
    };
    this.data.notifications.push(notification);
    this.saveData();
    return notification;
  }

  async getNotificationsByUser(userId: number, unreadOnly = false): Promise<Notification[]> {
    let notifications = this.data.notifications.filter(n => n.userId === userId);
    if (unreadOnly) {
      notifications = notifications.filter(n => !n.isRead);
    }
    return notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async markNotificationAsRead(id: number): Promise<boolean> {
    const notification = this.data.notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
      this.saveData();
      return true;
    }
    return false;
  }

  // Döküman işlemleri
  async createDocument(documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'downloadCount'>): Promise<Document> {
    const document: Document = {
      id: this.nextId++,
      ...documentData,
      downloadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.documents.push(document);
    this.saveData();
    return document;
  }

  async getDocumentsByCourse(courseId: number): Promise<Document[]> {
    return this.data.documents.filter(d => d.courseId === courseId);
  }

  async incrementDownloadCount(id: number): Promise<void> {
    const document = this.data.documents.find(d => d.id === id);
    if (document) {
      document.downloadCount++;
      document.updatedAt = new Date().toISOString();
      this.saveData();
    }
  }

  // Gelişmiş sorgular
  async searchCourses(query: string, filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    grade?: number;
    teacherId?: number;
  }): Promise<any[]> {
    let courses = this.data.courses.filter(course => 
      course.title.toLowerCase().includes(query.toLowerCase()) ||
      course.description.toLowerCase().includes(query.toLowerCase()) ||
      course.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );

    if (filters) {
      if (filters.category) {
        courses = courses.filter(c => c.category === filters.category);
      }
      if (filters.minPrice !== undefined) {
        courses = courses.filter(c => c.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        courses = courses.filter(c => c.price <= filters.maxPrice!);
      }
      if (filters.grade) {
        courses = courses.filter(c => c.grade === filters.grade);
      }
      if (filters.teacherId) {
        courses = courses.filter(c => c.teacherId === filters.teacherId);
      }
    }

    return courses;
  }

  // İstatistikler
  async getStatistics(): Promise<any> {
    return {
      totalUsers: this.data.users.length,
      totalCourses: this.data.courses.length,
      totalQuizzes: this.data.quizzes.length,
      totalQuestions: this.data.questions.length,
      totalPayments: this.data.payments.length,
      totalRevenue: this.data.payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0),
      activeStudents: this.data.studentProgress
        .filter(p => p.status === 'in_progress')
        .length,
      completedCourses: this.data.studentProgress
        .filter(p => p.status === 'completed')
        .length
    };
  }

  // Veri temizleme
  clearAllData(): void {
    this.data = {
      users: [],
      studentProfiles: [],
      teacherProfiles: [],
      courses: [],
      quizzes: [],
      questions: [],
      studentProgress: [],
      payments: [],
      notifications: [],
      documents: []
    };
    this.nextId = 1;
    this.saveData();
  }

  // Veri dışa aktarma
  exportData(): any {
    return this.data;
  }

  // Veri içe aktarma
  importData(data: any): void {
    this.data = data;
    this.nextId = Math.max(
      ...Object.values(this.data).flat().map((item: any) => item.id || 0)
    ) + 1;
    this.saveData();
  }
}

// Singleton instance
const enhancedMockDb = new EnhancedMockDatabase();

export default enhancedMockDb;
