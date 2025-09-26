import { useEffect } from 'react';
import { Platform } from 'react-native';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

export function GoogleAnalytics({ measurementId = 'G-XXXXXXXXXX' }: GoogleAnalyticsProps) {
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      // Google Analytics 4 script'i ekle
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      // gtag fonksiyonunu tanımla
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      window.gtag = gtag;

      // Google Analytics'i başlat
      gtag('js', new Date());
      gtag('config', measurementId, {
        page_title: document.title,
        page_location: window.location.href,
      });

      // Sayfa değişikliklerini takip et
      const handleRouteChange = () => {
        gtag('config', measurementId, {
          page_title: document.title,
          page_location: window.location.href,
        });
      };

      // Popstate event listener ekle
      window.addEventListener('popstate', handleRouteChange);

      return () => {
        window.removeEventListener('popstate', handleRouteChange);
        // Script'i temizle
        const existingScript = document.querySelector(`script[src*="${measurementId}"]`);
        if (existingScript) {
          existingScript.remove();
        }
      };
    }
  }, [measurementId]);

  return null;
}

// Event tracking fonksiyonları
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackPageView = (pageName: string, pageTitle?: string) => {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: pageTitle || document.title,
      page_location: window.location.href,
      page_name: pageName,
    });
  }
};

// Global window type extension
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
