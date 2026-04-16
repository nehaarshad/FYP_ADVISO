/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseApiService } from "@/src/services/baseApiServices/baseNetworkService/baseNetwork";
import { ApiResponse } from "@/src/services/baseApiServices/ApiResponseType/apiResponseType";
import APIs from "@/src/services/appApis/apiUrl"
import { UploadTimetableData } from "./types/uploadTimetable";

class TimetableRepository extends BaseApiService {
  private static instance: TimetableRepository;
  private timetablesCache: any[] = [];

  private constructor() {
    super();
  }

  static getInstance(): TimetableRepository {
    if (!TimetableRepository.instance) {
      TimetableRepository.instance = new TimetableRepository();
    }
    return TimetableRepository.instance;
  }

  // Timetable Methods
  async uploadTimetable(data: UploadTimetableData): Promise<ApiResponse<any>> {
    try {
      const response = await this.postExcelFile(
        APIs.uploadTimeTableUrl,
        data.file,
        "timetableFile",
        {
          sessionType: data.sessionType,
          sessionYear: data.sessionYear,
          programName: data.programName
        }
      );
      
      if (response.success) {
        this.timetablesCache = [];
      }
      
      return response;
    } catch (error) {
      console.error('Upload timetable error:', error);
      throw error;
    }
  }

  async getTimetables(forceRefresh: boolean = false): Promise<ApiResponse<any>> {
    const now = Date.now();
    if (!forceRefresh && this.timetablesCache.length > 0 ) {
      console.log('Returning cached timetables');
      return { success: true, data: this.timetablesCache };
    }

    try {
      const response = await this.getApiResponse(APIs.getTimetableUrl);
      if (response.success && response.data) {
        //this.timetablesCache = response.data.data || response.data;
      }
      return response;
    } catch (error) {
      console.error('Get timetables error:', error);
      throw error;
    }
  }


  clearCache(): void {
    this.timetablesCache = [];
  }
}

export const timetableRepository = TimetableRepository.getInstance();