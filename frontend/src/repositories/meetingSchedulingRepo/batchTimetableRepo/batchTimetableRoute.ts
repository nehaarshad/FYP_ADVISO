/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseApiService } from '../../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../../services/appApis/apiUrl';
import { ApiResponse } from '../../../services/baseApiServices/ApiResponseType/apiResponseType';
import { BatchTimetable } from '../../../models/batchTimetableModel';
import {
  AddBatchTimetablePayload,
  UpdateBatchTimetablePayload,
} from './types/type';

class BatchTimetableRepository extends BaseApiService {
  private static instance: BatchTimetableRepository;

  private constructor() {
    super();
  }

  static getInstance(): BatchTimetableRepository {
    if (!BatchTimetableRepository.instance) {
      BatchTimetableRepository.instance = new BatchTimetableRepository();
    }
    return BatchTimetableRepository.instance;
  }

  async addBatchTimetable(
    payload: AddBatchTimetablePayload
  ): Promise<ApiResponse<BatchTimetable[]>> {
    try {
      return await this.postApiWithJson<BatchTimetable[]>(
        AppApis.addBatchTimetable,
        payload
      );
    } catch (error) {
      console.error('addBatchTimetable error:', error);
      throw error;
    }
  }

  async updateBatchTimetable(
    payload: UpdateBatchTimetablePayload
  ): Promise<ApiResponse<BatchTimetable[]>> {
    try {
      return await this.updateApiWithJson<BatchTimetable[]>(
        AppApis.updateBatchTimetable,
        payload
      );
    } catch (error) {
      console.error('updateBatchTimetable error:', error);
      throw error;
    }
  }

  async deleteBatchTimetable(
    id: number,
    userId: number
  ): Promise<ApiResponse<{ deletedId: number }>> {
    try {
      const url = AppApis.deleteBatchTimetable
        .replace(':id', id.toString())
        .replace(':userId', userId.toString());

      return await this.deleteApiResponse<{ deletedId: number }>(url);
    } catch (error) {
      console.error('deleteBatchTimetable error:', error);
      throw error;
    }
  }

  async getBatchTimetable(
    userId: number
  ): Promise<ApiResponse<BatchTimetable[]>> {
    try {
      const url = AppApis.getBatchTimetable.replace(
        ':userId',
        userId.toString()
      );

      return await this.getApiResponse<BatchTimetable[]>(url);
    } catch (error) {
      console.error('getBatchTimetable error:', error);
      throw error;
    }
  }
}

export const batchTimetableRepository = BatchTimetableRepository.getInstance();