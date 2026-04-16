/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { UpdateStudentData } from "../../repositories/userManagementRepository/types/updateStudents";
import { userManagementRepository } from '../../repositories/userManagementRepository/userManagementRepo';
import { useStudentStore } from '../../storage/studentsStore/studentsData';

export const useUpdateStudent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { updateStudent: updateInStore, fetchStudents } = useStudentStore();

  const updateStudent = async (id: number, data: UpdateStudentData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await userManagementRepository.updateStudent(id, data);
      
      if (response.success) {
        setSuccess(true);
        // Update in store immediately
        updateInStore(id, data as any);
        // Refresh from backend to ensure consistency
        await fetchStudents(true);
        return { success: true, data: response.data };
      } else {
        setError(response.error || 'Failed to update student');
        return { success: false, error: response.error };
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return { updateStudent, isLoading, error, success };
};