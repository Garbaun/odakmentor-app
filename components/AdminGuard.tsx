import { useRouter } from 'expo-router';
import { ReactNode, useEffect, useMemo } from 'react';
import { ActivityIndicator } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AuthService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';

type AdminGuardProps = {
  children: ReactNode;
};

function parseAdminEmails(): Set<string> {
  const raw = (process.env.EXPO_PUBLIC_ADMIN_EMAILS || '').trim();
  if (!raw) return new Set();
  return new Set(
    raw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const userProfile = useAuthStore((s) => s.userProfile);
  const isLoading = useAuthStore((s) => s.isLoading);

  const adminEmails = useMemo(() => parseAdminEmails(), []);

  const isAdminByProfile = (userProfile as any)?.role === 'admin';
  const isAdminByEmail = user?.email ? adminEmails.has(user.email.toLowerCase()) : false;
  const isAdmin = !!(isAdminByProfile || isAdminByEmail);

  // Token varsa kullanıcıyı doğrula ve store'u doldur
  useEffect(() => {
    const run = async () => {
      try {
        const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (token && !user) {
          const verified = await AuthService.verifyToken(token);
          if (verified && verified.id) {
            const displayName = `${verified.firstName || ''} ${verified.lastName || ''}`.trim();
            useAuthStore.getState().setUser({
              uid: String(verified.id),
              email: verified.email,
              displayName,
            } as any);
            useAuthStore.getState().setUserProfile({
              uid: String(verified.id),
              email: verified.email,
              displayName,
              role: verified.role,
              createdAt: new Date(verified.created_at || Date.now()),
            } as any);
          }
        }
      } finally {
        useAuthStore.getState().setLoading(false);
      }
    };
    run();
  }, [user]);

  // Admin değilse login sayfasına yönlendir
  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.replace('/admin/login');
    }
  }, [isLoading, user, isAdmin, router]);

  if (isLoading) {
    return (
      <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
        <ThemedText style={{ marginTop: 8 }}>Yükleniyor…</ThemedText>
      </ThemedView>
    );
  }

  if (!user || !isAdmin) {
    return (
      <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <ThemedText style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Yönetici alanı</ThemedText>
        <ThemedText style={{ textAlign: 'center' }}>
          Giriş sayfasına yönlendiriliyorsunuz...
        </ThemedText>
      </ThemedView>
    );
  }

  return <>{children}</>;
}