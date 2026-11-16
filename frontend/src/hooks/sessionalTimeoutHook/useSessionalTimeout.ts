/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { sessionManager } from '@/src/services/sessionManagement/sessionManager';
import { useAuth } from '../authHook/useAuth';

export const useSessionTimeout = (timeoutMinutes = 30) => {
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const publicRoutes = [
      '/',
      '/views/auth/login',
      '/views/auth/registeration/signup',
      '/session-expired',
    ];

    // Never run the session timer on public pages
    if (publicRoutes.includes(pathname)) {
      return;
    }

    const logoutUser = async () => {
      try {
        const currentUser = sessionManager.getCurrentUser<any>();

        if (currentUser?.id) {
          await logout(currentUser.id);
        }
      } catch (error) {
        console.error('Session logout error:', error);
      } finally {
        sessionManager.destroySession();
        router.replace('/session-expired');
      }
    };

    const resetTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(
        logoutUser,
        timeoutMinutes * 60 * 1000
      );
    };

    resetTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [pathname, router, timeoutMinutes, logout]);
};
