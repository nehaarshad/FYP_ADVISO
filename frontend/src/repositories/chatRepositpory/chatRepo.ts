import { BaseApiService } from "@/src/services/baseApiServices/baseNetworkService/baseNetwork";
import APIs from "../../services/appApis/apiUrl";
import { ApiResponse, UploadedChatFile } from "@/src/services/baseApiServices/ApiResponseType/apiResponseType";

class ChatRepository extends BaseApiService {
  async uploadFile(file: File) {

    const response = await this.postExcelFile(APIs.chatUploadUrl,file,"chatfile")

    if (!response.success) {
      throw new Error(
        response?.message || response?.error || "File upload failed"
      );
    }

    console.log("response ", response.data)
    const data = response.data

    return data as ApiResponse;
  }

}

export const chatRepository = new ChatRepository();