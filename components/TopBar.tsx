import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, Platform, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuthStore } from '@/store/authStore';
import { useLangStore } from '@/store/langStore';
import { colors, globalStyles } from '@/styles/globalStyles';
import { useTranslator } from '@/i18n/translations';

interface TopBarProps {
  currentPage?: string;
  onCategoriesPress?: () => void;
  onCartPress?: () => void;
}

export function TopBar({ currentPage, onCategoriesPress, onCartPress }: TopBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const user = useAuthStore((s) => s.user);
  const userProfile = useAuthStore((s) => s.userProfile);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const firstName = (user?.displayName || userProfile?.displayName || '').split(' ')[0] || '';
  const lang = useLangStore((s) => s.lang);
  const setLang = useLangStore((s) => s.setLang);
  const initLang = useLangStore((s) => s.init);
  const t = useTranslator();

  useEffect(() => { initLang(); }, [initLang]);

  const handleCategoriesPress = () => {
    if (onCategoriesPress) {
      onCategoriesPress();
    }
  };

  const handleCartPress = () => {
    if (onCartPress) {
      onCartPress();
    }
  };

  const handleLogout = () => {
    useAuthStore.getState().logout();
    router.replace('/');
  };

  return (
    <View style={globalStyles.topRegion}>
      {/* Kategori Barı */}
      <View style={[globalStyles.topStrip, { paddingHorizontal: Platform.OS === 'web' ? Math.max(16, Math.round(windowWidth * 0.15)) : 16 }]}>
        <TouchableOpacity style={globalStyles.kategorilerContainer} onPress={handleCategoriesPress}>
          <Image source={require('@/assets/images/kategoriler.png')} style={globalStyles.topStripImg} resizeMode="contain" />
        </TouchableOpacity>
        
        {/* Sağa yaslanmış butonlar */}
        <View style={globalStyles.topStripRightButtons}>
          <TouchableOpacity 
            style={globalStyles.topStripButton} 
            onPress={() => router.push('/blog')}
          >
            <Text style={[globalStyles.topStripButtonText, currentPage === 'blog' && { fontWeight: '700' }]}>
              {t('nav.blog')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={globalStyles.topStripButton} 
            onPress={() => router.push('/corporate')}
          >
            <Text style={[globalStyles.topStripButtonText, currentPage === 'corporate' && { fontWeight: '700' }]}>
              {t('nav.corporate')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={globalStyles.topStripButton} 
            onPress={() => router.push('/teacher')}
          >
            <Text style={[globalStyles.topStripButtonText, currentPage === 'teacher' && { fontWeight: '700' }]}>
              {t('nav.teachers')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={globalStyles.topStripButton} 
            onPress={() => router.push('/about')}
          >
            <Text style={[globalStyles.topStripButtonText, currentPage === 'about' && { fontWeight: '700' }]}>
              {t('nav.about')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Logo Barı (H1) */}
      <View style={[globalStyles.topBar, { paddingTop: insets.top + 3, height: insets.top + 90, paddingHorizontal: Platform.OS === 'web' ? Math.max(16, Math.round(windowWidth * 0.15)) : 16 }]}>
        <View style={globalStyles.topBarRow}>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Image source={require('@/assets/images/logo.png')} style={globalStyles.topBarLogo} resizeMode="contain" />
          </TouchableOpacity>
          <View style={globalStyles.topBarActions}>
            {/* Dil Seçici */}
            <TouchableOpacity style={globalStyles.languageSelector} onPress={() => setLang(lang === 'tr' ? 'en' : 'tr')}>
              <View style={globalStyles.languageIcon}>
                <View style={globalStyles.languageIconLeft}>
                  <Text style={globalStyles.languageIconText}>A</Text>
                </View>
                <View style={globalStyles.languageIconRight}>
                  <Text style={globalStyles.languageIconText}>文</Text>
                </View>
              </View>
              <Text style={globalStyles.languageText}>{lang.toUpperCase()}</Text>
            </TouchableOpacity>

            {/* Özel Ders Al */}
            <TouchableOpacity style={globalStyles.actionLink} onPress={handleCategoriesPress}>
              <Text style={globalStyles.actionLinkText}>{t('nav.bookLesson')}</Text>
            </TouchableOpacity>
            
            {/* Separator */}
            <View style={globalStyles.separator} />
            
            {/* Sepet */}
            <TouchableOpacity style={globalStyles.actionLink} onPress={handleCartPress}>
              <MaterialIcons name="shopping-cart" size={20} color={colors.secondary} />
            </TouchableOpacity>
            
            {/* Kullanıcı giriş yapmışsa farklı butonlar göster */}
            {isAuthenticated ? (
              <>
                {/* Kullanıcı Adı */}
                <TouchableOpacity style={globalStyles.actionLink} onPress={() => router.push('/dashboard')}>
                  <Text style={globalStyles.actionLinkText}>{t('greet.hello')}, {firstName}</Text>
                </TouchableOpacity>
                
                {/* Dashboard */}
                <TouchableOpacity style={globalStyles.actionLink} onPress={() => router.push('/dashboard')}>
                  <Text style={globalStyles.actionLinkText}>{t('auth.dashboard')}</Text>
                </TouchableOpacity>
                
                {/* Çıkış Yap */}
                <TouchableOpacity style={globalStyles.registerButton} onPress={handleLogout}>
                  <Text style={globalStyles.registerButtonText}>{t('auth.logout')}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Oturum Aç */}
                <TouchableOpacity style={globalStyles.actionLink} onPress={() => router.push('/student')}>
                  <Text style={globalStyles.actionLinkText}>{t('auth.signIn')}</Text>
                </TouchableOpacity>
                
                {/* Kayıt Ol */}
                <TouchableOpacity style={globalStyles.registerButton} onPress={() => router.push('/register')}>
                  <Text style={globalStyles.registerButtonText}>{t('auth.signUp')}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
