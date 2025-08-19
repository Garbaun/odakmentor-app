import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase konfigürasyonu - gerçek projede environment variables kullanın
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "mentor-ai-platform.firebaseapp.com",
  projectId: "mentor-ai-platform",
  storageBucket: "mentor-ai-platform.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Firebase servislerini export et
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
