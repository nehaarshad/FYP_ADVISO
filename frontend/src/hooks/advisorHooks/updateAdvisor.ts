/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useUpdateAdvisor.ts
import { useState } from 'react';
import { advisorProfileRepository, } from '../../repositories/userProfileData/advisorsRepository/advisorRepository';
import {UpdateAdvisorData} from "../../repositories/userManagementRepository/types/updateAdvisor"
import {userManagementRepository} from "../../repositories/userManagementRepository/userManagementRepo"

export const useUpdateAdvisor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [advisorData, setAdvisorData] = useState<any>(null);

  const fetchAdvisor = async (id: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await advisorProfileRepository.getAdvisorById(advisorData,id);
      
      if (response) {
        setAdvisorData(response);
        return { success: true, data: response };
      } else {
        setError( 'Advisor not found');
        return { success: false, error: response };
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateAdvisor = async (id: number, data: UpdateAdvisorData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await userManagementRepository.updateAdvisor(id, data);
      
      if (response.success) {
        setSuccess(true);
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

  return { fetchAdvisor, updateAdvisor, advisorData, isLoading, error, success };
};