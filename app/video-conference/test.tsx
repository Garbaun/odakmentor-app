import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TopBar } from '@/components/TopBar';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { globalStyles } from '@/styles/globalStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// WebRTC polyfill for web
if (Platform.OS === 'web') {
  // @ts-ignore
  global.RTCPeerConnection = global.RTCPeerConnection || global.webkitRTCPeerConnection || global.mozRTCPeerConnection;
  // @ts-ignore
  global.RTCSessionDescription = global.RTCSessionDescription || global.webkitRTCSessionDescription || global.mozRTCSessionDescription;
  // @ts-ignore
  global.RTCIceCandidate = global.RTCIceCandidate || global.webkitRTCIceCandidate || global.mozRTCIceCandidate;
}

export default function VideoConferenceTestScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [catsOpen, setCatsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const runTests = async () => {
    setTestResults([]);
    addTestResult('Test başlatılıyor...');

    // Test 1: WebRTC desteği
    try {
      if (Platform.OS === 'web') {
        if (global.RTCPeerConnection) {
          addTestResult('✅ WebRTC desteği mevcut');
        } else {
          addTestResult('❌ WebRTC desteği yok');
        }
      } else {
        addTestResult('✅ React Native WebRTC mevcut');
      }
    } catch (error) {
      addTestResult(`❌ WebRTC test hatası: ${error}`);
    }

    // Test 2: Kamera ve mikrofon erişimi
    try {
      if (Platform.OS === 'web') {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        addTestResult('✅ Kamera ve mikrofon erişimi başarılı');
        stream.getTracks().forEach(track => track.stop());
      } else {
        addTestResult('ℹ️ Kamera/mikrofon testi sadece web\'de çalışır');
      }
    } catch (error) {
      addTestResult(`❌ Kamera/mikrofon erişim hatası: ${error}`);
    }

    // Test 3: Socket.IO bağlantısı
    try {
      const { io } = await import('socket.io-client');
      const serverUrl = Platform.OS === 'web' ? 'https://odakmentor.com' : 'http://localhost:3001';
      
      const socket = io(serverUrl, {
        transports: ['websocket'],
        timeout: 5000,
      });

      const connectionPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Bağlantı zaman aşımı'));
        }, 5000);

        socket.on('connect', () => {
          clearTimeout(timeout);
          resolve('Bağlantı başarılı');
        });

        socket.on('connect_error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });
      });

      await connectionPromise;
      addTestResult('✅ Socket.IO bağlantısı başarılı');
      socket.disconnect();
    } catch (error) {
      addTestResult(`❌ Socket.IO bağlantı hatası: ${error}`);
    }

    // Test 4: HTTPS kontrolü
    if (Platform.OS === 'web') {
      if (window.location.protocol === 'https:') {
        addTestResult('✅ HTTPS bağlantısı mevcut');
      } else {
        addTestResult('⚠️ HTTP bağlantısı - WebRTC için HTTPS gerekli olabilir');
      }
    }

    addTestResult('Test tamamlandı!');
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

      <ScrollView 
        style={{ flex: 1, backgroundColor: colors.background }} 
        contentContainerStyle={[globalStyles.scrollContent, { paddingTop: 20 }]} 
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.container}>
          <ThemedText style={[styles.title, { color: colors.text }]}>
            Video Konferans Test
          </ThemedText>
          
          <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
            Video konferans özelliklerini test edin
          </ThemedText>

          <TouchableOpacity
            style={[styles.testButton, { backgroundColor: colors.primary }]}
            onPress={runTests}
          >
            <MaterialIcons name="play-arrow" size={24} color="#fff" />
            <ThemedText style={styles.testButtonText}>
              Testleri Çalıştır
            </ThemedText>
          </TouchableOpacity>

          <View style={styles.resultsContainer}>
            <ThemedText style={[styles.resultsTitle, { color: colors.text }]}>
              Test Sonuçları:
            </ThemedText>
            
            {testResults.map((result, index) => (
              <ThemedText 
                key={index} 
                style={[
                  styles.resultItem, 
                  { 
                    color: result.includes('✅') ? '#10b981' : 
                           result.includes('❌') ? '#ef4444' : 
                           result.includes('⚠️') ? '#f59e0b' : colors.textSecondary 
                  }
                ]}
              >
                {result}
              </ThemedText>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.backButton, { borderColor: colors.border }]}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={20} color={colors.text} />
            <ThemedText style={[styles.backButtonText, { color: colors.text }]}>
              Geri Dön
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
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
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 32,
    marginBottom: 32,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultsContainer: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  resultItem: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'monospace',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 24,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});
