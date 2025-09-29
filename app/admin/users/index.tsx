import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

type User = {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  role: 'student' | 'teacher' | 'admin';
  status?: string;
  createdAt?: string;
  lastLoginAt?: string;
};

function getToken() {
  return typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
}

export default function UserManagement() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'teacher'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('all');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, users, filterRole, filterStatus]);

  const loadUsers = async () => {
    try {
      const token = getToken();
      const res = await fetch('/api/admin/users', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Kullanıcılar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: number, payload: Partial<User>) => {
    try {
      setUpdatingId(id);
      const token = getToken();
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data?.success) {
        setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...data.user } : u)));
      }
    } catch (e) {
      // noop
    } finally {
      setUpdatingId(null);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Rol filtresi
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    // Durum filtresi
    if (filterStatus !== 'all') {
      if (filterStatus === 'approved') {
        filtered = filtered.filter(user => user.status === 'active');
      } else if (filterStatus === 'pending') {
        filtered = filtered.filter(user => user.status === 'pending');
      }
    }

    // Arama filtresi
    if (searchQuery.trim()) {
      filtered = filtered.filter(user => 
        user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const formatDate = (date: any) => {
    if (!date) return 'Bilinmiyor';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('tr-TR');
  };

  const getRoleStats = () => {
    const students = users.filter(u => u.role === 'student');
    const teachers = users.filter(u => u.role === 'teacher');
    const pendingStudents = students.filter(u => !u.approved);
    const pendingTeachers = teachers.filter(u => !u.approved);

    return {
      totalStudents: students.length,
      totalTeachers: teachers.length,
      pendingStudents: pendingStudents.length,
      pendingTeachers: pendingTeachers.length,
    };
  };

  const stats = getRoleStats();

  const nextRole = (role: 'student' | 'teacher' | 'admin'): 'student' | 'teacher' | 'admin' => {
    if (role === 'student') return 'teacher';
    if (role === 'teacher') return 'admin';
    return 'student';
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle">Kullanıcı Yönetimi</ThemedText>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => router.push('/admin/approvals/students')}
          >
            <MaterialIcons name="school" size={16} color="#fff" />
            <ThemedText style={styles.actionBtnText}>Öğrenci Onayları</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => router.push('/admin/approvals/teachers')}
          >
            <MaterialIcons name="person" size={16} color="#fff" />
            <ThemedText style={styles.actionBtnText}>Öğretmen Onayları</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* İstatistikler */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialIcons name="school" size={24} color="#3b82f6" />
          <View style={styles.statContent}>
            <ThemedText style={styles.statNumber}>{stats.totalStudents}</ThemedText>
            <ThemedText style={styles.statLabel}>Toplam Öğrenci</ThemedText>
          </View>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="person" size={24} color="#10b981" />
          <View style={styles.statContent}>
            <ThemedText style={styles.statNumber}>{stats.totalTeachers}</ThemedText>
            <ThemedText style={styles.statLabel}>Toplam Öğretmen</ThemedText>
          </View>
        </View>
        <View style={styles.statCard}>
          <MaterialIcons name="pending" size={24} color="#f59e0b" />
          <View style={styles.statContent}>
            <ThemedText style={styles.statNumber}>{stats.pendingStudents + stats.pendingTeachers}</ThemedText>
            <ThemedText style={styles.statLabel}>Onay Bekleyen</ThemedText>
          </View>
        </View>
      </View>

      {/* Filtreler */}
      <View style={styles.filtersContainer}>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Kullanıcı ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#6b7280"
          />
        </View>
        
        <View style={styles.filterButtons}>
          <TouchableOpacity 
            style={[styles.filterBtn, filterRole === 'all' && styles.filterBtnActive]}
            onPress={() => setFilterRole('all')}
          >
            <ThemedText style={[styles.filterBtnText, filterRole === 'all' && styles.filterBtnTextActive]}>
              Tümü
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterBtn, filterRole === 'student' && styles.filterBtnActive]}
            onPress={() => setFilterRole('student')}
          >
            <ThemedText style={[styles.filterBtnText, filterRole === 'student' && styles.filterBtnTextActive]}>
              Öğrenci
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterBtn, filterRole === 'teacher' && styles.filterBtnActive]}
            onPress={() => setFilterRole('teacher')}
          >
            <ThemedText style={[styles.filterBtnText, filterRole === 'teacher' && styles.filterBtnTextActive]}>
              Öğretmen
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.filterButtons}>
          <TouchableOpacity 
            style={[styles.filterBtn, filterStatus === 'all' && styles.filterBtnActive]}
            onPress={() => setFilterStatus('all')}
          >
            <ThemedText style={[styles.filterBtnText, filterStatus === 'all' && styles.filterBtnTextActive]}>
              Tümü
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterBtn, filterStatus === 'approved' && styles.filterBtnActive]}
            onPress={() => setFilterStatus('approved')}
          >
            <ThemedText style={[styles.filterBtnText, filterStatus === 'approved' && styles.filterBtnTextActive]}>
              Onaylı
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterBtn, filterStatus === 'pending' && styles.filterBtnActive]}
            onPress={() => setFilterStatus('pending')}
          >
            <ThemedText style={[styles.filterBtnText, filterStatus === 'pending' && styles.filterBtnTextActive]}>
              Bekleyen
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Kullanıcı Listesi */}
      <ScrollView style={styles.usersList}>
        {filteredUsers.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.userInfo}>
                <MaterialIcons 
                  name={user.role === 'student' ? 'school' : 'person'} 
                  size={20} 
                  color={user.role === 'student' ? '#3b82f6' : '#10b981'} 
                />
                <View style={styles.userDetails}>
                  <ThemedText style={styles.userName}>
                    {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'İsimsiz Kullanıcı'}
                  </ThemedText>
                  <ThemedText style={styles.userEmail}>
                    {user.email || 'E-posta yok'}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.userStatus}>
                <View style={[
                  styles.statusBadge, 
                  user.status === 'active' ? styles.statusApproved : styles.statusPending
                ]}>
                  <ThemedText style={[
                    styles.statusText,
                    user.status === 'active' ? styles.statusTextApproved : styles.statusTextPending
                  ]}>
                    {user.status === 'active' ? 'Onaylı' : 'Bekliyor'}
                  </ThemedText>
                </View>
              </View>
            </View>
            
            <View style={styles.userFooter}>
              <ThemedText style={styles.userMeta}>
                {(user.role === 'student' ? 'Öğrenci' : user.role === 'teacher' ? 'Öğretmen' : 'Admin')} • 
                Kayıt: {formatDate(user.createdAt)}
              </ThemedText>
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                {user.lastLoginAt && (
                  <ThemedText style={styles.userMeta}>
                    Son giriş: {formatDate(user.lastLoginAt)}
                  </ThemedText>
                )}
                <TouchableOpacity
                  onPress={() => updateUser(user.id, { role: nextRole(user.role) })}
                  disabled={updatingId === user.id}
                  style={{ paddingVertical: 6, paddingHorizontal: 10, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 6 }}
                >
                  <ThemedText style={{ fontSize: 12, fontWeight: '600', color: '#1f2937' }}>
                    {updatingId === user.id ? 'Kaydediliyor...' : `Rol: ${user.role === 'student' ? 'Öğrenci' : user.role === 'teacher' ? 'Öğretmen' : 'Admin'}`}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        
        {filteredUsers.length === 0 && !loading && (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="people" size={48} color="#d1d5db" />
            <ThemedText style={styles.emptyText}>
              {searchQuery ? 'Arama sonucu bulunamadı' : 'Kullanıcı bulunamadı'}
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8
  },
  actionBtn: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  statContent: {
    flex: 1
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937'
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2
  },
  filtersContainer: {
    marginBottom: 20
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    gap: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937'
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  filterBtnActive: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1e3a8a'
  },
  filterBtnText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500'
  },
  filterBtnTextActive: {
    color: '#fff'
  },
  usersList: {
    flex: 1
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12
  },
  userDetails: {
    flex: 1
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280'
  },
  userStatus: {
    alignItems: 'flex-end'
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4
  },
  statusApproved: {
    backgroundColor: '#dcfce7'
  },
  statusPending: {
    backgroundColor: '#fef3c7'
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600'
  },
  statusTextApproved: {
    color: '#166534'
  },
  statusTextPending: {
    color: '#92400e'
  },
  userFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  userMeta: {
    fontSize: 12,
    color: '#9ca3af'
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280'
  }
});
