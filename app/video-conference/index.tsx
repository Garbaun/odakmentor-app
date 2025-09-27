import { ThemedText } from '@/components/ThemedText';
import { TopBar } from '@/components/TopBar';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { globalStyles } from '@/styles/globalStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VideoConferenceJoinScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState<'teacher' | 'student'>('student');
  const [catsOpen, setCatsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const joinConference = () => {
    if (!roomId.trim()) {
      Alert.alert('Hata', 'Lütfen oda ID\'sini girin');
      return;
    }

    if (!userName.trim()) {
      Alert.alert('Hata', 'Lütfen adınızı girin');
      return;
    }

    // Video konferans sayfasına git
    router.push(`/video-conference/${roomId.trim()}?userName=${encodeURIComponent(userName.trim())}&userRole=${userRole}`);
  };

  const createRoom = () => {
    const newRoomId = 'room-' + Date.now();
    setRoomId(newRoomId);
  };

  return (
    <View style={globalStyles.container}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      {/* Ortak Top Bar */}
      <TopBar 
        currentPage="video-conference"
        onCategoriesPress={() => setCatsOpen(true)}
        onCartPress={() => setCartOpen(true)}
      />

      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={{ flex: 1, backgroundColor: colors.background }} 
          contentContainerStyle={[globalStyles.scrollContent, { paddingTop: 20 }]} 
          showsVerticalScrollIndicator={false}
        >
          {/* Content */}
          <View style={styles.content}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <MaterialIcons name="videocam" size={64} color={colors.primary} />
          </View>

          <ThemedText style={[styles.title, { color: colors.text }]}>
            Video Konferansa Katıl
          </ThemedText>
          
          <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
            Oda ID'sini girin veya yeni bir oda oluşturun
          </ThemedText>

          {/* Form */}
          <View style={styles.form}>
            {/* Room ID */}
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.inputLabel, { color: colors.text }]}>
                Oda ID
              </ThemedText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.surface, 
                    color: colors.text,
                    borderColor: colors.border 
                  }]}
                  value={roomId}
                  onChangeText={setRoomId}
                  placeholder="Oda ID'sini girin"
                  placeholderTextColor={colors.textSecondary}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity 
                  style={[styles.generateButton, { backgroundColor: colors.primary }]}
                  onPress={createRoom}
                >
                  <MaterialIcons name="refresh" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* User Name */}
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.inputLabel, { color: colors.text }]}>
                Adınız
              </ThemedText>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.surface, 
                  color: colors.text,
                  borderColor: colors.border 
                }]}
                value={userName}
                onChangeText={setUserName}
                placeholder="Adınızı girin"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="words"
              />
            </View>

            {/* User Role */}
            <View style={styles.inputGroup}>
              <ThemedText style={[styles.inputLabel, { color: colors.text }]}>
                Rolünüz
              </ThemedText>
              <View style={styles.roleContainer}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    { 
                      backgroundColor: userRole === 'teacher' ? colors.primary : colors.surface,
                      borderColor: colors.border 
                    }
                  ]}
                  onPress={() => setUserRole('teacher')}
                >
                  <MaterialIcons 
                    name="school" 
                    size={20} 
                    color={userRole === 'teacher' ? '#fff' : colors.textSecondary} 
                  />
                  <ThemedText style={[
                    styles.roleButtonText,
                    { color: userRole === 'teacher' ? '#fff' : colors.textSecondary }
                  ]}>
                    Öğretmen
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    { 
                      backgroundColor: userRole === 'student' ? colors.primary : colors.surface,
                      borderColor: colors.border 
                    }
                  ]}
                  onPress={() => setUserRole('student')}
                >
                  <MaterialIcons 
                    name="person" 
                    size={20} 
                    color={userRole === 'student' ? '#fff' : colors.textSecondary} 
                  />
                  <ThemedText style={[
                    styles.roleButtonText,
                    { color: userRole === 'student' ? '#fff' : colors.textSecondary }
                  ]}>
                    Öğrenci
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Join Button */}
          <TouchableOpacity
            style={[styles.joinButton, { backgroundColor: colors.primary }]}
            onPress={joinConference}
            disabled={!roomId.trim() || !userName.trim()}
          >
            <MaterialIcons name="video-call" size={24} color="#fff" />
            <ThemedText style={styles.joinButtonText}>
              Konferansa Katıl
            </ThemedText>
          </TouchableOpacity>

          {/* Features */}
          <View style={styles.features}>
            <ThemedText style={[styles.featuresTitle, { color: colors.text }]}>
              Özellikler
            </ThemedText>
            
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <MaterialIcons name="videocam" size={20} color={colors.primary} />
                <ThemedText style={[styles.featureText, { color: colors.textSecondary }]}>
                  HD Video Görüşme
                </ThemedText>
              </View>
              
              <View style={styles.featureItem}>
                <MaterialIcons name="mic" size={20} color={colors.primary} />
                <ThemedText style={[styles.featureText, { color: colors.textSecondary }]}>
                  Yüksek Kalite Ses
                </ThemedText>
              </View>
              
              <View style={styles.featureItem}>
                <MaterialIcons name="screen-share" size={20} color={colors.primary} />
                <ThemedText style={[styles.featureText, { color: colors.textSecondary }]}>
                  Ekran Paylaşımı
                </ThemedText>
              </View>
              
              <View style={styles.featureItem}>
                <MaterialIcons name="chat" size={20} color={colors.primary} />
                <ThemedText style={[styles.featureText, { color: colors.textSecondary }]}>
                  Anlık Mesajlaşma
                </ThemedText>
              </View>
            </View>
          </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  form: {
    width: '100%',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginRight: 8,
  },
  generateButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  roleButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 32,
    marginBottom: 32,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  features: {
    width: '100%',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    marginLeft: 12,
    fontSize: 14,
  },
});
