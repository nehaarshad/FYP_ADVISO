/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { UpdateAdvisorData } from "../../repositories/userManagementRepository/types/updateAdvisor";
import { userManagementRepository } from '../../repositories/userManagementRepository/userManagementRepo';
import { useAdvisorStore } from '../../storage/advisorStore/advisorsData';

export const useUpdateAdvisor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { updateAdvisor: updateInStore, fetchAdvisors, getAdvisorBySapId } = useAdvisorStore();

  const fetchAdvisorBySapIdFromStore = async (sapid: number) => {
    // First try to get from store
    let advisor = getAdvisorBySapId(sapid);
    
    // If not in store, fetch all advisors
    if (!advisor) {
      await fetchAdvisors(true);
      advisor = getAdvisorBySapId(sapid);
    }
    
    return advisor;
  };

  const updateAdvisor = async (id: number, data: UpdateAdvisorData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await userManagementRepository.updateAdvisor(id, data);
      
      if (response.success) {
        setSuccess(true);
        // Update in store immediately
        updateInStore(id, data as any);
        // Refresh from backend to ensure consistency
        await fetchAdvisors(true);
        return { success: true, data: response.data };
      } else {
        setError(response.error || 'Failed to update advisor');
        return { success: false, error: response.error };
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    fetchAdvisorBySapIdFromStore, 
    updateAdvisor, 
    isLoading, 
    error, 
    success 
  };
};