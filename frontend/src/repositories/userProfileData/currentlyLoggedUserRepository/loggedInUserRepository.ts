/* eslint-disable @typescript-eslint/no-explicit-any */
// src/repositories/userProfile/userProfileRepository.ts
import { BaseApiService } from '../../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../../services/appApis/apiUrl';
import { ApiResponse } from '../../../services/baseApiServices/ApiResponseType/apiResponseType';

export interface UserProfile {
  id: number;
  sapid: number;
  role: string;
  isActive: boolean;
  email?: string;
  name?: string;
  advisorName?: string;
  coordinatorName?: string;
  studentName?: string;
  contactNumber?: string;
  department?: string;
  gender?: string;
  profile?: any;
}

class UserProfileRepository extends BaseApiService {
  private static instance: UserProfileRepository;

  private constructor() {
    super();
  }

  static getInstance(): UserProfileRepository {
    if (!UserProfileRepository.instance) {
      UserProfileRepository.instance = new UserProfileRepository();
    }
    return UserProfileRepository.instance;
  }


  async getUserById(id: number): Promise<ApiResponse<any>> {
    try {
      const url = AppApis.getUserByIdUrl.replace(':id', id.toString());
      const response = await this.getApiResponse<any>(url);
      console.log("gET USER BY ID ", id, " is ",response)
      return response;
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  }
}

export const userProfileRepository = UserProfileRepository.getInstance();