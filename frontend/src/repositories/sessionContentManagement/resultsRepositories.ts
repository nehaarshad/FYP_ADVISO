/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseApiService } from '../../services/baseApiServices/baseNetworkService/baseNetwork';
import AppApis from '../../services/appApis/apiUrl';
import { ApiResponse } from '../../services/baseApiServices/ApiResponseType/apiResponseType';
import { UploadResultData } from './types/uploadResult';

class ResultsRepository extends BaseApiService {
  private static instance: ResultsRepository;

  private constructor() {
    super();
  }

  static getInstance(): ResultsRepository {
    if (!ResultsRepository.instance) {
      ResultsRepository.instance = new ResultsRepository();
    }
    return ResultsRepository.instance;
  }

  async uploadSessionalResult(data: UploadResultData): Promise<ApiResponse<any>> {
    try {
      const response = await this.postExcelFile(
        AppApis.uploadSessionalResultUrl,
        data.file,
        'resultFile',
        {
          sessionType: data.sessionType,
          sessionYear: data.sessionYear,
          programName: data.programName,
          batchName: data.batchName,
          batchYear: data.batchYear
        }
      );
      return response;
    } catch (error) {
      console.error('Upload result error:', error);
      throw error;
    }
  }
}

export const resultsRepository = ResultsRepository.getInstance();