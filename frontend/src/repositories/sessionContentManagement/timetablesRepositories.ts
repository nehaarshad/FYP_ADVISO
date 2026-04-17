/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseApiService } from '../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../services/appApis/apiUrl';
import { ApiResponse } from '../../services/baseApiServices/ApiResponseType/apiResponseType';
import { Timetable } from '@/src/models/timetableModel';
import { UploadTimetableData } from './types/uploadTimetable';


class TimetableRepository extends BaseApiService {
  private static instance: TimetableRepository;
  private timetablesCache: Timetable[] = [];
  private lastFetchTime: number = 0;
  private cacheDuration: number = 5 * 60 * 1000;

  private constructor() {
    super();
  }

  static getInstance(): TimetableRepository {
    if (!TimetableRepository.instance) {
      TimetableRepository.instance = new TimetableRepository();
    }
    return TimetableRepository.instance;
  }

  async uploadTimetable(data: UploadTimetableData): Promise<ApiResponse<any>> {
    try {
      const response = await this.postExcelFile(
        AppApis.uploadTimeTableUrl,
        data.file,
        'timetableFile',
        {
          sessionType: data.sessionType,
          sessionYear: data.sessionYear,
          programName: data.programName
        }
      );
      
      if (response.success) {
        this.clearCache();
      }
      
      return response;
    } catch (error) {
      console.error('Upload timetable error:', error);
      throw error;
    }
  }

  async getTimetables(forceRefresh: boolean = false): Promise<ApiResponse<Timetable[]>> {
    const now = Date.now();
    if (!forceRefresh && this.timetablesCache.length > 0 && (now - this.lastFetchTime) < this.cacheDuration) {
      console.log('Returning cached timetables');
      return { success: true, data: this.timetablesCache };
    }

    try {
      const response = await this.getApiResponse<any>(AppApis.getTimetableUrl);
      
      if (response.success && response.data) {
        let timetablesData: Timetable[] = [];
        if (Array.isArray(response.data)) {
          timetablesData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          timetablesData = response.data.data;
        } else {
          timetablesData = [];
        }
        
        this.timetablesCache = timetablesData;
        this.lastFetchTime = now;
        return { success: true, data: timetablesData };
      }
      return response;
    } catch (error) {
      console.error('Get timetables error:', error);
      throw error;
    }
  }

  getTimetablesBySession(timetables: Timetable[], sessionType: string, sessionYear: string): Timetable[] {
    return timetables.filter(t => 
      t.CourseOfferingModel?.SessionModel?.sessionType === sessionType && 
      t.CourseOfferingModel?.SessionModel?.sessionYear === parseInt(sessionYear)
    );
  }

  getTimetablesByProgram(timetables: Timetable[], programName: string): Timetable[] {
    return timetables.filter(t => 
      t.CourseOfferingModel?.ProgramModel?.programName === programName
    );
  }

  getTimetablesByBatch(timetables: Timetable[], batchName: string, batchYear: string): Timetable[] {
    return timetables.filter(t => 
      t.CourseOfferingModel?.BatchModel?.batchName === batchName && 
      t.CourseOfferingModel?.BatchModel?.batchYear === batchYear
    );
  }

  getTimetablesByDay(timetables: Timetable[], day: string): Timetable[] {
    return timetables.filter(t => t.day === day);
  }

  clearCache(): void {
    this.timetablesCache = [];
    this.lastFetchTime = 0;
  }
}

export const timetableRepository = TimetableRepository.getInstance();