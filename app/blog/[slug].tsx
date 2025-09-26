import Markdown from '@/components/Markdown';
import { ThemedText } from '@/components/ThemedText';
import { TopBar } from '@/components/TopBar';
import { Colors } from '@/constants/Colors';
import { BLOG_POSTS, findPostBySlug } from '@/data/blog';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';

const FALLBACK = require('@/assets/images/banner_4.png');

function setSeo(title: string, description: string) {
  if (Platform.OS !== 'web') return;
  document.title = title;
  const name = 'description';
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', description);
}

export default function BlogDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const colors = Colors['light'];
  const { width: winW } = useWindowDimensions();

  const post = useMemo(() => findPostBySlug(String(slug || '')), [slug]);
  const title = post?.title || String(slug || '').replace(/-/g, ' ');
  const cover = post?.cover || FALLBACK;
  const reading = post?.readingMinutes ?? Math.max(3, Math.round((post?.content?.split(/\s+/).length || 400) / 200));

  // Responsive genişlik hesaplaması - blog sayfası ile aynı
  const mainContentWidth = Platform.OS === 'web' ? Math.min(1200, Math.max(800, winW * 0.9)) : winW;
  const isNarrow = Platform.OS === 'web' ? winW < 900 : true;

  useEffect(() => {
    if (post) setSeo(`${post.title} | Blog - Odak Mentor`, post.excerpt);
  }, [post]);

  const related = useMemo(() => {
    if (!post) return [] as typeof BLOG_POSTS;
    return BLOG_POSTS.filter(p => p.slug !== post.slug && (p.categories.some(c => post.categories.includes(c)) || p.tags.some(t => post.tags.includes(t)))).slice(0, 3);
  }, [post]);

  if (!post) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={20} color={colors.textPrimary} />
          <ThemedText style={{ color: colors.textPrimary }}>Geri</ThemedText>
        </TouchableOpacity>
        <ThemedText style={[styles.title, { color: colors.textPrimary }]}>Yazı bulunamadı</ThemedText>
        <ThemedText style={{ color: colors.textSecondary }}>Aradığınız yazı kaldırılmış olabilir.</ThemedText>
      </ScrollView>
    );
  }

  return (
    <>
      {/* Ortak Top Bar */}
      <TopBar 
        currentPage="blog"
        onCategoriesPress={() => {}}
        onCartPress={() => {}}
      />
      
      <ScrollView contentContainerStyle={styles.container}>

      {/* %65 blog yazısı - %25 hashtagler - %10 boşluk */}
      <View style={[styles.columnsRow, { width: mainContentWidth, alignSelf: 'center' }, isNarrow ? { flexDirection: 'column' } : { flexDirection: 'row' }]}>
        {/* %65: Blog içeriği */}
        <View style={[styles.centerCol, isNarrow && { width: '100%' }]}>
          <Image source={cover} style={styles.cover} resizeMode="cover" />
          <ThemedText style={[styles.title, { color: colors.textPrimary }]}>{title}</ThemedText>
          <ThemedText style={[styles.meta, { color: colors.textSecondary }]}>
            {post.author} • {post.date} • {reading} dk okuma
          </ThemedText>
          <Markdown content={post.content} />
        </View>

        {/* %25: Hashtagler */}
        <View style={[styles.rightCol, isNarrow && { width: '100%' }]}>
          <View style={styles.tagsContainer}>
            <ThemedText style={styles.tagsTitle}>Etiketler</ThemedText>
            <View style={styles.tagsList}>
              {post.categories.map((c) => (
                <View key={c} style={styles.tagItem}>
                  <ThemedText style={styles.tagText}>{c}</ThemedText>
                </View>
              ))}
              {post.tags.map((t) => (
                <View key={t} style={styles.tagItem}>
                  <ThemedText style={styles.tagText}>#{t}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* %10: Sağ boşluk */}
        <View style={[styles.rightSpacer, isNarrow && { width: '0%' }]} />
      </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 8,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  topBarLogoContainer: {
    height: '100%',
    justifyContent: 'center',
  },
  topBarLogo: {
    width: 270,
    height: 66,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  columnsRow: {
    flexDirection: Platform.select({ web: 'row', default: 'column' }) as any,
    gap: 30,
    alignItems: 'flex-start',
  },
  rightSpacer: {
    width: Platform.select({ web: '10%', default: '0%' }) as any,
  },
  centerCol: {
    width: Platform.select({ web: '65%', default: '100%' }) as any,
    gap: 12,
  },
  rightCol: {
    width: Platform.select({ web: '25%', default: '100%' }) as any,
    gap: 8,
  },
  cover: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    marginBottom: 8,
  },
  tagsContainer: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 20,
    gap: 12,
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  tagsList: {
    gap: 8,
  },
  tagItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tagText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
});


