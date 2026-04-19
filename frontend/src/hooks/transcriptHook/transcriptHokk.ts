/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/transcriptHook/useTranscript.ts
import { useState, useCallback } from 'react';
import { transcriptRepository } from '@/src/repositories/transcriptRepository/studentTranscriptRepo';
import { DegreeTranscript } from '@/src/models/degreeTranscriptModel';

export const useTranscript = () => {
  const [transcript, setTranscript] = useState<DegreeTranscript | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentTranscript = useCallback(async (studentId: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await transcriptRepository.getStudentTranscript(studentId);
      
      if (response.success && response.data) {
        setTranscript(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.error || 'Failed to fetch transcript');
        return { success: false, error: response.error };
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript(null);
    setError(null);
  }, []);

 
  // Helper methods
  const getCGPA = useCallback(() => {
     if (!transcript) return '0.00';
    return transcriptRepository.calculateCGPA(transcript);
  }, [transcript]);

  const getTotalEarnedCredits = useCallback(() => {
     if (!transcript) return 0;
    return transcriptRepository.getTotalEarnedCredits(transcript);
  }, [transcript]);

  const getSemesterData = useCallback(() => {
     if (!transcript) return [];
    return transcriptRepository.groupCoursesBySemester(transcript);
  }, [transcript]);

  return {
    transcript,
    isLoading,
    error,
    fetchStudentTranscript,
    clearTranscript,
    getCGPA,
    getTotalEarnedCredits,
    getSemesterData,
  };
};