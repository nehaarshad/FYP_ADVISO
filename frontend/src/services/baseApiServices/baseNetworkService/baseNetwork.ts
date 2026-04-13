/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApiResponse } from "../ApiResponseType/apiResponseType";

export class BaseApiService {

  protected async postApiWithJson<T>(
    url: string,           
    data: any,          

  ): Promise<ApiResponse<T>> {
    try {
      console.log('Making POST request to:', url, 'with data:', data);
      const response = await fetch(url, {
        method: 'POST',        
        headers: {
          'Content-Type': 'application/json', 
        
        },
        body: JSON.stringify(data),  
      });

      const responseData = await response.json();

      if (response.ok) {
        return {
            success: true,
          data: responseData,      
          status: response.status, 
        };
      } else {
        if (response.status === 400) {
          throw new Error(responseData.message || 'Invalid input');
        } else if (response.status === 401) {
          throw new Error(responseData.message || 'Unauthorized');
        } else if (response.status === 404) {
          throw new Error(responseData.message || 'Resource not found');
        } else {
          throw new Error(responseData.message || 'Request failed');
        }
      }
    } catch (error: any) {
      console.error('API Error:', error);
      
      return {
        success: false,
        error: error.message || 'An error occurred',
      };
    }
  }

  // GET request method
  protected async getApiResponse<T>(
    url: string,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data, status: response.status };
      } else {
        throw new Error(data.message || 'Request failed');
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  protected async updateApiWithJson<T>(
    url: string,
    data: any,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        return { success: true, data: responseData, status: response.status };
      } else {
        throw new Error(responseData.message || 'Update failed');
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // DELETE request method
  protected async deleteApiResponse<T>(
    url: string,
    headers: Record<string, string> = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data, status: response.status };
      } else {
        throw new Error(data.message || 'Delete failed');
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // post Via Excel Sheet


}