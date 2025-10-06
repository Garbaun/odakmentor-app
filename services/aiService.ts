// AI Service for communicating with Ubuntu backend
export interface ChatRequest {
  question: string;
  userType: 'student' | 'parent' | 'teacher';
  context?: string;
}

export interface ChatResponse {
  success: boolean;
  answer: string;
  confidence: number;
  matchedQA?: {
    id: string;
    question: string;
    answer: string;
    category: string;
    userTypes: string[];
    keywords: string[];
    score: number;
  };
  error?: string;
}

export interface QAStats {
  success: boolean;
  data: {
    total: number;
    byCategory: Record<string, number>;
    byUserType: {
      student: number;
      parent: number;
      teacher: number;
    };
  };
}

class AIService {
  private baseURL = 'http://192.168.1.200:3002/api';

  // Send chat message to AI backend
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      console.log('🚀 AI Service - API isteği gönderiliyor:', {
        url: `${this.baseURL}/chat/ask`,
        request: request
      });
      
      const response = await fetch(`${this.baseURL}/chat/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      console.log('📡 AI Service - API yanıtı alındı:', {
        status: response.status,
        statusText: response.statusText
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        success: false,
        answer: 'Üzgünüm, şu anda size yardımcı olamıyorum. Lütfen daha sonra tekrar deneyin.',
        confidence: 0,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      };
    }
  }

  // Get QA pairs for specific user type
  async getQAPairs(userType?: 'student' | 'parent' | 'teacher') {
    try {
      const url = userType 
        ? `${this.baseURL}/qa-pairs/user-type/${userType}`
        : `${this.baseURL}/qa-pairs`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('QA Pairs Error:', error);
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      };
    }
  }

  // Get AI service statistics
  async getStats(): Promise<QAStats> {
    try {
      const response = await fetch(`${this.baseURL}/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Stats Error:', error);
      return {
        success: false,
        data: {
          total: 0,
          byCategory: {},
          byUserType: {
            student: 0,
            parent: 0,
            teacher: 0
          }
        }
      };
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Health Check Error:', error);
      return {
        status: 'ERROR',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      };
    }
  }

  // Add new QA pair (for admin)
  async addQAPair(qaData: {
    question: string;
    answer: string;
    category: string;
    userTypes: string[];
    keywords: string[];
  }) {
    try {
      const response = await fetch(`${this.baseURL}/qa-pairs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(qaData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Add QA Pair Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      };
    }
  }

  // Update QA pair (for admin)
  async updateQAPair(id: string, qaData: Partial<{
    question: string;
    answer: string;
    category: string;
    userTypes: string[];
    keywords: string[];
  }>) {
    try {
      const response = await fetch(`${this.baseURL}/qa-pairs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(qaData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update QA Pair Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      };
    }
  }

  // Delete QA pair (for admin)
  async deleteQAPair(id: string) {
    try {
      const response = await fetch(`${this.baseURL}/qa-pairs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Delete QA Pair Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      };
    }
  }
}

export const aiService = new AIService();
export default aiService;
