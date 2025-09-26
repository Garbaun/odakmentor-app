import { ThemedText } from '@/components/ThemedText';
import { db } from '@/config/firebase';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
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
  date: any;
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
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Kullanıcı istatistikleri
      const [studentsSnap, teachersSnap, pendingStudentsSnap, pendingTeachersSnap] = await Promise.all([
        getDocs(query(collection(db, 'students'))),
        getDocs(query(collection(db, 'teachers'))),
        getDocs(query(collection(db, 'students'), where('approved', '==', false))),
        getDocs(query(collection(db, 'teachers'), where('approved', '==', false)))
      ]);

      const totalStudents = studentsSnap.size;
      const totalTeachers = teachersSnap.size;
      const pendingStudents = pendingStudentsSnap.size;
      const pendingTeachers = pendingTeachersSnap.size;

      // Blog istatistikleri
      const [blogsSnap, publishedBlogsSnap, recentBlogsSnap] = await Promise.all([
        getDocs(query(collection(db, 'blog'))),
        getDocs(query(collection(db, 'blog'), where('published', '==', true))),
        getDocs(query(collection(db, 'blog'), where('createdAt', '>=', oneWeekAgo)))
      ]);

      const totalBlogs = blogsSnap.size;
      const publishedBlogs = publishedBlogsSnap.size;
      const recentBlogs = recentBlogsSnap.size;

      // Haftalık ve aylık aktivite
      const [newStudentsWeek, newTeachersWeek, newStudentsMonth, newTeachersMonth, newBlogsWeek, newBlogsMonth] = await Promise.all([
        getDocs(query(collection(db, 'students'), where('createdAt', '>=', oneWeekAgo))),
        getDocs(query(collection(db, 'teachers'), where('createdAt', '>=', oneWeekAgo))),
        getDocs(query(collection(db, 'students'), where('createdAt', '>=', oneMonthAgo))),
        getDocs(query(collection(db, 'teachers'), where('createdAt', '>=', oneMonthAgo))),
        getDocs(query(collection(db, 'blog'), where('createdAt', '>=', oneWeekAgo))),
        getDocs(query(collection(db, 'blog'), where('createdAt', '>=', oneMonthAgo)))
      ]);

      setStats({
        users: {
          totalStudents,
          totalTeachers,
          pendingStudents,
          pendingTeachers,
          approvedStudents: totalStudents - pendingStudents,
          approvedTeachers: totalTeachers - pendingTeachers,
        },
        blogs: {
          total: totalBlogs,
          published: publishedBlogs,
          drafts: totalBlogs - publishedBlogs,
          recent: recentBlogs,
        },
        activity: {
          newUsersThisWeek: newStudentsWeek.size + newTeachersWeek.size,
          newUsersThisMonth: newStudentsMonth.size + newTeachersMonth.size,
          newBlogsThisWeek: newBlogsWeek.size,
          newBlogsThisMonth: newBlogsMonth.size,
        },
      });

      // Son aktiviteler
      await loadRecentActivity();
    } catch (error) {
      console.error('İstatistikler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentActivity = async () => {
    try {
      // Son 10 blog yazısı
      const recentBlogsQuery = query(collection(db, 'blog'), orderBy('createdAt', 'desc'), limit(5));
      const recentBlogsSnap = await getDocs(recentBlogsQuery);
      
      // Son 10 kullanıcı kaydı
      const recentStudentsQuery = query(collection(db, 'students'), orderBy('createdAt', 'desc'), limit(3));
      const recentTeachersQuery = query(collection(db, 'teachers'), orderBy('createdAt', 'desc'), limit(3));
      const [recentStudentsSnap, recentTeachersSnap] = await Promise.all([
        getDocs(recentStudentsQuery),
        getDocs(recentTeachersQuery)
      ]);

      const activities: RecentActivity[] = [];

      // Blog aktiviteleri
      recentBlogsSnap.docs.forEach(doc => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          type: 'blog_created',
          title: data.title || 'Başlıksız Blog',
          description: `Yeni blog yazısı oluşturuldu`,
          date: data.createdAt,
        });
      });

      // Öğrenci aktiviteleri
      recentStudentsSnap.docs.forEach(doc => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          type: 'user_registration',
          title: data.name || 'İsimsiz Öğrenci',
          description: `Yeni öğrenci kaydı`,
          date: data.createdAt,
          userRole: 'student',
        });
      });

      // Öğretmen aktiviteleri
      recentTeachersSnap.docs.forEach(doc => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          type: 'user_registration',
          title: data.name || 'İsimsiz Öğretmen',
          description: `Yeni öğretmen kaydı`,
          date: data.createdAt,
          userRole: 'teacher',
        });
      });

      // Tarihe göre sırala
      activities.sort((a, b) => {
        const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
        const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });

      setRecentActivity(activities.slice(0, 10));
    } catch (error) {
      console.error('Son aktiviteler yüklenemedi:', error);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'Bilinmiyor';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('tr-TR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: string, userRole?: string) => {
    switch (type) {
      case 'blog_created':
        return 'article';
      case 'user_registration':
        return userRole === 'student' ? 'school' : 'person';
      case 'user_approved':
        return 'check-circle';
      default:
        return 'info';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'blog_created':
        return '#8b5cf6';
      case 'user_registration':
        return '#3b82f6';
      case 'user_approved':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedText type="title" style={styles.title}>İstatistikler ve Raporlar</ThemedText>

      {/* Genel İstatistikler */}
      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Genel İstatistikler</ThemedText>
        <View style={styles.statsGrid}>
          <StatCard
            title="Toplam Kullanıcı"
            value={stats.users.totalStudents + stats.users.totalTeachers}
            icon="people"
            color="#3b82f6"
            subtitle={`${stats.users.totalStudents} öğrenci, ${stats.users.totalTeachers} öğretmen`}
          />
          <StatCard
            title="Onaylı Kullanıcı"
            value={stats.users.approvedStudents + stats.users.approvedTeachers}
            icon="check-circle"
            color="#10b981"
            subtitle={`${stats.users.approvedStudents} öğrenci, ${stats.users.approvedTeachers} öğretmen`}
          />
          <StatCard
            title="Onay Bekleyen"
            value={stats.users.pendingStudents + stats.users.pendingTeachers}
            icon="pending"
            color="#f59e0b"
            subtitle={`${stats.users.pendingStudents} öğrenci, ${stats.users.pendingTeachers} öğretmen`}
          />
          <StatCard
            title="Toplam Blog"
            value={stats.blogs.total}
            icon="article"
            color="#8b5cf6"
            subtitle={`${stats.blogs.published} yayınlanan, ${stats.blogs.drafts} taslak`}
          />
        </View>
      </View>

      {/* Haftalık/Aylık Aktivite */}
      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Aktivite Raporları</ThemedText>
        <View style={styles.activityGrid}>
          <ActivityCard
            title="Bu Hafta"
            icon="schedule"
            color="#3b82f6"
            stats={[
              { label: 'Yeni Kullanıcı', value: stats.activity.newUsersThisWeek },
              { label: 'Yeni Blog', value: stats.activity.newBlogsThisWeek },
            ]}
          />
          <ActivityCard
            title="Bu Ay"
            icon="calendar-month"
            color="#10b981"
            stats={[
              { label: 'Yeni Kullanıcı', value: stats.activity.newUsersThisMonth },
              { label: 'Yeni Blog', value: stats.activity.newBlogsThisMonth },
            ]}
          />
        </View>
      </View>

      {/* Son Aktiviteler */}
      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Son Aktiviteler</ThemedText>
        <View style={styles.activityList}>
          {recentActivity.map((activity, index) => (
            <View key={`${activity.id}-${index}`} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <MaterialIcons 
                  name={getActivityIcon(activity.type, activity.userRole) as any} 
                  size={20} 
                  color={getActivityColor(activity.type)} 
                />
              </View>
              <View style={styles.activityContent}>
                <ThemedText style={styles.activityTitle}>{activity.title}</ThemedText>
                <ThemedText style={styles.activityDescription}>{activity.description}</ThemedText>
                <ThemedText style={styles.activityDate}>{formatDate(activity.date)}</ThemedText>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function StatCard({ title, value, icon, color, subtitle }: {
  title: string;
  value: number;
  icon: string;
  color: string;
  subtitle?: string;
}) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <MaterialIcons name={icon as any} size={24} color={color} />
        <ThemedText style={styles.statValue}>{value}</ThemedText>
      </View>
      <ThemedText style={styles.statTitle}>{title}</ThemedText>
      {subtitle && <ThemedText style={styles.statSubtitle}>{subtitle}</ThemedText>}
    </View>
  );
}

function ActivityCard({ title, icon, color, stats }: {
  title: string;
  icon: string;
  color: string;
  stats: { label: string; value: number }[];
}) {
  return (
    <View style={[styles.activityCard, { borderLeftColor: color }]}>
      <View style={styles.activityCardHeader}>
        <MaterialIcons name={icon as any} size={20} color={color} />
        <ThemedText style={styles.activityCardTitle}>{title}</ThemedText>
      </View>
      <View style={styles.activityCardStats}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.activityStatItem}>
            <ThemedText style={styles.activityStatValue}>{stat.value}</ThemedText>
            <ThemedText style={styles.activityStatLabel}>{stat.label}</ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderLeftWidth: 4,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  activityGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  activityCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderLeftWidth: 4,
  },
  activityCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  activityCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  activityCardStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  activityStatItem: {
    alignItems: 'center',
  },
  activityStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  activityStatLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  activityList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  activityItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    alignItems: 'flex-start',
    gap: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
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
});
