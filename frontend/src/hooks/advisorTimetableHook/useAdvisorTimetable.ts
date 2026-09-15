import { AddAdvisorTimetablePayload, UpdateAdvisorTimetablePayload } from '@/src/repositories/meetingSchedulingRepo/advisorTimetableRepo/types/type';
import { useAdvisorTimetableStore } from '@/src/storage/advisorTimetableStore/advisorTimetableStore';
import { useEffect, useCallback } from 'react';


export const useAdvisorTimetable = (userId: number | null | undefined) => {
  const {
    timetables,
    isLoading,
    error,
    fetchAdvisorTimetable,
    addAdvisorTimetable,
    updateAdvisorTimetable,
    deleteAdvisorTimetable,
    getTimetableById,
    clearError,
    clearCache,
  } = useAdvisorTimetableStore();

  useEffect(() => {
    if (userId) {
      fetchAdvisorTimetable(userId);
    }
  }, [userId, fetchAdvisorTimetable]);

  const refresh = useCallback(
    (force = true) => {
      if (userId) return fetchAdvisorTimetable(userId, force);
    },
    [userId, fetchAdvisorTimetable]
  );

  const add = useCallback(
    async (timetables: AddAdvisorTimetablePayload['timetables']) => {
      if (!userId) return { success: false, error: 'User not logged in' };
      return addAdvisorTimetable({ userId, timetables });
    },
    [userId, addAdvisorTimetable]
  );

  const update = useCallback(
    async (timetables: UpdateAdvisorTimetablePayload['timetables']) => {
      if (!userId) return { success: false, error: 'User not logged in' };
      return updateAdvisorTimetable({ userId, timetables });
    },
    [userId, updateAdvisorTimetable]
  );

  const remove = useCallback(
    async (id: number) => {
      if (!userId) return { success: false, error: 'User not logged in' };
      return deleteAdvisorTimetable(id, userId);
    },
    [userId, deleteAdvisorTimetable]
  );

  return {
    timetables,
    isLoading,
    error,
    refresh,
    add,
    update,
    remove,
    getTimetableById,
    clearError,
    clearCache,
  };
};