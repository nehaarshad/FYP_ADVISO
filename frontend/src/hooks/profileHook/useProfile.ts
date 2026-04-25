/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/userProfile/useUserProfile.ts
import { useState, useEffect, useCallback } from 'react';
import { userProfileRepository, UserProfile } from '../../repositories/userProfileData/currentlyLoggedUserRepository/loggedInUserRepository';
import { sessionManager } from '@/src/services/sessionManagement/sessionManager';

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get current user from session
      const currentUser = sessionManager.getCurrentUser<any>();
      const userId = currentUser?.data?.id || currentUser?.id;
 
      if (!userId) {
        throw new Error('No user found in session');
      }
      
      const response = await userProfileRepository.getUserById(userId);
      
      if (response.success && response.data && response.data.data) {
        setUserProfile(response.data.data);
      } else {
        throw new Error(response.error || 'Failed to fetch user profile');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Get display name based on role
  const getDisplayName = useCallback(() => {
    if (!userProfile) return 'User';
    console.log("to get user name: " ,userProfile)
    if (userProfile.profile.advisorName) return userProfile.profile.advisorName;
    if (userProfile.profile.coordinatorName) return userProfile.profile.coordinatorName;
    if (userProfile.profile.studentName) return userProfile.profile.studentName;
    if (userProfile.profile.name) return userProfile.profile.name;
    
    return `${userProfile.role?.charAt(0).toUpperCase()}${userProfile.role?.slice(1)}`;
  }, [userProfile]);
  

  // Get email
  const getEmail = useCallback(() => {
    if (!userProfile) return '';
    return userProfile.email || userProfile.profile?.email || '';
  }, [userProfile]);

  // Get role display name
  const getRoleDisplay = useCallback(() => {
    if (!userProfile) return '';
    const role = userProfile.role;
    return role ? role.charAt(0).toUpperCase() + role.slice(1) : '';
  }, [userProfile]);

  return {
    userProfile,
    isLoading,
    error,
    fetchUserProfile,
    getDisplayName,
    getEmail,
    getRoleDisplay,
  };
};