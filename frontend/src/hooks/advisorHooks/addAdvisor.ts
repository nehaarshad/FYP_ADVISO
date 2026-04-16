
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { userManagementRepository } from '../../repositories/userManagementRepository/userManagementRepo';
import { AddAdvisorData } from '@/src/repositories/userManagementRepository/types/addAdvisor';
import { useAdvisorStore } from '../../storage/advisorStore/advisorsData';

export const useAddAdvisor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { addAdvisor: addToStore, fetchAdvisors } = useAdvisorStore();

  const addAdvisor = async (data: AddAdvisorData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await userManagementRepository.addAdvisor(data);
      console.log("add advisor: ",response)
      if (response.success && response.data) {
        const newAdvisor = response.data;
        addToStore(newAdvisor);
        setSuccess(true);
        await fetchAdvisors(true);
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