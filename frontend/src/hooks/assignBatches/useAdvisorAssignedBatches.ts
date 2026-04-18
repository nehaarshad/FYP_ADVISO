/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/advisorHooks/useAdvisorAssignedBatches.ts
import { useState, useEffect } from 'react';
import { useAdvisorStore } from '../../storage/advisorStore/advisorsData';
import { sessionManager } from '@/src/services/sessionManagement/sessionManager';

export const useAdvisorAssignedBatches = () => {
  const [assignedBatches, setAssignedBatches] = useState<any[]>([]);
  const [currentAdvisor, setCurrentAdvisor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchAdvisors = useAdvisorStore(state => state.fetchAdvisors);

  const fetchAdvisorData = async () => {
    setIsLoading(true);
    try {
      let userSapId = null;
      
      const currentUser = sessionManager.getCurrentUser<any>();
      if (currentUser) {
        userSapId = currentUser.data?.sapid || currentUser.sapid;
      }
      
      if (!userSapId && typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          userSapId = parsedUser.data?.sapid || parsedUser.sapid;
        }
      }

      if (!userSapId) {
        console.error('No user SAP ID found');
        setIsLoading(false);
        return;
      }

      const freshAdvisors = await fetchAdvisors(true) as any[];

      if (!freshAdvisors || freshAdvisors.length === 0) {
        setIsLoading(false);
        return;
      }

      const advisor = freshAdvisors.find((a: any) => a.User?.sapid === userSapId);

      if (advisor) {
        setCurrentAdvisor(advisor);
        const batches = (advisor.BatchAssignments || []).map((assignment: any) => ({
          id: assignment.BatchModel?.id,
          batchName: assignment.BatchModel?.batchName,
          batchYear: assignment.BatchModel?.batchYear,
          programName: assignment.BatchModel?.ProgramModel?.programName,
          programId: assignment.BatchModel?.ProgramModel?.id,
          assignmentId: assignment.id,
          startDate: assignment.startDate,
          endDate: assignment.endDate,
          isCurrentlyAdvised: assignment.isCurrentlyAdvised
        }));
        setAssignedBatches(batches);
      }
    } catch (error) {
      console.error('Error loading advisor assigned batches:', error);
    } finally {
      setIsLoading(false);
    }
  };

    useEffect(() => {
    fetchAdvisorData();
  }, []);

  return {
    assignedBatches,
    currentAdvisor,
    isLoading,
    hasAssignedBatches: assignedBatches.length > 0,
    fetchAdvisorData
  };
};