/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useUpdateStudent.ts
import { useState } from 'react';
import {UpdateStudentData} from "../../repositories/userManagementRepository/types/updateStudents"
import { userManagementRepository } from '../../repositories/userManagementRepository/userManagementRepo';
import {studentProfileRepository} from '../../repositories/userProfileData/studentsRepository/studentsRepo'

export const useUpdateStudent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);

  const fetchStudent = async (id: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await studentProfileRepository.getStudentById(studentData,id);
      
      if (response) {
        setStudentData(response);
        return { success: true, data: response };
      } else {
        setError(response || 'Student not found');
        return { success: false, error: response };
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentBySapId = async (sapid: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await studentProfileRepository.getStudentBySapId(studentData,sapid);
      
      if (response) {
        setStudentData(response);
        return { success: true, data: response };
      } else {
        setError(response || 'Student not found');
        return { success: false, error: response };
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateStudent = async (id: number, data: UpdateStudentData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await userManagementRepository.updateStudent(id, data);
      
      if (response.success) {
        setSuccess(true);
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

  return { fetchStudent, fetchStudentBySapId, updateStudent, studentData, isLoading, error, success };
};