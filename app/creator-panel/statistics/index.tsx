import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Statistics {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalBlogs: number;
  activeVideoRooms: number;
  totalVideoSessions: number;
}

export default function CreatorStatistics() {
  const [stats, setStats] = useState<Statistics>({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalBlogs: 0,
    activeVideoRooms: 0,
    totalVideoSessions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/statistics');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.statistics);
      }
    } catch (error) {
      console.error('Statistics fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon }: { title: string; value: number; icon: string }) => (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <ThemedText style={styles.statTitle}>{title}</ThemedText>
    </View>
  );

  const MenuButton = ({ title, onPress, icon }: { title: string; onPress: () => void; icon: string }) => (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <ThemedText style={styles.menuTitle}>{title}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Creator Panel</ThemedText>
        <ThemedText style={styles.headerSubtitle}>İstatistikler ve Yönetim</ThemedText>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsGrid}>
          <StatCard title="Toplam Kullanıcı" value={stats.totalUsers} icon="👥" />
          <StatCard title="Öğrenciler" value={stats.totalStudents} icon="🎓" />
          <StatCard title="Öğretmenler" value={stats.totalTeachers} icon="👨‍🏫" />
          <StatCard title="Blog Yazıları" value={stats.totalBlogs} icon="📝" />
          <StatCard title="Aktif Video Odaları" value={stats.activeVideoRooms} icon="📹" />
          <StatCard title="Toplam Video Seansları" value={stats.totalVideoSessions} icon="🎥" />
        </View>

        <View style={styles.menuSection}>
          <ThemedText style={styles.sectionTitle}>Yönetim Paneli</ThemedText>
          
          <View style={styles.menuGrid}>
            <MenuButton
              title="Kullanıcı Yönetimi"
              icon="👤"
              onPress={() => router.push('/creator-panel/users')}
            />
            <MenuButton
              title="Blog Yönetimi"
              icon="📝"
              onPress={() => router.push('/creator-panel/blog')}
            />
            <MenuButton
              title="Öğrenci Onayları"
              icon="✅"
              onPress={() => router.push('/creator-panel/approvals/students')}
            />
            <MenuButton
              title="Öğretmen Onayları"
              icon="✅"
              onPress={() => router.push('/creator-panel/approvals/teachers')}
            />
            <MenuButton
              title="Ayarlar"
              icon="⚙️"
              onPress={() => router.push('/creator-panel/settings')}
            />
            <MenuButton
              title="Çıkış"
              icon="🚪"
              onPress={() => router.replace('/creator-panel/login')}
            />
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 24,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e6f3ff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  menuSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});
