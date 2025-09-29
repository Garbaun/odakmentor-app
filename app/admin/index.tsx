import { useEffect } from 'react';

export default function AdminRedirect() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.replace('/admin/statistics');
    }
  }, []);

  return null;
}