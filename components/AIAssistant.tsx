import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AIAssistantProps {
  onPress?: () => void;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function AIAssistant({ onPress }: AIAssistantProps) {
  const insets = useSafeAreaInsets();
  
  // State management
  const [showTooltip, setShowTooltip] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Merhaba! Ben NEO AI asistanınızım. Size nasıl yardımcı olabilirim?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');

  // Animation refs
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  // Random movement animation
  useEffect(() => {
    const animateRandomMovement = () => {
      const randomX = (Math.random() - 0.5) * 16; // -8 to +8
      const randomY = (Math.random() - 0.5) * 16; // -8 to +8
      
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: randomX,
          duration: 2000 + Math.random() * 2000, // 2-4 seconds
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: randomY,
          duration: 2000 + Math.random() * 2000, // 2-4 seconds
          useNativeDriver: true,
        }),
      ]).start(() => {
        // After animation completes, start next random movement
        setTimeout(animateRandomMovement, 1000 + Math.random() * 2000); // 1-3 seconds delay
      });
    };

    // Start the animation loop
    animateRandomMovement();
  }, []);

  // Send message function
  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate AI response (you can replace this with actual AI API call)
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Bu konuda size yardımcı olmaya çalışıyorum. Lütfen daha detaylı bilgi verebilir misiniz?',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <>
      <View style={[
        styles.container, 
        { bottom: insets.bottom + 20, right: 20 },
        Platform.OS === 'web' && { position: 'fixed' as any }
      ]}>
        <Animated.View 
          style={[
            styles.maskotContainer,
            {
              transform: [
                { translateX: translateX },
                { translateY: translateY }
              ]
            }
          ]}
        >
          {/* Gölge efekti */}
          <View style={styles.shadow} />
          
          {/* Maskot görseli - tıklanabilir */}
          <TouchableOpacity
            onPress={() => setShowChatModal(true)}
            style={styles.maskotButton}
            onMouseEnter={() => Platform.OS === 'web' && setShowTooltip(true)}
            onMouseLeave={() => Platform.OS === 'web' && setShowTooltip(false)}
          >
            <Image
              source={require('@/assets/images/neo/neo.png')}
              style={styles.maskotImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Hover Tooltip */}
        {showTooltip && (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>NEO'ya sor</Text>
            <View style={styles.tooltipArrow} />
          </View>
        )}
      </View>

      {/* Chat Modal */}
      <Modal
        visible={showChatModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowChatModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowChatModal(false)} />
          <View style={styles.chatModal}>
            {/* Chat Header */}
            <View style={styles.chatHeader}>
              <View style={styles.chatHeaderLeft}>
                <Image
                  source={require('@/assets/images/neo/neo.png')}
                  style={styles.chatHeaderAvatar}
                  resizeMode="contain"
                />
                <View>
                  <Text style={styles.chatHeaderTitle}>NEO AI Asistanı</Text>
                  <Text style={styles.chatHeaderSubtitle}>Çevrimiçi</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowChatModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Chat Messages */}
            <ScrollView style={styles.chatMessages} showsVerticalScrollIndicator={false}>
              {messages.map((message) => (
                <View
                  key={message.id}
                  style={[
                    styles.messageContainer,
                    message.isUser ? styles.userMessageContainer : styles.aiMessageContainer
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      message.isUser ? styles.userMessage : styles.aiMessage
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        message.isUser ? styles.userMessageText : styles.aiMessageText
                      ]}
                    >
                      {message.text}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Chat Input */}
            <View style={styles.chatInput}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Mesajınızı yazın..."
                placeholderTextColor="#94a3b8"
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                onPress={sendMessage}
                style={[
                  styles.sendButton,
                  inputText.trim() === '' && styles.sendButtonDisabled
                ]}
                disabled={inputText.trim() === ''}
              >
                <MaterialIcons 
                  name="send" 
                  size={20} 
                  color={inputText.trim() === '' ? '#94a3b8' : '#fff'} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000, // Modalların altında ama diğer elementlerin üstünde
    pointerEvents: 'box-none', // Tıklamaları geçir
  },
  maskotContainer: {
    width: 120, // %50 büyütüldü (80 * 1.5 = 120)
    height: 120, // %50 büyütüldü (80 * 1.5 = 120)
    position: 'relative',
  },
  shadow: {
    position: 'absolute',
    bottom: -5,
    left: 5,
    right: 5,
    height: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 40,
    opacity: 0.6,
  },
  maskotImage: {
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  maskotButton: {
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  // Tooltip stilleri
  tooltip: {
    position: 'absolute',
    bottom: 130,
    right: -10,
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    maxWidth: 200,
    zIndex: 1001,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -6,
    right: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#1e293b',
  },
  // Chat Modal stilleri
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  chatModal: {
    width: '90%',
    maxWidth: 500,
    height: '80%',
    maxHeight: 600,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  chatHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatHeaderAvatar: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  chatHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  chatHeaderSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
  },
  chatMessages: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userMessage: {
    backgroundColor: '#0369a1',
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    backgroundColor: '#f1f5f9',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  aiMessageText: {
    color: '#1e293b',
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 14,
    backgroundColor: '#fff',
    minHeight: 40,
  },
  sendButton: {
    backgroundColor: '#0369a1',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
});
