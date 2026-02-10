'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores';
import { toast } from 'sonner';

/**
 * Listens for 401 (session expired) from the API client and syncs auth store
 * so the UI shows logged-out state and the user gets a clear message.
 */
export function AuthSync() {
  useEffect(() => {
    const handleSessionExpired = () => {
      useAuthStore.getState().logout();
      toast.error('Tu sesión ha expirado. Inicia sesión de nuevo.');
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, []);

  return null;
}
