import { Platform, StyleSheet } from 'react-native';

// Renk paleti
export const colors = {
  // Ana renkler
  primary: '#0f104f',
  secondary: '#0053f5',
  
  // Arka plan
  background: '#ffffff',
  surface: '#ffffff',
  
  // Metin
  textPrimary: '#000000',
  textSecondary: '#555555',
  textLight: '#ffffff',
  
  // Kenar çizgileri
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  
  // Durum renkleri
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

// Tipografi
export const typography = {
  // Başlıklar
  h1: {
    fontSize: Platform.select({ web: 36, default: 28 }),
    fontWeight: '800' as const,
    lineHeight: Platform.select({ web: 44, default: 34 }),
  },
  h2: {
    fontSize: Platform.select({ web: 28, default: 24 }),
    fontWeight: '700' as const,
    lineHeight: Platform.select({ web: 36, default: 30 }),
  },
  h3: {
    fontSize: Platform.select({ web: 24, default: 20 }),
    fontWeight: '600' as const,
    lineHeight: Platform.select({ web: 32, default: 26 }),
  },
  
  // Gövde metni
  body: {
    fontSize: Platform.select({ web: 18, default: 16 }),
    fontWeight: '400' as const,
    lineHeight: Platform.select({ web: 28, default: 24 }),
  },
  bodySmall: {
    fontSize: Platform.select({ web: 16, default: 14 }),
    fontWeight: '400' as const,
    lineHeight: Platform.select({ web: 24, default: 20 }),
  },
  
  // Butonlar
  button: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  buttonSmall: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
};

// Spacing sistemi
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Global stiller
export const globalStyles = StyleSheet.create({
  // Container'lar
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  
  // Top Region (Tüm sayfalarda aynı)
  topRegion: {
    position: 'relative',
    zIndex: 999,
    backgroundColor: colors.background,
  },
  topStrip: {
    width: '100%',
    height: 52,
    backgroundColor: '#0f104f', // Ana sayfadan alınan renk
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  topStripImg: {
    width: 260,
    height: 36,
  },
  kategorilerContainer: {
    cursor: 'pointer',
  },
  topStripRightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginRight: 15,
  },
  topStripButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999, // pill radius - tamamen yuvarlak
    backgroundColor: 'transparent',
  },
  topStripButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Logo Bar - Ana sayfadan alınan stiller
  topBar: {
    backgroundColor: colors.background,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingBottom: 4,
    minHeight: 90, // 100'den %10 düşürüldü (100 * 0.9 = 90)
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 72, // 80'den %10 düşürüldü (80 * 0.9 = 72)
  },
  topBarLogo: {
    width: 393.75, // Ana sayfadan alınan boyut
    height: 84.375,
    marginLeft: -10,
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  
  // Dil seçici
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  languageIcon: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  languageIconLeft: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  languageIconRight: {
    backgroundColor: colors.borderLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  languageIconText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textLight,
  },
  languageText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  
  // Action butonları
  actionLink: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    cursor: 'pointer',
  },
  actionLinkText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: colors.border,
  },
  registerButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 8, // Ana sayfadan alınan değer
    paddingHorizontal: 16, // Ana sayfadan alınan değer
    borderRadius: 999, // pill radius - tamamen yuvarlak
    cursor: 'pointer',
  },
  registerButtonText: {
    ...typography.button,
    color: colors.textLight,
  },
  
  // Ana buton stilleri - Ana sayfadan alınan
  primaryButton: {
    backgroundColor: colors.secondary, // #0053f5
    paddingVertical: 8, // Ana sayfadan alınan değer
    paddingHorizontal: 16, // Ana sayfadan alınan değer
    borderRadius: 999, // pill radius - tamamen yuvarlak
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: typography.button.fontSize,
    fontWeight: '600',
    color: colors.textLight,
    textAlign: 'center',
  },
  
  // İkincil buton stilleri
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 8, // Ana sayfadan alınan değer
    paddingHorizontal: 16, // Ana sayfadan alınan değer
    borderRadius: 999, // pill radius - tamamen yuvarlak
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  
  // Link buton stilleri
  linkButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    backgroundColor: 'transparent',
  },
  linkButtonText: {
    fontSize: typography.button.fontSize,
    color: colors.secondary,
    fontWeight: '500',
  },
  
  // Ana içerik
  mainContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xl,
  },
  
  // Başlık bölümü
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  mainTitle: {
    ...typography.h1,
    textAlign: 'center',
    marginBottom: spacing.md,
    color: colors.textPrimary,
  },
  mainSubtitle: {
    ...typography.body,
    textAlign: 'center',
    maxWidth: 700,
    color: colors.textSecondary,
  },
  
  // Modal stiller
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
    backgroundColor: 'transparent',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalCard: {
    width: Platform.OS === 'web' ? '70%' : '100%',
    maxWidth: Platform.OS === 'web' ? 800 : 420,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
});
