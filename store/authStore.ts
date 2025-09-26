import { User } from 'firebase/auth';
import { create } from 'zustand';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'teacher' | 'student';
  createdAt: Date;
}

interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userProfile: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    isLoading: false 
  }),

  setUserProfile: (profile) => set({ userProfile: profile }),

  setLoading: (loading) => set({ isLoading: loading }),

  logout: () => set({ 
    user: null, 
    userProfile: null, 
    isAuthenticated: false 
  }),
}));
