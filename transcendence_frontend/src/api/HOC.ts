import { useEffect } from 'react';
import Cookies from 'js-cookie';

export function useRequireAuth(redirectUrl = '/') {
  useEffect(() => {
    // S'assurer que le code s'exécute uniquement côté client
    if (typeof window !== 'undefined') {
      const token = Cookies.get('jwt');
      if (!token) {
        window.location.href = redirectUrl;
      }
    }
  }, [redirectUrl]);
}
