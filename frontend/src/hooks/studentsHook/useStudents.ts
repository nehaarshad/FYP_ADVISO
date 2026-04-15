
import { useEffect, useCallback, useMemo } from 'react';
import { useStudentStore } from '../../storage/studentsStore/studentsData';

export const useStudents = () => {
  const {
    students,
    filteredStudents,
    isLoading,
    error,
    filters,
    statistics,
    fetchStudents,
    setFilters,
    clearFilters,
    getStudentById,
    getStudentBySapId,
    clearError,
  } = useStudentStore();

  useEffect(() => {
    fetchStudents();
  }, []);

  const searchStudents = useCallback((searchTerm: string) => {
    setFilters({ searchTerm });
  }, [setFilters]);

  const filterByBatch = useCallback((batchName: string, batchYear: string) => {
    setFilters({ batchName, batchYear });
  }, [setFilters]);

  const filterByProgram = useCallback((programName: string) => {
    setFilters({ programName });
  }, [setFilters]);

  const filterByStatus = useCallback((currentStatus: string) => {
    setFilters({ currentStatus });
  }, [setFilters]);

  const filterBySemester = useCallback((currentSemester: number) => {
    setFilters({ currentSemester });
  }, [setFilters]);

  const getUniqueBatchNames = useMemo(() => {
    return [...new Set(students.map(s => s.BatchModel.batchName))];
  }, [students]);

  const getUniqueBatchYears = useMemo(() => {
    return [...new Set(students.map(s => s.BatchModel.batchYear))];
  }, [students]);

  const getUniquePrograms = useMemo(() => {
    return [...new Set(students.map(s => s.BatchModel.ProgramModel.programName))];
  }, [students]);

  const getUniqueStatuses = useMemo(() => {
    return [...new Set(students.map(s => s.StudentStatus.currentStatus))];
  }, [students]);

  return {
    // Data
    students: filteredStudents,
    allStudents: students,
    isLoading,
    error,
    filters,
    statistics,
    
    // Metadata
    totalCount: filteredStudents.length,
    totalAllCount: students.length,
    
    // Unique values for filters
    batchNames: getUniqueBatchNames,
    batchYears: getUniqueBatchYears,
    programs: getUniquePrograms,
    statuses: getUniqueStatuses,
    
    // Actions
    fetchStudents,
    searchStudents,
    filterByBatch,
    filterByProgram,
    filterByStatus,
    filterBySemester,
    setFilters,
    clearFilters,
    getStudentById,
    getStudentBySapId,
    clearError,
  };
};