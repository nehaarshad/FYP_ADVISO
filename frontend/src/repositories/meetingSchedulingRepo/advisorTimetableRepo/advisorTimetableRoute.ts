/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseApiService } from '../../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../../services/appApis/apiUrl';
import { ApiResponse } from '../../../services/baseApiServices/ApiResponseType/apiResponseType';
import { AdvisorTimetable } from '../../../models/advisorTimetableModel';
import {
  AddAdvisorTimetablePayload,
  UpdateAdvisorTimetablePayload,
} from './types/type';

class AdvisorTimetableRepository extends BaseApiService {
  private static instance: AdvisorTimetableRepository;

  private constructor() {
    super();
  }

  static getInstance(): AdvisorTimetableRepository {
    if (!AdvisorTimetableRepository.instance) {
      AdvisorTimetableRepository.instance = new AdvisorTimetableRepository();
    }
    return AdvisorTimetableRepository.instance;
  }

  async addAdvisorTimetable(
    payload: AddAdvisorTimetablePayload
  ): Promise<ApiResponse<AdvisorTimetable[]>> {
    try {
      return await this.postApiWithJson<AdvisorTimetable[]>(
        AppApis.addAdvisorTimetable,
        payload
      );
    } catch (error) {
      console.error('addAdvisorTimetable error:', error);
      throw error;
    }
  }

  async updateAdvisorTimetable(
    payload: UpdateAdvisorTimetablePayload
  ): Promise<ApiResponse<AdvisorTimetable[]>> {
    try {
      return await this.updateApiWithJson<AdvisorTimetable[]>(
        AppApis.updateAdvisorTimetable,
        payload
      );
    } catch (error) {
      console.error('updateAdvisorTimetable error:', error);
      throw error;
    }
  }

  async deleteAdvisorTimetable(
    id: number,
    userId: number
  ): Promise<ApiResponse<{ deletedId: number }>> {
    try {
      const url = AppApis.deleteAdvisorTimetable
        .replace(':id', id.toString())
        .replace(':userId', userId.toString());

      return await this.deleteApiResponse<{ deletedId: number }>(url);
    } catch (error) {
      console.error('deleteAdvisorTimetable error:', error);
      throw error;
    }
  }

  async getAdvisorTimetable(
    userId: number
  ): Promise<ApiResponse<AdvisorTimetable[]>> {
    try {
      const url = AppApis.getAdvisorTimetable.replace(
        ':userId',
        userId.toString()
      );

      return await this.getApiResponse<AdvisorTimetable[]>(url);
    } catch (error) {
      console.error('getAdvisorTimetable error:', error);
      throw error;
    }
  }
}

export const advisorTimetableRepository = AdvisorTimetableRepository.getInstance();