// src/hooks/useAuthGuard.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sessionManager } from '@/src/services/sessionManagement/sessionManager';

export const useAuthGuard = () => {
  const router = useRouter();

  useEffect(() => {
    const  token =sessionManager.getSessionToken() || '';

    if (!token) {
      router.push('/session-expired');
    }
  }, [router]);
};