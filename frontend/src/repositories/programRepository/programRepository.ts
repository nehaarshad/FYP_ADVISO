import { BaseApiService } from '../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../services/appApis/apiUrl';
import { ApiResponse } from '../../services/baseApiServices/ApiResponseType/apiResponseType';
import { Program } from '@/src/models/programModel';
import { AddProgramData } from './types/addProgramData';



class ProgramRepository extends BaseApiService {
  private static instance: ProgramRepository;
  private programsCache: Program[] = [];
  private lastFetchTime: number = 0;
  private cacheDuration: number = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    super();
  }

  static getInstance(): ProgramRepository {
    if (!ProgramRepository.instance) {
      ProgramRepository.instance = new ProgramRepository();
    }
    return ProgramRepository.instance;
  }

  // Get all programs with caching
  async getAllPrograms(forceRefresh: boolean = false): Promise<ApiResponse<Program[]>> {
    const now = Date.now();
    if (!forceRefresh && this.programsCache.length > 0 && (now - this.lastFetchTime) < this.cacheDuration) {
      console.log('Returning cached programs', this.programsCache.length);
      return {
        success: true,
        data: this.programsCache,
        message: 'Programs retrieved from cache'
      };
    }

    try {
      const response = await this.getApiResponse<{ data: Program[], success: boolean }>(AppApis.getProgramsUrl);
      console.log('Get programs response:', response);
      
      if (response.success && response.data) {
        let programsData: Program[] = [];
        
        if (Array.isArray(response.data)) {
          programsData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          programsData = response.data.data;
        } else if (Array.isArray(response)) {
          programsData = response;
        } else {
          programsData = [];
        }
        
        this.programsCache = programsData;
        this.lastFetchTime = now;
        
        return {
          success: true,
          data: programsData,
          message: 'Programs retrieved successfully'
        };
      } else {
        throw new Error(response.error || 'Failed to fetch programs');
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch programs',
        data: []
      };
    }
  }

  // Add new program
  async addProgram(data: AddProgramData): Promise<ApiResponse<Program>> {
    try {
      console.log('Adding program:', data);
      const response = await this.postApiWithJson<{ message: string, success: boolean, data?: Program }>(
        AppApis.addProgram,
        data
      );
      
      console.log('Add program response:', response);
      
      if (response.success) {
        this.clearCache();
        
        let newProgram: Program | undefined = response.data?.data;
        
        if (!newProgram && response.data?.message) {
          // If the response doesn't include the program data, fetch all programs again
          const fetchResponse = await this.getAllPrograms(true);
          if (fetchResponse.success && fetchResponse.data) {
            newProgram = fetchResponse.data.find(p => p.programName === data.programName);
          }
        }
        
        return {
          success: true,
          data: newProgram,
          message: response.data?.message || 'Program added successfully'
        };
      } else {
        throw new Error(response.error || 'Failed to add program');
      }
    } catch (error) {
      console.error('Add program error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add program'
      };
    }
  }

  // Get program by name
  async getProgramByName(name: string): Promise<Program | undefined> {
    return this.programsCache.find(program => 
      program.programName.toLowerCase() === name.toLowerCase()
    );
  }

  // Clear cache
  clearCache(): void {
    this.programsCache = [];
    this.lastFetchTime = 0;
    console.log('Program cache cleared');
  }

  // Get cached programs without fetching
  getCachedPrograms(): Program[] {
    return this.programsCache;
  }
}

export const programRepository = ProgramRepository.getInstance();