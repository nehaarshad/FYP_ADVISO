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
  fileType: string,
  additionalData?: Record<string, string>,
  options?: {
    allowedTypes?: string[];
    maxSizeMB?: number;
    fileTypeCategory?: 'video' | 'image' | 'document' | 'excel' | 'all';
  }
): Promise<ApiResponse<T>> {
  try {
    console.log('Uploading file to:', url);
    console.log('File name:', file.name, 'Field name:', fileType);
    console.log('File size:', (file.size / (1024 * 1024)).toFixed(2), 'MB');
    console.log('File type:', file.type);

    // Get file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const mimeType = file.type;

    // Define allowed types based on category
    const allowedTypesMap = {
      video: {
        extensions: ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv', 'wmv', '3gp', 'm4v'],
        mimeTypes: [
          'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 
          'video/x-msvideo', 'video/x-matroska', 'video/x-flv', 
          'video/x-ms-wmv', 'video/3gpp', 'video/3gpp2', 'video/mpeg',
          'video/mp2t', 'video/x-m4v'
        ],
        maxSizeMB: 500,
        errorMessage: 'Please upload a valid video file (MP4, WebM, MOV, AVI, MKV, etc.)'
      },
      image: {
        extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff', 'tif'],
        mimeTypes: [
          'image/jpeg', 'image/png', 'image/gif', 'image/webp', 
          'image/svg+xml', 'image/bmp', 'image/tiff', 'image/x-icon'
        ],
        maxSizeMB: 20,
        errorMessage: 'Please upload a valid image file (JPG, PNG, GIF, WebP, SVG, etc.)'
      },
      document: {
        extensions: ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'md'],
        mimeTypes: [
          'application/pdf', 'application/msword', 
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain', 'application/rtf', 'application/vnd.oasis.opendocument.text',
          'text/markdown'
        ],
        maxSizeMB: 50,
        errorMessage: 'Please upload a valid document file (PDF, DOC, DOCX, TXT, etc.)'
      },
      excel: {
        extensions: ['xls', 'xlsx', 'csv', 'xlsm'],
        mimeTypes: [
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/csv', 'application/vnd.ms-excel.sheet.macroEnabled.12'
        ],
        maxSizeMB: 50,
        errorMessage: 'Please upload a valid Excel file (.xls, .xlsx, or .csv)'
      },
      all: {
        extensions: ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv', 'wmv', '3gp', 'm4v',
                     'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff', 'tif',
                     'pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'md',
                     'xls', 'xlsx', 'csv', 'xlsm',
                     'zip', 'rar', '7z', 'tar', 'gz'],
        mimeTypes: [
          'video/*', 'image/*', 'application/pdf', 'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain', 'application/rtf', 'application/vnd.oasis.opendocument.text',
          'text/markdown', 'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/csv', 'application/zip', 'application/x-rar-compressed',
          'application/x-7z-compressed', 'application/x-tar', 'application/gzip'
        ],
        maxSizeMB: 200,
        errorMessage: 'Please upload a valid file'
      }
    };

    // Determine which rules to use
    const category = options?.fileTypeCategory || 'all';
    const rules = allowedTypesMap[category];
    
    // Check if custom allowed types are provided
    const customAllowedExtensions = options?.allowedTypes;
    const customMaxSize = options?.maxSizeMB;

    // Validate file extension
    const allowedExtensions = customAllowedExtensions || rules.extensions;
    if (!allowedExtensions.includes(fileExtension)) {
      return {
        success: false,
        error: `Invalid file type. ${rules.errorMessage}. Allowed: ${allowedExtensions.join(', ')}`
      };
    }

    // Validate mime type (for video and image, check both extension and mime type)
    const allowedMimeTypes = rules.mimeTypes;
    const isMimeTypeValid = allowedMimeTypes.some(type => {
      if (type.endsWith('/*')) {
        const prefix = type.replace('/*', '');
        return mimeType.startsWith(prefix);
      }
      return mimeType === type;
    });

    // For strict validation, check mime type as well (skip for 'all' category with wildcards)
    if (category !== 'all' && !isMimeTypeValid) {
      return {
        success: false,
        error: `Invalid file format. Expected: ${allowedMimeTypes.join(', ')}`
      };
    }

    // Validate file size
    const maxSizeMB = customMaxSize || rules.maxSizeMB;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        success: false,
        error: `File size exceeds ${maxSizeMB}MB limit. Current: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
      };
    }

    // Create form data
    const formData = new FormData();
    formData.append(fileType, file);

    // Append additional data
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    // Upload file
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary
    });

    const responseData = await response.json();

    if (response.ok) {
      return {
        success: true,
        data: responseData,
        status: response.status,
      };
    } else {
      throw new Error(responseData.message || responseData.error || 'File upload failed');
    }
  } catch (error: any) {
    console.error('File upload error:', error);
    return {
      success: false,
      error: error.message || 'File upload failed',
    };
  }
}

}