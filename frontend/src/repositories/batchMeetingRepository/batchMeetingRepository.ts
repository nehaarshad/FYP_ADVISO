/* eslint-disable @typescript-eslint/no-explicit-any */
import AppApis from '../../services/appApis/apiUrl';
import { BaseApiService } from '@/src/services/baseApiServices/baseNetworkService/baseNetwork';
import {
  CreateMeetingPayload,
  MeetingSuggestion,
  MeetingSuggestionsResponse,
  UpdateMeetingPayload,
} from './types/batchMeetingTypes';
import { ApiResponse } from '@/src/services/baseApiServices/ApiResponseType/apiResponseType';
import { BatchMeeting } from '@/src/models/batchMeetingModel';

class BatchMeetingRepository extends BaseApiService {
  private static instance: BatchMeetingRepository;

  private constructor() {
    super();
  }

  static getInstance(): BatchMeetingRepository {
    if (!BatchMeetingRepository.instance) {
      BatchMeetingRepository.instance = new BatchMeetingRepository();
    }
    return BatchMeetingRepository.instance;
  }

 async getSuggestions(
  userId: number
): Promise<ApiResponse<MeetingSuggestion[]>> {
  try {
    const url = AppApis.getMeetingSuggestions.replace(':userId', String(userId));
    const response = await this.getApiResponse<any>(url);

    // Backend sends { success: true, data: [ ...suggestions ] }
    const raw = response?.data;
    const list: MeetingSuggestion[] = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data)
      ? raw.data
      : [];

    return { ...response, data: list };
  } catch (error) {
    console.error('getSuggestions error:', error);
    throw error;
  }
}

  async createMeeting(
    payload: CreateMeetingPayload
  ): Promise<ApiResponse<BatchMeeting>> {
    try {
      const response = await this.postApiWithJson<any>(AppApis.createMeeting, payload);
      const raw = response?.data;
      const meeting: BatchMeeting | null = raw?.id ? raw : raw?.data?.id ? raw.data : null;
      return { ...response, data: meeting as any };
    } catch (error) {
      console.error('createMeeting error:', error);
      throw error;
    }
  }

  async updateMeeting(
    id: number,
    payload: UpdateMeetingPayload
  ): Promise<ApiResponse<BatchMeeting>> {
    try {
      const url = AppApis.updateMeeting.replace(':id', String(id));
      const response = await this.updateApiWithJson<any>(url, payload);
      const raw = response?.data;
      const meeting: BatchMeeting | null = raw?.id ? raw : raw?.data?.id ? raw.data : null;
      return { ...response, data: meeting as any };
    } catch (error) {
      console.error('updateMeeting error:', error);
      throw error;
    }
  }

  async getMeetingsForAdvisor(
    userId: number
  ): Promise<ApiResponse<BatchMeeting[]>> {
    try {
      const url = AppApis.getMeetingsForAdvisor.replace(':userId', String(userId));
      const response = await this.getApiResponse<any>(url);

      const raw = response?.data;
      const list: BatchMeeting[] = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
        ? raw.data
        : [];

      return { ...response, data: list };
    } catch (error) {
      console.error('getMeetingsForAdvisor error:', error);
      throw error;
    }
  }
}

export const batchMeetingRepository = BatchMeetingRepository.getInstance();