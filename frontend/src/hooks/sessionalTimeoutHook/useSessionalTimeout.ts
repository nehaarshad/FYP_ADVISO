'use client';
import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export const useSessionTimeout = (timeoutMinutes = 30) => {
  const router = useRouter();
  const pathname = usePathname(); // Current URL check karne ke liye
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // 1. Agar user login page ya public page par hai, toh timer start mat karo
    if (pathname === '/views/auth/login' || pathname === '/views/auth/registeration/signup' || pathname === '/session-expired' || pathname === '/') {
      return;
    }
    if (typeof window === 'undefined') return;

    const logoutUser = () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push('/session-expired');
    };

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(logoutUser, timeoutMinutes * 60 * 1000);
    };

    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [router, timeoutMinutes, pathname]);
};