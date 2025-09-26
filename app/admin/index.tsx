import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserService, CourseService, EnrollmentService } from '@/services/databaseService';
import { useAuthStore } from '@/store/authStore';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';

type Stats = {
  totalStudents: number;
  totalTeachers: number;
  pendingStudents: number;
  pendingTeachers: number;
  totalCourses: number;
  activeCourses: number;
  totalEnrollments: number;
  activeEnrollments: number;
};

export default function AdminHome() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalTeachers: 0,
    pendingStudents: 0,
    pendingTeachers: 0,
    totalCourses: 0,
    activeCourses: 0,
    totalEnrollments: 0,
    activeEnrollments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Kullanıcı istatistikleri
      const students = await UserService.getUsersByRole('student');
      const teachers = await UserService.getUsersByRole('teacher');
      
      const totalStudents = students.length;
      const totalTeachers = teachers.length;
      const pendingStudents = students.filter(s => s.status === 'pending').length;
      const pendingTeachers = teachers.filter(t => t.status === 'pending').length;

      // Kurs istatistikleri
      const allCourses = await CourseService.getActiveCourses();
      const totalCourses = allCourses.length;
      const activeCourses = allCourses.filter(c => c.isActive).length;

      // Kayıt istatistikleri
      // Note: Bu kısım için EnrollmentService'e yeni metodlar eklenebilir
      const totalEnrollments = 0; // Placeholder
      const activeEnrollments = 0; // Placeholder

      setStats({
        totalStudents,
        totalTeachers,
        pendingStudents,
        pendingTeachers,
        totalCourses,
        activeCourses,
        totalEnrollments,
        activeEnrollments,
      });
    } catch (error) {
      console.error('İstatistikler yüklenemedi:', error);
      Alert.alert('Hata', 'İstatistikler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Admin panelinden çıkmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Çıkış Yap', 
          style: 'destructive',
          onPress: () => {
            useAuthStore.getState().logout();
            router.replace('/admin/login');
          }
        }
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>Yönetim Paneli</ThemedText>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color="#ef4444" />
          <ThemedText style={styles.logoutText}>Çıkış</ThemedText>
        </TouchableOpacity>
      </View>
      
      {/* İstatistik Kartları */}
      <View style={styles.statsGrid}>
        <StatCard 
          title="Toplam Öğrenci" 
          value={stats.totalStudents} 
          icon="school" 
          color="#3b82f6" 
        />
        <StatCard 
          title="Toplam Öğretmen" 
          value={stats.totalTeachers} 
          icon="person" 
          color="#10b981" 
        />
        <StatCard 
          title="Onay Bekleyen Öğrenci" 
          value={stats.pendingStudents} 
          icon="pending" 
          color="#f59e0b" 
        />
        <StatCard 
          title="Onay Bekleyen Öğretmen" 
          value={stats.pendingTeachers} 
          icon="pending-actions" 
          color="#ef4444" 
        />
        <StatCard 
          title="Toplam Kurs" 
          value={stats.totalCourses} 
          icon="book" 
          color="#8b5cf6" 
        />
        <StatCard 
          title="Aktif Kurslar" 
          value={stats.activeCourses} 
          icon="play-circle" 
          color="#06b6d4" 
        />
      </View>

      {/* Hızlı Erişim Menüsü */}
      <ThemedText type="subtitle" style={styles.sectionTitle}>Hızlı Erişim</ThemedText>
      <ThemedView style={styles.grid}>
        <Card 
          title="Kurs Yönetimi" 
          subtitle="Kurs ekle, düzenle, yayınla"
          icon="book"
          onPress={() => router.push('/admin/courses')} 
        />
        <Card 
          title="Öğretmen Onayları" 
          subtitle={`${stats.pendingTeachers} onay bekliyor`}
          icon="person"
          onPress={() => router.push('/admin/approvals/teachers')} 
        />
        <Card 
          title="Öğrenci Onayları" 
          subtitle={`${stats.pendingStudents} onay bekliyor`}
          icon="school"
          onPress={() => router.push('/admin/approvals/students')} 
        />
        <Card 
          title="İstatistikler" 
          subtitle="Detaylı raporlar ve analizler"
          icon="analytics"
          onPress={() => router.push('/admin/statistics')} 
        />
        <Card 
          title="Kullanıcı Yönetimi" 
          subtitle="Tüm kullanıcıları görüntüle"
          icon="people"
          onPress={() => router.push('/admin/users')} 
        />
        <Card 
          title="Ayarlar" 
          subtitle="Sistem ayarları"
          icon="settings"
          onPress={() => router.push('/admin/settings')} 
        />
      </ThemedView>
    </ScrollView>
  );
}

function Card({ title, subtitle, icon, onPress }: { 
  title: string; 
  subtitle?: string; 
  icon?: string; 
  onPress: () => void; 
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        {icon && <MaterialIcons name={icon as any} size={24} color="#6b7280" />}
        <ThemedText style={styles.cardTitle}>{title}</ThemedText>
      </View>
      {subtitle && <ThemedText style={styles.cardSubtitle}>{subtitle}</ThemedText>}
    </TouchableOpacity>
  );
}

function StatCard({ title, value, icon, color }: { 
  title: string; 
  value: number; 
  icon: string; 
  color: string; 
}) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <MaterialIcons name={icon as any} size={20} color={color} />
        <ThemedText style={styles.statValue}>{value}</ThemedText>
      </View>
      <ThemedText style={styles.statTitle}>{title}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutText: {
    marginLeft: 4,
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  statCard: {
    width: '48%',
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  statTitle: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
});


