import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'students' | 'teachers' | 'admins'>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/users');
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Users fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: number, action: 'activate' | 'deactivate' | 'delete') => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/users/${userId}/${action}`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        Alert.alert('Başarılı', 'İşlem tamamlandı');
        fetchUsers(); // Listeyi yenile
      } else {
        Alert.alert('Hata', data.error || 'İşlem başarısız');
      }
    } catch (error) {
      Alert.alert('Hata', 'Sunucuya bağlanırken bir hata oluştu');
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    return user.role === filter.slice(0, -1); // Remove 's' from end
  });

  const UserCard = ({ user }: { user: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <ThemedText style={styles.userName}>{user.name}</ThemedText>
        <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
        <View style={styles.userMeta}>
          <Text style={[styles.roleBadge, styles[`role${user.role}`]]}>
            {user.role === 'student' ? 'Öğrenci' : 
             user.role === 'teacher' ? 'Öğretmen' : 'Admin'}
          </Text>
          <Text style={[styles.statusBadge, styles[`status${user.status}`]]}>
            {user.status === 'active' ? 'Aktif' : 
             user.status === 'inactive' ? 'Pasif' : 'Beklemede'}
          </Text>
        </View>
      </View>
      
      <View style={styles.userActions}>
        {user.status === 'active' ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleUserAction(user.id, 'deactivate')}
          >
            <Text style={styles.actionButtonText}>Pasifleştir</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.activateButton]}
            onPress={() => handleUserAction(user.id, 'activate')}
          >
            <Text style={styles.actionButtonText}>Aktifleştir</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => {
            Alert.alert(
              'Kullanıcıyı Sil',
              'Bu kullanıcıyı silmek istediğinizden emin misiniz?',
              [
                { text: 'İptal', style: 'cancel' },
                { text: 'Sil', style: 'destructive', onPress: () => handleUserAction(user.id, 'delete') }
              ]
            );
          }}
        >
          <Text style={styles.actionButtonText}>Sil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Kullanıcı Yönetimi</ThemedText>
      </View>

      <View style={styles.filters}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterButtonText, filter === 'all' && styles.filterButtonTextActive]}>
            Tümü ({users.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'students' && styles.filterButtonActive]}
          onPress={() => setFilter('students')}
        >
          <Text style={[styles.filterButtonText, filter === 'students' && styles.filterButtonTextActive]}>
            Öğrenciler ({users.filter(u => u.role === 'student').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'teachers' && styles.filterButtonActive]}
          onPress={() => setFilter('teachers')}
        >
          <Text style={[styles.filterButtonText, filter === 'teachers' && styles.filterButtonTextActive]}>
            Öğretmenler ({users.filter(u => u.role === 'teacher').length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ThemedText>Yükleniyor...</ThemedText>
          </View>
        ) : (
          filteredUsers.map(user => (
            <UserCard key={user.id} user={user} />
          ))
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  filters: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  rolestudent: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
  },
  roleteacher: {
    backgroundColor: '#f3e5f5',
    color: '#7b1fa2',
  },
  roleadmin: {
    backgroundColor: '#fff3e0',
    color: '#f57c00',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  statusactive: {
    backgroundColor: '#e8f5e8',
    color: '#2e7d32',
  },
  statusinactive: {
    backgroundColor: '#ffebee',
    color: '#c62828',
  },
  statuspending: {
    backgroundColor: '#fff8e1',
    color: '#f57f17',
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  activateButton: {
    backgroundColor: '#4caf50',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
