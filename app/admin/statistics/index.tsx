import { ThemedText } from '@/components/ThemedText';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

type Statistics = {
  users: {
    totalStudents: number;
    totalTeachers: number;
    pendingStudents: number;
    pendingTeachers: number;
    approvedStudents: number;
    approvedTeachers: number;
  };
  blogs: {
    total: number;
    published: number;
    drafts: number;
    recent: number;
  };
  activity: {
    newUsersThisWeek: number;
    newUsersThisMonth: number;
    newBlogsThisWeek: number;
    newBlogsThisMonth: number;
  };
};

type RecentActivity = {
  id: string;
  type: 'user_registration' | 'blog_created' | 'user_approved';
  title: string;
  description: string;
  date: string;
  userRole?: 'student' | 'teacher';
};

export default function StatisticsPage() {
  const [stats, setStats] = useState<Statistics>({
    users: {
      totalStudents: 0,
      totalTeachers: 0,
      pendingStudents: 0,
      pendingTeachers: 0,
      approvedStudents: 0,
      approvedTeachers: 0,
    },
    blogs: {
      total: 0,
      published: 0,
      drafts: 0,
      recent: 0,
    },
    activity: {
      newUsersThisWeek: 0,
      newUsersThisMonth: 0,
      newBlogsThisWeek: 0,
      newBlogsThisMonth: 0,
    },
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [adminStatsRes, blogsRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/blogs', { headers }),
      ]);
      const adminStats = await adminStatsRes.json();
      const allBlogs = await blogsRes.json();

      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const publishedBlogs = (allBlogs || []).filter((b: any) => b.status === 'published');
      const draftBlogs = (allBlogs || []).filter((b: any) => b.status === 'draft');
      const newBlogsThisWeek = (allBlogs || []).filter((b: any) => b.created_at && new Date(b.created_at) > oneWeekAgo).length;
      const newBlogsThisMonth = (allBlogs || []).filter((b: any) => b.created_at && new Date(b.created_at) > oneMonthAgo).length;

      setStats({
        users: {
          totalStudents: adminStats?.users?.totalStudents || 0,
          totalTeachers: adminStats?.users?.totalTeachers || 0,
          pendingStudents: adminStats?.users?.pendingStudents || 0,
          pendingTeachers: adminStats?.users?.pendingTeachers || 0,
          approvedStudents: (adminStats?.users?.totalStudents || 0) - (adminStats?.users?.pendingStudents || 0),
          approvedTeachers: (adminStats?.users?.totalTeachers || 0) - (adminStats?.users?.pendingTeachers || 0),
        },
        blogs: {
          total: (allBlogs || []).length,
          published: publishedBlogs.length,
          drafts: draftBlogs.length,
          recent: newBlogsThisWeek,
        },
        activity: {
          newUsersThisWeek: 0,
          newUsersThisMonth: 0,
          newBlogsThisWeek,
          newBlogsThisMonth,
        },
      });

      setRecentActivity([]);
    } catch (error) {
      console.error('İstatistikler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ThemedText>Yükleniyor...</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedText type="title" style={styles.title}>İstatistikler</ThemedText>

      {/* Kullanıcı İstatistikleri */}
      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          <MaterialIcons name="people" size={20} color="#3b82f6" /> Kullanıcılar
        </ThemedText>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>{stats.users.totalStudents}</ThemedText>
            <ThemedText style={styles.statLabel}>Toplam Öğrenci</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>{stats.users.totalTeachers}</ThemedText>
            <ThemedText style={styles.statLabel}>Toplam Öğretmen</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>{stats.users.pendingStudents}</ThemedText>
            <ThemedText style={styles.statLabel}>Bekleyen Öğrenci</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>{stats.users.pendingTeachers}</ThemedText>
            <ThemedText style={styles.statLabel}>Bekleyen Öğretmen</ThemedText>
          </View>
        </View>
      </View>

      {/* Blog İstatistikleri */}
      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          <MaterialIcons name="article" size={20} color="#10b981" /> Blog Yazıları
        </ThemedText>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>{stats.blogs.total}</ThemedText>
            <ThemedText style={styles.statLabel}>Toplam Blog</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>{stats.blogs.published}</ThemedText>
            <ThemedText style={styles.statLabel}>Yayınlanan</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>{stats.blogs.drafts}</ThemedText>
            <ThemedText style={styles.statLabel}>Taslak</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>{stats.blogs.recent}</ThemedText>
            <ThemedText style={styles.statLabel}>Bu Hafta</ThemedText>
          </View>
        </View>
      </View>

      {/* Aktivite İstatistikleri */}
      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          <MaterialIcons name="trending-up" size={20} color="#f59e0b" /> Aktivite
        </ThemedText>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>{stats.activity.newUsersThisWeek}</ThemedText>
            <ThemedText style={styles.statLabel}>Bu Hafta Kullanıcı</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>{stats.activity.newUsersThisMonth}</ThemedText>
            <ThemedText style={styles.statLabel}>Bu Ay Kullanıcı</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>{stats.activity.newBlogsThisWeek}</ThemedText>
            <ThemedText style={styles.statLabel}>Bu Hafta Blog</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>{stats.activity.newBlogsThisMonth}</ThemedText>
            <ThemedText style={styles.statLabel}>Bu Ay Blog</ThemedText>
          </View>
        </View>
      </View>

      {/* Son Aktiviteler */}
      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          <MaterialIcons name="history" size={20} color="#8b5cf6" /> Son Aktiviteler
        </ThemedText>
        
        {recentActivity.length > 0 ? (
          recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <MaterialIcons 
                  name={activity.type === 'user_registration' ? 'person-add' : 'article'} 
                  size={16} 
                  color="#6b7280" 
                />
              </View>
              <View style={styles.activityContent}>
                <ThemedText style={styles.activityTitle}>{activity.title}</ThemedText>
                <ThemedText style={styles.activityDescription}>{activity.description}</ThemedText>
                <ThemedText style={styles.activityDate}>
                  {new Date(activity.date).toLocaleDateString('tr-TR')}
                </ThemedText>
              </View>
            </View>
          ))
        ) : (
          <ThemedText style={styles.emptyText}>Henüz aktivite yok</ThemedText>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1f2937',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  activityItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 11,
    color: '#9ca3af',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    fontStyle: 'italic',
    padding: 20,
  },
});