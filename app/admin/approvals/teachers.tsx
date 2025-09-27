import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserService } from '@/services/databaseService';

type Teacher = { id: number; firstName?: string; lastName?: string; approved?: boolean };

export default function TeacherApprovals() {
  const [items, setItems] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      // PostgreSQL'den onay bekleyen öğretmenleri al
      const teachers = await UserService.getUsersByRole('teacher');
      setItems(teachers.filter(teacher => !teacher.isEmailVerified));
    } catch (e) {
      Alert.alert('Hata', 'Öğretmen listesi yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const setApproval = async (id: number, approved: boolean) => {
    try {
      await UserService.updateUser(id, { 
        isEmailVerified: approved,
        status: approved ? 'active' : 'pending'
      });
      await load();
    } catch (e) {
      Alert.alert('Hata', 'Güncellenemedi');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Öğretmen Onayları</ThemedText>
      <FlatList
        data={items}
        refreshing={loading}
        keyExtractor={(it) => it.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <ThemedText style={{ fontWeight: '700' }}>
              {item.firstName} {item.lastName}
            </ThemedText>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={styles.btnApprove} onPress={() => setApproval(item.id, true)}>
                <ThemedText style={styles.btnText}>Onayla</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnReject} onPress={() => setApproval(item.id, false)}>
                <ThemedText style={styles.btnText}>Reddet</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={!loading ? <ThemedText>Onay bekleyen öğretmen bulunmuyor.</ThemedText> : null}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  row: { paddingVertical: 12, borderBottomWidth: 1, borderColor: '#e5e7eb', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  btnApprove: { backgroundColor: '#16a34a', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8 },
  btnReject: { backgroundColor: '#dc2626', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: '700' },
});


