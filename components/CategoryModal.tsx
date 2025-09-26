import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';

const { width } = Dimensions.get('window');
const TEXT = '#1e3a8a';
const BORDER = '#e2e8f0';

const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

const NEOMORPHIC_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 2, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
};

const CATS = ['Sınıflar', 'Online Dersler', 'Sınava Hazırlık', 'Yabancı Dil', 'Rehberlik'] as const;

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CategoryModal({ visible, onClose }: CategoryModalProps) {
  const [catActive, setCatActive] = useState<typeof CATS[number]>('Sınıflar');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.modalOverlay]} pointerEvents="box-none">
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={[styles.modalCard, { maxHeight: '100%' }]}>
          <View style={styles.categoriesModalWatermark} pointerEvents="none">
            <Image
              source={require('@/assets/images/logo1.png')}
              style={styles.categoriesModalWatermarkLogo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.modalHeaderTopRow}>
            <TouchableOpacity style={styles.modalBackRow} activeOpacity={0.7} onPress={onClose}>
              <MaterialIcons name="arrow-back" size={22} color={TEXT} />
              <ThemedText style={styles.modalBackText}>Geri</ThemedText>
            </TouchableOpacity>
            <View style={{ position: 'absolute', left: 0, right: 0, alignItems: 'center' }} pointerEvents="none">
              <ThemedText style={styles.modalTitle}>Kategoriler</ThemedText>
            </View>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={22} color={TEXT} />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={styles.catsLeft}>
              {CATS.map((c) => {
                const active = catActive === c;
                return (
                  <TouchableOpacity
                    key={c}
                    style={[styles.catsItem, active && styles.catsItemActive]}
                    onPress={() => setCatActive(c)}
                  >
                    <ThemedText style={[styles.catsItemText, active && styles.catsItemTextActive]}>{c}</ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
            <ScrollView style={styles.catsRight} showsVerticalScrollIndicator contentContainerStyle={styles.catsRightContent}>
              {catActive === 'Sınıflar' && (
                <View style={styles.catsThreeColumns}>
                  <View style={styles.catsColumn}>
                    <ThemedText type="subtitle" style={styles.catsTitle}>İlkokul Özel Ders</ThemedText>
                    {['1. Sınıf Özel Ders','2. Sınıf Özel Ders','3. Sınıf Özel Ders','4. Sınıf Özel Ders'].map((t)=> (
                      <TouchableOpacity key={t} style={styles.catsLinkRow}>
                        <ThemedText style={styles.catsLink}>{t}</ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.catsColumn}>
                    <ThemedText type="subtitle" style={styles.catsTitle}>Ortaokul Özel Ders</ThemedText>
                    {['5. Sınıf Özel Ders','6. Sınıf Özel Ders','7. Sınıf Özel Ders','8. Sınıf Özel Ders'].map((t)=> (
                      <TouchableOpacity key={t} style={styles.catsLinkRow}>
                        <ThemedText style={styles.catsLink}>{t}</ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.catsColumn}>
                    <ThemedText type="subtitle" style={styles.catsTitle}>Lise Özel Ders</ThemedText>
                    {['9. Sınıf Özel Ders','10. Sınıf Özel Ders','11. Sınıf Özel Ders','12. Sınıf Özel Ders'].map((t)=> (
                      <TouchableOpacity key={t} style={styles.catsLinkRow}>
                        <ThemedText style={styles.catsLink}>{t}</ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {catActive === 'Online Dersler' && (
                <View style={styles.catsThreeColumns}>
                  <View style={styles.catsColumn}>
                    <ThemedText type="subtitle" style={styles.catsTitle}>Temel Dersler</ThemedText>
                    {['Matematik Özel Ders','Fen Bilimleri Özel Ders','Türkçe Özel Ders','Sosyal Bilgiler Özel Ders'].map((t)=> (
                      <TouchableOpacity key={t} style={styles.catsLinkRow}>
                        <ThemedText style={styles.catsLink}>{t}</ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.catsColumn}>
                    <ThemedText type="subtitle" style={styles.catsTitle}>Fen Dersleri</ThemedText>
                    {['Fizik Özel Ders','Kimya Özel Ders','Biyoloji Özel Ders','Geometri Özel Ders'].map((t)=> (
                      <TouchableOpacity key={t} style={styles.catsLinkRow}>
                        <ThemedText style={styles.catsLink}>{t}</ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.catsColumn}>
                    <ThemedText type="subtitle" style={styles.catsTitle}>Sosyal Dersler</ThemedText>
                    {['Türk Dili ve Edebiyatı Özel Ders','Tarih Özel Ders','Coğrafya Özel Ders','Bilgisayar ve Robotik Özel Ders'].map((t)=> (
                      <TouchableOpacity key={t} style={styles.catsLinkRow}>
                        <ThemedText style={styles.catsLink}>{t}</ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {catActive === 'Sınava Hazırlık' && (
                <View style={styles.catsThreeColumns}>
                  <View style={styles.catsColumn}>
                    <ThemedText type="subtitle" style={styles.catsTitle}>Lise Sınavları</ThemedText>
                    {['AYT Hazırlık','TYT Hazırlık','MSÜ Hazırlık','DGS Hazırlık'].map((t)=> (
                      <TouchableOpacity key={t} style={styles.catsLinkRow}>
                        <ThemedText style={styles.catsLink}>{t}</ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.catsColumn}>
                    <ThemedText type="subtitle" style={styles.catsTitle}>Ortaokul Sınavları</ThemedText>
                    {['LGS Hazırlık','Bursluluk Sınavı','PYBS Hazırlık','Lise Hazırlık Özel Ders'].map((t)=> (
                      <TouchableOpacity key={t} style={styles.catsLinkRow}>
                        <ThemedText style={styles.catsLink}>{t}</ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.catsColumn}>
                    <ThemedText type="subtitle" style={styles.catsTitle}>Üniversite Sınavları</ThemedText>
                    {['ALES Hazırlık','KPSS Hazırlık','YÖKDİL Hazırlık','Lisansüstü Hazırlık','Üniversiteye Hazırlık Özel Ders','YKS Özel Ders'].map((t)=> (
                      <TouchableOpacity key={t} style={styles.catsLinkRow}>
                        <ThemedText style={styles.catsLink}>{t}</ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {catActive === 'Yabancı Dil' && (
                <View style={styles.catsThreeColumns}>
                  <View style={styles.catsColumn}>
                    <ThemedText type="subtitle" style={styles.catsTitle}>İngilizce</ThemedText>
                    {['Başlangıç İngilizce','Orta Seviye İngilizce','İleri İngilizce','Business English'].map((t)=> (
                      <TouchableOpacity key={t} style={styles.catsLinkRow}>
                        <ThemedText style={styles.catsLink}>{t}</ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.catsColumn}>
                    <ThemedText type="subtitle" style={styles.catsTitle}>Diğer Diller</ThemedText>
                    {['Almanca Dersleri','Fransızca Dersleri','İspanyolca Dersleri','Rusça Dersleri'].map((t)=> (
                      <TouchableOpacity key={t} style={styles.catsLinkRow}>
                        <ThemedText style={styles.catsLink}>{t}</ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.catsColumn}>
                    <ThemedText type="subtitle" style={styles.catsTitle}>Sınav Hazırlığı</ThemedText>
                    {['TOEFL Hazırlık','IELTS Hazırlık','YÖKDİL Hazırlık','Cambridge Hazırlık'].map((t)=> (
                      <TouchableOpacity key={t} style={styles.catsLinkRow}>
                        <ThemedText style={styles.catsLink}>{t}</ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalCard: {
    width: Math.max(320, Math.round(width * 0.7)),
    maxWidth: Math.max(320, Math.round(width * 0.7)),
    borderRadius: RADIUS.lg,
    backgroundColor: '#ffffff',
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeaderTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  modalBackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalBackText: {
    fontSize: 16,
    color: TEXT,
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT,
    textAlign: 'center',
  },
  catsLeft: {
    width: 260,
    gap: 8,
  },
  catsRight: {
    flex: 1,
    maxHeight: 400,
  },
  catsRightContent: {
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  catsItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    cursor: 'pointer',
  },
  catsItemActive: {
    backgroundColor: '#0053f5',
  },
  catsItemText: {
    color: '#0f172a',
    fontWeight: '600',
  },
  catsItemTextActive: {
    color: '#ffffff',
  },
  catsThreeColumns: {
    flexDirection: 'row',
    gap: 16,
  },
  catsColumn: {
    flex: 1,
    minWidth: 0,
  },
  catsTitle: {
    marginBottom: 6,
  },
  catsLinkRow: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    cursor: 'pointer',
  },
  catsLink: {
    color: '#0f172a',
  },
  categoriesModalWatermark: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  categoriesModalWatermarkLogo: {
    width: '90%',
    height: '70%',
    opacity: 0.08,
  },
});

export default CategoryModal;


