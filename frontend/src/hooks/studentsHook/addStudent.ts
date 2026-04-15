/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import { userManagementRepository,  } from '../../repositories/userManagementRepository/userManagementRepo';
import {AddStudentData} from '../../repositories/userManagementRepository/types/addStudent'
export const useAddStudent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const addStudent = async (data: AddStudentData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {

        console.log("add student data", data)
      const response = await userManagementRepository.addStudent(data);
      
      if (response.success) {
        setSuccess(true);
        return { success: true, data: response.data };
      } else {
        setError(response.error || 'Failed to add student');
        return { success: false, error: response.error };
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return { addStudent, isLoading, error, success };
};