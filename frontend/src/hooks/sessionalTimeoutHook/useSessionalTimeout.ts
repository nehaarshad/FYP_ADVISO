/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { sessionManager } from '@/src/services/sessionManagement/sessionManager';
import { useAuth } from '../authHook/useAuth';


export const useSessionTimeout = (timeoutMinutes = 30) => {
  const router = useRouter();
  // Get the current URL path to check if the user is on a public page

    const { logout } = useAuth();
   const handleLogout = async () => {
      try {
        const currentUser = sessionManager.getCurrentUser<any>();
  
        if (currentUser?.id) {
          await logout(currentUser.id);
        } else {
          sessionManager.destroySession();
        }
  
        router.push("/views/auth/login");
      } catch (error) {
        console.error("Logout error:", error);
        sessionManager.destroySession();
        router.push("/views/auth/login");
      }
    };
  const pathname = usePathname(); 
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // 1. Do not start the timer if the user is on a public page (Login, Signup, Expired, Landing)
    if (pathname === '/views/auth/login' || pathname === '/views/auth/registeration/signup' || pathname === '/session-expired' || pathname === '/') {
      return;
    }
    
    // Ensure the code runs only on the client side
    if (typeof window === 'undefined') return;

    // Function to clear local storage and redirect when the session expires
    const logoutUser = async () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      await handleLogout();
      router.push('/session-expired');
    };

    // Function to reset the timer on activity (if extended later)
    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      // Set timer to logout after the specified minutes
      timerRef.current = setTimeout(logoutUser, timeoutMinutes * 60 * 1000);
    };

    // Initialize the timer
    resetTimer();

    // Cleanup function to clear the timer when the component unmounts
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [router, timeoutMinutes, pathname]);
};