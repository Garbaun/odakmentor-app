import { create } from 'zustand';

export type AppLanguage = 'tr' | 'en';

interface LangState {
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
  init: () => void;
}

export const useLangStore = create<LangState>((set, get) => ({
  lang: 'tr',
  setLang: (lang) => {
    set({ lang });
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('app_lang', lang);
      }
    } catch {}
  },
  init: () => {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('app_lang') as AppLanguage | null;
        if (saved === 'tr' || saved === 'en') {
          set({ lang: saved });
        }
      }
    } catch {}
  },
}));


