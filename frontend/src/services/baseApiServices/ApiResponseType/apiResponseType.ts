/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ApiResponse<T = any> {
  success: boolean;   
  data?: T;         
  file?: UploadedChatFile;  
  error?: string;    
  message?: string;  
  status?: number;    
}

export interface UploadedChatFile {
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
}
