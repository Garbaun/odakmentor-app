import { AdminGuard } from '@/components/AdminGuard';
import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="login" options={{ title: 'Admin Girişi', headerShown: false }} />
      <AdminGuard>
        <Stack.Screen name="index" options={{ title: 'Yönetim Paneli' }} />
        <Stack.Screen name="blog/index" options={{ title: 'Blog Yazıları' }} />
        <Stack.Screen name="blog/new" options={{ title: 'Yeni Yazı' }} />
        <Stack.Screen name="blog/[id]" options={{ title: 'Yazıyı Düzenle' }} />
        <Stack.Screen name="approvals/teachers" options={{ title: 'Öğretmen Onayları' }} />
        <Stack.Screen name="approvals/students" options={{ title: 'Öğrenci Onayları' }} />
        <Stack.Screen name="settings/footer" options={{ title: 'Footer Ayarları' }} />
      </AdminGuard>
    </Stack>
  );
}


