import { useRouter } from 'expo-router';
import { ReactNode, useEffect, useMemo } from 'react';
import { ActivityIndicator } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
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

  // Geçici çözüm: 3 saniye sonra loading'i false yap
  useEffect(() => {
    const timer = setTimeout(() => {
      useAuthStore.getState().setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

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