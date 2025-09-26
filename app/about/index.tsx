import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AIAssistant } from '@/components/AIAssistant';
import CartModal from '@/components/CartModal';
import CategoryModal from '@/components/CategoryModal';
import { TopBar } from '@/components/TopBar';
import { globalStyles } from '@/styles/globalStyles';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const [catsOpen, setCatsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <View style={globalStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Ortak Top Bar */}
      <TopBar 
        currentPage="about"
        onCategoriesPress={() => setCatsOpen(true)}
        onCartPress={() => setCartOpen(true)}
      />
      
      <ScrollView 
        contentContainerStyle={[globalStyles.scrollContent, { paddingTop: 20 }]} 
        showsVerticalScrollIndicator={false}
      >
        {/* Ana İçerik Alanı - Boş bırakıldı */}
        <View style={styles.contentContainer}>
          <Text style={styles.placeholder}>
            Hakkımızda sayfası içeriği buraya eklenecek...
          </Text>
          
          {/* İçerik alanı - yazılar ve görseller için hazır */}
          <View style={styles.contentArea}>
            {/* Buraya yazılar ve görseller eklenecek */}
          </View>
        </View>
      </ScrollView>

      {/* Ortak Modaller */}
      <CategoryModal visible={catsOpen} onClose={() => setCatsOpen(false)} />
      <CartModal visible={cartOpen} onClose={() => setCartOpen(false)} />

      {/* AI Asistan Maskot */}
      <AIAssistant />
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  placeholder: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 40,
  },
  contentArea: {
    flex: 1,
    minHeight: 400, // İçerik için minimum yükseklik
    // Buraya özel stiller eklenebilir
  },
});
