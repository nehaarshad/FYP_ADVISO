/* eslint-disable @typescript-eslint/no-explicit-any */
// repositories/userManagement/UserManagementRepository.ts
import { BaseApiService } from '../../services/baseApiServices/baseNetworkService/baseNetwork';
import APIs from '../../services/appApis/apiUrl';
import { ApiResponse } from '../../services/baseApiServices/ApiResponseType/apiResponseType'
import { AddAdvisorData } from './types/addAdvisor';
import {UpdateAdvisorData} from './types/updateAdvisor'
import { AddStudentData } from './types/addStudent';
import { UpdateStudentData } from './types/updateStudents';
import { UpdateStudentStatusData } from './types/updateStudentStatus';
import { BulkUploadData } from './types/bulkStudentUploader';
import { BatchAdvisor } from '@/src/models/FacultyAdvisorModel';
import paramsUrl from '../../utilits/constructUrl/constructParamsUrl'

class UserManagementRepository extends BaseApiService {
  private static instance: UserManagementRepository;

  private constructor() {
    super();
  }

  static getInstance(): UserManagementRepository {
    if (!UserManagementRepository.instance) {
      UserManagementRepository.instance = new UserManagementRepository();
    }
    return UserManagementRepository.instance;
  }

  // Add Advisor
  async addAdvisor(data: AddAdvisorData): Promise<ApiResponse<BatchAdvisor>> {
    try {
         console.log("add advisor data ",data)
      const response = await this.postApiWithJson(
        APIs.addAdvisorUrl,
        data
      );
      console.log("Add advisor res ", response)
      if (response.success && response.data) {

              return response as ApiResponse<BatchAdvisor>;
            }
      
            throw new Error(response.error || 'Failed to add new batch advisor');
 
    } catch (error) {
      console.error('Add advisor error:', error);
      throw error;
    }
  }

  // Update Advisor
  async updateAdvisor(id: number, data: UpdateAdvisorData): Promise<ApiResponse<any>> {
    try {
        console.log("update advisor id ",id," data ",data)
      const url = paramsUrl(APIs.updateAdvisorUrl, { id: id.toString() });
       console.log("url ",url)
      const response = await this.updateApiWithJson(url, data);
      console.log("Update advisor res ",response)
      return response;
    } catch (error) {
      console.error('Update advisor error:', error);
      throw error;
    }
  }

  // Add Student
  async addStudent(data: AddStudentData): Promise<ApiResponse<any>> {
    try {
      const response = await this.postApiWithJson(
        APIs.addNewStudentUrl,
        data
      );
      console.log("Add student response ",response)
      return response;
    } catch (error) {
      console.error('Add student error:', error);
      throw error;
    }
  }

  // Update Student
  async updateStudent(id: number, data: UpdateStudentData): Promise<ApiResponse<any>> {
    try {
      const url = paramsUrl(APIs.updateStudentUrl, { id: id.toString() });
       console.log("update student id ",id," data ",data," url ",url)
      const response = await this.updateApiWithJson(url, data);
       console.log("update student res ",response)
      return response;
    } catch (error) {
      console.error('Update student error:', error);
      throw error;
    }
  }

  // Update Student Status
  async updateStudentStatus(data: UpdateStudentStatusData): Promise<ApiResponse<any>> {
    try {
      const response = await this.postApiWithJson(
        APIs.updateStudentStatusUrl,
        data
      );
      return response;
    } catch (error) {
      console.error('Update student status error:', error);
      throw error;
    }
  }

  async bulkUploadStudents(data: BulkUploadData): Promise<ApiResponse<any>> {
    try {
      const response = await this.postExcelFile(
        APIs.bulkStudentUploadUrl,
        data.file,
        "studentFile",
        {
          programName: data.programName,
          batchName: data.batchName,
          batchYear: data.batchYear
        }
      );
      return response;
    } catch (error) {
      console.error('Bulk upload error:', error);
      throw error;
    }
  }


}

export const userManagementRepository = UserManagementRepository.getInstance();