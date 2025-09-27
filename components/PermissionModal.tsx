import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

interface PermissionModalProps {
  visible: boolean;
  onClose: () => void;
  onGranted: () => void;
  onDenied: () => void;
  type: 'camera' | 'microphone' | 'both';
}

export function PermissionModal({ 
  visible, 
  onClose, 
  onGranted, 
  onDenied, 
  type 
}: PermissionModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isRequesting, setIsRequesting] = useState(false);

  const getTitle = () => {
    switch (type) {
      case 'camera':
        return 'Kamera İzni Gerekli';
      case 'microphone':
        return 'Mikrofon İzni Gerekli';
      case 'both':
        return 'Kamera ve Mikrofon İzni Gerekli';
      default:
        return 'İzin Gerekli';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'camera':
        return 'Video konferansa katılmak için kamera erişimine ihtiyacımız var. Lütfen tarayıcınızın izin isteğini kabul edin.';
      case 'microphone':
        return 'Video konferansa katılmak için mikrofon erişimine ihtiyacımız var. Lütfen tarayıcınızın izin isteğini kabul edin.';
      case 'both':
        return 'Video konferansa katılmak için kamera ve mikrofon erişimine ihtiyacımız var. Lütfen tarayıcınızın izin isteğini kabul edin.';
      default:
        return 'Bu özelliği kullanmak için gerekli izinleri vermeniz gerekiyor.';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'camera':
        return 'videocam';
      case 'microphone':
        return 'mic';
      case 'both':
        return 'video-call';
      default:
        return 'security';
    }
  };

  const requestPermission = async () => {
    if (Platform.OS !== 'web') {
      // React Native için farklı bir yaklaşım gerekebilir
      onGranted();
      return;
    }

    setIsRequesting(true);

    try {
      const constraints: MediaStreamConstraints = {
        video: type === 'camera' || type === 'both',
        audio: type === 'microphone' || type === 'both',
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // İzin verildi, stream'i kapat
      stream.getTracks().forEach(track => track.stop());
      
      onGranted();
    } catch (error: any) {
      console.error('Permission error:', error);
      
      let errorMessage = 'İzin verilmedi. ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Lütfen tarayıcı ayarlarından kamera ve mikrofon izinlerini etkinleştirin.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'Kamera veya mikrofon bulunamadı. Lütfen cihazınızı kontrol edin.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Kamera veya mikrofon başka bir uygulama tarafından kullanılıyor.';
      } else {
        errorMessage += 'Bilinmeyen bir hata oluştu.';
      }

      Alert.alert('İzin Hatası', errorMessage, [
        { text: 'Tamam', onPress: onDenied }
      ]);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDeny = () => {
    Alert.alert(
      'İzin Gerekli',
      'Video konferansa katılmak için kamera ve mikrofon izinleri gereklidir. İzin vermek istemiyorsanız, sadece dinleyici olarak katılabilirsiniz.',
      [
        { text: 'İptal', onPress: onClose },
        { text: 'Dinleyici Olarak Katıl', onPress: onDenied }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ThemedView style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <MaterialIcons 
                name={getIcon()} 
                size={32} 
                color={colors.primary} 
              />
            </View>
            <ThemedText style={[styles.title, { color: colors.text }]}>
              {getTitle()}
            </ThemedText>
          </View>

          <ThemedText style={[styles.description, { color: colors.textSecondary }]}>
            {getDescription()}
          </ThemedText>

          <View style={styles.steps}>
            <ThemedText style={[styles.stepsTitle, { color: colors.text }]}>
              Nasıl İzin Verilir:
            </ThemedText>
            
            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <ThemedText style={styles.stepNumberText}>1</ThemedText>
              </View>
              <ThemedText style={[styles.stepText, { color: colors.textSecondary }]}>
                Tarayıcınızın adres çubuğunda kamera/mikrofon ikonuna tıklayın
              </ThemedText>
            </View>

            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <ThemedText style={styles.stepNumberText}>2</ThemedText>
              </View>
              <ThemedText style={[styles.stepText, { color: colors.textSecondary }]}>
                "İzin Ver" veya "Allow" seçeneğini seçin
              </ThemedText>
            </View>

            <View style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <ThemedText style={styles.stepNumberText}>3</ThemedText>
              </View>
              <ThemedText style={[styles.stepText, { color: colors.textSecondary }]}>
                Sayfayı yenileyin ve tekrar deneyin
              </ThemedText>
            </View>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.denyButton, { borderColor: colors.border }]}
              onPress={handleDeny}
              disabled={isRequesting}
            >
              <ThemedText style={[styles.buttonText, { color: colors.text }]}>
                İzin Verme
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button, 
                styles.grantButton, 
                { backgroundColor: colors.primary },
                isRequesting && styles.buttonDisabled
              ]}
              onPress={requestPermission}
              disabled={isRequesting}
            >
              <MaterialIcons 
                name={isRequesting ? "hourglass-empty" : "check"} 
                size={20} 
                color="#fff" 
              />
              <ThemedText style={styles.grantButtonText}>
                {isRequesting ? 'İstek Gönderiliyor...' : 'İzin Ver'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  steps: {
    marginBottom: 24,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  denyButton: {
    borderWidth: 1,
  },
  grantButton: {
    // backgroundColor set dynamically
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  grantButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
