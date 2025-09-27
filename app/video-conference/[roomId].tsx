import { ThemedText } from '@/components/ThemedText';
import { TopBar } from '@/components/TopBar';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Participant, VideoConferenceConfig, videoConferenceService } from '@/services/videoConferenceService';
import { globalStyles } from '@/styles/globalStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RTCView } from 'react-native-webrtc';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function VideoConferenceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { roomId } = useLocalSearchParams<{ roomId: string }>();

  // State
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [localStream, setLocalStream] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ from: string; text: string; timestamp: number }>>([]);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [catsOpen, setCatsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Refs
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    initializeConference();
    return () => {
      videoConferenceService.disconnect();
    };
  }, []);

  const initializeConference = async () => {
    try {
      const config: VideoConferenceConfig = {
        serverUrl: 'http://localhost:3001', // Socket.IO sunucusu
        roomId: roomId || 'default-room',
        userId: 'user-' + Date.now(), // Geçici kullanıcı ID'si
        userName: 'Kullanıcı', // Geçici kullanıcı adı
        userRole: 'student', // Geçici rol
      };

      const success = await videoConferenceService.initialize(config, {
        onParticipantsUpdate: (participants) => {
          setParticipants(participants);
        },
        onConnectionStateChange: (state) => {
          setConnectionState(state);
          setIsConnected(state === 'connected');
        },
        onError: (error) => {
          Alert.alert('Hata', error);
        },
        onMessage: (message) => {
          setMessages(prev => [...prev, message]);
          // Mesajları otomatik scroll
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);
        },
      });

      if (success) {
        // Yerel akışı al
        const stream = videoConferenceService.getLocalStream();
        setLocalStream(stream);
      }
    } catch (error) {
      console.error('Conference initialization error:', error);
      Alert.alert('Hata', 'Video konferans başlatılamadı');
    }
  };

  const toggleVideo = async () => {
    const enabled = await videoConferenceService.toggleVideo();
    setIsVideoEnabled(enabled);
  };

  const toggleAudio = async () => {
    const enabled = await videoConferenceService.toggleAudio();
    setIsAudioEnabled(enabled);
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      const success = await videoConferenceService.stopScreenShare();
      if (success) {
        setIsScreenSharing(false);
      }
    } else {
      const success = await videoConferenceService.startScreenShare();
      if (success) {
        setIsScreenSharing(true);
      }
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      videoConferenceService.sendMessage(message.trim());
      setMessage('');
    }
  };

  const leaveConference = async () => {
    await videoConferenceService.disconnect();
    router.back();
  };

  const getConnectionStatusColor = () => {
    switch (connectionState) {
      case 'connected': return '#10b981';
      case 'connecting': return '#f59e0b';
      case 'disconnected': return '#ef4444';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionState) {
      case 'connected': return 'Bağlı';
      case 'connecting': return 'Bağlanıyor...';
      case 'disconnected': return 'Bağlantı Kesildi';
      case 'error': return 'Hata';
      default: return 'Bilinmiyor';
    }
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

      {/* Conference Header */}
      <View style={[styles.conferenceHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.conferenceHeaderLeft}>
          <View>
            <ThemedText style={[styles.roomTitle, { color: colors.text }]}>
              Oda: {roomId}
            </ThemedText>
            <View style={styles.connectionStatus}>
              <View style={[styles.statusDot, { backgroundColor: getConnectionStatusColor() }]} />
              <ThemedText style={[styles.statusText, { color: colors.textSecondary }]}>
                {getConnectionStatusText()}
              </ThemedText>
            </View>
          </View>
        </View>
        <View style={styles.participantCount}>
          <MaterialIcons name="people" size={20} color={colors.textSecondary} />
          <ThemedText style={[styles.participantCountText, { color: colors.textSecondary }]}>
            {participants.length + 1}
          </ThemedText>
        </View>
      </View>

      {/* Video Grid */}
      <View style={styles.videoContainer}>
        {participants.length === 0 ? (
          <View style={styles.noParticipantsContainer}>
            <MaterialIcons name="videocam-off" size={64} color={colors.textSecondary} />
            <ThemedText style={[styles.noParticipantsText, { color: colors.textSecondary }]}>
              Diğer katılımcılar bekleniyor...
            </ThemedText>
          </View>
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.participantsScrollView}
          >
            <View style={styles.participantsGrid}>
              {/* Local Video */}
              {localStream && (
                <View style={styles.videoWrapper}>
                  <RTCView
                    streamURL={localStream.toURL()}
                    style={styles.video}
                    mirror={true}
                    objectFit="cover"
                  />
                  <View style={styles.videoLabel}>
                    <ThemedText style={styles.videoLabelText}>Sen</ThemedText>
                    {!isVideoEnabled && (
                      <View style={styles.videoOffOverlay}>
                        <MaterialIcons name="videocam-off" size={32} color="#fff" />
                      </View>
                    )}
                  </View>
                </View>
              )}

              {/* Remote Videos */}
              {participants.map((participant) => (
                <View key={participant.id} style={styles.videoWrapper}>
                  {participant.stream ? (
                    <RTCView
                      streamURL={participant.stream.toURL()}
                      style={styles.video}
                      objectFit="cover"
                    />
                  ) : (
                    <View style={[styles.noVideoPlaceholder, { backgroundColor: colors.surface }]}>
                      <MaterialIcons name="person" size={48} color={colors.textSecondary} />
                    </View>
                  )}
                  <View style={styles.videoLabel}>
                    <ThemedText style={styles.videoLabelText}>
                      {participant.name}
                    </ThemedText>
                    {!participant.isVideoEnabled && (
                      <View style={styles.videoOffOverlay}>
                        <MaterialIcons name="videocam-off" size={32} color="#fff" />
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Controls */}
      <View style={[styles.controls, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.controlButton, !isAudioEnabled && styles.controlButtonDisabled]}
          onPress={toggleAudio}
        >
          <MaterialIcons 
            name={isAudioEnabled ? "mic" : "mic-off"} 
            size={24} 
            color={isAudioEnabled ? "#fff" : "#ef4444"} 
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, !isVideoEnabled && styles.controlButtonDisabled]}
          onPress={toggleVideo}
        >
          <MaterialIcons 
            name={isVideoEnabled ? "videocam" : "videocam-off"} 
            size={24} 
            color={isVideoEnabled ? "#fff" : "#ef4444"} 
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, isScreenSharing && styles.controlButtonActive]}
          onPress={toggleScreenShare}
        >
          <MaterialIcons 
            name="screen-share" 
            size={24} 
            color={isScreenSharing ? "#fff" : "#6b7280"} 
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.leaveButton]}
          onPress={leaveConference}
        >
          <MaterialIcons name="call-end" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Chat */}
      <View style={[styles.chatContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, index) => (
            <View key={index} style={styles.message}>
              <ThemedText style={[styles.messageText, { color: colors.text }]}>
                <ThemedText style={[styles.messageSender, { color: colors.primary }]}>
                  {msg.from}: 
                </ThemedText>
                {' '}{msg.text}
              </ThemedText>
            </View>
          ))}
        </ScrollView>
        
        <View style={styles.messageInputContainer}>
          <TextInput
            style={[styles.messageInput, { 
              backgroundColor: colors.background, 
              color: colors.text,
              borderColor: colors.border 
            }]}
            value={message}
            onChangeText={setMessage}
            placeholder="Mesaj yazın..."
            placeholderTextColor={colors.textSecondary}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, { backgroundColor: colors.primary }]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <MaterialIcons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conferenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  conferenceHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
  },
  participantCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantCountText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  noParticipantsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noParticipantsText: {
    marginTop: 16,
    fontSize: 16,
  },
  participantsScrollView: {
    flex: 1,
  },
  participantsGrid: {
    flexDirection: 'row',
    padding: 8,
  },
  videoWrapper: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.4,
    marginRight: 8,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
  noVideoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoLabel: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  videoLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  videoOffOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6b7280',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  controlButtonDisabled: {
    backgroundColor: '#ef4444',
  },
  controlButtonActive: {
    backgroundColor: '#10b981',
  },
  leaveButton: {
    backgroundColor: '#ef4444',
  },
  chatContainer: {
    height: 200,
    borderTopWidth: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 12,
  },
  message: {
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageSender: {
    fontWeight: '600',
  },
  messageInputContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'flex-end',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 80,
    fontSize: 14,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
