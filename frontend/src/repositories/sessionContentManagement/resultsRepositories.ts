/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseApiService } from "@/src/services/baseApiServices/baseNetworkService/baseNetwork";
import { ApiResponse } from "@/src/services/baseApiServices/ApiResponseType/apiResponseType";
import APIs from "@/src/services/appApis/apiUrl"
import { UploadResultData } from "./types/uploadResult";

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
        APIs.uploadSessionalResultUrl,
        data.file,
        "resultFile",
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

export const resultRepository = ResultsRepository.getInstance();