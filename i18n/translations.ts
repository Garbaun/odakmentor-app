import { AppLanguage, useLangStore } from '@/store/langStore';

export type TranslationKey =
  | 'nav.blog'
  | 'nav.corporate'
  | 'nav.teachers'
  | 'nav.about'
  | 'nav.bookLesson'
  | 'auth.signIn'
  | 'auth.signUp'
  | 'auth.dashboard'
  | 'auth.logout'
  | 'greet.hello';

const tr: Record<TranslationKey, string> = {
  'nav.blog': 'Blog',
  'nav.corporate': 'Kurumsal',
  'nav.teachers': 'Eğitmenler',
  'nav.about': 'Hakkımızda',
  'nav.bookLesson': 'Özel Ders Al',
  'auth.signIn': 'Oturum Aç',
  'auth.signUp': 'Kayıt Ol',
  'auth.dashboard': 'Panel',
  'auth.logout': 'Çıkış Yap',
  'greet.hello': 'Merhaba',
};

const en: Record<TranslationKey, string> = {
  'nav.blog': 'Blog',
  'nav.corporate': 'Corporate',
  'nav.teachers': 'Teachers',
  'nav.about': 'About',
  'nav.bookLesson': 'Book a Lesson',
  'auth.signIn': 'Sign In',
  'auth.signUp': 'Sign Up',
  'auth.dashboard': 'Dashboard',
  'auth.logout': 'Log Out',
  'greet.hello': 'Hello',
};

const dict: Record<AppLanguage, Record<TranslationKey, string>> = { tr, en };

export function getTranslator(lang: AppLanguage) {
  return (key: TranslationKey) => dict[lang][key] ?? key;
}

export function useTranslator() {
  const lang = useLangStore((s) => s.lang);
  return getTranslator(lang);
}


