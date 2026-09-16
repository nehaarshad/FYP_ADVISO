import { AddBatchTimetablePayload, UpdateBatchTimetablePayload } from '@/src/repositories/meetingSchedulingRepo/batchTimetableRepo/types/type';
import { useBatchTimetableStore } from '@/src/storage/batchTimetaleStore/batchTimetableStore';
import { useEffect, useCallback } from 'react';


export const useBatchTimetable = (userId: number | null | undefined) => {
  const {
    timetables,
    isLoading,
    error,
    fetchBatchTimetable,
    addBatchTimetable,
    updateBatchTimetable,
    deleteBatchTimetable,
    getTimetableById,
    clearError,
    clearCache,
  } = useBatchTimetableStore();

  useEffect(() => {
    if (userId) {
      fetchBatchTimetable(userId);
    }
  }, [userId, fetchBatchTimetable]);

  const refresh = useCallback(
    (force = true) => {
      if (userId) return fetchBatchTimetable(userId, force);
    },
    [userId, fetchBatchTimetable]
  );

  const add = useCallback(
    async (timetables: AddBatchTimetablePayload['timetables']) => {
      if (!userId) return { success: false, error: 'User not logged in' };
      return addBatchTimetable({ userId, timetables });
    },
    [userId, addBatchTimetable]
  );

  const update = useCallback(
    async (timetables: UpdateBatchTimetablePayload['timetables']) => {
      if (!userId) return { success: false, error: 'User not logged in' };
      return updateBatchTimetable({ userId, timetables });
    },
    [userId, updateBatchTimetable]
  );

  const remove = useCallback(
    async (id: number) => {
      if (!userId) return { success: false, error: 'User not logged in' };
      return deleteBatchTimetable(id, userId);
    },
    [userId, deleteBatchTimetable]
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