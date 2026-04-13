/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ApiResponse<T = any> {
  success: boolean;   
  data?: T;           
  error?: string;    
  message?: string;  
  status?: number;    
}