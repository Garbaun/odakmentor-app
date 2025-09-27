import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { BlogService } from '@/services/databaseService';

type Blog = { 
  id: number; 
  title: string; 
  content?: string;
  author_id?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

export default function BlogList() {
  const router = useRouter();
  const [items, setItems] = useState<Blog[]>([]);
  const [filteredItems, setFilteredItems] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBlogs();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchQuery, items]);

  const loadBlogs = async () => {
    try {
      const blogs = await BlogService.getAllBlogPosts();
      setItems(blogs);
    } catch (e) {
      Alert.alert('Hata', 'Blog yazıları yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    if (!searchQuery.trim()) {
      setFilteredItems(items);
      return;
    }
    
    const filtered = items.filter(item => 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const togglePublish = async (id: number, currentStatus: boolean) => {
    try {
      await BlogService.togglePublishStatus(id, !currentStatus);
      await loadBlogs();
      Alert.alert('Başarılı', `Yazı ${!currentStatus ? 'yayınlandı' : 'yayından kaldırıldı'}`);
    } catch (e) {
      Alert.alert('Hata', 'Durum güncellenemedi');
    }
  };

  const deleteBlog = async (id: number, title: string) => {
    Alert.alert(
      'Yazıyı Sil',
      `"${title}" yazısını silmek istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Sil', 
          style: 'destructive',
          onPress: async () => {
            try {
              await BlogService.deleteBlogPost(id);
              await loadBlogs();
              Alert.alert('Başarılı', 'Yazı silindi');
            } catch (e) {
              Alert.alert('Hata', 'Yazı silinemedi');
            }
          }
        }
      ]
    );
  };

  const formatDate = (date: string) => {
    if (!date) return 'Tarih yok';
    return new Date(date).toLocaleDateString('tr-TR');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="subtitle">Blog Yazıları</ThemedText>
        <TouchableOpacity style={styles.newBtn} onPress={() => router.push('/admin/blog/new')}>
          <MaterialIcons name="add" size={20} color="#fff" />
          <ThemedText style={styles.newBtnText}>Yeni Yazı</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Arama Çubuğu */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#6b7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Yazı ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#6b7280"
        />
      </View>

      {/* İstatistikler */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <ThemedText style={styles.statNumber}>{items.length}</ThemedText>
          <ThemedText style={styles.statLabel}>Toplam</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={[styles.statNumber, { color: '#10b981' }]}>
            {items.filter(item => item.status === 'published').length}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Yayınlanan</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={[styles.statNumber, { color: '#f59e0b' }]}>
            {items.filter(item => item.status === 'draft').length}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Taslak</ThemedText>
        </View>
      </View>

      <FlatList
        data={filteredItems}
        refreshing={loading}
        keyExtractor={(it) => it.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <TouchableOpacity 
              style={styles.rowContent} 
              onPress={() => router.push(`/admin/blog/${item.id}`)}
            >
              <View style={styles.rowHeader}>
                <ThemedText style={styles.title}>{item.title || '(Başlıksız)'}</ThemedText>
                <View style={styles.rowActions}>
                  <TouchableOpacity 
                    style={[styles.actionBtn, item.status === 'published' ? styles.publishBtn : styles.draftBtn]}
                    onPress={() => togglePublish(item.id, item.status === 'published')}
                  >
                    <MaterialIcons 
                      name={item.status === 'published' ? 'visibility' : 'visibility-off'} 
                      size={16} 
                      color="#fff" 
                    />
                    <ThemedText style={styles.actionBtnText}>
                      {item.status === 'published' ? 'Yayında' : 'Taslak'}
                    </ThemedText>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.editBtn}
                    onPress={() => router.push(`/admin/blog/${item.id}`)}
                  >
                    <MaterialIcons name="edit" size={16} color="#6b7280" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.deleteBtn}
                    onPress={() => deleteBlog(item.id, item.title || '')}
                  >
                    <MaterialIcons name="delete" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
              
              {item.content && (
                <ThemedText style={styles.excerpt} numberOfLines={2}>
                  {item.content.substring(0, 100)}...
                </ThemedText>
              )}
              
              <View style={styles.rowFooter}>
                <ThemedText style={styles.meta}>
                  {formatDate(item.created_at)}
                </ThemedText>
              </View>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="article" size={48} color="#d1d5db" />
              <ThemedText style={styles.emptyText}>
                {searchQuery ? 'Arama sonucu bulunamadı' : 'Henüz yazı yok'}
              </ThemedText>
            </View>
          ) : null
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  newBtn: { 
    backgroundColor: '#1e3a8a', 
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  newBtnText: { 
    color: '#fff', 
    fontWeight: '700' 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    gap: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937'
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'space-around'
  },
  statItem: {
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937'
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4
  },
  row: { 
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  rowContent: {
    padding: 16
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  title: { 
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    flex: 1,
    marginRight: 12
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    gap: 4
  },
  publishBtn: {
    backgroundColor: '#10b981'
  },
  draftBtn: {
    backgroundColor: '#f59e0b'
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  editBtn: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f3f4f6'
  },
  deleteBtn: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fef2f2'
  },
  excerpt: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20
  },
  rowFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  meta: {
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


