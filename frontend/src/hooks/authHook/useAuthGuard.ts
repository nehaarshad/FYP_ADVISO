
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { sessionManager } from '@/src/services/sessionManagement/sessionManager';

const PUBLIC_ROUTES = [
  '/',
  '/views/auth/login',
  '/views/auth/registeration/signup',
  '/session-expired',
];

export const useAuthGuard = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (PUBLIC_ROUTES.includes(pathname)) {
      return;
    }

    const token = sessionManager.getSessionToken();

    // Redirect only from protected pages
    if (!token) {
      router.replace('/session-expired');
    }
  }, [pathname, router]);
};
