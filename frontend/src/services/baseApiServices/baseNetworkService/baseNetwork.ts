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


  protected async postExcelFile<T>(
  url: string,
  file: File,
  fileType:string,
  additionalData?: Record<string, string>
): Promise<ApiResponse<T>> {
  try {
    console.log('Uploading Excel file to:', url);
    console.log('File name:', file.name, 'Field name: ',fileType);

    
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !['xls', 'xlsx'].includes(fileExtension)) {
      return {
        success: false,
        error: 'Invalid file type. Please upload an Excel file (.xls or .xlsx)',
      };
    }

    const formData = new FormData();
    
    formData.append(fileType, file);
    
    // Append additional data
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const responseData = await response.json();

    if (response.ok) {
      return {
        success: true,
        data: responseData,
        status: response.status,
      };
    } else {
      throw new Error(responseData.message || responseData.error || 'Excel upload failed');
    }
  } catch (error: any) {
    console.error('Excel file upload error:', error);
    return {
      success: false,
      error: error.message || 'Excel file upload failed',
    };
  }
}

}