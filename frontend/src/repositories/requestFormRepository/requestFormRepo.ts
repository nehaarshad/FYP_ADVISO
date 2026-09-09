/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseApiService } from '../../services/baseApiServices/baseNetworkService/baseNetwork';
import APIs from '../../services/appApis/apiUrl';
import { ApiResponse } from '../../services/baseApiServices/ApiResponseType/apiResponseType'
import paramsUrl from '../../utilits/constructUrl/constructParamsUrl'
import { RequestForm } from '@/src/models/RequestFormTypeModel';

class RequestFormRepository extends BaseApiService {
  private static instance: RequestFormRepository;

  private constructor() {
    super();
  }

  static getInstance(): RequestFormRepository {
    if (!RequestFormRepository.instance) {
      RequestFormRepository.instance = new RequestFormRepository();
    }
    return RequestFormRepository.instance;
  }

  async createRequestForm(data: RequestForm): Promise<ApiResponse<RequestForm>> {
    try {
         console.log("add request form data ",data)

            const response = await this.postApiWithJson(
                APIs.createRequestFormUrl,
                data
            );

      console.log("Add request form res ", response)
      if (response.success && response.data) {

              return response as ApiResponse<RequestForm>;
            }
      
            throw new Error(response.error || 'Failed to add new batch advisor');
 
    } catch (error) {
      console.error('Add request form error:', error);
      throw error;
    }
  }

  // Update Request Form
  async updateRequestForm(id: number, data: RequestForm): Promise<ApiResponse<RequestForm>> {
    try {
        console.log("update request form id ",id," data ",data)
      const url = paramsUrl(APIs.updateRequestFormUrl, { id: id.toString() });
       console.log("url ",url)
      const response = await this.updateApiWithJson(url, data);
      console.log("Update request form res ",response)
      return response as ApiResponse<RequestForm>;
    } catch (error) {
      console.error('Update request form error:', error);
      throw error;
    }
  }

  async getAllRequestForms(): Promise<ApiResponse<RequestForm[]>> {
    try {
      const response = await this.getApiResponse(APIs.getAllRequestFormUrl);
      return response as ApiResponse<RequestForm[]>;
    } catch (error) {
      console.error('Get all request forms error:', error);
      throw error;
    }
}



}

export const requestFormRepository = RequestFormRepository.getInstance();