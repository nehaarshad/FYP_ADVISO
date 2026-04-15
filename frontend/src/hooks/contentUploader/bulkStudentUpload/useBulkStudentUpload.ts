/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useBulkUpload.ts
import { useState } from 'react';
import { userManagementRepository,  } from '../../../repositories/userManagementRepository/userManagementRepo';
import {BulkUploadData} from '../../../repositories/userManagementRepository/types/bulkStudentUploader'

export const useBulkUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const bulkUpload = async (data: BulkUploadData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setUploadProgress(0);
    
    try {
      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);
      
      const response = await userManagementRepository.bulkUploadStudents(data);
      
      clearInterval(interval);
      setUploadProgress(100);
      
      if (response.success) {
        setSuccess(true);
        return { success: true, data: response.data };
      } else {
        setError(response.error || 'Failed to upload students');
        return { success: false, error: response.error };
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return { bulkUpload, isLoading, error, success, uploadProgress };
};