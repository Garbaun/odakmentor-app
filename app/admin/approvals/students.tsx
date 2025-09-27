import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserService } from '@/services/databaseService';

type Student = { id: number; firstName?: string; lastName?: string; approved?: boolean };

export default function StudentApprovals() {
  const [items, setItems] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      // PostgreSQL'den onay bekleyen öğrencileri al
      const students = await UserService.getUsersByRole('student');
      setItems(students.filter(student => !student.isEmailVerified));
    } catch (e) {
      Alert.alert('Hata', 'Öğrenci listesi yüklenemedi');
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
      <ThemedText type="subtitle">Öğrenci Onayları</ThemedText>
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
        ListEmptyComponent={!loading ? <ThemedText>Onay bekleyen öğrenci yok.</ThemedText> : null}
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


