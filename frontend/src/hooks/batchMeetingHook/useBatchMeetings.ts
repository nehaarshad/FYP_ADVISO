import { CreateMeetingPayload, UpdateMeetingPayload } from '@/src/repositories/batchMeetingRepository/types/batchMeetingTypes';
import { useBatchMeetingStore } from '@/src/storage/batchMeetingStore/batchMeetingStore';
import { useCallback, useEffect } from 'react';


export const useBatchMeetings = (userId: number | null | undefined) => {
  const {
    suggestions,
    meetings,
    isLoading,
    isLoadingSuggestions,
    error,
    fetchSuggestions,
    fetchMeetings,
    createMeeting,
    updateMeeting,
    getMeetingById,
    clearError,
    clearCache,
  } = useBatchMeetingStore();

  useEffect(() => {
    if (userId) {
      fetchSuggestions(userId);
      fetchMeetings(userId);
    }
  }, [userId, fetchSuggestions, fetchMeetings]);

  const refreshSuggestions = useCallback(
    (force = true) => userId && fetchSuggestions(userId, force),
    [userId, fetchSuggestions]
  );

  const refreshMeetings = useCallback(
    (force = true) => userId && fetchMeetings(userId, force),
    [userId, fetchMeetings]
  );

  const create = useCallback(
  async (day: string, startTime: string, endTime: string, date?: string | null) => {
    if (!userId) return { success: false, error: 'User not logged in' };

    // 1) create pending
    const createRes = await createMeeting({ userId, day, startTime, endTime });
    if (!createRes.success || !createRes.data) return createRes;

    console.log("create meeting",createRes)
    // 2) if a date was chosen, promote to scheduled immediately
    if (date) {
      const meetingId = createRes.data.id;
      const updateRes = await updateMeeting(meetingId, {
        userId,
        date,
        status: 'scheduled',
      });
      return updateRes.success
        ? { success: true, data: updateRes.data, message: 'Meeting scheduled' }
        : { success: false, error: updateRes.error || 'Failed to set date' };
    }

    return { ...createRes, message: 'Saved as pending' };
  },
  [userId, createMeeting, updateMeeting]
);

  const update = useCallback(
    async (id: number, patch: Omit<UpdateMeetingPayload, 'userId'>) => {
      if (!userId) return { success: false, error: 'User not logged in' };
      const payload: UpdateMeetingPayload = { userId, ...patch };
      return updateMeeting(id, payload);
    },
    [userId, updateMeeting]
  );

  return {
    suggestions,
    meetings,
    isLoading,
    isLoadingSuggestions,
    error,
    refreshSuggestions,
    refreshMeetings,
    create,
    update,
    getMeetingById,
    clearError,
    clearCache,
  };
};