/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useAddAdvisor.ts
import { useState } from 'react';
import { userManagementRepository } from '../../repositories/userManagementRepository/userManagementRepo'
import { AddAdvisorData } from '@/src/repositories/userManagementRepository/types/addAdvisor';

export const useAddAdvisor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const addAdvisor = async (data: AddAdvisorData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await userManagementRepository.addAdvisor(data);
      
      if (response.success) {
        setSuccess(true);
        return { success: true, data: response.data };
      } else {
        setError(response.error || 'Failed to add advisor');
        return { success: false, error: response.error };
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return { addAdvisor, isLoading, error, success };
};