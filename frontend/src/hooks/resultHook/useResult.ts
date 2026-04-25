/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/courseManagement/useResults.ts
import { useState, useCallback } from 'react';
import { resultsRepository } from '@/src/repositories/sessionContentManagement/resultsRepositories';
import { UploadResultData } from '@/src/repositories/sessionContentManagement/types/uploadResult';

export const useResults = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadResults = useCallback(async (data: UploadResultData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setUploadProgress(0);
    
    try {
      const interval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);
      
      const response = await resultsRepository.uploadSessionalResult(data);
      
      clearInterval(interval);
      setUploadProgress(100);
      
      if (response.success) {
        setSuccess(true);
        return { success: true };
      } else {
        setError(response.error || 'Upload failed');
        return { success: false };
      }
    } catch (err: any) {
      setError(err.message);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSuccess = useCallback(() => setSuccess(false), []);
  const clearError = useCallback(() => setError(null), []);

  return {
    isLoading,
    error,
    success,
    uploadProgress,
    uploadResults,
    clearSuccess,
    clearError,
  };
};