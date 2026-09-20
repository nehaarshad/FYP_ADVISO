/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useMemo } from 'react';
import { recommendationRepository } from '@/src/repositories/recommendationRepository/systemRecommendation';
import { useUserProfile } from '../profileHook/useProfile';
import {
  buildAllRecommendedCourses,
  NormalizedRecommendation,
  normalizeRecommendation,
} from './states/recommendationMapper';

interface StudentRecommendationState {
  recommendations: NormalizedRecommendation[];
  isLoading: boolean;
  error: string | null;
}

const pickPayloads = (response: any): any[] => {
  if (!response?.success || !response?.data) return [];
  const d = response.data;
  if (Array.isArray(d.data)) return d.data;
  if (Array.isArray(d)) return d;
  if (d.data) return [d.data];
  return [d];
};

export const useStudentRecommendations = () => {
  const [state, setState] = useState<StudentRecommendationState>({
    recommendations: [],
    isLoading: false,
    error: null,
  });
  const { userProfile } = useUserProfile();

  const fetchStudentRecommendations = useCallback(async () => {
    const studentId = userProfile?.profile?.id;
    if (!studentId) {
      setState(prev => ({
        ...prev,
        error: 'Student profile not found. Please log in again.',
        isLoading: false,
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await recommendationRepository.getStudentRecommendations(studentId);
      console.log('Student recommendations response:', response);

      const payloads = pickPayloads(response);
      console.log(' Raw payloads:', payloads.length);

      const normalized = payloads
        .map(normalizeRecommendation)
        .filter((r): r is NormalizedRecommendation => !!r);
      const latestBySession = new Map<string, NormalizedRecommendation>();

      for (const rec of normalized) {
        const type = rec.sessionType ?? rec.Session?.sessionType ?? 'UNKNOWN';
        const year = rec.sessionYear ?? rec.Session?.sessionYear ?? 0;
        const key = `${type}-${year}`;

        const existing = latestBySession.get(key);
        const recTime = rec.sentAt ? new Date(rec.sentAt).getTime() : 0;
        const existingTime = existing?.sentAt
          ? new Date(existing.sentAt).getTime()
          : 0;

        // Keep the newest one
        if (!existing || recTime > existingTime) {
          latestBySession.set(key, rec);
        }
      }

      const deduped = Array.from(latestBySession.values());
      console.log('✅ Deduped sessions:', deduped.length);

      setState({
        recommendations: deduped,
        isLoading: false,
        error: deduped.length
          ? null
          : response?.message || 'No recommendations found for this student',
      });
    } catch (err: any) {
      console.error('💥 fetch error:', err);
      setState({
        recommendations: [],
        isLoading: false,
        error: err?.message || 'Unexpected error loading recommendations',
      });
    }
  }, [userProfile]);

  const clearRecommendations = useCallback(() => {
    setState({ recommendations: [], isLoading: false, error: null });
  }, []);

  // Group by session for the UI
  const groupedBySession = useMemo(() => {
    const map = new Map<
      string,
      {
        key: string;
        label: string;
        sessionType: string | null;
        sessionYear: number | null;
        records: NormalizedRecommendation[];
      }
    >();

    for (const rec of state.recommendations) {
      const type = rec.sessionType ?? rec.Session?.sessionType ?? 'UNKNOWN';
      const year = rec.sessionYear ?? rec.Session?.sessionYear ?? null;
      const key = `${type}-${year ?? 'NA'}`;
      const label = `${type} ${year ?? ''}`.trim();

      if (!map.has(key)) {
        map.set(key, { key, label, sessionType: type, sessionYear: year, records: [] });
      }
      map.get(key)!.records.push(rec);
    }

    return Array.from(map.values()).sort(
      (a, b) => (b.sessionYear ?? 0) - (a.sessionYear ?? 0)
    );
  }, [state.recommendations]);

  const allRecommendedCourses = useMemo(
    () => state.recommendations.flatMap(r => buildAllRecommendedCourses(r)),
    [state.recommendations]
  );

  return {
    recommendations: state.recommendations,
    groupedBySession,
    allRecommendedCourses,
    isLoading: state.isLoading,
    error: state.error,
    fetchStudentRecommendations,
    clearRecommendations,
  };
};