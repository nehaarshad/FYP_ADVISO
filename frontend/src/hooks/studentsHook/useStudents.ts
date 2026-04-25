// src/hooks/studentsHook/useStudents.ts
import { useEffect, useCallback, useMemo, useRef } from 'react';
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

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchStudents();
    }
  }, [fetchStudents]);

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
    if (!students || !Array.isArray(students)) return [];
    return [...new Set(students.map(s => s.BatchModel?.batchName).filter(Boolean))];
  }, [students]);

  const getUniqueBatchYears = useMemo(() => {
    if (!students || !Array.isArray(students)) return [];
    return [...new Set(students.map(s => s.BatchModel?.batchYear).filter(Boolean))];
  }, [students]);

  const getUniquePrograms = useMemo(() => {
    if (!students || !Array.isArray(students)) return [];
    return [...new Set(students.map(s => s.BatchModel?.ProgramModel?.programName).filter(Boolean))];
  }, [students]);

  const getUniqueStatuses = useMemo(() => {
    if (!students || !Array.isArray(students)) return [];
    return [...new Set(students.map(s => s.StudentStatus?.currentStatus).filter(Boolean))];
  }, [students]);

  return {
    students: filteredStudents,
    allStudents: students,
    isLoading,
    error,
    filters,
    statistics,
    totalCount: filteredStudents?.length || 0,
    totalAllCount: students?.length || 0,
    batchNames: getUniqueBatchNames,
    batchYears: getUniqueBatchYears,
    programs: getUniquePrograms,
    statuses: getUniqueStatuses,
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