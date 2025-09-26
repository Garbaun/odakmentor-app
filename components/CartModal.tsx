import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Image, Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

const TEXT = '#1e3a8a';

interface CartModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CartModal({ visible, onClose }: CartModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.modalOverlay]} pointerEvents="box-none">
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={[styles.cartModalCard]}> 
          <View style={styles.cartModalWatermark} pointerEvents="none">
            <Image 
              source={require('@/assets/images/logo1.png')} 
              style={styles.cartModalWatermarkLogo} 
              resizeMode="contain" 
            />
          </View>

          <View style={styles.cartModalHeader}>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} accessibilityRole="button">
              <MaterialIcons name="close" size={24} color={TEXT} />
            </TouchableOpacity>
          </View>
          <View style={styles.cartModalContent}>
            <Image 
              source={require('@/assets/images/logo2.png')} 
              style={styles.cartModalLogo} 
              resizeMode="contain" 
            />
            <ThemedText style={styles.cartModalText}>
              Çok yakında sizlerle.
            </ThemedText>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 10000,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.6)'
  },
  cartModalCard: {
    width: 800,
    height: 400,
    maxWidth: '90%',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
    zIndex: 10001,
  },
  cartModalHeader: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10002,
  },
  cartModalContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    zIndex: 2,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 20,
  },
  cartModalLogo: {
    width: 600,
    height: 150,
    marginBottom: 10,
  },
  cartModalText: {
    fontSize: 27,
    fontWeight: '600',
    textAlign: 'center',
    color: '#111827',
  },
  cartModalWatermark: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  cartModalWatermarkLogo: {
    width: '90%',
    height: '70%',
    opacity: 0.08,
  },
});

export default CartModal;


